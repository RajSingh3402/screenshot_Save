'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { ScreenshotModal, type ScreenshotState } from './ScreenshotModal';

interface ScreenshotContextValue {
  open: (title: string, file: string) => void;
}

const ScreenshotContext = createContext<ScreenshotContextValue | null>(null);

/** Access the app-wide screenshot preview opener. */
export function useScreenshot(): ScreenshotContextValue {
  const ctx = useContext(ScreenshotContext);
  if (!ctx) throw new Error('useScreenshot must be used within ScreenshotProvider');
  return ctx;
}

export function ScreenshotProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScreenshotState>({ show: false, title: '', file: '' });

  return (
    <ScreenshotContext.Provider value={{ open: (title, file) => setState({ show: true, title, file }) }}>
      {children}
      <ScreenshotModal state={state} onClose={() => setState({ show: false, title: '', file: '' })} />
    </ScreenshotContext.Provider>
  );
}
