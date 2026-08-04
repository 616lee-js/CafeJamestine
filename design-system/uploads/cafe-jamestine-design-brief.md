# Café Jamestine — Design Brief

*A brief for a full visual redesign. It describes what the app is, who it's for, the principles it should honor, the look and feel I'm reaching for, and recommended UI layouts screen by screen. It's self-contained — no prior context needed.*

*What I'm looking for: realize the layouts and principles below, and help me develop the visual identity. The layout and structure are largely settled; the visual system (color, type, spacing, icons, components) is open — I have a direction, and I want to explore and refine it with you. Treat specifics I've left open as invitations to propose, not gaps to fill silently — show me options.*

---

## What the app is

**Café Jamestine** is a personal specialty-coffee tracking app (a PWA) — named after my home coffee bar. It's the authoritative record of how I prepare and reflect on coffee: it tracks the coffees I buy, the physical bags of each, my equipment, my recipes, and my **brewing/preparation sessions**, and it captures tasting feedback after each one. Over time it accumulates data I'll use for insight, and eventually to share drinks with visitors.

It handles **two kinds of session**:
- **Brewed coffee** — pour-over and similar: a coffee, a recipe, timed pour steps.
- **Specialty drinks** — lattes, signature drinks: an ingredient list and prose steps, no coffee-bag reference.

Single primary user (me) today, with a small number of invited users later. This isn't a mass-market product — it's a crafted personal tool, and it should feel like one.

---

## Who it's for and how it's used

The usage context shapes the design more than anything, so it's worth understanding up front. The app meets me in **three distinct modes**:

1. **Prep** — logging a new coffee or bag, building or tweaking a recipe. Happens on any device (desktop, iPad, sometimes phone), often with a keyboard. Data-heavy forms; efficient typed entry matters.
2. **Brewing reference** — while I actually brew, my iPad sits on an **eye-level mount at the coffee bar** and I *read* the recipe at arm's length. I don't tap it mid-brew. This screen must be **large, glanceable, and legible from a distance** — the most distinctive requirement in the app. Legibility and calm beat density here.
3. **Reflection** — capturing tasting feedback, at the bar or relocated to a couch/desk, on any device.

**Primary surface: desktop and landscape iPad. Mobile is a secondary reflow.** Design landscape-first; let mobile stack gracefully underneath. The brewing-reference screen especially is a landscape, distance-legible view.

---

## Design principles

The north star for the whole design. When two pull against each other, resolve it in context.

1. **Plan of record.** The app is the authoritative, navigable record of my craft — preparation and reflection. Its **credibility and navigability** carry the weight; the design should make the record feel trustworthy and easy to move through, not romanticize data entry.
2. **Relationships are two-way.** Every connection is traversable from both ends. A coffee shows the sessions brewed with it; a session names its coffee. Detail views surface *related things*, not just their own fields.
3. **Structure serves the workflow.** The layout bends to how I actually work; I never contort my process to fit a rigid structure.
4. **Right information, right moment.** Separate the essential few from the rarely-needed many — surface the essentials, tuck the rest into detail or collapsible sections. What counts as essential differs per screen.
5. **Presentation adapts to context — and the contexts will grow.** Prep, brewing-reference, and reflection are distinct today; insights and community features are coming. Don't hard-code a look that only fits today's modes. The brewing reference is the standout; the active session is the anchor that follows me across modes.
6. **Touch actions reliably register.** Controls sized and spaced for confident input across devices — generous targets, nothing hover-dependent.
7. **Workflows progress through visible, intentional phases on one continuous surface.** Movement through a task is oriented and deliberate — headers or a sub-bar, not a scroll or disconnected page-hops. Committing a step is a clear, purposeful action.

---

## Look and feel

This is the layer I most want your help developing. I have a direction, not a finished identity.

**The feeling.** Clean, but **not stark or minimalist**. It should feel warm, crafted, and personal — a passionate hobbyist's tool with character, not a barebones admin panel or a cold database. **Structured, but not stiff.** There's real data underneath (parameters, ratings, histories), and it should never *read* like a spreadsheet. Think considered and inviting rather than utilitarian.

**Mode:** **Light mode is primary** (dark mode also supported down the line).

**Deliberately non-minimal.** I don't want stark, empty minimalism. I want intention and craft — texture, warmth, personality — while staying uncluttered and legible. Clean in the sense of *not noisy*, not in the sense of *stripped bare*.

**Typography.** Leaning toward something clean and highly readable (a Roboto-ish direction is a fair starting point), but I want the type to feel **intentional and crafted**, not defaulted. Propose a type system — a real scale and pairing — rather than one flat font. Legibility at a distance matters for the brewing-reference screen.

**Space and margins.** Use whitespace **generously but deliberately** — never wastefully. This is important: the current app centers a narrow column and leaves vast empty margins on wide screens. On landscape, **spend horizontal space on content** — a persistent list beside a detail view, multi-column layouts where it helps — rather than a thin column floating in emptiness. Generous internal padding and calm spacing, yes; acres of dead outer margin, no.

**References I'm drawing from — for structure and behavior, not to copy their skin.** I like the *layout logic* of **Claude** and **Notion**: a persistent list or nav on the left, where selecting an item loads it in the main area, and the main area both shows content and navigates to nested/linked things. I also appreciate **Notion's flexible use of margins and whitespace and its cleaner typography**. Borrow those patterns and that sense of calm — but the visual identity should be **distinctly mine**, not a clone of either. Extract the principle, leave the skin.

**Primary actions** currently render as solid dark buttons, which reads clearly as "this is the main thing." Keep unmistakable primary-action emphasis, however you style it.

**Status** is a recurring concept — coffee bags and sessions move through statuses (resting, active, frozen, finished; active/complete). A **consistent status-pill treatment** across the app would help these read at a glance.

**Open for you to propose and iterate with me** (I have the direction above but haven't locked specifics): the exact **color palette and theming**, the **type scale and pairing**, the **spacing scale**, **iconography**, **shape language** (corners, borders, elevation), and **card styling**. Show me options in the warm-but-clean, light-mode, crafted direction. I'd rather choose among considered proposals than have defaults chosen for me.

---

## UI layout recommendations, screen by screen

The structure below is settled; render it in the visual language we develop.

### Global navigation — a top bar

A persistent **top bar** is the global frame (not a left rail). It holds the brand and the primary destinations: **Coffees · Sessions · Recipes** (with a Sign out). Flat, no dropdowns. The **brand routes to the Landing page**, not to a section.

Everything else — the session stepper, the Coffees list — is **sub-navigation nested inside a section, beneath this top bar.** Keep these two levels visually distinct: the global bar on top, in-section navigation within the section below it.

*(Two placement questions are still open and fine to treat flexibly: where **Equipment** lives, and how prominent the **reference-list management** area is. Both are low-frequency; don't give them heavy billing.)*

### Landing — a launchpad

The app opens here. It's a **pure launchpad** — its job is to launch, not to be a dashboard.
- **Start a session** — the hero, the one dominant action. Prominent but focused (a single primary action reads stronger contained than stretched edge-to-edge).
- **Resume** — a quiet, conditional line that appears *only* when a session is unfinished. A soft reminder, never competing with the hero.
- **Area cards** — plain entries into Coffees / Sessions / Recipes. No counts or stats.
- **A reserved (empty) region** for future insights/dashboard content — visible as a placeholder, nothing in it yet.

Landscape composition: a two-column "act" zone (hero + quiet resume on the left; a reserved slot on the right) over the row of area cards — using the width, not a tall stack.

### Session workflow — a phase stepper

**The centerpiece.** A session is **not one long scrolling page**. It's a sequence of **distinct phase screens, navigated via a sub-bar** beneath the global top bar — one phase filling the screen at a time. Committing a phase **moves you forward** to the next; the phase labels also work as tabs to move between phases freely.

The phases depend on the session type:
- **Brewed coffee:** **Confirm → Brew → Post-brew → Tasting.**
- **Specialty drink:** **Confirm → Make → Tasting** (no Post-brew).

Each phase:
- **Confirm** — the recipe laid out to review, read-first, with an explicit Edit; a clear **Confirm & brew** action advances to Brew.
- **Brew** — *the distinctive one.* A **large, glanceable, read-only reference** for the eye-level mount: the recipe parameters and pour steps in big, distance-legible type, calm and uncluttered, **no inputs**. This is the screen I read while actually brewing. Give it room to breathe and make it legible at arm's length.
- **Post-brew** (brewed coffee only) — total brew time and a notes field.
- **Make** (specialty only) — an ingredient list (name / quantity / unit) and ordered prose steps, read-first, with an optional **decimal batch multiplier** (e.g. 1.5×) that scales displayed quantities for batch prep.
- **Tasting** — an **overall enjoyment score (1–10)** set directly, plus **per-category ratings (1–5)** that capture *intensity/prominence* on each sensory spectrum (aroma, acidity, body, etc.) with optional notes, plus a "next-time adjustments" field. A clear **Mark complete** ends the workflow.

On completion, the session settles into a clean **read summary** (re-openable for editing). The read summary is a good candidate for **collapsible sections** to stay readable — worth designing.

### Session chooser (starting a session)

Reached from the Landing hero. A short **three-step flow**, each its own screen:
1. **Type** — "What are you making?" → Brewed coffee | Specialty drink (two clear choices).
2. **Select coffee** — brewed-coffee path only; a list of coffees available to brew.
3. **Parameter source** — Build new (blank) | Clone a recipe | Clone a prior session (a primary "Build new" option, then grouped lists of recipes and past sessions).

Committing lands you in the workflow at Confirm.

### Coffees — a list with a read view

The pattern I want, echoing the Claude/Notion logic: **a list of coffees on the left; selecting one fills the main area with that coffee's read view; the list stays put** so I can move between coffees without page-hopping. This is also where landscape width earns its keep — list beside detail, not a narrow centered column.

- **The list (left)** is grouped by status — **Active** (ready to brew), **Storage** (held, including frozen), **History** (used up) — with a separate **Incomplete** filter for coffees not yet fully set up. Each entry shows a status pill.
- **The read view (main)** shows the coffee's details, then scrolls to two sections: its **bags** (each with a status pill and how long it's rested), and **the sessions brewed with this coffee** (a plain, tappable list — the two-way link back to sessions).

### Recipes

A destination for reusable recipe templates — **its layout isn't designed yet.** Treat it as open; I'd welcome a proposal consistent with the patterns above (likely the same list-plus-read-view shape as Coffees).

---

## Cross-cutting UI patterns

Consistency across screens matters more than any single screen — it's what keeps many pages feeling like one app.

- **View vs. edit.** Existing things open in a clean **read view** by default; editing is an explicit mode (Edit → Save/Cancel). Creating something new opens the form directly. Design a clear, consistent visual distinction between "reading" and "editing" states.
- **Two navigation shapes, applied consistently.** A **top sub-bar (stepper)** means *moving through a sequence* (the session workflow); a **list-plus-detail** layout means *browsing a collection* (Coffees, likely Recipes). Same vocabulary everywhere.
- **Context-aware back.** "Back" returns to wherever I came from, not a fixed section home — reach a session from a coffee, and back returns to that coffee.
- **A consistent feedback / confirmation convention.** The app needs one coherent pattern for confirming destructive actions and signaling that something happened (saved, cloned, deleted). Define it once and apply it everywhere rather than per-screen.
- **Consistent status pills**, card styling, and grouping-by-status treatment shared across list surfaces.

---

## Device and responsive priority

**Design desktop / landscape-iPad first; mobile is a secondary reflow.** On landscape, favor list-plus-detail and multi-column layouts that use the horizontal space. On mobile, let those stack — a list becomes a full-screen index that pushes to detail; a stepper's phase tabs wrap or scroll; each phase still fills the screen one at a time. The brewing-reference screen is fundamentally a landscape, distance-legible view.

---

## What would help me most

Take the layouts and principles above as settled intent, and **develop the visual identity on top of them** — a cohesive system of type, color, spacing, iconography, and components in the *warm-but-clean, light-mode, crafted, non-minimal* direction. Keep it feeling **personal and considered**, never templated. Where I've left specifics open, **show me options** so I can choose and refine with you — the goal is for this to end up feeling like it's genuinely mine.
