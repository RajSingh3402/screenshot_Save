'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';
import type { CaptureProgress, Settings, Website } from '@/lib/types';
import type { UserFormValues, WebsiteFormValues } from '@/lib/schemas';

export const keys = {
  websites: ['websites'] as const,
  reports: ['reports'] as const,
  users: ['users'] as const,
  settings: ['settings'] as const,
  captureProgress: ['capture-progress'] as const,
};

/* ─── Queries ────────────────────────────────────────── */

export const useWebsites = () => useQuery({ queryKey: keys.websites, queryFn: api.getWebsites });
export const useReports = () => useQuery({ queryKey: keys.reports, queryFn: api.getReports });
export const useUsers = () => useQuery({ queryKey: keys.users, queryFn: api.getUsers });
export const useSettings = () => useQuery({ queryKey: keys.settings, queryFn: api.getSettings });

/**
 * Poll capture progress only while a session is active. The trigger mutation
 * seeds an optimistic `active: true` so polling starts immediately; when the
 * server reports `active: false` the interval stops. Refreshing sites/reports
 * on completion is handled by `CaptureProgressOverlay` (see useCaptureProgress
 * consumer) rather than here, to keep this query side-effect free.
 */
export function useCaptureProgress() {
  return useQuery({
    queryKey: keys.captureProgress,
    queryFn: api.getCaptureProgress,
    refetchInterval: (query) => (query.state.data?.active ? 800 : false),
    initialData: { active: false, status: 'Idle', current: 0, total: 0 } satisfies CaptureProgress,
    refetchOnMount: false,
  });
}

/* ─── Mutations ──────────────────────────────────────── */

export function useCreateWebsite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: WebsiteFormValues) => api.createWebsite(values),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.websites }),
  });
}

export function useUpdateWebsite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: Partial<Website> }) => api.updateWebsite(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.websites }),
  });
}

export function useDeleteWebsite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteWebsite(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.websites }),
  });
}

export function useDeleteAllWebsites() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.deleteAllWebsites(),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.websites }),
  });
}

export function useBulkInsertWebsites() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sites: { name: string; url: string }[]) => api.bulkInsertWebsites(sites),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.websites }),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: UserFormValues) => api.createUser(values),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.users }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.users }),
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<Settings>) => api.saveSettings(patch),
    onSuccess: (data) => qc.setQueryData(keys.settings, data),
  });
}

export function useTriggerCapture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.triggerCapture(),
    onSuccess: () => {
      // Seed optimistic active state so the progress query starts polling.
      qc.setQueryData<CaptureProgress>(keys.captureProgress, {
        active: true,
        status: 'Triggering capture run…',
        current: 0,
        total: 0,
      });
      qc.invalidateQueries({ queryKey: keys.captureProgress });
    },
  });
}
