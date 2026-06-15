'use client';

import { useState } from 'react';
import type { ExcelResultItem } from '@/lib/types';
import { useBulkInsertWebsites } from '@/hooks/queries';
import { CheckIcon, SheetIcon, UploadIcon, WarningIcon } from '../icons';
import { Badge, Button, Card, EmptyRow, Input, PageHeader, ProgressBar, Select, tdClass, thClass } from '../ui';

type Progress = { current: number; total: number; percent: number; status: string };
const ITEMS_PER_PAGE = 15;

export function ExcelImport() {
  const bulkInsert = useBulkInsertWebsites();
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<Progress>({ current: 0, total: 0, percent: 0, status: '' });
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<ExcelResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  function reset() {
    setError(null);
    setSuccessMsg(null);
  }

  function validateAndSetFile(selected: File) {
    const ext = selected.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      setError('Invalid file format. Please upload an Excel file (.xlsx or .xls).');
      setFile(null);
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError('File exceeds 5MB size limit. Please upload a smaller Excel sheet.');
      setFile(null);
      return;
    }
    setFile(selected);
  }

  /** Shared NDJSON stream consumer for both demo and uploaded files. */
  async function streamExcel(body: Record<string, unknown>, startLogs: string[]) {
    setLoading(true);
    reset();
    setResults([]);
    setLogs(startLogs);
    setProgress({ current: 0, total: 0, percent: 0, status: 'Reading and converting Excel file…' });

    try {
      const response = await fetch('/api/excel/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok || !response.body) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          const data = JSON.parse(line);

          if (data.type === 'init') {
            setProgress({ current: 0, total: data.total, percent: 0, status: `Discovered ${data.total} rows…` });
            setLogs((p) => [...p, `Excel parsed: found ${data.total} site rows.`]);
          } else if (data.type === 'progress') {
            setProgress({
              current: data.current,
              total: data.total,
              percent: Math.round((data.current / data.total) * 100),
              status: `Checked ${data.current} of ${data.total} URLs…`,
            });
            const newLogs = (data.batch as ExcelResultItem[]).map((item) => {
              const tag = item.status === 'success' ? '✓ SUCCESS' : '✗ FAILED';
              const detail =
                item.status === 'success' ? `${item.responseTime}ms - ${item.pageTitle || 'No Title'}` : item.error;
              return `[${tag}] ${item.name} (${item.url}) - ${detail}`;
            });
            setLogs((p) => [...p, ...newLogs]);
          } else if (data.type === 'complete') {
            setProgress((p) => ({ ...p, percent: 100, status: 'Completed processing all rows!' }));
            setResults(data.data);
            setSelectedIds(
              new Set((data.data as ExcelResultItem[]).filter((r) => r.status === 'success').map((r) => r.id)),
            );
            setSuccessMsg(`Processed ${data.total} rows: ${data.successCount} valid websites found!`);
            setLogs((p) => [...p, `Finished! ${data.successCount} successes, ${data.failedCount} failures.`]);
          } else if (data.type === 'error') {
            throw new Error(data.error);
          }
        }
      }
    } catch (err) {
      const message = (err as Error).message || 'An unexpected error occurred during Excel processing.';
      setError(message);
      setLogs((p) => [...p, `[ERROR] ${message}`]);
    } finally {
      setLoading(false);
    }
  }

  function handleDemo() {
    void streamExcel({ demo: true }, ['Requesting demo dataset…', 'Generating sample Excel sheet…']);
  }

  function handleUpload() {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = String(e.target?.result).split(',')[1];
      void streamExcel({ file: base64, fileName: file.name }, ['Reading file…', 'Uploading to parser…']);
    };
    reader.onerror = () => setError('Failed to read the local Excel file.');
    reader.readAsDataURL(file);
  }

  async function handleImport() {
    if (selectedIds.size === 0) return;
    const payload = results.filter((r) => selectedIds.has(r.id)).map((t) => ({ name: t.name, url: t.url }));
    try {
      await bulkInsert.mutateAsync(payload);
      setSuccessMsg(`Successfully imported ${payload.length} websites into monitoring!`);
      setResults([]);
      setFile(null);
      setSelectedIds(new Set());
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  }

  function toggleAll(items: ExcelResultItem[]) {
    const next = new Set(selectedIds);
    const allSelected = items.every((i) => next.has(i.id));
    items.forEach((i) => (allSelected ? next.delete(i.id) : next.add(i.id)));
    setSelectedIds(next);
  }

  const filtered = results.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) || item.url.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const displayedLogs = logs.slice(-6);

  return (
    <div className="p-8 max-w-[1180px] mx-auto">
      <PageHeader
        title="Excel Bulk Import"
        subtitle="Upload .xlsx / .xls spreadsheets of websites, verify the links, then add them to SiteWatch."
      />

      {error && (
        <Card className="border-danger/40 bg-danger-soft/50 p-4 mb-5 flex items-center gap-3 text-sm text-danger">
          <WarningIcon width={18} height={18} /> {error}
        </Card>
      )}
      {successMsg && (
        <Card className="border-success/40 bg-success-soft/60 p-4 mb-5 flex items-center gap-3 text-sm text-success">
          <CheckIcon width={18} height={18} /> {successMsg}
        </Card>
      )}

      <div className={`grid gap-5 items-start ${results.length > 0 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-[1fr_340px]'}`}>
        <div className="space-y-5">
          <Card className="p-8 text-center">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                reset();
                if (e.dataTransfer.files.length) validateAndSetFile(e.dataTransfer.files[0]);
              }}
              onClick={() => document.getElementById('excel-file-input')?.click()}
              className={`rounded-2xl border-2 border-dashed px-6 py-10 cursor-pointer transition ${
                dragging ? 'border-brand bg-brand-soft/50' : 'border-line hover:border-sand bg-surface-2'
              }`}
            >
              <input
                id="excel-file-input"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  reset();
                  if (e.target.files?.length) validateAndSetFile(e.target.files[0]);
                }}
                disabled={loading}
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-sage-soft text-sage-deep grid place-items-center mb-3">
                <SheetIcon width={26} height={26} />
              </div>
              <h3 className="font-semibold text-ink">{file ? file.name : 'Drag & drop your Excel sheet here'}</h3>
              <p className="text-xs text-ink-faint mt-1">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supports .xlsx and .xls files up to 5MB'}
              </p>
              {file && !loading && (
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  Remove File
                </Button>
              )}
            </div>

            {!file && !loading && results.length === 0 && (
              <Button variant="secondary" className="mt-6" onClick={handleDemo}>
                <SheetIcon width={16} height={16} /> Load Demo Excel Data
              </Button>
            )}
            {file && !loading && results.length === 0 && (
              <Button className="mt-6" onClick={handleUpload}>
                <UploadIcon width={16} height={16} /> Parse & Fetch URLs
              </Button>
            )}
          </Card>

          {loading && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand animate-soft-pulse" />
                  <span className="text-sm font-semibold text-ink">Validating & pinging URLs…</span>
                </div>
                <span className="text-sm font-bold text-brand">{progress.percent}%</span>
              </div>
              <ProgressBar percent={progress.percent} />
              <div className="text-xs text-ink-soft my-4">
                <strong>Status:</strong> {progress.status}
              </div>
              <div className="bg-ink/95 rounded-xl p-3 font-mono">
                <div className="text-[10px] text-cream/60 border-b border-white/10 pb-1.5 mb-2 font-bold tracking-wider">
                  PROCESS LOGGER
                </div>
                <div className="h-28 overflow-y-auto text-[11px] text-cream/90 space-y-1">
                  {displayedLogs.map((log, idx) => (
                    <div key={idx} className="truncate">
                      {log}
                    </div>
                  ))}
                  {logs.length === 0 && <div className="text-cream/50">Waiting to start…</div>}
                </div>
              </div>
            </Card>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-2.5">
                  <Input
                    placeholder="Search results…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-56"
                  />
                  <Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-44"
                  >
                    <option value="all">All Statuses</option>
                    <option value="success">Success / Reachable</option>
                    <option value="failed">Failed / Broken</option>
                  </Select>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-ink-soft">
                    Selected <strong>{selectedIds.size}</strong> of <strong>{results.length}</strong>
                  </span>
                  <Button variant="secondary" onClick={handleImport} disabled={selectedIds.size === 0}>
                    Add Selected to Monitoring
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setResults([]);
                      setFile(null);
                      setSelectedIds(new Set());
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table>
                    <thead className="bg-surface-2 border-b border-line">
                      <tr>
                        <th className="px-4 py-3 w-10 text-left">
                          <input
                            type="checkbox"
                            className="accent-[var(--color-brand)] cursor-pointer"
                            checked={filtered.length > 0 && filtered.every((i) => selectedIds.has(i.id))}
                            onChange={() => toggleAll(filtered)}
                          />
                        </th>
                        {['Name', 'URL', 'Status', 'Response', 'Page Title', 'Error'].map((h) => (
                          <th key={h} className={thClass}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((item) => (
                        <tr key={item.id} className="border-b border-line/60 last:border-0 hover:bg-surface-2">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              className="accent-[var(--color-brand)] cursor-pointer"
                              checked={selectedIds.has(item.id)}
                              onChange={() => toggleOne(item.id)}
                            />
                          </td>
                          <td className={`${tdClass} font-semibold text-ink`}>{item.name}</td>
                          <td className={`${tdClass} text-brand max-w-[220px] truncate`}>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {item.url}
                            </a>
                          </td>
                          <td className={tdClass}>
                            <Badge tone={item.status === 'success' ? 'success' : 'danger'}>
                              {item.status === 'success' ? '✓ Success' : '✗ Failed'}
                            </Badge>
                          </td>
                          <td className={`${tdClass} text-ink`}>
                            {item.status === 'success' ? `${item.responseTime} ms` : '–'}
                          </td>
                          <td className={`${tdClass} text-ink-soft max-w-[220px] truncate`} title={item.pageTitle || ''}>
                            {item.pageTitle || '–'}
                          </td>
                          <td className={`${tdClass} text-danger`}>{item.error || '–'}</td>
                        </tr>
                      ))}
                      {filtered.length === 0 && <EmptyRow colSpan={7}>No matching results found.</EmptyRow>}
                    </tbody>
                  </table>
                </div>
              </Card>

              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-faint">
                    Page {page} of {totalPages} ({filtered.length} entries)
                  </span>
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {results.length === 0 && (
          <Card className="p-6 h-fit">
            <h3 className="font-display font-semibold text-ink mb-3">How it works</h3>
            <ul className="list-disc pl-5 text-xs text-ink-soft space-y-2.5">
              <li>Prepare your Excel document (.xlsx or .xls).</li>
              <li>
                Put the <strong>site name in the first column</strong> and the <strong>URL in the second</strong> (or use{' '}
                <code>name</code>/<code>url</code> headers).
              </li>
              <li>Up to 1000 rows are parsed in fast concurrent batches.</li>
              <li>Each URL is checked for status code, latency and page title.</li>
              <li>Select the rows you want and import them straight into monitoring.</li>
            </ul>
            <div className="mt-5 pt-4 border-t border-line text-[11px] text-ink-faint">
              💡 Leading/trailing whitespace and tabs are cleaned automatically.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
