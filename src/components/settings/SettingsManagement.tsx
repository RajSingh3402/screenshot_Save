'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Settings } from '@/lib/types';
import { recipientSchema, scheduleTimeSchema, smtpSchema, type SmtpFormValues } from '@/lib/schemas';
import { useSaveSettings, useSettings } from '@/hooks/queries';
import { ClockIcon, CloseIcon, MailIcon, UsersIcon } from '../icons';
import { Button, Card, Field, Input, PageHeader } from '../ui';

/** Format "14:30" → "02:30 PM (14:30)". */
function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = (hour % 12 || 12).toString().padStart(2, '0');
  return `${displayHour}:${m} ${ampm} (${time})`;
}

const EMPTY: Settings = { smtp: { host: '', port: '', user: '', pass: '' }, recipients: [], schedules: [] };

export function SettingsManagement() {
  const { data: settings = EMPTY } = useSettings();
  const saveSettings = useSaveSettings();

  const [newRecipient, setNewRecipient] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('09:00');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [clock, setClock] = useState('');

  const smtpForm = useForm<SmtpFormValues>({ resolver: zodResolver(smtpSchema), defaultValues: settings.smtp });

  // Keep the SMTP form in sync once settings load from the server.
  useEffect(() => {
    smtpForm.reset(settings.smtp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.smtp.host, settings.smtp.port, settings.smtp.user, settings.smtp.pass]);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  function flash(message: string, isErr = false) {
    if (isErr) {
      setErr(message);
      setTimeout(() => setErr(null), 4000);
    } else {
      setMsg(message);
      setTimeout(() => setMsg(null), 4000);
    }
  }

  async function persist(patch: Partial<Settings>) {
    try {
      await saveSettings.mutateAsync(patch);
      flash('Settings saved successfully!');
    } catch {
      flash('Failed to save settings.', true);
    }
  }

  const saveSmtp = smtpForm.handleSubmit((values) => persist({ smtp: values }));

  function addRecipient(e: React.FormEvent) {
    e.preventDefault();
    const parsed = recipientSchema.safeParse({ email: newRecipient });
    if (!parsed.success) return flash(parsed.error.issues[0].message, true);
    if (settings.recipients.some((r) => r.email.toLowerCase() === parsed.data.email.toLowerCase()))
      return flash('Recipient already exists.', true);
    setNewRecipient('');
    persist({ recipients: [...settings.recipients, { id: Date.now(), email: parsed.data.email }] });
  }

  function addSchedule(e: React.FormEvent) {
    e.preventDefault();
    const parsed = scheduleTimeSchema.safeParse(newScheduleTime);
    if (!parsed.success) return flash(parsed.error.issues[0].message, true);
    if (settings.schedules.some((s) => s.time === parsed.data)) return flash('Schedule already exists.', true);
    const schedules = [...settings.schedules, { id: Date.now(), time: parsed.data, enabled: true }].sort((a, b) =>
      a.time.localeCompare(b.time),
    );
    persist({ schedules });
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[980px] mx-auto">
      <PageHeader title="Settings" subtitle="Configure email alerts, SMTP parameters and scan schedules" />

      {msg && <Card className="border-success/40 bg-success-soft/60 p-3.5 mb-5 text-sm text-success">✅ {msg}</Card>}
      {err && <Card className="border-danger/40 bg-danger-soft/50 p-3.5 mb-5 text-sm text-danger">❌ {err}</Card>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6 h-fit">
          <h2 className="font-display font-semibold text-ink mb-4 flex items-center gap-2">
            <MailIcon width={18} height={18} className="text-brand" /> SMTP Configuration
          </h2>
          <form onSubmit={saveSmtp} className="space-y-3.5">
            <Field label="SMTP Server Host">
              <Input {...smtpForm.register('host')} placeholder="smtp.mailtrap.io" />
            </Field>
            <Field label="SMTP Port">
              <Input {...smtpForm.register('port')} placeholder="e.g. 587 or 2525" />
            </Field>
            <Field label="SMTP Username">
              <Input {...smtpForm.register('user')} placeholder="smtp-user@company.com" />
            </Field>
            <Field label="SMTP Password">
              <Input type="password" {...smtpForm.register('pass')} placeholder="••••••••••••" />
            </Field>
            <Button type="submit" className="w-full" disabled={saveSettings.isPending}>
              Save SMTP Config
            </Button>
          </form>
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="font-display font-semibold text-ink mb-1.5 flex items-center gap-2">
              <UsersIcon width={18} height={18} className="text-sage-deep" /> Email Recipients
            </h2>
            <p className="text-xs text-ink-soft mb-3.5">These addresses receive automated reports as PDF attachments.</p>
            <form onSubmit={addRecipient} className="flex gap-2 mb-4">
              <Input type="email" value={newRecipient} onChange={(e) => setNewRecipient(e.target.value)} placeholder="recipient@company.com" />
              <Button variant="secondary" type="submit">
                Add
              </Button>
            </form>
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {settings.recipients.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-surface-2 border border-line/60 rounded-lg px-3 py-2">
                  <span className="text-sm text-ink">{r.email}</span>
                  <button
                    onClick={() => persist({ recipients: settings.recipients.filter((x) => x.id !== r.id) })}
                    className="text-danger hover:opacity-70 cursor-pointer"
                  >
                    <CloseIcon width={15} height={15} />
                  </button>
                </div>
              ))}
              {settings.recipients.length === 0 && (
                <div className="text-xs text-ink-faint text-center py-3">No recipients configured. Notifications are mock-only.</div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display font-semibold text-ink mb-1.5 flex items-center gap-2">
              <ClockIcon width={18} height={18} className="text-brand" /> Background Scan Schedules
            </h2>
            <p className="text-xs text-ink-soft mb-1.5">Times of day (server local time) when automated captures trigger.</p>
            {clock && (
              <p className="text-xs text-brand font-semibold mb-3.5 flex items-center gap-1.5">
                <ClockIcon width={14} height={14} /> Current Time: {clock}
              </p>
            )}
            <form onSubmit={addSchedule} className="flex gap-2 mb-4">
              <Input type="time" value={newScheduleTime} onChange={(e) => setNewScheduleTime(e.target.value)} className="w-36" />
              <Button variant="secondary" type="submit">
                Add Time
              </Button>
            </form>
            <div className="space-y-2">
              {settings.schedules.map((s) => (
                <div key={s.id} className="flex items-center justify-between bg-surface-2 border border-line/60 rounded-lg px-3 py-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[var(--color-brand)] cursor-pointer"
                      checked={s.enabled}
                      onChange={() =>
                        persist({
                          schedules: settings.schedules.map((x) => (x.id === s.id ? { ...x, enabled: !x.enabled } : x)),
                        })
                      }
                    />
                    <span className={`text-sm font-semibold ${s.enabled ? 'text-ink' : 'text-ink-faint'}`}>
                      {formatTime(s.time)}
                    </span>
                  </label>
                  <button
                    onClick={() => persist({ schedules: settings.schedules.filter((x) => x.id !== s.id) })}
                    className="text-danger hover:opacity-70 cursor-pointer"
                  >
                    <CloseIcon width={15} height={15} />
                  </button>
                </div>
              ))}
              {settings.schedules.length === 0 && (
                <div className="text-xs text-ink-faint text-center py-3">No automated background schedules configured.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
