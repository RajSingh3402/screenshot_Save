'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CaptureProgressOverlay } from './CaptureProgressOverlay';
import { ScreenshotProvider } from './ScreenshotContext';

export function Providers({ children }: { children: ReactNode }) {
  // One QueryClient per browser session (kept stable across re-renders).
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ScreenshotProvider>
        {children}
        <CaptureProgressOverlay />
      </ScreenshotProvider>
    </QueryClientProvider>
  );
}
