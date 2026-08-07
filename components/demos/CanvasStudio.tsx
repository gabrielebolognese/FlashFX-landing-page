'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image as ImageIcon, Film, Music, Shapes, Bookmark, Library, Sparkles,
  Search, Upload, FolderPlus, MousePointer2, Square, Circle, Star, PenTool,
  Type, Grid3x3, Layers, Eye, Volume2, Lock, ZoomIn, ZoomOut, Maximize2,
} from 'lucide-react';
import { useAmbient } from '@/lib/motion';
import { DEMO_PRIORITY } from './demo-kit';

/*
 * A working mock of the FlashFX editor (immersionmilestones.md I8).
 *
 * Modelled on public/uimockup.png: menu bar, left rail, media pool, canvas with
 * its tool strip, inspector, and a timeline across the bottom. The point of
 * mocking the real chrome rather than showing a bare canvas is that the claim
 * being made — "edit without timeline mess" — only means something if you can
 * see the timeline it is not making a mess of.
 *
 * What is actually live: every object on the canvas can be dragged, clicking
 * one selects it and drives the inspector, the shapes drift on their own idle
 * animations, particles emit from a source, and the playhead runs the timeline
 * and the frame counter.
 *
 * Positions are written straight to the DOM during a drag and committed to
 * state on release — a `setState` per pointermove would reconcile the whole
 * editor, chrome included, sixty times a second.
 */

type Kind = 'rect' | 'circle' | 'round' | 'tri' | 'star' | 'text' | 'cube' | 'ring' | 'image' | 'line';
type Idle = 'float' | 'spin' | 'pulse' | 'sway' | 'none';

interface Obj {
  id: string;
  kind: Kind;
  label: string;
  /** Percent of the viewport. */
  x: number;
  y: number;
  w: number;
  h: number;
  colour: string;
  idle: Idle;
  phase: number;
}

/* A busy board on purpose — an empty canvas proves nothing about a canvas. */
const OBJECTS: Obj[] = [
  { id: 'o1', kind: 'rect', label: 'Rectangle 1', x: 12, y: 16, w: 17, h: 20, colour: '#F5C518', idle: 'float', phase: 0 },
  { id: 'o2', kind: 'circle', label: 'Ellipse 1', x: 38, y: 12, w: 12, h: 12, colour: '#2D6BE4', idle: 'pulse', phase: 1.1 },
  { id: 'o3', kind: 'cube', label: 'Cube 3D', x: 62, y: 20, w: 15, h: 17, colour: '#7C5CBF', idle: 'spin', phase: 0.4 },
  { id: 'o4', kind: 'text', label: 'Headline', x: 10, y: 46, w: 30, h: 9, colour: '#E6EDF3', idle: 'sway', phase: 2.2 },
  { id: 'o5', kind: 'round', label: 'Card', x: 46, y: 40, w: 16, h: 15, colour: '#4ADE80', idle: 'float', phase: 1.7 },
  { id: 'o6', kind: 'tri', label: 'Polygon', x: 70, y: 46, w: 12, h: 13, colour: '#F97362', idle: 'sway', phase: 0.9 },
  { id: 'o7', kind: 'star', label: 'Star', x: 26, y: 66, w: 11, h: 12, colour: '#FBBF24', idle: 'spin', phase: 2.8 },
  { id: 'o8', kind: 'ring', label: 'Ring', x: 55, y: 66, w: 12, h: 13, colour: '#38BDF8', idle: 'pulse', phase: 1.4 },
  { id: 'o9', kind: 'image', label: 'finalimage.png', x: 78, y: 62, w: 15, h: 17, colour: '#A78BFA', idle: 'float', phase: 3.1 },
  { id: 'o10', kind: 'text', label: 'Caption', x: 40, y: 80, w: 20, h: 7, colour: '#8B949E', idle: 'sway', phase: 0.2 },
  { id: 'o11', kind: 'line', label: 'Path 1', x: 8, y: 82, w: 22, h: 3, colour: '#2DD4BF', idle: 'none', phase: 0 },
  { id: 'o12', kind: 'round', label: 'Badge', x: 84, y: 14, w: 10, h: 8, colour: '#FB7185', idle: 'pulse', phase: 2.5 },
  { id: 'o13', kind: 'circle', label: 'Dot', x: 33, y: 30, w: 6, h: 6, colour: '#C084FC', idle: 'float', phase: 1.9 },
  { id: 'o14', kind: 'rect', label: 'Bar', x: 62, y: 82, w: 18, h: 5, colour: '#60A5FA', idle: 'none', phase: 0 },
];

const MEDIA = [
  { name: 'finalimage.png', meta: '1244×848', tone: '#3f6b4a' },
  { name: 'intro_v3.mp4', meta: '00:12', tone: '#4a3f6b' },
  { name: 'logo_anim.json', meta: 'lottie', tone: '#6b5a3f' },
  { name: 'bg_loop.mp4', meta: '00:08', tone: '#3f5a6b' },
  { name: 'sfx_whoosh.wav', meta: '00:01', tone: '#6b3f4a' },
  { name: 'texture_01.png', meta: '2048²', tone: '#3f6b6b' },
];

const RAIL = [
  { icon: ImageIcon, label: 'Images' },
  { icon: Film, label: 'Videos' },
  { icon: Music, label: 'Audio' },
  { icon: Shapes, label: 'Icons' },
  { icon: Sparkles, label: 'Brands' },
  { icon: Bookmark, label: 'Saved' },
  { icon: Library, label: 'Library' },
];

const TOOLS = [MousePointer2, Square, Circle, Star, PenTool, Type, ImageIcon, Grid3x3, Layers];
const MENUS = ['File', 'Edit', 'View', 'Object', 'Path', 'Scene', 'Effects', 'Help'];

/** Timeline rows: one real clip on S1, the rest empty, as in the mockup. */
const TRACKS = [
  { name: 'S1', clip: { at: 0, len: 78, label: 'Rectangle 1', colour: '#D9455F' } },
  { name: 'N1', clip: { at: 6, len: 34, label: 'Ellipse 1', colour: '#2D6BE4' } },
  { name: 'N2', clip: { at: 44, len: 30, label: 'Cube 3D', colour: '#7C5CBF' } },
  { name: 'N3', clip: null },
  { name: 'N4', clip: { at: 20, len: 22, label: 'Headline', colour: '#4ADE80' } },
  { name: 'N5', clip: null },
  { name: 'N6', clip: null },
];

const CYCLE = 11;

export function CanvasStudio() {
  const { ref, active } = useAmbient<HTMLDivElement>({ priority: DEMO_PRIORITY });
  const [objects, setObjects] = useState(OBJECTS);
  const [selected, setSelected] = useState('o1');

  const viewport = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const particles = useRef<HTMLCanvasElement>(null);
  const playhead = useRef<HTMLDivElement>(null);
  const frameLabel = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ id: string; node: HTMLDivElement; dx: number; dy: number } | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  const chosen = objects.find((o) => o.id === selected) ?? objects[0];

  /* ── Idle drift, particles and playhead, all on one loop ────────────────── */
  useEffect(() => {
    const canvas = particles.current;
    const ctx = canvas?.getContext('2d') ?? null;

    interface P { x: number; y: number; vx: number; vy: number; life: number; max: number; hue: string }
    const pool: P[] = [];
    const TINTS = ['#F5C518', '#F97362', '#FBBF24', '#E6EDF3'];

    let frame = 0;
    let last = 0;
    let t = 0;
    let running = false;

    const resize = () => {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(r.width));
      canvas.height = Math.max(1, Math.floor(r.height));
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas) ro.observe(canvas);

    const tick = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;

      // Idle animation is a transform on top of the object's own position, so
      // dragging and drifting do not fight over the same property.
      nodes.current.forEach((node) => {
        const kind = node.dataset.idle as Idle;
        const phase = Number(node.dataset.phase) + t;
        let tf = '';
        if (kind === 'float') tf = `translateY(${Math.sin(phase * 0.9) * 5}px)`;
        else if (kind === 'sway') tf = `translateX(${Math.sin(phase * 0.7) * 6}px)`;
        else if (kind === 'pulse') tf = `scale(${1 + Math.sin(phase * 1.3) * 0.06})`;
        else if (kind === 'spin') tf = `rotate(${(phase * 22) % 360}deg)`;
        const inner = node.firstElementChild as HTMLElement | null;
        if (inner) inner.style.transform = tf;
      });

      // Particles: a steady emitter in the lower left of the canvas.
      if (ctx && canvas) {
        if (pool.length < 90 && Math.floor(t * 60) % 2 === 0) {
          pool.push({
            x: canvas.width * 0.2,
            y: canvas.height * 0.9,
            vx: (((pool.length * 37) % 100) / 100 - 0.5) * 28,
            vy: -26 - ((pool.length * 53) % 40),
            life: 0,
            max: 1.6 + ((pool.length * 17) % 10) / 10,
            hue: TINTS[pool.length % TINTS.length],
          });
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = pool.length - 1; i >= 0; i--) {
          const p = pool[i];
          p.life += dt;
          if (p.life > p.max) { pool.splice(i, 1); continue; }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 14 * dt;
          const a = 1 - p.life / p.max;
          ctx.globalAlpha = a * 0.85;
          ctx.fillStyle = p.hue;
          const s = 1.5 + a * 2.5;
          ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
        }
        ctx.globalAlpha = 1;
      }

      // Playhead and the frame counter that follows it.
      const p = (t % CYCLE) / CYCLE;
      if (playhead.current) playhead.current.style.transform = `translateX(${p * 100}%)`;
      if (frameLabel.current) frameLabel.current.textContent = String(Math.floor(p * 150)).padStart(3, '0');

      if (activeRef.current) frame = requestAnimationFrame(tick);
      else { running = false; last = 0; }
    };

    const start = () => {
      if (running || !activeRef.current) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    start();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [active]);

  /* ── Dragging ───────────────────────────────────────────────────────────── */
  const onDown = (id: string) => (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const node = e.currentTarget;
    const box = viewport.current?.getBoundingClientRect();
    if (!box) return;
    const r = node.getBoundingClientRect();
    node.setPointerCapture(e.pointerId);
    drag.current = { id, node, dx: e.clientX - r.left, dy: e.clientY - r.top };
    setSelected(id);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const box = viewport.current?.getBoundingClientRect();
    if (!d || !box) return;
    const x = ((e.clientX - d.dx - box.left) / box.width) * 100;
    const y = ((e.clientY - d.dy - box.top) / box.height) * 100;
    d.node.style.left = `${Math.min(96, Math.max(0, x))}%`;
    d.node.style.top = `${Math.min(94, Math.max(0, y))}%`;
  };

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    d.node.releasePointerCapture(e.pointerId);
    const x = parseFloat(d.node.style.left);
    const y = parseFloat(d.node.style.top);
    setObjects((prev) => prev.map((o) => (o.id === d.id ? { ...o, x, y } : o)));
    drag.current = null;
  };

  const register = useCallback((id: string) => (node: HTMLDivElement | null) => {
    if (node) nodes.current.set(id, node);
    else nodes.current.delete(id);
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-full rounded-xl overflow-hidden border border-fx-border bg-[#0b0f1a] shadow-2xl flex flex-col text-fx-text-primary select-none"
    >
      {/* ── Menu bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-3 h-8 flex-shrink-0 border-b border-fx-border/70 bg-[#0d1220]">
        <span className="font-mono text-[10px] text-fx-text-secondary">← Projects</span>
        <div className="hidden sm:flex items-center gap-3">
          {MENUS.map((m) => (
            <span key={m} className="text-[11px] text-fx-text-secondary/80">{m}</span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="font-mono text-[10px] text-fx-text-secondary">Untitled</span>
          <span className="hidden md:inline font-mono text-[10px] text-fx-text-secondary/70">Builder</span>
          <span className="hidden md:inline font-mono text-[10px] text-fx-text-secondary/70">Panels</span>
        </div>
      </div>

      {/* ── Tool strip ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 px-2 h-8 flex-shrink-0 border-b border-fx-border/70 bg-[#0d1220]">
        {TOOLS.map((Icon, i) => (
          <span
            key={i}
            className={`w-6 h-6 rounded flex items-center justify-center ${
              i === 0 ? 'bg-fx-accent-yellow/15 text-fx-accent-yellow' : 'text-fx-text-secondary/70'
            }`}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={1.6} />
          </span>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-1 font-mono text-[9px] text-fx-text-secondary">
            <span className="w-3 h-3 rounded-sm" style={{ background: chosen.colour }} /> Fill
          </span>
          <span className="hidden sm:flex items-center gap-1 font-mono text-[9px] text-fx-text-secondary">
            <span className="w-3 h-3 rounded-sm border border-white/25" /> Stroke
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* ── Icon rail ──────────────────────────────────────────────────── */}
        <div className="hidden sm:flex flex-col w-10 flex-shrink-0 border-r border-fx-border/70 bg-[#0d1220] py-1.5 gap-0.5">
          {RAIL.map(({ icon: Icon, label }, i) => (
            <span
              key={label}
              title={label}
              className={`h-8 flex items-center justify-center ${
                i === 0 ? 'text-fx-accent-yellow border-l-2 border-fx-accent-yellow' : 'text-fx-text-secondary/60'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.6} />
            </span>
          ))}
        </div>

        {/* ── Media pool ─────────────────────────────────────────────────── */}
        <div className="hidden lg:flex flex-col w-52 flex-shrink-0 border-r border-fx-border/70 bg-[#0b1020] p-2 gap-2">
          <div className="flex items-center gap-1.5 px-2 h-6 rounded bg-[#0d1220] border border-fx-border/70">
            <Search className="w-3 h-3 text-fx-text-secondary/60" />
            <span className="font-mono text-[9px] text-fx-text-secondary/50">Search…</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[9px] text-fx-text-secondary/60">
            <FolderPlus className="w-3 h-3" /> New folder
          </div>
          <div className="flex items-center justify-center gap-1.5 h-7 rounded border border-dashed border-fx-accent-yellow/40 bg-fx-accent-yellow/[0.06] font-mono text-[9px] text-fx-accent-yellow">
            <Upload className="w-3 h-3" /> Import Media
          </div>
          <div className="grid grid-cols-2 gap-1.5 overflow-hidden">
            {MEDIA.map((m) => (
              <div key={m.name} className="rounded border border-fx-border/70 overflow-hidden">
                <div className="h-9" style={{ background: `linear-gradient(135deg, ${m.tone}, #0d1220)` }} />
                <div className="px-1 py-0.5 bg-[#0d1220]">
                  <p className="font-mono text-[7px] text-fx-text-primary truncate">{m.name}</p>
                  <p className="font-mono text-[7px] text-fx-text-secondary/60">{m.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Canvas ─────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#080c16]">
          <div className="flex-1 min-h-0 p-3">
            <div
              ref={viewport}
              className="relative w-full h-full rounded overflow-hidden border border-fx-border/60"
              style={{
                backgroundColor: '#0a0e1a',
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
                `,
                backgroundSize: '22px 22px',
              }}
            >
              <canvas ref={particles} className="absolute inset-0 w-full h-full pointer-events-none" />

              {objects.map((o) => (
                <div
                  key={o.id}
                  ref={register(o.id)}
                  data-idle={o.idle}
                  data-phase={o.phase}
                  onPointerDown={onDown(o.id)}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={onUp}
                  className="absolute cursor-grab active:cursor-grabbing touch-none"
                  style={{ left: `${o.x}%`, top: `${o.y}%`, width: `${o.w}%`, height: `${o.h}%` }}
                >
                  <div className="relative w-full h-full">
                    <Shape obj={o} />
                    {selected === o.id && (
                      <>
                        <span className="absolute -inset-1 border border-fx-accent-yellow rounded-[2px] pointer-events-none" />
                        {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((c) => (
                          <span key={c} className={`absolute ${c} w-1.5 h-1.5 bg-fx-accent-yellow pointer-events-none`} />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 h-7 flex-shrink-0 border-t border-fx-border/70 bg-[#0d1220]">
            <ZoomOut className="w-3 h-3 text-fx-text-secondary/60" />
            <span className="font-mono text-[9px] text-fx-text-secondary">100%</span>
            <ZoomIn className="w-3 h-3 text-fx-text-secondary/60" />
            <Maximize2 className="w-3 h-3 text-fx-text-secondary/60" />
            <span className="ml-auto font-mono text-[9px] text-fx-text-secondary/70">
              1920×1080 &nbsp;|&nbsp; 30fps &nbsp;|&nbsp; Frame <span ref={frameLabel}>000</span>/150
            </span>
          </div>
        </div>

        {/* ── Inspector ──────────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-col w-56 flex-shrink-0 border-l border-fx-border/70 bg-[#0b1020]">
          <div className="px-2.5 h-7 flex items-center border-b border-fx-border/70">
            <span className="font-mono text-[9px] uppercase tracking-widest text-fx-text-secondary">Properties</span>
          </div>
          <div className="p-2.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-wider text-fx-text-secondary/70">
                {chosen.kind}
              </span>
              <span className="font-mono text-[9px] text-fx-text-secondary">100%</span>
            </div>

            <div className="flex items-center gap-1.5 px-1.5 h-6 rounded bg-[#0d1220] border border-fx-border/70">
              <span className="w-3 h-3 rounded-sm" style={{ background: chosen.colour }} />
              <span className="font-mono text-[9px] text-fx-text-primary truncate">{chosen.label}</span>
            </div>

            <Row label="Type">
              <div className="flex gap-0.5">
                {['Solid', 'Linear', 'Radial'].map((v, i) => (
                  <span
                    key={v}
                    className={`px-1.5 py-0.5 rounded font-mono text-[8px] ${
                      i === 0 ? 'bg-fx-accent-yellow text-fx-bg-base' : 'text-fx-text-secondary/70'
                    }`}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </Row>
            <Row label="Blend"><Field>Normal</Field></Row>
            <Row label="Opacity"><Field>100 %</Field></Row>
            <Row label="X"><Field>{Math.round(chosen.x * 19.2)}</Field></Row>
            <Row label="Y"><Field>{Math.round(chosen.y * 10.8)}</Field></Row>

            <div className="pt-1 space-y-1">
              <p className="font-mono text-[9px] text-fx-text-secondary/70">Color stops</p>
              {[chosen.colour, '#14171F'].map((hex, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm border border-white/15" style={{ background: hex }} />
                  <span className="font-mono text-[8px] text-fx-text-primary">{hex.toUpperCase()}</span>
                  <span className="ml-auto font-mono text-[8px] text-fx-text-secondary">100</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-fx-border/70 bg-[#0b1020]">
        <div className="flex items-center gap-2 px-2.5 h-6 border-b border-fx-border/70">
          <span className="font-mono text-[9px] uppercase tracking-widest text-fx-text-secondary">Timeline</span>
          <span className="font-mono text-[9px] text-fx-text-secondary/60">{TRACKS.length} tracks</span>
        </div>

        <div className="relative flex">
          <div className="w-16 sm:w-24 flex-shrink-0 border-r border-fx-border/70">
            {TRACKS.map((t) => (
              <div key={t.name} className="h-4 flex items-center gap-1 px-1.5 border-b border-fx-border/40 last:border-b-0">
                <span className="font-mono text-[8px] text-fx-text-secondary">{t.name}</span>
                <Eye className="w-2 h-2 text-fx-text-secondary/40" />
                <Volume2 className="hidden sm:block w-2 h-2 text-fx-text-secondary/40" />
                <Lock className="hidden sm:block w-2 h-2 text-fx-text-secondary/40" />
              </div>
            ))}
          </div>

          <div className="relative flex-1 min-w-0">
            {TRACKS.map((t) => (
              <div key={t.name} className="relative h-4 border-b border-fx-border/40 last:border-b-0">
                {t.clip ? (
                  <div
                    className="absolute inset-y-[2px] rounded-[2px] flex items-center px-1 overflow-hidden"
                    style={{
                      left: `${t.clip.at}%`,
                      width: `${t.clip.len}%`,
                      backgroundColor: `${t.clip.colour}59`,
                      border: `1px solid ${t.clip.colour}`,
                    }}
                  >
                    <span className="font-mono text-[7px] text-white/85 truncate">{t.clip.label}</span>
                  </div>
                ) : (
                  <span className="absolute left-1 top-0.5 font-mono text-[7px] text-fx-text-secondary/30">empty</span>
                )}
              </div>
            ))}

            {/* Same wrapper-translate playhead as the full timelines. */}
            <div className="absolute inset-y-0 left-0 right-0 pointer-events-none">
              <div ref={playhead} className="absolute inset-y-0 left-0 right-0">
                <div className="absolute inset-y-0 -left-px w-[1.5px] bg-fx-accent-yellow shadow-[0_0_8px_1px_rgba(245,197,24,0.5)]" />
                <div className="absolute -top-px -left-[4px] w-2 h-1.5 rounded-sm bg-fx-accent-yellow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="font-mono text-[9px] text-fx-text-secondary/70">{label}</span>
      {children}
    </div>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-1.5 py-0.5 rounded bg-[#0d1220] border border-fx-border/70 font-mono text-[8px] text-fx-text-primary min-w-[52px] text-right">
      {children}
    </span>
  );
}

/** The drawn object itself. Everything is CSS — no canvas, no library. */
function Shape({ obj }: { obj: Obj }) {
  const c = obj.colour;
  switch (obj.kind) {
    case 'circle':
      return <div className="w-full h-full rounded-full" style={{ background: `${c}40`, border: `1.5px solid ${c}` }} />;
    case 'round':
      return <div className="w-full h-full rounded-lg" style={{ background: `${c}40`, border: `1.5px solid ${c}` }} />;
    case 'ring':
      return <div className="w-full h-full rounded-full" style={{ border: `4px solid ${c}` }} />;
    case 'tri':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <polygon points="50,4 96,96 4,96" fill={`${c}40`} stroke={c} strokeWidth="3" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <polygon
            points="50,3 61,38 98,38 68,60 79,95 50,73 21,95 32,60 2,38 39,38"
            fill={`${c}40`}
            stroke={c}
            strokeWidth="3"
          />
        </svg>
      );
    case 'line':
      return <div className="w-full rounded-full" style={{ height: 3, background: c, marginTop: '40%' }} />;
    case 'text':
      return (
        <div className="w-full h-full flex items-center">
          <span className="font-bold leading-none truncate" style={{ color: c, fontSize: 'clamp(10px, 2.2vw, 26px)' }}>
            {obj.label}
          </span>
        </div>
      );
    case 'image':
      return (
        <div
          className="w-full h-full rounded-sm overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${c}66, #0d1220)`, border: `1px solid ${c}80` }}
        >
          <div className="w-full h-full flex items-end p-1">
            <span className="font-mono text-[7px] text-white/70 truncate">{obj.label}</span>
          </div>
        </div>
      );
    case 'cube':
      // A real box, built from six faces — the section is about a canvas that
      // holds 3D, so a flat square with a gradient would be a lie.
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ perspective: 420 }}>
          <div className="fx-cube" style={{ ['--fx-cube-c' as string]: c }}>
            {['fx-cube-f', 'fx-cube-b', 'fx-cube-r', 'fx-cube-l', 'fx-cube-t', 'fx-cube-d'].map((f) => (
              <span key={f} className={f} />
            ))}
          </div>
        </div>
      );
    default:
      return <div className="w-full h-full rounded-[2px]" style={{ background: `${c}40`, border: `1.5px solid ${c}` }} />;
  }
}
