'use client';

import { useRef, useEffect, useState, ReactNode, CSSProperties, ButtonHTMLAttributes } from "react";

let _filterCount = 0;

function LiquidGlassFilter({ id, distortion }: { id: string; distortion: number }) {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.65 0.65" numOctaves="3" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={distortion} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" in="displaced" result="r" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" in="displaced" result="g" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" in="displaced" result="b" />
          <feOffset dx="-1" dy="-1" in="r" result="r2" />
          <feOffset dx="0"  dy="0"  in="g" result="g2" />
          <feOffset dx="1"  dy="1"  in="b" result="b2" />
          <feBlend in="r2" in2="g2" mode="screen" result="rg" />
          <feBlend in="rg" in2="b2" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
}

function buildGlassLayers(
  filterId: string,
  blur: number,
  tint: string,
  specularPos?: { x: number; y: number }
): CSSProperties[] {
  const base: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    pointerEvents: "none",
  };

  const glassBase: CSSProperties = {
    ...base,
    overflow: "hidden",
    backdropFilter: `blur(${blur}px) saturate(1.8)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(1.8)`,
    background: tint,
    filter: `url(#${filterId})`,
  };

  const outerShadow: CSSProperties = {
    ...base,
    boxShadow:
      "0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(255,255,255,0.18)",
  };

  const edgeHighlight: CSSProperties = {
    ...base,
    border: "1.5px solid rgba(255,255,255,0.55)",
    maskImage:
      "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.15) 50%, transparent 70%)",
    WebkitMaskImage:
      "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.15) 50%, transparent 70%)",
  };

  const innerShadow: CSSProperties = {
    ...base,
    boxShadow:
      "inset 0 -2px 10px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.35)",
  };

  const layers: CSSProperties[] = [glassBase, outerShadow, edgeHighlight, innerShadow];

  if (specularPos) {
    layers.push({
      ...base,
      background: `radial-gradient(circle at ${specularPos.x}% ${specularPos.y}%, rgba(255,255,255,0.26) 0%, transparent 60%)`,
    });
  }

  return layers;
}

interface LiquidGlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  blur?: number;
  tint?: string;
  distortion?: number;
  padding?: string;
  borderRadius?: string;
}

export function LiquidGlassButton({
  children,
  blur = 18,
  tint = "rgba(59, 130, 246, 0.3)",
  distortion = 6,
  padding = "10px 22px",
  borderRadius = "9999px",
  style,
  ...rest
}: LiquidGlassButtonProps) {
  const [filterId] = useState(() => `lgb-${_filterCount++}`);
  const ref = useRef<HTMLButtonElement>(null);
  const [specular, setSpecular] = useState({ x: 30, y: 30 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setSpecular({
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const layers = buildGlassLayers(filterId, blur, tint, specular);

  return (
    <>
      <LiquidGlassFilter id={filterId} distortion={distortion} />
      <button
        ref={ref}
        {...rest}
        style={{
          appearance: "none",
          border: "none",
          background: "transparent",
          font: "inherit",
          cursor: "pointer",
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding,
          borderRadius,
          isolation: "isolate",
          transition: "transform 0.15s ease, opacity 0.15s ease",
          ...style,
        }}
        onMouseLeave={(e) => {
          setSpecular({ x: 30, y: 30 });
          rest.onMouseLeave?.(e);
        }}
      >
        {layers.map((s, i) => (
          <div key={i} style={s} />
        ))}
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      </button>
    </>
  );
}

type IntrinsicTag = keyof JSX.IntrinsicElements;

interface LiquidGlassPanelProps {
  children: ReactNode;
  blur?: number;
  tint?: string;
  distortion?: number;
  borderRadius?: string;
  as?: IntrinsicTag;
  className?: string;
  style?: CSSProperties;
}

export function LiquidGlassPanel({
  children,
  blur = 22,
  tint = "rgba(255, 255, 255, 0.11)",
  distortion = 8,
  borderRadius = "24px",
  as: Tag = "div",
  className,
  style,
}: LiquidGlassPanelProps) {
  const [filterId] = useState(() => `lgp-${_filterCount++}`);
  const layers = buildGlassLayers(filterId, blur, tint);

  const AnyTag = Tag as "div";

  return (
    <>
      <LiquidGlassFilter id={filterId} distortion={distortion} />
      <AnyTag
        className={className}
        style={{
          position: "relative",
          borderRadius,
          isolation: "isolate",
          ...style,
        }}
      >
        {layers.map((s, i) => (
          <div key={i} style={s} />
        ))}
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </AnyTag>
    </>
  );
}
