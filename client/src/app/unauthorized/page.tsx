'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { S } from '@/styles/theme';

export default function AccessDenied() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: '#0a0b10',
      color: '#e2e8f0',
      fontFamily: "'Inter','Segoe UI',sans-serif",
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        ...S.card,
        width: '100%',
        maxWidth: '440px',
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        background: 'rgba(19, 21, 31, 0.8)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚫</div>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '12px' }}>
          Access Denied
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '32px' }}>
          You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => router.push('/')}
            style={S.btn('#1e2130', '#f1f5f9', {
              border: '1px solid #2d3142',
              padding: '10px 20px',
              width: '140px'
            })}
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={handleLogout}
            style={S.btn('#ef4444', '#ffffff', {
              padding: '10px 20px',
              width: '140px'
            })}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
