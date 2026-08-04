import { Move, Layers, PenTool, Circle, LayoutGrid, Scissors, Sun, Zap, Radio, Sunrise, Gem, Camera, Thermometer, Droplets, RefreshCw, ChartBar as BarChart2, SlidersHorizontal, SlidersVertical, CloudFog, Wind, Focus, Shuffle, Activity, CircleDashed, Sparkles, Scan, Paintbrush, Pencil, Eye, Grid2x2, Square, Folder, Info, Palette } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface PropertyItem {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export const editableProperties: PropertyItem[] = [
  { title: 'Transform', description: 'X/Y position, width, height, rotation in degrees, and opacity (0–1). The foundational spatial properties of every element.', Icon: Move },
  { title: 'Solid Fill Color', description: 'Direct hex color fill for the element background. The base layer beneath gradients, patterns, and materials.', Icon: Palette },
  { title: 'Material Fill System', description: 'Multi-layer gradient fill system with linear and radial layer types, color stops, blend modes, per-layer opacity, and animated transitions.', Icon: Layers },
  { title: 'Stroke & Border', description: 'Stroke color, pixel width, and full multi-layer material support for stroke — enabling gradient and textured outlines.', Icon: PenTool },
  { title: 'Corner Radius', description: 'Pixel-level corner rounding applied uniformly to rectangle shapes. Animatable for smooth morphing transitions.', Icon: Square },
  { title: 'Linear Gradient', description: 'Directional gradient fill with 6 direction presets (top-to-bottom, diagonal, etc.), multi-stop colors, per-stop opacity, and animated angle.', Icon: Palette },
  { title: 'Radial & Conic Gradients', description: 'Radial gradients with 5 center presets and conic sweep gradients — both with full color stop control and animated positioning.', Icon: Circle },
  { title: 'Pattern Fill', description: 'Repeating fill patterns: dots, lines, grid, diagonal, chevron, or custom SVG. Animatable color, background, size, spacing, angle, and opacity.', Icon: LayoutGrid },
  { title: 'Blend Modes', description: '16 element-level blend modes: Multiply, Screen, Overlay, Difference, Luminosity, Hue, Saturation, Color, and more for advanced compositing.', Icon: Layers },
  { title: 'Groups & Nesting', description: 'Group elements with shared parent transforms, nested z-ordering, and HBox/VBox auto-layout containers with padding and margin.', Icon: Folder },

  { title: 'Clipping Masks', description: 'Stack unlimited clip masks per element in rectangle, circle, star, or line shapes. Each mask supports feather, expand, invert, linked mode, and full animation.', Icon: Scissors },
  { title: 'Shadow Masks', description: 'Separate mask shapes applied exclusively to shadow output. Control which portion of a shadow is visible with the same mask toolset.', Icon: Scissors },

  { title: 'Drop Shadow', description: 'Classic shadow with X/Y offset, blur radius, color, and opacity. The standard shadow type for depth and elevation.', Icon: Sun },
  { title: 'Inner Shadow', description: 'Shadow applied inside the element border with per-edge control (top/right/bottom/left), blur, X/Y offset, and color.', Icon: CircleDashed },
  { title: 'Long Shadow', description: 'Extended shadow cast at a configurable angle with adjustable length and opacity decay for flat-design depth effects.', Icon: Sun },
  { title: 'Soft Shadow', description: 'Blurred ambient shadow with spread radius and softness control for natural, diffused light environments.', Icon: CloudFog },
  { title: 'Hard Shadow', description: 'Sharp, edge-defined shadow with X/Y offset and color. No blur, for precise graphic and illustration shadow styles.', Icon: Square },
  { title: 'Ambient Shadow', description: 'Omnidirectional ambient shadow with opacity and spread control, simulating soft global light wrap around elements.', Icon: Sun },

  { title: 'Outer Glow', description: 'Exterior glow surrounding the element with configurable radius, intensity, color, and falloff for neon and lit effects.', Icon: Sparkles },
  { title: 'Inner Glow', description: 'Glow applied inside the element boundary with thickness and intensity control for internal lighting effects.', Icon: Zap },
  { title: 'Directional Glow', description: 'Angled light beam glow with direction angle, strength, and spread — perfect for spotlight or sun-ray effects.', Icon: Sunrise },
  { title: 'Pulse Glow', description: 'Animated glow that oscillates between min and max radius at a configurable speed, creating a living energy effect.', Icon: Radio },
  { title: 'Rim Light', description: 'Edge lighting effect with color, thickness, brightness, and angle — ideal for 3D-style highlights and backlit silhouettes.', Icon: Sunrise },

  { title: 'Material Presets', description: '7 surface presets — Matte, Glossy, Metallic, Glass, Neon, Holographic, Plastic — each with unique visual properties and animatable parameters.', Icon: Gem },

  { title: 'Brightness & Contrast', description: 'Core tonal controls: brightness (−100 to 100), contrast (−100 to 100), exposure, and gamma correction for overall image balance.', Icon: Sun },
  { title: 'Temperature & Vibrance', description: 'Color temperature for warm/cool shifts, green/magenta tint balance, vibrance (smart saturation), and full saturation control.', Icon: Thermometer },
  { title: 'HSL & Monochrome', description: 'Hue rotation (−180° to 180°), lightness, and monochrome filters: grayscale, invert, and sepia tone adjustment.', Icon: RefreshCw },
  { title: 'Color Balance', description: 'Independent RGB adjustments for shadows, midtones, and highlights — the standard three-range color grading workflow.', Icon: BarChart2 },
  { title: 'Levels & RGB Channels', description: 'Black point, midpoint, and white point level control. Per-channel red, green, blue intensity from 0 to 200.', Icon: SlidersHorizontal },

  { title: 'Gaussian & Box Blur', description: 'Standard gaussian blur (0–50px radius) and box blur for softer, averaged results. Surface blur for edge-preserving smoothing.', Icon: CloudFog },
  { title: 'Motion & Radial Blur', description: 'Directional motion blur with angle and distance, and radial/spinning blur with configurable center X/Y position.', Icon: Wind },
  { title: 'Sharpen & Clarity', description: 'Unsharp mask (amount, radius, threshold), basic sharpen, and clarity enhancement for crispness and texture recovery.', Icon: Focus },
  { title: 'Noise', description: 'Add film grain with gaussian, uniform, or salt-pepper noise types (0–100). Reduce noise with median filter for smoothing.', Icon: Shuffle },

  { title: 'Ripple & Wave Distortion', description: 'Ripple wave with amplitude and wavelength control. Horizontal and vertical wave distortion for fluid, organic movement.', Icon: Activity },
  { title: 'Twirl, Spherize & Pinch', description: 'Rotational twirl (−360° to 360°), spherical lens distortion, pinch inward, and bulge outward for shape warping.', Icon: RefreshCw },
  { title: 'Lens Effects', description: 'Vignette with roundness and feather, lens flare with X/Y position, chromatic aberration color fringing, and barrel/pincushion lens distortion.', Icon: Scan },
  { title: 'Stylize Effects', description: 'Oil paint (brush size, detail), cartoon (edges, color levels), pencil sketch, watercolor granularity, and emboss with angle and amount.', Icon: Paintbrush },
  { title: 'Edge & Pixel Effects', description: 'Edge detection sensitivity, pixelate (1–50px), mosaic tiling, glowing edges with intensity, and posterize level control.', Icon: Grid2x2 },
  { title: 'Special Effects', description: 'Solarize threshold, threshold cutoff, halftone dot size, crystallize tile size, and Chroma Key with color picker, similarity, edge smoothness, and spill reduction.', Icon: Eye },
];
