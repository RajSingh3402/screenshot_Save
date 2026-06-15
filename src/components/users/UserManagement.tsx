'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '@/lib/types';
import { userFormSchema, type UserFormValues } from '@/lib/schemas';
import { useCreateUser, useDeleteUser, useUsers } from '@/hooks/queries';
import { PlusIcon, SearchIcon } from '../icons';
import { Badge, Button, Card, EmptyRow, Field, Input, Modal, PageHeader, Select, tdClass, thClass } from '../ui';
import { ConfirmDialog } from '../websites/WebsiteManagement';

function roleBadge(role: string) {
  switch (role.toLowerCase()) {
    case 'admin':
      return <Badge tone="brand">Admin</Badge>;
    case 'editor':
      return <Badge tone="sage">Editor</Badge>;
    default:
      return <Badge tone="neutral">Viewer</Badge>;
  }
}

export function UserManagement() {
  const { data: users = [] } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: '', email: '', role: 'Viewer' },
  });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    try {
      await createUser.mutateAsync(values);
      setShowModal(false);
      form.reset({ name: '', email: '', role: 'Viewer' });
    } catch (err) {
      setServerError((err as Error).message || 'Failed to create user.');
    }
  });

  return (
    <div className="p-8 max-w-[1180px] mx-auto">
      <PageHeader
        title="Users"
        subtitle="Manage monitor portal access and user roles"
        actions={
          <Button
            onClick={() => {
              form.reset({ name: '', email: '', role: 'Viewer' });
              setServerError(null);
              setShowModal(true);
            }}
          >
            <PlusIcon width={16} height={16} /> Add User
          </Button>
        }
      />

      <div className="relative mb-4 w-80">
        <SearchIcon width={16} height={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <Input
          placeholder="Search users by name or email…"
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
                {['Name', 'Email Address', 'Role', 'Status', 'Created', 'Actions'].map((h) => (
                  <th key={h} className={thClass}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-line/60 last:border-0 hover:bg-surface-2">
                  <td className={`${tdClass} font-semibold text-ink`}>{u.name}</td>
                  <td className={`${tdClass} text-ink`}>{u.email}</td>
                  <td className={tdClass}>{roleBadge(u.role)}</td>
                  <td className={tdClass}>
                    <Badge tone={u.status === 'active' ? 'sage' : 'neutral'}>
                      {u.status === 'active' ? '● Active' : '○ Inactive'}
                    </Badge>
                  </td>
                  <td className={`${tdClass} text-ink-soft`}>{u.created}</td>
                  <td className={tdClass}>
                    <Button variant="danger" size="sm" onClick={() => setDeleteTarget(u)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <EmptyRow colSpan={6}>No users found</EmptyRow>}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <Modal title="Add User" onClose={() => setShowModal(false)}>
          {serverError && <div className="text-danger text-xs mb-3">{serverError}</div>}
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Full Name" error={form.formState.errors.name?.message}>
              <Input {...form.register('name')} placeholder="e.g. Amit Sharma" />
            </Field>
            <Field label="Email Address" error={form.formState.errors.email?.message}>
              <Input type="email" {...form.register('email')} placeholder="amit@company.com" />
            </Field>
            <Field label="Portal Role" error={form.formState.errors.role?.message}>
              <Select {...form.register('role')}>
                <option value="Viewer">Viewer</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </Select>
            </Field>
            <div className="flex justify-end gap-2.5 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Create User
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Remove User Access"
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteUser.mutate(deleteTarget.id);
            setDeleteTarget(null);
          }}
          confirmLabel="Yes, Remove"
        >
          Are you sure you want to remove access for <strong>{deleteTarget.name}</strong>? They will no longer be able
          to view this portal.
        </ConfirmDialog>
      )}
    </div>
  );
}
