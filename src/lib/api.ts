import type { CaptureProgress, ExcelResultItem, Report, Settings, User, Website } from './types';
import type { UserFormValues, WebsiteFormValues } from './schemas';

/** Thin typed fetch wrapper that throws on non-2xx with the server's error message. */
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json', ...init?.headers } : init?.headers,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (HTTP ${res.status})`);
  }
  return res.json() as Promise<T>;
}

/* ─── Websites ───────────────────────────────────────── */
export const getWebsites = () => request<Website[]>('/api/websites');

export const createWebsite = (values: WebsiteFormValues) =>
  request<Website>('/api/websites', { method: 'POST', body: JSON.stringify(values) });

export const updateWebsite = (id: number, patch: Partial<Website>) =>
  request<Website>(`/api/websites/${id}`, { method: 'PUT', body: JSON.stringify(patch) });

export const deleteWebsite = (id: number) =>
  request<{ message: string }>(`/api/websites/${id}`, { method: 'DELETE' });

export const deleteAllWebsites = () =>
  request<{ message: string }>('/api/websites', { method: 'DELETE' });

export const bulkInsertWebsites = (sites: { name: string; url: string }[]) =>
  request<Website[]>('/api/websites/bulk', { method: 'POST', body: JSON.stringify(sites) });

/* ─── Reports ────────────────────────────────────────── */
export const getReports = () => request<Report[]>('/api/reports');

/* ─── Users ──────────────────────────────────────────── */
export const getUsers = () => request<User[]>('/api/users');

export const createUser = (values: UserFormValues) =>
  request<User>('/api/users', { method: 'POST', body: JSON.stringify(values) });

export const deleteUser = (id: number) =>
  request<{ message: string }>(`/api/users/${id}`, { method: 'DELETE' });

/* ─── Settings ───────────────────────────────────────── */
export const getSettings = () => request<Settings>('/api/settings');

export const saveSettings = (patch: Partial<Settings>) =>
  request<Settings>('/api/settings', { method: 'PUT', body: JSON.stringify(patch) });

/* ─── Capture ────────────────────────────────────────── */
export const getCaptureProgress = () => request<CaptureProgress>('/api/capture-progress');

export const triggerCapture = () =>
  request<{ message: string }>('/api/capture-now', { method: 'POST' });

/* ─── Excel (streaming, consumed directly in the component) ── */
export type { ExcelResultItem };
