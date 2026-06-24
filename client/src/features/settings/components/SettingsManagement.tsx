import React, { useState, useEffect } from 'react';
import { S, badge } from '@/styles/theme';
import { SmtpConfig, EmailRecipient, Schedule, ScanExecutionLog } from '../types';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export function SettingsManagement() {
  // SMTP Config Form State
  const [smtpForm, setSmtpForm] = useState<Omit<SmtpConfig, 'id'>>({
    host: '',
    port: 587,
    username: '',
    password: '',
  });

  // Recipients State
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [newRecipientEmail, setNewRecipientEmail] = useState('');

  // Schedules State
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newScheduleTime, setNewScheduleTime] = useState('09:00');
  const [currentTime, setCurrentTime] = useState('');

  // Execution Logs State
  const [executionLogs, setExecutionLogs] = useState<ScanExecutionLog[]>([]);

  // Loading States
  const [isLoadingSmtp, setIsLoadingSmtp] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);
  
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [deletingRecipientId, setDeletingRecipientId] = useState<number | null>(null);

  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [togglingScheduleId, setTogglingScheduleId] = useState<number | null>(null);
  const [deletingScheduleId, setDeletingScheduleId] = useState<number | null>(null);

  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isClearingLogs, setIsClearingLogs] = useState(false);

  // Toast Notification System State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Push a new toast alert to the screen
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Clock Ticker Effect
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch SMTP Config, Recipients, Schedules, and Logs on Mount
  const fetchSmtpConfig = async () => {
    setIsLoadingSmtp(true);
    try {
      const res = await fetch('/api/settings/smtp');
      if (res.ok) {
        const data = await res.json();
        if (data && data.host) {
          setSmtpForm({
            host: data.host,
            port: data.port,
            username: data.username,
            password: data.password || '',
          });
        }
      } else {
        showToast('Failed to load SMTP settings.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error loading SMTP configuration.', 'error');
    } finally {
      setIsLoadingSmtp(false);
    }
  };

  const fetchRecipients = async () => {
    setIsLoadingRecipients(true);
    try {
      const res = await fetch('/api/settings/recipients');
      if (res.ok) {
        const data = await res.json();
        setRecipients(Array.isArray(data) ? data : []);
      } else {
        showToast('Failed to load recipients.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error loading recipients.', 'error');
    } finally {
      setIsLoadingRecipients(false);
    }
  };

  const fetchSchedules = async () => {
    setIsLoadingSchedules(true);
    try {
      const res = await fetch('/api/settings/schedules');
      if (res.ok) {
        const data = await res.json();
        setSchedules(Array.isArray(data) ? data : []);
      } else {
        showToast('Failed to load scan schedules.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error loading background schedules.', 'error');
    } finally {
      setIsLoadingSchedules(false);
    }
  };

  const fetchExecutionLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/settings/execution-logs');
      if (res.ok) {
        const data = await res.json();
        setExecutionLogs(Array.isArray(data) ? data : []);
      } else {
        showToast('Failed to load execution logs.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error loading execution logs.', 'error');
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchSmtpConfig();
    fetchRecipients();
    fetchSchedules();
    fetchExecutionLogs();

    // Auto-poll execution logs every 10 seconds to show dynamic status changes during background scans
    const logsPollTimer = setInterval(() => {
      fetchExecutionLogs();
    }, 10000);

    return () => clearInterval(logsPollTimer);
  }, []);

  // Save SMTP Settings
  const handleSmtpSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smtpForm.host || !smtpForm.port || !smtpForm.username || !smtpForm.password) {
      showToast('Please fill out all SMTP fields.', 'error');
      return;
    }

    setIsSavingSmtp(true);
    try {
      const res = await fetch('/api/settings/smtp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpForm),
      });

      if (res.ok) {
        showToast('SMTP Configuration saved successfully!', 'success');
        fetchSmtpConfig();
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Failed to save SMTP configuration.', 'error');
      }
    } catch (err) {
      showToast('Error saving SMTP settings.', 'error');
    } finally {
      setIsSavingSmtp(false);
    }
  };

  // Test SMTP Connection
  const handleSmtpTest = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!smtpForm.host || !smtpForm.port || !smtpForm.username || !smtpForm.password) {
      showToast('Please fill out all SMTP fields to test connection.', 'error');
      return;
    }

    setIsTestingConnection(true);
    showToast('Testing SMTP connection...', 'info');

    try {
      const res = await fetch('/api/settings/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpForm),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'SMTP Connection established successfully!', 'success');
      } else {
        showToast(data.error || 'SMTP Connection test failed.', 'error');
      }
    } catch (err) {
      showToast('Failed to communicate with test SMTP API.', 'error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Add Email Recipient
  const handleAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToValidate = newRecipientEmail.trim().toLowerCase();
    
    if (!emailToValidate) {
      showToast('Please enter an email address.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToValidate)) {
      showToast('Please enter a valid email address format.', 'error');
      return;
    }

    if (recipients.some(r => r.email === emailToValidate)) {
      showToast('This email is already in the recipient list.', 'error');
      return;
    }

    setIsAddingRecipient(true);
    try {
      const res = await fetch('/api/settings/recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToValidate }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Recipient added successfully!', 'success');
        setNewRecipientEmail('');
        fetchRecipients();
      } else {
        showToast(data.error || 'Failed to add recipient.', 'error');
      }
    } catch (err) {
      showToast('Error adding recipient.', 'error');
    } finally {
      setIsAddingRecipient(false);
    }
  };

  // Delete Email Recipient
  const handleDeleteRecipient = async (id: number, email: string) => {
    setDeletingRecipientId(id);
    try {
      const res = await fetch(`/api/settings/recipients/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast(`Removed recipient ${email}.`, 'success');
        setRecipients(prev => prev.filter(r => r.id !== id));
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to remove recipient.', 'error');
      }
    } catch (err) {
      showToast('Error deleting recipient.', 'error');
    } finally {
      setDeletingRecipientId(null);
    }
  };

  // Add Schedule
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleTime) return;

    if (!/^\d{2}:\d{2}$/.test(newScheduleTime)) {
      showToast('Invalid schedule time format.', 'error');
      return;
    }

    if (schedules.some(s => s.time === newScheduleTime)) {
      showToast('This scan schedule time already exists.', 'error');
      return;
    }

    setIsAddingSchedule(true);
    try {
      const res = await fetch('/api/settings/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: newScheduleTime }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Schedule time added successfully!', 'success');
        fetchSchedules();
      } else {
        showToast(data.error || 'Failed to add schedule time.', 'error');
      }
    } catch (err) {
      showToast('Error adding schedule.', 'error');
    } finally {
      setIsAddingSchedule(false);
    }
  };

  // Toggle Schedule Status
  const handleToggleSchedule = async (id: number, currentEnabled: boolean) => {
    setTogglingScheduleId(id);
    const nextEnabled = !currentEnabled;

    try {
      const res = await fetch(`/api/settings/schedules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextEnabled }),
      });

      if (res.ok) {
        showToast(nextEnabled ? 'Schedule enabled.' : 'Schedule disabled.', 'success');
        setSchedules(prev => prev.map(s => s.id === id ? { ...s, enabled: nextEnabled } : s));
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to update schedule status.', 'error');
      }
    } catch (err) {
      showToast('Error toggling schedule.', 'error');
    } finally {
      setTogglingScheduleId(null);
    }
  };

  // Delete Schedule
  const handleDeleteSchedule = async (id: number, timeStr: string) => {
    setDeletingScheduleId(id);
    try {
      const res = await fetch(`/api/settings/schedules/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast(`Deleted scan schedule for ${timeStr}.`, 'success');
        setSchedules(prev => prev.filter(s => s.id !== id));
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete schedule.', 'error');
      }
    } catch (err) {
      showToast('Error deleting schedule.', 'error');
    } finally {
      setDeletingScheduleId(null);
    }
  };

  // Clear All Logs
  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all background execution logs?')) return;
    setIsClearingLogs(true);
    try {
      const res = await fetch('/api/settings/execution-logs', { method: 'DELETE' });
      if (res.ok) {
        showToast('Execution logs cleared.', 'success');
        setExecutionLogs([]);
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to clear execution logs.', 'error');
      }
    } catch (err) {
      showToast('Error clearing logs.', 'error');
    } finally {
      setIsClearingLogs(false);
    }
  };

  // Extract metadata summaries for display
  const latestLog = executionLogs.length > 0 ? executionLogs.find(l => l.status !== 'in_progress') : null;
  const lastExecTimeStr = latestLog 
    ? new Date(latestLog.executedAt).toLocaleDateString([], { month: 'short', day: '2-digit' }) + ' ' +
      new Date(latestLog.executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Never';
  const lastExecStatus = latestLog ? latestLog.status : 'None';

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000, position: 'relative', display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Toast Notification Container */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 350 }}>
        {toasts.map(t => (
          <div 
            key={t.id} 
            onClick={() => removeToast(t.id)}
            style={{
              padding: '12px 18px',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              animation: 'slide-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              background: 
                t.type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' :
                t.type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: `1px solid ${
                t.type === 'success' ? '#34d399' :
                t.type === 'error' ? '#f87171' :
                '#60a5fa'
              }40`,
            }}
          >
            <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'} {t.message}</span>
            <span style={{ fontSize: 10, opacity: 0.7 }}>✕</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Alert Settings</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          Configure SMTP authentication settings, manage alert recipients, and establish automatic screenshot scan frequencies.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        
        {/* Left Column: SMTP & Status Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* SMTP Card */}
          <div style={{ ...S.card, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📧</span> SMTP Configuration
                </h2>
                {isLoadingSmtp && (
                  <span style={{ fontSize: 11, color: '#64748b' }} className="pulse">Loading...</span>
                )}
              </div>

              <form onSubmit={handleSmtpSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 5 }}>SMTP Host</label>
                  <input 
                    value={smtpForm.host} 
                    onChange={e => setSmtpForm({ ...smtpForm, host: e.target.value })} 
                    style={S.input} 
                    placeholder="e.g. smtp.gmail.com"
                    disabled={isSavingSmtp || isTestingConnection}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 5 }}>SMTP Port</label>
                  <input 
                    type="number"
                    value={smtpForm.port} 
                    onChange={e => setSmtpForm({ ...smtpForm, port: parseInt(e.target.value, 10) || 587 })} 
                    style={S.input} 
                    placeholder="e.g. 587 or 465"
                    disabled={isSavingSmtp || isTestingConnection}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 5 }}>Username / Email</label>
                  <input 
                    value={smtpForm.username} 
                    onChange={e => setSmtpForm({ ...smtpForm, username: e.target.value })} 
                    style={S.input} 
                    placeholder="e.g. username@gmail.com"
                    disabled={isSavingSmtp || isTestingConnection}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 5 }}>Password</label>
                  <input 
                    type="password"
                    value={smtpForm.password} 
                    onChange={e => setSmtpForm({ ...smtpForm, password: e.target.value })} 
                    style={S.input} 
                    placeholder="••••••••••••"
                    disabled={isSavingSmtp || isTestingConnection}
                  />
                </div>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button 
                type="button" 
                onClick={handleSmtpTest}
                disabled={isTestingConnection || isSavingSmtp}
                style={S.btn('#1e2130', '#818cf8', { 
                  flex: 1, 
                  border: '1px solid #818cf850',
                  cursor: (isTestingConnection || isSavingSmtp) ? 'not-allowed' : 'pointer',
                  opacity: (isTestingConnection || isSavingSmtp) ? 0.6 : 1,
                  padding: '10px 16px'
                })}
              >
                {isTestingConnection ? '🔄 Testing...' : '⚡ Test Connection'}
              </button>
              <button 
                type="button" 
                onClick={handleSmtpSave}
                disabled={isSavingSmtp || isTestingConnection}
                style={S.btn('#6366f1', '#ffffff', { 
                  flex: 1,
                  cursor: (isSavingSmtp || isTestingConnection) ? 'not-allowed' : 'pointer',
                  opacity: (isSavingSmtp || isTestingConnection) ? 0.6 : 1,
                  padding: '10px 16px'
                })}
              >
                {isSavingSmtp ? '💾 Saving...' : '💾 Save SMTP Config'}
              </button>
            </div>
          </div>

          {/* Quick Metrics Card */}
          <div style={{ ...S.card, padding: 20, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Last Execution</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{lastExecTimeStr}</div>
            </div>
            <div style={{ width: 1, height: 40, background: '#1e2130' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Email Status</div>
              <div>
                {lastExecStatus === 'success' && badge('#14532d', '#86efac', '● Active')}
                {lastExecStatus === 'failed' && badge('#450a0a', '#fca5a5', '✗ Failed')}
                {lastExecStatus === 'None' && badge('#1e2130', '#64748b', 'No Run')}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Recipients + Background Scan Schedules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Email Recipients Card */}
          <div style={{ ...S.card, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>👥</span> Email Recipients
              </h2>
              {isLoadingRecipients && (
                <span style={{ fontSize: 11, color: '#64748b' }} className="pulse">Loading...</span>
              )}
            </div>

            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
              These addresses will be notified via email when reports are generated or alert failures occur.
            </p>

            <form onSubmit={handleAddRecipient} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input 
                type="email" 
                value={newRecipientEmail} 
                onChange={e => setNewRecipientEmail(e.target.value)} 
                placeholder="e.g. admin@company.com" 
                style={{ ...S.input, flex: 1 }} 
                disabled={isAddingRecipient}
              />
              <button 
                type="submit" 
                disabled={isAddingRecipient}
                style={S.btn('#8b5cf6', '#ffffff', {
                  cursor: isAddingRecipient ? 'not-allowed' : 'pointer',
                  opacity: isAddingRecipient ? 0.6 : 1,
                })}
              >
                {isAddingRecipient ? 'Adding...' : 'Add'}
              </button>
            </form>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8, 
              maxHeight: 180, 
              overflowY: 'auto',
              paddingRight: 4
            }}>
              {recipients.map(r => (
                <div 
                  key={r.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: '#0f1117', 
                    borderRadius: 8, 
                    padding: '10px 14px', 
                    border: '1px solid #1e213060',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{r.email}</span>
                    <span style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                      Added on {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteRecipient(r.id, r.email)} 
                    disabled={deletingRecipientId === r.id}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: '#ef4444', 
                      fontSize: 14, 
                      cursor: deletingRecipientId === r.id ? 'not-allowed' : 'pointer', 
                      padding: '4px 8px',
                    }}
                    title="Remove Recipient"
                  >
                    {deletingRecipientId === r.id ? '🔄' : '🗑️'}
                  </button>
                </div>
              ))}

              {recipients.length === 0 && !isLoadingRecipients && (
                <div style={{ 
                  fontSize: 12, 
                  color: '#64748b', 
                  textAlign: 'center', 
                  padding: '30px 10px',
                  border: '1px dashed #1e2130',
                  borderRadius: 8
                }}>
                  No email recipients configured yet.
                </div>
              )}
            </div>
          </div>

          {/* Background Scan Schedules Card */}
          <div style={{ ...S.card, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⏰</span> Background Scan Schedules
              </h2>
              {isLoadingSchedules && (
                <span style={{ fontSize: 11, color: '#64748b' }} className="pulse">Loading...</span>
              )}
            </div>

            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
              Define times of day (local server time) when automated captures will trigger.
            </p>
            
            {currentTime && (
              <p style={{ fontSize: 12, color: '#818cf8', marginBottom: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>🕒</span> Current Time: {currentTime}
              </p>
            )}

            <form onSubmit={handleAddSchedule} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
              <input 
                type="time" 
                value={newScheduleTime} 
                onChange={e => setNewScheduleTime(e.target.value)} 
                style={{ ...S.input, width: 130 }} 
                disabled={isAddingSchedule}
              />
              <button 
                type="submit" 
                disabled={isAddingSchedule}
                style={S.btn('#8b5cf6', '#ffffff', {
                  cursor: isAddingSchedule ? 'not-allowed' : 'pointer',
                  opacity: isAddingSchedule ? 0.6 : 1,
                })}
              >
                {isAddingSchedule ? 'Adding...' : 'Add Time'}
              </button>
            </form>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 8, 
              maxHeight: 180, 
              overflowY: 'auto',
              paddingRight: 4
            }}>
              {schedules.map(s => (
                <div 
                  key={s.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: '#0f1117', 
                    borderRadius: 8, 
                    padding: '10px 14px', 
                    border: '1px solid #1e213060',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input 
                      type="checkbox" 
                      checked={s.enabled} 
                      disabled={togglingScheduleId === s.id}
                      onChange={() => handleToggleSchedule(s.id, s.enabled)} 
                      style={{ width: 15, height: 15, cursor: togglingScheduleId === s.id ? 'not-allowed' : 'pointer' }} 
                    />
                    <span style={{ fontSize: 14, fontWeight: 600, color: s.enabled ? '#f1f5f9' : '#64748b' }}>
                      {(() => {
                        if (!s.time) return '';
                        const [h, m] = s.time.split(':');
                        const hour = parseInt(h, 10);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const displayHour = hour % 12 || 12;
                        return `${displayHour.toString().padStart(2, '0')}:${m} ${ampm} (${s.time})`;
                      })()}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteSchedule(s.id, s.time)} 
                    disabled={deletingScheduleId === s.id}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: '#ef4444', 
                      fontSize: 14, 
                      cursor: deletingScheduleId === s.id ? 'not-allowed' : 'pointer', 
                      padding: '4px 8px',
                    }}
                    title="Delete Schedule"
                  >
                    {deletingScheduleId === s.id ? '🔄' : '✕'}
                  </button>
                </div>
              ))}

              {schedules.length === 0 && !isLoadingSchedules && (
                <div style={{ 
                  fontSize: 12, 
                  color: '#64748b', 
                  textAlign: 'center', 
                  padding: '30px 10px',
                  border: '1px dashed #1e2130',
                  borderRadius: 8
                }}>
                  No automated background schedules configured.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Full Width Bottom Card: Automated Scan Execution Logs */}
      <div style={{ ...S.card, padding: 24, marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📋</span> Automated Scan Execution Logs
          </h2>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {isLoadingLogs && (
              <span style={{ fontSize: 11, color: '#64748b' }} className="pulse">Polling...</span>
            )}
            <button 
              onClick={handleClearLogs}
              disabled={isClearingLogs || executionLogs.length === 0}
              style={S.btn('#450a0a', '#fca5a5', { 
                padding: '6px 12px', 
                fontSize: 12,
                cursor: (isClearingLogs || executionLogs.length === 0) ? 'not-allowed' : 'pointer',
                opacity: (isClearingLogs || executionLogs.length === 0) ? 0.6 : 1,
              })}
            >
              🗑️ Clear Logs
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f1117', borderBottom: '1px solid #1e2130' }}>
                <th style={{ ...S.th, width: '25%' }}>Execution Time</th>
                <th style={{ ...S.th, width: '15%' }}>Schedule</th>
                <th style={{ ...S.th, width: '15%' }}>Status</th>
                <th style={{ ...S.th, width: '45%' }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {executionLogs.map((log, i) => (
                <tr 
                  key={log.id} 
                  style={{ 
                    borderBottom: '1px solid #1e213060', 
                    background: i % 2 === 0 ? 'transparent' : '#ffffff02',
                    transition: 'background 0.2s',
                  }}
                >
                  <td style={S.td({ color: '#94a3b8' })}>
                    {new Date(log.executedAt).toLocaleString()}
                  </td>
                  <td style={S.td({ fontWeight: 600, color: '#e2e8f0' })}>
                    {log.scheduleTime}
                  </td>
                  <td style={S.td()}>
                    {log.status === 'success' && badge('#14532d', '#86efac', 'Success')}
                    {log.status === 'failed' && badge('#450a0a', '#fca5a5', 'Failed')}
                    {log.status === 'in_progress' && badge('#1e3a8a', '#93c5fd', 'In Progress')}
                  </td>
                  <td style={S.td({ color: log.status === 'failed' ? '#fca5a5' : '#cbd5e1', fontSize: 12 })}>
                    {log.message}
                  </td>
                </tr>
              ))}

              {executionLogs.length === 0 && !isLoadingLogs && (
                <tr>
                  <td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
                    No automated check runs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%) translateY(0);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
        }
        .pulse {
          animation: pulse-animation 1.5s infinite ease-in-out;
        }
        @keyframes pulse-animation {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>

    </div>
  );
}
