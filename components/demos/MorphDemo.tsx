'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cappedPixelRatio } from '@/lib/render-gate';
import { DemoShell, useDemo } from './demo-kit';
import { buildSequence, MORPH_COUNT, type Stage } from './morph-shapes';

/*
 * The morph sequence: one cube duplicates, condenses into a sphere, stretches,
 * grows wings and becomes a Boeing 747 (immersionmilestones.md I8).
 *
 * This is a recreation of an animation the founder actually built in FlashFX —
 * see FIX.md *Canonical facts*, "3D capability". FlashFX imports and animates
 * 3D objects and runs morph animations that modify them; it is not a sculpting
 * tool, and no copy around this demo may imply that it is.
 *
 * A swarm, not a shapeshifter. Every stage is a list of target positions for
 * the same 512 cubes, so morphing is a lerp — no vertex-count matching, no
 * modelling tool, and the faceted multi-coloured style survives because the
 * units really are cubes. One InstancedMesh draws all 512 in a single call.
 */

/** Edge length of each cube. Small enough that 512 of them read as a surface. */
const CUBE = 0.30;

/**
 * How much of the morph is spent staggering arrivals.
 *
 * With every cube on the same clock the swarm snaps between shapes as one rigid
 * object, which looks like a slideshow. Offsetting each cube's start across
 * 40% of the window makes the shape assemble as a wave.
 */
const WAVE = 0.4;

/** Face colours, matching CubeDemo so the two read as the same material. */
const FACES = [
  '#F5C518', // +x
  '#7C5CBF', // -x
  '#E6EDF3', // +y
  '#2D6BE4', // -y
  '#4ADE80', // +z
  '#F97362', // -z
];

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Paint each of the box's six faces a different colour, once, at build time. */
function facedBox(size: number): THREE.BoxGeometry {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const colours = new Float32Array(24 * 3);
  const c = new THREE.Color();

  // BoxGeometry lays out 6 faces of 4 vertices, in +x −x +y −y +z −z order.
  for (let face = 0; face < 6; face++) {
    c.set(FACES[face]);
    for (let v = 0; v < 4; v++) {
      const i = (face * 4 + v) * 3;
      colours[i] = c.r;
      colours[i + 1] = c.g;
      colours[i + 2] = c.b;
    }
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colours, 3));
  return geometry;
}

/** Where we are in the loop: which stage, and how far into it. */
function resolve(stages: Stage[], elapsed: number) {
  const cycle = stages.reduce((sum, s) => sum + s.morph + s.hold, 0);
  let t = elapsed % cycle;

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    if (t < stage.morph) {
      // Morphing out of the previous stage, wrapping at the start of the loop.
      const from = stages[(i - 1 + stages.length) % stages.length];
      return { from: from.points, to: stage.points, progress: t / stage.morph };
    }
    t -= stage.morph;
    if (t < stage.hold) {
      return { from: stage.points, to: stage.points, progress: 1 };
    }
    t -= stage.hold;
  }

  const last = stages[stages.length - 1];
  return { from: last.points, to: last.points, progress: 1 };
}

export function MorphDemo() {
  const { ref, active } = useDemo();
  const host = useRef<HTMLDivElement>(null);
  /** Set up by the mount effect, driven by the `active` effect below. */
  const controls = useRef<{ start: () => void; stop: () => void } | null>(null);

  useEffect(() => {
    const container = host.current;
    if (!container) return;

    const stages = buildSequence(MORPH_COUNT);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 3.1, 13.5);
    camera.lookAt(0, 0, 0);

    /*
     * `alpha` with a fully transparent clear colour: the viewport is blended
     * into the section rather than sitting in a panel, so the canvas must not
     * paint its own background.
     */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(cappedPixelRatio());
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    const geometry = facedBox(CUBE);
    const material = new THREE.MeshBasicMaterial({ vertexColors: true });
    const mesh = new THREE.InstancedMesh(geometry, material, MORPH_COUNT);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // A little per-cube brightness variation, so 512 identical cubes read as a
    // volume with depth rather than a flat sheet of one colour.
    const tint = new THREE.Color();
    for (let i = 0; i < MORPH_COUNT; i++) {
      const shade = 0.78 + ((i * 37) % 100) / 100 * 0.42;
      tint.setRGB(shade, shade, shade);
      mesh.setColorAt(i, tint);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    const group = new THREE.Group();
    group.add(mesh);
    scene.add(group);

    const dummy = new THREE.Object3D();

    const paint = (elapsed: number) => {
      const { from, to, progress } = resolve(stages, elapsed);

      for (let i = 0; i < MORPH_COUNT; i++) {
        // Stagger: cube 0 leaves first, the last cube leaves WAVE later.
        const offset = (i / MORPH_COUNT) * WAVE;
        const local = Math.min(1, Math.max(0, (progress - offset) / (1 - WAVE)));
        const e = easeInOutCubic(local);

        const j = i * 3;
        dummy.position.set(
          from[j] + (to[j] - from[j]) * e,
          from[j + 1] + (to[j + 1] - from[j + 1]) * e,
          from[j + 2] + (to[j + 2] - from[j + 2]) * e
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    /*
     * The still frame is the finished aeroplane, held at a three-quarter angle.
     * Used when the governor denies a slot and when reduced motion is set —
     * never a blank canvas, and never the sequence half-finished.
     */
    const cycle = stages.reduce((sum, s) => sum + s.morph + s.hold, 0);
    const restingAt = cycle - stages[stages.length - 1].hold / 2;

    const still = () => {
      group.rotation.set(0.08, -0.72, 0);
      paint(restingAt);
    };

    let frame = 0;
    let last = 0;
    let running = false;
    /*
     * Elapsed time is accumulated rather than read from the clock, so the
     * sequence starts on the cube and resumes where it paused. Using
     * `now / 1000` directly would enter at an arbitrary point in the loop —
     * usually mid-morph, which is the one thing that never reads well.
     */
    let elapsed = 0;

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;

      group.rotation.y += dt * 0.28;
      group.rotation.x = 0.08 + Math.sin(elapsed / 4.2) * 0.06;
      paint(elapsed);
    };

    controls.current = {
      start: () => {
        if (running) return;
        running = true;
        last = 0;
        frame = requestAnimationFrame(loop);
      },
      stop: () => {
        if (!running) return;
        running = false;
        cancelAnimationFrame(frame);
        still();
      },
    };

    still();

    return () => {
      controls.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      mesh.dispose();
      // Hand the WebGL context back rather than leaving it for the browser to
      // reclaim — contexts are a limited per-page resource.
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // The governor decides whether this may run; `useAmbient` already folds in
  // reduced motion and off-screen, so there is nothing else to check here.
  useEffect(() => {
    if (active) controls.current?.start();
    else controls.current?.stop();
  }, [active]);

  return (
    <DemoShell innerRef={ref} label="3D viewport" bare>
      <div
        className="absolute left-1/2 top-1/2 w-[68%] h-[48%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(245,197,24,0.10) 0%, rgba(124,92,191,0.06) 42%, transparent 72%)',
        }}
      />
      <div ref={host} className="absolute inset-0" />
    </DemoShell>
  );
}
