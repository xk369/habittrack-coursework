/* HabitTrack — Concept + mini design system artboard */

function ConceptArtboard() {
  return (
    <div className="ht-root" style={{ width: 1280, padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* ─── Concept header ─────────────────────────────────── */}
      <header style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>
            Концепция · направление 01
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 500, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.02 }}>
            Soft Ledger.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-1)', margin: '16px 0 0', maxWidth: 580, lineHeight: 1.5 }}>
            HabitTrack как личный «учётный журнал» — спокойный, точный, измеримый.
            Тёплая кремовая основа, графитовые тексты, мшисто-зелёные акценты sage.
            Heatmap-сетка как главный визуальный мотив — она передаёт идею регулярности
            без агрессивной геймификации и кричащих метрик.
          </p>
        </div>

        {/* Mini moodboard — colour + heatmap */}
        <div style={{
          padding: 18,
          background: 'var(--surface-card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-lg)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>Визуальный мотив</div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
            <Heatmap weeks={22} cellSize={11} gap={3} seed={7} density={0.78} monthLabels={false} />
          </div>
          <div className="ht-divider-soft" />
          <div style={{ display: 'flex', gap: 6 }}>
            {['var(--surface-page)','var(--surface-card)','var(--surface-inset)','var(--sage-100)','var(--sage-300)','var(--sage-500)','var(--sage-700)','var(--ink-2)','var(--ink)'].map((c, i) => (
              <div key={i} style={{ flex: 1, height: 28, background: c, borderRadius: 4, border: '1px solid var(--line-soft)' }} />
            ))}
          </div>
        </div>
      </header>

      {/* ─── Principles ─────────────────────────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <Principle n="01" title="Тишина по умолчанию" body="Минимум декора, никакого подсвечивания ради эффекта. Цвет появляется только там, где он несёт сигнал — streak, прогресс, успех." />
        <Principle n="02" title="Цифры — как данные" body="Метрики живут в моноширинном шрифте, с табличными цифрами. Это делает их сравнимыми и техническими, как в финансовом отчёте." />
        <Principle n="03" title="Heatmap — главный мотив" body="Сетка дней — самый честный способ показать регулярность. Она работает и как обзор, и как декор, и как навигация." />
        <Principle n="04" title="Карточки как формы" body="Тонкая граница + внутренние делители + inset-зоны. Карточки выглядят как структурированный документ, а не как «pretty SaaS»." />
      </section>

      {/* ─── Design system ──────────────────────────────────── */}
      <section>
        <SectionHeader title="Мини дизайн-система" subtitle="Базовый визуальный язык, поддерживающий три ключевых экрана" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 18 }}>
          {/* Typography */}
          <Panel title="Типографика" caption="Geist · Geist Mono">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <TypeRow label="Display · 32 / 500" sample="Доброе утро, Алексей." style={{ fontSize: 32, letterSpacing: '-0.02em' }} />
              <TypeRow label="Heading · 18 / 500" sample="Утренняя медитация" style={{ fontSize: 18 }} />
              <TypeRow label="Body · 14 / 450" sample="Каждое утро 15 минут осознанной практики и спокойного дыхания." style={{ fontSize: 14, color: 'var(--ink-1)' }} />
              <TypeRow label="Caption · 11.5 / 500 · uppercase" sample="CURRENT STREAK" style={{ fontSize: 11.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }} />
              <TypeRow label="Mono · 24 / 500 — числа и метрики" sample="184  ·  92%  ·  47дн" style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em' }} />
            </div>
          </Panel>

          {/* Colors */}
          <Panel title="Палитра" caption="oklch · тёплая кремовая + sage">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SwatchRow title="Поверхности" swatches={[
                { c: 'var(--surface-page)', name: 'page' },
                { c: 'var(--surface-card)', name: 'card' },
                { c: 'var(--surface-inset)', name: 'inset' },
                { c: 'var(--surface-deep)', name: 'deep' },
              ]} />
              <SwatchRow title="Графит" swatches={[
                { c: 'var(--ink)', name: 'ink', dark: true },
                { c: 'var(--ink-1)', name: '01', dark: true },
                { c: 'var(--ink-2)', name: '02', dark: true },
                { c: 'var(--ink-3)', name: '03' },
                { c: 'var(--ink-4)', name: '04' },
              ]} />
              <SwatchRow title="Sage · акцент" swatches={[
                { c: 'var(--sage-100)', name: '100' },
                { c: 'var(--sage-300)', name: '300' },
                { c: 'var(--sage-500)', name: '500', dark: true },
                { c: 'var(--sage-600)', name: '600', dark: true },
                { c: 'var(--sage-700)', name: '700', dark: true },
              ]} />
              <SwatchRow title="Heatmap · 5 шагов" swatches={[
                { c: 'var(--heat-0)', name: '0' },
                { c: 'var(--heat-1)', name: '1' },
                { c: 'var(--heat-2)', name: '2' },
                { c: 'var(--heat-3)', name: '3' },
                { c: 'var(--heat-4)', name: '4', dark: true },
              ]} />
            </div>
          </Panel>

          {/* Buttons */}
          <Panel title="Кнопки" caption="primary · accent · secondary · ghost · danger">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Row>
                <HTButton variant="primary" icon={<Icon.Plus />}>Создать привычку</HTButton>
                <HTButton variant="accent" icon={<Icon.Check size={13} stroke={2} />}>Отметить сегодня</HTButton>
                <HTButton variant="secondary">Редактировать</HTButton>
                <HTButton variant="ghost">Отмена</HTButton>
                <HTButton variant="danger" icon={<Icon.Trash size={13} />}>Удалить</HTButton>
              </Row>
              <Row>
                <HTButton size="sm" variant="primary">Sm</HTButton>
                <HTButton size="md" variant="primary">Md</HTButton>
                <HTButton size="lg" variant="primary">Lg</HTButton>
                <HTButton variant="accent" disabled icon={<Icon.Check size={13} stroke={2} />}>Disabled</HTButton>
              </Row>
            </div>
          </Panel>

          {/* Badges / chips */}
          <Panel title="Бейджи и чипсы" caption="status · schedule · weekday">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Row>
                <HTBadge tone="active" dot>active</HTBadge>
                <HTBadge tone="archived" dot>archived</HTBadge>
                <HTBadge tone="sage" mono><Icon.Check size={10} stroke={2} />сегодня</HTBadge>
                <HTBadge tone="warn" mono>пропуск</HTBadge>
                <HTBadge tone="danger" mono>ошибка</HTBadge>
              </Row>
              <Row>
                <ScheduleChip icon={<Icon.Calendar size={11} />}>Ежедневно</ScheduleChip>
                <ScheduleChip icon={<Icon.Calendar size={11} />}>Пн / Ср / Пт</ScheduleChip>
                <ScheduleChip icon={<Icon.Bell size={11} />}>06:55</ScheduleChip>
              </Row>
              <div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 6 }}>Weekday picker</div>
                <WeekdayStrip active={[0,2,4]} size={28} />
              </div>
            </div>
          </Panel>

          {/* Inputs */}
          <Panel title="Поля ввода" caption="input · textarea">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Название" value="Утренняя медитация" hint="17 / 60" />
              <Field label="Цель" multiline value="15 минут осознанной практики каждое утро." />
              <Field label="Дни недели" error="Выберите хотя бы один день" />
            </div>
          </Panel>

          {/* Stat / metric */}
          <Panel title="Карточки метрик" caption="stat · sparkline · compliance bar">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <StatCard label="Streak" value="47" unit="дн" hint="Лучший · 64" />
                <StatCard label="Compliance" value="92" unit="%" delta="+4%" />
              </div>
              <div style={{
                padding: 14,
                background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>30 дней</div>
                  <span className="ht-num" style={{ fontSize: 20, fontWeight: 500 }}>84%</span>
                </div>
                <Sparkline data={[2,3,4,3,4,4,3,4,3,4,4,3,4,4]} width={140} height={36} />
              </div>
              <ComplianceBar value={0.84} label="Общий compliance" />
            </div>
          </Panel>

          {/* Tabs + empty + toast */}
          <Panel title="Навигация и состояния" caption="tab · empty · toast">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, background: 'var(--surface-inset)', border: '1px solid var(--line)', padding: 3, borderRadius: 'var(--r-md)', width: 'fit-content' }}>
                <SysTab active>Активные</SysTab>
                <SysTab>Все</SysTab>
                <SysTab>Архив</SysTab>
              </div>

              {/* Empty state */}
              <div style={{
                padding: '14px 16px',
                background: 'transparent',
                border: '1px dashed var(--line-strong)',
                borderRadius: 'var(--r-md)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 'var(--r-sm)',
                  background: 'var(--surface-inset)', border: '1px solid var(--line)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ink-1)',
                }}><Icon.Sparkles size={13} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>Пока нет привычек</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Начните с одной — добавите остальные позже.</div>
                </div>
                <HTButton size="sm" variant="secondary" icon={<Icon.Plus size={12} />}>Создать</HTButton>
              </div>

              {/* Toast */}
              <div style={{
                padding: '11px 14px',
                background: 'var(--ink)',
                color: 'var(--surface-card)',
                borderRadius: 'var(--r-md)',
                display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 12.5,
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 99, background: 'var(--sage-500)', color: '#fbfbf7' }}><Icon.Check size={11} stroke={2.2} /></span>
                <span style={{ flex: 1 }}>Отмечено · «Утренняя медитация»</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7 }}>streak +1 → 47</span>
                <span style={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}><Icon.Close size={11} /></span>
              </div>
            </div>
          </Panel>
        </div>
      </section>

      {/* ─── Footer: scaling principles ─────────────────────── */}
      <section>
        <SectionHeader title="Что сохранить при расширении" subtitle="Принципы, которые должны пережить рост дизайна на остальные экраны" />
        <div style={{
          marginTop: 18,
          background: 'var(--surface-card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-lg)',
          padding: 22,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
        }}>
          <ScalePrinciple n="A" title="Только один акцент">
            Sage используется только для прогресса, успеха и единственного главного CTA на экране. Никаких вторичных акцентных цветов.
          </ScalePrinciple>
          <ScalePrinciple n="B" title="Числа всегда в моно">
            Любая аналитика, дата, ID или количественная метрика — Geist Mono с табличными цифрами. Это создаёт ритм «учётного журнала».
          </ScalePrinciple>
          <ScalePrinciple n="C" title="Карточка = документ">
            Bordered + inset structure. Внутренние делители вместо теней. Inset-зоны для визуализаций. Без drop-shadow.
          </ScalePrinciple>
          <ScalePrinciple n="D" title="Heatmap — везде, где есть время">
            История, прогресс, статистика — это всегда сетка дней. Spark-lines и большие числа — поддержка, не замена.
          </ScalePrinciple>
          <ScalePrinciple n="E" title="Сбалансированная плотность">
            Сетка 28px-edge / 16-22px внутренний паддинг. Не лендинг, не B2B-таблица. Информативно, но с воздухом.
          </ScalePrinciple>
          <ScalePrinciple n="F" title="Спокойный язык">
            Копирайтинг без восклицаний и геймификации. «Отметить сегодня», а не «🔥 Сделай это!». Тон — личный, но сдержанный.
          </ScalePrinciple>
        </div>
      </section>
    </div>
  );
}

function Principle({ n, title, body }) {
  return (
    <div style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-md)',
      padding: 18,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <span style={{ fontSize: 11, color: 'var(--sage-700)', fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.04em' }}>{n}</span>
      <h3 style={{ fontSize: 15, fontWeight: 500, margin: 0, letterSpacing: '-0.005em' }}>{title}</h3>
      <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.55 }}>{body}</p>
    </div>
  );
}

function ScalePrinciple({ n, title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 22, height: 22, borderRadius: 'var(--r-sm)',
          background: 'var(--sage-50)', border: '1px solid oklch(0.86 0.035 150)',
          color: 'var(--sage-700)', fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-mono)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>{n}</span>
        <h4 style={{ fontSize: 13.5, fontWeight: 500, margin: 0 }}>{title}</h4>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--ink-2)', margin: 0, lineHeight: 1.55 }}>{children}</p>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--line)' }}>
      <div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
          §
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 500, margin: 0, letterSpacing: '-0.015em' }}>{title}</h2>
      </div>
      {subtitle && <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: 0, maxWidth: 420, textAlign: 'right' }}>{subtitle}</p>}
    </div>
  );
}

function Panel({ title, caption, children }) {
  return (
    <div style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, margin: 0, letterSpacing: '-0.005em' }}>{title}</h3>
        {caption && <span style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>{caption}</span>}
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>{children}</div>;
}

function TypeRow({ label, sample, style }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 18, alignItems: 'baseline' }}>
      <span style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>{label}</span>
      <span style={style}>{sample}</span>
    </div>
  );
}

function SwatchRow({ title, swatches }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 6 }}>{title}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {swatches.map((s, i) => (
          <div key={i} style={{
            flex: 1, height: 44,
            background: s.c,
            border: '1px solid var(--line-soft)',
            borderRadius: 'var(--r-sm)',
            padding: 6,
            color: s.dark ? '#f7f5ef' : 'var(--ink-2)',
            fontSize: 10, fontFamily: 'var(--font-mono)',
            display: 'flex', alignItems: 'flex-end',
          }}>{s.name}</div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, hint, error, multiline }) {
  const borderColor = error ? 'oklch(0.78 0.06 30)' : 'var(--line-strong)';
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11.5, color: 'var(--ink-1)', fontWeight: 500 }}>{label}</span>
        {hint && <span style={{ fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>{hint}</span>}
      </div>
      {multiline ? (
        <textarea
          defaultValue={value}
          rows={2}
          style={{
            width: '100%', padding: '8px 12px',
            fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--ink)',
            background: 'var(--surface-card)',
            border: `1px solid ${borderColor}`,
            borderRadius: 'var(--r-sm)', outline: 'none', resize: 'vertical',
          }}
        />
      ) : (
        <input
          defaultValue={value}
          placeholder={error ? '—' : ''}
          style={{
            width: '100%', height: 34, padding: '0 12px',
            fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--ink)',
            background: error ? 'var(--danger-soft)' : 'var(--surface-card)',
            border: `1px solid ${borderColor}`,
            borderRadius: 'var(--r-sm)', outline: 'none',
          }}
        />
      )}
      {error && (
        <div style={{ marginTop: 4, fontSize: 11, color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon.Warn size={11} /> {error}
        </div>
      )}
    </div>
  );
}

function SysTab({ children, active }) {
  return (
    <button style={{
      padding: '5px 11px',
      fontSize: 12,
      fontWeight: 500,
      color: active ? 'var(--ink)' : 'var(--ink-2)',
      background: active ? 'var(--surface-card)' : 'transparent',
      border: active ? '1px solid var(--line)' : '1px solid transparent',
      borderRadius: 'var(--r-sm)',
      cursor: 'pointer',
    }}>{children}</button>
  );
}

window.ConceptArtboard = ConceptArtboard;
