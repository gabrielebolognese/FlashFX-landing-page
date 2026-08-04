'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

const VIDEO_TARGET = 5;

interface LoadingContextValue {
  isLoaded: boolean;
  setIsLoaded: (v: boolean) => void;
  videosReady: boolean;
  markVideoReady: () => void;
}

const LoadingContext = createContext<LoadingContextValue>({
  isLoaded: false,
  setIsLoaded: () => {},
  videosReady: false,
  markVideoReady: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videosReady, setVideosReady] = useState(false);
  const countRef = useRef(0);

  const markVideoReady = useCallback(() => {
    countRef.current += 1;
    if (countRef.current >= VIDEO_TARGET) {
      setVideosReady(true);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoaded, setIsLoaded, videosReady, markVideoReady }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function usePageLoaded() {
  return useContext(LoadingContext);
}
