'use client';

type HalalStatus = 'HALAL' | 'HARAM' | 'SYUBHAT';

interface Ingredient {
  id: string;
  eNumber?: string | null;
  name: string;
  status: HalalStatus;
  description?: string | null;
  source?: string | null;
}

const STATUS_CFG = {
  HALAL:   { label: 'Halal',   badgeClass: 'badge badge-halal',   dot: '#4ade80', accent: '#22c55e', glow: 'rgba(34,197,94,0.07)'   },
  HARAM:   { label: 'Haram',   badgeClass: 'badge badge-haram',   dot: '#f87171', accent: '#ef4444', glow: 'rgba(239,68,68,0.07)'   },
  SYUBHAT: { label: 'Syubhat', badgeClass: 'badge badge-syubhat', dot: '#fbbf24', accent: '#f59e0b', glow: 'rgba(245,158,11,0.07)' },
};

export default function IngredientCard({ ingredient }: { ingredient: Ingredient }) {
  const cfg = STATUS_CFG[ingredient.status];

  return (
    <div
      className="glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
    >
      {/* Top color line */}
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.accent}60, transparent)` }} />

      {/* Hover corner glow */}
      <div className="absolute -top-14 -right-14 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: cfg.glow }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-snug truncate" style={{ color: '#f0fdf4' }}>
              {ingredient.name}
            </h3>
            {ingredient.eNumber && (
              <span className="inline-block mt-1 text-xs font-bold font-mono tracking-wider"
                style={{ color: cfg.accent }}>
                {ingredient.eNumber}
              </span>
            )}
          </div>
          <span className={cfg.badgeClass}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: cfg.dot }} />
            {cfg.label}
          </span>
        </div>

        {/* Divider */}
        <div className="divider mb-3"
          style={{ background: `linear-gradient(90deg, transparent, ${cfg.accent}20, transparent)` }} />

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
          {ingredient.description || 'Tidak ada deskripsi tersedia.'}
        </p>

        {/* Source */}
        {ingredient.source && (
          <div className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: '#4b5563' }}>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Sumber:</span>
            <span style={{ color: '#9ca3af' }}>{ingredient.source}</span>
          </div>
        )}
      </div>
    </div>
  );
}
