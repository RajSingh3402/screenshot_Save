import React, { useState } from 'react';
import { S } from '@/styles/theme';

interface ReportsProps {
  reports: any[];
  openScreenshot: (title: string, file: string) => void;
  user?: any;
  refreshReports?: () => void;
}

export function Reports({ reports, openScreenshot, user, refreshReports }: ReportsProps) {
  const [sel, setSel] = useState<any>(null);

  const displayDetails = sel?.details || [];

  const getReportName = (r: any) => {
    if (r.details && r.details.length > 0) {
      if (r.details.length === 1) {
        return r.details[0].name;
      }
      return "all";
    }
    return r.total > 1 ? "all" : "-";
  };

  const isWriteAllowed = user && (user.role.toLowerCase() === 'admin' || user.role.toLowerCase() === 'editor');

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete all reports? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch('/api/reports', { method: 'DELETE' });
      if (res.ok) {
        alert("All reports deleted successfully.");
        if (refreshReports) refreshReports();
        setSel(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete reports.");
      }
    } catch (e) {
      alert("Error communicating with the server.");
    }
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Reports</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>All generated PDF reports · Click a row for details</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={() => refreshReports && refreshReports()} 
            style={S.btn("linear-gradient(135deg,#6366f1,#8b5cf6)", "#fff", { 
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)" 
            })}
          >
            🔄 Refresh Reports
          </button>
          {isWriteAllowed && (
            <button 
              onClick={handleDeleteAll} 
              style={S.btn("linear-gradient(135deg,#ef4444,#dc2626)", "#fff", { 
                boxShadow: "0 4px 12px rgba(239,68,68,0.3)" 
              })}
            >
              🗑️ Delete All Reports
            </button>
          )}
        </div>
      </div>
      <div className={`grid grid-cols-1 ${sel ? 'lg:grid-cols-[1fr_420px]' : ''} gap-5`}>
        <div style={{ ...S.card, overflow: "hidden" }}>
          <div className="w-full overflow-x-auto">
            <table>
              <thead>
                <tr style={{ background: "#0f1117", borderBottom: "1px solid #1e2130" }}>
                  {["Date", "Name", "Time", "Total", "Success", "Failed", "Rate", ""].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => {
                  const pct = Math.round((r.success / r.total) * 100);
                  const isActive = sel?.id === r.id;
                  return (
                    <tr key={r.id} onClick={() => setSel(isActive ? null : r)}
                      style={{ borderBottom: "1px solid #1e213060", background: isActive ? "#1e2a4a" : i % 2 === 0 ? "transparent" : "#ffffff05", cursor: "pointer" }}>
                      <td style={S.td({ color: "#f1f5f9", whiteSpace: "nowrap" })}>{r.date}</td>
                      <td style={S.td({ color: "#e2e8f0", fontWeight: 500, whiteSpace: "nowrap" })}>{getReportName(r)}</td>
                      <td style={S.td({ color: "#94a3b8", whiteSpace: "nowrap" })}>{r.time}</td>
                      <td style={S.td({ color: "#94a3b8", whiteSpace: "nowrap" })}>{r.total}</td>
                      <td style={S.td({ color: "#22c55e", fontWeight: 600, whiteSpace: "nowrap" })}>{r.success}</td>
                      <td style={S.td({ color: r.failed > 0 ? "#ef4444" : "#64748b", fontWeight: r.failed > 0 ? 600 : 400, whiteSpace: "nowrap" })}>{r.failed}</td>
                      <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 50, height: 5, background: "#1e2130", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: pct + "%", height: "100%", background: pct === 100 ? "#22c55e" : "#f59e0b", borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, color: pct === 100 ? "#22c55e" : "#f59e0b" }}>{pct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button onClick={e => { e.stopPropagation(); window.open(`/api/reports/${r.id}/pdf`, "_blank"); }} style={{ background: "#1e2a4a", color: "#818cf8", border: "1px solid #2d3a5e", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>⬇ PDF</button>
                      </td>
                    </tr>
                  );
                })}
                {reports.length === 0 && (
                  <tr><td colSpan={8} style={{ padding: 30, textAlign: "center", color: "#64748b" }}>No reports found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {sel && (
          <div style={{ ...S.card, padding: 22, height: "fit-content", maxHeight: "85vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>Report Detail</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{sel.date} · {sel.time}</div>
              </div>
              <button onClick={() => setSel(null)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[["Total Sites", sel.total, "#818cf8"], ["Success", sel.success, "#22c55e"], ["Failed", sel.failed, "#ef4444"], ["Rate", Math.round((sel.success / sel.total) * 100) + "%", "#f59e0b"]].map(([l, v, c]) => (
                <div key={l as string} style={{ background: "#0f1117", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: c as string }}>{v}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* List of checked sites in this report run */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>Website Check Summary</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {displayDetails.map((siteDetail: any) => (
                  <div key={siteDetail.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f1117", borderRadius: 8, padding: 8 }}>
                    <div style={{ maxWidth: "70%" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{siteDetail.name}</div>
                      <div style={{ fontSize: 10, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{siteDetail.url}</div>
                      {siteDetail.loadTime && <span style={{ fontSize: 10, color: "#818cf8" }}>{siteDetail.loadTime}ms</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {siteDetail.status === 'success' ? (
                        <span style={{ fontSize: 10, color: "#22c55e" }}>✓ OK</span>
                      ) : (
                        <span style={{ fontSize: 10, color: "#ef4444" }}>✗ Fail</span>
                      )}
                      {siteDetail.screenshot && (
                        <button onClick={() => openScreenshot(siteDetail.name, siteDetail.screenshot)} style={{ background: "#1e2130", border: "none", color: "#818cf8", fontSize: 10, padding: "3px 6px", borderRadius: 4, cursor: "pointer" }}>👁️ View</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#0f1117", borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>File Name</div>
              <div style={{ fontSize: 12, color: "#818cf8", wordBreak: "break-all" }}>{sel.file}</div>
            </div>

            <button onClick={() => window.open(`/api/reports/${sel.id}/pdf`, "_blank")} style={{ ...S.btn("#6366f1", "#fff"), width: "100%", padding: 10 }}>⬇ Download PDF Report</button>
          </div>
        )}
      </div>
    </div>
  );
}
