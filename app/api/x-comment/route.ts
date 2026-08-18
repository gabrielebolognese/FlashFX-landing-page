import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

/*
 * The X comment assistant's server half.
 *
 * ── Why this file exists at all ─────────────────────────────────────────────
 *
 * The key never reaches the browser. A route handler is not "a whole backend":
 * it is one file that runs inside the dev server already being run, and it is
 * the only place in a Next app where a secret can live without shipping to the
 * client. `NEXT_PUBLIC_` anything, or a key hardcoded in a component, ends up in
 * a JavaScript chunk that any visitor to flashfx.app can read.
 *
 * ── Why it 404s in production ───────────────────────────────────────────────
 *
 * This repo auto-deploys to Netlify from `main`. A route handler that proxies
 * an API key with no auth in front of it is a public endpoint that spends that
 * key — anyone who finds `/api/x-comment` can run it. The tool is for one person
 * on one machine, so it simply does not exist in a production build.
 *
 * That is belt and braces rather than the only defence: the key lives in
 * `.env.local`, which is gitignored, so Netlify has never seen it and the
 * deployed route would fail anyway. The gate makes the intent explicit instead
 * of relying on a secret's absence.
 */

/** Dev only. See the note above before removing this. */
const ENABLED = process.env.NODE_ENV !== 'production';

/*
 * Adaptive thinking at low effort rather than `thinking: { type: 'disabled' }`.
 * Disabling it is the more expensive lever in every sense: low effort already
 * gets most of the token saving, and disabled thinking on Opus 5 can leak
 * `<thinking>` tags into the visible response. Drafting a short reply does not
 * need deep reasoning, so `low` is the right level.
 */
const MODEL = 'claude-opus-5';
const EFFORT = 'low' as const;
/* Caps thinking *and* response text together on Opus 5, so it cannot be sized
   to the reply alone or the answer truncates mid-sentence. */
const MAX_TOKENS = 4000;

const SYSTEM = `You draft replies to posts on X.

Write one reply and nothing else: no preamble, no options, no explanation of your
choice, no surrounding quotation marks. The reply is pasted straight into the
box, so whatever you return is what gets posted.

Keep it under 280 characters. Match the register of the post you are replying to.
Add something — a point, a question, a specific observation — rather than
agreeing with it at length. No hashtags unless the post uses them, and no emoji
unless the post uses them.

If the post is asking a question you can answer, answer it.`;

export async function POST(request: Request) {
  if (!ENABLED) {
    return new NextResponse('Not found', { status: 404 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not set. Put it in .env.local and restart `npm run dev`.' },
      { status: 500 }
    );
  }

  let post: unknown;
  try {
    ({ post } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body.' }, { status: 400 });
  }

  if (typeof post !== 'string' || post.trim().length === 0) {
    return NextResponse.json({ error: 'Nothing to reply to — paste a post first.' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM,
      output_config: { effort: EFFORT },
      messages: [{ role: 'user', content: post }],
    });

    /*
     * `content` is a union and the array can hold thinking blocks as well as
     * text, so it is filtered rather than indexed at [0] — on this model the
     * first block is frequently not the text one.
     */
    const comment = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();

    if (message.stop_reason === 'refusal') {
      return NextResponse.json({ error: 'Claude declined to draft a reply to that post.' }, { status: 422 });
    }

    return NextResponse.json({ comment, stopReason: message.stop_reason });
  } catch (error) {
    // Typed classes rather than string-matching the message, so the cases stay
    // distinguishable: a bad key is not a rate limit is not a dropped network.
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'The API key was rejected. Check ANTHROPIC_API_KEY.' }, { status: 401 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'Rate limited or out of credit. Try again shortly.' }, { status: 429 });
    }
    if (error instanceof Anthropic.APIConnectionError) {
      return NextResponse.json({ error: 'Could not reach the API.' }, { status: 502 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `API error ${error.status}: ${error.message}` }, { status: 502 });
    }
    throw error;
  }
}
