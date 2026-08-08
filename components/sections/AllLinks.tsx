'use client';

import { Sparkles, Youtube, BookOpen, Map, Instagram, Mail, Twitter } from 'lucide-react';
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline';

const LINKS = [
  {
    id: 1,
    title: 'FlashFX App',
    date: '',
    content: 'Create stunning motion graphics directly in your browser.',
    category: 'App',
    icon: Sparkles,
    relatedIds: [4, 5],
    status: 'completed' as const,
    energy: 100,
    url: 'https://editor.flashfx.app',
  },
  {
    id: 2,
    title: 'YouTube',
    date: '',
    content: 'Tutorials and showcases to help you master FlashFX.',
    category: 'Social',
    icon: Youtube,
    relatedIds: [6, 3],
    status: 'completed' as const,
    energy: 85,
    url: 'https://www.youtube.com/@flashfxeditor',
  },
  {
    id: 3,
    title: 'X (Twitter)',
    date: '',
    content: 'Latest updates, tips and announcements from the FlashFX team.',
    category: 'Social',
    icon: Twitter,
    relatedIds: [2, 7],
    status: 'completed' as const,
    energy: 70,
    url: 'https://x.com/FlashFXeditor',
  },
  {
    id: 4,
    title: 'Documentation',
    date: '',
    content: 'Guides, references and resources for all skill levels.',
    category: 'Resources',
    icon: BookOpen,
    relatedIds: [5, 1],
    status: 'completed' as const,
    energy: 90,
    url: 'https://documentation.flashfx.app',
  },
  {
    id: 5,
    title: 'Roadmap',
    date: '',
    content: 'See what features are coming next and vote on what gets built.',
    category: 'Resources',
    icon: Map,
    relatedIds: [4, 1],
    status: 'in-progress' as const,
    energy: 75,
    url: 'https://roadmap.flashfx.app',
  },
  {
    id: 6,
    title: 'Instagram',
    date: '',
    content: 'Daily design inspiration and behind-the-scenes content.',
    category: 'Social',
    icon: Instagram,
    relatedIds: [2, 7],
    status: 'completed' as const,
    energy: 80,
    url: 'https://www.instagram.com/flashfxeditor/',
  },
  {
    id: 7,
    title: 'Newsletter',
    date: '',
    content: 'Weekly tips, updates and exclusive content straight to your inbox.',
    category: 'Community',
    icon: Mail,
    relatedIds: [3, 6],
    status: 'completed' as const,
    energy: 65,
    url: 'https://substack.com/@flashfx',
  },
];

export function AllLinks() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="text-center pt-20 pb-4">
        <h2
          className="mb-3"
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            color: '#F5C518',
          }}
        >
          All Links
        </h2>
        <p
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 400,
            fontSize: '1rem',
            color: 'rgba(230, 237, 243, 0.5)',
          }}
        >
          Click any node to explore: stay connected across platforms
        </p>
      </div>

      <RadialOrbitalTimeline timelineData={LINKS} />
    </section>
  );
}
