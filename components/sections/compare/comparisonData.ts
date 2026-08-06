/*
 * Source: the internal "FlashFX vs CapCut vs DaVinci Resolve" benchmark
 * framework, v0.1, August 2026.
 *
 * THE RULE THIS FILE EXISTS TO ENFORCE
 *
 * That document tags every claim [ARCH], [PRED] or [SPEC]:
 *   [ARCH] structural fact about how the pipeline works — verifiable
 *   [SPEC] published vendor specification — verifiable
 *   [PRED] predicted performance band derived from architecture — NOT measured
 *
 * Only [ARCH] and [SPEC] appear here. Every [PRED] row — all the RTR figures,
 * fps bands, seek latencies and time-to-result estimates in sections 4.1 and
 * 5.1 — is deliberately absent, because section 0 of that document says
 * publishing predicted numbers as measured numbers "is the one mistake that
 * ends a benchmarking publication's credibility permanently", and section 7
 * says do not publish any FlashFX number that has not been measured.
 *
 * DO NOT ADD PERFORMANCE NUMBERS TO THIS FILE until they have been measured per
 * the suite in section 3: three runs, median reported, one machine, cold GPU,
 * thermals settled. When that happens, add them with the method stated on the
 * page alongside them.
 *
 * There is also a legal reason. Comparative advertising naming a competitor
 * must be objective and verifiable under EU rules, and FlashFX operates from
 * Italy. Architecture and published specs clear that bar. Predictions do not.
 */

export interface Pipeline {
  product: string;
  kind: string;
  stages: string[];
  consequences: string[];
}

/** [ARCH] — how each product actually renders. Verifiable by inspection. */
export const pipelines: Pipeline[] = [
  {
    product: 'FlashFX',
    kind: 'Browser, client-side',
    stages: [
      'File.slice byte source',
      'Streaming demuxer',
      'WebCodecs decode, one worker per asset',
      'WebGPU texture upload',
      'WebGPU render graph',
      'WebCodecs encode and mux',
    ],
    consequences: [
      'Compute runs at native speed once frames are on the GPU — WebGPU compute shaders are not emulated.',
      'Codec work goes through the browser media stack, which does reach hardware encoders and decoders.',
      'Format support is whatever the browser supports, not what we support. That is the hard ceiling.',
      'Memory is bounded by tab and GPU process limits rather than by installed RAM.',
    ],
  },
  {
    product: 'CapCut',
    kind: 'Native desktop, plus mobile and web',
    stages: [
      'Direct OS media framework access',
      'Media Foundation, VideoToolbox, NVENC, QuickSync',
      'Fixed-function effect stack',
      'Template-oriented composition',
    ],
    consequences: [
      'No sandbox between the app and the hardware encoder.',
      'Effects are a fixed list rather than a general compositing graph.',
      'Capability differs across desktop, mobile and web — they are not the same product.',
    ],
  },
  {
    product: 'DaVinci Resolve',
    kind: 'Native desktop, professional',
    stages: [
      'Full native GPU pipeline',
      'CUDA, Metal or OpenCL',
      '32-bit float internal processing',
      'Fusion node compositor, Fairlight DAW',
    ],
    consequences: [
      'Hardware decode for professional and camera RAW formats.',
      'Node-based compositing rather than a layer-and-timeline model.',
      'A genuine colour pipeline built by a company that also makes cameras.',
    ],
  },
];

export interface HardwareSpec {
  product: string;
  floor: string;
  detail: string;
  source: string;
}

/** [SPEC] — published vendor requirements. The most verifiable rows on the page. */
export const hardwareFloor: HardwareSpec[] = [
  {
    product: 'FlashFX',
    floor: 'A current browser',
    detail:
      'Runs in a tab. No installer, no driver requirement, no dedicated GPU. Works on integrated graphics, Chromebooks and locked-down machines where the other two cannot be installed at all.',
    source: 'Architecture',
  },
  {
    product: 'CapCut',
    floor: '8 GB RAM',
    detail:
      '8 GB is adequate for typical short-form editing; 16 GB is recommended for 4K source or effects-heavy multi-layer projects. Modest by design — it targets fast accessible editing rather than deep grading or compositing.',
    source: 'Published system requirements',
  },
  {
    product: 'DaVinci Resolve 20',
    floor: '16 GB RAM, 4 GB VRAM',
    detail:
      'Windows minimum is 16 GB system memory, rising to 32 GB when Fusion is in use, with a GPU of at least 4 GB VRAM and OpenCL 1.2 or CUDA 12.8. Practical 4K work sits far above the minimum — roughly 24 GB VRAM, 64 GB RAM and a dedicated NVMe cache.',
    source: 'Blackmagic Design published requirements',
  },
];

export const CAPABILITY_GROUPS = [
  'Design & vector',
  'Animation',
  'Compositing',
  'Collaboration',
  'Media & output',
  'Platform',
] as const;

export type CapabilityGroup = (typeof CAPABILITY_GROUPS)[number];

export interface CapabilityRow {
  group: CapabilityGroup;
  capability: string;
  flashfx: boolean;
  capcut: boolean;
  resolve: boolean;
  note?: string;
}

/*
 * [ARCH] capability presence, not performance.
 *
 * TWO RULES FOR EDITING THIS TABLE
 *
 * 1. A FlashFX `true` must be traceable. Nearly all of these come from
 *    components/sections/feature-highlights/editorFeatures.ts or
 *    editableProperties.ts, or from the plan tiers in PricingSection.tsx.
 *    Rows marked "owner-confirmed" below were asserted directly by the founder
 *    on 2026-08-06 and are not yet reflected in that feature data — if they get
 *    added there, drop the marker.
 *
 * 2. When unsure whether a competitor has something, mark them as HAVING it.
 *    Understating our own advantage costs a little persuasion. Overstating it
 *    on a page that names CapCut and DaVinci Resolve is a comparative
 *    advertising claim, and under EU rules those must be objective and
 *    verifiable. Asymmetric risk, so bias one way deliberately.
 */
export const capabilities: CapabilityRow[] = [
  // --- Design & vector -----------------------------------------------------
  {
    group: 'Design & vector',
    capability: 'Pen tool with bezier paths',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: 'Smoothing, per-point corner radius, dash arrays, trim start and end',
  },
  {
    group: 'Design & vector',
    capability: 'Animatable corner radius',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: 'Pixel-level, animatable for morphing transitions',
  },
  {
    group: 'Design & vector',
    capability: 'Auto-layout containers',
    flashfx: true,
    capcut: false,
    resolve: false,
    note: 'Horizontal and vertical, with padding, margin and nesting',
  },
  {
    group: 'Design & vector',
    capability: 'Reusable UI component shapes',
    flashfx: true,
    capcut: false,
    resolve: false,
    note: 'Button, input, toggle, modal, chat bubble, progress bar',
  },
  {
    group: 'Design & vector',
    capability: 'SVG import with inline editing',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: 'Fill and stroke override, ViewBox preservation',
  },
  {
    group: 'Design & vector',
    capability: 'Built-in searchable icon library',
    flashfx: true,
    capcut: true,
    resolve: false,
  },
  {
    group: 'Design & vector',
    capability: 'Smart guides and snapping',
    flashfx: true,
    capcut: true,
    resolve: true,
    note: 'Snap to grid, elements, markers and keyframes',
  },
  {
    group: 'Design & vector',
    capability: 'Blend modes',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: '16 element-level modes',
  },

  // --- Animation -----------------------------------------------------------
  {
    group: 'Animation',
    capability: 'Keyframe graph with bezier velocity curves',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: '16 easing functions with per-keyframe bezier handles',
  },
  {
    group: 'Animation',
    capability: 'Expressions',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: 'Owner-confirmed 2026-08-06',
  },
  {
    group: 'Animation',
    capability: 'Repeaters and cloners',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: 'Owner-confirmed 2026-08-06',
  },
  {
    group: 'Animation',
    capability: 'Per-character text animation',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: 'By character, word, line or object',
  },

  // --- Compositing ---------------------------------------------------------
  {
    group: 'Compositing',
    capability: 'Masking with feather and invert',
    flashfx: true,
    capcut: false,
    resolve: true,
  },
  {
    group: 'Compositing',
    capability: 'Groups, nesting and shared parent transforms',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: 'Enter and exit group editing, lock and hide per layer',
  },
  {
    group: 'Compositing',
    capability: 'Nested compositions',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: 'Sequence compositor',
  },
  { group: 'Compositing', capability: 'Chroma key', flashfx: true, capcut: true, resolve: true },
  {
    group: 'Compositing',
    capability: '3D with model import',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: 'GLB, OBJ, FBX, STL',
  },

  // --- Collaboration -------------------------------------------------------
  {
    group: 'Collaboration',
    capability: 'Real-time collaboration',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: 'FlashFX: Teams plan',
  },
  {
    group: 'Collaboration',
    capability: 'Version history',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: '30 days free, 90 days on paid plans',
  },

  // --- Media & output ------------------------------------------------------
  {
    group: 'Media & output',
    capability: 'Transparent export',
    flashfx: true,
    capcut: false,
    resolve: true,
    note: 'PNG sequence',
  },
  {
    group: 'Media & output',
    capability: 'Auto-captions and stock library',
    flashfx: false,
    capcut: true,
    resolve: false,
  },
  {
    group: 'Media & output',
    capability: 'Camera RAW and professional codecs',
    flashfx: false,
    capcut: false,
    resolve: true,
    note: 'BRAW, R3D, ProRes, DNxHR',
  },
  {
    group: 'Media & output',
    capability: 'ACES and HDR colour grading',
    flashfx: false,
    capcut: false,
    resolve: true,
    note: '32-bit float, DaVinci Wide Gamut',
  },
  {
    group: 'Media & output',
    capability: 'Full digital audio workstation',
    flashfx: false,
    capcut: false,
    resolve: true,
    note: 'Fairlight',
  },

  // --- Platform ------------------------------------------------------------
  { group: 'Platform', capability: 'Runs with no installation', flashfx: true, capcut: false, resolve: false },
  { group: 'Platform', capability: 'Mobile app', flashfx: false, capcut: true, resolve: true },
  { group: 'Platform', capability: 'Works offline', flashfx: false, capcut: true, resolve: true },
];

export interface Verdict {
  product: string;
  useWhen: string[];
}

export const whenToUse: Verdict[] = [
  {
    product: 'FlashFX',
    useWhen: [
      'Motion graphics — kinetic type, logo animation, social motion design',
      'You need it to run on a machine that cannot install the alternatives',
      'You want to open a URL rather than manage media, relink files and warm a cache',
      'The work is synthetic: shapes, text, gradients and particles rather than hours of footage',
    ],
  },
  {
    product: 'CapCut',
    useWhen: [
      'Cut, caption, publish — short-form social video on a deadline',
      'You are editing on a phone',
      'You want templates, auto-captions and one-click publishing',
      'You need to work offline, or on a long 4K timeline',
    ],
  },
  {
    product: 'DaVinci Resolve',
    useWhen: [
      'Colour grading is the point — ACES, HDR, scopes, control panels',
      'You are cutting camera RAW, ProRes or DNxHR',
      'Long-form: features, documentaries, multicam, hours-long timelines',
      'You need a real DAW in the same application',
    ],
  },
];
