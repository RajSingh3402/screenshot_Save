'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Website } from '@/lib/types';
import { websiteFormSchema, type WebsiteFormValues } from '@/lib/schemas';
import {
  useCreateWebsite,
  useDeleteAllWebsites,
  useDeleteWebsite,
  useTriggerCapture,
  useUpdateWebsite,
  useWebsites,
} from '@/hooks/queries';
import { useScreenshot } from '../ScreenshotContext';
import { CameraIcon, EyeIcon, PlusIcon, SearchIcon, TrashIcon, WarningIcon } from '../icons';
import { Badge, Button, Card, EmptyRow, Field, Input, Modal, PageHeader, tdClass, thClass } from '../ui';

export function WebsiteManagement() {
  const { data: sites = [] } = useWebsites();
  const createWebsite = useCreateWebsite();
  const updateWebsite = useUpdateWebsite();
  const deleteWebsite = useDeleteWebsite();
  const deleteAll = useDeleteAllWebsites();
  const triggerCapture = useTriggerCapture();
  const { open: openScreenshot } = useScreenshot();

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editSite, setEditSite] = useState<Website | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Website | null>(null);
  const [showDeleteAll, setShowDeleteAll] = useState(false);

  const form = useForm<WebsiteFormValues>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: { name: '', url: '' },
  });

  const filtered = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) || s.url.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setEditSite(null);
    form.reset({ name: '', url: '' });
    setShowModal(true);
  }
  function openEdit(s: Website) {
    setEditSite(s);
    form.reset({ name: s.name, url: s.url });
    setShowModal(true);
  }

  const onSubmit = form.handleSubmit(async (values) => {
    if (editSite) await updateWebsite.mutateAsync({ id: editSite.id, patch: values });
    else await createWebsite.mutateAsync(values);
    setShowModal(false);
  });

  return (
    <div className="p-8 max-w-[1180px] mx-auto">
      <PageHeader
        title="Websites"
        subtitle={`${sites.length} websites configured`}
        actions={
          <>
            <Button variant="danger" onClick={() => setShowDeleteAll(true)} disabled={sites.length === 0}>
              <TrashIcon width={16} height={16} /> Delete All
            </Button>
            <Button variant="secondary" onClick={() => triggerCapture.mutate()} disabled={triggerCapture.isPending}>
              <CameraIcon width={16} height={16} /> Run Capture
            </Button>
            <Button onClick={openAdd}>
              <PlusIcon width={16} height={16} /> Add Website
            </Button>
          </>
        }
      />

      <div className="relative mb-4 w-72">
        <SearchIcon width={16} height={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <Input
          placeholder="Search websites…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead className="bg-surface-2 border-b border-line">
              <tr>
                {['Name', 'URL', 'Status', 'Last Capture', 'Last Status', 'Screenshot', 'Actions'].map((h) => (
                  <th key={h} className={thClass}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-line/60 last:border-0 hover:bg-surface-2">
                  <td className={`${tdClass} font-semibold text-ink`}>{s.name}</td>
                  <td className={`${tdClass} text-brand max-w-[260px] truncate`}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {s.url}
                    </a>
                  </td>
                  <td className={tdClass}>
                    <Badge tone={s.status === 'active' ? 'sage' : 'neutral'}>
                      {s.status === 'active' ? '● Active' : '○ Disabled'}
                    </Badge>
                  </td>
                  <td className={`${tdClass} text-ink-soft`}>{s.lastCapture}</td>
                  <td className={tdClass}>
                    <Badge tone={s.lastStatus === 'success' ? 'success' : 'danger'}>
                      {s.lastStatus === 'success' ? '✓ Success' : `✗ ${s.error ?? 'Failed'}`}
                    </Badge>
                  </td>
                  <td className={tdClass}>
                    {s.lastCaptureImage ? (
                      <Button variant="ghost" size="sm" onClick={() => openScreenshot(s.name, s.lastCaptureImage!)}>
                        <EyeIcon width={14} height={14} /> View
                      </Button>
                    ) : (
                      <span className="text-ink-faint">–</span>
                    )}
                  </td>
                  <td className={tdClass}>
                    <div className="flex gap-1.5">
                      <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateWebsite.mutate({
                            id: s.id,
                            patch: { status: s.status === 'active' ? 'disabled' : 'active' },
                          })
                        }
                      >
                        {s.status === 'active' ? 'Disable' : 'Enable'}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setDeleteTarget(s)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <EmptyRow colSpan={7}>No websites found</EmptyRow>}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <Modal title={editSite ? 'Edit Website' : 'Add Website'} onClose={() => setShowModal(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Site Name" error={form.formState.errors.name?.message}>
              <Input {...form.register('name')} placeholder="e.g. CRM Portal" />
            </Field>
            <Field label="URL" error={form.formState.errors.url?.message}>
              <Input {...form.register('url')} placeholder="https://example.com" />
            </Field>
            <div className="flex justify-end gap-2.5 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {editSite ? 'Save Changes' : 'Add Website'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Website"
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteWebsite.mutate(deleteTarget.id);
            setDeleteTarget(null);
          }}
          confirmLabel="Yes, Delete"
        >
          Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
        </ConfirmDialog>
      )}

      {showDeleteAll && (
        <ConfirmDialog
          title="Delete All Websites"
          onClose={() => setShowDeleteAll(false)}
          onConfirm={() => {
            deleteAll.mutate();
            setShowDeleteAll(false);
          }}
          confirmLabel="Yes, Delete All"
        >
          Are you sure you want to delete <strong>all {sites.length}</strong> configured websites? This action cannot
          be undone.
        </ConfirmDialog>
      )}
    </div>
  );
}

export function ConfirmDialog({
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
}) {
  return (
    <Modal onClose={onClose} width="max-w-sm">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-danger-soft text-danger grid place-items-center mb-4">
          <WarningIcon width={24} height={24} />
        </div>
        <h2 className="text-lg font-display font-semibold text-ink mb-2">{title}</h2>
        <p className="text-sm text-ink-soft mb-6">{children}</p>
        <div className="flex justify-center gap-2.5">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
