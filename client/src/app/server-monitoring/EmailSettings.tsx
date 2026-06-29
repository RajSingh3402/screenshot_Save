import React, { useState, useEffect } from 'react';
import { S } from '../../styles/theme';

interface EmailSettingsProps {
  onBack: () => void;
  userRole?: string;
}

export function EmailSettings({ onBack, userRole }: EmailSettingsProps) {
  const isReadOnly = userRole?.toLowerCase() === 'viewer';
  const [recipients, setRecipients] = useState<any[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchRecipients() {
    setLoading(true);
    try {
      const res = await fetch('/api/server-monitoring/email-settings');
      if (res.ok) {
        const data = await res.json();
        setRecipients(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to fetch alert email recipients.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching recipients.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecipients();
  }, []);

  async function handleAddRecipient(e: React.FormEvent) {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/server-monitoring/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Email recipient added successfully!');
        setEmailInput('');
        fetchRecipients();
      } else {
        setError(data.error || 'Failed to add recipient.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error adding recipient.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRecipient(id: number) {
    if (isReadOnly) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/server-monitoring/email-settings?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuccess('Recipient deleted successfully.');
        fetchRecipients();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete recipient.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error deleting recipient.');
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 page-container" style={{ width: "100%", maxWidth: 600 }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={onBack} style={S.btn("#1e2130", "#94a3b8", { padding: "6px 12px" })}>← Back to Dashboard</button>
      </div>

      <div style={{ ...S.card, padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>Email Alert Recipients</h2>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
          Manage email recipients who receive a single warning notification whenever server disk usage matches or exceeds <strong>80%</strong>.
        </p>

        {error && (
          <div style={{ background: "#450a0a", border: "1px solid #fca5a5", color: "#fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 18 }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ background: "#14532d", border: "1px solid #86efac", color: "#86efac", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 18 }}>
            ✓ {success}
          </div>
        )}

        {!isReadOnly && (
          <form onSubmit={handleAddRecipient} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input 
              type="email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              style={{ ...S.input, flex: 1 }}
              placeholder="e.g. administrator@company.com"
              required
              disabled={saving}
            />
            <button 
              type="submit"
              disabled={saving || !emailInput.trim()}
              style={S.btn("#6366f1", "#fff", { opacity: (saving || !emailInput.trim()) ? 0.6 : 1, whiteSpace: "nowrap" })}
            >
              {saving ? "Adding..." : "+ Add Email"}
            </button>
          </form>
        )}

        <div style={{ borderTop: "1px solid #1e2130", paddingTop: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 12 }}>Configured Recipients</h3>
          
          {loading ? (
            <div style={{ color: "#64748b", fontSize: 13, padding: "10px 0" }}>Loading recipients...</div>
          ) : recipients.length === 0 ? (
            <div style={{ color: "#64748b", fontSize: 13, padding: "10px 0" }}>No email recipients configured. Warning alerts will only trigger logs.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recipients.map(r => (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#0f1117", borderRadius: 8, border: "1px solid #1e2130" }}>
                  <span style={{ fontSize: 13, color: "#f1f5f9" }}>{r.email}</span>
                  {!isReadOnly && (
                    <button 
                      onClick={() => handleDeleteRecipient(r.id)}
                      style={{ background: "transparent", border: "none", color: "#fca5a5", fontSize: 13, cursor: "pointer", padding: "2px 6px" }}
                      title="Remove recipient"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ ...S.card, padding: 20, background: "rgba(99, 102, 241, 0.03)", borderColor: "rgba(99, 102, 241, 0.15)" }}>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>ℹ️ Nodemailer SMTP Config</h4>
        <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>
          This warning alert system automatically reuses the global SMTP Settings configured under the main <strong>Settings</strong> panel. Make sure SMTP credentials are set up there so alerts can deliver.
        </p>
      </div>
    </div>
  );
}
