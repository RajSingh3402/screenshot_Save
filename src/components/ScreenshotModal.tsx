'use client';

import { useState } from 'react';
import { Button } from './ui';

export interface ScreenshotState {
  show: boolean;
  title: string;
  file: string;
}

export function ScreenshotModal({ state, onClose }: { state: ScreenshotState; onClose: () => void }) {
  const [failed, setFailed] = useState(false);
  if (!state.show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink/70 backdrop-blur-sm p-5">
      <div className="w-full max-w-4xl flex items-center justify-between mb-3">
        <h3 className="text-base font-display font-semibold text-white">Screenshot · {state.title}</h3>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      <div className="w-full max-w-4xl max-h-[82vh] overflow-auto rounded-xl border border-white/15 bg-surface">
        {failed ? (
          <div className="p-12 text-center text-sm text-ink-soft">
            Could not load screenshot. The file might not be generated yet.
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/screenshots/${state.file}`}
            alt={`Capture of ${state.title}`}
            className="w-full block bg-surface-2"
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  );
}
