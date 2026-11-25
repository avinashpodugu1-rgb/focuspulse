# FocusPulse — Vibe-to-Product Launch Sprint

![CI](https://github.com/avinashpodugu1-rgb/focuspulse/actions/workflows/ci.yml/badge.svg)

**Chosen vertical:** Student & developer productivity — an AI study/work companion for people who struggle with context switching and burnout.

## Quick start
Open `index.html` in any browser. No build step, no dependencies, no network calls.

```
npm install     # dev tooling only (jsdom, ESLint)
npm test        # 31 unit + UI tests
npm run lint    # ESLint over index.html and tests
npm run check   # lint + tests
```

## Repository layout
| Path | Purpose |
|---|---|
| `index.html` | **Task B** — single-file responsive web app: hero, energy-aware planner, 25-minute timer, Parking Lot |
| `system_prompt.md` | **Task A** — production-ready system prompt (240 words, under the 250 limit) |
| `hero_copy_and_image_prompt.md` | **Task C** — hero copy and a 3D dark-mode image-generation prompt |
| `prompts.md` | Exact prompts used and the iteration chain (prompt transparency) |
| `tests/planner.test.js` | Unit tests for the planning logic, including invariants over every energy × task × deadline combination |
| `tests/ui.test.js` | UI tests that drive the real `index.html` in jsdom (form, timer, Parking Lot, accessibility, security markup) |
| `eslint.config.js`, `.editorconfig` | Lint rules (incl. the JS inside `index.html`) and editor consistency |
| `.github/workflows/ci.yml` | Runs lint and tests on every push |
| `Dockerfile` | Serves `index.html` with nginx on port 8080 (Cloud Run ready) |

## Approach and logic
1. **Energy → strategy.** Low gets a gentle tone and 3 tiny steps starting with a 3-minute setup win. Medium gets a plan/build/check rhythm. High attacks the hardest part first.
2. **One sprint, no scope creep.** Every plan is capped at 25 minutes. Ideas that appear mid-sprint go to a Parking Lot instead of expanding the plan.
3. **Edge cases.** Impossible or tight deadlines give an honest, smaller slice plus advice to cut scope or ask for an extension. Burnout wording triggers a 5-minute break with no added work. Empty task or missing energy asks for the missing input. Oversized tasks are shrunk to one slice with "next sprints" listed.
4. **Coherence.** The app's planner implements the same rules as `system_prompt.md`. Hero copy and image prompt share the app's palette (`#0B0D14`, `#7C5CFF`, `#22D3EE`).

## How it works
1. Enter one task, choose Low / Medium / High energy, optionally add minutes until the deadline.
2. Get an instant micro-plan with per-step minutes.
3. Start the sprint: the timer highlights the current step; park distractions as they come.
4. At the end you get a break prompt and your parked ideas are waiting.

## Architecture (inside `index.html`)
- **Core** (pure functions, no DOM): `buildPlan` (composed from `buildBreakPlan`, `buildNote`, `allocate`, `classify`, `parseDeadline`), plus `activeStepIndex` and `formatClock`. Named constants, frozen templates, JSDoc typedefs. Tested on its own.
- **UI** (one IIFE): cached element lookups, a `setView` switcher, and small single-purpose functions (`readForm`, `renderPlan`, `updateClock`, `updateActiveStep`, `togglePause`, `buildDoneCard`, `onParkIdea`). The single-file requirement is kept, but core and UI are clearly separated.

## Quality notes
- **Code quality:** core/UI separation, short single-purpose functions, named constants instead of magic numbers, JSDoc typedefs, `'use strict'`, ESLint (`no-var`, `prefer-const`, `eqeqeq`, `no-shadow`, `no-unused-vars`) enforced in CI, `.editorconfig`.
- **Security:** strict Content-Security-Policy (`default-src 'none'`), no external resources, no `innerHTML`/`eval`, all user text written with `textContent`, input length caps, no storage and no network. Tests enforce these rules.
- **Efficiency:** timer is wall-clock based (accurate even if the tab is throttled), the DOM is written only when the displayed second or active step changes, the progress bar uses a GPU-friendly `transform`, no libraries.
- **Testing:** 31 automated tests, run in CI. They found and fixed a real edge case (minute allocation for deadlines shorter than the number of steps).
- **Accessibility:** every control has a programmatic label (including the visually hidden Parking Lot label), fieldset/legend for energy, visible focus rings, skip link, `role="timer"`, polite live-region announcements, `aria-invalid` on errors, reduced-motion support, 48px touch targets, dark theme with high-contrast text, `noscript` message.

## Assumptions
- The prototype runs the planner locally (deterministic, offline) so it works with no API key. The same rules live in `system_prompt.md` for use with any LLM.
- Time comes from the system clock (`Date.now`), so the timer stays accurate if the tab is throttled.
- Task text is capped at 200 characters; deadlines are capped at 10,000 minutes.

## License
MIT
