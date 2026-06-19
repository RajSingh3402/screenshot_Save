import React from 'react';

interface SidebarProps {
  page: string;
  setPage: (page: string) => void;
  user: {
    name: string;
    email: string;
    role: string;
    status: string;
  } | null;
  onLogout: () => void;
}

export function Sidebar({ page, setPage, user, onLogout }: SidebarProps) {
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "⬛" },
    { id: "websites", label: "Websites", icon: "🌐" },
    { id: "reports", label: "Reports", icon: "📄" },
    { id: "metrics", label: "Metrics Report", icon: "📈" },
    { id: "excel", label: "Excel Import", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  // Filter navigation depending on user's role (RBAC)
  const allowedNav = nav.filter(item => {
    if (!user) return false;
    const role = user.role.toLowerCase();
    if (role === 'viewer') {
      return ['dashboard', 'websites', 'reports', 'metrics'].includes(item.id);
    }
    if (role === 'editor') {
      return ['dashboard', 'websites', 'reports', 'metrics', 'excel'].includes(item.id);
    }
    return true; // Admin has full access
  });

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

      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {allowedNav.map(n => {
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

      {/* User Session and Sign Out Section */}
      <div style={{ padding: "16px 14px", borderTop: "1px solid #1e2130" }}>
        {user && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                textTransform: "uppercase"
              }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 10, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>
                  {user.email}
                </div>
                <span style={{
                  fontSize: 9,
                  padding: "1px 6px",
                  borderRadius: 4,
                  background: user.role.toLowerCase() === 'admin' ? '#4f46e533' : user.role.toLowerCase() === 'editor' ? '#0284c733' : '#4b556333',
                  color: user.role.toLowerCase() === 'admin' ? '#a5b4fc' : user.role.toLowerCase() === 'editor' ? '#7dd3fc' : '#d1d5db',
                  fontWeight: 600
                }}>
                  {user.role}
                </span>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "8px",
                borderRadius: 6,
                border: "1px solid #312e81",
                background: "rgba(99, 102, 241, 0.05)",
                color: "#a5b4fc",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e: any) => {
                e.target.style.background = "#ef444415";
                e.target.style.borderColor = "#ef444444";
                e.target.style.color = "#f87171";
              }}
              onMouseLeave={(e: any) => {
                e.target.style.background = "rgba(99, 102, 241, 0.05)";
                e.target.style.borderColor = "#312e81";
                e.target.style.color = "#a5b4fc";
              }}
            >
              🚪 Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
