repo: 616lee-js/CafeJamestine
branch: main

## Last sync

date: 2026-08-03T08:00:00Z

### Updated in this project
- Full visual redesign: indigo/lavender/mint palette replacing stock shadcn neutrals.
- New logo — indigo mug with lavender steam vector-traced from an owner-supplied reference.
- Landscape-first layout system: list-beside-detail replaces the 56rem centred column.
- Session workflow rebuilt as a phase stepper (Plan/Brew/Post-brew/Tasting) with brew mode at mount scale.

## Screen map

| Project screen | Repo files |
| --- | --- |
| ui_kits/app/AppShell.jsx | src/app/(app)/layout.tsx, src/app/layout.tsx |
| ui_kits/app/Landing.jsx | src/app/(app)/page.tsx |
| ui_kits/app/Sessions.jsx | src/app/(app)/sessions/page.tsx |
| ui_kits/app/NewSession.jsx | src/app/(app)/sessions/new/new-session-wizard.tsx |
| ui_kits/app/SessionWorkflow.jsx | src/app/(app)/sessions/[id]/session-detail.tsx, src/components/steps-editor.tsx, src/components/ingredients-editor.tsx, src/components/tasting-editor.tsx, src/components/fields.tsx |
| ui_kits/app/Brew.jsx | src/app/brew/[id]/page.tsx, src/app/brew/[id]/complete-button.tsx |
| ui_kits/app/Coffees.jsx | src/app/(app)/coffees/layout.tsx, src/app/(app)/coffees/coffee-list-rail.tsx, src/app/(app)/coffees/[id]/coffee-detail.tsx, src/app/(app)/coffees/[id]/bags-section.tsx |
| ui_kits/app/Recipes.jsx | src/app/(app)/recipes/recipe-list.tsx |
| ui_kits/app/Equipment.jsx | src/app/(app)/equipment/page.tsx |
| ui_kits/app/Reference.jsx | src/app/(app)/reference/reference-manager.tsx |
| ui_kits/app/Login.jsx | src/app/login/page.tsx |
| ui_kits/app/Rail.jsx | src/app/(app)/coffees/coffee-list-rail.tsx |
| tokens/*.css | src/app/globals.css, src/components/ui/*.tsx |
| components/core, components/forms, components/patterns | src/components/ui/*.tsx, src/components/*.tsx |
| design_handoff_cafe_jamestine/README.md | the whole src/ tree — implementation brief |

## Sync history

### 2026-08-03 (initial build)
Built the design system from the app source: tokens, specimen cards, components, one UI kit.
Sampled the then-current brand anchors (coffee #6f4e37, cream #efe6dd) from public/icon-*.png.
Superseded by the redesign above — the coffee palette now survives only as the session phase ramp.
