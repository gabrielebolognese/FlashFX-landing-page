'use client';

import { Sparkles } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
}

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  viewMode = "text",
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const width = viewMode === "icon" ? 46 : 142;
  const height = 46;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { x, y, id: rippleId.current++ };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }
    onClick?.();
  };

  return (
    <div className="relative inline-block" style={{ perspective: "1000px" }}>
      <style>{`
        @keyframes liquid-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes liquid-shimmer-fast {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ripple-anim {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
      `}</style>

      <div
        style={{
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
          transformStyle: "preserve-3d",
          transition: "all 0.4s ease",
        }}
      >
        {/* Shader layer — pure CSS animated liquid metal gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "100px",
            background: isHovered
              ? "linear-gradient(120deg, #c8c8c8, #f0f0f0, #a0a0a0, #e8e8e8, #b0b0b0, #d8d8d8, #888, #e0e0e0)"
              : "linear-gradient(120deg, #b0b0b0, #e0e0e0, #888, #d0d0d0, #a0a0a0, #c8c8c8, #707070, #d0d0d0)",
            backgroundSize: "300% 300%",
            animation: isHovered
              ? "liquid-shimmer-fast 1.2s ease infinite"
              : "liquid-shimmer 3s ease infinite",
            boxShadow: isPressed
              ? "0px 0px 0px 1px rgba(0,0,0,0.5), inset 0 2px 4px rgba(0,0,0,0.3)"
              : isHovered
                ? "0px 0px 0px 1px rgba(0,0,0,0.4), 0px 8px 20px rgba(0,0,0,0.2)"
                : "0px 0px 0px 1px rgba(0,0,0,0.3), 0px 4px 14px rgba(0,0,0,0.15)",
            transition: "box-shadow 0.15s ease",
            zIndex: 0,
          }}
        />

        {/* Inner dark inset */}
        <div
          style={{
            position: "absolute",
            top: "2px",
            left: "2px",
            right: "2px",
            bottom: "2px",
            borderRadius: "100px",
            background: "linear-gradient(180deg, #202020 0%, #000 100%)",
            boxShadow: isPressed ? "inset 0 2px 4px rgba(0,0,0,0.4)" : "none",
            transition: "box-shadow 0.15s ease",
            zIndex: 1,
          }}
        />

        {/* Label layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            zIndex: 2,
            pointerEvents: "none",
            transform: isPressed ? "translateY(1px)" : "translateY(0)",
            transition: "transform 0.1s ease",
          }}
        >
          {viewMode === "icon" && (
            <Sparkles
              size={16}
              style={{
                color: "#999",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
              }}
            />
          )}
          {viewMode === "text" && (
            <span
              style={{
                fontSize: "14px",
                color: "#999",
                fontWeight: 400,
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          )}
        </div>

        {/* Clickable button overlay */}
        <button
          ref={buttonRef}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            outline: "none",
            zIndex: 3,
            borderRadius: "100px",
            overflow: "hidden",
          }}
          aria-label={label}
        >
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              style={{
                position: "absolute",
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
                pointerEvents: "none",
                animation: "ripple-anim 0.6s ease-out",
              }}
            />
          ))}
        </button>
      </div>
    </div>
  );
}
