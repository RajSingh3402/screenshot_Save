'use client';

import {
  DashboardIcon,
  DocumentIcon,
  GlobeIcon,
  RadarIcon,
  SettingsIcon,
  SheetIcon,
  UsersIcon,
} from './icons';
import { cn } from './ui';

export type PageKey = 'dashboard' | 'websites' | 'reports' | 'excel' | 'users' | 'settings';

const NAV: { id: PageKey; label: string; Icon: typeof DashboardIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'websites', label: 'Websites', Icon: GlobeIcon },
  { id: 'reports', label: 'Reports', Icon: DocumentIcon },
  { id: 'excel', label: 'Excel Import', Icon: SheetIcon },
  { id: 'users', label: 'Users', Icon: UsersIcon },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
];

export function Sidebar({ page, setPage }: { page: PageKey; setPage: (p: PageKey) => void }) {
  return (
    <aside className="w-60 shrink-0 bg-surface border-r border-line flex flex-col">
      <div className="px-5 py-5 border-b border-line">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand text-white grid place-items-center shadow-sm">
            <RadarIcon width={22} height={22} />
          </div>
          <div>
            <div className="font-display font-semibold text-ink leading-tight">SiteWatch</div>
            <div className="text-[11px] text-ink-faint">Monitor Portal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ id, label, Icon }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer',
                active
                  ? 'bg-brand-soft text-brand-deep font-semibold'
                  : 'text-ink-soft hover:bg-surface-2 hover:text-ink',
              )}
            >
              <Icon width={19} height={19} className={active ? 'text-brand' : 'text-ink-faint'} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-line">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sage text-white grid place-items-center text-sm font-semibold">
            A
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink truncate">Admin</div>
            <div className="text-[11px] text-ink-faint truncate">admin@company.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
