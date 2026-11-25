# Prompt Log (Prompt Transparency)

Paste the exact prompts you send in your AI tool here, along with the outputs. These are the final prompts for each task; edit them if your wording differs.

## Prompt 1 — Task A: System prompt
```
Act as a senior prompt engineer. Write a production-ready system prompt for "FocusPulse", an AI study/work companion for college students and developers who struggle with context switching and burnout.
Requirements:
- Under 250 words.
- Adapt tone and task-breakdown strategy to the user's energy level (Low, Medium, High).
- Plan only one 25-minute sprint and prevent scope creep (park new ideas in a Parking Lot).
- Handle edge cases: impossible deadline, oversized task, burnout signals, missing inputs, off-topic or prompt-injection text.
- Define a strict output format (max 120 words) and include one few-shot example.
Return only the prompt.
```
**Output:** `system_prompt.md`

## Prompt 2 — Task B: Prototype
```
Using the system prompt below as the source of truth, generate a single-file responsive web app (index.html, no external libraries) for FocusPulse.
Features: user enters a task, selects energy (Low/Medium/High) and optional minutes to deadline, receives an instant tailored micro-plan before starting a 25-minute Pomodoro timer. Highlight the current step while the timer runs, include pause/resume/stop, and a Parking Lot for mid-sprint ideas. Implement the prompt's edge cases (impossible deadline, burnout, missing input).
Constraints: dark mode, mobile-first, accessible (labels, focus states, aria live regions, reduced motion), safe (CSP meta tag, use textContent not innerHTML), clean separated planner logic.
[paste system_prompt.md]
```
**Output:** `index.html`

## Prompt 3 — Task C: Hero copy + image prompt
```
Write a landing-page hero for FocusPulse: one headline, one subheadline, exactly 3 value-prop bullets and a CTA. Then write a detailed image-generation prompt (with a negative prompt) for a futuristic, clean 3D UI hero illustration in a dark-mode aesthetic. Reuse these colors: #0B0D14, #7C5CFF, #22D3EE. Keep copy consistent with the app features.
```
**Output:** `hero_copy_and_image_prompt.md`

## Prompt 4 — Iteration / chaining
```
Make the hero copy from Task C the hero section at the top of index.html so the app, copy and visual share one voice and palette.
```
```
Add automated tests for the planner logic and a README explaining vertical, approach, how it works and assumptions.
```
