/* HabitTrack — shared primitives + small parts used across screens */

// ─── Icons (tiny stroke set; no third-party) ──────────────────────
const Icon = {
  Check: ({ size = 14, stroke = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Plus: ({ size = 14, stroke = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  ),
  Edit: ({ size = 14, stroke = 1.5 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2.5 13.5L3 11l7-7 2.5 2.5-7 7-2.5.5z M9 5l2.5 2.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Archive: ({ size = 14, stroke = 1.5 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="3" rx="0.5" stroke="currentColor" strokeWidth={stroke}/>
      <path d="M3 6v6.5c0 .3.2.5.5.5h9c.3 0 .5-.2.5-.5V6 M6.5 8.5h3" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  ),
  Trash: ({ size = 14, stroke = 1.5 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 4.5h10 M5.5 4.5V3a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v1.5 M5 4.5l.5 8.5h5l.5-8.5 M7 7v4 M9 7v4" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowRight: ({ size = 14, stroke = 1.5 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10 M9 4l4 4-4 4" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowLeft: ({ size = 14, stroke = 1.5 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M13 8H3 M7 4L3 8l4 4" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Dot: ({ size = 6, color }) => (
    <span style={{ display: 'inline-block', width: size, height: size, borderRadius: 99, background: color || 'currentColor' }} />
  ),
  Search: ({ size = 14, stroke = 1.5 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth={stroke}/>
      <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  ),
  Bell: ({ size = 14, stroke = 1.5 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 11.5V7a4 4 0 018 0v4.5 M3 11.5h10 M6.5 13.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  ),
  Flame: ({ size = 14, stroke = 1.5 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2c0 2.5-3 3.5-3 6.5a3 3 0 006 0c0-1.2-.4-2-1-2.7.3 1-.5 1.7-1 1.7s-.5-.5-.5-1.5C8.5 4.5 8 3 8 2z" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  Calendar: ({ size = 14, stroke = 1.5 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="3.5" width="11" height="10" rx="1" stroke="currentColor" strokeWidth={stroke}/>
      <path d="M2.5 6.5h11 M5.5 2.5v2 M10.5 2.5v2" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  ),
  Sparkles: ({ size = 14, stroke = 1.5 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2v3 M8 11v3 M2 8h3 M11 8h3 M4 4l1.5 1.5 M10.5 10.5L12 12 M4 12l1.5-1.5 M10.5 5.5L12 4" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  ),
  Close: ({ size = 14, stroke = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8 M12 4l-8 8" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  ),
  Info: ({ size = 14, stroke = 1.5 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth={stroke}/>
      <path d="M8 7v4 M8 5v.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  ),
  Warn: ({ size = 14, stroke = 1.6 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2.5l6 11h-12z" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M8 6.5v3 M8 11v.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  ),
};

// ─── Button ──────────────────────────────────────────────────────
function HTButton({ variant = 'primary', size = 'md', children, icon, iconRight, disabled, fullWidth, onClick, type = 'button', style = {} }) {
  const heights = { sm: 30, md: 36, lg: 44 };
  const px = { sm: 12, md: 14, lg: 18 };
  const fs = { sm: 12.5, md: 13.5, lg: 14.5 };
  const base = {
    height: heights[size],
    padding: `0 ${px[size]}px`,
    fontSize: fs[size],
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    letterSpacing: '-0.005em',
    borderRadius: 'var(--r-md)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 120ms, border-color 120ms, color 120ms, transform 120ms',
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap',
    border: '1px solid transparent',
    opacity: disabled ? 0.55 : 1,
    userSelect: 'none',
  };
  const variants = {
    primary: {
      background: 'var(--ink)',
      color: 'var(--surface-card)',
      border: '1px solid var(--ink)',
    },
    accent: {
      background: 'var(--sage-600)',
      color: '#fbfbf7',
      border: '1px solid var(--sage-700)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 1px 0 oklch(0.32 0.04 158)',
    },
    secondary: {
      background: 'var(--surface-card)',
      color: 'var(--ink)',
      border: '1px solid var(--line-strong)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink-1)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'var(--surface-card)',
      color: 'var(--danger)',
      border: '1px solid oklch(0.82 0.04 28)',
    },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
      {iconRight && <span style={{ display: 'inline-flex' }}>{iconRight}</span>}
    </button>
  );
}

// ─── Badge ───────────────────────────────────────────────────────
function HTBadge({ tone = 'neutral', children, dot, mono }) {
  const tones = {
    neutral: { bg: 'var(--surface-inset)', fg: 'var(--ink-1)', bd: 'var(--line)' },
    active:  { bg: 'oklch(0.94 0.03 150)', fg: 'var(--sage-700)', bd: 'oklch(0.85 0.04 150)' },
    archived:{ bg: 'var(--surface-inset)', fg: 'var(--ink-2)', bd: 'var(--line)' },
    warn:    { bg: 'var(--warn-soft)', fg: 'oklch(0.4 0.08 70)', bd: 'oklch(0.85 0.05 70)' },
    danger:  { bg: 'var(--danger-soft)', fg: 'var(--danger)', bd: 'oklch(0.85 0.05 28)' },
    sage:    { bg: 'var(--sage-50)', fg: 'var(--sage-700)', bd: 'oklch(0.86 0.035 150)' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 8px',
      background: t.bg, color: t.fg,
      border: `1px solid ${t.bd}`,
      borderRadius: 999,
      fontSize: 11.5,
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontWeight: 500,
      letterSpacing: mono ? '-0.01em' : '0.005em',
      lineHeight: 1,
      whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: 99, background: t.fg, opacity: 0.85 }} />}
      {children}
    </span>
  );
}

// ─── Schedule chip ────────────────────────────────────────────────
function ScheduleChip({ children, icon }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px',
      background: 'var(--surface-inset)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-sm)',
      fontSize: 11.5,
      color: 'var(--ink-1)',
      fontWeight: 500,
      lineHeight: 1.2,
    }}>
      {icon}
      {children}
    </span>
  );
}

// ─── Weekday strip (display) ──────────────────────────────────────
const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

function WeekdayStrip({ active = [0,1,2,3,4,5,6], size = 26 }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {WEEKDAYS.map((d, i) => {
        const on = active.includes(i);
        return (
          <span key={i} style={{
            width: size, height: size,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--r-sm)',
            fontSize: 11,
            fontWeight: 500,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.02em',
            color: on ? '#fbfbf7' : 'var(--ink-3)',
            background: on ? 'var(--sage-600)' : 'var(--surface-card)',
            border: `1px solid ${on ? 'var(--sage-700)' : 'var(--line)'}`,
            textTransform: 'uppercase',
          }}>{d}</span>
        );
      })}
    </div>
  );
}

// ─── Stat card (compact + large) ──────────────────────────────────
function StatCard({ label, value, unit, hint, accent, size = 'md', delta }) {
  const padding = size === 'lg' ? '18px 20px' : '14px 16px';
  const valueSize = size === 'lg' ? 34 : 26;
  return (
    <div style={{
      padding,
      background: 'var(--surface-card)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-md)',
      display: 'flex', flexDirection: 'column', gap: 6,
      minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{label}</span>
        {delta && (
          <span style={{ fontSize: 11, color: 'var(--sage-700)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
            {delta}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="ht-num" style={{ fontSize: valueSize, fontWeight: 500, color: accent || 'var(--ink)', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>{unit}</span>}
      </div>
      {hint && <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{hint}</span>}
    </div>
  );
}

// ─── Sparkline (single SVG path) ─────────────────────────────────
function Sparkline({ data, width = 120, height = 32, stroke = 'var(--sage-600)', fill = 'oklch(0.92 0.03 150)' }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = width / (data.length - 1 || 1);
  const points = data.map((v, i) => [i * stepX, height - 2 - ((v - min) / range) * (height - 4)]);
  const d = points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const dFill = `${d} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <path d={dFill} fill={fill} opacity={0.55} />
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r={2.5} fill={stroke} />
    </svg>
  );
}

// ─── Heatmap (year-style; weeks × 7 days) ────────────────────────
function Heatmap({ weeks = 26, cellSize = 12, gap = 3, seed = 1, density = 0.6, monthLabels = true, label }) {
  // Deterministic pseudo-random per seed.
  function rand(i) {
    let x = Math.sin(i * 9301 + seed * 49297) * 233280;
    return x - Math.floor(x);
  }
  const cells = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const r = rand(w * 7 + d);
      let level;
      if (r > 1 - density) {
        if (r > 0.97) level = 4;
        else if (r > 0.86) level = 3;
        else if (r > 0.68) level = 2;
        else level = 1;
      } else level = 0;
      cells.push(level);
    }
  }
  const colors = ['var(--heat-0)', 'var(--heat-1)', 'var(--heat-2)', 'var(--heat-3)', 'var(--heat-4)'];
  const width = weeks * cellSize + (weeks - 1) * gap;
  const height = 7 * cellSize + 6 * gap;

  // Month labels — every ~4 weeks
  const months = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
  const monthStarts = [];
  for (let m = 0; m < Math.floor(weeks / 4.34); m++) {
    monthStarts.push({ x: Math.floor(m * 4.34) * (cellSize + gap), label: months[m % 12] });
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 6 }}>
      {monthLabels && (
        <div style={{ position: 'relative', height: 12, width }}>
          {monthStarts.map((m, i) => (
            <span key={i} style={{
              position: 'absolute', left: m.x, top: 0,
              fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.04em',
              textTransform: 'uppercase', fontWeight: 500,
            }}>{m.label}</span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap }}>
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} style={{ display: 'flex', flexDirection: 'column', gap }}>
            {Array.from({ length: 7 }).map((_, d) => {
              const lvl = cells[w * 7 + d];
              return (
                <div key={d} style={{
                  width: cellSize, height: cellSize,
                  borderRadius: 3,
                  background: colors[lvl],
                  border: lvl === 0 ? '1px solid var(--line-soft)' : '1px solid transparent',
                  boxShadow: lvl > 0 ? 'inset 0 0 0 1px rgba(0,0,0,0.02)' : 'none',
                }} />
              );
            })}
          </div>
        ))}
      </div>
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>Меньше</span>
            {colors.map((c, i) => (
              <span key={i} style={{ width: 9, height: 9, borderRadius: 2, background: c, border: i === 0 ? '1px solid var(--line-soft)' : 'none' }} />
            ))}
            <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>Больше</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Compliance ring bar (linear, not circular) ───────────────────
function ComplianceBar({ value = 0.83, height = 6, label, showLabel = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label || 'Compliance'}</span>
          <span className="ht-num" style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-1)' }}>{Math.round(value * 100)}%</span>
        </div>
      )}
      <div style={{ position: 'relative', height, background: 'var(--surface-inset)', borderRadius: 99, overflow: 'hidden', border: '1px solid var(--line-soft)' }}>
        <div style={{
          position: 'absolute', inset: 0,
          width: `${value * 100}%`,
          background: 'linear-gradient(90deg, var(--sage-500), var(--sage-600))',
          borderRadius: 99,
        }} />
      </div>
    </div>
  );
}

// ─── Top app header — shared (v3 polish) ─────────────────────────
function AppHeader({ active = 'today' }) {
  const items = [
    { id: 'today', label: 'Сегодня' },
    { id: 'habits', label: 'Привычки' },
    { id: 'history', label: 'История' },
    { id: 'stats', label: 'Статистика' },
  ];
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 24px',
      borderBottom: '1px solid var(--line)',
      background: 'var(--surface-card)',
      gap: 24,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--surface-card)',
          position: 'relative',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1.5" y="1.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.4"/>
            <rect x="6" y="1.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.7"/>
            <rect x="1.5" y="6" width="3.5" height="3.5" rx="0.5" fill="currentColor"/>
            <rect x="6" y="6" width="3.5" height="3.5" rx="0.5" fill="currentColor" opacity="0.7"/>
            <rect x="10.5" y="6" width="2" height="3.5" rx="0.5" fill="currentColor" opacity="0.4"/>
            <rect x="1.5" y="10.5" width="3.5" height="2" rx="0.5" fill="currentColor" opacity="0.55"/>
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.012em' }}>HabitTrack</span>
        <span style={{
          fontSize: 10.5, color: 'var(--ink-3)',
          fontFamily: 'var(--font-mono)',
          padding: '2px 6px',
          background: 'var(--surface-inset)',
          border: '1px solid var(--line)',
          borderRadius: 4,
          letterSpacing: '0.04em',
          marginLeft: 4,
        }}>v0.1</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: 2 }}>
        {items.map((it) => {
          const on = it.id === active;
          return (
            <a key={it.id} href="#" style={{
              padding: '8px 14px',
              fontSize: 13,
              color: on ? 'var(--ink)' : 'var(--ink-2)',
              background: 'transparent',
              borderRadius: 'var(--r-sm)',
              fontWeight: 500,
              textDecoration: 'none',
              position: 'relative',
              letterSpacing: '-0.005em',
            }}>
              {it.label}
              {on && (
                <span style={{
                  position: 'absolute',
                  left: 14, right: 14, bottom: -13,
                  height: 2,
                  background: 'var(--sage-600)',
                  borderRadius: '2px 2px 0 0',
                }} />
              )}
            </a>
          );
        })}
      </nav>

      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          height: 32, padding: '0 12px 0 10px',
          background: 'var(--surface-inset)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-md)',
          color: 'var(--ink-2)', fontSize: 12.5, cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
        }}>
          <Icon.Search size={13} />
          <span>Поиск привычек</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-3)',
            padding: '1px 5px',
            background: 'var(--surface-card)',
            border: '1px solid var(--line)',
            borderRadius: 4,
            marginLeft: 8,
          }}>⌘K</span>
        </button>
        <button title="Уведомления · 2 новых" style={{
          width: 32, height: 32, borderRadius: 'var(--r-md)',
          background: 'var(--surface-inset)', border: '1px solid var(--line)',
          color: 'var(--ink-1)', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <Icon.Bell size={14} />
          <span style={{
            position: 'absolute', top: 5, right: 6,
            width: 6, height: 6, borderRadius: 99,
            background: 'var(--sage-500)',
            border: '1.5px solid var(--surface-inset)',
          }} />
        </button>
        <div style={{ width: 1, height: 22, background: 'var(--line)', margin: '0 4px' }} />
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '3px 9px 3px 3px',
          background: 'transparent',
          border: '1px solid transparent',
          borderRadius: 99,
          cursor: 'pointer',
        }}>
          <span style={{
            width: 26, height: 26, borderRadius: 99,
            background: 'linear-gradient(135deg, oklch(0.65 0.085 155), oklch(0.42 0.07 165))',
            color: '#fbfbf7', fontWeight: 500, fontSize: 10.5,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.02em',
            border: '1.5px solid var(--surface-card)',
            boxShadow: '0 0 0 1px var(--line)',
          }}>АЛ</span>
          <span style={{ fontSize: 12.5, color: 'var(--ink-1)', fontWeight: 500 }}>Алексей</span>
        </button>
      </div>
    </header>
  );
}

// Export to window for cross-file React access
Object.assign(window, {
  Icon, HTButton, HTBadge, ScheduleChip, WeekdayStrip,
  StatCard, Sparkline, Heatmap, ComplianceBar, AppHeader,
  WEEKDAYS,
});
