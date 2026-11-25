<div align="center">

<img width="1200" height="627" alt="FocusPulse Cover Card" src="https://github.com/user-attachments/assets/b6589e31-2679-4020-92d7-72094facbf56" />

# ⚡ FocusPulse
### Focus in 25. Burn out never.

**An energy-aware AI productivity & sprint companion engineered to eliminate context switching and scope creep.**

[![CI](https://github.com/avinashpodugu1-rgb/focuspulse/actions/workflows/ci.yml/badge.svg)](https://github.com/avinashpodugu1-rgb/focuspulse/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Google_Cloud_Run-4285F4?style=flat&logo=google-cloud&logoColor=white)](https://focuspulse-398222261224.europe-west1.run.app/)
[![Tests](https://img.shields.io/badge/Tests-31_Passing-brightgreen?style=flat)](#quality-assurance--testing)
[![Zero Dependencies](https://img.shields.io/badge/Runtime_Dependencies-0-success?style=flat)](#architecture--tech-stack)

[🚀 Launch Live App](https://focuspulse-398222261224.europe-west1.run.app/) • [🖼️ Product Walkthrough](#product-walkthrough--screenshots) • [✨ Core Features](#core-features) • [🗂️ Repository Structure](#repository-architecture)

</div>

---

## 🎯 Overview

Modern productivity tools often fail students and developers because they treat every hour of the day as equal—leading to over-scoped to-do lists, constant context switching, and cognitive burnout. 

**FocusPulse** solves this by adapting to your real-time mental bandwidth. Built in a **45-minute AI + prompt engineering sprint**, it scopes a single task down into an achievable **25-minute micro-sprint** calibrated to your current energy level, while actively shielding your focus from mid-sprint distractions.

---

## 🖼️ Product Walkthrough & Screenshots

### 1. Energy-Matched Micro-Planning (`Low` | `Medium` | `High`)
Select your current mental energy level and optional deadline constraint. FocusPulse dynamically breaks down your task into an actionable, time-boxed 3-step micro-plan paced to match how you actually feel.

<img width="1200" height="800" alt="Energy-Matched Micro-Plan Output" src="https://github.com/user-attachments/assets/4be1bffb-8fc6-4cf5-9e49-046f2258c9ce" />

---

### 2. Active 25-Minute Sprint Timer & Mid-Sprint "Parking Lot"
Once the sprint begins, a distraction-free 25:00 countdown tracks your active step while the **🅿️ Parking Lot** lets you capture sudden ideas (`"Redesign my notes template"`) without derailing your current flow state.
<img width="1200" height="800" alt="4_sprint_running" src="https://github.com/user-attachments/assets/051990a0-f5eb-4752-a48d-ec1001cd0715" />



---

## ✨ Core Features

* **🔋 Energy-Aware Micro-Planning (`Low` | `Medium` | `High`):** Dynamically adjusts task scoping, pacing, and encouragement based on your real-time energy state.
* **⏳ Honest Deadline Calibration:** Evaluates optional deadline constraints (in minutes) and slices ambitious tasks into realistic deliverables rather than false promises.
* **⏱️ Distraction-Free 25-Minute Sprint Timer:** Clean execution timer (`Start`, `Pause`, `Stop`) paired with step-by-step time allocations (`4 min` → `14 min` → `7 min`).
* **🅿️ Mid-Sprint "Parking Lot" (Scope-Creep Shield):** Offloads intrusive thoughts and side ideas mid-sprint so they wait until after your session.
* **🔒 Privacy-First & Zero-Latency:** Runs 100% client-side in the browser with zero external runtime dependencies and zero user data leaving the page.

---

## 🗂️ Repository Architecture

This repository houses the end-to-end **Vibe-to-Product Launch Sprint**, bridging prompt engineering, frontend engineering, and brand/product positioning:

| File / Path | Component | Description |
| :--- | :--- | :--- |
| **[`index.html`](index.html)** | **Core Web Application** *(Task B)* | Single-file, responsive web app containing the hero interface, energy-aware micro-planner engine, 25-minute sprint timer, and interactive Parking Lot. |
| **[`system_prompt.md`](system_prompt.md)** | **AI System Prompt** *(Task A)* | Production-grade, constraint-tested AI system prompt engineered at **240 words** (strictly optimized under a 250-word token budget). |
| **[`hero_copy_and_image_prompt.md`](hero_copy_and_image_prompt.md)** | **Product Copy & Visual Direction** *(Task C)* | High-converting landing page hero copy paired with a structured 3D dark-mode image-generation prompt for brand visual assets. |

---

## 🚀 Quick Start & Local Development

### 1. Run the App Instantly
Because FocusPulse has **zero runtime dependencies** and requires no build step, simply open `index.html` in any modern web browser—or launch the **[Live Cloud Run Deployment](https://focuspulse-398222261224.europe-west1.run.app/)**.

### 2. Local Development & Verification
To run the automated test suite and code quality checks locally:

```bash
# Clone the repository
git clone [https://github.com/avinashpodugu1-rgb/focuspulse.git](https://github.com/avinashpodugu1-rgb/focuspulse.git)
cd focuspulse

# Install development tooling only (jsdom, ESLint)
npm install

# Run all 31 unit and UI tests
npm test

# Run ESLint across index.html and test suites
npm run lint

# Run full CI verification (lint + tests)
npm run check
