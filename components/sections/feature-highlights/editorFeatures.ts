import { Clock, Layers, Zap, TrendingUp, FolderOpen, Palette, Music, Sparkles, LayoutTemplate, PenTool, TextCursor, SlidersHorizontal, Scissors, Video, Download, MessageSquare, Search, Cloud, Magnet, Folder, Library, FileCode, Columns2, Command, RotateCcw, Film, Database, GraduationCap, Settings, Shield, SlidersVertical, Pen, Component, Activity, Gauge, Image, AlignLeft, CircleDot, Eye, LayoutGrid, FileArchive, MousePointer2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface FeatureItem {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export const editorFeatures: FeatureItem[] = [
  { title: 'Vector Design Tools', description: 'Draw rectangles, circles, stars, lines, and arrows with precision. Free-form pen tool with bezier curves, smoothing, and path closing.', Icon: PenTool },
  { title: 'Advanced Text System', description: 'Per-segment styling with different fonts, sizes, weights, and colors. Text curves, gradient fills, stroke, shadow, glow, and 70+ typography controls.', Icon: TextCursor },
  { title: 'Material System', description: '7 unique materials: Matte, Glossy, Metallic, Glass, Neon, Holographic, and Plastic — each with animatable properties and multi-layer gradient fills.', Icon: CircleDot },
  { title: '70+ Image Filters', description: 'Professional filters across 14 categories: blur, sharpen, color grading, distortion, noise, stylize, lens effects, and more.', Icon: SlidersHorizontal },
  { title: 'Keyframe Animation', description: '50+ animatable properties with per-keyframe bezier handles. Animate transforms, colors, effects, filters, materials, and more.', Icon: Zap },
  { title: 'Multi-Track Timeline', description: 'Dual timeline layout with clip management, named markers, frame-rate presets, loop mode, and pixel-per-second zoom control.', Icon: Clock },
  { title: '16 Easing Functions', description: 'From linear to elastic and bounce, with custom bezier curve control per keyframe. Full hold keyframe support for step interpolation.', Icon: TrendingUp },
  { title: 'Text Animation Modes', description: 'Animate text by character, word, line, or object level with stagger, masking reveals, and procedural text animator layers.', Icon: AlignLeft },
  { title: 'Shadow & Glow Effects', description: '6 shadow types (Drop, Long, Soft, Hard, Inner, Ambient) and 5 glow types (Outer, Inner, Directional, Pulse, Rim Light) — all animatable.', Icon: Sparkles },
  { title: 'Gradient Fill System', description: 'Linear, radial, and conic gradients with multi-stop colors, per-stop opacity, animated angle control, and centered position adjustment.', Icon: Palette },
  { title: 'Pattern Fill', description: 'Dots, lines, grid, diagonal, chevron, and custom SVG patterns. Animatable color, background, size, spacing, and angle properties.', Icon: LayoutGrid },
  { title: 'Masking & Clipping', description: 'Stack multiple masks per element with feather, expand, invert, linked mode, and fully animatable mask properties.', Icon: Scissors },
  { title: 'Video Support', description: 'Import video files with GPU-accelerated playback. Trim, offset, transform, apply filters, and sync with the animation timeline.', Icon: Video },
  { title: 'Multi-Track Audio', description: 'Unlimited audio tracks with waveform visualization, fade in/out, per-clip volume, solo/mute, and perfect animation synchronization.', Icon: Music },
  { title: 'MP4 & WebM Export', description: 'H.264 and VP8/VP9 encoding via FFmpeg with quality presets, custom resolution, frame rate control, and real-time progress tracking.', Icon: Download },
  { title: 'PNG Sequence Export', description: 'Export every frame as a numbered PNG with transparent background support — perfect for compositing in external tools.', Icon: Image },
  { title: 'AI Image Generation', description: 'Generate images with DALL-E directly on your canvas using natural language prompts and import them instantly.', Icon: Sparkles },
  { title: 'AI Chat Assistant', description: 'Natural language design commands with context-aware AI suggestions, chat history, and AI-powered design guidance.', Icon: MessageSquare },
  { title: 'Google Image Search', description: 'Find and import stock images directly into your project without leaving the editor. Preview before import.', Icon: Search },
  // 50 MB is the no-account allowance; 500 MB is the free tier once signed up.
  // Stating only "50MB free storage" read as the free tier and contradicted
  // PricingSection.tsx, which is the source of truth for what a plan includes.
  { title: 'Cloud Storage', description: 'Save and access projects from any device via Supabase. 50 MB without an account and 500 MB on the free tier, with automatic backup and secure user isolation.', Icon: Cloud },
  { title: 'Chroma Key', description: 'Green screen removal with color picker selection, similarity control, edge smoothness, and spill reduction.', Icon: Eye },
  { title: '16 Blend Modes', description: 'Multiply, Screen, Overlay, Difference, Luminosity, and 11 more — applied per layer for advanced compositing control.', Icon: Layers },
  { title: 'Smart Guides & Snapping', description: 'Snap to grid, other elements, timeline markers, and keyframes with visual alignment guides and configurable grid size.', Icon: Magnet },
  { title: 'HBox & VBox Layouts', description: 'Auto-distributing horizontal and vertical layout containers with padding, margin, and nested layout support.', Icon: LayoutTemplate },
  { title: 'Groups & Layers', description: 'Nested grouping, z-ordering, enter/exit group editing, group-level transforms, and lock/hide per layer.', Icon: Folder },
  { title: 'Icon Library', description: 'Large built-in SVG icon library with full-text search, chunk loading for performance, and drag-and-drop to canvas.', Icon: Library },
  { title: 'SVG Import', description: 'Import SVG files with fill/stroke color override, ViewBox preservation, aspect ratio control, and inline editing.', Icon: FileCode },
  { title: '3 Layout Modes', description: 'Switch between Design, Animate, and Advanced modes. Each mode surfaces the tools you need without clutter.', Icon: Columns2 },
  { title: 'Keyboard Shortcuts', description: 'Fully customizable shortcut system with conflict detection, visual keyboard layout guide, and extensible binding registry.', Icon: Command },
  { title: 'Unlimited Undo/Redo', description: 'Operation-based history with labeled entries, debounced commits, and efficient state snapshots for smooth editing.', Icon: RotateCcw },
  { title: 'Sequence Compositor', description: 'Create multiple sequences per project with independent duration, FPS, and instant switching between sequences.', Icon: Film },
  { title: 'Project Files (.flashfx)', description: 'Compressed JSON format with embedded assets, metadata, version history, and full cross-platform portability.', Icon: FileArchive },
  { title: 'Media Pool', description: 'Centralized asset management with preview, metadata, search, rename, delete, type filtering, and storage quota tracking.', Icon: Database },
  { title: 'Tutorial System', description: 'Interactive onboarding with step-based guidance, spotlight highlights on UI elements, and a welcome modal for new users.', Icon: GraduationCap },
  { title: 'Context Menus', description: 'Right-click menus on canvas, layers, timeline clips, and media pool for fast contextual actions without leaving your workflow.', Icon: MousePointer2 },
  { title: 'Settings & Preferences', description: 'Comprehensive settings for canvas appearance, shape defaults, animation defaults, keyframe display, and the code editor.', Icon: Settings },
  { title: 'Auto-Backup', description: 'Automatic preview generation and periodic cloud backup for authenticated users. Guest mode auto-saves to localStorage.', Icon: Shield },
  { title: 'Color Grading', description: 'Levels, RGB channel control, color balance (shadows/midtones/highlights), HSL adjustments, and curves for cinematic looks.', Icon: SlidersVertical },
  { title: 'Pen Tool', description: 'Free-form bezier path drawing with smoothing, corner radius per point, dash arrays, trim start/end, and open/closed path toggle.', Icon: Pen },
  { title: 'UI Components', description: 'Built-in Button, Chat Bubble, Input, Toggle, Modal, and Progress Bar shapes — perfect for interface mockups and product demos.', Icon: Component },
  { title: 'Arrow & Line Tools', description: 'Configurable arrowheads (Triangle, Circle, Bar, Diamond), dash arrays, line cap/join styles, and auto-scale arrow size.', Icon: Activity },
  { title: 'Interpolation Graph', description: 'Visual bezier curve editor for per-keyframe easing. Drag handles to sculpt custom motion curves with precision.', Icon: TrendingUp },
  { title: 'Frame Rate Presets', description: '24 fps (Film), 25 fps (PAL), 30 fps (HD), 60 fps (High), and 120 fps (Ultra) — switch anytime without losing your work.', Icon: Gauge },
  { title: 'Asset Management', description: 'Organize and reuse images, audio, and video across projects. Browse, preview, and import from a single centralized panel.', Icon: FolderOpen },
  { title: 'AI Motion Pipeline', description: '4-stage AI generation (Validate → High-Level → Low-Level → Placement) with progress tracking and partial success handling.', Icon: Sparkles },
];
