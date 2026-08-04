# UI kit — Café Jamestine (home cafe app)

Landscape-first click-through of the redesigned app. Open `index.html`. Fixture data only; nothing persists.

## Screens

| Screen | File | Source / brief section |
| --- | --- | --- |
| App chrome — top bar + sub-bar slot | `AppShell.jsx` | brief "Global navigation"; `src/app/(app)/layout.tsx` |
| Launchpad | `Landing.jsx` | brief "Landing — a launchpad"; `src/app/(app)/page.tsx` |
| Shared list rail | `Rail.jsx` | brief "Coffees — a list with a read view" |
| Sessions (rail + grouped list) | `Sessions.jsx` | `src/app/(app)/sessions/page.tsx` |
| New-session wizard, 3 steps | `NewSession.jsx` | brief "Session chooser"; `sessions/new/new-session-wizard.tsx` |
| Session workflow — Plan / Brew / Post-brew / Make / Tasting | `SessionWorkflow.jsx` | brief "Session workflow — a phase stepper"; `sessions/[id]/session-detail.tsx` + the three editors |
| Brew mode at mount scale | `Brew.jsx` | brief "Brew — the distinctive one"; `src/app/brew/[id]/page.tsx` |
| Coffees — rail + read view + bags + back-links | `Coffees.jsx` | `src/app/(app)/coffees/**` |
| Recipes — rail + read view | `Recipes.jsx` | brief "Recipes" (layout was open; proposed as list+detail) |
| Equipment | `Equipment.jsx` | `src/app/(app)/equipment/page.tsx` |
| Reference lists | `Reference.jsx` | `src/app/(app)/reference/reference-manager.tsx` |
| Sign in | `Login.jsx` | `src/app/login/page.tsx` |

## Try this path

Launchpad → **Start a session** → Brewed coffee → Ethiopia Guji → *Build new (blank)* → **Edit** in
Plan → **Confirm & brew** → read brew mode → *Done brewing* → **Post-brew** → **Tasting** →
*Mark complete*. Then Coffees, and switch coffees in the rail — the detail pane swaps, the rail stays.

## Deliberate gaps

- The launchpad's right-hand panel is a **reserved, empty insight region** — that is how the brief specifies it.
- Brew mode has **no timer**. The user's own equipment owns timing.
- Image upload renders the placeholder frame only.
- Recipes' layout was left open in the brief; this is a proposal, matched to the Coffees shape.
