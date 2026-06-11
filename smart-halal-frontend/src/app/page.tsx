'use client';
// Trigger Vercel build with updated root directory

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const API_BASE_URL = '';


const dummyData = [
  { id: '1', eNumber: 'E471', name: 'Mono dan Digliserida Asam Lemak', status: 'SYUBHAT' as const, description: 'Emulsifier yang bisa berasal dari lemak nabati atau hewani. Status bergantung pada sumber lemak yang digunakan.', source: 'Lemak nabati atau hewani' },
  { id: '2', eNumber: null, name: 'Gelatin Sapi Murni', status: 'HALAL' as const, description: 'Aman dikonsumsi asalkan berasal dari sapi yang disembelih sesuai syariat Islam dan bersertifikasi.', source: 'Tulang sapi bersertifikasi' },
  { id: '3', eNumber: 'E120', name: 'Karmin (Cochineal)', status: 'HARAM' as const, description: 'Zat pewarna merah yang diekstrak dari serangga Dactylopius coccus. Tidak halal karena berasal dari serangga.', source: 'Serangga Cochineal' },
];

function IngredientCard({ item }: { item: any }) {
  const { t, translateDynamic } = useLanguage();

  const STATUS_CONFIG = {
    HALAL:   { label: t('statusHalal'),   color: '#4ade80', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   dot: '✅', accent: '#22c55e', glow: 'rgba(34,197,94,0.07)'   },
    HARAM:   { label: t('statusHaram'),   color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   dot: '🚫', accent: '#ef4444', glow: 'rgba(239,68,68,0.07)'   },
    SYUBHAT: { label: t('statusSyubhat'), color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', dot: '⚠️', accent: '#f59e0b', glow: 'rgba(245,158,11,0.07)' },
  };

  const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.SYUBHAT;

  return (
    <div
      style={{ borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden' }}
      className="glass-card"
    >
      {/* Top color line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent, ${cfg.accent}60, transparent)`
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
              <span style={{ fontSize: '11px', fontWeight: 700, color: cfg.accent, letterSpacing: '0.05em', fontFamily: 'monospace', display: 'block', marginBottom: '2px' }}>
                {item.eNumber}
              </span>
            )}
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f0fdf4', lineHeight: 1.3 }}>{translateDynamic(item.name)}</h3>
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
        <div style={{ height: '1px', margin: '12px 0', background: `linear-gradient(90deg, transparent, ${cfg.accent}20, transparent)` }} />

        {item.description && (
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, marginBottom: '10px' }}>
            {translateDynamic(item.description)}
          </p>
        )}
        {item.source && (
          <div style={{ fontSize: '12px', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg style={{ width: '14px', height: '14px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('sourceText')}:</span>
            <span style={{ color: '#9ca3af' }}>{translateDynamic(item.source)}</span>
          </div>
        )}
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
          background: 'rgba(255,255,255,0.04)',
          border: focused ? '1px solid rgba(34,197,94,0.5)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: focused ? '0 0 0 3px rgba(34,197,94,0.12), 0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease',
        }}>
          <div style={{ padding: '0 12px 0 18px', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={focused ? '#4ade80' : '#4b5563'} strokeWidth={2.5}>
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
              fontWeight: 500, color: '#f0fdf4', fontFamily: 'Inter, sans-serif',
            }}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} style={{ padding: '8px', marginRight: '4px', cursor: 'pointer', background: 'none', border: 'none', color: '#6b7280', display: 'flex' }}>
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
        <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: 500 }}>{t('tryLabel')}</span>
        {SUGGESTIONS.map(s => (
          <button
            key={s} type="button"
            onClick={() => { setQuery(s); onSearch(s); }}
            style={{
              fontSize: '12px', padding: '5px 12px', borderRadius: '999px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#9ca3af', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#4ade80';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,197,94,0.3)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.07)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = '#9ca3af';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
            }}
          >{s}</button>
        ))}
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
  const { t, language } = useLanguage();

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
    <main style={{ minHeight: '100vh', padding: '0 16px 80px', color: '#f0fdf4', position: 'relative' }}>
      <div className="page-bg" />

      <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '120px' }}>

        {/* Gold pill */}
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
            background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.2)', color: '#fbbf24',
          }}>
            {t('heroBadge')}
          </div>
        </div>

        {/* Hero heading */}
        <div className="fade-up-1" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#fff', marginBottom: '16px' }}>
            {t('heroTitlePart1')}
            <span className="text-grad-green">{t('heroTitleGradGreen')}</span>
            <br />
            {t('heroTitlePart2')}
            <span className="text-grad-gold">{t('heroTitleGradGold')}</span>
          </h1>
          <p style={{ fontSize: '16px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7, color: '#6b7280' }}>
            {t('heroSubtitle')}
          </p>
        </div>

        {/* SearchBar */}
        <div className="fade-up-2">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Stats — hanya tampil saat belum search */}
        {!hasSearched && (
          <div className="fade-up-3">
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px', marginTop: '48px',
            }}>
              {[
                { label: t('statTotal'),   value: `${stats.total}`, color: '#f0fdf4' },
                { label: t('statHalal'),   value: `${stats.halal}%`, color: '#4ade80' },
                { label: t('statSyubhat'), value: `${stats.syubhat}%`, color: '#fbbf24' },
                { label: t('statHaram'),   value: `${stats.haram}%`, color: '#f87171' },
              ].map(s => (
                <div key={s.label} className="glass-card" style={{ borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: s.color, marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: '#4b5563', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
              {[
                { text: t('descHalal'),   color: '#4ade80' },
                { text: t('descSyubhat'), color: '#fbbf24' },
                { text: t('descHaram'),   color: '#f87171' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: item.color }}>
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
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(34,197,94,0.15)' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', borderTop: '2px solid #22c55e', animation: 'spin 0.8s linear infinite' }} />
              </div>
              <p style={{ fontSize: '14px', color: '#4ade80', fontWeight: 500 }}>{t('loading')}</p>
            </div>
          ) : hasSearched && results.length > 0 ? (
            <div>
              <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '16px' }}>
                {t('foundResults', { count: results.length }).split(String(results.length)).map((part, i, arr) =>
                  i < arr.length - 1
                    ? <span key={i}>{part}<span style={{ color: '#4ade80', fontWeight: 700 }}>{results.length}</span></span>
                    : <span key={i}>{part}</span>
                )}
              </p>
              <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {results.map((item, i) => (
                  <div key={item.id} className="fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                    <IngredientCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          ) : hasSearched && results.length === 0 ? (
            <div className="glass-card" style={{ borderRadius: '24px', padding: '48px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f0fdf4', marginBottom: '8px' }}>{t('notFoundTitle')}</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
                {t('notFoundDesc')}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', pointerEvents: 'none',
        background: 'linear-gradient(to top, #070e09, transparent)',
      }} />
    </main>
  );
}
