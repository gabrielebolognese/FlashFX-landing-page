/*
 * Consumed twice: rendered by YTFAQSection and mapped into the FAQPage schema
 * in app/motion-graphics-software-for-youtube/page.tsx. The schema derives from
 * this array rather than restating it, so the two cannot desync — keep it that
 * way if you edit either side.
 *
 * Every claim here is one the site already makes elsewhere (PricingSection,
 * editorFeatures.ts, PricingComparison). Nothing about YouTube itself, and no
 * competitor claims — that is what keeps this page safe to publish.
 */
export const ytFaqData = [
  {
    question: 'Can I make a YouTube intro without installing anything?',
    answer:
      'Yes. FlashFX runs entirely in a browser tab. There is no download, no installer, and no plugin. You open the editor, build the intro, and export the file. That also means the machine you edit on does not matter much: the same project opens on a laptop, a desktop, or a borrowed computer, because the project lives in your account rather than on one hard drive.',
  },
  {
    question: 'Will my exports have a watermark on the free tier?',
    answer:
      'No. Exports from the free tier are clean, no watermark, no branded intro or outro, no overlay. What you build is what renders. This matters more for YouTube than for most platforms, because a watermarked intro on every video reads as amateur to viewers and is impossible to remove after the fact.',
  },
  {
    question: 'Can I make both YouTube Shorts and long-form video in the same tool?',
    answer:
      'Yes. Canvas size is not locked to presets, so you can work at 1920x1080 for a standard upload and 1080x1920 for Shorts without switching applications or rebuilding the project from scratch. Frame rate is set per project with common presets available, so a 60fps gaming intro and a 24fps cinematic title sequence are both straightforward.',
  },
  {
    question: 'What formats can I export for YouTube?',
    answer:
      'MP4 with H.264 encoding is the default and the safest choice for YouTube. FlashFX also exports WebM using VP8 or VP9, animated GIF, SVG, and PNG sequences with transparency preserved: the last of these is what you want when an element needs compositing into footage you have edited elsewhere. Resolution and frame rate are both adjustable, with quality presets or manual control.',
  },
  {
    question: 'Can I use my own fonts, footage, and music?',
    answer:
      'Yes to all three. Custom fonts can be loaded and styled per text segment, with different fonts, weights, sizes, and colours inside a single text object. Video imports with GPU-accelerated playback and can be trimmed, transformed, and filtered on the timeline. Audio runs on unlimited tracks with waveform display, per-clip volume, and fade in and out, so a title can be cut precisely against a beat.',
  },
  {
    question: 'How much of a YouTube intro can I build from presets?',
    answer:
      'Most of it. FlashFX ships 90 animation presets across 17 families, including dedicated sets for text reveals, text emphasis, position and movement, rotation, scale, and attention-grabbing shakes. A preset is applied to an element and generates real keyframes you can then edit. Nothing is locked, so a preset is a starting point rather than a fixed template you have to accept as-is.',
  },
];
