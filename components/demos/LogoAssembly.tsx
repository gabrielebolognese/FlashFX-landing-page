'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cappedPixelRatio } from '@/lib/render-gate';
import { useAmbient } from '@/lib/motion';
import { DEMO_PRIORITY } from './demo-kit';

/*
 * Cubes stream past the camera and settle into the FlashFX lockup — the
 * homepage hero (immersionmilestones.md I8).
 *
 * Moved here from a section under the 3D block on 2026-08-07, and re-entered.
 * It no longer opens on a single cube that duplicates: it starts *mid-flight*,
 * with every cube already separate, close to the camera and large, flying back
 * into place. That is why the start is a spread of深 z values rather than a
 * shared origin, and why each cube carries a random tumble that unwinds to
 * square as it lands — a cube that never rotates reads as a flat tile, and the
 * brief was that these must read as cubes.
 *
 * Cubes are staggered by the x of their destination, so the lockup assembles
 * left to right, logo first. At any instant some are still arriving while
 * others have landed, which is what keeps it from looking like one rigid block
 * sliding in.
 *
 * ── Where the shapes come from ──────────────────────────────────────────────
 *
 * Both are rasterised, not hand-plotted: the logo from the real
 * android-chrome-192x192.png, and the word from a canvas rendered in the site's
 * own font (read off the DOM, so it tracks the real stack rather than
 * guessing). Change either asset and the animation follows.
 */

/** Grid rows for each. The logo is square; the text's width follows its glyphs. */
const LOGO_ROWS = 34;
const TEXT_ROWS = 30;

/** World units between cube centres, before each block's own scale. */
const PITCH = 1;

/*
 * Relative sizes of the two blocks. The logo reads larger than the word.
 *
 * These set the ratio *between* the blocks and nothing else. Scaling both by
 * the same factor has no visible effect whatsoever: the camera fits the lockup
 * to the frame, so a larger lockup is simply viewed from further away and
 * projects to exactly the same pixels. How big the lockup looks on screen is
 * `FILL`, below.
 */
const LOGO_SCALE = 1.4;
const TEXT_SCALE = 0.8;

/**
 * How much of the frame's binding dimension the lockup occupies, 0–1.
 *
 * This is the size control. Was an implicit 0.85; 0.47 is 55% of that.
 */
const FILL = 0.47;

/** How far the logo's cubes stretch in z once assembled, so it reads as a slab. */
const LOGO_EXTRUDE = 3.4;

/** Gap between logo and word, in cubes. */
const GAP = 9;

/** Seconds for the whole flight. The hero brief called for 3.5. */
const BUILD = 3.5;

/** Fraction of the build spent staggering starts across the swarm. */
const STAGGER = 0.55;

/*
 * The word is white. Six near-white tones rather than one flat #fff, so the
 * cubes still read as cubes — with a single colour on every face a cube has no
 * silhouette and the wordmark flattens into a sticker.
 */
const TEXT_SHADE = ['#ffffff', '#dee6f0', '#ffffff', '#bcc6d4', '#f3f7fc', '#d2dae5'];

/** Logo cubes are white-based and tinted per instance by the logo's own pixels. */
const LOGO_SHADE = ['#d8dee6', '#c6ccd6', '#ffffff', '#aab2be', '#e8edf4', '#bcc4d0'];

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** A box whose six faces carry six fixed colours, as flat vertex colours. */
function facedBox(w: number, h: number, d: number, palette: string[]): THREE.BoxGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  const colours = new Float32Array(24 * 3);
  const c = new THREE.Color();
  for (let face = 0; face < 6; face++) {
    c.set(palette[face]);
    for (let v = 0; v < 4; v++) {
      const i = (face * 4 + v) * 3;
      colours[i] = c.r; colours[i + 1] = c.g; colours[i + 2] = c.b;
    }
  }
  g.setAttribute('color', new THREE.BufferAttribute(colours, 3));
  return g;
}

interface Cell { x: number; y: number; r: number; g: number; b: number }
interface Grid { cells: Cell[]; cols: number; rows: number }

/**
 * Crop a cell list to its own bounding box.
 *
 * Both sources carry padding — the logo PNG has margin around the bolt, and
 * rasterised text has ascender and descender space the glyphs never reach.
 * Laying out against the raw grid would centre the *padding* and leave the
 * artwork visibly off to one side.
 */
function crop(cells: Cell[]): Grid {
  if (!cells.length) return { cells, cols: 0, rows: 0 };
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const c of cells) {
    if (c.x < minX) minX = c.x; if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y; if (c.y > maxY) maxY = c.y;
  }
  return {
    cells: cells.map((c) => ({ ...c, x: c.x - minX, y: c.y - minY })),
    cols: maxX - minX + 1,
    rows: maxY - minY + 1,
  };
}

/**
 * Sample the logo into a grid.
 *
 * Keeps the bolt and drops the near-white ground it sits on: a pixel counts if
 * it is opaque *and* either saturated or dark. Testing alpha alone would return
 * the whole square. Verified against the real asset — at 34 rows the filter
 * keeps the bolt and nothing else.
 */
function sampleLogo(image: HTMLImageElement, rows: number): Grid {
  const canvas = document.createElement('canvas');
  canvas.width = rows;
  canvas.height = rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { cells: [], cols: 0, rows: 0 };
  ctx.drawImage(image, 0, 0, rows, rows);
  const { data } = ctx.getImageData(0, 0, rows, rows);

  const cells: Cell[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < rows; x++) {
      const i = (y * rows + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (a < 128) continue;
      const saturation = Math.max(r, g, b) - Math.min(r, g, b);
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      if (saturation < 28 && luminance > 215) continue;
      cells.push({ x, y, r: r / 255, g: g / 255, b: b / 255 });
    }
  }
  return crop(cells);
}

/** Rasterise the word, then sample ink coverage per grid cell. */
function sampleText(text: string, rows: number, fontFamily: string): Grid {
  const px = 160;
  const probe = document.createElement('canvas');
  const pctx = probe.getContext('2d', { willReadFrequently: true });
  if (!pctx) return { cells: [], cols: 0, rows: 0 };

  const font = `700 ${px}px ${fontFamily}`;
  pctx.font = font;
  const width = Math.ceil(pctx.measureText(text).width);

  probe.width = width + px;
  probe.height = Math.ceil(px * 1.5);
  const ctx = probe.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { cells: [], cols: 0, rows: 0 };
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(text, px / 2, probe.height / 2);

  const { data } = ctx.getImageData(0, 0, probe.width, probe.height);

  // Tight bounds around the ink, so the grid is not mostly padding.
  let minX = probe.width, maxX = 0, minY = probe.height, maxY = 0;
  for (let y = 0; y < probe.height; y++) {
    for (let x = 0; x < probe.width; x++) {
      if (data[(y * probe.width + x) * 4 + 3] > 40) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX <= minX || maxY <= minY) return { cells: [], cols: 0, rows: 0 };

  const inkH = maxY - minY + 1;
  const inkW = maxX - minX + 1;
  const cell = inkH / rows;
  const cols = Math.max(1, Math.round(inkW / cell));

  const cells: Cell[] = [];
  for (let ry = 0; ry < rows; ry++) {
    for (let rx = 0; rx < cols; rx++) {
      const x0 = Math.floor(minX + rx * cell), x1 = Math.floor(minX + (rx + 1) * cell);
      const y0 = Math.floor(minY + ry * cell), y1 = Math.floor(minY + (ry + 1) * cell);
      let sum = 0, n = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          sum += data[(y * probe.width + x) * 4 + 3];
          n++;
        }
      }
      if (n && sum / n / 255 > 0.42) cells.push({ x: rx, y: ry, r: 1, g: 1, b: 1 });
    }
  }
  return crop(cells);
}

export function LogoAssembly({
  className,
  duration = BUILD,
  onDone,
}: {
  className?: string;
  /** Seconds for the whole flight. */
  duration?: number;
  /** Fired once, when the last cube has landed. */
  onDone?: () => void;
}) {
  /*
   * Priority 10, above every other demo. This is the hero: if the governor
   * handed its slot to a floating shape further down the page, the animation
   * would stall part-assembled in the most visible place on the site.
   */
  const { ref, active } = useAmbient<HTMLDivElement>({ priority: 10 });
  const host = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const wake = useRef<(() => void) | null>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const durationRef = useRef(duration);
  durationRef.current = duration;
  activeRef.current = active;

  useEffect(() => {
    const container = host.current;
    if (!container) return;

    let disposed = false;
    let cleanup: (() => void) | null = null;

    const build = async () => {
      // The canvas has to draw in the same face the page uses, so read the
      // resolved stack off the DOM rather than naming a family here.
      const probe = document.createElement('span');
      probe.className = 'font-sans font-bold';
      probe.style.position = 'absolute';
      probe.style.visibility = 'hidden';
      document.body.appendChild(probe);
      const fontFamily = getComputedStyle(probe).fontFamily || 'sans-serif';
      probe.remove();

      try { await document.fonts.ready; } catch { /* older browsers */ }

      const image = new Image();
      image.src = '/android-chrome-192x192.png';
      await new Promise<void>((resolve) => {
        if (image.complete) return resolve();
        image.onload = () => resolve();
        image.onerror = () => resolve();
      });
      if (disposed) return;

      const logo = sampleLogo(image, LOGO_ROWS);
      const text = sampleText('FlashFX', TEXT_ROWS, fontFamily);
      if (!logo.cells.length || !text.cells.length) return;

      const logoCells = logo.cells;
      const textCells = text.cells;

      // Each block is laid out at its own pitch, so the logo can be larger than
      // the word without either being resampled at a different resolution.
      const logoPitch = PITCH * LOGO_SCALE;
      const textPitch = PITCH * TEXT_SCALE;
      const logoW = logo.cols * logoPitch;
      const textW = text.cols * textPitch;
      const gapW = GAP * PITCH;

      const halfW = (logoW + gapW + textW) / 2;
      const halfH = Math.max(logo.rows * logoPitch, text.rows * textPitch) / 2;

      // Grid → world, each block centred on its own cropped box. y is flipped
      // because image and canvas rows run downward.
      const logoOriginX = -halfW + logoW / 2;
      const toLogoLocal = (c: Cell) => [
        (c.x - logo.cols / 2 + 0.5) * logoPitch,
        (logo.rows / 2 - c.y - 0.5) * logoPitch,
        0,
      ];
      const toTextWorld = (c: Cell) => [
        -halfW + logoW + gapW + (c.x + 0.5) * textPitch,
        (text.rows / 2 - c.y - 0.5) * textPitch,
        0,
      ];

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(cappedPixelRatio());
      container.appendChild(renderer.domElement);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';

      /*
       * The logo is extruded in z so that spinning it does not make it vanish
       * edge-on twice per turn — a slab stays solid where a flat layer does
       * not. The extrusion is applied through the instance scale and eased in
       * with the build: baked into the geometry it would also apply at u=0,
       * when every cube is coincident at the origin, turning the single opening
       * cube into a long box.
       */
      const logoGeo = facedBox(logoPitch * 0.92, logoPitch * 0.92, logoPitch * 0.92, LOGO_SHADE);
      const textGeo = facedBox(textPitch * 0.88, textPitch * 0.88, textPitch * 0.88, TEXT_SHADE);
      const makeMaterial = () => new THREE.MeshBasicMaterial({ vertexColors: true });

      const logoMesh = new THREE.InstancedMesh(logoGeo, makeMaterial(), logoCells.length);
      const textMesh = new THREE.InstancedMesh(textGeo, makeMaterial(), textCells.length);
      logoMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      textMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

      const tint = new THREE.Color();
      logoCells.forEach((c, i) => {
        tint.setRGB(c.r, c.g, c.b);
        logoMesh.setColorAt(i, tint);
      });
      if (logoMesh.instanceColor) logoMesh.instanceColor.needsUpdate = true;

      // The logo turns; the group is what turns, so its cubes are positioned in
      // local space around the group's own centre.
      const logoGroup = new THREE.Group();
      logoGroup.position.set(logoOriginX, 0, 0);
      logoGroup.add(logoMesh);
      scene.add(logoGroup);
      scene.add(textMesh);

      /*
       * Per-cube path data. `spread` is the Bézier control point — a loose
       * lattice position that bulges the path outward mid-flight. `delay`
       * staggers starts by destination x, so the lockup assembles left to
       * right.
       */
      interface Cube { target: number[]; from: number[]; spin: number[]; delay: number }
      const makeCubes = (cells: Cell[], toWorld: (c: Cell) => number[], localOffsetX: number): Cube[] =>
        cells.map((c, i) => {
          const target = toWorld(c);
          const worldX = target[0] + localOffsetX;
          const t = (worldX + halfW) / (halfW * 2);

          /*
           * Start close to the camera and off to one side. `NEAR` is a fraction
           * of the camera's own distance, so a cube begins a few units from the
           * lens and perspective alone makes it enormous — no scaling needed to
           * sell "coming at you". The golden angle spreads the cloud without the
           * clumping that uniform randomness produces at these counts.
           */
          const angle = i * 2.399963;
          const spread = 0.55 + ((i * 13) % 7) / 7;
          return {
            target,
            from: [
              target[0] * 0.35 + Math.cos(angle) * halfW * 0.55 * spread,
              target[1] * 0.35 + Math.sin(angle) * halfH * 1.5 * spread,
              0.42 + ((i * 7) % 5) / 16, // fraction of the camera distance, resolved at paint
            ],
            // Unwinds to square on landing. Deterministic, so the hero is the
            // same animation on every visit.
            spin: [
              ((i * 37) % 13) / 13 * Math.PI * 2,
              ((i * 53) % 17) / 17 * Math.PI * 2,
              ((i * 29) % 11) / 11 * Math.PI * 2,
            ],
            delay: Math.min(0.999, Math.max(0, t)) * STAGGER,
          };
        });

      const logoCubes = makeCubes(logoCells, toLogoLocal, logoOriginX);
      const textCubes = makeCubes(textCells, toTextWorld, 0);

      const dummy = new THREE.Object3D();

      /** Place one mesh's instances at global progress `p`. */
      const place = (mesh: THREE.InstancedMesh, cubes: Cube[], p: number, extrude: number) => {
        for (let i = 0; i < cubes.length; i++) {
          const cube = cubes[i];
          const u = Math.min(1, Math.max(0, (p - cube.delay) / (1 - STAGGER)));
          const e = u * u * (3 - 2 * u); // smoothstep — no seams, no stops

          // A straight, eased flight — no duplication arc, because nothing is
          // duplicating: each cube is already its own from the first frame.
          const inv = 1 - e;
          dummy.position.set(
            cube.from[0] * inv + cube.target[0] * e,
            cube.from[1] * inv + cube.target[1] * e,
            (camDistance * cube.from[2]) * inv + cube.target[2] * e
          );

          // The tumble unwinds over the last two thirds of the flight.
          const settle = 1 - smoothstep(0.25, 1, u);
          dummy.rotation.set(
            cube.spin[0] * settle,
            cube.spin[1] * settle,
            cube.spin[2] * settle
          );

          /*
           * Nothing is visible until it is moving. With the stagger, a cube
           * waiting its turn would otherwise sit motionless at its start point,
           * and several hundred of those read as a static cloud that the
           * animation then leaves behind — the opposite of a stream.
           *
           * Scale, not opacity: these share one material per mesh, so there is
           * no per-instance alpha to set, and a zero-scale instance is
           * degenerate and never rasterised. The ramp is ~0.14 s, enough to
           * avoid a hard pop and short enough to still read as "on the move".
           */
          const appear = smoothstep(0, 0.04, u);
          dummy.scale.set(appear, appear, appear * (1 + (extrude - 1) * smoothstep(0.6, 1, u)));
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      };

      let camDistance = 60;
      const fit = () => {
        const { clientWidth: w, clientHeight: h } = container;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const fov = (camera.fov * Math.PI) / 180;
        // Fit the lockup's width and height, whichever binds, plus margin.
        const distH = halfH / Math.tan(fov / 2);
        const distW = halfW / (Math.tan(fov / 2) * camera.aspect);
        camDistance = Math.max(distH, distW) / FILL;
        camera.position.set(0, 0, camDistance);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(fit);
      observer.observe(container);
      fit();

      let progress = 0;
      let spin = 0;
      let frame = 0;
      let running = false;
      let last = 0;

      const draw = () => {
        // Once assembled, instance matrices stop changing entirely and only the
        // logo group's rotation is written — from ~1,100 matrix writes a frame
        // down to none.
        if (progress < 1) {
          place(logoMesh, logoCubes, progress, LOGO_EXTRUDE);
          place(textMesh, textCubes, progress, 1);
        }
        logoGroup.rotation.y = spin;
        renderer.render(scene, camera);
      };

      const loop = (now: number) => {
        if (!last) last = now;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        if (progress < 1) {
          progress = Math.min(1, progress + dt / durationRef.current);
          if (progress >= 1) doneRef.current?.();
        }
        // The turn eases in as the logo finishes arriving, so its cubes are not
        // flying toward a moving target.
        spin += dt * 0.55 * smoothstep(0.55, 1, progress);

        draw();

        if (activeRef.current) {
          frame = requestAnimationFrame(loop);
        } else {
          running = false;
          last = 0;
        }
      };

      const start = () => {
        if (running || !activeRef.current) return;
        running = true;
        last = 0;
        frame = requestAnimationFrame(loop);
      };
      wake.current = start;

      /*
       * Replay when the section has properly left and come back. Deliberately a
       * separate observer from the governor's: losing a loop slot to another
       * section is not a reason to restart the animation from a single cube.
       */
      const replay = new IntersectionObserver(
        (records) => {
          if (records.some((r) => !r.isIntersecting)) {
            progress = 0;
            spin = 0;
          }
        },
        { threshold: 0 }
      );
      replay.observe(container);

      /*
       * `useAmbient` reports inactive under reduced motion, and this loop only
       * advances while active — so without this the hero would sit frozen on
       * the first frame, cubes scattered and nothing legible. Land them.
       */
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        progress = 1;
        spin = 0;
        doneRef.current?.();
      }

      draw();
      start();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        replay.disconnect();
        logoGeo.dispose();
        textGeo.dispose();
        (logoMesh.material as THREE.Material).dispose();
        (textMesh.material as THREE.Material).dispose();
        logoMesh.dispose();
        textMesh.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    };

    build();

    return () => {
      disposed = true;
      wake.current = null;
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    if (active) wake.current?.();
  }, [active]);

  return (
    <div ref={ref} className={className}>
      <div ref={host} className="absolute inset-0" />
    </div>
  );
}
