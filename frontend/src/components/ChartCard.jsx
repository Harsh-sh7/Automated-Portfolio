import React from 'react';

/* ──────────────────────────────────────────────
   Shared chart card wrapper
────────────────────────────────────────────── */
export const ChartCard = ({ title, subtitle, children, className = '', badge }) => (
  <div className={`glass-card glass-card-hover p-5 flex flex-col gap-4 animate-slide-up ${className}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-semibold text-dash-muted uppercase tracking-widest">{subtitle}</p>
        <h3 className="text-sm font-semibold text-white mt-0.5">{title}</h3>
      </div>
      {badge && <span className="insight-badge">{badge}</span>}
    </div>
    {children}
  </div>
);

/* ──────────────────────────────────────────────
   Color palette for charts
────────────────────────────────────────────── */
const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

/* ──────────────────────────────────────────────
   Bar Chart
────────────────────────────────────────────── */
export const BarChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const max  = Math.max(...data.map(d => d.value)) || 1;
  const w = 300, h = 140, pad = { top: 8, right: 8, bottom: 24, left: 28 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const barW   = (innerW / data.length) * 0.52;
  const gap    = innerW / data.length;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 150 }}>
      <defs>
        {data.map((_, i) => {
          const c = data[i].color || COLORS[i % COLORS.length];
          return (
            <linearGradient key={i} id={`barG${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={c} stopOpacity="0.9" />
              <stop offset="100%" stopColor={c} stopOpacity="0.4" />
            </linearGradient>
          );
        })}
      </defs>

      {/* Grid */}
      {[0, 0.5, 1].map(t => {
        const y = pad.top + innerH * (1 - t);
        return (
          <g key={t}>
            <line x1={pad.left} y1={y} x2={w - pad.right} y2={y}
              stroke="#1e1e1e" strokeWidth="1" strokeDasharray="3 3" />
            <text x={pad.left - 4} y={y + 4} textAnchor="end"
              fill="#444" fontSize="8" fontFamily="Inter,sans-serif">
              {Math.round(max * t)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x     = pad.left + i * gap + (gap - barW) / 2;
        const barH  = (d.value / max) * innerH;
        const y     = pad.top + innerH - barH;
        const color = d.color || COLORS[i % COLORS.length];
        return (
          <g key={d.label}>
            {/* Track */}
            <rect x={x} y={pad.top} width={barW} height={innerH} fill="#161616" rx="3" />
            {/* Fill */}
            <rect x={x} y={y} width={barW} height={barH} fill={`url(#barG${i})`} rx="3"
              style={{
                filter: `drop-shadow(0 0 6px ${color}50)`,
                transformOrigin: `${x + barW / 2}px ${pad.top + innerH}px`,
                animation: `barGrow 0.7s ease-out ${i * 80}ms both`,
              }}
            />
            {/* Value */}
            <text x={x + barW / 2} y={y - 4} textAnchor="middle"
              fill={color} fontSize="8" fontFamily="Inter,sans-serif" fontWeight="600">
              {d.value}
            </text>
            {/* Label */}
            <text x={x + barW / 2} y={h - 4} textAnchor="middle"
              fill="#555" fontSize="8" fontFamily="Inter,sans-serif">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* ──────────────────────────────────────────────
   Line Chart
────────────────────────────────────────────── */
export const LineChart = ({ data, color1 = '#6366f1', color2 = '#06b6d4' }) => {
  if (!data || data.length < 2) return null;
  const max    = Math.max(...data.flatMap(d => [d.v1, d.v2 || 0])) || 1;
  const w = 300, h = 140, pad = { top: 12, right: 8, bottom: 24, left: 28 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const toPath = key => data.map((d, i) => {
    const x = pad.left + (i / (data.length - 1)) * innerW;
    const y = pad.top + innerH - ((d[key] || 0) / max) * innerH;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const toArea = (key, c) => {
    const base = pad.top + innerH;
    const pts  = data.map((d, i) => {
      const x = pad.left + (i / (data.length - 1)) * innerW;
      const y = pad.top + innerH - ((d[key] || 0) / max) * innerH;
      return `${x},${y}`;
    });
    return `M ${pad.left},${base} L ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(' ')} L ${pad.left + innerW},${base} Z`;
  };

  const hasV2 = data[0]?.v2 !== undefined;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 150 }}>
      <defs>
        <linearGradient id="lineArea1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color1} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color1} stopOpacity="0"    />
        </linearGradient>
        <linearGradient id="lineArea2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color2} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color2} stopOpacity="0"    />
        </linearGradient>
      </defs>

      {/* Grid */}
      {[0, 0.5, 1].map(t => (
        <g key={t}>
          <line x1={pad.left} y1={pad.top + innerH * (1 - t)} x2={w - pad.right} y2={pad.top + innerH * (1 - t)}
            stroke="#1e1e1e" strokeWidth="1" strokeDasharray="3 3" />
          <text x={pad.left - 4} y={pad.top + innerH * (1 - t) + 4} textAnchor="end"
            fill="#444" fontSize="8" fontFamily="Inter,sans-serif">
            {Math.round(max * t)}
          </text>
        </g>
      ))}

      {/* X labels */}
      {data.map((d, i) => (
        <text key={d.label} x={pad.left + (i / (data.length - 1)) * innerW}
          y={h - 4} textAnchor="middle" fill="#444" fontSize="8" fontFamily="Inter,sans-serif">
          {d.label}
        </text>
      ))}

      {/* Area fills */}
      <path d={toArea('v1', color1)} fill="url(#lineArea1)" />
      {hasV2 && <path d={toArea('v2', color2)} fill="url(#lineArea2)" />}

      {/* Lines */}
      <path d={toPath('v1')} stroke={color1} strokeWidth="2.5" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color1}60)`, strokeDasharray: 600, strokeDashoffset: 600, animation: 'drawLine 1.3s ease-out 0.1s forwards' }}
      />
      {hasV2 && (
        <path d={toPath('v2')} stroke={color2} strokeWidth="1.5" fill="none"
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 4"
          style={{ strokeDasharray: 600, strokeDashoffset: 600, animation: 'drawLine 1.3s ease-out 0.3s forwards' }}
        />
      )}

      {/* Dots */}
      {data.map((d, i) => {
        const x = pad.left + (i / (data.length - 1)) * innerW;
        const y = pad.top + innerH - (d.v1 / max) * innerH;
        return (
          <circle key={i} cx={x} cy={y} r="3" fill={color1} stroke="#080808" strokeWidth="1.5"
            style={{ filter: `drop-shadow(0 0 3px ${color1})` }}
          />
        );
      })}

      {/* Legend */}
      {hasV2 && (
        <g>
          <rect x={pad.left} y={pad.top - 2} width="8" height="3" rx="1.5" fill={color1} />
          <text x={pad.left + 11} y={pad.top + 2} fill="#777" fontSize="7" fontFamily="Inter,sans-serif">Projects</text>
          <rect x={pad.left + 55} y={pad.top - 2} width="8" height="3" rx="1.5" fill={color2} />
          <text x={pad.left + 66} y={pad.top + 2} fill="#777" fontSize="7" fontFamily="Inter,sans-serif">Commits</text>
        </g>
      )}
    </svg>
  );
};

/* ──────────────────────────────────────────────
   Donut Chart
────────────────────────────────────────────── */
export const DonutChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const palette = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'];
  const total   = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = 72, cy = 72, r = 54, inner = 32;
  let startAngle = -Math.PI / 2;

  const slices = data.map((d, idx) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const end   = startAngle + angle;
    const pts   = {
      x1: cx + r * Math.cos(startAngle), y1: cy + r * Math.sin(startAngle),
      x2: cx + r * Math.cos(end),        y2: cy + r * Math.sin(end),
      xi1: cx + inner * Math.cos(startAngle), yi1: cy + inner * Math.sin(startAngle),
      xi2: cx + inner * Math.cos(end),        yi2: cy + inner * Math.sin(end),
    };
    const large = angle > Math.PI ? 1 : 0;
    const path  = `M ${pts.x1} ${pts.y1} A ${r} ${r} 0 ${large} 1 ${pts.x2} ${pts.y2} L ${pts.xi2} ${pts.yi2} A ${inner} ${inner} 0 ${large} 0 ${pts.xi1} ${pts.yi1} Z`;
    const fill  = d.color || palette[idx % palette.length];
    startAngle  = end;
    return { ...d, path, fill, pct: Math.round((d.value / total) * 100) };
  });

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 144 144" className="w-28 h-28 flex-shrink-0">
        <defs>
          {slices.map((s, i) => (
            <filter key={i} id={`glow${i}`}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          ))}
        </defs>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.fill}
            style={{ filter: `drop-shadow(0 0 5px ${s.fill}60)` }}
            className="transition-opacity hover:opacity-80 cursor-pointer"
          >
            <title>{s.label}: {s.pct}%</title>
          </path>
        ))}
        <text x={cx} y={cy - 3} textAnchor="middle" fill="#ffffff"
          fontSize="14" fontWeight="700" fontFamily="Inter,sans-serif">
          {total}
        </text>
        <text x={cx} y={cy + 11} textAnchor="middle" fill="#555"
          fontSize="7" fontFamily="Inter,sans-serif">TOTAL</text>
      </svg>

      <div className="flex flex-col gap-2.5">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ background: s.fill, boxShadow: `0 0 6px ${s.fill}60` }} />
            <span className="text-[11px] text-dash-secondary flex-1 truncate">{s.label}</span>
            <span className="text-[11px] font-semibold" style={{ color: s.fill }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────
   Activity Heatmap — GitHub-style green
────────────────────────────────────────────── */
export const ActivityHeatmap = () => {
  const seed = x => { const s = Math.sin(x * 9301 + 49297) * 233280; return s - Math.floor(s); };
  const weeks = 26, days = 7;

  const cellFill = v => {
    if (v > 0.80) return '#39d353';
    if (v > 0.60) return '#26a641';
    if (v > 0.38) return '#006d32';
    if (v > 0.18) return '#0e4429';
    return '#161b22';
  };

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex gap-[3px] min-w-max">
        {Array.from({ length: weeks }, (_, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: days }, (_, di) => {
              const val = seed(wi * 7 + di);
              return (
                <div key={di}
                  className="w-3 h-3 rounded-[2px] cursor-pointer transition-opacity hover:opacity-70"
                  style={{ background: cellFill(val) }}
                  title={`Activity: ${Math.round(val * 10)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartCard;
