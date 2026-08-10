'use client';

import { useEffect, useRef } from 'react';
import { cappedPixelRatio } from '@/lib/render-gate';
import { isReducedTier, subscribePointer } from '@/lib/motion';

/*
 * One field of light behind the whole site (immersionmilestones.md I4).
 *
 * Before this, each section painted its own background and none of them
 * related: the hero ran one shader, the carousel ran a different one, and
 * between them sat floating shapes and SVG paths that knew nothing about
 * either. Scrolling read as a stack of unrelated slides because, visually, it
 * was. This is one continuous space that the page moves through.
 *
 * ── Raw WebGL, not three.js ─────────────────────────────────────────────────
 *
 * This mounts in `app/layout.tsx`, so it is on every route — and importing
 * three.js there would put the whole library in the shared bundle for every
 * page on the site, undoing performancemilestones.md P5. A full-screen quad and
 * one fragment shader needs no library at all.
 *
 * ── What it is driven by ────────────────────────────────────────────────────
 *
 * Scroll position, so the field opens up as you descend: deep navy behind the
 * hero, a lighter and clearer blue by the closing call to action. That is what
 * makes the top of the page feel like a different place from the bottom rather
 * than the same wallpaper repeated.
 *
 * It used to ramp toward a warm violet instead, which turned the lower half of
 * the site purple. Every stop is blue-dominant now and must stay that way — see
 * the note beside them in the shader.
 *
 * It carries no rays. The hero has its own `ShaderAnimation` and keeps it —
 * this sits behind everything as the ambient field, and the hero's own light
 * plays over the top of it.
 *
 * `uAmp` still ramps from 0 over 2.7 s, so the field arrives rather than
 * appearing.
 */

const RAMP_MS = 2700;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
uniform float uAmp;
uniform vec2 uPointer;

/* A soft pool of light. Cheap on purpose — this runs behind every page. */
float pool(vec2 p, vec2 c, float r) {
  float d = length(p - c);
  return smoothstep(r, 0.0, d);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv;
  p.x *= uRes.x / uRes.y;
  float ar = uRes.x / uRes.y;

  float t = uTime * 0.05;

  /*
   * Blue the whole way down.
   *
   * This used to ramp from cool blue at the top to a warm violet by the bottom,
   * which is why the lower half of the page drifted purple. The scroll still
   * moves the colour -- deep navy near the hero, a lighter and clearer blue by
   * the footer -- but it stays in one family, so nothing below the fold reads as
   * a different site.
   *
   * Keep every one of these four in the blue range. The gradient is the only
   * thing setting the page's colour temperature, and a red or green component
   * creeping above the blue one here tints every section at once.
   */
  vec3 deepA = vec3(0.043, 0.075, 0.153);
  vec3 deepB = vec3(0.078, 0.145, 0.290);
  vec3 lightA = vec3(0.047, 0.098, 0.196);
  vec3 lightB = vec3(0.110, 0.243, 0.435);

  vec3 base = mix(deepA, lightA, uScroll);
  vec3 lift = mix(deepB, lightB, uScroll);

  /*
   * The pointer slides the pools, each by a different amount, so the field has
   * depth rather than sitting flat behind the page (immersionmilestones.md I6).
   * The offsets are small — this should register as the light being aware of
   * you, not as a layer being dragged around.
   */
  vec2 par = vec2(uPointer.x * ar, uPointer.y);

  float f = 0.0;
  f += pool(p, vec2(ar * (0.28 + sin(t * 0.9) * 0.06), 0.74 + cos(t * 0.7) * 0.05) + par * 0.10, 0.55) * 0.9;
  f += pool(p, vec2(ar * (0.76 + cos(t * 0.6) * 0.07), 0.28 + sin(t * 1.1) * 0.06) + par * 0.05, 0.50) * 0.7;
  f += pool(p, vec2(ar * (0.52 + sin(t * 1.3) * 0.08), 0.52 + cos(t * 0.5) * 0.07) + par * 0.17, 0.62) * 0.5;

  vec3 col = base + lift * f * 0.55;

  /*
   * No rays here. The hero keeps its own ShaderAnimation — it is the best
   * animation on the site and stays (owner's call, 2026-08-07). Drawing rays
   * here as well would double them behind it, so this backdrop is the ambient
   * field only.
   */

  /* A hint of grain, so wide gradients do not band on cheap panels. */
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.012;

  gl_FragColor = vec4(col * uAmp, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function SiteBackdrop() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;

    /*
     * A full-screen fragment shader every frame is the most expensive thing on
     * this page for a weak GPU, and it is pure decoration. On the reduced tier
     * it never starts at all — the CSS gradient underneath is a perfectly good
     * backdrop, and it costs nothing (immersionmilestones.md I7).
     */
    if (isReducedTier()) return;

    const gl = cv.getContext('webgl', {
      alpha: false,
      antialias: false,
      // The field is repainted every frame, so there is nothing to preserve —
      // and saying so lets the driver skip a full-screen copy.
      preserveDrawingBuffer: false,
      powerPreference: 'low-power',
    });
    // No WebGL at all: the CSS gradient underneath is the whole fallback.
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uScroll = gl.getUniformLocation(prog, 'uScroll');
    const uAmp = gl.getUniformLocation(prog, 'uAmp');
    const uPointer = gl.getUniformLocation(prog, 'uPointer');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = cappedPixelRatio();
      const nw = Math.floor(window.innerWidth * dpr);
      const nh = Math.floor(window.innerHeight * dpr);
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      cv.width = w;
      cv.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    let scroll = 0;
    const readScroll = () => {
      /*
       * Measured against the end of the *page*, not the end of the document.
       *
       * Anything marked `data-fx-beyond` sits below the footer and is not part
       * of the page's argument — the joke in `BeyondTheFooter` is seven viewport
       * heights of it. Counting that would stretch this ramp so the real content
       * never reached the light end of the gradient, and the footer would sit in
       * the same navy as the hero.
       */
      const beyond = document.querySelector('[data-fx-beyond]');
      const tail = beyond ? (beyond as HTMLElement).offsetHeight : 0;
      const span = document.documentElement.scrollHeight - tail - window.innerHeight;
      scroll = span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 0;
    };
    readScroll();
    window.addEventListener('scroll', readScroll, { passive: true });

    /*
     * Where the pointer is, and where the light has got to on its way there.
     *
     * The gap between the two is the point: easing `now` toward `target` a
     * fraction each frame gives the field weight, so it drifts after the
     * pointer rather than snapping to it. A flat -0.5..0.5 across the viewport
     * keeps the shader's arithmetic in the same space as its pool positions.
     */
    let targetX = 0;
    let targetY = 0;
    let nowX = 0;
    let nowY = 0;

    const unsubscribePointer = subscribePointer((px, py) => {
      targetX = px / window.innerWidth - 0.5;
      targetY = 0.5 - py / window.innerHeight;
    });

    let frame = 0;
    let start = 0;
    let running = false;

    const draw = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;

      nowX += (targetX - nowX) * 0.045;
      nowY += (targetY - nowY) * 0.045;

      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, reduced.matches ? 0 : elapsed / 1000);
      gl.uniform1f(uScroll, scroll);
      gl.uniform1f(uAmp, Math.min(1, elapsed / RAMP_MS));
      gl.uniform2f(uPointer, nowX, nowY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      resize();
      draw(now);
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      if (running || reduced.matches || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    /*
     * Stops on a hidden tab as well as on reduced motion. A fixed backdrop is
     * never "off screen", so an IntersectionObserver would never pause it —
     * `visibilitychange` is the only thing that can.
     */
    const visibility = () => (document.hidden ? stop() : play());
    document.addEventListener('visibilitychange', visibility);

    const motion = () => {
      if (reduced.matches) {
        stop();
        // One composed frame rather than nothing: the page still gets its
        // field of light, it simply stops moving.
        draw(performance.now());
      } else {
        play();
      }
    };
    reduced.addEventListener('change', motion);

    motion();

    return () => {
      stop();
      unsubscribePointer();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', readScroll);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', motion);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      // z-index 0 inline: `body > *` in globals.css puts every direct child at
      // z-index 1, which would float this over the content it sits behind.
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      {/* The fallback, and what shows before the first frame: no WebGL, no
          canvas, still a gradient rather than flat navy. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 90% 60% at 30% 15%, rgba(20,37,74,0.9) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 78% 70%, rgba(24,52,102,0.75) 0%, transparent 65%), #0b1020',
        }}
      />
      <canvas ref={canvas} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </div>
  );
}
