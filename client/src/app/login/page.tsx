'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { S } from '@/styles/theme';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Unable to reach authentication server. Please try again.');
    } finally {
      setLoading(false);
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
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic Background Glows */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 1,
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '30%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 1,
        borderRadius: '50%'
      }} />

      {/* Login Card */}
      {/* 
        TO UNCOMMENT: Change `false && (` to `true && (` (or remove the wrapper) to show the login card again.
      */}
      {false && (
      <div style={{
        ...S.card,
        width: '420px',
        padding: '40px 32px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        background: 'rgba(19, 21, 31, 0.75)',
        backdropFilter: 'blur(16px)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header / Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
            marginBottom: '16px'
          }}>
            📡
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>SiteWatch Portal</h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Sign in to access your monitoring dashboard</p>
        </div>

        {/* Validation / Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '13px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com"
              disabled={loading}
              style={{
                ...S.input,
                padding: '11px 14px',
                fontSize: '14px',
                background: '#090a0f',
                borderColor: '#1e2130',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              style={{
                ...S.input,
                padding: '11px 14px',
                fontSize: '14px',
                background: '#090a0f',
                borderColor: '#1e2130',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...S.btn('linear-gradient(90deg, #6366f1, #8b5cf6)', '#ffffff', {
                padding: '12px 20px',
                fontSize: '14px',
                marginTop: '10px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              })
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
      )}
    </div>
  );
}
