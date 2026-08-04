import { Diamond } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AnimationPresetItem {
  title: string;
  description: string;
  category: string;
  Icon: LucideIcon;
}

const D = Diamond;

export const animationPresets: AnimationPresetItem[] = [
  { title: 'Collapse', description: 'Scale element down to 0', category: 'Scale & Visibility', Icon: D },
  { title: 'Expand', description: 'Scale element from 0 to normal size', category: 'Scale & Visibility', Icon: D },
  { title: 'Pop In', description: 'Scale 0.7 → 1.05 → 1.0 with spring overshoot', category: 'Scale & Visibility', Icon: D },
  { title: 'Pop Out', description: 'Scale 1.0 → 1.1 → 0 with overshoot exit', category: 'Scale & Visibility', Icon: D },
  { title: 'Pulse', description: 'Scale 1.0 → 1.08 → 1.0 attention loop', category: 'Scale & Visibility', Icon: D },
  { title: 'Breath', description: 'Gentle continuous scale loop 0.95 ↔ 1.0', category: 'Scale & Visibility', Icon: D },

  { title: 'Slide In Left', description: 'Element enters from offscreen left', category: 'Position & Movement', Icon: D },
  { title: 'Slide In Right', description: 'Element enters from offscreen right', category: 'Position & Movement', Icon: D },
  { title: 'Slide In Top', description: 'Element enters from offscreen top', category: 'Position & Movement', Icon: D },
  { title: 'Slide In Bottom', description: 'Element enters from offscreen bottom', category: 'Position & Movement', Icon: D },
  { title: 'Slide Out Left', description: 'Element exits to the left offscreen', category: 'Position & Movement', Icon: D },
  { title: 'Slide Out Right', description: 'Element exits to the right offscreen', category: 'Position & Movement', Icon: D },
  { title: 'Slide Out Top', description: 'Element exits to the top offscreen', category: 'Position & Movement', Icon: D },
  { title: 'Slide Out Bottom', description: 'Element exits to the bottom offscreen', category: 'Position & Movement', Icon: D },
  { title: 'Nudge Left', description: 'Small leftward position shift and return', category: 'Position & Movement', Icon: D },
  { title: 'Nudge Right', description: 'Small rightward position shift and return', category: 'Position & Movement', Icon: D },
  { title: 'Nudge Up', description: 'Small upward position shift and return', category: 'Position & Movement', Icon: D },
  { title: 'Nudge Down', description: 'Small downward position shift and return', category: 'Position & Movement', Icon: D },
  { title: 'Snap Back', description: 'Element snaps back to original position', category: 'Position & Movement', Icon: D },

  { title: 'Fade In', description: 'Opacity animates from 0 to 1', category: 'Opacity', Icon: D },
  { title: 'Fade Out', description: 'Opacity animates to 0', category: 'Opacity', Icon: D },
  { title: 'Flash', description: 'Opacity: 1 → 0 → 1 flash burst', category: 'Opacity', Icon: D },
  { title: 'Blink', description: 'Continuous 1 ↔ 0 opacity loop', category: 'Opacity', Icon: D },

  { title: 'Twist In', description: 'Rotate from -15° to 0° on entry', category: 'Rotation', Icon: D },
  { title: 'Twist Out', description: 'Rotate to +15° on exit', category: 'Rotation', Icon: D },
  { title: 'Spin In', description: 'Full -180° to 0° rotation entry', category: 'Rotation', Icon: D },
  { title: 'Spin Out', description: 'Full 0° to +180° rotation exit', category: 'Rotation', Icon: D },
  { title: 'Wobble', description: 'Rock -6° → +6° → -4° → 0° oscillation', category: 'Rotation', Icon: D },

  { title: 'Bounce In', description: 'Scale overshoots then settles at 1.0', category: 'Overshoot & Energy', Icon: D },
  { title: 'Bounce Out', description: 'Forward bounce then exits offscreen', category: 'Overshoot & Energy', Icon: D },
  { title: 'Overshoot Scale', description: 'Scale 0.9 → 1.1 → 1.0 with settle', category: 'Overshoot & Energy', Icon: D },
  { title: 'Snap', description: 'Quick easing change with sharp snap feel', category: 'Overshoot & Energy', Icon: D },

  { title: 'Point Left', description: 'Move left then return to origin', category: 'Attention & Shake', Icon: D },
  { title: 'Point Right', description: 'Move right then return to origin', category: 'Attention & Shake', Icon: D },
  { title: 'Point Up', description: 'Move up then return to origin', category: 'Attention & Shake', Icon: D },
  { title: 'Point Down', description: 'Move down then return to origin', category: 'Attention & Shake', Icon: D },
  { title: 'Shake X', description: 'Rapid horizontal shake back and forth', category: 'Attention & Shake', Icon: D },
  { title: 'Shake Y', description: 'Rapid vertical shake up and down', category: 'Attention & Shake', Icon: D },

  { title: 'Grow Width', description: 'Animate width from 0 to full size', category: 'Shape-Specific', Icon: D },
  { title: 'Grow Height', description: 'Animate height from 0 to full size', category: 'Shape-Specific', Icon: D },
  { title: 'Center Expand', description: 'Element expands outward from its center', category: 'Shape-Specific', Icon: D },
  { title: 'Edge Expand', description: 'Element expands outward from its edge', category: 'Shape-Specific', Icon: D },

  { title: 'Zoom Focus', description: 'Scale up with position shift toward subject', category: 'Camera & Global', Icon: D },
  { title: 'Zoom Out', description: 'Scale down with fade for pullback effect', category: 'Camera & Global', Icon: D },

  { title: 'Fast In', description: 'Quick ease-in entry with sharp acceleration', category: 'Timing Macros', Icon: D },
  { title: 'Fast Out', description: 'Quick ease-out exit with sharp deceleration', category: 'Timing Macros', Icon: D },
  { title: 'Smooth In Out', description: 'Smooth easing on both entry and exit', category: 'Timing Macros', Icon: D },
  { title: 'Aggressive Snap', description: 'Very short duration with maximum easing curve', category: 'Timing Macros', Icon: D },

  { title: 'Appear', description: 'Fade combined with scale-in entry', category: 'Killer Buttons', Icon: D },
  { title: 'Disappear', description: 'Fade combined with scale-out exit', category: 'Killer Buttons', Icon: D },
  { title: 'Enter', description: 'Slide combined with fade-in from side', category: 'Killer Buttons', Icon: D },
  { title: 'Exit', description: 'Slide combined with fade-out to side', category: 'Killer Buttons', Icon: D },
  { title: 'Emphasize', description: 'Scale pulse with overshoot for emphasis', category: 'Killer Buttons', Icon: D },

  { title: 'Typewriter', description: 'Characters appear one by one with opacity animation', category: 'Text Animator', Icon: D },
  { title: 'Slide Up', description: 'Characters slide up with position Y and opacity fade', category: 'Text Animator', Icon: D },
  { title: 'Line Reveal', description: 'Lines revealed with animated mask height', category: 'Text Animator', Icon: D },
  { title: 'Fade In Words', description: 'Words fade in sequentially with stagger', category: 'Text Animator', Icon: D },
  { title: 'Scale In', description: 'Characters scale in from center with opacity', category: 'Text Animator', Icon: D },
  { title: 'Blur In', description: 'Words blur in with combined opacity fade', category: 'Text Animator', Icon: D },

  { title: 'Script Write', description: 'Handwriting-style character reveal effect', category: 'Text Reveal', Icon: D },
  { title: 'Word Pop', description: 'Words pop in with scale bounce per word', category: 'Text Reveal', Icon: D },
  { title: 'Mask Wipe', description: 'Directional mask wipe reveal across text', category: 'Text Reveal', Icon: D },
  { title: 'Fade In Order', description: 'Sequential opacity fade per text segment', category: 'Text Reveal', Icon: D },
  { title: 'Underline Write', description: 'Text appears alongside an animated underline', category: 'Text Reveal', Icon: D },

  { title: 'Rise From Baseline', description: 'Characters rise up from the text baseline', category: 'Text Motion In', Icon: D },
  { title: 'Drop In', description: 'Characters drop in from above the text line', category: 'Text Motion In', Icon: D },
  { title: 'Scale Up', description: 'Characters scale up to full size on entry', category: 'Text Motion In', Icon: D },
  { title: 'Elastic In', description: 'Characters enter with elastic spring bounce', category: 'Text Motion In', Icon: D },
  { title: 'Flip In', description: 'Characters flip in on the horizontal axis', category: 'Text Motion In', Icon: D },
  { title: 'Split Reveal', description: 'Text splits from center and reveals outward', category: 'Text Motion In', Icon: D },
  { title: 'Slide Out', description: 'Text segments slide out to a direction', category: 'Text Motion Out', Icon: D },
  { title: 'Fade Out Order', description: 'Sequential opacity fade-out per segment', category: 'Text Motion Out', Icon: D },
  { title: 'Collapse Text', description: 'Text collapses and scales down to a point', category: 'Text Motion Out', Icon: D },
  { title: 'Explode', description: 'Text fragments scatter outward on exit', category: 'Text Motion Out', Icon: D },
  { title: 'Sink', description: 'Characters sink downward out of frame', category: 'Text Motion Out', Icon: D },

  { title: 'Pulse Text', description: 'Text pulses with scale loop for emphasis', category: 'Text Emphasis', Icon: D },
  { title: 'Wiggle', description: 'Text segments wiggle with rotation loop', category: 'Text Emphasis', Icon: D },
  { title: 'Bounce Text', description: 'Characters bounce vertically in sequence', category: 'Text Emphasis', Icon: D },
  { title: 'Shake Text', description: 'Characters shake rapidly for impact', category: 'Text Emphasis', Icon: D },
  { title: 'Glow Pulse', description: 'Text glows with a pulsing light effect', category: 'Text Emphasis', Icon: D },

  { title: 'Morph In', description: 'Text morphs into position from an abstract form', category: 'Text Transform', Icon: D },
  { title: 'Stretch In', description: 'Text stretches horizontally into final shape', category: 'Text Transform', Icon: D },
  { title: 'Skew Snap', description: 'Text snaps into position with skew transform', category: 'Text Transform', Icon: D },
  { title: 'Perspective Push', description: 'Text pushes in with 3D perspective depth', category: 'Text Transform', Icon: D },

  { title: 'Kinetic Flow', description: 'Complex multi-property kinetic motion sequence', category: 'Text Premium', Icon: D },
  { title: 'Wave Write', description: 'Characters wave in along a sine path', category: 'Text Premium', Icon: D },
  { title: 'Fragment Assemble', description: 'Text fragments fly in and assemble together', category: 'Text Premium', Icon: D },
  { title: 'Neon Draw', description: 'Text draws itself with a neon glow effect', category: 'Text Premium', Icon: D },
  { title: 'Glitch In', description: 'Text glitches into view with distortion artifacts', category: 'Text Premium', Icon: D },
  { title: 'Magnetic Align', description: 'Text characters magnetically snap into alignment', category: 'Text Premium', Icon: D },
];
