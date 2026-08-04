# Handoff: Café Jamestine visual redesign

## Overview

Café Jamestine is a personal specialty-coffee tracking PWA (Next.js 16 + Supabase, single user today,
a handful of invited users later). It records coffees, their physical bags, equipment, recipes, and
**brewing/preparation sessions**, plus tasting feedback after each one.

The app works. What it lacks is an identity and a layout that fits how it is actually used. It
currently ships stock shadcn neutral greys, the Geist font, and a `max-w-4xl` centred column that
leaves acres of dead margin on the landscape screens where it lives.

**This handoff is a full visual redesign**, developed with the owner over several rounds. It covers:

- a brand identity (logo, palette, type) that represents both owners — **James** (indigo) and **Christine** (lavender)
- a **landscape-first layout system**: list-beside-detail instead of a narrow centred column
- the session workflow as an explicit **phase stepper** (Plan → Brew → Post-brew → Tasting), coloured by a coffee-lifecycle ramp
- **brew mode at mount-reading scale** — the app's most distinctive screen, read from an eye-level mount at 1–2 feet
- a consistent **read vs edit** visual distinction, status-pill system, and confirmation convention

The domain model, routes and data layer do **not** change. This is presentation.

## About the design files

Everything in `ui_kit/` and `guidelines/` is a **design reference written in HTML** — prototypes
showing intended look and behaviour, not production code to lift. The React files use inline styles
and CDN-loaded React deliberately, so they open in a browser with no build step.

**Your task is to recreate these designs in the existing Next.js + Tailwind v4 + shadcn codebase**,
using its established patterns: keep `src/components/ui/*` as the primitive layer, keep Tailwind
utility classes, keep the server-action data flow. The CSS custom properties in `tokens/` are
designed to drop into `src/app/globals.css` so existing `className`s keep working — start there.

Do **not** port the inline styles. Do **not** introduce a CSS-in-JS library.

## Fidelity

**High-fidelity.** Colours, type, spacing, radii, shadows and interaction states are final and
specified numerically below. Recreate them exactly. Where a value here disagrees with a shadcn
default, this document wins.

Two things are explicitly open:
- **Recipes** layout was not specified in the brief; the kit proposes list-beside-detail matching Coffees. Confirm with the owner before building.
- **Dark mode** is out of scope. The app forces light (`color-scheme: light`). Keep it that way.

---

## Design tokens

Copy `tokens/` wholesale. `tokens/semantic.css` deliberately mirrors the shadcn variable names 1:1,
so replacing the `:root` block in `src/app/globals.css` with it keeps every existing `bg-primary`,
`text-muted-foreground`, `border-border` working — with new values.

### Colour — base ramps

| Token | Hex | Role |
| --- | --- | --- |
| `--indigo-50` | `#eef0f9` | secondary fill |
| `--indigo-100` | `#dce0f2` | secondary hover |
| `--indigo-200` | `#b9c0e6` | |
| `--indigo-300` | `#8f99d4` | |
| `--indigo-400` | `#6b76c0` | focus ring, frozen bag |
| `--indigo-500` | `#5a5fb8` | |
| `--indigo-600` | `#3b3f8f` | **primary** |
| `--indigo-700` | `#2f3376` | primary hover |
| `--indigo-800` | `#232659` | secondary text |
| `--indigo-900` | `#191b3f` | body text |
| `--indigo-950` | `#1a1a2e` | **ink / headings** |
| `--lavender-50` | `#efe9f8` | accent, edit surface, selected row |
| `--lavender-100` | `#e4daf3` | |
| `--lavender-200` | `#cdbde9` | edit-surface border |
| `--lavender-300` | `#c9b3e8` | logo steam, reversed |
| `--lavender-400` | `#a78bcf` | |
| `--lavender-500` | `#8f74c4` | **logo steam on light** (3.7:1 on paper) |
| `--lavender-600` | `#7659ad` | resting bag |
| `--lavender-700` | `#5d4489` | |
| `--mint-50` | `#e6f4f0` | |
| `--mint-100` | `#d2ece5` | |
| `--mint-400` | `#7fcbb8` | |
| `--mint-500` | `#5fb8a4` | |
| `--mint-600` | `#3f9a86` | **active bag, success** |
| `--mint-700` | `#2e7566` | |
| `--paper` | `#fcfbfa` | page background |
| `--paper-raised` | `#ffffff` | cards |
| `--paper-sunken` | `#f4f2f0` | rails, reserved regions |
| `--slate-100` | `#f1f0f5` | muted fill, hover wash |
| `--slate-200` | `#e4e1ec` | **border / input** |
| `--slate-300` | `#cfcbdb` | dashed placeholder border |
| `--slate-500` | `#6f6b80` | **muted text** |
| `--slate-700` | `#413d52` | |

`--destructive` stays exactly as it is today: `oklch(0.577 0.245 27.325)`.

### Colour — the three vocabularies

**Never mix these.** Each answers a different question.

**1. Bag lifecycle + session status** — "what condition is this thing in?"

| State | Text | Background |
| --- | --- | --- |
| `frozen` | `--indigo-400` `#6b76c0` | `--indigo-50` `#eef0f9` |
| `resting` | `--lavender-600` `#7659ad` | `--lavender-50` `#efe9f8` |
| `active` | `--mint-600` `#3f9a86` | `--mint-50` `#e6f4f0` |
| `finished` | `--slate-500` `#6f6b80` | `--slate-100` `#f1f0f5` |
| session `active` | `--indigo-600` `#3b3f8f` | `--indigo-50` `#eef0f9` |
| session `complete` | `--slate-500` `#6f6b80` | `--slate-100` `#f1f0f5` |

**2. Session phase ramp** — "where am I in this session?" Drawn from the owner's espresso cups,
which are coloured on the lifecycle of coffee. **This ramp is used by the phase stepper and nothing else.**

| Phase | Meaning | Colour | Soft |
| --- | --- | --- | --- |
| Plan | green — growth | `--phase-plan` `#4e7c4a` | `#e8f0e7` |
| Brew / Make | red — cherries | `--phase-brew` `#a8323c` | `#f8e8e9` |
| Post-brew | yellow — dried | `--phase-post` `#d19a2e` | `#fbf2de` |
| Tasting | brown — roast | `--phase-taste` `#6f4e37` | `#f0eae5` |

**3. Semantic** — `--destructive`, `--success` (`--mint-600`), `--warning` (`#b4790a`), `--favorite` (`#d19a2e`).

### Typography

Three Google Fonts. Load with `next/font/google`, replacing the current Geist pair.

```ts
// src/app/layout.tsx
import { Bricolage_Grotesque, Instrument_Sans, Geist_Mono } from "next/font/google";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"] });
const sans    = Instrument_Sans({ variable: "--font-sans", subsets: ["latin"] });
const mono    = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
```

- **Bricolage Grotesque** — display + all headings. Character without novelty.
- **Instrument Sans** — the whole interface. Wide, open apertures; this is what makes brew mode legible at arm's length.
- **Geist Mono** — tokens, code, and `.tabular` numerics.

| Token | Size | Line height | Use |
| --- | --- | --- | --- |
| `--text-xs` | 0.75rem / 12px | 1.05rem | hints, eyebrows |
| `--text-sm` | 0.875rem / 14px | 1.3rem | **interface default** |
| `--text-base` | 1rem / 16px | 1.55rem | read views, nav |
| `--text-lg` | 1.125rem / 18px | 1.7rem | section headings |
| `--text-xl` | 1.375rem / 22px | 1.85rem | card titles |
| `--text-2xl` | 1.625rem / 26px | 2rem | view titles |
| `--text-3xl` | 2rem / 32px | 2.35rem | detail titles |
| `--text-4xl` | 2.5rem / 40px | 2.75rem | landing hero |
| `--text-5xl` | 3.5rem / 56px | 1.05 | marketing display |

**Brew-mode scale — read from a mount at 1–2 ft. Roughly 2× interface. Never used elsewhere.**

| Token | Size | Use |
| --- | --- | --- |
| `--brew-title` | 2.75rem / 44px | coffee name |
| `--brew-value` | 2.75rem / 44px | the parameter number |
| `--brew-time` | 2rem / 32px | step timestamp |
| `--brew-step` | 1.5rem / 24px | step description |
| `--brew-label` | 1rem / 16px | parameter caption |

Weights: 400 regular, 500 medium (labels, nav), 600 semibold (headings, values), 700 available.
Tracking: `-0.025em` on display and headings, `-0.015em` on medium headings, `+0.045em` on uppercase eyebrows.
Every measurement gets `font-variant-numeric: tabular-nums`.

### Spacing, layout, radii, shadows

Spacing is a 0.25rem scale named by index: `--space-1` 4px through `--space-16` 64px
(0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16 — half-steps use a hyphen, e.g. `--space-2-5` = 0.625rem).

| Layout token | Value | Meaning |
| --- | --- | --- |
| `--shell-max` | 120rem | outer cap — **replaces `max-w-4xl`** |
| `--shell-gutter` | 2rem | desktop page inset (1rem mobile) |
| `--topbar-height` | 3.75rem | global nav, sticky |
| `--subbar-height` | 3.25rem | phase stepper, sticky beneath the top bar |
| `--list-pane` | 20rem | the list rail (17rem tight) |
| `--detail-measure` | 56rem | cap on a detail pane's readable width |
| `--brew-measure` | 60rem | brew-mode column |
| `--form-measure` | 24rem | auth form |

| Control height | Value | Use |
| --- | --- | --- |
| `--control-xs` | 1.5rem | inline chips |
| `--control-sm` | 2rem | toolbar, filters |
| `--control-md` | 2.25rem | chrome default |
| `--control-lg` | 2.5rem | forward actions |
| `--control-touch` | **2.75rem** | **every data-entry field** |
| `--control-hero` | 3.5rem | the one dominant CTA |

Radii from `--radius: 0.625rem`: `sm` 6px (menu items), `md` 8px (controls), `lg` 10px (rows,
dialogs), `xl` 14px (cards), `2xl` 18px (panels, edit surfaces), `3xl` **26px (brew-mode tiles)**,
`full` pill (badges, auth submit).

Shadows, tinted with indigo ink rather than black:

```css
--shadow-xs: 0 1px 2px 0 rgb(26 26 46 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(26 26 46 / 0.07), 0 1px 2px -1px rgb(26 26 46 / 0.07);
--shadow-md: 0 4px 8px -2px rgb(26 26 46 / 0.09), 0 2px 4px -2px rgb(26 26 46 / 0.06);
--shadow-lg: 0 12px 20px -4px rgb(26 26 46 / 0.11), 0 4px 8px -4px rgb(26 26 46 / 0.07);
```

Focus: `--ring-width: 3px`, ring colour `--indigo-400`, at 45% alpha. Dialog scrim `rgb(26 26 46 / 0.5)`.
Sticky-bar backdrop `blur(10px)` over `background` at 88–94%.

Motion: `--duration-fast 120ms`, `--duration-base 160ms`, `--duration-slow 220ms`,
`--ease-standard cubic-bezier(0.4,0,0.2,1)`. Transition **colour, background-color, border-color and
box-shadow only**. Nothing translates except the Switch thumb; nothing scales except the dialog's
95% → 100% zoom.

---

## Assets

| File | Use |
| --- | --- |
| `assets/logo.svg` | Primary mark — indigo cup, lavender steam. Header, favicon, light grounds. |
| `assets/logo-reversed.svg` | White cup, `--lavender-300` steam. For indigo or ink grounds and the app icon. |
| `assets/logo-mono.svg` | Single-colour ink version. Print, stamps, disabled contexts. |
| `assets/_steam-paths.json` | The traced steam geometry, if the mark ever needs re-scaling. |

The mark is a full side-profile mug: solid indigo bowl (bottom half of an ellipse, rim at wide),
a circular stroked handle, a flat saucer bar, and two lavender steam ribbons. **The ribbons were
vector-traced from a reference image the owner supplied** — not drawn freehand. Single shared
viewBox `18.5 14 165 205`, aspect 1.2, 8 units of padding on all four sides.

There is **no wordmark glyph**. The name is always typeset in Bricolage Grotesque 600 beside the
mark, with a gap of roughly 0.4× the mark's width. Lockup sizes used in the kit: mark 22px + text
17px in the app header; mark 34px + 26px on auth; mark 54px + 48px for marketing.

**Replace the current PWA icons.** `public/icon-192.png`, `icon-512.png`, `icon-512-maskable.png`
and `apple-touch-icon.png` are all the old plain-brown-disc mark. Regenerate them from
`logo-reversed.svg` on an `--indigo-600` field. Update `themeColor` in `src/app/layout.tsx` and
`theme_color`/`background_color` in `src/app/manifest.ts` from `#ffffff` to `#fcfbfa`.

Icons remain **Lucide** via `lucide-react` — no change. 2px stroke, 16px default, 14px in compact
rows, 18–22px in hero buttons, 32px on the wizard type tiles.

---

## Screens

Below, "rail" means the persistent list column and "detail" the pane beside it.

### 1. App chrome
**File:** `ui_kit/AppShell.jsx` · **Replaces:** `src/app/(app)/layout.tsx`

**Layout.** Sticky top bar, `3.75rem` tall, `1px solid var(--border)` bottom, background
`color-mix(in srgb, var(--background) 88%, transparent)` with `backdrop-filter: blur(10px)`,
`z-index: 20`. Inside: a `120rem` max-width row with `2rem` horizontal padding and `1.5rem` gap.

- **Brand** (left) — `logo.svg` at 22px + "Café Jamestine" in Bricolage 600, `--text-lg`, `-0.015em`, `--text-heading`. Routes to the launchpad, **not** to a section.
- **Primary nav** — Coffees · Sessions · Recipes. `--text-base`, weight 500 (600 when active), `8px` radius, `0.5rem 0.75rem` padding. Rest `--text-muted`; hover `--slate-100` + `--text-heading`; active `--surface-selected` + `--indigo-700`.
- **Secondary group** (right, `margin-left: auto`) — Equipment · Reference at `--text-sm`, then a 1px × 20px `--border` divider, then a ghost "Sign out". These are low-frequency; the brief says don't give them heavy billing.
- **Sub-bar slot** — a second sticky strip at `top: var(--topbar-height)`, `z-index: 15`, `3.25rem` min-height, `--surface-page` background, 1px bottom border. Only the session workflow fills it (with the phase stepper). Keep the two levels visually distinct: the global bar is translucent + blurred, the sub-bar is opaque.
- **Main** — `120rem` max-width, `2rem` padding top `2rem` / bottom `4rem`.

### 2. Launchpad
**File:** `ui_kit/Landing.jsx` · **Replaces:** `src/app/(app)/page.tsx`

A pure launchpad. Its job is to launch, not to be a dashboard.

**Layout.** Two-column act zone (`1fr 1fr`, `2.5rem` gap) over a three-up row of area cards (`1rem` gap). Column gap between the zone and the cards: `3rem`.

- **Left column** — `logo.svg` at 60px; `<h1>` "Café Jamestine" in Bricolage 600 at `--text-4xl` / 1.05 / `-0.025em`; then the hero button; then the conditional resume link. Gap `1.25rem`, `padding-top: 1.5rem`.
- **Hero button** — `--control-hero` (3.5rem), `--text-lg`, indigo fill, `play` glyph at 20px, label "Start a session". **The only `hero`-size button in the app.** Contained, not stretched.
- **Resume** — renders *only* when a session is unfinished. `--text-sm`, `--text-muted`, copy `Resume active session · {title}`. A soft reminder; it must never compete with the hero.
- **Reserved insight region** (right column) — `min-height: 15rem`, `18px` radius, `1px dashed var(--slate-300)`, `--surface-sunken` fill, centred: an "Insights" eyebrow over "Reserved for a dashboard." in `--text-sm` muted. **Intentionally empty — ship it empty.**
- **Area cards** — Coffees / Sessions / Recipes. `14px` radius, `1px solid var(--border)`, white, `--shadow-sm`, `1.25rem 1.5rem` padding. Title in Bricolage 600 `--text-lg`; one-line description in `--text-sm` muted; `arrow-right` 18px muted, right-aligned. Hover: background → `--surface-selected`. **No counts, no stats.**

Card copy, verbatim: "Beans, bags and their history" · "Every brew, planned and reflected on" · "Reusable parameter templates".

### 3. New-session wizard
**File:** `ui_kit/NewSession.jsx` · **Replaces:** `sessions/new/new-session-wizard.tsx`

Three steps, each its own screen, capped at `--detail-measure`. Header row: an `arrow-left` "Sessions" link on the left; on the right a "Step {n} of 3" eyebrow plus a ghost "Back" (from step 2).

1. **Type** — h1 "Start a session"; subcopy "What are you making? (This sets the type — permanent.)"; two tiles in a `1fr 1fr` grid, `1rem` gap. Each tile: `18px` radius, white, `--shadow-sm`, `1.5rem` padding, left-aligned, containing a 32px `--primary` glyph (`coffee` / `glass-water`), a Bricolage 600 `--text-xl` label, and a `--text-sm` muted description. Hover: border → `--ring`, background → `--surface-selected`. Descriptions: "Pour-over and similar: a coffee, a recipe, timed pours." / "Lattes and signature drinks: ingredients and prose steps."
2. **Select coffee** (brewed only) — h1 "Select coffee"; subcopy "Only coffees with an active bag can be brewed."; list rows with the coffee name as title, roaster as meta, `arrow-right` trailing. Empty: "No coffees have an active bag. Set a bag to active on a coffee first."
3. **Parameter source** — h1 "Parameter source"; subcopy `Brewed coffee · {coffee}` or "Specialty drink". Then a full-width `hero` button "Build new (blank)", left-aligned text. Then two eyebrow-titled sections: **Clone a recipe** (row: name, method meta, scope right-aligned muted) and **Clone a prior session** (row: `{date} · {title}`, method meta). Empty states: "No recipes of this type." / "No prior sessions."

Committing lands in the workflow at **Plan**.

### 4. Session workflow — the centrepiece
**File:** `ui_kit/SessionWorkflow.jsx` · **Replaces:** `sessions/[id]/session-detail.tsx` and the three editors

**Not one long scrolling page.** A sequence of phase screens on one continuous surface, navigated by
a stepper in the sub-bar. One phase fills the screen at a time. Committing a phase advances; labels
also work as tabs for free movement.

- Brewed coffee: **Plan → Brew → Post-brew → Tasting**
- Specialty drink: **Plan → Make → Tasting** (ramp stages 1 · 2 · 4)

**The stepper** (sub-bar). Horizontal row of phases. Each: a `1.5rem` circular pip with a `2px`
border in that phase's ramp colour, then the label at `--text-base` (600 when active, 500 otherwise).
Active gets a **3px bottom border in the ramp colour** and `--text-heading`; committed phases get a
filled pip with a `✓`; upcoming are hollow pips with muted labels. Between phases, a `2rem × 2px`
gradient bar from the previous ramp colour to the next at 55% opacity. Set `aria-current="step"` on the active tab.

**Header** (above the stepper's content): back link, then the coffee/drink name as `<h1>` in
Bricolage 600 `--text-3xl`, then `roasted {date} · {n} days rested` in `--text-sm` muted. Right side:
type badge, status badge (with a dot when active), ghost "Clone", ghost destructive "Delete".

**Plan.** Read-first with an explicit **Edit**. Read mode is a 4-column grid of read rows
(`repeat(4, minmax(0,1fr))`, column gap `2rem`, row gap `0.5rem`) — Method, Brewer, Grinder, Grind,
Dose (g), Water (g), Measured by, Temperature (°C), Bloom water (g), Bloom time (m:ss) — then a
"Steps" section with the steps table. Edit mode swaps the grid for a **3-column edit panel**: `18px`
radius, `1px solid var(--lavender-200)`, `--lavender-50` fill, `1.5rem` padding, every field at
`--control-touch`. The Iced switch is a bordered white row spanning two columns; Ice (g) appears only
when Iced is on. Footer action: `hero` button **"Confirm & brew"** (brewed) or "Continue to Make" (specialty).

**Brew.** A separate full-screen route — see §5.

**Post-brew.** Section heading, then a 3-column edit panel with Total brew time (m:ss) and a
full-width Post-brew notes textarea. Forward action: `lg` "Continue to Tasting" + `arrow-right`.

**Make** (specialty only). Read-first at brew-ish scale. Ingredients list with a **decimal batch
multiplier** in the section-heading action (an xs "Batch ×" label + a `2rem` input, 5rem wide);
quantities scale to 1 decimal, and a `--text-sm` muted line reads "Showing {m}× batch — recipe
unchanged." Rows are bordered white, `--brew-step` (24px) text, quantity right-aligned semibold and
tabular. Steps are numbered rows: the index in Bricolage `--brew-time` (32px) `--phase-brew` beside
a `--brew-step` description. Capped at `--brew-measure`.

**Tasting.** Two columns (`20rem` / `1fr`, `1.5rem` gap, `align-items: start`). Left: a lavender edit
panel with Overall enjoyment (1–10) — hint "Standalone enjoyment, set directly (1–10, 0.5 steps)" —
and a `7rem`-tall Next-time adjustments textarea. Right: a muted note ("Per-category 1–5 describes
prominence on each parameter's spectrum — not enjoyment.") then one bordered white card per category
(Acidity, Sweetness, Body, Balance, …): name in `--text-base` 600, the 1–5 rating control right-aligned,
the guidance line in `--text-xs` muted, and a `2.25rem` notes textarea.

Footer: a `1px` top border, then either the `hero` "Mark complete" button or the inline confirm panel
(`10px` radius, bordered, `1rem` padding, max `36rem`) with the message *"Mark complete? This
snapshots days-rested + brew date and marks the workflow done. You can still edit it afterward."*,
ghost Cancel first, filled "Mark complete" + `check` second.

**Rating control.** Five `2rem` square buttons numbered 1–5. Unselected `outline`, selected flips to
filled indigo. Clicking the selected number clears it. Read-only renders `3/5` or an em dash.

**Delete dialog.** Centred modal, `10px` radius, `1.5rem` padding, `--shadow-lg`, on a 50% ink scrim.
Title "Delete this session?"; description "The session, its steps and its tasting notes go with it.
This cannot be undone."; ghost Cancel then `destructive` Delete. Fades in with 95% → 100% zoom over 220ms.

### 5. Brew mode — the distinctive screen
**File:** `ui_kit/Brew.jsx` · **Replaces:** `src/app/brew/[id]/page.tsx`

Read from an eye-level mount or an angled counter stand at **1–2 feet**. Large, glanceable,
**read-only — no inputs**. Give it room.

**Layout.** Its own full-screen route outside the app shell.
- **Header** — `1rem 2rem` padding, 1px bottom border. Left: `arrow-left` + "Back to Plan" at `--text-base` muted. Right: a phase marker — an 8px `--phase-brew` dot plus "BREW" in `--text-sm` 600 uppercase `+0.045em` in `--phase-brew`.
- **Main** — centred `--brew-measure` (60rem) column, `2rem` gutter, `2.5rem` internal gap.
  - Coffee name in Bricolage 600 at `--brew-title` (44px) / 1.05 / `-0.025em`; method + grinder beneath at `--text-lg` muted.
  - **Parameter tiles** — a 4-column grid, `1rem` gap. Each tile: `26px` radius, `1px solid var(--border)`, white, `1.25rem 1.5rem` padding. Caption at `--brew-label` (16px) 600 uppercase `+0.045em` muted; value in Bricolage 600 at `--brew-value` (44px), tabular, `--text-heading`, with the unit beside it at `--text-xl` 500 muted. Dose · Water · Temp · Grind.
  - **Pour steps** — a "Pour steps" eyebrow at `--brew-label`, then rows in a `5.5rem / 1fr / auto` grid with a `1.25rem` gap: `26px` radius bordered white tiles, `1rem 1.5rem` padding. Timestamp in Bricolage 600 at `--brew-time` (32px) tabular in `--phase-brew`; description at `--brew-step` (24px) `--text-heading`; target weight / flow right-aligned at `--brew-step` 600 muted, formatted `{n} g · {n} ml/s`.
- **Footer** — sticky bottom, 1px top border, `background` at 94% + `blur(10px)`, `1rem 2rem` padding. A full-width `hero` button "Done brewing" with a 22px `check`, at `--text-lg`.

**No timer.** The owner's own equipment owns timing — do not add one.

### 6. Coffees — list beside detail
**File:** `ui_kit/Coffees.jsx` · **Replaces:** `src/app/(app)/coffees/**`

The pattern the brief asks for: rail on the left, selecting an entry fills the detail pane, **the
rail stays put** so you move between coffees without page-hopping.

**Rail** (`--list-pane`, 20rem). `14px` radius, `1px solid var(--border)`, `--surface-rail` fill,
`1rem` padding, sticky at `top: 1.5rem`, its own `overflow-y: auto` capped at
`calc(100vh - var(--topbar-height) - var(--space-12))`. Header: "Coffees" in Bricolage 600
`--text-lg` plus an outline `sm` "New" with a `plus`. Then an "Incomplete (n)" filter chip (xs;
flips to filled when on). Then eyebrow-titled groups — **Active** / **Storage** / **History** — each
a `<ul>` with `2px` gaps. Each item: `8px` radius, `0.5rem 0.75rem` padding, name at `--text-sm`
(600 + `--text-heading` when selected, else 500 + `--text-body`), roaster beneath at `--text-xs`
muted, and a **status pill with a dot** right-aligned. Selected background `--surface-selected`;
hover `--slate-100`.

**Detail** (capped `--detail-measure`). Read mode:
- Header row: a `96px` image square (`14px` radius, bordered, `--muted` fill, `image-plus` 24px placeholder) beside the name in Bricolage 600 `--text-3xl` with a `--text-base` muted subline joining roaster · country · process. Right: outline "Edit" + ghost destructive "Delete".
- A **3-column** read grid: Roaster, Country, Region, Producer, Roast level, Recommended rest, Rating (`{n} · {k} sessions`), Elevation, Processes, Varietals. Process/varietal values render as `secondary` badge chips. Then Flavor notes as its own full-width read row.
- **Bags** section — heading + outline "Add bag". Cards in `repeat(auto-fit, minmax(15rem, 1fr))`. Each: title `Roasted {date}`, description `${price} · {n} days rested`, a dotted status badge as the header action, and a row of four `xs` status buttons (frozen/resting/active/finished) where the current one is filled.
- **"Sessions brewed with this coffee"** — the two-way link back. Plain list rows: title `{method} · {dose} g / {water} g`, meta `{date} · {rating}/10`, status badge trailing.

Edit mode is an explicit swap: a header strip with an "Editing" badge, the note "Changes save when
you press Save.", ghost Cancel and filled Save; then a **2-column lavender edit panel** with every
field at `--control-touch`, and a collapsed `<details>` "More details (rare)" holding Elevation,
Salinity, Humidity in a 3-column grid.

### 7. Sessions
**File:** `ui_kit/Sessions.jsx`

Rail (Active / History) beside a detail pane holding the grouped list. Page heading "Sessions" with a
filled "Start a session" action. Rows: title, meta `{date} · {method} · {rating}/10`, and two trailing
badges — type (`secondary`) then status (dotted when active).

### 8. Recipes
**File:** `ui_kit/Recipes.jsx` — **layout was open in the brief; confirm before building.**

Same shape as Coffees. Rail with filter chips (All / Standards / Coffee-specific / Favorites) and
Brewed / Specialty groups; favourites carry a 14px `--favorite` star. Detail: name, favourite star,
type badge, method · scope meta, outline "Edit" and filled "Use in a session"; then a 4-column
parameter read grid (brewed only) and the steps table.

### 9. Equipment
**File:** `ui_kit/Equipment.jsx`

Single column at `--detail-measure`. Page heading + `sm` "New". Two eyebrow groups: **In brewing**
and **Everything else**. Rows: name, `{category} · {sub-category}` meta, an "In brewing" `secondary`
badge on workflow-relevant items.

### 10. Reference
**File:** `ui_kit/Reference.jsx`

Single column. Heading, then the line "Your own lists. Anything you add here becomes selectable
everywhere else." A row of table chips (Roasters, Countries, Regions, Producers, Processes,
Varietals, Units) where the current one is filled. An add row: a `--control-touch` input
(`Add to {table}…`) plus an outline "Add". Then the values as pill chips with an `x` icon-xs button.

### 11. Sign in
**File:** `ui_kit/Login.jsx` · **Replaces:** `src/app/login/page.tsx`

Two panes. Left (≥64rem only): a full-bleed `--indigo-600` panel with `logo-reversed.svg` at 220px
centred. Right: a `--form-measure` (24rem) column — mark at 34px beside the name in Bricolage 600
`--text-xl`; `<h1>` "Sign in" at `--text-3xl`; Email and Password fields at `--control-touch`; a
**full-width pill** submit "Sign in" (the only pill button in the app); then "No account? Create one".

---

## Interactions & behaviour

**Navigation shapes — two, applied consistently.**
- A **sub-bar stepper** means *moving through a sequence* → the session workflow only.
- **List-beside-detail** means *browsing a collection* → Coffees, Sessions, Recipes.

**Context-aware back.** "Back" returns where you came from, not a section home. Reach a session from
a coffee and Back returns to that coffee. The existing app already threads this as `?from=` — keep it.

**Read vs edit.** Existing records open in read mode; editing is explicit (Edit → Save / Cancel).
Creating opens the form directly. The visual tell is the surface: read is flat on paper, edit is a
lavender-tinted panel. Never make the user guess which mode they're in.

**Feedback convention.** Autosave is silent. Toasts fire on **failure only**, bottom-right, Sonner-styled:
`Save failed: {message}`, `Delete failed: {message}`, `Upload failed: {message}`. Forward commitments
use the **inline confirm panel**; destructive actions use a **modal dialog**. Never the reverse.

**Hover / focus / press / disabled.** As specified in the tokens section. No hover-dependent
affordances anywhere — the brief requires touch to work identically.

**Responsive.** Landscape-first; mobile is a reflow.
- `SplitPane` collapses below ~60rem: the rail becomes a full-width index that pushes to detail.
- The stepper's phase tabs wrap or scroll horizontally; each phase still fills the screen.
- Read/edit grids drop from 4 → 2 → 1 column.
- `--shell-gutter` drops from `2rem` to `1rem`.
- Brew mode stays fundamentally a landscape view; on portrait the parameter grid goes 2-up.

**Animation.** 160ms on colour/background/border/box-shadow. The Switch thumb slides. Dialogs fade +
zoom 95 → 100% over 220ms. `loader-2` spins. Nothing else moves.

---

## State management

No new data requirements — the schema in `src/lib/db-types.ts` and `supabase/migrations/*` is unchanged.
New **client** state, all local:

| State | Where | Notes |
| --- | --- | --- |
| `phase` | session workflow | `"plan" \| "brew" \| "postbrew" \| "make" \| "tasting"`. Initial from `?phase=`, else `"plan"`. |
| `done: string[]` | session workflow | Phases already committed — drives the ✓ pips. Derivable from the record; local is fine. |
| `editing` | Plan, Coffee detail | Read ↔ edit mode. |
| `confirming` | Tasting | Shows the inline Mark-complete panel. |
| `deleting` | session, coffee | Dialog open. |
| `selectedId` | Coffees, Recipes rails | Which record the detail pane shows. Mirror to the URL so the view is linkable. |
| `railFilter` | rails | Incomplete toggle; recipe scope chips. |
| `batchMultiplier` | Make | Display-only decimal, 1 dp. **Never writes to the recipe.** |

The workflow's phase is view state, not a DB column — do not persist a "current phase" field.
Rename the **Confirm** phase to **Plan** in all copy; the stored `status` enum (`active`/`complete`)
does not change.

---

## Implementation order

1. **Tokens + fonts.** Replace the `:root` block in `src/app/globals.css` with `tokens/semantic.css` plus the base ramps from `tokens/colors.css`. Swap the `next/font` imports. Add the `--font-display` mapping to the `@theme inline` block. Verify existing screens still render — nothing should break, everything should recolour.
2. **Assets.** Copy the three SVGs into `public/`. Regenerate the PWA icons. Update `themeColor` and the manifest colours.
3. **Primitives.** Restyle `src/components/ui/*` against the new tokens — mostly this is free, since the variable names are unchanged. Add the `touch` (2.75rem) and `hero` (3.5rem) button sizes. Extend `Badge` with `status` and `phase` variants plus the `dot`.
4. **App shell.** Rebuild `(app)/layout.tsx`: new top bar, the secondary nav group, the sub-bar slot, and — the big one — drop `max-w-4xl` for `--shell-max` + `--shell-gutter`.
5. **Launchpad.** Quick win, and it proves the type and colour work.
6. **Coffees.** The first list-beside-detail screen; build `SplitPane` and the rail here, then reuse.
7. **Session workflow + stepper.** The centrepiece. Rename Confirm → Plan, split the phases into discrete screens, wire the stepper into the sub-bar, add the read/edit surface distinction.
8. **Brew mode.** Its own scale and tiles. Test it on the actual iPad at the actual mount distance before calling it done.
9. **Sessions, Recipes, Equipment, Reference, Auth.**
10. **Responsive pass**, then the mobile reflow.

## Acceptance criteria

- No screen uses a fixed narrow centred column; landscape puts the list beside the detail.
- `--brew-*` type tokens appear **only** in brew mode.
- The phase ramp appears **only** in the phase stepper (and its phase badges).
- Every data-entry control is ≥ 2.75rem tall; nothing depends on hover.
- Exactly one filled indigo button per view; exactly one `hero`-size button per screen.
- Read views omit empty fields entirely — no "—", no "N/A".
- Edit mode is visually distinct from read mode without reading a label.
- Toasts appear on failure only.
- Brew mode is legible from 1–2 feet on the real device, and has no inputs and no timer.
- Contrast: body text ≥ 4.5:1, all non-text UI ≥ 3:1. (`--lavender-500` on `--paper` measures 3.72:1 — fine for the logo steam and icons, **not** for body text.)

## Files

This folder holds the three documents. **Everything they reference lives in the project alongside
them** — the whole download is the bundle, so paths below are relative to the project root.

| Path | What it is |
| --- | --- |
| `design_handoff_cafe_jamestine/PROMPT.md` | **Start here.** Where to put this, and the paste-ready prompt for Claude Code. |
| `design_handoff_cafe_jamestine/README.md` | This document. Self-sufficient — implement from this alone. |
| `design_handoff_cafe_jamestine/DESIGN_BRIEF.md` | The owner's original brief — principles, usage modes, screen intent. Read for *why*. |
| `ui_kits/app/index.html` | **Open this in a browser** — the full click-through prototype. |
| `ui_kits/app/*.jsx` | Per-screen design references. Inline styles by design; do not port them. |
| `ui_kits/app/data.js` | Fixture data shaped like the real Supabase rows. |
| `ui_kits/app/README.md` | Screen-to-source map and a suggested walkthrough. |
| `styles.css` | Entry point; `@import`s every token file. |
| `tokens/*.css` | The token source. Drop into `src/app/globals.css`. |
| `assets/logo.svg`, `-reversed`, `-mono` | The mark, three variants. |
| `assets/_steam-paths.json` | Traced steam geometry, if the mark needs re-scaling. |
| `guidelines/*.card.html` | Specimen cards — colour ramps, type scales, spacing, states, brand. |
| `components/{core,forms,patterns}/` | Reference implementations, each with a `.d.ts` prop contract and a `.prompt.md` usage note. |
| `readme.md` | The design system's own guide — content fundamentals, visual foundations, iconography. |
| `_ds_bundle.js` | Compiled components, so the prototype and specimen cards run offline. |

`ui_kits/app/index.html` opens by double-clicking it — no server needed. React, Babel and Lucide
load from CDN, so it wants a network connection the first time.

## Open questions for the owner

1. **Recipes layout** — the brief left it undesigned. The kit proposes the Coffees shape. Confirm.
2. **Small-size logo** — below ~28px the steam ribbons thin out. A simplified small variant may be worth drawing for the favicon.
3. **Equipment and Reference placement** — currently a quiet trailing nav group. The brief flagged both as open.
4. **Dark mode** — out of scope here, but the token structure supports it whenever it's wanted.
