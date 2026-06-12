'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await new Promise(r => setTimeout(r, 700));

    const adminKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY;
    if (password === adminKey) {
      sessionStorage.setItem('sh_admin_auth', 'true');
      router.push('/admin');
    } else {
      setError('Password salah. Akses ditolak.');
      setIsLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '16px', color: 'var(--text-primary)', position: 'relative'
    }}>
      <div className="page-bg" />

      <div className="fade-up" style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 10 }}>
        <div className="glass-card" style={{ borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>

          {/* Top glow line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.6), transparent)',
          }} />

          {/* Corner glow blob */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '160px', height: '160px', borderRadius: '50%',
            background: 'rgba(34,197,94,0.06)', filter: 'blur(40px)', pointerEvents: 'none',
          }} />

          {/* Lock icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '16px',
                background: '#22c55e', opacity: 0.2, filter: 'blur(16px)',
              }} />
              <div style={{
                position: 'relative', width: '64px', height: '64px',
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #4ade80, #15803d)',
                border: '1px solid rgba(34,197,94,0.4)',
                boxShadow: '0 8px 32px rgba(34,197,94,0.3)',
              }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>Area Admin</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Halaman ini tidak tersedia untuk publik</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '16px', padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171', fontSize: '14px', fontWeight: 500, textAlign: 'center',
            }}>
              🚫 {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="admin-password" style={{
                display: 'block', fontSize: '11px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--text-secondary)', marginBottom: '8px',
              }}>
                Password Admin
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoFocus
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '14px', marginTop: '8px',
                background: isLoading ? 'rgba(34,197,94,0.4)' : 'linear-gradient(135deg, #22c55e, #15803d)',
                border: '1px solid rgba(34,197,94,0.4)', borderRadius: '12px',
                color: '#fff', fontSize: '15px', fontWeight: 700,
                fontFamily: 'Inter, sans-serif', cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(34,197,94,0.25)',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {isLoading ? (
                <>
                  <svg width="16" height="16" style={{ animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Memverifikasi...
                </>
              ) : 'Masuk →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '24px' }}>
            Akses URL ini hanya diketahui oleh administrator
          </p>
        </div>
      </div>
    </main>
  );
}
