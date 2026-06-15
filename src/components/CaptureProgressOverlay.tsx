'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { keys, useCaptureProgress } from '@/hooks/queries';
import { CameraIcon } from './icons';
import { ProgressBar } from './ui';

export function CaptureProgressOverlay() {
  const { data: progress } = useCaptureProgress();
  const qc = useQueryClient();
  const wasActive = useRef(false);

  // When a capture run finishes (active → inactive), refresh sites + reports once.
  useEffect(() => {
    if (wasActive.current && !progress?.active) {
      qc.invalidateQueries({ queryKey: keys.websites });
      qc.invalidateQueries({ queryKey: keys.reports });
    }
    wasActive.current = Boolean(progress?.active);
  }, [progress?.active, qc]);

  if (!progress?.active) return null;
  const percent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/55 backdrop-blur-sm p-4">
      <div className="animate-fade-in w-full max-w-md bg-surface border border-line rounded-2xl shadow-[var(--shadow-pop)] p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-soft text-brand grid place-items-center mb-4 animate-soft-pulse">
          <CameraIcon width={26} height={26} />
        </div>
        <h3 className="text-lg font-display font-semibold text-ink mb-2">Capture in progress</h3>
        <p className="text-sm text-ink-soft mb-5 min-h-[2.5rem]">{progress.status}</p>

        {progress.total > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-ink-faint">
              <span>Progress</span>
              <span>
                {progress.current} / {progress.total} sites
              </span>
            </div>
            <ProgressBar percent={percent} />
          </div>
        )}

        <p className="text-[11px] text-ink-faint mt-5">Running headless Puppeteer screenshot sessions…</p>
      </div>
    </div>
  );
}
