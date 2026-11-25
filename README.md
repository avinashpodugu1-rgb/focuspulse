# FocusPulse — Vibe-to-Product Launch Sprint

**Chosen vertical:** Student & developer productivity — an AI study/work companion for people who struggle with context switching and burnout.

## What's in this repo
| File | Purpose |
|---|---|
| `index.html` | Task B — single-file, responsive web app (HTML + CSS + JS, no dependencies) with hero section, energy-aware planner and 25-minute timer |
| `system_prompt.md` | Task A — production-ready system prompt (under 250 words) |
| `hero_copy_and_image_prompt.md` | Task C — landing hero copy and 3D hero image-generation prompt |
| `prompts.md` | Exact prompts used for each deliverable and the iteration chain |
| `tests/planner.test.js` | Automated checks for the planning logic (`node tests/planner.test.js`) |

## Approach and logic
1. **Energy → strategy.** Low energy gets a gentle tone and 3 tiny steps starting with a 3-minute setup win. Medium gets a plan/build/check rhythm. High attacks the hardest part first.
2. **One sprint, no scope creep.** Every plan is capped at 25 minutes. Ideas that appear mid-sprint go to a Parking Lot instead of expanding the plan.
3. **Edge cases.** Impossible or very tight deadlines give an honest, smaller slice plus a suggestion to cut scope or ask for an extension. Burnout language triggers a 5-minute break with no added work. Empty task or missing energy asks for the missing input.
4. **Coherence.** The app's planner (`buildPlan` in `index.html`) implements the same rules as `system_prompt.md`, and the hero copy and image prompt use the same palette (`#0B0D14`, `#7C5CFF`, `#22D3EE`).

## How it works
1. Enter one task, choose Low / Medium / High energy, optionally add minutes until the deadline.
2. Get an instant micro-plan with per-step minutes.
3. Start the sprint: the timer highlights the current step; park distractions as they come.
4. At the end you get a break prompt and your parked ideas are waiting.

Open `index.html` in any browser. Run tests with `node tests/planner.test.js`.

## Assumptions
- The prototype runs the planner locally (deterministic, offline) so it works with no API key. The same rules are in `system_prompt.md` to drop into any LLM for richer plans.
- Time is based on the system clock (`Date.now`), so the timer stays accurate if the tab is throttled.
- Task text is capped at 200 characters and is only ever written with `textContent` (no `innerHTML`).

## Quality notes
- **Security:** strict Content-Security-Policy meta tag, no external requests, no storage of user data, no `innerHTML`.
- **Accessibility:** labelled inputs, fieldset/legend for energy, visible focus, skip link, `role="timer"`, live-region announcements, reduced-motion support, mobile-friendly tap targets.
- **Efficiency:** no libraries or network calls; the timer uses one interval at 250 ms.
- **Testing:** 11 unit checks covering energy variants, deadlines, burnout, and bad input.
