import React, { useState } from 'react';
import { S } from '../../styles/theme';

interface AddServerProps {
  onBack: () => void;
  onSave: (server: {
    name: string;
    host: string;
    port: string;
    username: string;
    privateKeyPath: string;
    passphrase?: string;
  }) => Promise<void>;
  isSaving: boolean;
}

export function AddServer({ onBack, onSave, isSaving }: AddServerProps) {
  const [form, setForm] = useState({
    name: '',
    host: '',
    port: '22',
    username: 'root',
    privateKeyPath: '',
    passphrase: '',
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [error, setError] = useState('');

  async function handleTestConnection() {
    if (!form.host || !form.username || !form.privateKeyPath) {
      setError('Please fill in Host, Username, and Private Key Path to test connection.');
      return;
    }
    setError('');
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/server-monitoring/servers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: form.host,
          port: form.port,
          username: form.username,
          privateKeyPath: form.privateKeyPath,
          passphrase: form.passphrase,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({ success: true, message: data.message });
      } else {
        setTestResult({ success: false, error: data.error || 'Connection failed.' });
      }
    } catch (err: any) {
      setTestResult({ success: false, error: err.message || 'Network error.' });
    } finally {
      setTesting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.host || !form.username || !form.privateKeyPath) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');

    try {
      await onSave(form);
    } catch (err: any) {
      setError(err.message || 'Failed to save server.');
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 page-container" style={{ width: "100%", maxWidth: 600 }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={onBack} style={S.btn("#1e2130", "#94a3b8", { padding: "6px 12px" })}>← Back to Dashboard</button>
      </div>

      <div style={{ ...S.card, padding: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>Add External Linux Server</h2>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Configure SSH connection parameters to monitor disk capacity.</p>

        {error && (
          <div style={{ background: "#450a0a", border: "1px solid #fca5a5", color: "#fca5a5", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 18 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>Server Display Name</label>
            <input 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              style={S.input} 
              placeholder="e.g. AWS Production VM" 
              required
            />
          </div>

          <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
            <div style={{ flex: 3 }}>
              <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>Host / IP Address</label>
              <input 
                value={form.host} 
                onChange={e => setForm({ ...form, host: e.target.value })} 
                style={S.input} 
                placeholder="e.g. 192.168.1.100 or ec2-xx-xx-xx.compute-1.amazonaws.com" 
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>SSH Port</label>
              <input 
                value={form.port} 
                onChange={e => setForm({ ...form, port: e.target.value })} 
                style={S.input} 
                placeholder="22" 
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>SSH Username</label>
            <input 
              value={form.username} 
              onChange={e => setForm({ ...form, username: e.target.value })} 
              style={S.input} 
              placeholder="root or ubuntu" 
              required
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>SSH Private Key File Path (on hosting server)</label>
            <input 
              value={form.privateKeyPath} 
              onChange={e => setForm({ ...form, privateKeyPath: e.target.value })} 
              style={S.input} 
              placeholder="e.g. C:/keys/my-server.pem or /home/sitewatch/.ssh/id_rsa" 
              required
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 5 }}>Passphrase (Optional)</label>
            <input 
              type="password"
              value={form.passphrase} 
              onChange={e => setForm({ ...form, passphrase: e.target.value })} 
              style={S.input} 
              placeholder="Enter SSH key passphrase" 
            />
          </div>

          {testResult && (
            <div style={{ 
              background: testResult.success ? "#14532d" : "#450a0a", 
              border: `1px solid ${testResult.success ? "#86efac" : "#fca5a5"}`, 
              color: testResult.success ? "#86efac" : "#fca5a5", 
              borderRadius: 8, 
              padding: "10px 14px", 
              fontSize: 13, 
              marginBottom: 18 
            }}>
              {testResult.success ? `✓ ${testResult.message}` : `✗ SSH connection failed: ${testResult.error}`}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginTop: 22 }}>
            <button 
              type="button"
              onClick={handleTestConnection}
              disabled={testing || isSaving}
              style={S.btn("#1e2a4a", "#818cf8", { opacity: (testing || isSaving) ? 0.6 : 1 })}
            >
              {testing ? "Testing..." : "⚡ Test Connection"}
            </button>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={onBack} style={S.btn("#1e2130", "#94a3b8")}>Cancel</button>
              <button 
                type="submit" 
                disabled={isSaving || testing}
                style={S.btn("#6366f1", "#fff", { opacity: (isSaving || testing) ? 0.6 : 1 })}
              >
                {isSaving ? "Saving..." : "Add Server"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
