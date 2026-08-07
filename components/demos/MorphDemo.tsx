'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cappedPixelRatio } from '@/lib/render-gate';
import { DemoShell, useDemo } from './demo-kit';
import { A380_POSITIONS, A380_INDICES } from './a380-geometry';

/*
 * Cube → sphere → Airbus A380, as one mesh morphing (immersionmilestones.md I8).
 *
 * A recreation of an animation the founder built in FlashFX — see FIX.md
 * *Canonical facts*, "3D capability". FlashFX imports and animates 3D objects
 * and runs morph animations that modify them. It is **not** a sculpting tool,
 * and no copy around this demo may imply otherwise.
 *
 * ── Why the aircraft's own topology is the base ──────────────────────────────
 *
 * A vertex morph needs one vertex set shared by every stage. There were two
 * candidates and the choice was measured, not guessed:
 *
 *   Sphere topology, shrink-wrapped onto the aircraft — gives a perfect sphere
 *   and a ruined aeroplane. Wings are thin and nearly horizontal, so a ray cast
 *   outward from the centre misses them above about 3° of elevation; the wings
 *   collapse to stubs.
 *
 *   Aircraft topology, projected onto a sphere — gives a perfect aeroplane, and
 *   the sphere is only as good as the vertex distribution allows.
 *
 * The second was chosen after measuring the projection: the aircraft's 2324
 * triangles cover the unit sphere **2.19 times over**, with 6 degenerate
 * triangles out of 2324. Over-coverage means no holes — the ball is closed —
 * and the overlapping layers are what give it depth at low opacity. (A vertex
 * count of 819 across 36% of direction bins looked alarming until the triangles
 * were measured rather than the vertices; triangles span between vertices.)
 *
 * The cube is the same projection taken one step further: normalise, then
 * divide by the largest component to land on a cube face.
 */

/** Radius of the sphere stage, and half-extent of the cube stage. */
const SPHERE_R = 3.2;
const CUBE_H = 2.55;

/** Same palette as the cube demo, applied per face by dominant normal axis. */
const FACES = ['#F5C518', '#7C5CBF', '#E6EDF3', '#2D6BE4', '#4ADE80', '#F97362'];

/** Low, as asked — the faceted layers should read through one another. */
const OPACITY = 0.42;

interface Phase {
  name: string;
  target: Float32Array;
  morph: number;
  hold: number;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function MorphDemo() {
  const { ref, active } = useDemo();
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<{ start: () => void; stop: () => void } | null>(null);

  useEffect(() => {
    const container = host.current;
    if (!container) return;

    // ── Geometry ────────────────────────────────────────────────────────────
    const indexed = new THREE.BufferGeometry();
    indexed.setAttribute('position', new THREE.Float32BufferAttribute(A380_POSITIONS, 3));
    indexed.setIndex(A380_INDICES);
    // Non-indexed so every triangle owns its three vertices — that is what lets
    // each face take a flat colour of its own.
    const geometry = indexed.toNonIndexed();
    indexed.dispose();

    const plane = (geometry.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;
    const count = plane.length / 3;

    const sphere = new Float32Array(plane.length);
    const cube = new Float32Array(plane.length);
    for (let i = 0; i < plane.length; i += 3) {
      const x = plane[i], y = plane[i + 1], z = plane[i + 2];
      const r = Math.hypot(x, y, z) || 1;
      const nx = x / r, ny = y / r, nz = z / r;

      sphere[i] = nx * SPHERE_R;
      sphere[i + 1] = ny * SPHERE_R;
      sphere[i + 2] = nz * SPHERE_R;

      // Largest component to 1 ⇒ the point lands on a cube face.
      const m = Math.max(Math.abs(nx), Math.abs(ny), Math.abs(nz)) || 1;
      cube[i] = (nx / m) * CUBE_H;
      cube[i + 1] = (ny / m) * CUBE_H;
      cube[i + 2] = (nz / m) * CUBE_H;
    }

    // ── Colour, per triangle, by the aircraft's own face normals ─────────────
    const colours = new Float32Array(plane.length);
    const c = new THREE.Color();
    for (let t = 0; t < count; t += 3) {
      const i = t * 3;
      const ax = plane[i + 3] - plane[i], ay = plane[i + 4] - plane[i + 1], az = plane[i + 5] - plane[i + 2];
      const bx = plane[i + 6] - plane[i], by = plane[i + 7] - plane[i + 1], bz = plane[i + 8] - plane[i + 2];
      const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;

      // Dominant axis and sign pick one of the six colours, so the aircraft's
      // top, sides and underside each read differently — the same idea as the
      // cube's six faces, generalised to an arbitrary mesh.
      const ex = Math.abs(nx), ey = Math.abs(ny), ez = Math.abs(nz);
      const face = ex >= ey && ex >= ez ? (nx >= 0 ? 0 : 1) : ey >= ez ? (ny >= 0 ? 2 : 3) : nz >= 0 ? 4 : 5;
      c.set(FACES[face]);
      for (let v = 0; v < 3; v++) {
        colours[i + v * 3] = c.r;
        colours[i + v * 3 + 1] = c.g;
        colours[i + v * 3 + 2] = c.b;
      }
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colours, 3));

    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: OPACITY,
      // The mesh is not watertight and the sphere stage self-overlaps, so back
      // faces must draw. Without depthWrite the layers blend evenly instead of
      // fighting over who is in front.
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const group = new THREE.Group();
    group.add(mesh);

    // A faint wire over the top, so the facets stay legible at 42% opacity.
    const wire = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color: 0xf5c518,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
        depthWrite: false,
      })
    );
    group.add(wire);

    const scene = new THREE.Scene();
    scene.add(group);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 2.6, 14.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(cappedPixelRatio());
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    const phases: Phase[] = [
      { name: 'cube', target: cube, morph: 1.6, hold: 1.4 },
      { name: 'sphere', target: sphere, morph: 1.5, hold: 1.2 },
      { name: 'a380', target: plane.slice(), morph: 1.8, hold: 3.2 },
    ];
    const cycle = phases.reduce((s, p) => s + p.morph + p.hold, 0);

    const attribute = geometry.getAttribute('position') as THREE.BufferAttribute;
    const live = attribute.array as Float32Array;

    const paint = (elapsed: number) => {
      let t = elapsed % cycle;
      let from = phases[phases.length - 1].target;
      let to = phases[0].target;
      let progress = 1;

      for (let i = 0; i < phases.length; i++) {
        const p = phases[i];
        if (t < p.morph) {
          from = phases[(i - 1 + phases.length) % phases.length].target;
          to = p.target;
          progress = easeInOutCubic(t / p.morph);
          break;
        }
        t -= p.morph;
        if (t < p.hold) {
          from = p.target;
          to = p.target;
          progress = 1;
          break;
        }
        t -= p.hold;
      }

      for (let i = 0; i < live.length; i++) {
        live[i] = from[i] + (to[i] - from[i]) * progress;
      }
      attribute.needsUpdate = true;
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

    /** The still frame: the finished aircraft, three-quarter view. */
    const restingAt = cycle - phases[phases.length - 1].hold / 2;
    const still = () => {
      group.rotation.set(0.16, -0.62, 0);
      paint(restingAt);
    };

    let frame = 0;
    let last = 0;
    let running = false;
    // Accumulated, not read from the clock, so the loop always begins on the
    // cube rather than entering at an arbitrary point mid-morph.
    let elapsed = 0;

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;

      group.rotation.y += dt * 0.32;
      group.rotation.x = 0.16 + Math.sin(elapsed / 5) * 0.07;
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
      (wire.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (active) controls.current?.start();
    else controls.current?.stop();
  }, [active]);

  return (
    <DemoShell innerRef={ref} label="3D viewport" bare>
      <div
        className="absolute left-1/2 top-1/2 w-[70%] h-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(245,197,24,0.10) 0%, rgba(124,92,191,0.06) 42%, transparent 72%)',
        }}
      />
      <div ref={host} className="absolute inset-0" />
    </DemoShell>
  );
}
