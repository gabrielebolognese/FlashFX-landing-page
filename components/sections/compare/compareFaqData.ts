/*
 * Answers here stay inside [ARCH] and [SPEC] territory — architecture and
 * published specifications. No performance claims, measured or predicted. See
 * the header of comparisonData.ts for why that line exists and where it came
 * from.
 */
export const compareFaqData = [
  {
    question: 'Is FlashFX faster than CapCut or DaVinci Resolve?',
    answer:
      'We have not published figures, because we have not measured them to a standard worth publishing. What we can say from architecture: on straight cuts and long 4K timelines, a native application with direct access to the hardware encoder has a structural advantage over a browser tab, and we would expect to lose there. On synthetic work — text, shapes, gradients and particles with no source video to decode — that advantage largely disappears, because the browser tax is mostly in the decode path. When we have run the tests properly, the results will go on this page including the ones we lose.',
  },
  {
    question: 'Can FlashFX replace DaVinci Resolve?',
    answer:
      'For colour grading, camera RAW, long-form editing or audio post, no, and it is not trying to. Resolve has a 32-bit float colour pipeline, ACES and HDR support, professional codec handling and a full digital audio workstation. FlashFX is a motion graphics tool. If your work is kinetic type, logo animation or social motion design, the comparison is worth making. If it is grading a feature film, it is not.',
  },
  {
    question: 'Can FlashFX replace CapCut?',
    answer:
      'For cut-caption-publish short-form work, CapCut is purpose-built and has templates, auto-captions, a stock library, offline use and a phone app. FlashFX has none of those. What FlashFX has that CapCut does not is a compositing model — a keyframe graph with bezier velocity curves, masks, nested compositions, blend modes and per-character text animation. They overlap less than the category name suggests.',
  },
  {
    question: 'What hardware do I need for each?',
    answer:
      'FlashFX needs a current browser and nothing else — no installer, no dedicated GPU. CapCut publishes 8 GB of RAM as adequate for typical short-form editing, with 16 GB recommended for 4K or effects-heavy projects. DaVinci Resolve 20 lists a Windows minimum of 16 GB system memory, rising to 32 GB when Fusion is in use, plus a GPU with at least 4 GB of VRAM. Practical 4K work in Resolve sits well above its stated minimum.',
  },
  {
    question: 'What formats can each one handle?',
    answer:
      'Resolve is in a different class here: BRAW, R3D, ProRes, DNxHR, 10-bit and 12-bit, EXR sequences. FlashFX is bounded by what the browser supports, which in practice means H.264 and VP9 as the reliable baseline. Hardware HEVC decode exists on macOS and Windows but is missing from most Linux builds without proprietary drivers, and AV1 hardware decode is limited to recent Intel, AMD and Apple silicon. ProRes decode in the browser is effectively unavailable.',
  },
  {
    question: 'Why compare all three on one page instead of separately?',
    answer:
      'Because the honest answer to "which is better" is that they are built for different jobs, and separate pages would invite three head-to-head verdicts where none is warranted. Seeing the three architectures next to each other makes the trade-offs legible in a way a two-way comparison hides.',
  },
];
