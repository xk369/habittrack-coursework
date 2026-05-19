/* HabitTrack — Create Habit v2 (confident, structured, with live preview) */

function CreateHabitScreen() {
  return (
    <div className="ht-root" style={{ width: 1280, minHeight: 880, display: 'flex', flexDirection: 'column' }}>
      <AppHeader active="habits" />

      {/* Breadcrumb */}
      <div style={{ padding: '14px 28px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-3)' }}>
        <a href="#" style={{ color: 'var(--ink-3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon.ArrowLeft size={12} /> Все привычки
        </a>
        <span style={{ opacity: 0.5 }}>/</span>
        <span style={{ color: 'var(--ink-1)' }}>Новая привычка</span>
      </div>

      {/* ── Page header ────────────────────────────────────────── */}
      <header style={{ padding: '16px 28px 22px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="ht-eyebrow" style={{ marginBottom: 8 }}>ШАГ 1 ИЗ 1 · БАЗОВЫЕ ПАРАМЕТРЫ</div>
          <h1 style={{ fontSize: 38, fontWeight: 500, margin: 0, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
            Новая привычка
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '10px 0 0', maxWidth: 580, lineHeight: 1.55 }}>
            Опишите, что и когда вы хотите делать. Привычку можно отредактировать или архивировать в любой момент — история отметок сохранится.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <HTButton variant="ghost" size="md">Отмена</HTButton>
          <HTButton variant="accent" size="md" disabled icon={<Icon.Check size={13} stroke={2} />}>Создать привычку</HTButton>
        </div>
      </header>

      {/* ── MAIN GRID ─────────────────────────────────────────── */}
      <div style={{ padding: '0 28px 32px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 22, alignItems: 'start' }}>
        {/* LEFT — form */}
        <form style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
        }}>
          {/* SECTION 01 — Identity */}
          <FormSection number="01" title="Что вы хотите делать" subtitle="Короткое название и небольшое описание цели.">
            <FormRow label="Название" required>
              <div style={{ position: 'relative' }}>
                <input
                  defaultValue="Утренняя пробежка"
                  style={{
                    width: '100%',
                    height: 46,
                    padding: '0 16px',
                    fontSize: 15.5,
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                    color: 'var(--ink)',
                    background: 'var(--surface-card)',
                    border: '1.5px solid var(--line-strong)',
                    borderRadius: 'var(--r-md)',
                    outline: 'none',
                    letterSpacing: '-0.008em',
                  }}
                />
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>
                  17 / 60
                </span>
              </div>
              <FieldHint>Например — «Медитация», «30 страниц», «Прогулка 5000 шагов».</FieldHint>
            </FormRow>

            <FormRow label="Цель" optional>
              <textarea
                rows={3}
                defaultValue="20–30 минут лёгкого бега в парке перед работой. Чтобы держать форму и стабильно просыпаться."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 14,
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--ink)',
                  background: 'var(--surface-card)',
                  border: '1.5px solid var(--line-strong)',
                  borderRadius: 'var(--r-md)',
                  resize: 'vertical',
                  outline: 'none',
                  lineHeight: 1.55,
                }}
              />
              <FieldHint>Зачем эта привычка. Эта строка появится на странице привычки.</FieldHint>
            </FormRow>
          </FormSection>

          <div className="ht-divider" />

          {/* SECTION 02 — Schedule */}
          <FormSection number="02" title="Когда выполнять" subtitle="Выберите режим и конкретные дни недели.">
            <FormRow label="Периодичность" required>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                <ModeCard
                  title="Ежедневно"
                  description="Каждый день недели. Лучший выбор для коротких базовых привычек."
                  icon={<Icon.Calendar size={14} />}
                  active={false}
                />
                <ModeCard
                  title="Выбранные дни"
                  description="Конкретные дни недели. Подходит для тренировок или работы по графику."
                  icon={<Icon.Sparkles size={14} />}
                  active={true}
                />
              </div>

              {/* Weekday picker — bigger, with empty validation */}
              <div style={{
                padding: '16px 18px 18px',
                background: 'var(--surface-inset)',
                border: '1.5px solid var(--danger-line)',
                borderRadius: 'var(--r-md)',
                display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="ht-eyebrow">ДНИ НЕДЕЛИ</span>
                    <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>· обязательно</span>
                  </div>
                  <span style={{ fontSize: 11.5, color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
                    выбрано · 0 / 7
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {WEEKDAYS.map((d, i) => (
                    <button key={i} type="button" style={{
                      flex: 1,
                      height: 64,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                      background: 'var(--surface-card)',
                      border: '1.5px solid var(--line-strong)',
                      borderRadius: 'var(--r-md)',
                      color: 'var(--ink-1)',
                      cursor: 'pointer',
                      transition: 'all 120ms',
                    }}>
                      <span style={{ fontSize: 10.5, textTransform: 'uppercase', color: 'var(--ink-3)', letterSpacing: '0.08em', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{d}</span>
                      <span className="ht-num" style={{ fontSize: 18, fontWeight: 500, color: 'var(--ink-1)' }}>{[18,19,20,21,22,23,24][i]}</span>
                    </button>
                  ))}
                </div>

                {/* Validation state */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '12px 14px',
                  background: 'var(--danger-soft)',
                  border: '1px solid var(--danger-line)',
                  borderRadius: 'var(--r-sm)',
                  color: 'var(--danger)',
                }}>
                  <span style={{ marginTop: 1, flexShrink: 0 }}><Icon.Warn size={14} /></span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Выберите хотя бы один день недели</span>
                    <span style={{ fontSize: 11.5, color: 'oklch(0.4 0.1 28)', lineHeight: 1.5 }}>
                      Для режима «Выбранные дни» нужно отметить минимум один день. Или переключитесь на «Ежедневно» — тогда привычка будет каждый день.
                    </span>
                  </div>
                </div>

                {/* Presets */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span className="ht-eyebrow" style={{ marginRight: 4 }}>ШАБЛОНЫ</span>
                  <PresetChip>Будни · Пн–Пт</PresetChip>
                  <PresetChip>Выходные · Сб–Вс</PresetChip>
                  <PresetChip>Пн / Ср / Пт</PresetChip>
                  <PresetChip>Вт / Чт / Сб</PresetChip>
                </div>
              </div>
            </FormRow>
          </FormSection>

          <div className="ht-divider" />

          {/* SECTION 03 — Reminders */}
          <FormSection number="03" title="Напоминание" subtitle="Когда прислать пуш. Можно отключить или добавить несколько.">
            <FormRow label="Время" optional>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <ReminderChip time="06:55" />
                <button type="button" style={{
                  height: 42, padding: '0 14px',
                  background: 'transparent',
                  border: '1.5px dashed var(--line-strong)',
                  borderRadius: 'var(--r-md)',
                  color: 'var(--ink-2)',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <Icon.Plus size={12} /> Ещё одно
                </button>
              </div>
              <FieldHint>Не более 3 напоминаний на привычку.</FieldHint>
            </FormRow>
          </FormSection>

          {/* Footer actions inside form */}
          <div className="ht-divider" />
          <div style={{
            padding: '16px 22px',
            background: 'var(--surface-inset)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 12, color: 'var(--ink-2)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon.Info size={12} /> Привычку можно отредактировать после создания — история отметок не потеряется.
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <HTButton variant="ghost" size="md">Отмена</HTButton>
              <HTButton variant="accent" size="md" disabled icon={<Icon.Check size={13} stroke={2} />}>
                Создать привычку
              </HTButton>
            </div>
          </div>
        </form>

        {/* RIGHT — live preview rail */}
        <aside style={{ position: 'sticky', top: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Preview header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="ht-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--danger)' }} />
              ПРЕДПРОСМОТР · ЧЕРНОВИК
            </div>
            <span style={{
              fontSize: 11, color: 'var(--danger)', fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              background: 'var(--danger-soft)',
              border: '1px solid var(--danger-line)',
              borderRadius: 99,
            }}>не готово</span>
          </div>

          {/* Habit card preview — as it would appear on dashboard */}
          <article style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{
                width: 28, height: 28, flexShrink: 0,
                marginTop: 1,
                borderRadius: 'var(--r-sm)',
                background: 'var(--surface-card)',
                border: '1.5px dashed var(--line-strong)',
              }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ fontSize: 14.5, fontWeight: 500, margin: 0, letterSpacing: '-0.008em' }}>Утренняя пробежка</h3>
                <div style={{ fontSize: 11.5, color: 'var(--ink-2)', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Icon.Calendar size={11} />
                  <span style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>дни не выбраны</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, color: 'var(--ink-3)' }}>
                  <Icon.Flame size={11} />
                  <span className="ht-num" style={{ fontSize: 19, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em' }}>0</span>
                  <span style={{ fontSize: 10, opacity: 0.75 }}>дн</span>
                </div>
                <span className="ht-eyebrow" style={{ marginTop: 3 }}>STREAK</span>
              </div>
            </div>
            <div className="ht-divider-soft" />
            <div style={{ padding: '12px 16px', background: 'var(--surface-inset)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <WeekdayStrip active={[]} size={22} />
              <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>0 / 7</span>
            </div>
          </article>

          {/* Year projection — heatmap pattern of scheduled days */}
          <div style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="ht-eyebrow">КАРТА НА ГОД · ПРОЕКЦИЯ</span>
              <span style={{ fontSize: 11, color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>—</span>
            </div>
            <div style={{ padding: '4px 16px 14px', background: 'var(--surface-inset)', display: 'flex', justifyContent: 'center' }}>
              {/* Empty heatmap placeholder */}
              <EmptyHeatmap weeks={26} cellSize={9} gap={2.5} />
            </div>
            <div className="ht-divider-soft" />
            <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <ProjStat label="ДНЕЙ В НЕДЕЛЮ" value="0" />
              <ProjStat label="В МЕСЯЦ" value="~0" />
              <ProjStat label="В ГОД" value="~0" />
            </div>
          </div>

          {/* Form status checklist */}
          <div style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="ht-eyebrow">ПРОВЕРКА</span>
              <span className="ht-num" style={{ fontSize: 11.5, color: 'var(--ink-1)', fontWeight: 500 }}>3 / 4</span>
            </div>
            <CheckItem ok label="Название" value="Утренняя пробежка" />
            <CheckItem ok label="Цель" value="Описание добавлено" />
            <CheckItem ok label="Режим периодичности" value="Выбранные дни" />
            <CheckItem error label="Дни недели" value="Выберите хотя бы один день" last />
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Form section header ────────────────────────────────────────
function FormSection({ number, title, subtitle, children }) {
  return (
    <section style={{ padding: '22px 24px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              width: 22, height: 22, borderRadius: 'var(--r-sm)',
              background: 'var(--sage-50)', border: '1px solid oklch(0.82 0.05 150)',
              color: 'var(--sage-700)', fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-mono)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              letterSpacing: '0.02em',
            }}>{number}</span>
            <h3 style={{ fontSize: 16, fontWeight: 500, margin: 0, letterSpacing: '-0.005em' }}>{title}</h3>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.55, maxWidth: 200 }}>{subtitle}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {children}
        </div>
      </div>
    </section>
  );
}

function FormRow({ label, hint, required, optional, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{label}</span>
        {required && <span style={{ fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>· обязательно</span>}
        {optional && <span style={{ fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>· опционально</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function FieldHint({ children }) {
  return <p style={{ fontSize: 11.5, color: 'var(--ink-3)', margin: '6px 0 0', lineHeight: 1.5 }}>{children}</p>;
}

function ModeCard({ title, description, icon, active }) {
  return (
    <button type="button" style={{
      padding: '14px 16px',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      background: active ? 'oklch(0.96 0.022 150)' : 'var(--surface-card)',
      border: `1.5px solid ${active ? 'var(--sage-500)' : 'var(--line-strong)'}`,
      borderRadius: 'var(--r-md)',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 120ms',
      position: 'relative',
      boxShadow: active ? '0 0 0 3px oklch(0.93 0.03 150)' : 'none',
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: 99,
        border: `1.5px solid ${active ? 'var(--sage-600)' : 'var(--line-strong)'}`,
        background: 'var(--surface-card)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2,
      }}>
        {active && <span style={{ width: 9, height: 9, borderRadius: 99, background: 'var(--sage-600)' }} />}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
          {icon && <span style={{ color: active ? 'var(--sage-700)' : 'var(--ink-2)' }}>{icon}</span>}
          {title}
        </span>
        <span style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>{description}</span>
      </div>
    </button>
  );
}

function PresetChip({ children }) {
  return (
    <button type="button" style={{
      padding: '5px 11px',
      background: 'var(--surface-card)',
      border: '1px solid var(--line-strong)',
      borderRadius: 'var(--r-sm)',
      fontSize: 12,
      color: 'var(--ink-1)',
      cursor: 'pointer',
      fontWeight: 500,
    }}>{children}</button>
  );
}

function ReminderChip({ time }) {
  return (
    <div style={{
      height: 42, padding: '0 14px',
      display: 'inline-flex', alignItems: 'center', gap: 10,
      background: 'var(--surface-card)',
      border: '1.5px solid var(--line-strong)',
      borderRadius: 'var(--r-md)',
      color: 'var(--ink)',
      fontSize: 14,
    }}>
      <Icon.Bell size={13} />
      <span className="ht-num" style={{ fontWeight: 500, fontSize: 15 }}>{time}</span>
      <span style={{ width: 1, height: 16, background: 'var(--line)' }} />
      <button style={{
        width: 16, height: 16, background: 'transparent', border: 0,
        cursor: 'pointer', color: 'var(--ink-3)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon.Close size={11} /></button>
    </div>
  );
}

function PreviewMicro({ label, value, unit }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span className="ht-eyebrow">{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span className="ht-num" style={{ fontSize: 17, fontWeight: 500, color: 'var(--ink-2)', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{unit}</span>}
      </div>
    </div>
  );
}

// ─── EmptyHeatmap — placeholder grid before days are picked ─────
function EmptyHeatmap({ weeks = 26, cellSize = 9, gap = 2.5 }) {
  const cells = [];
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let d = 0; d < 7; d++) col.push(
      <div key={d} style={{
        width: cellSize, height: cellSize,
        background: 'transparent',
        border: '1px dashed var(--line)',
        borderRadius: 2,
        opacity: 0.85,
      }} />
    );
    cells.push(<div key={w} style={{ display: 'flex', flexDirection: 'column', gap }}>{col}</div>);
  }
  return <div style={{ display: 'flex', gap }}>{cells}</div>;
}

// ─── ProjStat — projection mini-stat ────────────────────────────
function ProjStat({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span className="ht-eyebrow">{label}</span>
      <span className="ht-num" style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink-3)', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</span>
    </div>
  );
}

// ─── CheckItem — validation checklist row ───────────────────────
function CheckItem({ ok, error, label, value, last }) {
  const color = error ? 'var(--danger)' : (ok ? 'var(--sage-700)' : 'var(--ink-3)');
  return (
    <div style={{
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: last ? 'none' : '1px solid var(--line-soft)',
    }}>
      <span style={{
        width: 16, height: 16, flexShrink: 0,
        borderRadius: 99,
        background: error ? 'var(--danger-soft)' : (ok ? 'oklch(0.92 0.04 150)' : 'var(--surface-inset)'),
        border: `1.5px solid ${color}`,
        color,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {ok && <Icon.Check size={9} stroke={2.6} />}
        {error && <Icon.Close size={9} stroke={2.4} />}
      </span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 12, color: 'var(--ink-1)', fontWeight: 500 }}>{label}</span>
        <span style={{
          fontSize: 11, color,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{value}</span>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, mono, error, last }) {
  return (
    <div style={{
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      borderBottom: last ? 'none' : '1px solid var(--line-soft)',
    }}>
      <span style={{ fontSize: 11.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{label}</span>
      <span style={{
        fontSize: 12.5,
        color: error ? 'var(--danger)' : 'var(--ink-1)',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        fontWeight: 500,
        maxWidth: 200,
        textAlign: 'right',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{value}</span>
    </div>
  );
}

function Tip({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ width: 4, height: 4, borderRadius: 99, background: 'var(--sage-500)', marginTop: 7, flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

window.CreateHabitScreen = CreateHabitScreen;
