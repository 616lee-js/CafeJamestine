# Café Jamestine — Design System

**Café Jamestine** is a personal home-cafe management app: a single-user PWA for tracking specialty
coffee end to end — the coffees and bags in the cupboard, the equipment, the recipes, and the brew
*sessions* that connect them, with tasting feedback captured after each one.

The name is a portmanteau of the owners' names — **James** and **Christine**. That shows up in the
palette by design: **indigo** is James's half (primary, action, ink), **lavender** is Christine's
(accent, soft surfaces, the steam in the logo). Coffee brown survives in exactly one place — the
session phase ramp, drawn from James's espresso cups.

## Sources this system was built from

| Source | URL / path | What was taken |
| --- | --- | --- |
| Product codebase (Next.js 16 + Supabase) | https://github.com/616lee-js/CafeJamestine | Screen inventory, domain model, copy, control heights, workflow structure |
| shadcn "new-york" primitives | `src/components/ui/*` | Exact paddings, heights, radii, focus-ring geometry |
| Theme variables | `src/app/globals.css` | Radius scale, shadow steps, variable naming, `--destructive` |
| Domain model | `src/lib/db-types.ts`, `supabase/migrations/*` | Bag statuses, session phases, tasting scales, units |
| Owner's design brief | `uploads/cafe-jamestine-design-brief.md` | Layout intent, three usage modes, principles, screen-by-screen structure |
| Owner's logo sketch + cup reference | `uploads/*` | The mark: rounded mug silhouette, steam ribbons (vector-traced) |

**Read the repository directly** for anything this system summarises — it is the ground truth for
the domain, and the brief is the ground truth for layout intent.

> **The app source is pre-redesign.** It ships stock shadcn neutral greys, a 56rem centred column,
> and Geist. This system is the *target* state, not a description of what's deployed. See
> `design_handoff_cafe_jamestine/README.md` for the implementation brief.

---

## Product surfaces

One product, three modes — and the modes drive the design more than anything else.

1. **Prep** — logging coffees and bags, building recipes. Desktop or landscape iPad with a keyboard.
   Data-dense forms, efficient typed entry, `2.75rem` controls.
2. **Brewing reference** — read from an eye-level mount or an angled counter stand at **1–2 feet**.
   Its own type scale (`--brew-*`), no inputs, calm and uncluttered. The most distinctive screen.
3. **Reflection** — tasting capture, anywhere, any device.

**Landscape-first.** Desktop and landscape iPad are the primary surfaces; mobile is a reflow.
Horizontal space goes to content — a persistent list beside a detail pane — never to dead margins.

---

## Content fundamentals

The voice is a **precise lab notebook kept by someone enjoying himself**. Not chatty, not
encouraging, never cute.

**Casing.** Sentence case everywhere — headings, buttons, labels, hints. Uppercase only for eyebrow
labels and read-mode field names (`RECOMMENDED REST`, `ACTIVE`). Status words echo the database in
lowercase: `active`, `complete`, `resting`, `frozen`, `finished`. Type labels are sentence case:
"Brewed coffee", "Specialty drink". Phase labels are sentence case: "Plan", "Brew", "Post-brew", "Tasting".

**Person.** Almost entirely impersonal — the UI describes the record, not the user. No "I"; "you"
only when explaining a consequence: *"You can still edit it afterward."* Never "we".

**Nouns are the domain's own.** Session, recipe, bag, dose, water anchor, bloom, drawdown, days
rested, prominence. The app assumes fluency; it does not simplify coffee vocabulary.

**Buttons are verbs.** "Start a session", "Confirm & brew", "Mark complete", "Continue to Tasting",
"Build new (blank)", "Done brewing", "Add bag", "Clone". Never "Submit", "OK", "Got it".

**Hints state the rule, not the benefit.** `1–10, 0.5 steps` · `m:ss` · `Optional; overrides computed
aggregate` · `Pick a country first` · `Only coffees with an active bag can be brewed.`

**Empty states name the absence in one sentence,** then the required next step if there is one.
"No active sessions." · "No recipes match." · "No coffees have an active bag. Set a bag to active on a coffee first."

**Consequential copy discloses mechanics.** The complete-session gate reads: *"Mark complete? This
snapshots days-rested + brew date and marks the workflow done. You can still edit it afterward."*
That is the house style for any commitment — what changes, and what stays reversible.

**Destructive copy is a question with the object named:** *"Delete coffee “Ethiopia Guji”?"* — curly
quotes, and the confirm button repeats the verb.

**Failures only.** Toasts report errors, never successes. `Save failed: {message}`, `Delete failed: {message}`.

**Placeholders are concrete examples,** prefixed "e.g.": `e.g. 18`, `e.g. 2–3 weeks from roast`,
`e.g. centre pour, slow`.

**Units are written out** with a space: `18 g`, `3.2 ml/s`, `93 °C`, `1,950 masl`. Times are `m:ss`
with no leading zero on minutes (`3:45`, `0:30`). Missing values are an em dash in tables and
**omitted entirely** in read views. A middle dot joins related facts: `V60 · standard`.

**No emoji, anywhere.**

---

## Visual foundations

### Colour
**Indigo `#3b3f8f`** is the primary — buttons, active nav, links, the logo cup. **Lavender
`#8f74c4`** is the accent — the logo steam, selected rows, the edit-mode field surface. **Mint
`#3f9a86`** carries positive state (an active bag, a save landing). Neutrals are a hair cool so
they sit under indigo without going grey-blue; the page is `--paper #fcfbfa`, ink is `--indigo-950 #1a1a2e`.

Three colour vocabularies, never mixed:

| Vocabulary | Colours | Used for |
| --- | --- | --- |
| Bag / session status | indigo, lavender, mint, slate | `frozen` `resting` `active` `finished` `complete` |
| Session phase ramp | green → red → yellow → brown | The phase stepper, and nothing else |
| Semantic | `--destructive`, `--success`, `--warning` | Errors, confirmations, cautions |

The **phase ramp** is James's espresso cups rendered as UI: green (growth) → red (cherries) →
yellow (dried) → brown (roast), one stage per phase. It means one thing — *where you are in a
session*. Never use it for bag status, decoration, or charts.

One background colour per screen. No gradients. No dark mode yet (the source forces light).

### Type
**Bricolage Grotesque** for display and headings — it has real quirk in its curves, so headings read
crafted rather than defaulted. **Instrument Sans** for the interface — wide, open apertures, which is
what makes brew mode legible at arm's length. **Geist Mono** for tokens and code.

Interface default is **14px**; read views step up to 16px. Headings run 18 / 26 / 32 / 40px, all
`600` with `-0.025em`. Eyebrows are 12px `600` uppercase at `+0.045em`. Every measurement is
`tabular-nums`.

**Brew mode has its own scale** — roughly 2× the interface, tuned for 1–2 ft: `--brew-value 44px`,
`--brew-time 32px`, `--brew-step 24px`, `--brew-label 16px`. Never use these outside brew mode.

### Layout
Landscape-first. A `120rem` outer cap with a `2rem` gutter — no narrow centred column. The global
top bar is `3.75rem` and sticky; an in-section sub-bar (the phase stepper) is `3.25rem` and sticks
beneath it. Browsing screens are **list beside detail**: a `20rem` sticky rail that never unmounts
next to a detail pane capped at `56rem` for readable measure. Forms are 2–4 column grids with a
`1.25rem` gap. Brew mode is a `60rem` column. Auth is `24rem` beside a full-bleed indigo panel.

### Backgrounds and imagery
There are none — no hero photography, no illustration, no pattern, no texture. The only art is the
logo. User-uploaded coffee and equipment photos are the sole imagery: `96px` rounded, bordered,
`object-cover` squares with an `image-plus` glyph on `--muted` as placeholder. Never filtered,
never bled to an edge.

### Cards, borders, shadows
Hairline `1px solid var(--border)` does nearly all the grouping. Cards are `14px` radius, `24px`
padding, `24px` internal gap, with `--shadow-sm` — faint enough to read as a border seam. Controls
get `--shadow-xs`, popovers `--shadow-md`, dialogs and toasts `--shadow-lg`. Shadows are tinted with
indigo ink, not neutral black. No inner shadows, no coloured left-border accents.

Radii come off one root value, `0.625rem`: 6px menu items, 8px controls, 10px rows and dialogs,
14px cards, 18px panels, **26px brew-mode tiles**. Badges and the auth submit are full pills.

### Read vs edit
The app's core visual distinction. **Read** is flat on paper: eyebrow label above value, empty
fields omitted. **Edit** is an explicit mode with a tinted surface — a `--lavender-50` panel with a
`--lavender-200` border, `18px` radius, holding the labelled inputs, with Cancel / Save in the
header. You always know which state you're in without reading a button.

### Transparency and blur
Two places only: sticky bars (`background/88–94%` + `blur(10px)`) and the dialog scrim (50% ink).
No protection gradients — there is no imagery to protect text over.

### Motion
Restrained. **160ms** on colour, background, border and box-shadow. Nothing lifts, scales or bounces
on hover. Two exceptions: the Switch thumb slides, and dialogs fade with a `95% → 100%` zoom over
`220ms`. Spinners are Lucide `loader-2`, spun.

### Interaction states
- **Hover** — filled buttons darken one indigo step (600 → 700); everything else takes a flat
  `--accent` (lavender-50) or `--slate-100` wash. Borders don't change.
- **Focus** — border swaps to `--ring` plus a **3px** `ring/45` halo. The only glow in the system.
- **Press** — no distinct state. Deliberate.
- **Disabled** — `opacity: 0.5`, `pointer-events: none`. Never a grey fill.
- **Selected** — filter chips flip `outline → default`. Rail selection is a `--surface-selected` wash
  plus a weight bump; phase selection is a 3px underline in that phase's ramp colour.

---

## Iconography

**Lucide** is the icon system — declared in `components.json` (`"iconLibrary": "lucide"`) and
imported as `lucide-react` throughout the app. No custom icon font, no sprite, no PNG icons. This
system links the Lucide UMD build from CDN and wraps it in `Icon` — a substitution of delivery
mechanism, not of glyph set.

- **Stroke** 2px, **default 16px**. 14px in compact rows, 18–22px in hero buttons, 32px on the
  wizard's type tiles, 24px for the image placeholder.
- Icons **sit beside a text label** with an 8px gap. Icon-only buttons exist only for reorder
  (`arrow-up`/`arrow-down`), delete (`trash-2`) and clear (`x`) — each with an `aria-label`.
- Colour is inherited. The only coloured glyph is the favourite star, `--favorite`.
- **Emoji are never used.** Unicode is used as *typography*, not iconography: `·` separator, `—` for
  absent values, `×` in "Batch ×", `°C`, curly quotes in confirm dialogs.

Complete glyph set: `play, plus, arrow-left, arrow-right, arrow-up, arrow-down, pencil, trash-2,
copy, check, star, coffee, glass-water, chevron-down, chevrons-up-down, x, image-plus, loader-2,
circle-check, octagon-x, info, triangle-alert`.

**Logo.** `assets/logo.svg` — an indigo mug in full side profile (solid silhouette, circular
handle, flat saucer) with two lavender steam ribbons. The ribbons were **vector-traced from a
reference image the owner supplied**; the geometry is kept in `assets/_steam-paths.json`.
`logo-reversed.svg` is for indigo/ink grounds, `logo-mono.svg` for single-colour use. There is no
wordmark glyph — the name is always set in Bricolage Grotesque `600` beside the mark.

---

## Index

### Root
- `styles.css` — the entry point. Consumers link this one file; it `@import`s everything below.
- `thumbnail.html` — homepage tile.
- `SKILL.md` — Agent-Skills front matter for use in Claude Code.
- `github.md` — upstream source association and sync record.
- `design_handoff_cafe_jamestine/` — **the self-contained handoff package for Claude Code.** `PROMPT.md` has the paste-ready prompt; `README.md` is the implementation brief.

### `tokens/`
`fonts.css` · `colors.css` · `typography.css` · `spacing.css` · `radius.css` · `elevation.css` ·
`motion.css` · `semantic.css` · `base.css`

`semantic.css` mirrors the app's shadcn variable names 1:1, so it can replace the `:root` block in
`src/app/globals.css` and every existing `className` keeps working.

### `assets/`
`logo.svg` · `logo-reversed.svg` · `logo-mono.svg` · `_steam-paths.json`

### `guidelines/`
23 specimen cards — **Colors** (brand anchors, indigo/lavender/mint ramps, neutrals, phase ramp,
status, semantic aliases), **Type** (display, headings, body, brew-mode scale, eyebrow, mono),
**Spacing** (scale, layout constants, list-beside-detail, radii, elevation, interaction & mode
states), **Brand** (logo, lockup, iconography).

### Components
Every component has a sibling `.d.ts` contract and a `.prompt.md` usage note.

**`components/core/`** — `Button`, `Badge`, `Card` (+ `CardHeader`, `CardContent`, `CardFooter`), `Icon`, `Toast`

**`components/forms/`** — `Label`, `Input`, `Textarea`, `Field`, `Select`, `Combobox`, `Switch`

**`components/patterns/`** — `ListRow`, `SectionHeading`, `ViewRow`, `PhaseStepper`, `SplitPane`,
`BrewParam`, `RatingControl`, `StepsTable`, `EmptyState`, `ConfirmPanel`, `Dialog`

Mapping to source: `Button`/`Badge`/`Card`/`Input`/`Textarea`/`Label`/`Select`/`Switch`/`Dialog` are
the shadcn primitives in `src/components/ui/`; `Toast` is the styled Sonner `Toaster`; `Combobox`
consolidates `reference-select.tsx`, `multi-reference-select.tsx` and `coffee-select.tsx`; `Field` is
`fields.tsx`; `ViewRow` is its `ViewRow`; `StepsTable` is the read mode of `steps-editor.tsx`;
`RatingControl` is the 1–5 row in `tasting-editor.tsx`; `ConfirmPanel` is the inline Mark-complete
gate; `ListRow`, `SectionHeading` and `EmptyState` are the app's row/heading/empty conventions.

#### Intentional additions
| Addition | Why |
| --- | --- |
| `Icon` | The source imports `lucide-react` per-glyph; a browser design system needs one wrapper over the UMD build. |
| `PhaseStepper` | The brief replaces the flat tab bar with a numbered stepper and renames Confirm → **Plan**. Carries the phase ramp. |
| `SplitPane` | The brief replaces the narrow centred column with list-beside-detail on landscape. |
| `BrewParam` | Brew mode is read at 1–2 ft, which needs its own type scale and tile treatment. |
| `--lavender-*` ramp | The brief asks the palette to represent both owners. |
| Phase ramp tokens | From James's espresso cups; makes stepper position readable without reading labels. |
| Bricolage + Instrument Sans | The source uses Geist with no display face. Both chosen with the owner from side-by-side options. |

#### Not built (absent from the source)
Tooltip, Accordion, Avatar, Table primitives, Pagination, Breadcrumb, DatePicker (the app uses a
native `type="date"` input), Slider, Progress. If you need one, build it from these tokens and say so.

### `ui_kits/app/`
Landscape click-through of the whole product: launchpad, sessions, three-step wizard, the four-phase
session workflow, brew mode at mount scale, coffees rail + detail + bags, recipes rail + detail,
equipment, reference, sign-in. See `ui_kits/app/README.md` for the screen-to-source map.

### `templates/app-screen/`
A copyable Design Component scaffold: top bar, nav, content column, list rows.

---

## Working in this brand — quick rules

1. Hairline border before a shadow; shadow before a fill.
2. **14px** is the interface; 16px is a read view; the `--brew-*` scale is brew mode only.
3. Data-entry controls are **2.75rem**; chrome controls are 2.25rem.
4. **One** filled indigo button per view. Everything else is outline or ghost.
5. Spend width on content. If a screen has a list and a detail, put them side by side.
6. If a value is empty, **remove the row** — never print a placeholder.
7. The phase ramp means session position. Nothing else may use it.
8. Nothing animates except colour.
