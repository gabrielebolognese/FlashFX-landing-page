'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cappedPixelRatio } from '@/lib/render-gate';
import { useAmbient } from '@/lib/motion';
import { DEMO_PRIORITY } from './demo-kit';

/*
 * The 2.5D camera: a flat image coming apart into layers, and a camera put
 * through the gap.
 *
 * ── The sequence is the argument ────────────────────────────────────────────
 *
 * It opens on what looks like an ordinary flat picture, panning the way any 2D
 * artwork pans. Then the picture comes apart: the layers slide back to their own
 * depths and the view pulls out and around to show that the thing that was flat
 * a second ago is now standing in space. Only then does the camera arrive, with
 * its field drawn in front of it.
 *
 * Stated as three claims it is forgettable. Shown as one continuous move it is
 * the product: *this is your flat artwork, and this is what happens to it.*
 *
 * ── Everything is one scene ─────────────────────────────────────────────────
 *
 * The flat state and the deep state are the same five meshes. Compaction is
 * `z → 0` with a matching scale-down, so a layer that belongs far back and large
 * ends up near and small enough to occupy exactly the frame it did before —
 * which is what makes the transition read as one image separating rather than as
 * a crossfade between two arrangements.
 *
 * ── Holding the camera ──────────────────────────────────────────────────────
 *
 * The camera's own view is not on screen by default; the rig is. Press and hold
 * the camera and its view opens in a panel, live, from the same scene. It is
 * non-modal — nothing is blocked, nothing has to be dismissed, and letting go
 * puts it away. A viewfinder you hold down fits "look through it" better than a
 * second window permanently competing with the rig for attention.
 *
 * ── Layer visibility ────────────────────────────────────────────────────────
 *
 * three.js layer 1 holds everything belonging to the *rig* rather than the
 * *shot*: the frustum, the camera body, the outline on each card. The observer
 * enables it, the shot does not, so the held panel is a clean frame instead of a
 * picture of its own scaffolding.
 */

/*
 * The layers.
 *
 * Widths are the smallest that still cover the shot camera's frame at that
 * depth across the whole dolly, computed by unprojecting the frame corners onto
 * each plane. One unit narrow and an end drifts into view at exactly one point
 * in the loop. The backdrop is deliberately wider than that minimum, because the
 * opening pan needs somewhere to go: the frame has to sit *inside* the artwork
 * or panning would run off the edge of it.
 */
const LAYERS = [
  { z: -37, w: 86, h: 50, y: 8, kind: 'sky' as const, colour: 0x152a55 },
  { z: -27, w: 58, h: 20, y: 0, kind: 'ridge' as const, colour: 0x14274f },
  { z: -17, w: 45, h: 15, y: 0, kind: 'ridge' as const, colour: 0x0e1b3a },
  /* Warm treelines, to sit in the site's palette: amber behind, burnt orange in
     front, so the pair still reads back-to-front against the blue ridges. */
  { z: -7, w: 35, h: 11, y: 0, kind: 'trees' as const, colour: 0xe9a227 },
  { z: 3, w: 26, h: 8, y: 0, kind: 'trees' as const, colour: 0xa8541a },
];

/** The backdrop, which every layer matches when the picture is compact. */
const ART_W = LAYERS[0].w;
const ART_H = LAYERS[0].h;
const ART_Y = LAYERS[0].y;

/* The shot camera's path. A 30mm-ish lens: wider would need a backdrop half
   again as large to cover the frame, and that backdrop then dominates the rig. */
const SHOT_FOV = 30;
const SHOT_Z = 16;
const SHOT_DOLLY = 6;
const SHOT_PAN = 4.5;

const RIG_LAYER = 1;
const ACCENT = 0xf5c518;
/** The plane's six face colours, reused so the camera reads as the same kit. */
const FACES = [0xf5c518, 0x7c5cbf, 0xe6edf3, 0x2d6be4, 0x4ade80, 0xf97362];

/*
 * The observer's distance is fitted at runtime to the scene's bounding sphere,
 * not chosen. A sphere is the same size from every direction, so `radius / sin
 * (half fov)` frames the rig at any orbit angle and any viewport shape; a
 * hand-tuned number fits the pose it was tuned at and crops somewhere else.
 */
const OBSERVER_FOV = 45;
const FIT_MARGIN = 1.02;
const PITCH_LIMIT = 0.45;
const YAW_REST = 0.82;
const PITCH_REST = 0.2;

/** How far inside the artwork the opening frame sits, leaving room to pan. */
const FLAT_INSET = 0.88;

/** The body, as a fraction of the fitted radius, so it holds its apparent size. */
const BODY_FRACTION = 0.2;

/* The opening, in seconds: pan the flat picture, come apart, camera arrives. */
const T_PAN = 2.4;
const T_SPREAD = 3;
const T_CAMERA = 1.2;
const INTRO_END = T_PAN + T_SPREAD + T_CAMERA;

const DRAG_X = 0.0055;
const DRAG_Y = 0.0038;
const FRICTION = 0.93;

/** The held panel, as a fraction of the canvas. */
const PANEL_W = 0.34;
const PANEL_MIN = 200;
const PANEL_MAX = 460;
const PANEL_MARGIN = 0.03;

type Rect = { x: number; y: number; w: number; h: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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

/**
 * Six flat colours across a mesh, chosen by each face's dominant normal axis.
 *
 * The same treatment `PlaneViewer` gives the A380, for the same reason: a
 * single-colour translucent solid loses all its edges when it turns, while
 * per-face colour keeps the form readable from any angle. Non-indexed first, so
 * every triangle owns its vertices and can take a colour of its own.
 */
function faceted(source: THREE.BufferGeometry) {
  const geometry = source.index ? source.toNonIndexed() : source;
  if (geometry !== source) source.dispose();

  const pos = (geometry.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;
  const colours = new Float32Array(pos.length);
  const c = new THREE.Color();

  for (let t = 0; t < pos.length / 3; t += 3) {
    const i = t * 3;
    const ax = pos[i + 3] - pos[i], ay = pos[i + 4] - pos[i + 1], az = pos[i + 5] - pos[i + 2];
    const bx = pos[i + 6] - pos[i], by = pos[i + 7] - pos[i + 1], bz = pos[i + 8] - pos[i + 2];
    const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
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
  return geometry;
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
  /* The panel is drawn by WebGL; its frame and label are DOM. Both read this,
     so the border cannot drift away from the viewport it outlines. Written on
     resize only — never per frame. */
  const [panel, setPanel] = useState<Rect | null>(null);
  const [holding, setHolding] = useState(false);

  activeRef.current = active;

  useEffect(() => {
    const container = host.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const disposables: Array<{ dispose: () => void }> = [];
    const rnd = seeded(20250809);

    /* ── The layers ──────────────────────────────────────────────────────── */

    type Card = {
      mesh: THREE.Mesh;
      edge: THREE.LineLoop;
      z: number;
      flatZ: number;
      compact: number;
      baseY: number;
      edgeY: number;
    };
    const cards: Card[] = [];

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
      mesh.position.set(0, layer.y, layer.z);
      scene.add(mesh);
      disposables.push(geometry, material);

      /* The outline that says "this is a flat card". Rig-only: in the shot it
         would be a rectangle drawn across the sky. */
      const edge = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-layer.w / 2, 0, 0),
          new THREE.Vector3(layer.w / 2, 0, 0),
          new THREE.Vector3(layer.w / 2, layer.h, 0),
          new THREE.Vector3(-layer.w / 2, layer.h, 0),
        ]),
        new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.16 })
      );
      edge.layers.set(RIG_LAYER);
      scene.add(edge);
      disposables.push(edge.geometry, edge.material as THREE.Material);

      cards.push({
        mesh,
        edge,
        z: layer.z,
        /*
         * Where this card sits when the picture is compact. Not all at zero:
         * five coplanar meshes z-fight, and their stacking order is what says
         * which is in front. A tenth of a unit apart is invisible and enough.
         */
        flatZ: (i - 2) * 0.12,
        /*
         * Scaled so every layer is exactly as wide as the backdrop when
         * compact. Without this the flat state is a set of nested rectangles of
         * obviously different sizes, which reads as a stack of cards — the one
         * thing the opening is trying not to look like yet.
         */
        compact: ART_W / layer.w,
        baseY: layer.y,
        /* The outline is drawn from y = 0 up, so a centred layer needs it
           dropped by half its height. Scaling moves that offset too. */
        edgeY: layer.kind === 'sky' ? -layer.h / 2 : 0,
      });
    });

    /* The rail the cards stand on, so the rig reads as a set rather than as
       five floating rectangles. */
    const rail = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, LAYERS[0].z - 6),
        new THREE.Vector3(0, 0, 30),
      ]),
      new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.22 })
    );
    rail.layers.set(RIG_LAYER);
    scene.add(rail);
    const railMat = rail.material as THREE.LineBasicMaterial;
    disposables.push(rail.geometry, railMat);

    /* ── What the observer has to keep in frame ──────────────────────────── */

    const fitBox = new THREE.Box3();
    LAYERS.filter((l) => l.kind !== 'sky').forEach((l) => {
      fitBox.expandByPoint(new THREE.Vector3(-l.w / 2, l.y, l.z));
      fitBox.expandByPoint(new THREE.Vector3(l.w / 2, l.y + l.h, l.z));
    });
    // Sampled rather than solved: the path is a sum of sines and the extremes of
    // the three do not coincide.
    for (let i = 0; i < 200; i++) fitBox.expandByPoint(shotPosition((i / 200) * 40));
    const fitSphere = new THREE.Sphere();
    fitBox.getBoundingSphere(fitSphere);

    /*
     * The body is sized *from* the fit rather than in absolute units, so it
     * keeps the same share of the frame however deep the scene gets. Pushing the
     * layers further apart widens the fit and would otherwise shrink the camera
     * to a speck — which is exactly what happened when the depths grew.
     */
    const span = fitSphere.radius * BODY_FRACTION;
    const bodyHalf = new THREE.Vector3(span * 0.34, span * 0.25, span * 0.5);
    const bodyRadius = bodyHalf.length();
    // The path samples are points; the body around them is not.
    fitSphere.radius += bodyRadius;

    /* ── The camera in the scene ─────────────────────────────────────────── */

    /* `far` is trimmed to just clear the backdrop, because the frustum helper
       draws to it: a far plane at 200 would put the whole rig inside a box. */
    const shot = new THREE.PerspectiveCamera(SHOT_FOV, 16 / 9, 0.5, 62);
    scene.add(shot);

    const helper = new THREE.CameraHelper(shot);
    helper.setColors(
      new THREE.Color(ACCENT),
      new THREE.Color(ACCENT),
      new THREE.Color(ACCENT),
      new THREE.Color(0xffffff),
      new THREE.Color(ACCENT)
    );
    const helperMat = helper.material as THREE.LineBasicMaterial;
    helperMat.transparent = true;
    helper.layers.set(RIG_LAYER);
    scene.add(helper);
    disposables.push(helper.geometry, helperMat);

    const body = new THREE.Group();
    const bodyMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const bodyWire = new THREE.MeshBasicMaterial({
      color: ACCENT,
      wireframe: true,
      transparent: true,
      depthWrite: false,
    });

    const boxGeo = faceted(new THREE.BoxGeometry(bodyHalf.x * 2, bodyHalf.y * 2, bodyHalf.z * 2));
    const lensGeo = faceted(new THREE.CylinderGeometry(span * 0.19, span * 0.25, span * 0.5, 12));
    body.add(new THREE.Mesh(boxGeo, bodyMat), new THREE.Mesh(boxGeo, bodyWire));

    const lens = new THREE.Mesh(lensGeo, bodyMat);
    const lensWire = new THREE.Mesh(lensGeo, bodyWire);
    lens.rotation.x = Math.PI / 2;
    lensWire.rotation.copy(lens.rotation);
    lens.position.z = -bodyHalf.z - span * 0.14;
    lensWire.position.copy(lens.position);
    body.add(lens, lensWire);

    body.traverse((o) => o.layers.set(RIG_LAYER));
    scene.add(body);
    disposables.push(boxGeo, lensGeo, bodyMat, bodyWire);

    /* ── The observer ────────────────────────────────────────────────────── */

    const observer = new THREE.PerspectiveCamera(OBSERVER_FOV, 1, 0.5, 1400);
    observer.layers.enable(RIG_LAYER);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(cappedPixelRatio());
    // Two viewports share one canvas while the panel is open, and each clears
    // its own scissor rect, so the renderer must not clear the whole buffer
    // between them.
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

    let yaw = YAW_REST;
    let pitch = PITCH_REST;
    let velYaw = 0;
    let velPitch = 0;
    let dragging = false;
    let held = false;
    let lastX = 0;
    let lastY = 0;

    /** Both advance only while a slot is granted, so a parked demo holds a pose. */
    let intro = 0;
    let shotClock = 0;

    let w = 0;
    let h = 0;
    let orbitRadius = fitSphere.radius * 4;
    let flatRadius = 60;
    let slackX = 0;
    let slackY = 0;
    let panelRect: Rect = { x: 0, y: 0, w: 0, h: 0 };

    const flatCentre = new THREE.Vector3(0, ART_Y, 0);
    const flatPos = new THREE.Vector3();
    const flatTarget = new THREE.Vector3();
    const orbitPos = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();

    const layout = () => {
      const vHalf = THREE.MathUtils.degToRad(OBSERVER_FOV) / 2;
      const hHalf = Math.atan(Math.tan(vHalf) * observer.aspect);

      orbitRadius = (fitSphere.radius / Math.sin(Math.min(vHalf, hHalf))) * FIT_MARGIN;

      /*
       * The opening frame is inscribed *inside* the artwork rather than fitted
       * around it: the pan has to stay on the picture, and a frame that merely
       * fits would show the void past its edge the moment it moved. Whichever
       * axis binds first sets the distance; what is left over on each axis is
       * how far the pan may travel.
       */
      flatRadius = Math.min(ART_H / 2 / Math.tan(vHalf), ART_W / 2 / Math.tan(hHalf)) * FLAT_INSET;
      slackX = Math.max(0, ART_W / 2 - flatRadius * Math.tan(hHalf));
      slackY = Math.max(0, ART_H / 2 - flatRadius * Math.tan(vHalf));

      const pw = Math.max(PANEL_MIN, Math.min(PANEL_MAX, w * PANEL_W));
      const ph = pw * (9 / 16);
      const m = Math.round(w * PANEL_MARGIN);
      // WebGL viewports measure from the bottom; the DOM frame from the top.
      panelRect = { x: w - pw - m, y: h - ph - m, w: pw, h: ph };
      setPanel({ x: panelRect.x, y: m, w: pw, h: ph });
    };

    const place = () => {
      const spread = easeInOut(clamp01((intro - T_PAN) / T_SPREAD));
      const arrival = clamp01((intro - T_PAN - T_SPREAD) / T_CAMERA);

      /* The layers: one compact picture, out to their own depths and sizes. */
      cards.forEach((card) => {
        const s = card.compact + (1 - card.compact) * spread;
        const z = card.flatZ + (card.z - card.flatZ) * spread;
        card.mesh.position.set(0, card.baseY, z);
        card.mesh.scale.setScalar(s);
        card.edge.position.set(0, card.baseY + card.edgeY * s, z);
        card.edge.scale.setScalar(s);
        // The outlines belong to the reveal, not to the flat picture.
        (card.edge.material as THREE.LineBasicMaterial).opacity = 0.16 * spread;
      });
      railMat.opacity = 0.22 * spread;

      /* The camera: absent, then arriving, then moving. */
      const shown = arrival > 0.001;
      body.visible = shown;
      helper.visible = shown;
      bodyMat.opacity = 0.55 * arrival;
      bodyWire.opacity = 0.35 * arrival;
      helperMat.opacity = 0.5 * arrival;

      shot.position.copy(shotPosition(shotClock));
      shot.lookAt(Math.sin(shotClock * 0.19) * 2.5, 3.4 + Math.sin(shotClock * 0.27) * 1, -18);
      shot.updateMatrixWorld();
      helper.update();
      body.position.copy(shot.position);
      body.quaternion.copy(shot.quaternion);

      /*
       * Two poses, blended. Head-on and close for the flat picture; orbiting and
       * pulled back for the rig. Interpolating the positions rather than the
       * angles stops the swing going the long way round, and makes the pull-out
       * and the rotation one move instead of two.
       */
      const drift = 1 - spread;
      const px = -Math.cos(intro * 0.5) * slackX * 0.8 * drift;
      const py = Math.sin(intro * 0.34) * slackY * 0.6 * drift;

      flatTarget.set(flatCentre.x + px, flatCentre.y + py, flatCentre.z);
      flatPos.set(flatTarget.x, flatTarget.y, flatCentre.z + flatRadius);

      orbitPos.set(
        fitSphere.center.x + Math.sin(yaw) * Math.cos(pitch) * orbitRadius,
        fitSphere.center.y + Math.sin(pitch) * orbitRadius,
        fitSphere.center.z + Math.cos(yaw) * Math.cos(pitch) * orbitRadius
      );

      observer.position.lerpVectors(flatPos, orbitPos, spread);
      lookTarget.lerpVectors(flatTarget, fitSphere.center, spread);
      observer.lookAt(lookTarget);
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

      if (held) {
        renderer.setViewport(panelRect.x, panelRect.y, panelRect.w, panelRect.h);
        renderer.setScissor(panelRect.x, panelRect.y, panelRect.w, panelRect.h);
        // Opaque, so the panel is a frame rather than a hole through to the page.
        renderer.setClearColor(0x05070f, 1);
        renderer.clear();
        renderer.render(scene, shot);
      }

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
      layout();
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let frame = 0;
    let running = false;
    let last = 0;

    const shouldRun = () =>
      activeRef.current ||
      dragging ||
      held ||
      Math.abs(velYaw) > 0.0004 ||
      Math.abs(velPitch) > 0.0004;

    const loop = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (activeRef.current) {
        intro = Math.min(INTRO_END, intro + dt);
        // The shot only starts moving once there is a camera to move.
        if (intro >= T_PAN + T_SPREAD) shotClock += dt;
      }

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

    /**
     * Is the pointer on the camera?
     *
     * Measured in screen space rather than by raycasting. The body is one small
     * object, so projecting its centre is both cheaper and far easier to be
     * generous about: the hit radius is the body's own projected size with a
     * floor under it, which keeps it grabbable when the rig is at its furthest
     * and under a fingertip on a touch screen.
     */
    const onCamera = (e: PointerEvent) => {
      if (!body.visible) return false;
      const bounds = canvas.getBoundingClientRect();
      const centre = body.position.clone().project(observer);
      if (centre.z > 1) return false;
      const cx = ((centre.x + 1) / 2) * w;
      const cy = ((1 - centre.y) / 2) * h;
      const edge = body.position.clone().add(new THREE.Vector3(bodyRadius, 0, 0)).project(observer);
      const px = Math.abs(((edge.x + 1) / 2) * w - cx);
      const r = Math.max(30, px * 1.4);
      return Math.hypot(e.clientX - bounds.left - cx, e.clientY - bounds.top - cy) <= r;
    };

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      setTouched(true);
      // Whatever the pointer is doing, it means the opening has been seen.
      intro = INTRO_END;

      if (onCamera(e)) {
        held = true;
        setHolding(true);
        canvas.style.cursor = 'zoom-in';
        start();
        return;
      }

      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velYaw = 0;
      velPitch = 0;
      canvas.style.cursor = 'grabbing';
      start();
    };

    const onMove = (e: PointerEvent) => {
      if (held) return;
      if (!dragging) {
        canvas.style.cursor = onCamera(e) ? 'zoom-in' : 'grab';
        return;
      }
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
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      if (held) {
        held = false;
        setHolding(false);
      }
      dragging = false;
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
      ro.disconnect();
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

      {/* The frame around the held view. Border only: the picture underneath is
          WebGL, and anything opaque here would cover it. */}
      {panel && holding && (
        <div
          className="absolute rounded-md pointer-events-none"
          style={{
            left: panel.x,
            top: panel.y,
            width: panel.w,
            height: panel.h,
            border: '1px solid rgba(245,197,24,0.55)',
            boxShadow: '0 14px 50px rgba(0,0,0,0.6)',
          }}
        >
          <span
            className="absolute -top-5 left-0 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: 'rgba(245,197,24,0.85)' }}
          >
            through the lens
          </span>
        </div>
      )}

      <span className="absolute top-4 left-5 font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary/60 pointer-events-none">
        one flat image, five layers deep
      </span>

      <span
        className={`absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-widest text-fx-text-secondary/60 pointer-events-none transition-opacity duration-500 ${
          touched ? 'opacity-0' : 'opacity-100'
        }`}
      >
        Drag to orbit &nbsp;·&nbsp; hold the camera to look through it
      </span>
    </div>
  );
}
