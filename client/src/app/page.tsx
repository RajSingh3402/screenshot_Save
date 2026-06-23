'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/features/dashboard/components/Dashboard';
import { WebsiteManagement } from '@/features/websites/components/WebsiteManagement';
import { Reports } from '@/features/reports/components/Reports';
import { MetricsReport } from '@/features/metrics/components/MetricsReport';
import { ExcelImport } from '@/features/excel/components/ExcelImport';
import { UserManagement } from '@/features/users/components/UserManagement';
import { SettingsManagement } from '@/features/settings/components/SettingsManagement';
import { S } from '@/styles/theme';

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sites, setSites] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Modal Screenshot State
  const [screenshotModal, setScreenshotModal] = useState({ show: false, title: "", file: "" });

  // Progress Logging State
  const [progress, setProgress] = useState({ active: false, status: "Idle", current: 0, total: 0 });

  const fetchSites = () => fetch('/api/websites')
    .then(r => r.ok ? r.json() : [])
    .then(data => setSites(Array.isArray(data) ? data : []))
    .catch(err => {
      console.error("Error fetching websites:", err);
      setSites([]);
    });

  const fetchReports = () => fetch('/api/reports')
    .then(r => r.ok ? r.json() : [])
    .then(data => setReports(Array.isArray(data) ? data : []))
    .catch(err => {
      console.error("Error fetching reports:", err);
      setReports([]);
    });

  // Verify auth session on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => {
        if (r.ok) return r.json();
        throw new Error('Unauthorized');
      })
      .then(data => {
        setCurrentUser(data.user);
        setSessionLoading(false);
      })
      .catch(() => {
        // Let Next.js middleware handle redirects, but redirect as fallback
        window.location.href = '/login';
      });

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
    try {
      const res = await fetch('/api/capture-now', { method: 'POST' });
      if (res.ok) {
        setProgress({ active: true, status: "Triggering capture run...", current: 0, total: 0 });
        pollCaptureProgress();
      } else if (res.status === 403) {
        alert("Access Denied: Only Editors and Admins can trigger capture.");
      } else {
        alert("A capture is already running.");
      }
    } catch (e) {
      alert("Failed to communicate with capture server.");
    }
  }

  async function handleLogout() {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/login';
      }
    } catch (e) {
      console.error("Error logging out:", e);
    }
  }

  function openScreenshot(title: string, file: string) {
    setScreenshotModal({ show: true, title, file });
  }

  // Authorization access checks helper (RBAC)
  const hasAccess = (tab: string) => {
    if (!currentUser) return false;
    const role = currentUser.role.toLowerCase();
    if (role === 'viewer') {
      return ['dashboard', 'websites', 'reports', 'metrics'].includes(tab);
    }
    if (role === 'editor') {
      return ['dashboard', 'websites', 'reports', 'metrics', 'excel'].includes(tab);
    }
    return true; // Admin has full access
  };

  const pages: Record<string, React.ReactNode> = {
    dashboard: <Dashboard sites={sites} reports={reports} triggerCapture={triggerCapture} openScreenshot={openScreenshot} />,
    websites: <WebsiteManagement sites={sites} refreshSites={fetchSites} triggerCapture={triggerCapture} openScreenshot={openScreenshot} />,
    reports: <Reports reports={reports} openScreenshot={openScreenshot} user={currentUser} refreshReports={fetchReports} />,
    metrics: <MetricsReport openScreenshot={openScreenshot} user={currentUser} />,
    excel: <ExcelImport refreshSites={fetchSites} />,
    users: <UserManagement />,
    settings: <SettingsManagement />,
  };


  if (sessionLoading) {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#0f1117", alignItems: "center", justifyContent: "center", color: "#64748b", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 12 }} className="pulse">📡</div>
          <div style={{ fontSize: 13, letterSpacing: "0.05em" }}>Verifying Secure Session...</div>
        </div>
      </div>
    );
  }

  const isAllowed = hasAccess(page);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f1117", color: "#e2e8f0", fontFamily: "'Inter','Segoe UI',sans-serif", overflow: "hidden" }}>
      <Sidebar page={page} setPage={setPage} user={currentUser} onLogout={handleLogout} />

      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {isAllowed ? (
          pages[page] || pages.dashboard
        ) : (
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", background: "#0f1117", padding: "40px" }}>
            <div style={{ ...S.card, padding: 36, width: 440, textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.2)", background: "rgba(19, 21, 31, 0.85)" }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>🚫</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 10 }}>Access Denied</h2>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: "1.6" }}>
                Your current account role (<strong>{currentUser.role}</strong>) does not have permission to view the "{page.charAt(0).toUpperCase() + page.slice(1)}" panel.
              </p>
            </div>
          </div>
        )}
      </main>

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
              onError={(e: any) => {
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
