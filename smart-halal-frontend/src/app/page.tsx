'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const API_BASE_URL = '';

const dummyData = [
  { id: '1', eNumber: 'E471', name: 'Mono dan Digliserida Asam Lemak', status: 'SYUBHAT' as const, description: 'Emulsifier yang bisa berasal dari lemak nabati atau hewani. Status bergantung pada sumber lemak yang digunakan.', source: 'Lemak nabati atau hewani' },
  { id: '2', eNumber: null, name: 'Gelatin Sapi Murni', status: 'HALAL' as const, description: 'Aman dikonsumsi asalkan berasal dari sapi yang disembelih sesuai syariat Islam dan bersertifikasi.', source: 'Tulang sapi bersertifikasi' },
  { id: '3', eNumber: 'E120', name: 'Karmin (Cochineal)', status: 'HARAM' as const, description: 'Zat pewarna merah yang diekstrak dari serangga Dactylopius coccus. Tidak halal karena berasal dari serangga.', source: 'Serangga Cochineal' },
];

function IngredientCard({ item, onClick }: { item: any; onClick: () => void }) {
  const { t, translateDynamic } = useLanguage();

  const STATUS_CONFIG = {
    HALAL:   { label: t('statusHalal'),   color: 'var(--color-halal)', bg: 'var(--bg-halal)',   border: 'var(--border-halal)',   dot: '✅', accent: '#22c55e', glow: 'var(--glow-halal)'   },
    HARAM:   { label: t('statusHaram'),   color: 'var(--color-haram)', bg: 'var(--bg-haram)',   border: 'var(--border-haram)',   dot: '🚫', accent: '#ef4444', glow: 'var(--glow-haram)'   },
    SYUBHAT: { label: t('statusSyubhat'), color: 'var(--color-syubhat)', bg: 'var(--bg-syubhat)', border: 'var(--border-syubhat)', dot: '⚠️', accent: '#f59e0b', glow: 'var(--glow-syubhat)' },
  };

  const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.SYUBHAT;

  return (
    <div
      onClick={onClick}
      style={{ borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
      className="glass-card"
    >
      {/* Top color line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${cfg.color}60, transparent)`
      }} />

      {/* Hover glow */}
      <div style={{
        position: 'absolute', top: '-56px', right: '-56px', width: '144px', height: '144px',
        borderRadius: '50%', filter: 'blur(24px)', pointerEvents: 'none', background: cfg.glow,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {item.eNumber && (
              <span style={{ fontSize: '11px', fontWeight: 700, color: cfg.color, letterSpacing: '0.05em', fontFamily: 'monospace', display: 'block', marginBottom: '2px' }}>
                {item.eNumber}
              </span>
            )}
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{translateDynamic(item.name)}</h3>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '4px 10px', borderRadius: '999px', flexShrink: 0,
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            fontSize: '11px', fontWeight: 700, color: cfg.color, letterSpacing: '0.07em', textTransform: 'uppercase',
          }}>
            {cfg.dot} {cfg.label}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', margin: '12px 0', background: `linear-gradient(90deg, transparent, ${cfg.color}20, transparent)` }} />

        {item.description && (
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '10px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {translateDynamic(item.description)}
          </p>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
          {item.source ? (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
              <svg style={{ width: '14px', height: '14px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ whiteSpace: 'nowrap' }}>{t('sourceText')}:</span>
              <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {translateDynamic(item.source)}
              </span>
            </div>
          ) : <div />}
          
          <span style={{ fontSize: '11px', color: cfg.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0, marginLeft: '8px' }}>
            Detail
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

const SUGGESTIONS = ['Gelatin', 'E120', 'MSG', 'E471', 'Karmin', 'Lesitin'];

function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const { t } = useLanguage();

  const submit = (e: React.FormEvent) => { e.preventDefault(); if (query.trim()) onSearch(query.trim()); };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <form onSubmit={submit}>
        <div style={{
          display: 'flex', alignItems: 'center', borderRadius: '16px',
          background: 'var(--glass-bg)',
          border: focused ? '1px solid var(--color-halal)' : '1px solid var(--border-color)',
          boxShadow: focused ? '0 0 0 3px var(--bg-halal), var(--glass-shadow)' : 'var(--glass-shadow)',
          transition: 'all 0.25s ease',
        }}>
          <div style={{ padding: '0 12px 0 18px', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={focused ? 'var(--color-halal)' : 'var(--text-muted)'} strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="main-search"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={t('searchPlaceholder')}
            style={{
              flex: 1, height: '54px', background: 'transparent',
              border: 'none', outline: 'none', fontSize: '15px',
              fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif',
            }}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} style={{ padding: '8px', marginRight: '4px', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div style={{ padding: '8px' }}>
            <button type="submit" className="btn-green" style={{ height: '38px', padding: '0 20px', fontSize: '14px', borderRadius: '10px' }}>
              {t('searchButton')}
            </button>
          </div>
        </div>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '14px', paddingLeft: '4px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>{t('tryLabel')}</span>
        {SUGGESTIONS.map(s => (
          <button
            key={s} type="button"
            onClick={() => { setQuery(s); onSearch(s); }}
            style={{
              fontSize: '12px', padding: '5px 12px', borderRadius: '999px', cursor: 'pointer',
              background: 'var(--glass-bg)', border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-halal)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-halal)';
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-halal)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
              (e.currentTarget as HTMLElement).style.background = 'var(--glass-bg)';
            }}
          >{s}</button>
        ))}
      </div>
    </div>
  );
}

function DetailModal({ item, onClose, t, translateDynamic }: { item: any; onClose: () => void; t: any; translateDynamic: any }) {
  const [copied, setCopied] = useState(false);

  const STATUS_CONFIG = {
    HALAL:   { label: t('statusHalal'),   color: 'var(--color-halal)', bg: 'var(--bg-halal)',   border: 'var(--border-halal)',   dot: '✅', accent: '#22c55e', glow: 'var(--glow-halal)'   },
    HARAM:   { label: t('statusHaram'),   color: 'var(--color-haram)', bg: 'var(--bg-haram)',   border: 'var(--border-haram)',   dot: '🚫', accent: '#ef4444', glow: 'var(--glow-haram)'   },
    SYUBHAT: { label: t('statusSyubhat'), color: 'var(--color-syubhat)', bg: 'var(--bg-syubhat)', border: 'var(--border-syubhat)', dot: '⚠️', accent: '#f59e0b', glow: 'var(--glow-syubhat)' },
  };

  const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.SYUBHAT;

  const handleCopy = () => {
    const textToCopy = `${translateDynamic(item.name)} (${item.eNumber || '-'}) - Status: ${cfg.label}\n${t('sourceTitle')}: ${translateDynamic(item.source || '-')}\n${t('detailTitle')}: ${translateDynamic(item.description || '-')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" style={{ padding: '32px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`
        }} />

        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '32px', height: '32px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
            cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s',
            outline: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div style={{ marginTop: '8px' }}>
          {item.eNumber && (
            <span style={{ fontSize: '12px', fontWeight: 700, color: cfg.color, letterSpacing: '0.08em', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>
              {item.eNumber}
            </span>
          )}
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: '16px' }}>
            {translateDynamic(item.name)}
          </h2>
          
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '999px',
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            fontSize: '13px', fontWeight: 800, color: cfg.color, letterSpacing: '0.07em',
          }}>
            <span style={{ fontSize: '16px' }}>{cfg.dot}</span>
            <span>{cfg.label}</span>
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--border-color)', margin: '24px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              {t('sourceTitle')}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={cfg.color} strokeWidth={2} style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {translateDynamic(item.source) || '-'}
              </span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              {t('detailTitle')}
            </h4>
            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', lineHeight: 1.6, fontSize: '14px', color: 'var(--text-secondary)' }}>
              {translateDynamic(item.description) || '—'}
            </div>
          </div>

          <div style={{
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '18px', marginTop: '-2px' }}>💡</span>
            <div style={{ fontSize: '12px', lineHeight: 1.5, color: cfg.color, fontWeight: 500 }}>
              {item.status === 'HALAL' && t('recHalal')}
              {item.status === 'SYUBHAT' && t('recSyubhat')}
              {item.status === 'HARAM' && t('recHaram')}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--border-color)', margin: '24px 0' }} />

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
              background: 'transparent', border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            {t('closeButton')}
          </button>
          
          <button
            onClick={handleCopy}
            style={{
              padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)',
              color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-halal)'; e.currentTarget.style.borderColor = 'var(--color-halal)'; e.currentTarget.style.color = 'var(--color-halal)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          >
            {copied ? (
              <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t('copiedText')}
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {t('copyButton')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ total: 1000, halal: 90, syubhat: 9, haram: 1 });
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<any | null>(null);
  const { t, language, translateDynamic } = useLanguage();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ingredients/stats`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const { total, halal, syubhat, haram } = json.data;
            const totalCount = total || 1;
            setStats({
              total,
              halal: Math.round((halal / totalCount) * 100),
              syubhat: Math.round((syubhat / totalCount) * 100),
              haram: Math.round((haram / totalCount) * 100),
            });
          }
        }
      } catch (err) {
        console.error('Gagal memuat statistik:', err);
      }
    };
    fetchStats();
  }, []);

  const handleSearch = async (query: string, lang = language) => {
    if (!query.trim()) return;
    setCurrentQuery(query);
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ingredients?q=${encodeURIComponent(query)}&lang=${lang}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.data || []);
      } else {
        setResults(dummyData.filter(d =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          (d.eNumber && d.eNumber.toLowerCase().includes(query.toLowerCase()))
        ));
      }
    } catch {
      setResults(dummyData.filter(d =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        (d.eNumber && d.eNumber.toLowerCase().includes(query.toLowerCase()))
      ));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentQuery) {
      handleSearch(currentQuery, language);
    }
  }, [language]);

  return (
    <main style={{ minHeight: '100vh', color: 'var(--text-primary)', position: 'relative' }}>
      <div className="page-bg" />

      <div className="hero-section">
        {/* Gold pill */}
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
            background: 'var(--gold-pill-bg)', border: '1px solid var(--gold-pill-border)', color: 'var(--gold-pill-text)',
          }}>
            {t('heroBadge')}
          </div>
        </div>

        {/* Hero heading */}
        <div className="fade-up-1" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
            {t('heroTitlePart1')}
            <span className="text-grad-green">{t('heroTitleGradGreen')}</span>
            <br />
            {t('heroTitlePart2')}
            <span className="text-grad-gold">{t('heroTitleGradGold')}</span>
          </h1>
          <p style={{ fontSize: '16px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            {t('heroSubtitle')}
          </p>
        </div>

        {/* SearchBar */}
        <div className="fade-up-2">
          <SearchBar onSearch={handleSearch} />
        </div>

        {!hasSearched && (
          <div className="fade-up-3">
            <div className="stats-grid">
              {[
                { label: t('statTotal'),   value: `${stats.total}`, color: 'var(--text-primary)', glow: 'rgba(34,197,94,0.02)', border: 'var(--border-color)', topBorder: 'var(--text-primary)' },
                { label: t('statHalal'),   value: `${stats.halal}%`, color: 'var(--color-halal)', glow: 'var(--glow-halal)', border: 'var(--border-halal)', topBorder: 'var(--color-halal)' },
                { label: t('statSyubhat'), value: `${stats.syubhat}%`, color: 'var(--color-syubhat)', glow: 'var(--glow-syubhat)', border: 'var(--border-syubhat)', topBorder: 'var(--color-syubhat)' },
                { label: t('statHaram'),   value: `${stats.haram}%`, color: 'var(--color-haram)', glow: 'var(--glow-haram)', border: 'var(--border-haram)', topBorder: 'var(--color-haram)' },
              ].map(s => (
                <div
                  key={s.label}
                  className="glass-card"
                  style={{
                    borderRadius: '16px',
                    padding: '24px 20px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Glowing background */}
                  <div style={{
                    position: 'absolute', top: '-40px', right: '-40px', width: '90px', height: '90px',
                    borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none', background: s.glow,
                  }} />
                  {/* Colored top line */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: s.topBorder,
                  }} />
                  <div style={{ fontSize: '28px', fontWeight: 900, color: s.color, marginBottom: '6px', lineHeight: 1.1 }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="legend-row">
              {[
                { text: t('descHalal'),   color: 'var(--color-halal)' },
                { text: t('descSyubhat'), color: 'var(--color-syubhat)' },
                { text: t('descHaram'),   color: 'var(--color-haram)' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: item.color }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div style={{ marginTop: '40px' }}>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', gap: '16px' }}>
              <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid var(--border-color)' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', borderTop: '2px solid var(--color-halal)', animation: 'spin 0.8s linear infinite' }} />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--color-halal)', fontWeight: 500 }}>{t('loading')}</p>
            </div>
          ) : hasSearched && results.length > 0 ? (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {t('foundResults', { count: results.length }).split(String(results.length)).map((part, i, arr) =>
                  i < arr.length - 1
                    ? <span key={i}>{part}<span style={{ color: 'var(--color-halal)', fontWeight: 700 }}>{results.length}</span></span>
                    : <span key={i}>{part}</span>
                )}
              </p>
              <div className="results-grid">
                {results.map((item, i) => (
                  <div key={item.id} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <IngredientCard item={item} onClick={() => setSelectedIngredient(item)} />
                  </div>
                ))}
              </div>
            </div>
          ) : hasSearched && results.length === 0 ? (
            <div className="glass-card" style={{ borderRadius: '24px', padding: '48px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{t('notFoundTitle')}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {t('notFoundDesc')}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', pointerEvents: 'none',
        background: 'linear-gradient(to top, var(--bg-primary), transparent)',
      }} />

      {/* Detail Modal Popup */}
      {selectedIngredient && (
        <DetailModal
          item={selectedIngredient}
          onClose={() => setSelectedIngredient(null)}
          t={t}
          translateDynamic={translateDynamic}
        />
      )}
    </main>
  );
}
