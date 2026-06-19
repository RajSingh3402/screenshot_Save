import React, { useState, useEffect } from 'react';
import { S, badge } from '@/styles/theme';

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // Create User Form State
  const [form, setForm] = useState({ name: "", email: "", role: "Viewer", password: "" });
  const [useAutoPassword, setUseAutoPassword] = useState(true);
  const [createdNotice, setCreatedNotice] = useState<{ email: string; pass: string } | null>(null);
  
  // Password Reset State
  const [resetTarget, setResetTarget] = useState<any>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState("");
  const [resetSuccessNotice, setResetSuccessNotice] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = () => {
    fetch('/api/users')
      .then(r => r.ok ? r.json() : [])
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(search.toLowerCase())
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
    if (!useAutoPassword && (!form.password || form.password.length < 6)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        password: useAutoPassword ? undefined : form.password
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchUsers();
        setShowModal(false);
        setForm({ name: "", email: "", role: "Viewer", password: "" });
        setUseAutoPassword(true);
        setError(null);
        
        // Show credentials copy notice
        setCreatedNotice({
          email: data.user.email,
          pass: data.plainPassword
        });
      } else {
        setError(data.error || "Failed to create user.");
      }
    } catch (err) {
      setError("Error saving user.");
    }
  }

  async function toggleStatus(user: any) {
    try {
      const newStatus = user.status?.toLowerCase() === 'active' ? 'Inactive' : 'Active';
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update user status.");
      }
    } catch (err) {
      console.error("Error toggling user status:", err);
    }
  }

  async function handleResetPassword() {
    if (!resetPasswordVal || resetPasswordVal.trim().length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(`/api/users/${resetTarget.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: resetPasswordVal })
      });
      
      if (response.ok) {
        setResetSuccessNotice(`Password for ${resetTarget.name} has been reset successfully.`);
        setResetPasswordVal("");
        setTimeout(() => {
          setResetTarget(null);
          setResetSuccessNotice(null);
        }, 2500);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      const response = await fetch(`/api/users/${deleteTarget.id}`, { method: 'DELETE' });
      if (response.ok) {
        setDeleteTarget(null);
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to remove user.");
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }

  const roleBadge = (role: string) => {
    switch((role || "").toLowerCase()) {
      case 'admin': return badge("#4f46e533", "#a5b4fc", "Admin");
      case 'editor': return badge("#0284c733", "#7dd3fc", "Editor");
      default: return badge("#4b556333", "#d1d5db", "Viewer");
    }
  };

  const getStatusBadge = (status: string) => {
    const isActive = (status || "").toLowerCase() === 'active';
    return badge(
      isActive ? "#14532d" : "#3b1717", 
      isActive ? "#86efac" : "#fca5a5", 
      isActive ? "● Active" : "○ Inactive"
    );
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Users Management</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Manage monitor portal access, user roles, and security credentials</p>
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
              {["Name", "Email Address", "Role", "Status", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #1e213060", background: i % 2 === 0 ? "transparent" : "#ffffff05" }}>
                <td style={S.td({ fontWeight: 600, color: "#f1f5f9" })}>{u.name}</td>
                <td style={S.td({ color: "#e2e8f0" })}>{u.email}</td>
                <td style={S.td()}>{roleBadge(u.role)}</td>
                <td style={S.td()}>{getStatusBadge(u.status)}</td>
                <td style={{ padding: "10px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button 
                      onClick={() => toggleStatus(u)} 
                      style={S.btn(u.status?.toLowerCase() === 'active' ? "#1e1b4b" : "#14532d", u.status?.toLowerCase() === 'active' ? "#c7d2fe" : "#86efac", { padding: "5px 10px", fontSize: 12 })}
                    >
                      {u.status?.toLowerCase() === 'active' ? "Deactivate" : "Activate"}
                    </button>
                    <button 
                      onClick={() => { setResetTarget(u); setError(null); }} 
                      style={S.btn("#1e2130", "#94a3b8", { padding: "5px 10px", fontSize: 12, border: "1px solid #2d3142" })}
                    >
                      Reset PW
                    </button>
                    <button 
                      onClick={() => setDeleteTarget(u)} 
                      style={S.btn("#450a0a", "#fca5a5", { padding: "5px 10px", fontSize: 12 })}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No users found</div>}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ ...S.card, padding: 28, width: 440 }}>
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

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 5 }}>Portal Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} 
                style={{ background: "#0f1117", border: "1px solid #1e2130", borderRadius: 8, color: "#e2e8f0", padding: "9px 12px", fontSize: 13, width: "100%" }}>
                <option value="Viewer">Viewer</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 8 }}>Password Credentials</label>
              <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#e2e8f0", cursor: "pointer" }}>
                  <input type="radio" checked={useAutoPassword} onChange={() => setUseAutoPassword(true)} />
                  Auto-generate
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#e2e8f0", cursor: "pointer" }}>
                  <input type="radio" checked={!useAutoPassword} onChange={() => setUseAutoPassword(false)} />
                  Set manually
                </label>
              </div>
              
              {!useAutoPassword && (
                <input 
                  type="password" 
                  value={form.password} 
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                  style={S.input} 
                  placeholder="At least 6 characters" 
                />
              )}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
              <button onClick={() => setShowModal(false)} style={S.btn("#1e2130", "#94a3b8")}>Cancel</button>
              <button onClick={save} style={S.btn("#6366f1", "#fff")}>Create User</button>
            </div>
          </div>
        </div>
      )}

      {/* User Created Success Notice (Credentials Popup) */}
      {createdNotice && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70 }}>
          <div style={{ ...S.card, padding: 28, width: 440, border: "1px solid #34d399", background: "rgba(16, 24, 20, 0.95)" }}>
            <div style={{ fontSize: 32, marginBottom: 12, textAlign: "center" }}>✅</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 10, textAlign: "center" }}>User Account Created</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, textAlign: "center" }}>
              Please copy these temporary credentials now. For security, the password will not be displayed again.
            </p>
            
            <div style={{ background: "#090f0c", padding: 14, borderRadius: 8, border: "1px solid #115e3b", marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Email:</span>
                <strong style={{ color: "#e2e8f0" }}>{createdNotice.email}</strong>
              </div>
              <div style={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Password:</span>
                <strong style={{ color: "#34d399", fontFamily: "monospace", fontSize: 14 }}>{createdNotice.pass}</strong>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button onClick={() => setCreatedNotice(null)} style={S.btn("#10b981", "#fff", { width: "100%" })}>
                I have copied the password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {resetTarget && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
          <div style={{ ...S.card, padding: 28, width: 400 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>Reset Password</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
              Set a new security password for <strong>{resetTarget.name}</strong>.
            </p>
            
            {resetSuccessNotice ? (
              <div style={{ background: "rgba(16, 24, 20, 0.8)", border: "1px solid #115e3b", color: "#34d399", padding: "12px 16px", borderRadius: 8, fontSize: 13, marginBottom: 12 }}>
                ✓ {resetSuccessNotice}
              </div>
            ) : (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 5 }}>New Password</label>
                <input 
                  type="password" 
                  value={resetPasswordVal} 
                  onChange={e => setResetPasswordVal(e.target.value)} 
                  style={S.input} 
                  placeholder="At least 6 characters" 
                />
              </div>
            )}

            {!resetSuccessNotice && (
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setResetTarget(null)} style={S.btn("#1e2130", "#94a3b8")}>Cancel</button>
                <button onClick={handleResetPassword} style={S.btn("#6366f1", "#fff")}>Save Password</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remove User Modal */}
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
