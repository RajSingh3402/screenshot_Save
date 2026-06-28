import React, { useState } from 'react';
import { S, badge } from '@/styles/theme';

interface WebsiteManagementProps {
  sites: any[];
  refreshSites: () => void;
  triggerCapture: () => void;
  openScreenshot: (title: string, file: string) => void;
}

export function WebsiteManagement({ sites, refreshSites, triggerCapture, openScreenshot }: WebsiteManagementProps) {
  const [search, setSearch] = useState("");
  const [showModal, setShow] = useState(false);
  const [editSite, setEdit] = useState<any>(null);
  const [form, setForm] = useState({ name: "", url: "", alertEmail: "" });
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const filtered = sites.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.url.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() { setEdit(null); setForm({ name: "", url: "", alertEmail: "" }); setShow(true); }
  function openEdit(s: any) { setEdit(s); setForm({ name: s.name, url: s.url, alertEmail: s.alertEmail || "" }); setShow(true); }

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

  async function toggle(s: any) {
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
    <div className="p-4 sm:p-6 lg:p-8 page-container" style={{ width: "100%" }}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Websites</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 5,marginBottom: 20 }}>{sites.length} websites configured</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-start md:justify-end">
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
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }} className="w-full">
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
          style={S.input} className="w-full sm:w-[240px]" />
      </div>

      {/* Table */}
      <div style={{ ...S.card, overflow: "hidden" }}>
        <div className="w-full overflow-x-auto">
          <table>
            <thead>
              <tr style={{ background: "#0f1117", borderBottom: "1px solid #1e2130" }}>
                {["Name", "URL", "Status", "Last Capture", "Last Status", "Screenshot", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #1e213060", background: i % 2 === 0 ? "transparent" : "#ffffff05" }}>
                  <td style={S.td({ fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap" })}>{s.name}</td>
                  <td style={S.td({ color: "#818cf8", fontSize: 12, whiteSpace: "nowrap" })}><a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>{s.url}</a></td>
                  <td style={S.td({ whiteSpace: "nowrap" })}>{badge(s.status === "active" ? "#14532d" : "#1e2130", s.status === "active" ? "#86efac" : "#64748b", s.status === "active" ? "● Active" : "○ Disabled")}</td>
                  <td style={S.td({ color: "#94a3b8", whiteSpace: "nowrap" })}>{s.lastCapture}</td>
                  <td style={S.td({ whiteSpace: "nowrap" })}>{badge(s.lastStatus === "success" ? "#14532d" : "#450a0a", s.lastStatus === "success" ? "#86efac" : "#fca5a5", s.lastStatus === "success" ? "✓ Success" : ("✗ " + s.error))}</td>
                  <td style={S.td({ whiteSpace: "nowrap" })}>
                    {s.lastCaptureImage ? (
                      <button onClick={() => openScreenshot(s.name, s.lastCaptureImage)} style={S.btn("#1e2130", "#818cf8", { padding: "4px 8px", fontSize: 11 })}>👁️ View</button>
                    ) : "-"}
                  </td>
                  <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
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
        </div>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No websites found</div>}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ ...S.card, padding: 28 }} className="w-full max-w-[420px] mx-4 animate-fade-in">
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 20 }}>{editSite ? "Edit Website" : "Add Website"}</h2>
            {([
              ["Site Name", "name", "e.g. London Car Rentals"],
              ["URL", "url", "https://lcr.co.uk"],
              ["Alert Email", "alertEmail", "owner@company.com"]
            ] as const).map(([label, key, ph]) => (
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
          <div style={{ ...S.card, padding: 28 }} className="w-full max-w-[400px] mx-4 animate-fade-in">
            <div style={{ fontSize: 32, marginBottom: 12, textAlign: "center" }}>⚠️</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 12, textAlign: "center" }}>Delete Website</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24, textAlign: "center" }}>
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
          <div style={{ ...S.card, padding: 28 }} className="w-full max-w-[400px] mx-4 animate-fade-in">
            <div style={{ fontSize: 32, marginBottom: 12, textAlign: "center" }}>⚠️</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fca5a5", marginBottom: 12, textAlign: "center" }}>Delete All Websites</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24, textAlign: "center" }}>
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
