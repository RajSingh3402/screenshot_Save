import React from 'react';
import { S } from '@/styles/theme';

interface DashboardProps {
  sites: any[];
  reports: any[];
  triggerCapture: () => void;
  openScreenshot: (title: string, file: string) => void;
}

export function Dashboard({ sites, reports, triggerCapture, openScreenshot }: DashboardProps) {
  const active = sites.filter(s => s.status === "active");
  const failed = sites.filter(s => s.lastStatus === "failed");
  const success = sites.filter(s => s.lastStatus === "success" && s.status === "active");
  const pct = Math.round((success.length / Math.max(active.length, 1)) * 100);
  const pctColor = pct > 90 ? "#22c55e" : pct > 70 ? "#f59e0b" : "#ef4444";

  const statCards = [
    { label: "Total Websites", value: sites.length, sub: "Configured", color: "#6366f1", icon: "🌐" },
    { label: "Active Monitoring", value: active.length, sub: "Enabled", color: "#22c55e", icon: "✅" },
    { label: "Screenshots Today", value: reports.length > 0 ? (reports[0].success + reports[0].failed) : 0, sub: "Last run captures", color: "#8b5cf6", icon: "📸" },
    { label: "Failed Today", value: failed.length, sub: "Need attention", color: "#ef4444", icon: "⚠️" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 page-container" style={{ maxWidth: 1100, width: "100%" }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Today: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · Live screenshot monitors</p>
        </div>
      </div>


      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: 24 }}>
        {statCards.map(c => (
          <div key={c.label} style={{ ...S.card, padding: "18px 20px", borderTop: `3px solid ${c.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 5 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: c.color, marginTop: 3 }}>{c.sub}</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        {/* Reports Table */}
        <div style={S.card} className="overflow-hidden">
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e2130", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#f1f5f9" }}>Recent Reports</span>
            <span style={{ fontSize: 12, color: "#6366f1" }}>History log</span>
          </div>
          <div className="w-full overflow-x-auto">
            <table style={{ minWidth: "100%" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e2130", background: "#0f1117" }}>
                  {["Date", "Time", "Total", "✓ Success", "✗ Failed", ""].map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 7).map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #1e213060", background: i % 2 === 0 ? "transparent" : "#ffffff05" }}>
                    <td style={S.td({ color: "#e2e8f0" })}>{r.date}</td>
                    <td style={S.td({ color: "#94a3b8" })}>{r.time}</td>
                    <td style={S.td({ color: "#94a3b8" })}>{r.total}</td>
                    <td style={S.td({ color: "#22c55e", fontWeight: 600 })}>{r.success}</td>
                    <td style={S.td({ color: r.failed > 0 ? "#ef4444" : "#64748b", fontWeight: r.failed > 0 ? 600 : 400 })}>{r.failed}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
                      <button onClick={() => window.open(`/api/reports/${r.id}/pdf`, "_blank")} style={{ background: "#1e2a4a", color: "#818cf8", border: "1px solid #2d3a5e", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>⬇ PDF</button>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 30, textAlign: "center", color: "#64748b" }}>No reports generated yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Health */}
          <div style={{ ...S.card, padding: "18px 20px" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#f1f5f9", marginBottom: 14 }}>Website Health</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>Overall health</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: pctColor }}>{pct}%</span>
            </div>
            <div style={{ height: 8, background: "#1e2130", borderRadius: 4, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ height: "100%", width: pct + "%", background: pctColor, borderRadius: 4 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {[["Online", success.length, "#22c55e"], ["Failed", failed.length, "#ef4444"], ["Disabled", sites.filter(s => s.status === "disabled").length, "#64748b"]].map(([l, v, c]) => (
                <div key={l as string} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: c as string }}>{v}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Failed */}
          <div style={{ ...S.card, padding: "18px 20px" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#f1f5f9", marginBottom: 12 }}>⚠️ Failed Websites</div>
            {failed.length === 0
              ? <div style={{ fontSize: 13, color: "#22c55e" }}>✓ All websites online</div>
              : failed.map(w => (
                <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, borderBottom: "1px solid #1e213040", paddingBottom: 6, gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</div>
                    <div style={{ fontSize: 11, color: "#ef4444", wordBreak: "break-word" }}>{w.error}</div>
                  </div>
                  {w.lastCaptureImage && (
                    <button onClick={() => openScreenshot(w.name, w.lastCaptureImage)} style={S.btn("#1e2130", "#94a3b8", { padding: "4px 8px", fontSize: 11, flexShrink: 0 })}>👁️ View</button>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
