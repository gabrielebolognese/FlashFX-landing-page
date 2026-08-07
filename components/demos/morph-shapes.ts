/*
 * Point-cloud targets for the morph sequence (immersionmilestones.md I8).
 *
 * Every stage is N points, the same N throughout, so morphing between any two
 * is a straight lerp of positions. Nothing here knows about three.js or React —
 * it is arithmetic, and it can be checked by eye in a scatter plot.
 *
 * Why a swarm rather than a morphing mesh: vertex morphing needs identical
 * vertex counts and ordering across every shape, which would mean authoring the
 * 747 to match a sphere's topology in a modelling tool, and the result reads as
 * a melted sphere rather than an aeroplane. It would also destroy the faceted
 * look, because a smoothly interpolating surface does not look like flat-shaded
 * blocks. Here the units *are* cubes, so the style is preserved by construction.
 */

/**
 * Seeded PRNG. Deterministic on purpose — `Math.random()` would give a
 * different aeroplane on every mount, and a different one again if the
 * component ever remounted mid-scroll.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A box of solid volume, optionally sheared.
 *
 * `sweepZ` shears x backwards in proportion to |z| — that is what gives a wing
 * its sweep. `sweepY` shears x backwards in proportion to height, for the
 * swept vertical fin.
 */
export interface Block {
  c: [number, number, number];
  s: [number, number, number];
  sweepZ?: number;
  sweepY?: number;
}

function volume(b: Block): number {
  return 8 * b.s[0] * b.s[1] * b.s[2];
}

/**
 * Distribute `n` points across blocks in proportion to volume, so a thin wing
 * does not get the same density as the fuselage and end up looking heavier than
 * it is.
 */
function sampleBlocks(blocks: Block[], n: number, seed: number): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(n * 3);

  const total = blocks.reduce((sum, b) => sum + volume(b), 0);
  const cumulative: number[] = [];
  let running = 0;
  for (const b of blocks) {
    running += volume(b) / total;
    cumulative.push(running);
  }

  for (let i = 0; i < n; i++) {
    const pick = rand();
    let bi = 0;
    while (bi < cumulative.length - 1 && pick > cumulative[bi]) bi++;
    const b = blocks[bi];

    let x = b.c[0] + (rand() * 2 - 1) * b.s[0];
    const y = b.c[1] + (rand() * 2 - 1) * b.s[1];
    const z = b.c[2] + (rand() * 2 - 1) * b.s[2];

    if (b.sweepZ) x -= b.sweepZ * Math.abs(z);
    if (b.sweepY) x -= b.sweepY * Math.max(0, y - b.c[1] + b.s[1]);

    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }

  return out;
}

/** Stage 1 — a single solid cube. Points fill it densely enough to read as one. */
export function solidCube(n: number, half: number, seed = 1): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    out[i * 3] = (rand() * 2 - 1) * half;
    out[i * 3 + 1] = (rand() * 2 - 1) * half;
    out[i * 3 + 2] = (rand() * 2 - 1) * half;
  }
  return out;
}

/**
 * Stage 2 — the duplication. A regular lattice, which is the clearest possible
 * statement that there are now many separate cubes rather than one solid.
 */
/*
 * `n` should be a perfect cube — see MORPH_COUNT. With a non-cube count the
 * final z-layer is only partly filled and the whole lattice reads as lopsided,
 * which is very visible on the one stage whose entire job is to look regular.
 */
export function lattice(n: number, spacing: number): Float32Array {
  const side = Math.ceil(Math.cbrt(n));
  const offset = ((side - 1) * spacing) / 2;
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const x = i % side;
    const y = Math.floor(i / side) % side;
    const z = Math.floor(i / (side * side)) % side;
    out[i * 3] = x * spacing - offset;
    out[i * 3 + 1] = y * spacing - offset;
    out[i * 3 + 2] = z * spacing - offset;
  }
  return out;
}

/**
 * Stage 3 — a sphere.
 *
 * Fibonacci distribution, not uniform random: random points on a sphere clump
 * visibly at the poles, and with only a few hundred cubes that reads as a
 * mistake rather than as texture.
 */
export function fibonacciSphere(n: number, radius: number): Float32Array {
  const out = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return out;
}

/** Stage 4 — the stretch. The same sphere pulled along x into the fuselage. */
export function stretched(sphere: Float32Array, sx: number, sy: number, sz: number): Float32Array {
  const out = new Float32Array(sphere.length);
  for (let i = 0; i < sphere.length; i += 3) {
    out[i] = sphere[i] * sx;
    out[i + 1] = sphere[i + 1] * sy;
    out[i + 2] = sphere[i + 2] * sz;
  }
  return out;
}

/*
 * The 747, as blocks.
 *
 * Extremely simplified, but the three things that make a 747 unmistakable are
 * all here and are the reason this aircraft was chosen: the upper-deck **hump**
 * behind the cockpit, **four** engines rather than two, and a long swept wing.
 * Take away the hump and it is any airliner; take away two engines and it is a
 * 777.
 *
 * x runs nose (+) to tail (−), y is up, z is the wingspan.
 */
const FUSELAGE: Block[] = [
  { c: [0, 0, 0], s: [4.9, 0.46, 0.46] },
  { c: [5.25, -0.06, 0], s: [0.66, 0.34, 0.34] },
  { c: [-5.1, 0.22, 0], s: [0.5, 0.3, 0.3] },
];

const HUMP: Block[] = [
  { c: [2.95, 0.56, 0], s: [1.5, 0.26, 0.40] },
  { c: [4.35, 0.44, 0], s: [0.55, 0.19, 0.29] },
];

/*
 * Span 10.5 against a fuselage of 11.6. A real 747 is 70.6 m long with a
 * 64.4 m span — longer than it is wide, ratio about 1.10. Getting that the
 * wrong way round is the fastest way to make an airliner look like a glider.
 */
const WINGS: Block[] = [
  { c: [-0.25, -0.16, -2.62], s: [1.45, 0.09, 2.62], sweepZ: 0.55 },
  { c: [-0.25, -0.16, 2.62], s: [1.45, 0.09, 2.62], sweepZ: 0.55 },
];

/*
 * Oversized relative to scale. Points are allocated by volume, and at true
 * proportions four engines take about 4% of the aircraft — roughly five cubes
 * each, which reads as a smudge rather than a pod. Four engines is one of the
 * three things that identify a 747, so they are worth the extra density.
 */
const ENGINES: Block[] = [
  { c: [0.55, -0.52, -1.5], s: [0.55, 0.26, 0.26] },
  { c: [-0.2, -0.52, -2.8], s: [0.52, 0.24, 0.24] },
  { c: [0.55, -0.52, 1.5], s: [0.55, 0.26, 0.26] },
  { c: [-0.2, -0.52, 2.8], s: [0.52, 0.24, 0.24] },
];

const TAIL: Block[] = [
  // Vertical fin, swept back with height.
  { c: [-4.35, 1.25, 0], s: [0.85, 1.2, 0.11], sweepY: 0.5 },
  { c: [-4.5, 0.2, -1.15], s: [0.62, 0.07, 1.15], sweepZ: 0.5 },
  { c: [-4.5, 0.2, 1.15], s: [0.62, 0.07, 1.15], sweepZ: 0.5 },
];

/** Stage 5 — fuselage and wings only. The wings arriving is its own beat. */
export function wingedBody(n: number, seed = 7): Float32Array {
  return sampleBlocks([...FUSELAGE, ...HUMP, ...WINGS], n, seed);
}

/** Stage 6 — the complete aircraft. */
export function boeing747(n: number, seed = 11): Float32Array {
  return sampleBlocks([...FUSELAGE, ...HUMP, ...WINGS, ...ENGINES, ...TAIL], n, seed);
}

/**
 * 8³. A perfect cube so the duplication lattice is symmetric, and small enough
 * that one InstancedMesh draws the lot in a single call.
 *
 * I7's device tier should step this down rather than change anything else —
 * 125 (5³) and 216 (6³) both still read correctly.
 */
export const MORPH_COUNT = 512;

export interface Stage {
  name: string;
  points: Float32Array;
  /** Seconds spent morphing into this stage, and holding once arrived. */
  morph: number;
  hold: number;
}

/**
 * The full sequence. Loops back to the cube, so the last stage's morph time is
 * what carries the aeroplane apart again.
 */
export function buildSequence(n: number): Stage[] {
  const sphere = fibonacciSphere(n, 2.05);

  return [
    { name: 'cube', points: solidCube(n, 0.78), morph: 1.5, hold: 1.1 },
    { name: 'duplicate', points: lattice(n, 0.72), morph: 1.2, hold: 0.9 },
    { name: 'sphere', points: sphere, morph: 1.3, hold: 0.9 },
    { name: 'stretch', points: stretched(sphere, 2.5, 0.5, 0.5), morph: 1.1, hold: 0.7 },
    { name: 'wings', points: wingedBody(n), morph: 1.3, hold: 0.8 },
    { name: '747', points: boeing747(n), morph: 1.4, hold: 2.6 },
  ];
}
