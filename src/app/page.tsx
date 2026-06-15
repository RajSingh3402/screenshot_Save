'use client';

import { useState } from 'react';
import { Sidebar, type PageKey } from '@/components/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { WebsiteManagement } from '@/components/websites/WebsiteManagement';
import { Reports } from '@/components/reports/Reports';
import { ExcelImport } from '@/components/excel/ExcelImport';
import { UserManagement } from '@/components/users/UserManagement';
import { SettingsManagement } from '@/components/settings/SettingsManagement';

export default function App() {
  const [page, setPage] = useState<PageKey>('dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-paper text-ink">
      <Sidebar page={page} setPage={setPage} />
      <main className="flex-1 overflow-auto">
        {page === 'dashboard' && <Dashboard />}
        {page === 'websites' && <WebsiteManagement />}
        {page === 'reports' && <Reports />}
        {page === 'excel' && <ExcelImport />}
        {page === 'users' && <UserManagement />}
        {page === 'settings' && <SettingsManagement />}
      </main>
    </div>
  );
}
