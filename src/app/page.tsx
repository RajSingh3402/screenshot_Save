'use client';

import { useState } from 'react';
import { Sidebar, type PageKey } from '@/components/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { WebsiteManagement } from '@/components/websites/WebsiteManagement';
import { Reports } from '@/components/reports/Reports';
import { ExcelImport } from '@/components/excel/ExcelImport';
import { UserManagement } from '@/components/users/UserManagement';
import { SettingsManagement } from '@/components/settings/SettingsManagement';
import { MenuIcon, RadarIcon } from '@/components/icons';

const PAGE_NAMES: Record<PageKey, string> = {
  dashboard: 'Dashboard',
  websites: 'Websites',
  reports: 'Reports',
  excel: 'Excel Import',
  users: 'Users',
  settings: 'Settings',
};

export default function App() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-paper text-ink">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-line shrink-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand text-white grid place-items-center shadow-sm">
            <RadarIcon width={18} height={18} />
          </div>
          <div>
            <div className="font-display font-semibold text-ink text-sm leading-tight">SiteWatch</div>
            <div className="text-[10px] text-ink-soft leading-none">{PAGE_NAMES[page]}</div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 rounded-lg text-ink hover:bg-surface-2 hover:text-brand transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <MenuIcon width={20} height={20} />
        </button>
      </header>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative flex w-60 max-w-xs flex-1 flex-col bg-surface shadow-[var(--shadow-pop)] animate-fade-in">
            <Sidebar page={page} setPage={setPage} onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar page={page} setPage={setPage} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-paper text-ink">
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
