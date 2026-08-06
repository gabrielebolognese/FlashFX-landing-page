/*
 * The central FAQ. Consumed by FAQExplorer and mapped into FAQPage schema in
 * app/faq/page.tsx — the schema derives from this array, so the two cannot
 * desync.
 *
 * Two rules when adding questions:
 *
 * 1. Every answer must be traceable to something the product actually does.
 *    The existing entries come from PricingSection.tsx, editorFeatures.ts, and
 *    animationPresets.ts. If you cannot point at a source, do not add it.
 *
 * 2. Do not copy questions that already carry FAQPage schema on another page —
 *    the four landing pages and the homepage each emit their own. Duplicating a
 *    Q&A across two URLs duplicates the structured data with it.
 *
 * CATEGORIES is ordered; the explorer renders groups in this order. Adding a
 * category here is all that is needed to make it appear.
 */
export const CATEGORIES = [
  'Getting started',
  'Features',
  'Export',
  'Plans & billing',
  'Projects & data',
] as const;

export type FaqCategory = (typeof CATEGORIES)[number];

export interface FaqEntry {
  category: FaqCategory;
  question: string;
  answer: string;
}

export const faqData: FaqEntry[] = [
  {
    category: 'Getting started',
    question: 'Do I need to install anything?',
    answer:
      'No. FlashFX runs entirely in a browser tab. There is no installer, no plugin, and nothing to keep updated — when we ship a change, you have it the next time you load the editor. If you want it in its own window rather than a tab, any Chromium browser can install the page as an app.',
  },
  {
    category: 'Getting started',
    question: 'Which browsers work?',
    answer:
      'Any current version of Chrome, Edge, Brave, Opera, Safari, or Firefox. Chromium-based browsers get the smoothest experience because the editor leans on WebGL for rendering, and they also let you install the editor as a standalone app window.',
  },
  {
    category: 'Getting started',
    question: 'Will it run on a low-end laptop?',
    answer:
      'It is built for that case. Rendering happens in the browser using WebGL rather than requiring a dedicated GPU and a large local install, which is why it works on Chromebooks and older laptops where a desktop motion graphics suite would struggle to install at all.',
  },
  {
    category: 'Getting started',
    question: 'How long does it take to make something usable?',
    answer:
      'Minutes, if you start from a preset. FlashFX ships 90 animation presets across 17 families — apply one to an element and it generates real keyframes you can then reshape, so you are editing motion rather than building it from nothing.',
  },
  {
    category: 'Features',
    question: 'What can I actually animate?',
    answer:
      'Position, scale, rotation, opacity, colour, effects, filters, materials, and more — 39 editable properties, over 50 of them animatable, each with per-keyframe bezier handles and 16 easing functions. Text can animate by character, word, line, or whole object.',
  },
  {
    category: 'Features',
    question: 'Can I import my own footage, audio, and fonts?',
    answer:
      'Yes to all three. Video imports with GPU-accelerated playback and can be trimmed, transformed, and filtered on the timeline. Audio runs on unlimited tracks with waveform display, per-clip volume, and fades. Custom fonts load into the text system and can be mixed per segment within a single text object.',
  },
  {
    category: 'Features',
    question: 'Does FlashFX do 3D?',
    answer:
      'Yes. The free tier includes 3D primitives that animate on the same timeline as everything else. Full 3D — all primitives, PBR and toon materials, HDRI lighting, and model import for GLB, OBJ, FBX, and STL — is part of the Ultra plan.',
  },
  {
    category: 'Features',
    question: 'Is there anything AI-powered?',
    answer:
      'On paid plans. Ultra includes AI credits, AI motion graphics, an AI assistant, image search and generation, a background remover, and a sound generator. The free tier is a complete manual editor with no AI features.',
  },
  {
    category: 'Export',
    question: 'What formats can I export?',
    answer:
      'MP4 with H.264, WebM with VP8 or VP9, animated GIF, SVG, and PNG sequences. MP4 is the right default for YouTube and most social platforms. PNG sequence is what you want when an element needs compositing into an edit you are finishing elsewhere.',
  },
  {
    category: 'Export',
    question: 'Is there a watermark on the free tier?',
    answer:
      'No. Free tier exports are clean — no watermark, no branded intro or outro, no overlay. What you build is what renders.',
  },
  {
    category: 'Export',
    question: 'Can I export with a transparent background?',
    answer:
      'Yes, using PNG sequence export, which preserves transparency across every frame. That is the standard way to move an animated element into another editor without a matte.',
  },
  {
    category: 'Export',
    question: 'Can I control resolution and frame rate?',
    answer:
      'Yes. Canvas size is typed in rather than picked from a fixed list, so 1920x1080, 1080x1920 for vertical, or any other dimensions all work. Frame rate has common presets, and export offers quality presets or manual control with real-time progress.',
  },
  {
    category: 'Plans & billing',
    question: 'Is the free tier really free?',
    answer:
      'Yes, and it is not a timed trial. The free tier includes unlimited projects, the full editor, the keyframe system, custom fonts, 3D primitives, 30-day version history, and exports with no watermark. There is no countdown and no expiry.',
  },
  {
    category: 'Plans & billing',
    question: 'What do the paid plans cost?',
    answer:
      'Ultra is $29 per month, or $278 billed annually, and adds AI features, full 3D with model import, 20 GB of cloud storage, priority support, and 90-day version history. Teams is $39 per seat per month, or $374 per seat billed annually, and adds a team workspace, real-time collaboration, shared assets, role management, and comments.',
  },
  {
    category: 'Plans & billing',
    question: 'Can I get a refund?',
    answer:
      'Refunds are covered by our refund policy, which sets out when one applies and how to request it. The free tier costs nothing, so this only ever concerns Ultra and Teams subscriptions.',
  },
  {
    category: 'Projects & data',
    question: 'Where are my projects stored?',
    answer:
      'In cloud storage tied to your account, so a project opens on any machine you sign in from rather than living on one hard drive. The free tier includes 500 MB; Ultra and Teams include 20 GB.',
  },
  {
    category: 'Projects & data',
    question: 'Can I recover an earlier version of a project?',
    answer:
      'Yes. Version history covers the last 30 days on the free tier and the last 90 days on Ultra and Teams. The editor also keeps unlimited undo and redo within a session, and auto-backup runs in the background.',
  },
  {
    category: 'Projects & data',
    question: 'What do you do with my data?',
    answer:
      'The full detail is in our privacy policy, which covers what is collected, why, how long it is kept, and how to ask for it to be deleted.',
  },
];
