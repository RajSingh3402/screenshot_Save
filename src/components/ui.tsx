'use client';

import type { ButtonHTMLAttributes, ComponentPropsWithRef, ReactNode } from 'react';
import { CloseIcon } from './icons';

/** Tiny className combiner (no external dep). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/* ─── Button ─────────────────────────────────────────── */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-deep shadow-sm disabled:bg-line disabled:text-ink-faint disabled:shadow-none',
  secondary: 'bg-sage text-white hover:bg-sage-deep shadow-sm',
  outline: 'bg-surface text-ink border border-line-strong hover:bg-surface-2',
  ghost: 'bg-transparent text-ink-soft hover:bg-surface-2',
  danger: 'bg-danger-soft text-danger hover:bg-danger hover:text-white',
};

const SIZES: Record<Size, string> = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2 gap-2 rounded-lg',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ─── Card ───────────────────────────────────────────── */

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('bg-surface border border-line rounded-2xl shadow-[var(--shadow-card)]', className)}>
      {children}
    </div>
  );
}

/* ─── Badge ──────────────────────────────────────────── */

type Tone = 'success' | 'danger' | 'neutral' | 'brand' | 'sage' | 'warn';

const TONES: Record<Tone, string> = {
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-cream text-ink-soft',
  brand: 'bg-brand-soft text-brand-deep',
  sage: 'bg-sage-soft text-sage-deep',
  warn: 'bg-warn-soft text-warn',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap',
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

/* ─── Inputs ─────────────────────────────────────────── */

const FIELD =
  'w-full bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-faint ' +
  'outline-none transition focus:border-brand focus:bg-surface focus:ring-2 focus:ring-brand/15';

export function Input({ className, ...props }: ComponentPropsWithRef<'input'>) {
  return <input className={cn(FIELD, className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentPropsWithRef<'select'>) {
  return (
    <select className={cn(FIELD, 'cursor-pointer', className)} {...props}>
      {children}
    </select>
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink-soft mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-xs text-danger mt-1">{error}</span>}
    </label>
  );
}

/* ─── Modal ──────────────────────────────────────────── */

export function Modal({
  title,
  onClose,
  children,
  width = 'max-w-md',
}: {
  title?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          'animate-fade-in w-full bg-surface border border-line rounded-2xl shadow-[var(--shadow-pop)] p-6',
          width,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-start justify-between mb-5">
            <h2 className="text-lg font-display font-semibold text-ink">{title}</h2>
            <button onClick={onClose} className="text-ink-faint hover:text-ink transition-colors cursor-pointer">
              <CloseIcon width={18} height={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ─── Progress bar ───────────────────────────────────── */

export function ProgressBar({ percent, tone = 'brand' }: { percent: number; tone?: 'brand' | 'success' | 'warn' }) {
  const bar = tone === 'success' ? 'bg-success' : tone === 'warn' ? 'bg-warn' : 'bg-brand';
  return (
    <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-[width] duration-300', bar)}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

/* ─── Page header ────────────────────────────────────── */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-ink-soft mt-1.5">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

/* ─── Table cell helpers ─────────────────────────────── */

export const thClass = 'text-left px-2 sm:px-4 py-2.5 sm:py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-faint';
export const tdClass = 'px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm align-middle';

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-2 sm:px-4 py-10 sm:py-12 text-center text-xs sm:text-sm text-ink-faint">
        {children}
      </td>
    </tr>
  );
}
