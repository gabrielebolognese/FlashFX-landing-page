'use client';

import { LoadingProvider } from '@/lib/loading-context';

function ContentGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function BodyWrapper({ children }: { children: React.ReactNode }) {
  return <LoadingProvider>{children}</LoadingProvider>;
}

export { ContentGate };
