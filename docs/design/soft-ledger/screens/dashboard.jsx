/* HabitTrack — Dashboard screen v2 (stronger hierarchy, bigger metrics) */

function DashboardScreen() {
  const today = '17 мая, вторник';

  // ── Mock data ───────────────────────────────────────────────────
  const habits = [
    {
      id: 'h1',
      title: 'Утренняя медитация',
      tag: '15 минут · 06:55',
      schedule: 'Ежедневно',
      scheduleDays: [0,1,2,3,4,5,6],
      streak: 47,
      compliance: 0.92,
      completions: 184,
      sparkline: [3,4,3,4,2,4,4,3,4,4,4,3,4,4],
      doneToday: true,
      seed: 11,
      slot: 'утро',
    },
    {
      id: 'h2',
      title: 'Английский — Anki',
      tag: '40 карточек',
      schedule: 'Пн–Пт',
      scheduleDays: [0,1,2,3,4],
      streak: 12,
      compliance: 0.84,
      completions: 96,
      sparkline: [2,3,3,4,3,4,3,3,4,4,3,4,4,3],
      doneToday: false,
      seed: 22,
      slot: 'день',
    },
    {
      id: 'h3',
      title: 'Силовая тренировка',
      tag: '60 минут · зал',
      schedule: 'Пн / Ср / Пт',
      scheduleDays: [0,2,4],
      streak: 8,
      compliance: 0.78,
      completions: 64,
      sparkline: [2,3,2,3,4,3,4,3,4,3,4,4,3,4],
      doneToday: false,
      seed: 33,
      slot: 'день',
    },
    {
      id: 'h4',
      title: 'Чтение перед сном',
      tag: '30 страниц',
      schedule: 'Ежедневно',
      scheduleDays: [0,1,2,3,4,5,6],
      streak: 22,
      compliance: 0.88,
      completions: 156,
      sparkline: [3,3,4,4,3,4,4,3,4,3,4,4,4,3],
      doneToday: true,
      seed: 44,
      slot: 'вечер',
    },
    {
      id: 'h5',
      title: 'Прогулка · 10 000 шагов',
      tag: 'на воздухе',
      schedule: 'Ежедневно',
      scheduleDays: [0,1,2,3,4,5,6],
      streak: 3,
      compliance: 0.61,
      completions: 41,
      sparkline: [2,1,3,2,4,3,1,2,3,4,3,2,3,4],
      doneToday: false,
      seed: 55,
      slot: 'день',
    },
    {
      id: 'h6',
      title: 'Никаких соцсетей до 11:00',
      tag: 'утренний фокус',
      schedule: 'Пн–Пт',
      scheduleDays: [0,1,2,3,4],
      streak: 19,
      compliance: 0.81,
      completions: 88,
      sparkline: [3,4,3,4,4,3,4,3,4,4,3,4,4,3],
      doneToday: true,
      seed: 66,
      slot: 'утро',
    },
  ];

  const completedToday = habits.filter(h => h.doneToday).length;
  const totalToday = habits.length;
  const todayProgress = completedToday / totalToday;

  return (
    <div className="ht-root" style={{ width: 1280, minHeight: 880, display: 'flex', flexDirection: 'column' }}>
      <AppHeader active="today" />

      {/* ── HERO: big greeting + today's gauge + month KPI strip ──── */}
      <section style={{ padding: '32px 28px 0' }}>
        <div style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
        }}>
          {/* Top hero row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 0 }}>
            {/* Left — greeting block */}
            <div style={{ padding: '28px 32px 28px', display: 'flex', flexDirection: 'column', gap: 14, borderRight: '1px solid var(--line)' }}>
              <div className="ht-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--sage-500)' }} />
                {today.toUpperCase()} · НЕДЕЛЯ 20 · 2026
              </div>
              <h1 style={{ fontSize: 38, fontWeight: 500, margin: 0, letterSpacing: '-0.025em', lineHeight: 1.05, color: 'var(--ink)' }}>
                Доброе утро, Алексей.
              </h1>
              <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: 0, maxWidth: 460, lineHeight: 1.55 }}>
                Три привычки уже отмечены. Осталось три — лучшее время начать с самой простой,
                пока энергии достаточно.
              </p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
                <HTButton variant="accent" size="lg" icon={<Icon.Check size={14} stroke={2} />}>Отметить ближайшую</HTButton>
                <HTButton variant="secondary" size="lg" icon={<Icon.Plus size={13} />}>Новая привычка</HTButton>
              </div>
            </div>

            {/* Right — TODAY gauge (huge counter + ring of dots) */}
            <div style={{ padding: '28px 32px', background: 'linear-gradient(180deg, oklch(0.96 0.018 150) 0%, oklch(0.94 0.022 150) 100%)', display: 'flex', flexDirection: 'column', gap: 18, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="ht-eyebrow" style={{ color: 'var(--sage-700)' }}>СЕГОДНЯ · ПРОГРЕСС</span>
                <HTBadge tone="sage" mono dot>в графике</HTBadge>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span className="ht-num" style={{ fontSize: 76, fontWeight: 500, color: 'var(--sage-700)', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
                    {completedToday}
                  </span>
                  <span className="ht-num" style={{ fontSize: 32, fontWeight: 500, color: 'var(--sage-600)', opacity: 0.6, letterSpacing: '-0.03em' }}>/ {totalToday}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', paddingBottom: 6 }}>
                  <span className="ht-num" style={{ fontSize: 13, color: 'var(--sage-700)', fontWeight: 500 }}>{Math.round(todayProgress * 100)}%</span>
                  <span style={{ fontSize: 11, color: 'var(--sage-700)', opacity: 0.75 }}>выполнено</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Heavy progress bar */}
                <div style={{ position: 'relative', height: 10, background: 'oklch(0.9 0.025 150)', borderRadius: 99, overflow: 'hidden', border: '1px solid oklch(0.83 0.04 150)' }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    width: `${todayProgress * 100}%`,
                    background: 'linear-gradient(90deg, var(--sage-500), var(--sage-600))',
                    borderRadius: 99,
                  }} />
                </div>
                {/* Today dot rail — 6 dots */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  {habits.map((h, i) => (
                    <span key={i} style={{
                      width: 14, height: 14, borderRadius: 99,
                      background: h.doneToday ? 'var(--sage-600)' : 'transparent',
                      border: `1.5px solid ${h.doneToday ? 'var(--sage-700)' : 'oklch(0.78 0.05 150)'}`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fbfbf7',
                    }}>
                      {h.doneToday && <Icon.Check size={9} stroke={2.6} />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* KPI strip — full width, 4 columns */}
          <div style={{ borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--line)' }}>
            <HeroKPI label="Лучший streak" value="47" unit="дн" trend="↑ 12 за месяц" icon={<Icon.Flame size={13} />} highlight />
            <HeroKPI label="Compliance · 30 дней" value="84" unit="%" trend="↑ 4% к прошлому" />
            <HeroKPI label="Активных привычек" value="6" unit="" trend="2 ежедневно · 4 по дням" />
            <HeroKPI label="Отметок всего" value="629" unit="" trend="за 5 месяцев" />
          </div>
        </div>
      </section>

      {/* ── YEAR HEATMAP — full width framed panel ─────────────── */}
      <section style={{ padding: '20px 28px 0' }}>
        <div style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 24px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div className="ht-eyebrow" style={{ marginBottom: 6 }}>КАРТА РЕГУЛЯРНОСТИ</div>
              <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0, letterSpacing: '-0.015em' }}>
                <span className="ht-num">365</span> дней дисциплины
              </h2>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 4 }}>
                Каждая ячейка — день. Цвет — сколько привычек выполнено из запланированных.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
              <FootStat label="Идеальных дней" value="184" />
              <FootStat label="Идеальных недель" value="14" />
              <FootStat label="Пропусков" value="38" />
              <div style={{ width: 1, height: 36, background: 'var(--line)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: 4 }}>Меньше</span>
                <span style={{ width: 11, height: 11, borderRadius: 2, background: 'var(--heat-0)', border: '1px solid var(--line-soft)' }} />
                <span style={{ width: 11, height: 11, borderRadius: 2, background: 'var(--heat-1)' }} />
                <span style={{ width: 11, height: 11, borderRadius: 2, background: 'var(--heat-2)' }} />
                <span style={{ width: 11, height: 11, borderRadius: 2, background: 'var(--heat-3)' }} />
                <span style={{ width: 11, height: 11, borderRadius: 2, background: 'var(--heat-4)' }} />
                <span style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 4 }}>Больше</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '4px 24px 22px', background: 'var(--surface-inset)', borderTop: '1px solid var(--line-soft)' }}>
            <div style={{ padding: '18px 0 0' }}>
              <Heatmap weeks={52} cellSize={13} gap={4} seed={5} density={0.72} monthLabels={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ── TODAY — habit cards ────────────────────────────────── */}
      <section style={{ padding: '24px 28px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div className="ht-eyebrow" style={{ marginBottom: 6 }}>СЕГОДНЯ · ВТОРНИК</div>
            <h2 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', margin: 0 }}>
              Привычки на сегодня
            </h2>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>
              <span className="ht-num" style={{ fontWeight: 500, color: 'var(--ink)' }}>{totalToday}</span> запланировано
              <span style={{ opacity: 0.4, margin: '0 8px' }}>·</span>
              <span className="ht-num" style={{ fontWeight: 500, color: 'var(--sage-700)' }}>{completedToday}</span> выполнено
              <span style={{ opacity: 0.4, margin: '0 8px' }}>·</span>
              <span className="ht-num" style={{ fontWeight: 500, color: 'var(--ink-1)' }}>{totalToday - completedToday}</span> в ожидании
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, background: 'var(--surface-inset)', border: '1px solid var(--line)', padding: 3, borderRadius: 'var(--r-md)' }}>
            <SegmentTab active>Активные</SegmentTab>
            <SegmentTab>Все</SegmentTab>
            <SegmentTab>Архив</SegmentTab>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {habits.map(h => <HabitCard key={h.id} habit={h} />)}
        </div>

        {/* Create habit dashed tile */}
        <button style={{
          marginTop: 6,
          padding: '22px 24px',
          background: 'transparent',
          border: '1.5px dashed var(--line-strong)',
          borderRadius: 'var(--r-lg)',
          color: 'var(--ink-2)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{
              width: 40, height: 40, borderRadius: 'var(--r-md)',
              background: 'var(--surface-card)', border: '1px solid var(--line-strong)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--ink-1)',
            }}><Icon.Plus size={16} stroke={2} /></span>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink)' }}>Добавить ещё одну привычку</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 3 }}>
                Лучше 1–2 регулярных, чем десять забытых. Начните с малого.
              </div>
            </div>
          </div>
          <Icon.ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}

// ─── Hero KPI cell ──────────────────────────────────────────────
function HeroKPI({ label, value, unit, trend, icon, highlight }) {
  return (
    <div style={{
      padding: '20px 22px',
      background: 'var(--surface-card)',
      display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="ht-eyebrow">{label}</span>
        {icon && <span style={{ color: highlight ? 'var(--sage-700)' : 'var(--ink-3)', display: 'inline-flex' }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="ht-num" style={{
          fontSize: 40, fontWeight: 500,
          color: highlight ? 'var(--sage-700)' : 'var(--ink)',
          lineHeight: 1, letterSpacing: '-0.03em',
        }}>{value}</span>
        {unit && <span style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 500 }}>{unit}</span>}
      </div>
      {trend && (
        <span style={{
          fontSize: 11.5,
          color: highlight ? 'var(--sage-700)' : 'var(--ink-2)',
          fontFamily: 'var(--font-mono)',
        }}>{trend}</span>
      )}
    </div>
  );
}

function FootStat({ label, value, unit }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span className="ht-eyebrow">{label}</span>
      <span className="ht-num" style={{ fontSize: 18, color: 'var(--ink)', fontWeight: 500, lineHeight: 1 }}>
        {value}{unit && <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 2 }}>{unit}</span>}
      </span>
    </div>
  );
}

function SegmentTab({ children, active, title }) {
  return (
    <button title={title} style={{
      padding: '6px 12px',
      fontSize: 12.5,
      fontWeight: 500,
      color: active ? 'var(--ink)' : 'var(--ink-2)',
      background: active ? 'var(--surface-card)' : 'transparent',
      border: active ? '1px solid var(--line)' : '1px solid transparent',
      borderRadius: 'var(--r-sm)',
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>{children}</button>
  );
}

function IconGrid() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="2" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
function IconList() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10 M3 8h10 M3 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Habit Card v3 — cleaner hierarchy, one primary metric ───
function HabitCard({ habit }) {
  const { title, tag, schedule, scheduleDays, streak, compliance, completions, sparkline, doneToday, seed, slot } = habit;
  return (
    <article style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top — check + title + meta on one line; right-aligned streak */}
      <div style={{ padding: '16px 18px 14px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <button style={{
          width: 30, height: 30,
          flexShrink: 0,
          marginTop: 1,
          borderRadius: 'var(--r-sm)',
          background: doneToday ? 'var(--sage-600)' : 'var(--surface-card)',
          border: `1.5px solid ${doneToday ? 'var(--sage-700)' : 'var(--line-strong)'}`,
          color: doneToday ? '#fbfbf7' : 'transparent',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: doneToday ? 'inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
        }}>
          <Icon.Check size={14} stroke={2.4} />
        </button>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ fontSize: 15.5, fontWeight: 500, margin: 0, letterSpacing: '-0.008em', color: 'var(--ink)' }}>{title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon.Calendar size={11} /> {schedule}
            </span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{tag}</span>
          </div>
        </div>
        {/* Right: dominant streak number */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, color: 'var(--sage-700)' }}>
            <Icon.Flame size={12} />
            <span className="ht-num" style={{ fontSize: 24, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em' }}>{streak}</span>
            <span style={{ fontSize: 11, opacity: 0.75 }}>дн</span>
          </div>
          <span className="ht-eyebrow" style={{ color: 'var(--sage-700)', marginTop: 4 }}>STREAK</span>
        </div>
      </div>

      <div className="ht-divider-soft" />

      {/* Middle — heatmap (left, dominant) + small stats stack (right) */}
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, background: 'var(--surface-inset)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Heatmap weeks={20} cellSize={10} gap={2.5} seed={seed} density={compliance} monthLabels={false} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0, alignItems: 'flex-end' }}>
          <InlineStat label="compliance" value={`${Math.round(compliance * 100)}%`} />
          <InlineStat label="отметок" value={completions} />
        </div>
      </div>

      <div className="ht-divider-soft" />

      {/* Bottom — schedule mini-strip + action */}
      <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <WeekdayStripMini active={scheduleDays} />
          {doneToday && (
            <span style={{ fontSize: 11.5, color: 'var(--sage-700)', fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon.Check size={11} stroke={2.2} /> 07:14
            </span>
          )}
        </div>
        {doneToday ? (
          <button style={{
            padding: '6px 11px',
            fontSize: 12, fontWeight: 500,
            color: 'var(--sage-700)',
            background: 'transparent', border: '1px solid oklch(0.78 0.055 150)',
            borderRadius: 'var(--r-sm)', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
          }}>
            Выполнено сегодня
          </button>
        ) : (
          <HTButton size="sm" variant="accent" icon={<Icon.Check size={12} stroke={2} />}>Отметить</HTButton>
        )}
      </div>
    </article>
  );
}

function InlineStat({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
      <span className="ht-num" style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1 }}>{value}</span>
      <span className="ht-eyebrow">{label.toUpperCase()}</span>
    </div>
  );
}

function WeekdayStripMini({ active }) {
  return (
    <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
      {WEEKDAYS.map((d, i) => {
        const on = active.includes(i);
        return (
          <span key={i} style={{
            width: 20, height: 20,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 4,
            fontSize: 9.5,
            fontWeight: 500,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.02em',
            color: on ? 'var(--sage-700)' : 'var(--ink-4)',
            background: on ? 'oklch(0.92 0.035 150)' : 'transparent',
            border: `1px solid ${on ? 'oklch(0.82 0.05 150)' : 'var(--line-soft)'}`,
            textTransform: 'uppercase',
          }}>{d.charAt(0)}</span>
        );
      })}
    </div>
  );
}

function CardMetric({ label, value, unit, icon, accent }) {
  return (
    <div style={{ padding: '12px 14px', background: 'var(--surface-card)', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span className="ht-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: accent ? 'var(--sage-700)' : 'var(--ink-3)' }}>
        {icon} {label.toUpperCase()}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span className="ht-num" style={{ fontSize: 22, fontWeight: 500, color: accent ? 'var(--sage-700)' : 'var(--ink)', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{unit}</span>}
      </div>
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
