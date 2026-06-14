'use client';

import { useState, useEffect, useRef } from 'react';

/* ─── Shared Styles ─────────────────────────────────── */
const S = {
  input: {
    width: "100%",
    background: "#0f1117",
    border: "1px solid #1e2130",
    borderRadius: 8,
    padding: "9px 12px",
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit"
  },
  btn: (bg, color, extra = {}) => ({
    background: bg,
    color,
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
    ...extra
  }),
  card: { background: "#13151f", border: "1px solid #1e2130", borderRadius: 12 },
  th: {
    padding: "11px 16px",
    textAlign: "left",
    fontSize: 11,
    color: "#64748b",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  td: (extra = {}) => ({ padding: "12px 16px", fontSize: 13, ...extra }),
};

const badge = (bg, color, text) => (
  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: bg, color, fontWeight: 500 }}>
    {text}
  </span>
);

/* ─── Sidebar ───────────────────────────────────────── */
function Sidebar({ page, setPage }) {
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "⬛" },
    { id: "websites", label: "Websites", icon: "🌐" },
    { id: "reports", label: "Reports", icon: "📄" },
    { id: "excel", label: "Excel Import", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];
  return (
    <aside style={{ width: 220, background: "#13151f", borderRight: "1px solid #1e2130", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "22px 18px 18px", borderBottom: "1px solid #1e2130" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>📡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>SiteWatch</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Monitor Portal</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {nav.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 8, border: "none",
              background: active ? "#1e2a4a" : "transparent",
              color: active ? "#818cf8" : "#94a3b8",
              fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer",
              marginBottom: 2, borderLeft: active ? "2px solid #6366f1" : "2px solid transparent",
              fontFamily: "inherit", textAlign: "left"
            }}>
              <span style={{ fontSize: 15 }}>{n.icon}</span>{n.label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "14px 16px", borderTop: "1px solid #1e2130" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>A</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>Admin</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>admin@company.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Dashboard ─────────────────────────────────────── */
function Dashboard({ sites, reports, triggerCapture, openScreenshot }) {
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
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Today: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · Live screenshot monitors</p>
        </div>
        <button onClick={triggerCapture} style={S.btn("linear-gradient(135deg,#6366f1,#8b5cf6)", "#fff", { boxShadow: "0 4px 12px rgba(99,102,241,0.3)" })}>
          📸 Run Capture Now
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Reports Table */}
        <div style={S.card}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e2130", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#f1f5f9" }}>Recent Reports</span>
            <span style={{ fontSize: 12, color: "#6366f1" }}>History log</span>
          </div>
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
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
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
                <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, borderBottom: "1px solid #1e213040", paddingBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{w.name}</div>
                    <div style={{ fontSize: 11, color: "#ef4444" }}>{w.error}</div>
                  </div>
                  {w.lastCaptureImage && (
                    <button onClick={() => openScreenshot(w.name, w.lastCaptureImage)} style={S.btn("#1e2130", "#94a3b8", { padding: "4px 8px", fontSize: 11 })}>👁️ View</button>
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

/* ─── Website Management ────────────────────────────── */
function WebsiteManagement({ sites, refreshSites, triggerCapture, openScreenshot }) {
  const [search, setSearch] = useState("");
  const [showModal, setShow] = useState(false);
  const [editSite, setEdit] = useState(null);
  const [form, setForm] = useState({ name: "", url: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const filtered = sites.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.url.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() { setEdit(null); setForm({ name: "", url: "" }); setShow(true); }
  function openEdit(s) { setEdit(s); setForm({ name: s.name, url: s.url }); setShow(true); }

  async function save() {
    if (!form.name || !form.url) return;
    
    let targetUrl = form.url.trim();
    if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }
    
    const url = editSite ? `/api/websites/${editSite.id}` : '/api/websites';
    const method = editSite ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, url: targetUrl })
    });

    refreshSites();
    setShow(false);
  }

  async function toggle(s) {
    const nextStatus = s.status === "active" ? "disabled" : "active";
    await fetch(`/api/websites/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    refreshSites();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/websites/${deleteTarget.id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    refreshSites();
  }

  async function confirmDeleteAll() {
    await fetch('/api/websites', { method: 'DELETE' });
    setShowDeleteAllConfirm(false);
    refreshSites();
  }

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Websites</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{sites.length} websites configured</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button 
            onClick={() => setShowDeleteAllConfirm(true)} 
            disabled={sites.length === 0}
            style={S.btn(sites.length === 0 ? "#1e2130" : "#450a0a", sites.length === 0 ? "#64748b" : "#fca5a5", { cursor: sites.length === 0 ? "not-allowed" : "pointer" })}
          >
            🗑️ Delete All
          </button>
          <button onClick={triggerCapture} style={S.btn("#8b5cf6", "#fff")}>📸 Run Capture</button>
          <button onClick={openAdd} style={S.btn("#6366f1", "#fff")}>+ Add Website</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...S.input, width: 240 }} />
      </div>

      {/* Table */}
      <div style={{ ...S.card, overflow: "hidden" }}>
        <table>
          <thead>
            <tr style={{ background: "#0f1117", borderBottom: "1px solid #1e2130" }}>
              {["Name", "URL", "Status", "Last Capture", "Last Status", "Screenshot", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #1e213060", background: i % 2 === 0 ? "transparent" : "#ffffff05" }}>
                <td style={S.td({ fontWeight: 600, color: "#f1f5f9" })}>{s.name}</td>
                <td style={S.td({ color: "#818cf8", fontSize: 12 })}><a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>{s.url}</a></td>
                <td style={S.td()}>{badge(s.status === "active" ? "#14532d" : "#1e2130", s.status === "active" ? "#86efac" : "#64748b", s.status === "active" ? "● Active" : "○ Disabled")}</td>
                <td style={S.td({ color: "#94a3b8" })}>{s.lastCapture}</td>
                <td style={S.td()}>{badge(s.lastStatus === "success" ? "#14532d" : "#450a0a", s.lastStatus === "success" ? "#86efac" : "#fca5a5", s.lastStatus === "success" ? "✓ Success" : ("✗ " + s.error))}</td>
                <td style={S.td()}>
                  {s.lastCaptureImage ? (
                    <button onClick={() => openScreenshot(s.name, s.lastCaptureImage)} style={S.btn("#1e2130", "#818cf8", { padding: "4px 8px", fontSize: 11 })}>👁️ View</button>
                  ) : "-"}
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => openEdit(s)} style={S.btn("#1e2a4a", "#818cf8", { padding: "5px 10px", fontSize: 12 })}>Edit</button>
                    <button onClick={() => toggle(s)} style={S.btn(s.status === "active" ? "#1e2130" : "#14532d", s.status === "active" ? "#94a3b8" : "#86efac", { padding: "5px 10px", fontSize: 12 })}>{s.status === "active" ? "Disable" : "Enable"}</button>
                    <button onClick={() => setDeleteTarget(s)} style={S.btn("#450a0a", "#fca5a5", { padding: "5px 10px", fontSize: 12 })}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No websites found</div>}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ ...S.card, padding: 28, width: 420 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>{editSite ? "Edit Website" : "Add Website"}</h2>
            {[["Site Name", "name", "e.g. CRM Portal"], ["URL", "url", "https://example.com"]].map(([label, key, ph]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 5 }}>{label}</label>
                <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={S.input} placeholder={ph} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
              <button onClick={() => setShow(false)} style={S.btn("#1e2130", "#94a3b8")}>Cancel</button>
              <button onClick={save} style={S.btn("#6366f1", "#fff")}>{editSite ? "Save Changes" : "Add Website"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
          <div style={{ ...S.card, padding: 28, width: 400, textAlign: "center" }} className="animate-fade-in">
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Delete Website</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?<br />This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setDeleteTarget(null)} style={S.btn("#1e2130", "#94a3b8")}>Cancel</button>
              <button onClick={confirmDelete} style={S.btn("#450a0a", "#fca5a5")}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteAllConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
          <div style={{ ...S.card, padding: 28, width: 400, textAlign: "center" }} className="animate-fade-in">
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fca5a5", marginBottom: 12 }}>Delete All Websites</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
              Are you sure you want to delete <strong>all {sites.length}</strong> configured websites?<br />This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setShowDeleteAllConfirm(false)} style={S.btn("#1e2130", "#94a3b8")}>Cancel</button>
              <button onClick={confirmDeleteAll} style={S.btn("#450a0a", "#fca5a5")}>Yes, Delete All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Reports ───────────────────────────────────────── */
function Reports({ reports, openScreenshot }) {
  const [sel, setSel] = useState(null);

  const displayDetails = sel?.details || [];

  const getReportName = (r) => {
    if (r.details && r.details.length > 0) {
      if (r.details.length === 1) {
        return r.details[0].name;
      }
      return "all";
    }
    return r.total > 1 ? "all" : "-";
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Reports</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>All generated PDF reports · Click a row for details</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 420px" : "1fr", gap: 20 }}>
        <div style={{ ...S.card, overflow: "hidden" }}>
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
                    <td style={S.td({ color: "#f1f5f9" })}>{r.date}</td>
                    <td style={S.td({ color: "#e2e8f0", fontWeight: 500 })}>{getReportName(r)}</td>
                    <td style={S.td({ color: "#94a3b8" })}>{r.time}</td>
                    <td style={S.td({ color: "#94a3b8" })}>{r.total}</td>
                    <td style={S.td({ color: "#22c55e", fontWeight: 600 })}>{r.success}</td>
                    <td style={S.td({ color: r.failed > 0 ? "#ef4444" : "#64748b", fontWeight: r.failed > 0 ? 600 : 400 })}>{r.failed}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 50, height: 5, background: "#1e2130", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: pct + "%", height: "100%", background: pct === 100 ? "#22c55e" : "#f59e0b", borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, color: pct === 100 ? "#22c55e" : "#f59e0b" }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "right" }}>
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
                <div key={l} style={{ background: "#0f1117", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: c }}>{v}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* List of checked sites in this report run */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>Website Check Summary</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {displayDetails.map(siteDetail => (
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

/* ─── Excel Import ──────────────────────────────────── */
function ExcelImport({ refreshSites }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0, status: "" });
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  // Table state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => {
    setDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setError(null);
    setSuccessMsg(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const onFileSelect = (e) => {
    setError(null);
    setSuccessMsg(null);
    if (e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
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

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

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
                const newLogs = data.batch.map(item => {
                  const statusStr = item.status === 'success' ? '✓ SUCCESS' : '✗ FAILED';
                  const detail = item.status === 'success' ? `${item.responseTime}ms - ${item.pageTitle || 'No Title'}` : `${item.error}`;
                  return `[${statusStr}] ${item.name} (${item.url}) - ${detail}`;
                });
                setLogs(prev => [...prev, ...newLogs]);
              }
            } else if (data.type === 'complete') {
              setProgress(prev => ({ ...prev, percent: 100, status: 'Completed processing demo rows!' }));
              setResults(data.data);
              const successIds = new Set(data.data.filter(r => r.status === 'success').map(r => r.id));
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
    } catch (err) {
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

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result.split(',')[1];
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

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Save the last partial line back to the buffer
          buffer = lines.pop();

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

                // Add last verified batch to logs
                if (data.batch && data.batch.length > 0) {
                  const newLogs = data.batch.map(item => {
                    const statusStr = item.status === 'success' ? '✓ SUCCESS' : '✗ FAILED';
                    const detail = item.status === 'success' ? `${item.responseTime}ms - ${item.pageTitle || 'No Title'}` : `${item.error}`;
                    return `[${statusStr}] ${item.name} (${item.url}) - ${detail}`;
                  });
                  setLogs(prev => [...prev, ...newLogs]);
                }
              } else if (data.type === 'complete') {
                setProgress(prev => ({ ...prev, percent: 100, status: 'Completed processing all rows!' }));
                setResults(data.data);
                // Pre-select all successfully checked URLs
                const successIds = new Set(data.data.filter(r => r.status === 'success').map(r => r.id));
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
      } catch (err) {
        setError(err.message || "An unexpected error occurred during Excel processing.");
        setLogs(prev => [...prev, `[ERROR] ${err.message}`]);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read the local Excel file.");
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  // Import selected sites to database
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
        // Clear results
        setResults([]);
        setFile(null);
        setSelectedIds(new Set());
      } else {
        throw new Error("Failed to save websites to monitoring list.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Selection helpers
  const toggleSelectAll = (filteredItems) => {
    const newSelected = new Set(selectedIds);
    const allFilteredSelected = filteredItems.every(item => newSelected.has(item.id));
    
    if (allFilteredSelected) {
      filteredItems.forEach(item => newSelected.delete(item.id));
    } else {
      filteredItems.forEach(item => newSelected.add(item.id));
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectOne = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Filter items
  const filtered = results.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.url.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const displayedLogs = logs.slice(-6); // Only show the last 6 logs for cleaner UI

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Excel Bulk Import</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
          Upload Excel spreadsheets (.xlsx, .xls) containing website monitoring parameters, verify links, and add them to SiteWatch.
        </p>
      </div>

      {/* Notifications */}
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

      <div style={{ display: "grid", gridTemplateColumns: results.length > 0 ? "1fr" : "1fr 360px", gap: 20, alignItems: "start" }}>
        
        {/* Upload Control Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Dropzone card */}
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
              onClick={() => document.getElementById('excel-file-input').click()}
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

          {/* Loading / Progress Monitor card */}
          {loading && (
            <div style={{ ...S.card, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="pulse" style={{ width: 10, height: 10, borderRadius: "50%", background: "#6366f1" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Validating and Pinging URLs...</span>
                </div>
                <span style={{ fontSize: 13, color: "#6366f1", fontWeight: 700 }}>{progress.percent}%</span>
              </div>

              {/* Progress Bar */}
              <div style={{ height: 8, background: "#1e2130", borderRadius: 4, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ height: "100%", width: `${progress.percent}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 4, transition: "width 0.3s ease" }} />
              </div>

              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
                <strong>Current Status:</strong> {progress.status}
              </div>

              {/* Logs area */}
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

          {/* Results table (only when items are loaded) */}
          {results.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Toolbar */}
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

              {/* Table */}
              <div style={{ ...S.card, overflow: "hidden" }}>
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

              {/* Pagination controls */}
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
                      // Show page links selectively if there are too many (e.g. limit to current +- 2 pages)
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

        {/* Info panel when no results */}
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

/* ─── User Management ──────────────────────────────── */
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Viewer" });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
      .catch(err => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  async function save() {
    if (!form.name || !form.email) {
      setError("Name and Email are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        fetchUsers();
        setShowModal(false);
        setForm({ name: "", email: "", role: "Viewer" });
        setError(null);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create user.");
      }
    } catch (err) {
      setError("Error saving user.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/users/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }

  const roleBadge = (role) => {
    switch(role.toLowerCase()) {
      case 'admin': return badge("#4f46e533", "#a5b4fc", "Admin");
      case 'editor': return badge("#0284c733", "#7dd3fc", "Editor");
      default: return badge("#4b556333", "#d1d5db", "Viewer");
    }
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Users</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Manage monitor portal access and user roles</p>
        </div>
        <button onClick={() => { setShowModal(true); setError(null); }} style={S.btn("#6366f1", "#fff")}>+ Add User</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <input placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...S.input, width: 320 }} />
      </div>

      {/* Table */}
      <div style={{ ...S.card, overflow: "hidden" }}>
        <table>
          <thead>
            <tr style={{ background: "#0f1117", borderBottom: "1px solid #1e2130" }}>
              {["Name", "Email Address", "Role", "Status", "Created Date", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #1e213060", background: i % 2 === 0 ? "transparent" : "#ffffff05" }}>
                <td style={S.td({ fontWeight: 600, color: "#f1f5f9" })}>{u.name}</td>
                <td style={S.td({ color: "#e2e8f0" })}>{u.email}</td>
                <td style={S.td()}>{roleBadge(u.role)}</td>
                <td style={S.td()}>{badge(u.status === "active" ? "#14532d" : "#1e2130", u.status === "active" ? "#86efac" : "#64748b", u.status === "active" ? "● Active" : "○ Inactive")}</td>
                <td style={S.td({ color: "#94a3b8" })}>{u.created}</td>
                <td style={{ padding: "10px 16px" }}>
                  <button onClick={() => setDeleteTarget(u)} style={S.btn("#450a0a", "#fca5a5", { padding: "5px 10px", fontSize: 12 })}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No users found</div>}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ ...S.card, padding: 28, width: 420 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>Add User</h2>
            {error && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</div>}
            
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 5 }}>Full Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={S.input} placeholder="e.g. Amit Sharma" />
            </div>
            
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 5 }}>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={S.input} placeholder="amit@company.com" />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 5 }}>Portal Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} 
                style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: 8, color: "#e2e8f0", padding: "9px 12px", fontSize: 13, width: "100%" }}>
                <option value="Viewer">Viewer</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
              <button onClick={() => setShowModal(false)} style={S.btn("#1e2130", "#94a3b8")}>Cancel</button>
              <button onClick={save} style={S.btn("#6366f1", "#fff")}>Create User</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
          <div style={{ ...S.card, padding: 28, width: 400, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Remove User Access</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
              Are you sure you want to remove access for <strong>{deleteTarget.name}</strong>?<br />They will no longer be able to view this portal.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setDeleteTarget(null)} style={S.btn("#1e2130", "#94a3b8")}>Cancel</button>
              <button onClick={confirmDelete} style={S.btn("#450a0a", "#fca5a5")}>Yes, Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Settings Management ───────────────────────────── */
function SettingsManagement() {
  const [settings, setSettings] = useState({ smtp: {}, recipients: [], schedules: [] });
  const [smtpForm, setSmtpForm] = useState({ host: "", port: "", user: "", pass: "" });
  const [newRecipient, setNewRecipient] = useState("");
  const [newScheduleTime, setNewScheduleTime] = useState("09:00");
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchSettings = () => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(data);
        if (data.smtp) {
          setSmtpForm({
            host: data.smtp.host || "",
            port: data.smtp.port || "",
            user: data.smtp.user || "",
            pass: data.smtp.pass || ""
          });
        }
      })
      .catch(err => console.error("Error fetching settings:", err));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const triggerAlert = (msg, isErr = false) => {
    if (isErr) {
      setStatusError(msg);
      setTimeout(() => setStatusError(null), 4000);
    } else {
      setStatusMessage(msg);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  async function saveSettings(payload) {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        triggerAlert("Settings saved successfully!");
      } else {
        triggerAlert("Failed to save settings.", true);
      }
    } catch (err) {
      triggerAlert("Error updating settings.", true);
    }
  }

  const handleSmtpSave = (e) => {
    e.preventDefault();
    saveSettings({ smtp: smtpForm });
  };

  const handleAddRecipient = (e) => {
    e.preventDefault();
    if (!newRecipient || !/\S+@\S+\.\S+/.test(newRecipient)) {
      triggerAlert("Please enter a valid recipient email address.", true);
      return;
    }
    if (settings.recipients.some(r => r.email.toLowerCase() === newRecipient.toLowerCase())) {
      triggerAlert("Recipient email already exists.", true);
      return;
    }
    const updatedRecipients = [
      ...settings.recipients,
      { id: Date.now(), email: newRecipient.trim() }
    ];
    setNewRecipient("");
    saveSettings({ recipients: updatedRecipients });
  };

  const handleDeleteRecipient = (id) => {
    const updatedRecipients = settings.recipients.filter(r => r.id !== id);
    saveSettings({ recipients: updatedRecipients });
  };

  const handleToggleSchedule = (id) => {
    const updatedSchedules = settings.schedules.map(s => {
      if (s.id === id) {
        return { ...s, enabled: !s.enabled };
      }
      return s;
    });
    saveSettings({ schedules: updatedSchedules });
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!newScheduleTime) return;
    if (!/^\d{2}:\d{2}$/.test(newScheduleTime)) {
      triggerAlert("Invalid time format.", true);
      return;
    }
    if (settings.schedules.some(s => s.time === newScheduleTime)) {
      triggerAlert("Schedule time already exists.", true);
      return;
    }
    const updatedSchedules = [
      ...settings.schedules,
      { id: Date.now(), time: newScheduleTime, enabled: true }
    ].sort((a, b) => a.time.localeCompare(b.time));
    saveSettings({ schedules: updatedSchedules });
  };

  const handleDeleteSchedule = (id) => {
    const updatedSchedules = settings.schedules.filter(s => s.id !== id);
    saveSettings({ schedules: updatedSchedules });
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900 }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Settings</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Configure email alerts, SMTP parameters, and scan schedules</p>
      </div>

      {statusMessage && (
        <div style={{ ...S.card, borderColor: "#22c55e", background: "#14532d33", padding: "12px 18px", marginBottom: 20, color: "#86efac", fontSize: 13 }}>
          ✅ {statusMessage}
        </div>
      )}
      
      {statusError && (
        <div style={{ ...S.card, borderColor: "#ef4444", background: "#450a0a33", padding: "12px 18px", marginBottom: 20, color: "#fca5a5", fontSize: 13 }}>
          ❌ {statusError}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ ...S.card, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 16 }}>📧 SMTP Configuration</h2>
            <form onSubmit={handleSmtpSave}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 5 }}>SMTP Server Host</label>
                <input value={smtpForm.host} onChange={e => setSmtpForm({ ...smtpForm, host: e.target.value })} style={S.input} placeholder="smtp.mailtrap.io" />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 5 }}>SMTP Port</label>
                <input value={smtpForm.port} onChange={e => setSmtpForm({ ...smtpForm, port: e.target.value })} style={S.input} placeholder="e.g. 587 or 2525" />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 5 }}>SMTP Username</label>
                <input value={smtpForm.user} onChange={e => setSmtpForm({ ...smtpForm, user: e.target.value })} style={S.input} placeholder="smtp-user@company.com" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 5 }}>SMTP Password</label>
                <input type="password" value={smtpForm.pass} onChange={e => setSmtpForm({ ...smtpForm, pass: e.target.value })} style={S.input} placeholder="••••••••••••" />
              </div>
              <button type="submit" style={S.btn("#6366f1", "#fff", { width: "100%" })}>Save SMTP Config</button>
            </form>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          <div style={{ ...S.card, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 12 }}>👥 Email Recipients</h2>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>These addresses will receive automated check reports as PDF attachments.</p>
            
            <form onSubmit={handleAddRecipient} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input type="email" value={newRecipient} onChange={e => setNewRecipient(e.target.value)} placeholder="recipient@company.com" style={S.input} />
              <button type="submit" style={S.btn("#8b5cf6", "#fff")}>Add</button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
              {settings.recipients.map(r => (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f1117", borderRadius: 8, padding: "8px 12px", border: "1px solid #1e213060" }}>
                  <span style={{ fontSize: 13, color: "#e2e8f0" }}>{r.email}</span>
                  <button onClick={() => handleDeleteRecipient(r.id)} style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: 16, cursor: "pointer", padding: "0 4px" }}>✕</button>
                </div>
              ))}
              {settings.recipients.length === 0 && (
                <div style={{ fontSize: 12, color: "#64748b", textAlign: "center", padding: 12 }}>No email recipients configured. Notifications are mock-only.</div>
              )}
            </div>
          </div>

          <div style={{ ...S.card, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 12 }}>⏰ Background Scan Schedules</h2>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Define times of day (local server time) when automated captures will trigger.</p>
            {currentTime && (
              <p style={{ fontSize: 12, color: "#818cf8", marginBottom: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                <span>🕒</span> Current Time: {currentTime}
              </p>
            )}

            <form onSubmit={handleAddSchedule} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
              <input type="time" value={newScheduleTime} onChange={e => setNewScheduleTime(e.target.value)} style={{ ...S.input, width: 130 }} />
              <button type="submit" style={S.btn("#8b5cf6", "#fff")}>Add Time</button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {settings.schedules.map(s => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f1117", borderRadius: 8, padding: "8px 12px", border: "1px solid #1e213060" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input type="checkbox" checked={s.enabled} onChange={() => handleToggleSchedule(s.id)} style={{ width: 15, height: 15, cursor: "pointer" }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: s.enabled ? "#f1f5f9" : "#64748b" }}>
                      {(() => {
                        if (!s.time) return "";
                        const [h, m] = s.time.split(":");
                        const hour = parseInt(h, 10);
                        const ampm = hour >= 12 ? "PM" : "AM";
                        const displayHour = hour % 12 || 12;
                        return `${displayHour.toString().padStart(2, '0')}:${m} ${ampm} (${s.time})`;
                      })()}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteSchedule(s.id)} style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: 16, cursor: "pointer", padding: "0 4px" }}>✕</button>
                </div>
              ))}
              {settings.schedules.length === 0 && (
                <div style={{ fontSize: 12, color: "#64748b", textAlign: "center", padding: 12 }}>No automated background schedules configured.</div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

/* ─── App Root ──────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sites, setSites] = useState([]);
  const [reports, setReports] = useState([]);

  // Modal Screenshot State
  const [screenshotModal, setScreenshotModal] = useState({ show: false, title: "", file: "" });

  // Progress Logging State
  const [progress, setProgress] = useState({ active: false, status: "Idle", current: 0, total: 0 });

  const fetchSites = () => fetch('/api/websites').then(r => r.json()).then(setSites);
  const fetchReports = () => fetch('/api/reports').then(r => r.json()).then(setReports);

  useEffect(() => {
    fetchSites();
    fetchReports();
  }, []);

  // Poll progress state
  const pollCaptureProgress = () => {
    const timer = setInterval(() => {
      fetch('/api/capture-progress')
        .then(r => r.json())
        .then(data => {
          setProgress(data);
          if (!data.active) {
            clearInterval(timer);
            // Refresh dashboard and lists
            fetchSites();
            fetchReports();
          }
        })
        .catch(() => clearInterval(timer));
    }, 800);
  };

  async function triggerCapture() {
    const res = await fetch('/api/capture-now', { method: 'POST' });
    if (res.ok) {
      setProgress({ active: true, status: "Triggering capture run...", current: 0, total: 0 });
      pollCaptureProgress();
    } else {
      alert("A capture is already running.");
    }
  }

  function openScreenshot(title, file) {
    setScreenshotModal({ show: true, title, file });
  }

  const pages = {
    dashboard: <Dashboard sites={sites} reports={reports} triggerCapture={triggerCapture} openScreenshot={openScreenshot} />,
    websites: <WebsiteManagement sites={sites} refreshSites={fetchSites} triggerCapture={triggerCapture} openScreenshot={openScreenshot} />,
    reports: <Reports reports={reports} openScreenshot={openScreenshot} />,
    excel: <ExcelImport refreshSites={fetchSites} />,
    users: <UserManagement />,
    settings: <SettingsManagement />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f1117", color: "#e2e8f0", fontFamily: "'Inter','Segoe UI',sans-serif", overflow: "hidden" }}>
      <Sidebar page={page} setPage={setPage} />
      <main style={{ flex: 1, overflow: "auto" }}>{pages[page]}</main>

      {/* Real-time Capture Progress Overlay Modal */}
      {progress.active && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div className="animate-fade-in" style={{ ...S.card, padding: 32, width: 460, textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: 32, marginBottom: 15 }} className="pulse">📸</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>Site Capture In Progress</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, minHeight: 38 }}>{progress.status}</p>

            {progress.total > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 6 }}>
                  <span>Progress</span>
                  <span>{progress.current} / {progress.total} sites</span>
                </div>
                <div style={{ height: 6, background: "#1e2130", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.round((progress.current / progress.total) * 100)}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 3, transition: "width 0.3s ease" }} />
                </div>
              </div>
            )}

            <div style={{ fontSize: 11, color: "#64748b", marginTop: 20 }}>
              Running Puppeteer headless screenshot sessions on backend...
            </div>
          </div>
        </div>
      )}

      {/* Expandable Screenshot Preview Modal */}
      {screenshotModal.show && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ display: "flex", width: "100%", maxWidth: 1000, justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>Screenshot of {screenshotModal.title}</h3>
            <button onClick={() => setScreenshotModal({ show: false, title: "", file: "" })} style={S.btn("#1e2130", "#e2e8f0", { padding: "6px 14px" })}>Close ✕</button>
          </div>
          <div style={{ width: "100%", maxWidth: 1000, maxHeight: "85vh", overflow: "auto", border: "1px solid #1e2130", borderRadius: 8, background: "#13151f" }}>
            <img
              src={`/screenshots/${screenshotModal.file}`}
              alt={`Capture of ${screenshotModal.title}`}
              style={{ width: "100%", display: "block", background: "#0f1117" }}
              onError={(e) => {
                e.target.onerror = null;
                alert("Could not load screenshot. File might not be generated yet.");
                setScreenshotModal({ show: false, title: "", file: "" });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
