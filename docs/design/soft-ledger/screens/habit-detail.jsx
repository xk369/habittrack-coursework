/* HabitTrack — Habit Detail v2 (deeper than Dashboard, command-center for one habit) */

function HabitDetailScreen() {
  const habit = {
    title: 'Утренняя медитация',
    purpose: 'Каждое утро 15 минут осознанной практики. Помогает спокойнее реагировать на дедлайны и держать ровный фокус в течение дня.',
    schedule: 'Ежедневно',
    scheduleDays: [0,1,2,3,4,5,6],
    status: 'active',
    createdAt: '12 января 2026',
    daysOld: 126,
    streak: 47,
    bestStreak: 64,
    compliance: 0.92,
    scheduled: 126,
    completed: 116,
    misses: 10,
    nextReminder: '06:55',
    sparkline30: [3,4,3,4,2,4,4,3,4,4,4,3,4,4,4,3,4,4,3,4,4,4,3,4,4,4,4,3,4,4],
    weeklyBars: [
      { w: 'W14', v: 7, t: 7 },
      { w: 'W15', v: 6, t: 7 },
      { w: 'W16', v: 7, t: 7 },
      { w: 'W17', v: 7, t: 7 },
      { w: 'W18', v: 5, t: 7 },
      { w: 'W19', v: 7, t: 7 },
      { w: 'W20', v: 2, t: 2 },
    ],
  };

  const history = [
    { month: 'Май 2026', completed: 12, total: 17, entries: [
      { date: '17', weekday: 'вт', time: '07:14', note: 'сегодня', current: true },
      { date: '16', weekday: 'пн', time: '07:22' },
      { date: '15', weekday: 'вс', time: '08:01' },
      { date: '14', weekday: 'сб', time: '08:18' },
      { date: '13', weekday: 'пт', time: '07:09' },
      { date: '12', weekday: 'чт', time: '07:31' },
      { date: '11', weekday: 'ср', time: '07:05' },
    ]},
    { month: 'Апрель 2026', completed: 28, total: 30, entries: [
      { date: '30', weekday: 'ср', time: '07:18' },
      { date: '29', weekday: 'вт', time: '07:42' },
      { date: '28', weekday: 'пн', time: '—', skip: true, reason: 'Пропуск · командировка' },
      { date: '27', weekday: 'вс', time: '08:30' },
      { date: '26', weekday: 'сб', time: '08:11' },
    ]},
  ];

  return (
    <div className="ht-root" style={{ width: 1280, minHeight: 880, display: 'flex', flexDirection: 'column' }}>
      <AppHeader active="habits" />

      {/* Breadcrumb */}
      <div style={{ padding: '14px 28px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-3)' }}>
        <a href="#" style={{ color: 'var(--ink-3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon.ArrowLeft size={12} /> Все привычки
        </a>
        <span style={{ opacity: 0.5 }}>/</span>
        <span style={{ color: 'var(--ink-1)' }}>{habit.title}</span>
      </div>

      {/* ── HERO STRIP — title + status + actions ─────────────── */}
      <section style={{ padding: '16px 28px 0' }}>
        <div style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '24px 28px 22px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 28, alignItems: 'flex-start' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <HTBadge tone="active" dot>active</HTBadge>
                <span style={{ fontSize: 11.5, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
                  HABIT_8F3A · СОЗДАНА {habit.createdAt.toUpperCase()} · {habit.daysOld} ДНЕЙ В РАБОТЕ
                </span>
              </div>
              <h1 style={{ fontSize: 42, fontWeight: 500, margin: 0, letterSpacing: '-0.025em', lineHeight: 1.02, color: 'var(--ink)' }}>{habit.title}</h1>
              <p style={{ fontSize: 14.5, color: 'var(--ink-2)', margin: '12px 0 0', maxWidth: 620, lineHeight: 1.55 }}>{habit.purpose}</p>

              {/* Schedule meta inline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="ht-eyebrow">РАСПИСАНИЕ</span>
                  <WeekdayStrip active={habit.scheduleDays} size={28} />
                </div>
                <div style={{ width: 1, height: 22, background: 'var(--line)' }} />
                <span style={{ fontSize: 12.5, color: 'var(--ink-1)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Icon.Calendar size={12} /> {habit.schedule}
                </span>
                <span style={{ fontSize: 12.5, color: 'var(--ink-1)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Icon.Bell size={12} /> напоминание <strong className="ht-num" style={{ fontWeight: 500, color: 'var(--ink)' }}>{habit.nextReminder}</strong>
                </span>
                <span style={{ fontSize: 12.5, color: 'var(--ink-1)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  → следующая <strong style={{ fontWeight: 500, color: 'var(--ink)' }}>завтра в 07:00</strong>
                </span>
              </div>
            </div>

            {/* Right side — primary action stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch', minWidth: 240 }}>
              <HTButton variant="accent" size="lg" icon={<Icon.Check size={14} stroke={2} />} fullWidth>Отметить сегодня</HTButton>
              <div style={{ display: 'flex', gap: 6 }}>
                <HTButton variant="secondary" size="sm" icon={<Icon.Edit size={12} />} fullWidth>Изменить</HTButton>
                <HTButton variant="secondary" size="sm" icon={<Icon.Archive size={12} />} fullWidth>В архив</HTButton>
                <button title="Удалить" style={{
                  width: 30, height: 30, flexShrink: 0,
                  background: 'var(--surface-card)',
                  border: '1px solid oklch(0.82 0.05 28)',
                  borderRadius: 'var(--r-md)',
                  color: 'var(--danger)',
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}><Icon.Trash size={13} /></button>
              </div>
            </div>
          </div>

          {/* KPI strip — 4 huge metric cells */}
          <div style={{ borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--line)' }}>
            <BigMetric label="CURRENT STREAK" value={habit.streak} unit="дн" sub={`Лучший · ${habit.bestStreak} дней`} icon={<Icon.Flame size={14} />} primary />
            <BigMetric label="COMPLIANCE" value={`${Math.round(habit.compliance * 100)}`} unit="%" sub="за всё время" />
            <BigMetric label="SCHEDULED" value={habit.scheduled} sub="дней по расписанию" />
            <BigMetric label="COMPLETED" value={habit.completed} sub={`пропущено · ${habit.misses}`} />
          </div>
        </div>
      </section>

      {/* ── MAIN GRID — visualisations | history ─────────────── */}
      <section style={{ padding: '18px 28px 28px', display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* ─── LEFT: visualisations ─────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Year heatmap panel */}
          <div style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 22px 12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <div className="ht-eyebrow" style={{ marginBottom: 5 }}>КАРТА ВЫПОЛНЕНИЯ</div>
                <h3 style={{ fontSize: 17, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>
                  <span className="ht-num" style={{ color: 'var(--sage-700)' }}>116</span> из 126 запланированных дней
                </h3>
              </div>
              <div style={{ display: 'flex', gap: 4, background: 'var(--surface-inset)', border: '1px solid var(--line)', padding: 3, borderRadius: 'var(--r-md)' }}>
                <SegTab>Год</SegTab>
                <SegTab active>6 мес.</SegTab>
                <SegTab>3 мес.</SegTab>
                <SegTab>Месяц</SegTab>
              </div>
            </div>
            <div className="ht-divider-soft" />
            <div style={{ padding: '20px 22px 18px', background: 'var(--surface-inset)' }}>
              <Heatmap weeks={26} cellSize={18} gap={5} seed={11} density={0.92} monthLabels={true} />
            </div>
            <div className="ht-divider-soft" />
            <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-2)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
                <span><span className="ht-eyebrow">ОТМЕТКИ </span><strong className="ht-num" style={{ fontWeight: 500, color: 'var(--ink)' }}>116</strong></span>
                <span><span className="ht-eyebrow">ПРОПУСКИ </span><strong className="ht-num" style={{ fontWeight: 500, color: 'var(--ink)' }}>10</strong></span>
                <span><span className="ht-eyebrow">ИДЕАЛЬНЫХ НЕДЕЛЬ </span><strong className="ht-num" style={{ fontWeight: 500, color: 'var(--ink)' }}>11</strong></span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: 4 }}>Меньше</span>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--heat-0)', border: '1px solid var(--line-soft)' }} />
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--heat-1)' }} />
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--heat-2)' }} />
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--heat-3)' }} />
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--heat-4)' }} />
                <span style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 4 }}>Больше</span>
              </span>
            </div>
          </div>

          {/* Two-up: sparkline + weekly bars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
            {/* Sparkline panel */}
            <div style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-lg)',
              padding: '18px 22px',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div className="ht-eyebrow" style={{ marginBottom: 4 }}>COMPLIANCE · 30 ДНЕЙ</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span className="ht-num" style={{ fontSize: 32, fontWeight: 500, color: 'var(--ink)', lineHeight: 1 }}>92</span>
                    <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>%</span>
                    <span style={{ fontSize: 12, color: 'var(--sage-700)', fontFamily: 'var(--font-mono)', marginLeft: 4 }}>↑ 6%</span>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>vs. предыдущий период</span>
              </div>
              <div style={{ marginTop: 4 }}>
                <Sparkline data={habit.sparkline30} width={420} height={62} />
              </div>
            </div>

            {/* Weekly bars panel */}
            <div style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-lg)',
              padding: '18px 22px',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div>
                <div className="ht-eyebrow" style={{ marginBottom: 4 }}>ПО НЕДЕЛЯМ · 7 ПОСЛЕДНИХ</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span className="ht-num" style={{ fontSize: 28, fontWeight: 500, color: 'var(--ink)', lineHeight: 1 }}>11</span>
                  <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>идеальных недель</span>
                </div>
              </div>
              <WeeklyBars data={habit.weeklyBars} />
            </div>
          </div>
        </div>

        {/* ─── RIGHT: history (livelier rhythm) ─────────────────── */}
        <aside style={{
          display: 'flex', flexDirection: 'column', gap: 14,
          alignSelf: 'stretch',
        }}>
          {/* TODAY · hero card */}
          <div style={{
            background: 'linear-gradient(180deg, oklch(0.96 0.025 150) 0%, oklch(0.94 0.03 150) 100%)',
            border: '1px solid oklch(0.78 0.06 150)',
            borderRadius: 'var(--r-lg)',
            padding: '18px 20px',
            display: 'flex', flexDirection: 'column', gap: 14,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div className="ht-eyebrow" style={{ color: 'var(--sage-700)', marginBottom: 4 }}>СЕГОДНЯ · 17 МАЯ</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span className="ht-num" style={{ fontSize: 30, fontWeight: 500, color: 'var(--sage-700)', letterSpacing: '-0.03em', lineHeight: 1 }}>47-й</span>
                  <span style={{ fontSize: 13, color: 'var(--sage-ink)' }}>день подряд</span>
                </div>
              </div>
              <span style={{
                width: 38, height: 38, borderRadius: 'var(--r-md)',
                background: 'var(--sage-600)',
                border: '1.5px solid var(--sage-700)',
                color: '#fbfbf7',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
              }}><Icon.Check size={18} stroke={2.4} /></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: 'var(--sage-ink)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon.Check size={11} stroke={2} />
                <span className="ht-num" style={{ fontWeight: 500 }}>07:14</span>
              </span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon.Flame size={11} /> до лучшего · <span className="ht-num" style={{ fontWeight: 500 }}>17 дней</span>
              </span>
            </div>
            <button style={{
              padding: '8px 12px',
              fontSize: 12, fontWeight: 500,
              color: 'var(--sage-700)',
              background: 'rgba(255,255,255,0.45)',
              border: '1px solid oklch(0.82 0.055 150)',
              borderRadius: 'var(--r-sm)', cursor: 'pointer',
              alignSelf: 'flex-start',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              <Icon.Close size={10} /> снять отметку
            </button>
          </div>

          {/* THIS WEEK strip */}
          <div style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            padding: '14px 18px',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="ht-eyebrow">ЭТА НЕДЕЛЯ</span>
              <span style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>
                <span className="ht-num" style={{ fontWeight: 500, color: 'var(--ink)' }}>5</span> из 7 запланированных
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {[
                { d: 'пн', n: 12, t: '07:09', done: true },
                { d: 'вт', n: 13, t: '07:31', done: true },
                { d: 'ср', n: 14, t: '07:05', done: true },
                { d: 'чт', n: 15, t: '08:01', done: true },
                { d: 'пт', n: 16, t: '07:22', done: true },
                { d: 'сб', n: 17, t: '07:14', done: true, today: true },
                { d: 'вс', n: 18, t: '', done: false, future: true },
              ].map((day, i) => (
                <div key={i} style={{
                  padding: '8px 4px 8px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  background: day.today ? 'oklch(0.95 0.025 150)' : (day.done ? 'var(--surface-card)' : 'var(--surface-inset)'),
                  border: `1px solid ${day.today ? 'oklch(0.78 0.06 150)' : 'var(--line-soft)'}`,
                  borderRadius: 'var(--r-sm)',
                }}>
                  <span style={{ fontSize: 9.5, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{day.d}</span>
                  <span className="ht-num" style={{ fontSize: 14, fontWeight: 500, color: day.future ? 'var(--ink-3)' : 'var(--ink)' }}>{day.n}</span>
                  <span style={{
                    width: 18, height: 18, borderRadius: 99,
                    background: day.done ? 'var(--sage-600)' : 'transparent',
                    border: `1.5px solid ${day.done ? 'var(--sage-700)' : (day.future ? 'var(--line)' : 'var(--line-strong)')}`,
                    color: '#fbfbf7',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {day.done && <Icon.Check size={10} stroke={2.4} />}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* HISTORY list panel */}
          <div style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            overflow: 'hidden',
            flex: 1,
          }}>
            <div style={{ padding: '14px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="ht-eyebrow">ВСЯ ИСТОРИЯ</span>
                <div style={{ fontSize: 13.5, fontWeight: 500, marginTop: 3 }}>
                  <span className="ht-num">116</span> отметок за <span className="ht-num">126</span> дней
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{
                  fontSize: 11.5, color: 'var(--ink-2)',
                  padding: '5px 9px',
                  background: 'var(--surface-card)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-sm)', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>Фильтр</button>
                <button style={{
                  fontSize: 11.5, color: 'var(--ink-2)',
                  padding: '5px 9px',
                  background: 'var(--surface-card)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-sm)', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>CSV <Icon.ArrowRight size={11} /></button>
              </div>
            </div>
            <div className="ht-divider" />

            {history.map((group, gi) => (
              <div key={gi}>
                <div style={{
                  padding: '9px 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: '1px solid var(--line-soft)',
                  background: 'var(--surface-inset)',
                }}>
                  <span className="ht-eyebrow">{group.month.toUpperCase()}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 64, height: 4, background: 'oklch(0.88 0.014 78)', borderRadius: 99, overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: `${(group.completed/group.total)*100}%`, background: 'var(--sage-600)', borderRadius: 99 }} />
                    </span>
                    <span className="ht-num" style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink-1)' }}>{group.completed} / {group.total}</span>
                  </div>
                </div>
                {group.entries.filter(e => !e.current).map((e, i, arr) => (
                  <HistoryRow key={i} entry={e} last={i === arr.length - 1} />
                ))}
              </div>
            ))}

            <div style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-inset)', borderTop: '1px solid var(--line)' }}>
              <span style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>Показано <span className="ht-num">11</span> из <span className="ht-num">116</span></span>
              <HTButton size="sm" variant="secondary" iconRight={<Icon.ArrowRight size={11} />}>Все записи</HTButton>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

// ─── BigMetric — used in the hero KPI strip ─────────────────────
function BigMetric({ label, value, unit, sub, icon, primary }) {
  return (
    <div style={{
      padding: '22px 24px',
      background: primary ? 'linear-gradient(180deg, oklch(0.96 0.022 150), oklch(0.94 0.028 150))' : 'var(--surface-card)',
      display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="ht-eyebrow" style={{ color: primary ? 'var(--sage-700)' : 'var(--ink-3)' }}>{label}</span>
        {icon && <span style={{ color: primary ? 'var(--sage-700)' : 'var(--ink-3)' }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span className="ht-num" style={{ fontSize: 48, fontWeight: 500, color: primary ? 'var(--sage-700)' : 'var(--ink)', lineHeight: 1, letterSpacing: '-0.035em' }}>{value}</span>
        {unit && <span style={{ fontSize: 15, color: primary ? 'var(--sage-700)' : 'var(--ink-3)' }}>{unit}</span>}
      </div>
      {sub && <span style={{ fontSize: 11.5, color: primary ? 'var(--sage-700)' : 'var(--ink-2)', fontFamily: 'var(--font-mono)' }}>{sub}</span>}
    </div>
  );
}

function SegTab({ children, active }) {
  return (
    <button style={{
      padding: '5px 10px',
      fontSize: 11.5,
      fontWeight: 500,
      color: active ? 'var(--ink)' : 'var(--ink-2)',
      background: active ? 'var(--surface-card)' : 'transparent',
      border: active ? '1px solid var(--line)' : '1px solid transparent',
      borderRadius: 'var(--r-sm)',
      cursor: 'pointer',
    }}>{children}</button>
  );
}

function WeeklyBars({ data }) {
  const maxBars = Math.max(...data.map(d => d.t));
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100 }}>
      {data.map((d, i) => {
        const ratio = d.v / d.t;
        const full = ratio === 1;
        const height = (d.v / maxBars) * 80;
        const trackHeight = (d.t / maxBars) * 80;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ height: 80, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative' }}>
              {/* Track */}
              <div style={{
                position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                width: '100%', height: trackHeight,
                background: 'var(--surface-inset)',
                border: '1px solid var(--line-soft)',
                borderRadius: 4,
              }} />
              {/* Fill */}
              <div style={{
                position: 'relative',
                width: '100%', height,
                background: full ? 'var(--sage-600)' : 'var(--sage-400)',
                borderRadius: 4,
                border: `1px solid ${full ? 'var(--sage-700)' : 'var(--sage-500)'}`,
              }} />
            </div>
            <span className="ht-num" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.02em' }}>{d.w}</span>
          </div>
        );
      })}
    </div>
  );
}

function HistoryRow({ entry, last }) {
  const { date, weekday, time, note, current, skip, reason } = entry;
  return (
    <div style={{
      padding: '11px 18px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: last ? 'none' : '1px solid var(--line-soft)',
      background: current ? 'oklch(0.96 0.02 150)' : 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <div style={{
          width: 38, height: 38,
          background: skip ? 'var(--surface-inset)' : (current ? 'var(--sage-600)' : 'var(--surface-card)'),
          border: `1px solid ${skip ? 'var(--line)' : (current ? 'var(--sage-700)' : 'var(--line)')}`,
          borderRadius: 'var(--r-sm)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: current ? '#fbfbf7' : (skip ? 'var(--ink-3)' : 'var(--ink-1)'),
          flexShrink: 0,
        }}>
          <span className="ht-num" style={{ fontSize: 14, fontWeight: 500, lineHeight: 1 }}>{date}</span>
          <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 1, opacity: 0.85 }}>{weekday}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="ht-num" style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink-1)' }}>{time}</span>
            {note && <HTBadge tone="sage" mono>{note}</HTBadge>}
            {skip && <HTBadge tone="warn" mono>пропуск</HTBadge>}
          </div>
          <span style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>
            {skip ? reason : (current ? 'Отметили только что' : 'Отметка получена')}
          </span>
        </div>
      </div>
      {!skip && (
        <button style={{
          fontSize: 11.5, color: 'var(--ink-2)',
          padding: '5px 9px',
          background: 'transparent', border: '1px solid var(--line)',
          borderRadius: 'var(--r-sm)', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <Icon.Close size={10} />
          снять
        </button>
      )}
    </div>
  );
}

window.HabitDetailScreen = HabitDetailScreen;
