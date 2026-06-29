import React, { useState, useEffect } from 'react';
import { Dashboard } from './Dashboard';
import { AddServer } from './AddServer';
import { EditServer } from './EditServer';
import { EmailSettings } from './EmailSettings';
import { S } from '../../styles/theme';

export function ServerMonitoring() {
  const [view, setView] = useState<'dashboard' | 'add' | 'edit' | 'email-settings'>('dashboard');
  const [servers, setServers] = useState<any[]>([]);
  const [activeServer, setActiveServer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  // Fetch current user and role
  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Error fetching user context:', err);
    }
  }

  // Fetch servers from API
  async function fetchServers() {
    setLoading(true);
    try {
      const res = await fetch('/api/server-monitoring/servers');
      if (res.ok) {
        const data = await res.json();
        setServers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching servers:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchServers();
  }, []);

  // Trigger manual capacity scan
  async function handleRefreshNow() {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/server-monitoring/scan', { method: 'POST' });
      if (res.ok) {
        await fetchServers();
      } else {
        const data = await res.json();
        alert(`Failed to scan: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      alert(`Network error during refresh: ${err.message}`);
    } finally {
      setIsRefreshing(false);
    }
  }

  // Create new server
  async function handleCreateServer(form: any) {
    setIsSaving(true);
    try {
      const res = await fetch('/api/server-monitoring/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setView('dashboard');
        fetchServers();
      } else {
        throw new Error(data.error || 'Failed to save server.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  // Edit existing server
  async function handleEditServer(form: any) {
    setIsSaving(true);
    try {
      const res = await fetch('/api/server-monitoring/servers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setView('dashboard');
        fetchServers();
      } else {
        throw new Error(data.error || 'Failed to update server.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  // Delete server confirmed
  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/server-monitoring/servers?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteTarget(null);
        fetchServers();
      } else {
        const data = await res.json();
        alert(`Failed to delete: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", minHeight: 300, color: "#64748b" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>🖥️</div>
          <div>Loading external servers...</div>
        </div>
      </div>
    );
  }

  const userRole = currentUser?.role;

  return (
    <div style={{ width: "100%" }}>
      {view === 'dashboard' && (
        <Dashboard
          servers={servers}
          onAddClick={() => setView('add')}
          onEditClick={(s) => {
            setActiveServer(s);
            setView('edit');
          }}
          onDeleteClick={(s) => setDeleteTarget(s)}
          onEmailSettingsClick={() => setView('email-settings')}
          onRefreshClick={handleRefreshNow}
          isRefreshing={isRefreshing}
          userRole={userRole}
        />
      )}

      {view === 'add' && (
        <AddServer
          onBack={() => setView('dashboard')}
          onSave={handleCreateServer}
          isSaving={isSaving}
        />
      )}

      {view === 'edit' && activeServer && (
        <EditServer
          server={activeServer}
          onBack={() => setView('dashboard')}
          onSave={handleEditServer}
          isSaving={isSaving}
        />
      )}

      {view === 'email-settings' && (
        <EmailSettings
          onBack={() => setView('dashboard')}
          userRole={userRole}
        />
      )}

      {/* Delete Server Confirmation Modal */}
      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
          <div style={{ ...S.card, padding: 28 }} className="w-full max-w-[400px] mx-4 animate-fade-in">
            <div style={{ fontSize: 32, marginBottom: 12, textAlign: "center" }}>⚠️</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 12, textAlign: "center" }}>Delete Monitored Server</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24, textAlign: "center" }}>
              Are you sure you want to stop monitoring server <strong>{deleteTarget.name}</strong>?<br />This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setDeleteTarget(null)} style={S.btn("#1e2130", "#94a3b8")}>Cancel</button>
              <button onClick={confirmDelete} style={S.btn("#450a0a", "#fca5a5")}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
