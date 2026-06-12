'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STATUS_OPTIONS = [
  { value: 'HALAL',   label: '✅ Halal',              color: '#4ade80' },
  { value: 'SYUBHAT', label: '⚠️ Syubhat (Ragu-ragu)', color: '#fbbf24' },
  { value: 'HARAM',   label: '🚫 Haram',               color: '#f87171' },
];

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.1em',
  color: 'var(--text-secondary)', marginBottom: '8px',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', eNumber: '', status: 'HALAL', source: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('sh_admin_auth');
    if (auth !== 'true') {
      router.replace('/admin/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || '',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Bahan berhasil ditambahkan ke database!' });
        setFormData({ name: '', eNumber: '', status: 'HALAL', source: '', description: '' });
      } else {
        const errData = await res.json();
        setMessage({ type: 'error', text: errData.message || 'Gagal menyimpan data.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Koneksi ke database gagal. Pastikan jaringan terhubung.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sh_admin_auth');
    router.replace('/');
  };

  if (!isAuthorized) return null;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', color: 'var(--text-primary)' }}>
      <div className="page-bg" />

      {/* Admin Topbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="glass-card" style={{ borderRadius: '16px', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #22c55e, #15803d)',
                border: '1px solid rgba(34,197,94,0.3)', flexShrink: 0,
              }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>
                  Smart<span className="text-grad-green">Halal</span>
                </span>
                <span style={{
                  fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.08em', padding: '3px 8px', borderRadius: '6px',
                  color: 'var(--color-halal)', background: 'var(--bg-halal)', border: '1px solid var(--border-halal)',
                }}>Admin</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/" style={{
                fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)',
                textDecoration: 'none', padding: '6px 12px', borderRadius: '8px', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >← Beranda</Link>
              <button onClick={handleLogout} style={{
                fontSize: '13px', fontWeight: 600, padding: '6px 12px', borderRadius: '8px',
                color: '#f87171', background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.18)', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
              >Keluar</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ paddingTop: '110px', paddingBottom: '60px', padding: '110px 16px 60px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>

          {/* Page header */}
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '7px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
              background: 'var(--bg-halal)', border: '1px solid var(--border-halal)', color: 'var(--color-halal)',
              marginBottom: '16px',
            }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Panel Manajemen Data
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Tambah Bahan Pangan
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Data yang ditambahkan akan langsung tersimpan ke database SmartHalal.
            </p>
          </div>

          {/* Form card */}
          <div className="glass-card fade-up-1" style={{ borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)',
            }} />

            {/* Feedback alert */}
            {message.text && (
              <div style={{
                marginBottom: '24px', padding: '14px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 500,
                background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: message.type === 'success' ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(239,68,68,0.25)',
                color: message.type === 'success' ? '#4ade80' : '#f87171',
              }}>
                {message.type === 'success' ? '✅ ' : '❌ '}{message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Nama Bahan */}
              <div>
                <label htmlFor="name" style={labelStyle}>
                  Nama Bahan <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input
                  id="name" name="name" type="text" required
                  value={formData.name} onChange={handleChange}
                  placeholder="Contoh: Gelatin, Karmin, Lesitin Kedelai..."
                  className="input-field"
                />
              </div>

              {/* E-Number + Status side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label htmlFor="eNumber" style={labelStyle}>Kode E-Number</label>
                  <input
                    id="eNumber" name="eNumber" type="text"
                    value={formData.eNumber} onChange={handleChange}
                    placeholder="E471, E120..."
                    className="input-field"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label htmlFor="status" style={labelStyle}>
                    Status Kehalalan <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <select
                    id="status" name="status" required
                    value={formData.status} onChange={handleChange}
                    className="select-field"
                  >
                    {STATUS_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sumber */}
              <div>
                <label htmlFor="source" style={labelStyle}>Sumber / Bahan Baku</label>
                <input
                  id="source" name="source" type="text"
                  value={formData.source} onChange={handleChange}
                  placeholder="Hewani (sapi), Nabati (kedelai), Sintetis..."
                  className="input-field"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label htmlFor="description" style={labelStyle}>Penjelasan & Dasar Hukum</label>
                <textarea
                  id="description" name="description" rows={4}
                  value={formData.description} onChange={handleChange}
                  placeholder="Jelaskan alasan penetapan status kehalalan bahan ini..."
                  className="input-field"
                  style={{ resize: 'none' }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={isSubmitting}
                style={{
                  width: '100%', padding: '16px',
                  background: isSubmitting ? 'rgba(34,197,94,0.4)' : 'linear-gradient(135deg, #22c55e, #15803d)',
                  border: '1px solid rgba(34,197,94,0.4)', borderRadius: '12px',
                  color: '#fff', fontSize: '15px', fontWeight: 700,
                  fontFamily: 'Inter, sans-serif', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 18px rgba(34,197,94,0.25)',
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg width="16" height="16" style={{ animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Menyimpan ke Database...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Simpan ke Database
                  </>
                )}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '20px' }}>
            Data akan langsung tersedia di halaman pencarian publik setelah disimpan.
          </p>
        </div>
      </div>
    </div>
  );
}
