'use client';

import { useState } from 'react';
import type { Report } from '@/lib/types';
import { useReports } from '@/hooks/queries';
import { useScreenshot } from '../ScreenshotContext';
import { CloseIcon, DownloadIcon, EyeIcon } from '../icons';
import { Badge, Button, Card, EmptyRow, PageHeader, ProgressBar, tdClass, thClass } from '../ui';

/** A report's display name: the single site's name, or "all" for multi-site runs. */
function reportName(r: Report): string {
  if (r.details.length === 1) return r.details[0].name;
  if (r.details.length > 1 || r.total > 1) return 'all';
  return '–';
}

export function Reports() {
  const { data: reports = [] } = useReports();
  const { open: openScreenshot } = useScreenshot();
  const [sel, setSel] = useState<Report | null>(null);

  return (
    <div className="p-8 max-w-[1180px] mx-auto">
      <PageHeader title="Reports" subtitle="All generated PDF reports · click a row for details" />

      <div className={`grid gap-5 ${sel ? 'grid-cols-1 lg:grid-cols-[1fr_420px]' : 'grid-cols-1'}`}>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table>
              <thead className="bg-surface-2 border-b border-line">
                <tr>
                  {['Date', 'Name', 'Time', 'Total', 'Success', 'Failed', 'Rate', ''].map((h) => (
                    <th key={h} className={thClass}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => {
                  const pct = Math.round((r.success / Math.max(r.total, 1)) * 100);
                  const isActive = sel?.id === r.id;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSel(isActive ? null : r)}
                      className={`border-b border-line/60 last:border-0 cursor-pointer ${
                        isActive ? 'bg-brand-soft' : 'hover:bg-surface-2'
                      }`}
                    >
                      <td className={`${tdClass} text-ink`}>{r.date}</td>
                      <td className={`${tdClass} text-ink font-medium`}>{reportName(r)}</td>
                      <td className={`${tdClass} text-ink-soft`}>{r.time}</td>
                      <td className={`${tdClass} text-ink-soft`}>{r.total}</td>
                      <td className={`${tdClass} text-success font-semibold`}>{r.success}</td>
                      <td className={`${tdClass} ${r.failed > 0 ? 'text-danger font-semibold' : 'text-ink-faint'}`}>
                        {r.failed}
                      </td>
                      <td className={tdClass}>
                        <div className="flex items-center gap-2">
                          <div className="w-12">
                            <ProgressBar percent={pct} tone={pct === 100 ? 'success' : 'warn'} />
                          </div>
                          <span className={`text-xs ${pct === 100 ? 'text-success' : 'text-warn'}`}>{pct}%</span>
                        </div>
                      </td>
                      <td className={`${tdClass} text-right`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/api/reports/${r.id}/pdf`, '_blank');
                          }}
                        >
                          <DownloadIcon width={14} height={14} /> PDF
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {reports.length === 0 && <EmptyRow colSpan={8}>No reports found</EmptyRow>}
              </tbody>
            </table>
          </div>
        </Card>

        {sel && (
          <Card className="p-5 h-fit max-h-[85vh] overflow-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-display font-semibold text-ink">Report Detail</div>
                <div className="text-xs text-ink-faint mt-0.5">
                  {sel.date} · {sel.time}
                </div>
              </div>
              <button onClick={() => setSel(null)} className="text-ink-faint hover:text-ink cursor-pointer">
                <CloseIcon width={18} height={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {[
                ['Total Sites', sel.total, 'text-brand'],
                ['Success', sel.success, 'text-success'],
                ['Failed', sel.failed, 'text-danger'],
                ['Rate', `${Math.round((sel.success / Math.max(sel.total, 1)) * 100)}%`, 'text-warn'],
              ].map(([label, value, color]) => (
                <div key={label as string} className="bg-surface-2 rounded-xl p-3 text-center">
                  <div className={`text-xl font-display font-semibold ${color}`}>{value}</div>
                  <div className="text-[11px] text-ink-faint mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="text-xs font-semibold text-ink-soft mb-2">Website Check Summary</div>
            <div className="space-y-2 mb-4">
              {sel.details.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-2 bg-surface-2 rounded-xl p-2.5">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-ink truncate">{d.name}</div>
                    <div className="text-[10px] text-ink-faint truncate">{d.url}</div>
                    {d.loadTime != null && <span className="text-[10px] text-brand">{d.loadTime}ms</span>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {d.status === 'success' ? (
                      <span className="text-[10px] text-success font-semibold">✓ OK</span>
                    ) : (
                      <span className="text-[10px] text-danger font-semibold">✗ Fail</span>
                    )}
                    {d.screenshot && (
                      <button
                        onClick={() => openScreenshot(d.name, d.screenshot!)}
                        className="text-brand hover:text-brand-deep cursor-pointer"
                      >
                        <EyeIcon width={14} height={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface-2 rounded-xl p-3 mb-3">
              <div className="text-[11px] text-ink-faint mb-1">File Name</div>
              <div className="text-xs text-brand break-all">{sel.file}</div>
            </div>

            <Button className="w-full" onClick={() => window.open(`/api/reports/${sel.id}/pdf`, '_blank')}>
              <DownloadIcon width={16} height={16} /> Download PDF Report
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
