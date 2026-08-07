'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cappedPixelRatio } from '@/lib/render-gate';
import { useAmbient } from '@/lib/motion';
import { DEMO_PRIORITY } from './demo-kit';
import { A380_POSITIONS, A380_INDICES } from './a380-geometry';

/*
 * The A380, rotatable (immersionmilestones.md I8).
 *
 * Replaced the cube → sphere → aeroplane morph on 2026-08-07: the morph is gone
 * and only its last stage remains, moved beside the section's title so the page
 * is a column shorter.
 *
 * This is a recreation of an animation the founder built in FlashFX — see
 * FIX.md *Canonical facts*, "3D capability". FlashFX imports and animates 3D
 * objects; it is **not** a sculpting tool, and no copy here may imply
 * otherwise.
 *
 * Geometry is baked from a 107 MB Roblox OBJ down to 2,324 triangles — see
 * `a380-geometry.ts`. Nothing is fetched at runtime.
 *
 * With the morph gone, no vertex data changes between frames: the loop only
 * writes a rotation, so this is dramatically cheaper than the version it
 * replaced, which rewrote 20,916 floats every frame.
 */

const FACES = ['#F5C518', '#7C5CBF', '#E6EDF3', '#2D6BE4', '#4ADE80', '#F97362'];
const OPACITY = 0.42;

/** Idle drift, radians per second, while nobody is holding it. */
const AUTO_SPIN = 0.2;

/** Pointer pixels → radians. */
const DRAG_X = 0.0072;
const DRAG_Y = 0.005;

/** How far the nose may be tipped up or down. Stops it going upside down. */
const PITCH_LIMIT = 0.85;

/** Per-frame momentum decay after release. */
const FRICTION = 0.93;

export function PlaneViewer({ className }: { className?: string }) {
  const { ref, active } = useAmbient<HTMLDivElement>({ priority: DEMO_PRIORITY });
  const host = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const wake = useRef<(() => void) | null>(null);
  const [touched, setTouched] = useState(false);

  activeRef.current = active;

  useEffect(() => {
    const container = host.current;
    if (!container) return;

    const indexed = new THREE.BufferGeometry();
    indexed.setAttribute('position', new THREE.Float32BufferAttribute(A380_POSITIONS, 3));
    indexed.setIndex(A380_INDICES);
    // Non-indexed so every triangle owns its vertices and can take a flat
    // colour of its own.
    const geometry = indexed.toNonIndexed();
    indexed.dispose();

    const pos = (geometry.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;
    const colours = new Float32Array(pos.length);
    const c = new THREE.Color();

    for (let t = 0; t < pos.length / 3; t += 3) {
      const i = t * 3;
      const ax = pos[i + 3] - pos[i], ay = pos[i + 4] - pos[i + 1], az = pos[i + 5] - pos[i + 2];
      const bx = pos[i + 6] - pos[i], by = pos[i + 7] - pos[i + 1], bz = pos[i + 8] - pos[i + 2];
      const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;

      // Dominant axis of the face normal picks one of six colours — the cube's
      // six faces, generalised to an arbitrary mesh.
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
      // The mesh is not watertight, so back faces must draw; without depthWrite
      // the layers blend evenly rather than fighting over which is in front.
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const group = new THREE.Group();
    group.add(new THREE.Mesh(geometry, material));

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5c518,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
      depthWrite: false,
    });
    group.add(new THREE.Mesh(geometry, wireMaterial));

    const scene = new THREE.Scene();
    scene.add(group);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 2.4, 15.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(cappedPixelRatio());
    container.appendChild(renderer.domElement);
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.cursor = 'grab';
    /*
     * `pan-y`, not `none`. The browser keeps vertical scrolling, so a visitor
     * swiping down the page on a phone is not trapped by a large canvas; we
     * take the horizontal gesture, which is the one that rotates.
     */
    canvas.style.touchAction = 'pan-y';

    let yaw = -0.62;
    let pitch = 0.16;
    let velYaw = 0;
    let velPitch = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const draw = () => {
      group.rotation.set(pitch, yaw, 0);
      renderer.render(scene, camera);
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    let frame = 0;
    let running = false;
    let last = 0;

    /*
     * The loop runs while there is something to do: the governor has granted an
     * idle spin, a pointer is down, or momentum is still bleeding off. Drag has
     * to work even when a slot is denied — otherwise the object would simply
     * not respond, which reads as broken rather than as restrained.
     */
    const shouldRun = () =>
      activeRef.current || dragging || Math.abs(velYaw) > 0.0004 || Math.abs(velPitch) > 0.0004;

    const loop = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (!dragging) {
        yaw += velYaw;
        pitch += velPitch;
        velYaw *= FRICTION;
        velPitch *= FRICTION;
        if (activeRef.current) yaw += AUTO_SPIN * dt;
        pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch));
      }

      draw();

      if (shouldRun()) {
        frame = requestAnimationFrame(loop);
      } else {
        running = false;
        last = 0;
      }
    };

    const start = () => {
      if (running || !shouldRun()) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(loop);
    };
    wake.current = start;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velYaw = 0;
      velPitch = 0;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
      setTouched(true);
      start();
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = (e.clientX - lastX) * DRAG_X;
      const dy = (e.clientY - lastY) * DRAG_Y;
      lastX = e.clientX;
      lastY = e.clientY;
      yaw += dx;
      pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch + dy));
      // Carry the last movement into momentum, so a flick keeps spinning.
      velYaw = dx;
      velPitch = dy;
      start();
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      canvas.style.cursor = 'grab';
      start();
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    draw();
    start();

    return () => {
      wake.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      geometry.dispose();
      material.dispose();
      wireMaterial.dispose();
      renderer.dispose();
      // Hand the context back rather than leaving it to be reclaimed.
      renderer.forceContextLoss();
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, []);

  // The loop parks itself when there is nothing to do, so a fresh grant has to
  // wake it.
  useEffect(() => {
    if (active) wake.current?.();
  }, [active]);

  return (
    <div ref={ref} className={className}>
      <div ref={host} className="absolute inset-0" />

      <span
        className={`absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary/60 pointer-events-none transition-opacity duration-500 ${
          touched ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Drag to rotate
      </span>
    </div>
  );
}
