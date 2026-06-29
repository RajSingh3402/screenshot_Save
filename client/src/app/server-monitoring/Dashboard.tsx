import React from 'react';
import { S, badge } from '../../styles/theme';

interface DashboardProps {
  servers: any[];
  onAddClick: () => void;
  onEditClick: (server: any) => void;
  onDeleteClick: (server: any) => void;
  onEmailSettingsClick: () => void;
  onRefreshClick: () => void;
  isRefreshing: boolean;
  userRole?: string;
}

export function Dashboard({
  servers,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onEmailSettingsClick,
  onRefreshClick,
  isRefreshing,
  userRole,
}: DashboardProps) {
  const isReadOnly = userRole?.toLowerCase() === 'viewer';
  const healthyCount = servers.filter(s => s.status === 'Healthy').length;
  const warningCount = servers.filter(s => s.status === 'Warning').length;
  const offlineCount = servers.filter(s => s.status === 'Offline').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 page-container" style={{ width: "100%" }}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Server Monitoring</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 5, marginBottom: 20 }}>
            {servers.length} external SSH servers ({healthyCount} healthy, {warningCount} warning, {offlineCount} offline)
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-start md:justify-end">
          <button onClick={onEmailSettingsClick} style={S.btn("#1e2a4a", "#818cf8")}>⚙️ Email Settings</button>
          <button 
            onClick={onRefreshClick} 
            disabled={isRefreshing}
            style={S.btn("#8b5cf6", "#fff", { opacity: isRefreshing ? 0.6 : 1, cursor: isRefreshing ? "not-allowed" : "pointer" })}
          >
            {isRefreshing ? "⏳ Refreshing..." : "🔄 Refresh Now"}
          </button>
          {!isReadOnly && (
            <button onClick={onAddClick} style={S.btn("#6366f1", "#fff")}>+ Add Server</button>
          )}
        </div>
      </div>

      {/* Servers Table */}
      <div style={{ ...S.card, overflow: "hidden" }}>
        <div className="w-full overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0f1117", borderBottom: "1px solid #1e2130" }}>
                {["Server Name", "Host/IP", "Usage", "Status", "Last Checked", "Actions"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {servers.map((s, i) => {
                const isOffline = s.status === 'Offline';
                const isWarning = s.status === 'Warning';
                const usage = s.lastUsage !== null ? Number(s.lastUsage) : null;
                
                let usageColor = "#10b981"; // green
                if (usage !== null && usage >= 80) {
                  usageColor = "#ef4444"; // red
                } else if (usage !== null && usage >= 60) {
                  usageColor = "#f59e0b"; // yellow
                }

                return (
                  <tr key={s.id} style={{ borderBottom: "1px solid #1e213060", background: i % 2 === 0 ? "transparent" : "#ffffff05" }}>
                    <td style={S.td({ fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap" })}>{s.name}</td>
                    <td style={S.td({ color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap" })}>{s.host}:{s.port}</td>
                    <td style={S.td({ whiteSpace: "nowrap" })}>
                      {usage !== null ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
                          <span style={{ fontSize: 12, color: "#f1f5f9", width: 35 }}>{usage}%</span>
                          <div style={{ flex: 1, height: 6, background: "#1e2130", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${usage}%`, background: usageColor, borderRadius: 3 }} />
                          </div>
                        </div>
                      ) : "-"}
                    </td>
                    <td style={S.td({ whiteSpace: "nowrap" })}>
                      {isOffline && badge("#450a0a", "#fca5a5", "○ Offline")}
                      {isWarning && badge("#451a03", "#fde047", "● Warning")}
                      {s.status === 'Healthy' && badge("#14532d", "#86efac", "● Healthy")}
                    </td>
                    <td style={S.td({ color: "#64748b", fontSize: 12, whiteSpace: "nowrap" })}>
                      {s.lastChecked ? new Date(s.lastChecked).toLocaleString() : "-"}
                    </td>
                    <td style={S.td({ whiteSpace: "nowrap" })}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {!isReadOnly ? (
                          <>
                            <button onClick={() => onEditClick(s)} style={S.btn("#1e2a4a", "#818cf8", { padding: "5px 10px", fontSize: 12 })}>Edit</button>
                            <button onClick={() => onDeleteClick(s)} style={S.btn("#450a0a", "#fca5a5", { padding: "5px 10px", fontSize: 12 })}>Delete</button>
                          </>
                        ) : (
                          <span style={{ fontSize: 11, color: "#64748b" }}>Read-Only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {servers.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>No monitored servers found</div>}
      </div>
    </div>
  );
}
