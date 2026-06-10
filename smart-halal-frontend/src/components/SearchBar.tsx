'use client';
import { useState } from 'react';

const SUGGESTIONS = ['Gelatin', 'E120', 'MSG', 'E471', 'Karmin', 'Lesitin'];

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto fade-up-2">
      <form onSubmit={handleSubmit}>
        <div
          className="relative flex items-center rounded-2xl transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: focused ? '1px solid rgba(34,197,94,0.5)' : '1px solid rgba(255,255,255,0.08)',
            boxShadow: focused ? '0 0 0 3px rgba(34,197,94,0.12), 0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          {/* Icon */}
          <div className="pl-5 pr-3 flex-shrink-0">
            <svg className="w-5 h-5 transition-colors duration-200"
              style={{ color: focused ? '#4ade80' : '#4b5563' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Input */}
          <input
            id="main-search"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Cari nama bahan atau kode E-Number..."
            className="flex-1 h-14 bg-transparent text-sm font-medium focus:outline-none"
            style={{ color: '#f0fdf4' }}
          />

          {/* Clear */}
          {query && (
            <button type="button" onClick={() => setQuery('')}
              className="flex-shrink-0 mr-2 p-1.5 rounded-lg transition-colors"
              style={{ color: '#6b7280' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Submit */}
          <div className="m-2">
            <button type="submit" className="btn-green h-10 px-6 text-sm rounded-xl">
              Cari
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions */}
      <div className="flex flex-wrap items-center gap-2 mt-4 px-1">
        <span className="text-xs font-medium" style={{ color: '#4b5563' }}>Coba:</span>
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => { setQuery(s); onSearch(s); }}
            className="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#9ca3af',
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
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
