"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAmbient } from "@/lib/motion";

/*
 * ── The orbit is measured, not fixed (mobile pass, phase 5) ─────────────────
 *
 * The radius was a hardcoded 280px, which placed every node 280px from the
 * centre of a container that is 360px wide on a phone. Half of that container
 * is 180px, so the nodes at the left and right of the ring sat a hundred pixels
 * outside the viewport and `overflow-hidden` cut them off — and because the
 * ring turns, each node vanished for part of every rotation rather than simply
 * looking cramped. A tapped one could open its card off screen entirely.
 *
 * 280 is now a ceiling rather than a value. The radius is whatever fits the
 * measured box, capped so that a desktop — where the room is already there —
 * renders exactly as it did before.
 */

/** The desktop radius, kept as the upper bound so wide screens are unchanged. */
const MAX_RADIUS = 280;

/*
 * Horizontal room is decided by the labels, not the nodes. A node is 56px
 * across, but "Documentation" underneath it is nearer 96px, so the label is
 * what reaches the edge first and the node is not the thing to measure against.
 */
const LABEL_HALF = 48;

/** The label hangs at `top-16`; leave room for it, its text, and the edge. */
const LABEL_DROP = 84;

/** Below this, seven nodes on a ring stop being separable. */
const MIN_RADIUS = 96;

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  url?: string;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  /*
   * One governor slot for the whole orbit (CLAUDE.md: continuous motion goes
   * through `useAmbient`). The rotation below is a `setInterval` writing React
   * state 20 times a second, which re-renders every node — it was running from
   * first paint to navigation whether or not the section was anywhere near the
   * screen. `priority: 1` because this rotation *is* the section, so it should
   * outrank decoration when slots are short.
   */
  const { ref: ambientRef, active: ambientActive } = useAmbient<HTMLDivElement>({ priority: 1 });

  /** The box the ring has to fit inside. Zero until the first observation. */
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const node = orbitRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ w: width, h: height });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const radius = box.w
    ? Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, box.w / 2 - LABEL_HALF, box.h / 2 - LABEL_DROP))
    : MAX_RADIUS;

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;
    if (autoRotate && ambientActive) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }
    return () => {
      if (rotationTimer) clearInterval(rotationTimer);
    };
  }, [autoRotate, ambientActive]);

  const centerViewOnNode = (nodeId: number) => {
    if (!nodeRefs.current[nodeId]) return;
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed": return "text-white border-white" ;
      case "in-progress": return "text-white border-white/80";
      case "pending": return "text-white/70 border-white/50";
      default: return "text-white/70 border-white/50";
    }
  };

  return (
    <div
      className="w-full h-[560px] sm:h-[660px] md:h-[780px] flex flex-col items-center justify-center overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div ref={ambientRef} className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          <div
            className={`absolute w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 flex items-center justify-center z-10 ${
              ambientActive ? "animate-pulse" : ""
            }`}
          >
            <div
              className={`absolute w-20 h-20 rounded-full border border-yellow-400/30 opacity-70 ${
                ambientActive ? "animate-ping" : ""
              }`}
            ></div>
            <div
              className={`absolute w-24 h-24 rounded-full border border-yellow-400/20 opacity-50 ${
                ambientActive ? "animate-ping" : ""
              }`}
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-8 h-8 rounded-full bg-yellow-300/80 backdrop-blur-md"></div>
          </div>

          <div
            className="absolute rounded-full border border-white/10"
            style={{ width: radius * 2 + 28, height: radius * 2 + 28 }}
          ></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                  /*
                   * Server HTML places the nodes at the desktop radius, because
                   * nothing has been measured yet — they carry real links and
                   * dropping them from the markup to wait would cost those. The
                   * first correction therefore has to be instant, or every
                   * visitor watches a 700ms slide inward on load.
                   */
                  transition: box.w ? undefined : "none",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""}`}
                  style={{
                    background: `radial-gradient(circle, rgba(245,197,24,0.2) 0%, rgba(245,197,24,0) 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                />

                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform
                    ${isExpanded
                      ? "bg-yellow-400 text-[#0a1628] border-yellow-400 shadow-lg shadow-yellow-400/30 scale-150"
                      : isRelated
                      ? "bg-yellow-400/50 text-[#0a1628] border-yellow-400 animate-pulse"
                      : "text-yellow-400 border-yellow-400/40"
                    }`}
                  style={!isExpanded && !isRelated ? { backgroundColor: '#141f40' } : undefined}
                >
                  <Icon size={22} />
                </div>

                <div
                  className={`absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300
                    ${isExpanded ? "text-yellow-400 scale-125" : "text-white/70"}`}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-24 left-1/2 -translate-x-1/2 w-64 max-w-[calc(100vw-2rem)] backdrop-blur-lg border-yellow-400/30 shadow-xl shadow-yellow-400/10 overflow-visible" style={{ backgroundColor: 'rgba(20,31,64,0.97)' }}>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-yellow-400/50"></div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white mt-1">{item.title}</CardTitle>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-yellow-400/80 hover:text-yellow-400 underline underline-offset-2 transition-colors break-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.url}
                        </a>
                      )}
                    </CardHeader>
                    <CardContent className="text-xs text-white/80">
                      <p>{item.content}</p>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-white/70 mr-1" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-white/70">
                              Related
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-xs rounded-none border-yellow-400/20 bg-transparent hover:bg-yellow-400/10 text-white/80 hover:text-white transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1 text-white/60" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
