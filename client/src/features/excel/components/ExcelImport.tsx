import React, { useState } from 'react';
import { S, badge } from '@/styles/theme';

interface ExcelImportProps {
  refreshSites: () => void;
}

export function ExcelImport({ refreshSites }: ExcelImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0, status: "" });
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Table state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => {
    setDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    setError(null);
    setSuccessMsg(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      setError("Invalid file format. Please upload an Excel file (.xlsx or .xls).");
      setFile(null);
      return;
    }
    // 5MB limit
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB size limit. Please upload a smaller Excel sheet.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleDemo = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setResults([]);
    setLogs(["Requesting demo dataset from server...", "Generating sample Excel sheet..."]);
    setProgress({ current: 0, total: 0, percent: 0, status: "Initializing demo dataset..." });

    try {
      const response = await fetch('/api/excel/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demo: true })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned HTTP ${response.status}`);
      }

      if (!response.body) throw new Error("NDJSON stream not supported in browser");
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            
            if (data.type === 'init') {
              setProgress({ current: 0, total: data.total, percent: 0, status: `Discovered ${data.total} rows. Starting validation...` });
              setLogs(prev => [...prev, `Demo Excel parsed: Found ${data.total} site rows.`]);
            } else if (data.type === 'progress') {
              const pct = Math.round((data.current / data.total) * 100);
              setProgress({
                current: data.current,
                total: data.total,
                percent: pct,
                status: `Checked ${data.current} of ${data.total} URLs...`
              });

              if (data.batch && data.batch.length > 0) {
                const newLogs = data.batch.map((item: any) => {
                  const statusStr = item.status === 'success' ? '✓ SUCCESS' : '✗ FAILED';
                  const detail = item.status === 'success' ? `${item.responseTime}ms - ${item.pageTitle || 'No Title'}` : `${item.error}`;
                  return `[${statusStr}] ${item.name} (${item.url}) - ${detail}`;
                });
                setLogs(prev => [...prev, ...newLogs]);
              }
            } else if (data.type === 'complete') {
              setProgress(prev => ({ ...prev, percent: 100, status: 'Completed processing demo rows!' }));
              setResults(data.data);
              const successIds = new Set(data.data.filter((r: any) => r.status === 'success').map((r: any) => r.id)) as Set<string>;
              setSelectedIds(successIds);
              setSuccessMsg(`Successfully processed demo: ${data.successCount} valid websites found!`);
              setLogs(prev => [...prev, `Job Finished! Verified: ${data.successCount} successes, ${data.failedCount} failures.`]);
            } else if (data.type === 'error') {
              throw new Error(data.error);
            }
          } catch (err) {
            console.error("Error parsing NDJSON stream line:", err);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during demo processing.");
      setLogs(prev => [...prev, `[ERROR] ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    setResults([]);
    setLogs(["Reading file..."]);
    setProgress({ current: 0, total: 0, percent: 0, status: "Reading and converting Excel file..." });

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        if (!e.target || !e.target.result) throw new Error("Failed to read file buffer");
        const base64 = (e.target.result as string).split(',')[1];
        setLogs(prev => [...prev, "Uploading to backend parser..."]);
        
        const response = await fetch('/api/excel/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64, fileName: file.name })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server returned HTTP ${response.status}`);
        }

        if (!response.body) throw new Error("NDJSON stream not supported in browser");
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);
              
              if (data.type === 'init') {
                setProgress({ current: 0, total: data.total, percent: 0, status: `Discovered ${data.total} rows. Starting validation...` });
                setLogs(prev => [...prev, `Excel parsed successfully: Found ${data.total} site rows.`]);
              } else if (data.type === 'progress') {
                const pct = Math.round((data.current / data.total) * 100);
                setProgress({
                  current: data.current,
                  total: data.total,
                  percent: pct,
                  status: `Checked ${data.current} of ${data.total} URLs...`
                });

                if (data.batch && data.batch.length > 0) {
                  const newLogs = data.batch.map((item: any) => {
                    const statusStr = item.status === 'success' ? '✓ SUCCESS' : '✗ FAILED';
                    const detail = item.status === 'success' ? `${item.responseTime}ms - ${item.pageTitle || 'No Title'}` : `${item.error}`;
                    return `[${statusStr}] ${item.name} (${item.url}) - ${detail}`;
                  });
                  setLogs(prev => [...prev, ...newLogs]);
                }
              } else if (data.type === 'complete') {
                setProgress(prev => ({ ...prev, percent: 100, status: 'Completed processing all rows!' }));
                setResults(data.data);
                const successIds = new Set(data.data.filter((r: any) => r.status === 'success').map((r: any) => r.id)) as Set<string>;
                setSelectedIds(successIds);
                setSuccessMsg(`Successfully processed ${data.total} rows: ${data.successCount} valid websites found!`);
                setLogs(prev => [...prev, `Job Finished! Verified: ${data.successCount} successes, ${data.failedCount} failures.`]);
              } else if (data.type === 'error') {
                throw new Error(data.error);
              }
            } catch (err) {
              console.error("Error parsing NDJSON stream line:", err);
            }
          }
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred during Excel processing.");
        setLogs(prev => [...prev, `[ERROR] ${err.message}`]);
      } finally {
        setLoading(false);
      }
    };

    fileReader.onerror = () => {
      setError("Failed to read the local Excel file.");
      setLoading(false);
    };

    fileReader.readAsDataURL(file);
  };

  const handleImport = async () => {
    if (selectedIds.size === 0) return;
    
    const targets = results.filter(r => selectedIds.has(r.id));
    const payload = targets.map(t => ({
      name: t.name,
      url: t.url
    }));

    try {
      const response = await fetch('/api/websites/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccessMsg(`Successfully imported ${payload.length} websites into SiteWatch monitoring database!`);
        refreshSites();
        setResults([]);
        setFile(null);
        setSelectedIds(new Set());
      } else {
        throw new Error("Failed to save websites to monitoring list.");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleSelectAll = (filteredItems: any[]) => {
    const newSelected = new Set(selectedIds);
    const allFilteredSelected = filteredItems.every(item => newSelected.has(item.id));
    
    if (allFilteredSelected) {
      filteredItems.forEach(item => newSelected.delete(item.id));
    } else {
      filteredItems.forEach(item => newSelected.add(item.id));
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const filtered = results.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.url.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const displayedLogs = logs.slice(-6);

  return (
    <div className="p-4 sm:p-6 lg:p-8 page-container" style={{ maxWidth: 1100, width: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Excel Bulk Import</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
          Upload Excel spreadsheets (.xlsx, .xls) containing website monitoring parameters, verify links, and add them to SiteWatch.
        </p>
      </div>

      {error && (
        <div style={{ ...S.card, borderColor: "#ef4444", background: "#450a0a33", padding: "14px 18px", marginBottom: 20, color: "#fca5a5", fontSize: 13, display: "flex", gap: 10, alignItems: "center" }}>
          <span>❌</span>
          <div>{error}</div>
        </div>
      )}

      {successMsg && (
        <div style={{ ...S.card, borderColor: "#22c55e", background: "#14532d33", padding: "14px 18px", marginBottom: 20, color: "#86efac", fontSize: 13, display: "flex", gap: 10, alignItems: "center" }}>
          <span>✅</span>
          <div>{successMsg}</div>
        </div>
      )}

      <div className={`grid grid-cols-1 ${results.length > 0 ? "" : "lg:grid-cols-[1fr_360px]"} gap-5 items-start`}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          <div style={{ ...S.card, padding: 32, textAlign: "center", position: "relative" }}>
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              style={{
                border: dragging ? "2px dashed #6366f1" : "2px dashed #1e2130",
                background: dragging ? "#1e2a4a33" : "#0f111744",
                borderRadius: 10,
                padding: "40px 20px",
                transition: "all 0.2s ease",
                cursor: "pointer"
              }}
              onClick={() => {
                const el = document.getElementById('excel-file-input');
                if (el) el.click();
              }}
            >
              <input
                id="excel-file-input"
                type="file"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={onFileSelect}
                disabled={loading}
              />
              <div style={{ fontSize: 42, marginBottom: 12 }}>📊</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 6 }}>
                {file ? file.name : "Drag & drop Excel sheet here"}
              </h3>
              <p style={{ fontSize: 12, color: "#64748b" }}>
                {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports .xlsx and .xls files up to 5MB"}
              </p>
              
              {file && !loading && (
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  style={{ background: "#450a0a", color: "#fca5a5", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", marginTop: 12 }}
                >
                  Remove File
                </button>
              )}
            </div>

            {!file && !loading && results.length === 0 && (
              <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12 }}>
                <button
                  type="button"
                  id="btn-load-demo"
                  onClick={handleDemo}
                  style={S.btn("linear-gradient(135deg,#8b5cf6,#6366f1)", "#fff", { width: "100%", maxWidth: 220, fontSize: 13, padding: "10px 16px" })}
                >
                  ✨ Load Demo Excel Data
                </button>
              </div>
            )}

            {file && !loading && results.length === 0 && (
              <div style={{ marginTop: 24 }}>
                <button
                  onClick={handleUpload}
                  style={S.btn("linear-gradient(135deg,#6366f1,#8b5cf6)", "#fff", { width: "100%", maxWidth: 220, fontSize: 14, padding: "10px 20px" })}
                >
                  🚀 Parse & Fetch URLs
                </button>
              </div>
            )}
          </div>

          {loading && (
            <div style={{ ...S.card, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="pulse" style={{ width: 10, height: 10, borderRadius: "50%", background: "#6366f1" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Validating and Pinging URLs...</span>
                </div>
                <span style={{ fontSize: 13, color: "#6366f1", fontWeight: 700 }}>{progress.percent}%</span>
              </div>

              <div style={{ height: 8, background: "#1e2130", borderRadius: 4, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ height: "100%", width: `${progress.percent}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 4, transition: "width 0.3s ease" }} />
              </div>

              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
                <strong>Current Status:</strong> {progress.status}
              </div>

              <div style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: 8, padding: 12, fontFamily: "'Courier New', Courier, monospace" }}>
                <div style={{ fontSize: 11, color: "#64748b", borderBottom: "1px solid #1e2130", paddingBottom: 6, marginBottom: 8, fontWeight: "bold" }}>PROCESS LOGGER</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, height: 115, overflowY: "auto", fontSize: 11, color: "#e2e8f0" }}>
                  {displayedLogs.map((log, idx) => (
                    <div key={idx} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {log}
                    </div>
                  ))}
                  {logs.length === 0 && <div style={{ color: "#64748b" }}>Waiting to start...</div>}
                </div>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    placeholder="Search results..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                    style={{ ...S.input, width: 220 }}
                  />
                  <select
                    value={statusFilter}
                    onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: 8, color: "#e2e8f0", padding: "8px 12px", fontSize: 13 }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="success">Success / Reachable</option>
                    <option value="failed">Failed / Broken</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    Selected: <strong>{selectedIds.size}</strong> of <strong>{results.length}</strong>
                  </span>
                  <button
                    onClick={handleImport}
                    disabled={selectedIds.size === 0}
                    style={S.btn(selectedIds.size > 0 ? "linear-gradient(135deg,#22c55e,#16a34a)" : "#1e2130", selectedIds.size > 0 ? "#fff" : "#64748b", { cursor: selectedIds.size > 0 ? "pointer" : "not-allowed" })}
                  >
                    💾 Add Selected to Monitoring
                  </button>
                  <button
                    onClick={() => { setResults([]); setFile(null); setSelectedIds(new Set()); }}
                    style={S.btn("#1e2130", "#94a3b8")}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div style={{ ...S.card, overflow: "hidden" }} className="w-full overflow-x-auto">
                <table>
                  <thead>
                    <tr style={{ background: "#0f1117", borderBottom: "1px solid #1e2130" }}>
                      <th style={{ padding: "11px 16px", width: 40, textAlign: "left" }}>
                        <input
                          type="checkbox"
                          checked={filtered.length > 0 && filtered.every(item => selectedIds.has(item.id))}
                          onChange={() => toggleSelectAll(filtered)}
                          style={{ cursor: "pointer" }}
                        />
                      </th>
                      {["Name", "URL", "Status", "Response Time", "Page Title", "Error Details"].map(h => <th key={h} style={S.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((item, i) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #1e213060", background: i % 2 === 0 ? "transparent" : "#ffffff05" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={() => toggleSelectOne(item.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td style={S.td({ fontWeight: 600, color: "#f1f5f9" })}>{item.name}</td>
                        <td style={S.td({ color: "#818cf8", fontSize: 12 })}>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>{item.url}</a>
                        </td>
                        <td style={S.td()}>
                          {badge(item.status === "success" ? "#14532d" : "#450a0a", item.status === "success" ? "#86efac" : "#fca5a5", item.status === "success" ? "✓ Success" : "✗ Failed")}
                        </td>
                        <td style={S.td({ color: "#e2e8f0" })}>{item.status === 'success' ? `${item.responseTime} ms` : '-'}</td>
                        <td style={S.td({ color: "#94a3b8", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })} title={item.pageTitle || ''}>
                          {item.pageTitle || '-'}
                        </td>
                        <td style={S.td({ color: "#ef4444", fontSize: 12 })}>{item.error || '-'}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                          No matching results found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    Showing Page {currentPage} of {totalPages} ({filtered.length} total entries)
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={S.btn("#13151f", currentPage === 1 ? "#64748b" : "#e2e8f0", { border: "1px solid #1e2130", cursor: currentPage === 1 ? "not-allowed" : "pointer" })}
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                      if (totalPages > 6 && Math.abs(currentPage - p) > 2 && p !== 1 && p !== totalPages) {
                        if (p === 2 || p === totalPages - 1) {
                          return <span key={p} style={{ padding: "8px", color: "#64748b", fontSize: 12 }}>...</span>;
                        }
                        return null;
                      }
                      return (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          style={S.btn(currentPage === p ? "#6366f1" : "#13151f", "#fff", { border: "1px solid #1e2130" })}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={S.btn("#13151f", currentPage === totalPages ? "#64748b" : "#e2e8f0", { border: "1px solid #1e2130", cursor: currentPage === totalPages ? "not-allowed" : "pointer" })}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {results.length === 0 && (
          <div style={{ ...S.card, padding: 22, height: "fit-content" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>How it works</h3>
            <ul style={{ paddingLeft: 18, fontSize: 12, color: "#94a3b8", display: "flex", flexDirection: "column", gap: 10, margin: 0 }}>
              <li>Prepare your Excel document (.xlsx or .xls).</li>
              <li>
                Ensure columns are mapped or the <strong>first column contains the site name</strong> and the <strong>second column contains the URL link</strong> (starting with `https://` or `http://`).
              </li>
              <li>The tool parses up to 1000 rows in safe, high-speed concurrent batches.</li>
              <li>Every URL is checked for status code, load latency, and page title.</li>
              <li>Check/uncheck items in the verification table and import them straight to your active SiteWatch dashboard monitoring stream.</li>
            </ul>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #1e2130", fontSize: 11, color: "#64748b" }}>
              💡 <em>Leading or trailing whitespace and tabs are cleaned automatically for all Excel URLs.</em>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
