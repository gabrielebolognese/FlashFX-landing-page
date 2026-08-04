'use client';

import { BackgroundPaths } from '@/components/ui/background-paths';

export function CreatorStories() {
  return (
    <section className="relative w-full">
      <BackgroundPaths
        title="Earn with FlashFX"
        description="Join thousands making professional content"
      >
        <div className="w-full max-w-4xl mx-auto mt-8">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-fx-bg-surface backdrop-blur-sm border border-fx-border shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-fx-accent-yellow/10 backdrop-blur-sm flex items-center justify-center border border-fx-accent-yellow/25">
                  <svg
                    className="w-8 h-8 text-fx-accent-yellow"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
                <p className="text-fx-text-secondary text-sm">Video Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </BackgroundPaths>
    </section>
  );
}
