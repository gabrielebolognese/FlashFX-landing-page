'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cappedPixelRatio } from '@/lib/render-gate';
import { useAmbient } from '@/lib/motion';
import { DEMO_PRIORITY } from './demo-kit';

/*
 * The 2.5D camera, shown from outside and from behind the lens at once.
 *
 * ── Why two views, and why that is the whole demo ───────────────────────────
 *
 * 2.5D is an awkward thing to show, because a finished shot looks like 3D and a
 * still of the rig looks like a stack of cards. Neither picture on its own says
 * what happened. So this renders both, from one scene, every frame:
 *
 *   • the big view is the rig — five perfectly flat layers standing in space,
 *     the camera as an object, and its frustum drawn in front of it;
 *   • the inset is what that camera sees, live.
 *
 * The claim is only legible in the gap between them. On the left the layers are
 * obviously flat cutouts with nothing behind them; on the right they resolve
 * into a scene with depth, because the camera is moving and each one slides at
 * its own rate. Nothing is faked between the two: it is one `THREE.Scene`
 * rendered twice with two cameras.
 *
 * ── Which is why it must be full width ──────────────────────────────────────
 *
 * A split-screen section would put the rig in half a column and the inset in a
 * corner of that, at which point the parallax is too small to read and the
 * argument dies. The section gives it the whole viewport.
 *
 * ── Layer visibility ────────────────────────────────────────────────────────
 *
 * three.js layer 1 holds everything that belongs to the *rig* rather than the
 * *shot*: the frustum helper, the camera body, the outline around each card.
 * The observer camera enables it; the shot camera does not. That is what keeps
 * the inset a clean frame instead of a picture of its own scaffolding.
 *
 * ── Drag ────────────────────────────────────────────────────────────────────
 *
 * Orbiting the observer is the interaction that carries the point. Swing round
 * towards side-on and the layers collapse to lines, because they genuinely have
 * no thickness, while the inset carries on showing a deep scene. Momentum and
 * the grant rules follow `PlaneViewer`, and drag keeps working when the
 * governor has denied a slot — an object that ignores the pointer reads as
 * broken rather than as restrained.
 */

/*
 * Where the layers stand. Silhouettes are built with their base at y = 0 so the
 * horizons line up in the shot; the sky carries its own centre.
 *
 * The sizes are not eyeballed. Each width is the smallest that still covers the
 * shot camera's frame at that depth across the whole dolly, computed by
 * unprojecting the frame corners onto the plane — a layer one unit too narrow
 * opens a gap at the edge of the shot at exactly one point in the loop, which
 * is the kind of bug that only ever shows up in a screen recording.
 */
const LAYERS = [
  { z: -26, w: 58, h: 38, y: 8, kind: 'sky' as const, colour: 0x152a55 },
  { z: -19, w: 50, h: 17, y: 0, kind: 'ridge' as const, colour: 0x14274f },
  { z: -12, w: 40, h: 13, y: 0, kind: 'ridge' as const, colour: 0x0e1b3a },
  { z: -5, w: 32, h: 10, y: 0, kind: 'trees' as const, colour: 0x080f22 },
  { z: 1, w: 26, h: 8, y: 0, kind: 'trees' as const, colour: 0x04070f },
];

/*
 * The shot camera's path.
 *
 * A 30mm-ish lens rather than a wide one: a wide lens would need a backdrop
 * half again as large to cover the frame, and that backdrop then dominates the
 * rig view. The dolly runs z = 9 → 19, which is what produces the parallax.
 */
const SHOT_FOV = 30;
const SHOT_Z = 14;
const SHOT_DOLLY = 5;
const SHOT_PAN = 4.5;

/** Rig lines, the frustum and the card outlines. */
const RIG_LAYER = 1;

const ACCENT = 0xf5c518;

/*
 * Observer orbit.
 *
 * The distance is **fitted at runtime to the scene's bounding sphere**, not
 * chosen. A sphere is the same size from every direction, so `radius / sin(half
 * fov)` frames the rig at any orbit angle and any viewport shape, which a fixed
 * number cannot: tuning one by hand fits the pose it was tuned at and crops
 * somewhere else on the orbit. The sphere covers the four near layers and the
 * whole camera path. The sky is left out on purpose — a backdrop that runs off
 * the edge of the frame is what a backdrop does, and including it would push
 * the observer so far back that the rig lost its perspective.
 */
const OBSERVER_FOV = 45;
const FIT_MARGIN = 1.02;
const PITCH_LIMIT = 0.45;
const DRAG_X = 0.0055;
const DRAG_Y = 0.0038;
const FRICTION = 0.93;

/** The inset, as a fraction of the canvas width. */
const INSET_W = 0.32;
const INSET_W_SM = 0.46;
const INSET_MARGIN = 0.025;

type Rect = { x: number; y: number; w: number; h: number };

/**
 * A deterministic generator, so the same landscape is built on every visit and
 * on every machine. `Math.random()` here would mean the screenshot in a bug
 * report never matches the thing being reported.
 */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** A mountain silhouette: peaks across the width, base at y = 0. */
function ridgeShape(w: number, h: number, peaks: number, rnd: () => number) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  const steps = peaks * 5;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const swell = (Math.sin(t * Math.PI * peaks - Math.PI / 2) + 1) / 2;
    shape.lineTo(-w / 2 + t * w, h * (0.22 + swell * 0.62 + (rnd() - 0.5) * 0.16));
  }
  shape.lineTo(w / 2, 0);
  shape.closePath();
  return shape;
}

/** A treeline: a ground band with conifers standing on it. */
function treeShapes(w: number, h: number, count: number, rnd: () => number) {
  const shapes: THREE.Shape[] = [];

  const ground = new THREE.Shape();
  ground.moveTo(-w / 2, 0);
  ground.lineTo(w / 2, 0);
  ground.lineTo(w / 2, h * 0.2);
  ground.lineTo(-w / 2, h * 0.24);
  ground.closePath();
  shapes.push(ground);

  const step = w / count;
  for (let i = 0; i < count; i++) {
    const x = -w / 2 + (i + 0.5 + (rnd() - 0.5) * 0.7) * step;
    const th = h * (0.34 + rnd() * 0.46);
    const tw = th * 0.34;
    const base = h * 0.16;

    // One polygon per tree rather than stacked triangles: at this scale the
    // silhouette is all that survives, and a single contour is a third of the
    // vertices.
    const tree = new THREE.Shape();
    tree.moveTo(x - tw / 2, base);
    tree.lineTo(x - tw * 0.16, base + th * 0.55);
    tree.lineTo(x - tw * 0.3, base + th * 0.52);
    tree.lineTo(x, base + th);
    tree.lineTo(x + tw * 0.3, base + th * 0.52);
    tree.lineTo(x + tw * 0.16, base + th * 0.55);
    tree.lineTo(x + tw / 2, base);
    tree.closePath();
    shapes.push(tree);
  }
  return shapes;
}

/** The shot camera's position at a given time. Also sampled to fit the orbit. */
function shotPosition(t: number) {
  return new THREE.Vector3(
    Math.sin(t * 0.31) * SHOT_PAN,
    2.6 + Math.sin(t * 0.23) * 1.4,
    SHOT_Z + Math.sin(t * 0.17) * SHOT_DOLLY
  );
}

export function CameraRig({ className }: { className?: string }) {
  const { ref, active } = useAmbient<HTMLDivElement>({ priority: DEMO_PRIORITY });
  const host = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const wake = useRef<(() => void) | null>(null);
  const [touched, setTouched] = useState(false);
  /* The inset is drawn by WebGL, but its frame and label are DOM. Both read
     this, so the border cannot drift away from the viewport it outlines. */
  const [inset, setInset] = useState<Rect | null>(null);

  activeRef.current = active;

  useEffect(() => {
    const container = host.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const disposables: Array<{ dispose: () => void }> = [];

    /* ── The layers ──────────────────────────────────────────────────────── */

    const rnd = seeded(20250809);

    LAYERS.forEach((layer, i) => {
      let geometry: THREE.BufferGeometry;

      if (layer.kind === 'sky') {
        geometry = new THREE.PlaneGeometry(layer.w, layer.h, 1, 6);
        // A gradient painted into the vertices: no texture to load, no second
        // material, and it survives any resize.
        const pos = geometry.getAttribute('position');
        const colours = new Float32Array(pos.count * 3);
        const top = new THREE.Color(0x070b18);
        const horizon = new THREE.Color(0x1d3f7e);
        const c = new THREE.Color();
        for (let v = 0; v < pos.count; v++) {
          const t = (pos.getY(v) + layer.h / 2) / layer.h;
          c.copy(horizon).lerp(top, Math.pow(t, 0.75));
          colours[v * 3] = c.r;
          colours[v * 3 + 1] = c.g;
          colours[v * 3 + 2] = c.b;
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colours, 3));
      } else if (layer.kind === 'ridge') {
        geometry = new THREE.ShapeGeometry(ridgeShape(layer.w, layer.h, 3 + i, rnd));
      } else {
        geometry = new THREE.ShapeGeometry(treeShapes(layer.w, layer.h, 9 + i * 3, rnd));
      }

      const material = new THREE.MeshBasicMaterial({
        color: layer.colour,
        vertexColors: layer.kind === 'sky',
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);

      /*
       * The sky is centred on its own height; every other layer is built with
       * its base at y = 0 and stands on the ground line. That shared base is
       * what makes the horizons line up in the shot.
       */
      mesh.position.set(0, layer.y, layer.z);
      scene.add(mesh);
      disposables.push(geometry, material);

      /*
       * The outline that says "this is a flat card". Rig-only: in the shot it
       * would be a rectangle drawn across the sky.
       */
      const edge = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-layer.w / 2, 0, 0),
          new THREE.Vector3(layer.w / 2, 0, 0),
          new THREE.Vector3(layer.w / 2, layer.h, 0),
          new THREE.Vector3(-layer.w / 2, layer.h, 0),
        ]),
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.16 })
      );
      edge.position.set(0, layer.y - (layer.kind === 'sky' ? layer.h / 2 : 0), layer.z);
      edge.layers.set(RIG_LAYER);
      scene.add(edge);
      disposables.push(edge.geometry, edge.material as THREE.Material);
    });

    /* The ground line the cards stand on, so the rig reads as a set rather than
       as five floating rectangles. */
    const rail = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, LAYERS[0].z - 4),
        new THREE.Vector3(0, 0, 24),
      ]),
      new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.22 })
    );
    rail.layers.set(RIG_LAYER);
    scene.add(rail);
    disposables.push(rail.geometry, rail.material as THREE.Material);

    /* ── The camera in the scene ─────────────────────────────────────────── */

    /*
     * `far` is 54 rather than something generous, because the frustum helper
     * draws to it: a far plane out at 200 would put most of the rig view inside
     * a box. 54 clears the sky layer at its furthest and no more.
     */
    const shot = new THREE.PerspectiveCamera(SHOT_FOV, 16 / 9, 0.5, 54);
    scene.add(shot);

    const helper = new THREE.CameraHelper(shot);
    helper.setColors(
      new THREE.Color(ACCENT),
      new THREE.Color(ACCENT),
      new THREE.Color(ACCENT),
      new THREE.Color(0xffffff),
      new THREE.Color(ACCENT)
    );
    (helper.material as THREE.LineBasicMaterial).transparent = true;
    (helper.material as THREE.LineBasicMaterial).opacity = 0.5;
    helper.layers.set(RIG_LAYER);
    scene.add(helper);
    disposables.push(helper.geometry, helper.material as THREE.Material);

    /* A body, so the frustum has something to come out of. */
    const body = new THREE.Group();
    const bodyMat = new THREE.MeshBasicMaterial({ color: ACCENT });
    const bodyWire = new THREE.MeshBasicMaterial({ color: 0x0b1020, wireframe: true });
    const boxGeo = new THREE.BoxGeometry(1.5, 1.1, 2.2);
    const lensGeo = new THREE.CylinderGeometry(0.42, 0.55, 1.1, 12);
    const box = new THREE.Mesh(boxGeo, bodyMat);
    body.add(box, new THREE.Mesh(boxGeo, bodyWire));
    const lens = new THREE.Mesh(lensGeo, bodyMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.z = -1.4;
    body.add(lens);
    body.traverse((o) => o.layers.set(RIG_LAYER));
    scene.add(body);
    disposables.push(boxGeo, lensGeo, bodyMat, bodyWire);

    /* ── The observer ────────────────────────────────────────────────────── */

    const observer = new THREE.PerspectiveCamera(OBSERVER_FOV, 1, 0.5, 900);
    observer.layers.enable(RIG_LAYER);

    /*
     * What the observer has to keep in frame: the near layers, and everywhere
     * the camera goes. Sampled rather than solved because the path is a sum of
     * sines and the extremes of the three do not coincide.
     */
    const fitBox = new THREE.Box3();
    LAYERS.filter((l) => l.kind !== 'sky').forEach((l) => {
      fitBox.expandByPoint(new THREE.Vector3(-l.w / 2, l.y, l.z));
      fitBox.expandByPoint(new THREE.Vector3(l.w / 2, l.y + l.h, l.z));
    });
    for (let i = 0; i < 200; i++) fitBox.expandByPoint(shotPosition((i / 200) * 37));
    const fitSphere = new THREE.Sphere();
    fitBox.getBoundingSphere(fitSphere);
    let orbitRadius = fitSphere.radius * 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(cappedPixelRatio());
    // Two viewports in one canvas: each clears its own scissor rect, so the
    // renderer must not clear the whole buffer between them.
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.cursor = 'grab';
    // Vertical scrolling stays with the browser: a full-width canvas that
    // swallowed a downward swipe would trap a phone halfway down the page.
    canvas.style.touchAction = 'pan-y';

    let yaw = 0.82;
    let pitch = 0.2;
    let velYaw = 0;
    let velPitch = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    /** Only advances while a slot is granted, so a parked demo holds a pose. */
    let clock = 0;

    let w = 0;
    let h = 0;
    let rect: Rect = { x: 0, y: 0, w: 0, h: 0 };

    const layoutInset = () => {
      const iw = w * (w < 640 ? INSET_W_SM : INSET_W);
      const ih = iw * (9 / 16);
      const m = w * INSET_MARGIN;
      rect = { x: w - iw - m, y: m, w: iw, h: ih };
      shot.aspect = 16 / 9;
      shot.updateProjectionMatrix();
      // The DOM frame is measured from the top; WebGL viewports from the
      // bottom. Converting here keeps the flip in one place.
      setInset({ x: rect.x, y: h - rect.h - m, w: rect.w, h: rect.h });
    };

    const place = () => {
      const t = clock;

      /*
       * The dolly is the animation. Sliding the camera from 22 down to 8 on z
       * is what separates the layers: the foreground card sweeps across the
       * frame while the sky barely moves, which is parallax, which is the only
       * thing that ever makes flat art read as deep.
       */
      shot.position.copy(shotPosition(t));
      shot.lookAt(Math.sin(t * 0.19) * 2.5, 3.4 + Math.sin(t * 0.27) * 1.0, -16);
      shot.updateMatrixWorld();
      helper.update();

      body.position.copy(shot.position);
      body.quaternion.copy(shot.quaternion);

      observer.position.set(
        fitSphere.center.x + Math.sin(yaw) * Math.cos(pitch) * orbitRadius,
        fitSphere.center.y + Math.sin(pitch) * orbitRadius,
        fitSphere.center.z + Math.cos(yaw) * Math.cos(pitch) * orbitRadius
      );
      observer.lookAt(fitSphere.center);
    };

    const draw = () => {
      if (!w || !h) return;
      place();

      renderer.setScissorTest(true);

      renderer.setViewport(0, 0, w, h);
      renderer.setScissor(0, 0, w, h);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(scene, observer);

      renderer.setViewport(rect.x, rect.y, rect.w, rect.h);
      renderer.setScissor(rect.x, rect.y, rect.w, rect.h);
      // Opaque, so the shot is a frame rather than a hole through to the page.
      renderer.setClearColor(0x05070f, 1);
      renderer.clear();
      renderer.render(scene, shot);

      renderer.setScissorTest(false);
    };

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      w = clientWidth;
      h = clientHeight;
      renderer.setSize(w, h, false);
      observer.aspect = w / h;
      observer.updateProjectionMatrix();

      const vHalf = THREE.MathUtils.degToRad(observer.fov) / 2;
      const hHalf = Math.atan(Math.tan(vHalf) * observer.aspect);
      orbitRadius = (fitSphere.radius / Math.sin(Math.min(vHalf, hHalf))) * FIT_MARGIN;
      layoutInset();
      draw();
    };
    const observerRO = new ResizeObserver(resize);
    observerRO.observe(container);
    resize();

    let frame = 0;
    let running = false;
    let last = 0;

    const shouldRun = () =>
      activeRef.current || dragging || Math.abs(velYaw) > 0.0004 || Math.abs(velPitch) > 0.0004;

    const loop = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (activeRef.current) clock += dt;

      if (!dragging) {
        yaw += velYaw;
        pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch + velPitch));
        velYaw *= FRICTION;
        velPitch *= FRICTION;
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
      yaw -= dx;
      pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch + dy));
      velYaw = -dx;
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
      observerRO.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, []);

  // The loop parks itself when there is nothing left to do, so a fresh grant
  // from the governor has to wake it.
  useEffect(() => {
    if (active) wake.current?.();
  }, [active]);

  return (
    <div ref={ref} className={className}>
      <div ref={host} className="absolute inset-0" />

      {/* The frame around the shot. Border only: the picture underneath is
          WebGL, and anything opaque here would cover it. */}
      {inset && (
        <div
          className="absolute rounded-md pointer-events-none"
          style={{
            left: inset.x,
            top: inset.y,
            width: inset.w,
            height: inset.h,
            border: '1px solid rgba(245,197,24,0.45)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.55)',
          }}
        >
          <span
            className="absolute -top-5 left-0 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: 'rgba(245,197,24,0.85)' }}
          >
            camera view
          </span>
        </div>
      )}

      <span className="absolute top-4 left-5 font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary/60 pointer-events-none">
        five flat layers, one camera
      </span>

      <span
        className={`absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary/60 pointer-events-none transition-opacity duration-500 ${
          touched ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Drag to orbit the rig
      </span>
    </div>
  );
}
