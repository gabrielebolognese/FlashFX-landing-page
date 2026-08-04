'use client';

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-black/50 ${className ?? ''}`}>
      <p className="text-white/40 text-sm">3D scene unavailable</p>
    </div>
  );
}
