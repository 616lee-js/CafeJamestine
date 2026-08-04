# How to hand this to Claude Code

## 1. Put the folder in your repo

You downloaded the whole design system as one folder. Drop it at the **root of your CafeJamestine
repo** and name it `design-system/`:

```
CafeJamestine/
├── design-system/                 ← the whole downloaded folder
│   ├── design_handoff_cafe_jamestine/   ← the brief you're reading
│   ├── ui_kits/app/index.html           ← the clickable prototype
│   ├── tokens/                          ← the CSS variables
│   ├── assets/                          ← the logo, 3 variants
│   ├── components/                      ← reference implementations
│   └── guidelines/                      ← colour, type, spacing specimens
├── src/
├── public/
├── package.json
└── ...
```

It is reference material, not source — nothing imports from it and it won't affect your build.
Delete it when the redesign is done, or keep it as the record of intent.

## 2. Look at the design first

Open `design-system/ui_kits/app/index.html` in a browser (double-click works). That's the clickable
prototype of the whole redesign. Walk it before you start so you know what you're aiming at:

> Launchpad → **Start a session** → Brewed coffee → Ethiopia Guji → *Build new (blank)* → **Edit**
> in Plan → **Confirm & brew** → read brew mode → *Done brewing* → **Post-brew** → **Tasting** →
> *Mark complete*

Then browse the specimen cards in `design-system/guidelines/` — each one opens in a browser too.

## 3. Paste this into Claude Code

Everything below the line. Nothing to fill in.

---

I want to implement a full visual redesign of this app. The complete design spec is in
`design-system/` at the repo root.

Start by reading `design-system/design_handoff_cafe_jamestine/README.md` in full. It is
self-sufficient — every colour, type size, spacing value, layout rule, screen breakdown,
interaction state and acceptance criterion is specified numerically. Where it disagrees with a
shadcn or Tailwind default, it wins.

Then read `design-system/design_handoff_cafe_jamestine/DESIGN_BRIEF.md` for the reasoning behind the
decisions — the three usage modes, the layout principles, and the intent of each screen.

Key context before you begin:

- This is **presentation only**. The domain model, routes, Supabase schema and server-action data
  flow do not change.
- The files in `design-system/ui_kits/app/` and `design-system/components/` are **design references
  written in browser-only HTML/JSX with inline styles**. Do not port the inline styles and do not
  copy those files into `src/`. Recreate the designs using this codebase's existing patterns:
  Tailwind v4 utility classes, `src/components/ui/*` as the primitive layer, server actions for data.
- `design-system/tokens/semantic.css` deliberately mirrors the existing shadcn CSS variable names
  1:1, so replacing the `:root` block in `src/app/globals.css` with it recolours the whole app
  without breaking a single existing `className`. Start there.
- Follow the **implementation order** in the README's "Implementation order" section — it is
  sequenced so each step is verifiable before the next. Do not jump ahead to the session workflow.
- Do not add a timer to brew mode, do not fill the launchpad's reserved insight region, and do not
  build dark mode. All three are deliberate.

Before writing code, give me:

1. A short plan mapping each step of the README's implementation order to the specific files in
   `src/` you'll touch.
2. Any place where the spec conflicts with something already in the codebase.
3. The four open questions from the end of the README, with your recommendation on each.

Then stop and wait for me to confirm the plan.

---

## 4. Working through it

The README's implementation order is deliberately sequenced — tokens and fonts first, because that
recolours everything and proves the palette before any layout changes; then assets, primitives,
shell, and only then screens. Ask Claude Code to do **one step per session** and check the result in
the browser before moving on. Step 1 alone should visibly change the whole app while breaking nothing.

The last section of the README, "Acceptance criteria", is a checklist. Hand it back to Claude Code
at the end and ask it to verify each line.
