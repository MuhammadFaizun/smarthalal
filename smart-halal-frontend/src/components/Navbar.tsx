'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  // Sembunyikan navbar publik di halaman admin (punya navbarnya sendiri)
  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      padding: '16px',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="glass-card" style={{
          borderRadius: '16px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #22c55e, #15803d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 16px rgba(34,197,94,0.3)',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                Smart<span className="text-grad-green">Halal</span>
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(34,197,94,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {t('checkFood')}
              </div>
            </div>
          </Link>

          {/* Right Controls Container */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Language Selector Toggle */}
            <div style={{
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '2px',
            }}>
              <button
                type="button"
                onClick={() => setLanguage('id')}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '5px 10px',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  background: language === 'id' ? 'linear-gradient(135deg, #22c55e, #15803d)' : 'transparent',
                  color: language === 'id' ? '#fff' : '#9ca3af',
                  transition: 'all 0.2s ease',
                  boxShadow: language === 'id' ? '0 2px 8px rgba(34,197,94,0.3)' : 'none',
                }}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '5px 10px',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  background: language === 'en' ? 'linear-gradient(135deg, #22c55e, #15803d)' : 'transparent',
                  color: language === 'en' ? '#fff' : '#9ca3af',
                  transition: 'all 0.2s ease',
                  boxShadow: language === 'en' ? '0 2px 8px rgba(34,197,94,0.3)' : 'none',
                }}
              >
                EN
              </button>
            </div>

            {/* Status badge - hidden on very small screens */}
            <div className="navbar-badge-hide" style={{
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(240,180,41,0.08)',
              border: '1px solid rgba(240,180,41,0.2)',
              borderRadius: '999px',
              padding: '6px 12px',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4ade80',
                display: 'inline-block',
              }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#fbbf24' }}>{t('dbActive')}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
