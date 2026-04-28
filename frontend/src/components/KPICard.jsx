import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Per-card accent colors
const ACCENT = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'];

// Animated count-up hook
function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const step = ts => {
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

// Sparkline
const Sparkline = ({ data, color = '#6366f1' }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const w = 72, h = 28, pad = 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + ((max - v) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  const id = `sparkGrad${color.replace('#','')}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <polyline
        points={pts}
        stroke={`url(#${id})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeDasharray: 500, strokeDashoffset: 500, animation: 'drawLine 1s ease-out forwards', filter: `drop-shadow(0 0 3px ${color}80)` }}
      />
    </svg>
  );
};

const KPICard = ({
  title, value, suffix = '', prefix = '', subtitle,
  icon: Icon, trend, trendValue, sparkData, delay = 0, colorIndex = 0,
}) => {
  const animated = useCountUp(typeof value === 'number' ? value : 0);
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const accentColor = ACCENT[colorIndex % ACCENT.length];
  const trendColor  = trend === 'up' ? accentColor : trend === 'down' ? '#555555' : '#444444';

  return (
    <div
      className="glass-card glass-card-hover p-5 flex flex-col gap-4 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div
          className="p-2 rounded-lg"
          style={{ background: '#191919', border: '1px solid #2a2a2a' }}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <Sparkline data={sparkData} color={accentColor} />
      </div>

      <div>
        <p className="text-[10px] font-semibold text-dash-muted uppercase tracking-widest mb-1.5">{title}</p>
        <div className="flex items-end gap-1">
          {prefix && <span className="text-dash-muted text-xs mb-1">{prefix}</span>}
          <span className="kpi-value">
            {typeof value === 'number' ? animated : value}
          </span>
          {suffix && <span className="text-dash-muted text-xs mb-1">{suffix}</span>}
        </div>
        <p className="text-[11px] text-dash-muted mt-1">{subtitle}</p>
        <div className="h-[2px] rounded-full mt-3" style={{ background: `linear-gradient(90deg, ${accentColor}60, ${accentColor}15)` }} />
      </div>

      {trendValue && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: trendColor }}>
          <TrendIcon className="w-3 h-3" />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
