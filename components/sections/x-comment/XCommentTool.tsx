'use client';

import { useState } from 'react';
import { ClipboardPaste, Copy, Loader2, Send } from 'lucide-react';

/*
 * The X comment assistant, client half.
 *
 * Deliberately plain. It is one person's internal tool, not a product surface:
 * no animation, no ambient motion, no governor slot, nothing from the marketing
 * side of this repo beyond the colour tokens.
 *
 * The key is not here and cannot be. Everything this component knows how to do
 * is POST to `/api/x-comment`, which holds the key server-side — read the note
 * in that route before moving the call into the browser.
 */

type State = 'idle' | 'working' | 'done' | 'failed';

export function XCommentTool() {
  const [post, setPost] = useState('');
  const [comment, setComment] = useState('');
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  /*
   * `readText()` needs a user gesture and a secure context. localhost counts as
   * secure, so this works in dev — but Firefox has no support for it outside an
   * extension, hence a stated failure rather than a silent no-op.
   */
  const pasteFromClipboard = async () => {
    setError('');
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setError('The clipboard is empty.');
        return;
      }
      setPost(text);
    } catch {
      setError('Could not read the clipboard. Paste into the box with Ctrl+V instead.');
    }
  };

  const send = async () => {
    if (!post.trim() || state === 'working') return;
    setState('working');
    setError('');
    setComment('');
    setCopied(false);

    try {
      const response = await fetch('/api/x-comment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ post }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? `Request failed (${response.status}).`);
        setState('failed');
        return;
      }

      setComment(data.comment);
      setState('done');
    } catch {
      setError('Could not reach the dev server.');
      setState('failed');
    }
  };

  const copyComment = async () => {
    await navigator.clipboard.writeText(comment);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="min-h-screen w-full px-6 py-16" style={{ background: '#0b1020' }}>
      <div className="mx-auto w-full max-w-2xl">
        <h1
          className="text-3xl sm:text-4xl text-white"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: '-0.03em' }}
        >
          X comment assistant
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-fx-text-secondary/60">
          local only &nbsp;&middot;&nbsp; not part of the site
        </p>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={pasteFromClipboard}
            className="inline-flex items-center gap-2 rounded-lg border border-fx-border bg-white/[0.04] px-4 py-2.5 text-sm text-fx-text-primary transition-colors hover:border-fx-accent-yellow/50 hover:bg-fx-accent-yellow/10"
          >
            <ClipboardPaste className="h-4 w-4" />
            Paste post
          </button>

          <button
            type="button"
            onClick={send}
            disabled={!post.trim() || state === 'working'}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[#0b1020] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: '#f5c842' }}
          >
            {state === 'working' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {state === 'working' ? 'Writing' : 'Send'}
          </button>
        </div>

        <textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="The post to reply to. Use the paste button, or type here."
          rows={7}
          className="mt-4 w-full resize-y rounded-lg border border-fx-border bg-black/25 p-4 text-sm leading-relaxed text-fx-text-primary outline-none placeholder:text-fx-text-secondary/40 focus:border-fx-accent-yellow/50"
        />

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        {comment && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-fx-accent-yellow/80">
                reply &nbsp;&middot;&nbsp; {comment.length} characters
              </span>
              <button
                type="button"
                onClick={copyComment}
                className="inline-flex items-center gap-1.5 rounded-md border border-fx-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-fx-text-secondary transition-colors hover:border-fx-accent-yellow/50 hover:text-fx-accent-yellow"
              >
                <Copy className="h-3 w-3" />
                {copied ? 'copied' : 'copy'}
              </button>
            </div>
            {/* Editable, because the draft is a starting point and retyping it
                somewhere else to change one word is the wrong shape. */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="mt-2 w-full resize-y rounded-lg border border-fx-accent-yellow/30 bg-black/25 p-4 text-sm leading-relaxed text-white outline-none focus:border-fx-accent-yellow/60"
            />
          </div>
        )}
      </div>
    </main>
  );
}
