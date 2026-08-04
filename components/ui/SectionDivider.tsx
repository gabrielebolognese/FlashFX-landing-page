import React from 'react';

export function SectionDivider() {
  return (
    <hr
      className="border-0 h-px mx-auto w-4/5 my-0"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(124, 92, 191, 0.4) 20%, rgba(245, 197, 24, 0.5) 50%, rgba(124, 92, 191, 0.4) 80%, transparent 100%)',
      }}
    />
  );
}
