'use client';

import { useReports, useTriggerCapture, useWebsites } from '@/hooks/queries';
import { useScreenshot } from '../ScreenshotContext';
import { CameraIcon, CheckIcon, DownloadIcon, EyeIcon, GlobeIcon, WarningIcon } from '../icons';
import { Badge, Button, Card, PageHeader, ProgressBar, tdClass, thClass } from '../ui';

const STAT_ACCENT = {
  brand: 'bg-brand-soft text-brand',
  sage: 'bg-sage-soft text-sage-deep',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
} as const;

export function Dashboard() {
  const { data: sites = [] } = useWebsites();
  const { data: reports = [] } = useReports();
  const triggerCapture = useTriggerCapture();
  const { open: openScreenshot } = useScreenshot();

  const active = sites.filter((s) => s.status === 'active');
  const failed = sites.filter((s) => s.lastStatus === 'failed');
  const success = sites.filter((s) => s.lastStatus === 'success' && s.status === 'active');
  const disabled = sites.filter((s) => s.status === 'disabled');
  const pct = Math.round((success.length / Math.max(active.length, 1)) * 100);
  const healthTone = pct > 90 ? 'success' : pct > 70 ? 'warn' : 'brand';

  const stats = [
    { label: 'Total Websites', value: sites.length, sub: 'Configured', accent: 'brand' as const, Icon: GlobeIcon },
    { label: 'Active Monitoring', value: active.length, sub: 'Enabled', accent: 'sage' as const, Icon: CheckIcon },
    {
      label: 'Screenshots Today',
      value: reports.length > 0 ? reports[0].success + reports[0].failed : 0,
      sub: 'Last run captures',
      accent: 'success' as const,
      Icon: CameraIcon,
    },
    { label: 'Failed', value: failed.length, sub: 'Need attention', accent: 'danger' as const, Icon: WarningIcon },
  ];

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1180px] mx-auto">
      <PageHeader
        title="Dashboard"
        subtitle={`Today · ${today} · Live screenshot monitors`}
        actions={
          <Button onClick={() => triggerCapture.mutate()} disabled={triggerCapture.isPending}>
            <CameraIcon width={17} height={17} /> Run Capture Now
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, sub, accent, Icon }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-display font-semibold text-ink leading-none">{value}</div>
                <div className="text-sm text-ink-soft mt-2">{label}</div>
                <div className="text-[11px] text-ink-faint mt-0.5">{sub}</div>
              </div>
              <div className={`w-10 h-10 rounded-xl grid place-items-center ${STAT_ACCENT[accent]}`}>
                <Icon width={19} height={19} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        <Card>
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <span className="font-semibold text-ink">Recent Reports</span>
            <span className="text-xs text-brand">History log</span>
          </div>
          <div className="overflow-x-auto">
            <table>
              <thead className="bg-surface-2 border-b border-line">
                <tr>
                  {['Date', 'Time', 'Total', 'Success', 'Failed', ''].map((h) => (
                    <th key={h} className={thClass}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 7).map((r) => (
                  <tr key={r.id} className="border-b border-line/60 last:border-0 hover:bg-surface-2">
                    <td className={`${tdClass} text-ink font-medium`}>{r.date}</td>
                    <td className={`${tdClass} text-ink-soft`}>{r.time}</td>
                    <td className={`${tdClass} text-ink-soft`}>{r.total}</td>
                    <td className={`${tdClass} text-success font-semibold`}>{r.success}</td>
                    <td className={`${tdClass} ${r.failed > 0 ? 'text-danger font-semibold' : 'text-ink-faint'}`}>
                      {r.failed}
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <Button variant="ghost" size="sm" onClick={() => window.open(`/api/reports/${r.id}/pdf`, '_blank')}>
                        <DownloadIcon width={14} height={14} /> PDF
                      </Button>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-faint">
                      No reports generated yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="font-semibold text-ink mb-4">Website Health</div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ink-soft">Overall health</span>
              <span
                className={`font-semibold ${
                  healthTone === 'success' ? 'text-success' : healthTone === 'warn' ? 'text-warn' : 'text-brand'
                }`}
              >
                {pct}%
              </span>
            </div>
            <ProgressBar percent={pct} tone={healthTone} />
            <div className="flex justify-around mt-5">
              {[
                ['Online', success.length, 'text-success'],
                ['Failed', failed.length, 'text-danger'],
                ['Disabled', disabled.length, 'text-ink-faint'],
              ].map(([label, value, color]) => (
                <div key={label as string} className="text-center">
                  <div className={`text-2xl font-display font-semibold ${color}`}>{value}</div>
                  <div className="text-[11px] text-ink-faint mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="font-semibold text-ink mb-3 flex items-center gap-2">
              <WarningIcon width={17} height={17} className="text-danger" /> Failed Websites
            </div>
            {failed.length === 0 ? (
              <div className="text-sm text-success flex items-center gap-1.5">
                <CheckIcon width={16} height={16} /> All websites online
              </div>
            ) : (
              <div className="space-y-2.5">
                {failed.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between gap-2 pb-2.5 border-b border-line/60 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-ink truncate">{w.name}</div>
                      <div className="text-[11px] text-danger truncate">{w.error}</div>
                    </div>
                    {w.lastCaptureImage && (
                      <Button variant="ghost" size="sm" onClick={() => openScreenshot(w.name, w.lastCaptureImage!)}>
                        <EyeIcon width={14} height={14} /> View
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
