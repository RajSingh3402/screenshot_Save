import React, { useState, useEffect } from 'react';
import { S } from '@/styles/theme';

interface MetricsReportProps {
  openScreenshot: (title: string, file: string) => void;
  user?: any;
}

export function MetricsReport({ openScreenshot, user }: MetricsReportProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');
  const [filterAlert, setFilterAlert] = useState<'all' | 'ssl' | 'domain' | 'malware'>('all');

  // Tab states
  const [mainTab, setMainTab] = useState<'latest' | 'history'>('latest');
  const [subTab, setSubTab] = useState<'ssl' | 'domain' | 'malware'>('ssl');

  const isWriteAllowed = user && (user.role.toLowerCase() === 'admin' || user.role.toLowerCase() === 'editor');

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete all metrics? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch('/api/metrics', { method: 'DELETE' });
      if (res.ok) {
        alert("All metrics deleted successfully.");
        fetchMetrics();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete metrics.");
      }
    } catch (e) {
      alert("Error communicating with the server.");
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/metrics');
      if (res.ok) {
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMetrics();
  };

  // Group by websiteId to find the latest metrics for each configured site
  const latestChecksMap: Record<string, any> = {};
  // Traverse from oldest to newest so that newer overrides older
  [...history].reverse().forEach((item: any) => {
    latestChecksMap[String(item.websiteId)] = item;
  });
  const latestList = Object.values(latestChecksMap);

  // Computations for summary metrics cards
  const totalWebsites = latestList.length;
  const onlineWebsites = latestList.filter(item => item.status === 'online').length;
  const offlineWebsites = latestList.filter(item => item.status === 'offline').length;
  
  const sslAlertsCount = latestList.filter(item => item.sslWarning).length;
  const domainAlertsCount = latestList.filter(item => item.domainWarning).length;
  const malwareAlertsCount = latestList.filter(item => 
    item.safeBrowsingStatus !== 'Safe' || 
    item.malwareStatus !== 'Clean' || 
    item.phishingStatus !== 'Clean' || 
    item.blacklistStatus !== 'Clean'
  ).length;

  // Formatting date helper
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatDateOnly = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Filtered History computation
  const filteredHistory = history.filter((item: any) => {
    // Search filter
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.url.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'online' && item.status === 'online') ||
      (filterStatus === 'offline' && item.status === 'offline');

    // Alert filter
    let matchesAlert = true;
    if (filterAlert === 'ssl') {
      matchesAlert = item.sslWarning;
    } else if (filterAlert === 'domain') {
      matchesAlert = item.domainWarning;
    } else if (filterAlert === 'malware') {
      matchesAlert = 
        item.safeBrowsingStatus !== 'Safe' || 
        item.malwareStatus !== 'Clean' || 
        item.phishingStatus !== 'Clean' || 
        item.blacklistStatus !== 'Clean';
    }

    return matchesSearch && matchesStatus && matchesAlert;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#64748b', fontFamily: 'inherit' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 12 }} className="pulse">📊</div>
          <div>Loading System Metrics...</div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Websites", value: totalWebsites, color: "#6366f1", icon: "🌐" },
    { label: "Online Websites", value: onlineWebsites, color: "#10b981", icon: "🟢" },
    { label: "Offline Websites", value: offlineWebsites, color: "#ef4444", icon: "🔴" },
    { label: "SSL Alerts", value: sslAlertsCount, color: "#f59e0b", icon: "🔐" },
    { label: "Domain Alerts", value: domainAlertsCount, color: "#f59e0b", icon: "📅" },
    { label: "Malware Alerts", value: malwareAlertsCount, color: "#ef4444", icon: "🛡️" },
  ];

  return (
    <div className="mx-auto px-6 pb-6 pt-10 sm:px-8 sm:pb-8 sm:pt-12 lg:px-10 lg:pb-10 lg:pt-16 metrics-container" style={{ maxWidth: 1400, width: "100%", margin: "0 auto" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-10">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>Metrics Report Portal</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 6, marginBottom: 20 }}>
            Active checks history, certificate expiries, domain logs, and security checks summary
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center  justify-start md:justify-end">
          <button 
            onClick={handleRefresh} 
            disabled={refreshing}
            style={S.btn("linear-gradient(135deg,#6366f1,#8b5cf6)", "#fff", { 
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              opacity: refreshing ? 0.7 : 1 
            })}
          >
            {refreshing ? "🔄 Refreshing..." : "🔄 Refresh Metrics"}
          </button>
          {isWriteAllowed && (
            <button 
              onClick={handleDeleteAll} 
              style={S.btn("linear-gradient(135deg,#ef4444,#dc2626)", "#fff", { 
                boxShadow: "0 4px 12px rgba(239,68,68,0.3)" 
              })}
            >
              🗑️ Delete All Metrics
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {statCards.map(c => (
          <div key={c.label} style={{ ...S.card, padding: "16px 18px", borderTop: `3px solid ${c.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 8, fontWeight: 500 }}>{c.label}</div>
              </div>
              <div style={{ fontSize: 16 }}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap border-b border-[#1e2130] gap-2" style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #1e2130', gap: '8px', marginBottom: '24px' }}>
        <button 
          onClick={() => setMainTab('latest')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: mainTab === 'latest' ? '2px solid #6366f1' : '2px solid transparent',
            color: mainTab === 'latest' ? '#818cf8' : '#94a3b8',
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          🔐 Latest Scan Metrics
        </button>
        <button 
          onClick={() => setMainTab('history')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: mainTab === 'history' ? '2px solid #6366f1' : '2px solid transparent',
            color: mainTab === 'history' ? '#818cf8' : '#94a3b8',
            padding: '10px 16px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          📅 Metrics History Log
        </button>
      </div>

      {/* RENDER TAB content */}
      {mainTab === 'latest' ? (
        <div>
          {/* Sub-tabs for Latest Metrics */}
          <div className="flex flex-wrap gap-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {([
              { id: 'ssl', label: 'SSL Monitoring', icon: '🔐' },
              { id: 'domain', label: 'Domain Monitoring', icon: '🌐' },
              { id: 'malware', label: 'Malware Monitoring', icon: '🛡️' }
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                style={{
                  background: subTab === tab.id ? '#1e2130' : 'rgba(30, 33, 48, 0.3)',
                  border: '1px solid #1e2130',
                  borderRadius: 8,
                  color: subTab === tab.id ? '#818cf8' : '#94a3b8',
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div style={S.card} className="overflow-hidden">
            {/* SSL MONITORING */}
            {subTab === 'ssl' && (
              <div className="w-full overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: "#0f1117", borderBottom: "1px solid #1e2130" }}>
                      {["Website Name", "Website URL", "SSL Status", "Expiry Date", "Days Remaining", "SSL Alert", "Alert Email", "Email Status"].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {latestList.map((item: any, i) => {
                      const warn = item.sslWarning;
                      return (
                        <tr key={item.id} style={{ borderBottom: "1px solid #1e213060", background: i % 2 === 0 ? "transparent" : "#ffffff05" }}>
                          <td style={S.td({ color: "#f1f5f9", fontWeight: 600 })}>{item.name}</td>
                          <td style={S.td({ color: "#818cf8" })}>{item.url}</td>
                          <td style={S.td()}>
                            <span style={{
                              padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                              background: item.sslStatus === 'Valid' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: item.sslStatus === 'Valid' ? '#4ade80' : '#f87171'
                            }}>
                              {item.sslStatus}
                            </span>
                          </td>
                          <td style={S.td({ color: "#94a3b8" })}>{formatDateOnly(item.sslExpiryDate)}</td>
                          <td style={S.td({ color: warn ? "#ef4444" : "#94a3b8", fontWeight: warn ? 700 : 400 })}>
                            {item.sslDaysRemaining !== null ? `${item.sslDaysRemaining} Days` : '-'}
                          </td>
                          <td style={S.td()}>
                            <span style={{
                              padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                              background: warn ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                              color: warn ? '#f87171' : '#4ade80'
                            }}>
                              {warn ? '⚠ Alert' : '✓ Secure'}
                            </span>
                          </td>
                          <td style={S.td({ color: "#94a3b8" })}>{item.alertEmail || '-'}</td>
                          <td style={S.td({ color: "#94a3b8", fontWeight: item.emailStatus && item.emailStatus !== 'No Alert' ? 600 : 400 })}>{item.emailStatus || 'No Alert'}</td>
                        </tr>
                      );
                    })}
                    {latestList.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: 30, textAlign: 'center', color: '#64748b' }}>No website metrics found. Run a capture session to generate.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* DOMAIN MONITORING */}
            {subTab === 'domain' && (
              <div className="w-full overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: "#0f1117", borderBottom: "1px solid #1e2130" }}>
                      {["Website Name", "Website URL", "Domain Name", "Expiry Date", "Days Remaining", "Domain Alert", "Alert Email", "Email Status"].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {latestList.map((item: any, i) => {
                      const warn = item.domainWarning;
                      let domainName = item.name;
                      try {
                        domainName = item.url ? new URL(item.url).hostname.replace('www.', '') : item.name;
                      } catch (e) {}
                      return (
                        <tr key={item.id} style={{ borderBottom: "1px solid #1e213060", background: i % 2 === 0 ? "transparent" : "#ffffff05" }}>
                          <td style={S.td({ color: "#f1f5f9", fontWeight: 600 })}>{item.name}</td>
                          <td style={S.td({ color: "#818cf8" })}>{item.url}</td>
                          <td style={S.td({ color: "#94a3b8" })}>{domainName}</td>
                          <td style={S.td({ color: "#94a3b8" })}>{formatDateOnly(item.domainExpiryDate)}</td>
                          <td style={S.td({ color: warn ? "#ef4444" : "#94a3b8", fontWeight: warn ? 700 : 400 })}>
                            {item.domainDaysRemaining !== null ? `${item.domainDaysRemaining} Days` : '-'}
                          </td>
                          <td style={S.td()}>
                            <span style={{
                              padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                              background: warn ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                              color: warn ? '#f87171' : '#4ade80'
                            }}>
                              {warn ? '⚠️ ALERT' : '✓ SECURE'}
                            </span>
                          </td>
                          <td style={S.td({ color: "#94a3b8" })}>{item.alertEmail || '-'}</td>
                          <td style={S.td({ color: "#94a3b8", fontWeight: item.domainEmailStatus && item.domainEmailStatus !== 'No Alert' ? 600 : 400 })}>
                            {item.domainEmailStatus || 'No Alert'}
                          </td>
                        </tr>
                      );
                    })}
                    {latestList.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: 30, textAlign: 'center', color: '#64748b' }}>No website metrics found. Run a capture session to generate.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* MALWARE MONITORING */}
            {subTab === 'malware' && (
              <div className="w-full overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: "#0f1117", borderBottom: "1px solid #1e2130" }}>
                      {["Website Name", "Domain", "Safe Browsing", "Malware Status", "Phishing Status", "Blacklist Status"].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {latestList.map((item: any, i) => {
                      const isSafe = item.safeBrowsingStatus === 'Safe';
                      const isMalwareClean = item.malwareStatus === 'Clean';
                      const isPhishClean = item.phishingStatus === 'Clean';
                      const isBlacklistClean = item.blacklistStatus === 'Clean';
                      const domainName = item.url ? new URL(item.url).hostname.replace('www.', '') : item.name;
                      return (
                        <tr key={item.id} style={{ borderBottom: "1px solid #1e213060", background: i % 2 === 0 ? "transparent" : "#ffffff05" }}>
                          <td style={S.td({ color: "#f1f5f9", fontWeight: 600 })}>{item.name}</td>
                          <td style={S.td({ color: "#94a3b8" })}>{domainName}</td>
                          <td style={S.td()}>
                            <span style={{
                              padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                              background: isSafe ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                              color: isSafe ? '#4ade80' : '#f87171'
                            }}>
                              {item.safeBrowsingStatus}
                            </span>
                          </td>
                          <td style={S.td()}>
                            <span style={{
                              padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                              background: isMalwareClean ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                              color: isMalwareClean ? '#4ade80' : '#f87171'
                            }}>
                              {item.malwareStatus}
                            </span>
                          </td>
                          <td style={S.td()}>
                            <span style={{
                              padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                              background: isPhishClean ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                              color: isPhishClean ? '#4ade80' : '#f87171'
                            }}>
                              {item.phishingStatus}
                            </span>
                          </td>
                          <td style={S.td()}>
                            <span style={{
                              padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                              background: isBlacklistClean ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                              color: isBlacklistClean ? '#4ade80' : '#f87171'
                            }}>
                              {item.blacklistStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {latestList.length === 0 && (
                      <tr><td colSpan={6} style={{ padding: 30, textAlign: 'center', color: '#64748b' }}>No website metrics found. Run a capture session to generate.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* HISTORY TAB */
        <div>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div className="flex-1 w-full" style={{ flex: 1, minWidth: '280px' }}>
              <input
                type="text"
                placeholder="🔍 Search history by website name or URL..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={S.input}
              />
            </div>
            <div className="w-full md:w-[160px]">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                style={{ ...S.input, height: 38, cursor: 'pointer' }}
              >
                <option value="all">🌐 Status: All</option>
                <option value="online">🟢 Status: Online</option>
                <option value="offline">🔴 Status: Offline</option>
              </select>
            </div>
            <div className="w-full md:w-[180px]">
              <select
                value={filterAlert}
                onChange={e => setFilterAlert(e.target.value as any)}
                style={{ ...S.input, height: 38, cursor: 'pointer' }}
              >
                <option value="all">⚠️ Alerts: All</option>
                <option value="ssl">🔐 SSL Warnings Only</option>
                <option value="domain">📅 Domain Warnings Only</option>
                <option value="malware">🛡️ Malware Alerts Only</option>
              </select>
            </div>
          </div>

          {/* History List */}
          <div style={S.card}>
            <div className="w-full overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: "#0f1117", borderBottom: "1px solid #1e2130" }}>
                    {["Scan Timestamp", "Website Name", "Availability", "Response Time", "SSL status", "Domain days", "Malware check", ""].map(h => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item: any, i) => {
                    const hasMalwareIssue = 
                      item.safeBrowsingStatus !== 'Safe' || 
                      item.malwareStatus !== 'Clean' || 
                      item.phishingStatus !== 'Clean' || 
                      item.blacklistStatus !== 'Clean';
                    
                    return (
                      <tr key={item.id} style={{ borderBottom: "1px solid #1e213060", background: i % 2 === 0 ? "transparent" : "#ffffff05" }}>
                        <td style={S.td({ color: "#94a3b8", whiteSpace: "nowrap" })}>{formatDateTime(item.timestamp)}</td>
                        <td style={S.td({ color: "#f1f5f9", fontWeight: 600, whiteSpace: "nowrap" })}>
                          <div>{item.name}</div>
                          <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{item.url}</div>
                        </td>
                        <td style={S.td({ whiteSpace: "nowrap" })}>
                          <span style={{
                            padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                            background: item.status === 'online' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: item.status === 'online' ? '#4ade80' : '#f87171'
                          }}>
                            {item.status === 'online' ? 'Online' : 'Offline'}
                          </span>
                        </td>
                        <td style={S.td({ color: "#f1f5f9", whiteSpace: "nowrap" })}>
                          {item.responseTime !== null ? `${item.responseTime} ms` : '-'}
                        </td>
                        <td style={S.td({ whiteSpace: "nowrap" })}>
                          <span style={{
                            fontSize: 11,
                            color: item.sslWarning ? '#f59e0b' : '#10b981'
                          }}>
                            {item.sslWarning ? '⚠️ ' : '✓ '} {item.sslStatus}
                          </span>
                        </td>
                        <td style={S.td({ color: item.domainWarning ? '#ef4444' : '#94a3b8', whiteSpace: "nowrap" })}>
                          {item.domainDaysRemaining !== null ? `${item.domainDaysRemaining} days` : '-'}
                        </td>
                        <td style={S.td({ whiteSpace: "nowrap" })}>
                          <span style={{
                            padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                            background: hasMalwareIssue ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                            color: hasMalwareIssue ? '#f87171' : '#4ade80'
                          }}>
                            {hasMalwareIssue ? '🚨 ALERT' : '✓ Clean'}
                          </span>
                        </td>
                        <td style={S.td({ textAlign: 'right', whiteSpace: "nowrap" })}>
                          {item.screenshotPath ? (
                            <button 
                              onClick={() => openScreenshot(item.name, item.screenshotPath)}
                              style={{ 
                                background: "#1e2130", border: "none", color: "#818cf8", 
                                fontSize: 11, padding: "4px 8px", borderRadius: 6, cursor: "pointer" 
                              }}
                            >
                              👁️ Preview
                            </button>
                          ) : (
                            <span style={{ fontSize: 11, color: '#64748b' }}>No Screen</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ padding: 30, textAlign: 'center', color: '#64748b' }}>
                        No search/filter matches found in history logs.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
