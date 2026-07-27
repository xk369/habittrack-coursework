---
version: alpha
name: HabitTrack Ledger Workspace
description: "A calm productivity workspace for habit metrics: quiet graphite navigation, crisp white work surfaces, one teal primary action, tabular numbers, compact cards, and visible progress states."
colors:
  primary: "#12766e"
  primary-hover: "#0f625c"
  on-primary: "#fbfffd"
  canvas: "#f3f7f5"
  canvas-tint: "#edf3f1"
  surface-card: "#ffffff"
  surface-inset: "#eef4f2"
  surface-ink: "#17211f"
  ink: "#16211f"
  ink-muted: "#53615d"
  ink-subtle: "#7a8984"
  hairline: "#d8e3df"
  hairline-strong: "#b9c9c3"
  success: "#12766e"
  warning: "#b7791f"
  danger: "#b42318"
typography:
  display:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: 38px
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: 0
  title:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  body:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.08em
rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 8px
  full: 9999px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  section: 40px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 9px 16px
  card:
    backgroundColor: "{colors.surface-card}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: 20px
  metric-tile:
    backgroundColor: "{colors.surface-inset}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 16px
---

## Overview

HabitTrack should read as a finished productivity workspace, not a marketing page. The interface is meant for repeated daily use: a quiet shell, compact metrics, visible progress, and predictable actions. The design borrows the organized density of workspace tools and the numeric discipline of finance dashboards without copying any brand identity.

## Colors

Use a cool neutral canvas with white work surfaces. Teal is the only primary action color and should appear on the main CTA, selected states, progress fills, and focus rings. Amber is reserved for warnings or streak emphasis; red is reserved for destructive actions and blocked accounts. Muted text must remain readable against tinted surfaces.

## Typography

Use Geist or Inter-like system sans for product text and Geist Mono for labels, IDs, counts, and dates. Keep letter spacing at `0` for normal text. Use uppercase mono labels only for compact scan markers such as "Сегодня", "Соблюдение", or internal IDs.

## Layout

The app uses a desktop sidebar plus a mobile top navigation. Main content sits in a 7xl max-width workspace with 24-32px desktop padding and 16px mobile padding. Dashboards favor compact grids, progress bars, and metric tiles over hero-sized marketing sections.

## Elevation & Depth

Hierarchy comes from hairline borders, tonal surfaces, and a single soft card shadow. Do not use heavy floating shadows or decorative background blobs. Nested card chrome should be avoided; metric tiles inside cards should be tonal cells, not separate floating cards.

## Shapes

Buttons, cards, inputs, panels, and tabs use 6-8px radii. Pills are reserved for badges and progress/status chips. This keeps the app work-focused and avoids a generic rounded SaaS look.

## Components

Buttons need clear primary, secondary, ghost, and danger variants with visible focus and disabled states. Habit cards should show title, purpose, schedule, status, progress, and next action. Dashboard metric tiles should use tabular figures. Forms should be split into logical steps with a live preview. Admin tables should be dense, readable, and responsive.

## Do's and Don'ts

- Do keep the first screen as the usable dashboard.
- Do show real product state: active habits, streaks, compliance, schedule, history.
- Do align numbers and dates with mono/tabular styles.
- Do use teal for the main action and progress only.
- Don't add oversized heroes, decorative orbs, or abstract illustration panels.
- Don't use amber or red as decorative accents.
- Don't hide weak hierarchy behind gradients.

## Responsive Behavior

At desktop widths, keep the sidebar persistent and content dense. At tablet/mobile widths, collapse navigation to a top bar and let grids become one column. Metric tiles should not shrink text below readability; tables should switch to cards or remain inside contained overflow. No screen should create horizontal page overflow.
