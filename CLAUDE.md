# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static GitHub Pages portfolio (served from the repo root at `maximus-anderson.github.io`). No build step, no package manager, no test suite — edit files and refresh the browser. Three.js and Google Fonts are pulled from CDNs via an `importmap` in `index.html`; there are no local `node_modules`.

To preview locally, serve the directory over HTTP (e.g. `python -m http.server` in the repo root) so ES module imports resolve. Opening `index.html` via `file://` will break the importmap and GLB fetch.

## Architecture

The repo is two independent single-page apps that share fonts but nothing else:

### Portfolio (`index.html` + `logic.js` + `car-viewer.js` + `styles.css`)

**Pages are not routes.** `index.html` contains every "page" as a sibling `<div class="page" id="<name>-page">` element. `logic.js::switchPage()` toggles the `active` class and runs fade animations; the URL never changes. Navigation triggers come from `.nav-links a[data-page]`, `.project-card[data-page]`, `.project-banner[data-page]`, and `.back-button[data-page]`.

**The landing experience is scroll-driven.** A tall invisible `.car-scroll-driver` element on `#projects-page` provides the scroll distance that `car-viewer.js` maps onto camera position, hero-text opacity, and project-banner opacity. The key constants live at the top of `car-viewer.js`:

- `CAM_INTRO` / `CAM_BROWSE` — camera keyframes, recomputed on mobile via `matchMedia('(max-width: 600px)')`.
- `SCROLL_CAM_START` (0.18), `SCROLL_CAM_END` (0.52) — fraction of the scroll driver over which the camera interpolates.
- `SCROLL_BANNERS_SHOW` (0.42), `SCROLL_BANNERS_FULL` (0.60) — fraction range for banner fade-in.

**`logic.js` and `car-viewer.js` are coupled through `SCROLL_CAM_START`.** The nav bar morphs from full banner to pill via the `.scrolled` class on `.navigation`, and `logic.js::getCarMorphThreshold()` hard-codes the same `0.18` fraction so the morph fires exactly when the car starts moving. Changing one without the other desyncs the transition.

**Three.js assets.** `car-viewer.js` loads `modules/CR30-Attempt_5-Render.glb` with a `GLTFLoader` wrapping a `DRACOLoader` whose decoder path points at the jsdelivr `three@0.168.0` CDN. The Three.js version in that URL must match the version in the `index.html` importmap. All meshes are re-materialled with a single shared `MeshStandardMaterial` (`carbonMat`); the GLB's own materials are discarded.

**Timeline popups.** Each `.timeline` contains markers with `data-description="<id>"` that target a `.timeline-description-content#<id>` inside a shared `#timeline-popup`. Only one description is visible at a time; click-outside closes the popup.

### Quiz (`quiz.html` + `quiz.js` + `quiz.css`)

Standalone adaptive ELO quiz at `/quiz.html`, reachable from the portfolio but otherwise isolated. The question bank is a literal array `QUESTION_BANK` at the top of `quiz.js` — each entry has `{ id, topic, elo, question, choices, answer, explanation }`. IDs must stay unique and stable because they are persisted.

Both the user and each question carry an ELO rating that updates after every answer (standard Elo with `USER_K=24`, `QUESTION_K=32`). State persists in `localStorage` under `STORAGE_KEY='ptf_state'`; the stored shape includes `userElo`, `streak`, `totalAnswered`, `totalCorrect`, `recentIds` (a rolling buffer of size `RECENT_BUFFER=8` to avoid repeats), and `questionElos` (per-question ELO overrides layered on top of the bank defaults). Level labels are thresholded in the `LEVELS` array; `CHALLENGE_OFFSET=80` biases question selection slightly above the user's current ELO.

When adding or editing questions, preserve existing `id` values so user-specific `questionElos` keep pointing at the right question.
