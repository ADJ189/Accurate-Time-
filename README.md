<div align="center">

# Session Clock

**The most feature-complete focus timer on the open web.**

*48+ animated themes · Easter eggs · Pomodoro · Binaural beats · Session intelligence · Token shop · PWA · Zero backend*

[![Deploy](https://img.shields.io/github/actions/workflow/status/ADJ189/Accurate-Time-/deploy.yml?label=Deploy&style=flat-square)](https://github.com/ADJ189/Accurate-Time-/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

[**Live Demo →**](https://accurate-time.pages.dev)

</div>

---

## Why Session Clock?

Most focus timers are bare-bones Pomodoro counters with a start button and a beep. Session Clock is a *complete focus environment* — with session intelligence, 42 cinematic animated themes, real psychoacoustic spatial audio, easter eggs, and a token economy that rewards consistent focus.

| What others give you | What Session Clock gives you |
|---|---|
| A countdown timer | Session intelligence: streak, velocity score, peak-hour analysis, flow state detection |
| A plain background | 42 animated themes — TV shows, movies, F1 teams, GoL, SMPTE, aurora physics, wormholes |
| A beep | 6 synthesised ambient soundscapes + binaural beats + ILD+ITD spatial audio + media controls |
| A timer log | GitHub-style heatmap, CSV export, shareable PNG focus cards, PiP floating clock |
| A webpage | Installable PWA, offline-capable, cross-tab sync, OS notifications, wake lock |
| Nothing | **8 hidden easter eggs** — Konami code, keyword triggers, midnight confetti, device shake |

---

## Themes — 42 total

### Natural
Aurora · Sunrise · Forest · Ocean · Candy · Nordic · Midnight (+ shooting stars) · Lemon · Blueprint · Living (Conway's Game of Life) · Common Room · SMPTE Timeline · Air-Gapped Terminal

### Literary
Literary Clock — 288 prose sentences, one for every 5-minute slot (00:00–23:55)

### TV Shows
**Severance** · **Mr. Robot** · **House of the Dragon** · **Moon Knight** · Supernatural · The Mentalist · The Sopranos · Dark · Breaking Bad · Stranger Things

### Movies
**Cyberpunk 2077** · **2001: A Space Odyssey** · **Tenet** · Interstellar (+ wormhole rings) · **Oppenheimer** · Dune · The Matrix · Blade Runner 2049 · Inception · The Godfather

### F1 Teams
Red Bull Racing · Scuderia Ferrari · Mercedes-AMG · McLaren · Aston Martin

### Anime ⛩
**One Piece** · **Attack on Titan** · **Death Note**

### Secret / Unlockable
**8-BIT** (Konami Code) · **Phoenix** (100 sessions milestone) · **The Bear**

> **Bold** = new themes added in v9.a

> **Bold** = new themes added in v9.a

---

## 🥚 Easter Eggs

There are 8 hidden easter eggs. Discover them yourself — or read on.

<details>
<summary>Reveal all easter eggs</summary>

| Trigger | Effect |
|---|---|
| **Konami Code** `↑↑↓↓←→←→BA` | Activates 8-BIT theme — pixelated font, CGA colours, chiptune chime |
| **Type `matrix`** | Full-screen green Matrix rain cascade for 5 seconds |
| **Type `heisenberg`** | Switches to Breaking Bad theme + quote flash |
| **Type `winchester`** | Switches to Supernatural theme + quote flash |
| **Type `redjohn`** | Switches to The Mentalist theme + quote flash |
| **Type `winden`** | Switches to Dark theme + quote flash |
| **Type `mrrobot` or `fsociety`** | Switches to Mr. Robot theme + fsociety message |
| **Type `inception`** | The entire UI spins 360° |
| **Type `oppenheimer`** | Switches to Oppenheimer theme + Trinity quote |
| **Type `spice`** | Switches to Dune theme + spice quote |
| **Type `thebear`** | Switches to The Bear theme |
| **Type `nightcity` or `samurai`** | Cyberpunk 2077 theme + full-screen RGB glitch burst |
| **Type `hal` or `daisy`** | HAL 9000 theme; `daisy` makes HAL sing the famous song line by line |
| **Type `dont try` or `tenet`** | Tenet theme; `tenet` reverses the clock display and inverts the UI briefly |
| **Type `dracarys` or `targaryen`** | House of the Dragon theme + fire quote |
| **Type `khonshu` or `moonknight`** | Moon Knight theme + Khonshu quote |
| **Triple-click the clock** | Opens a dev console overlay showing FPS, tier, audio nodes, storage size |
| **Hold the session timer 3 seconds** | Hyperfocus mode — UI fades to black, only clock + timer remain. Press Esc to exit |
| **00:00:00 midnight** | Confetti burst in theme accent colours + "Happy New Day!" toast |
| **Shake your phone** | Randomises the theme — "🎲 Theme shuffled!" |
| **Click UTC pill 7 times** | Switches UTC display to Local Sidereal Time (🔭) — for astronomers |
| **Complete 100 sessions** | Phoenix theme unlocks. Permanent flame badge on streak counter |

</details>

---

## Features

### Session Intelligence
- **Streak System** — daily session streaks with milestone toasts (3, 7, 14, 21, 30, 60, 90, 365 days)
- **Velocity Score** — 0–100 focus quality score based on completed vs abandoned sessions
- **Peak Hours** — after 5+ sessions, surfaces your personal peak focus hour in the info strip
- **Flow State Detector** — 25 minutes uninterrupted → UI simplifies, "⚡ Flow State" badge appears
- **Smart Break Reminder** — pulses amber after 90 uninterrupted minutes

### Pomodoro & Focus
- **Pomodoro** — configurable work/break/long-break with animated SVG ring, audio chime, OS notifications
- **Animedoro** — 50-minute focus / 20-minute cinematic Theater Mode break
- **Box Breathing** — animated 4-phase breathing guide on every break
- **Focus Lock Delay** — optional 3-second intentional friction before opening panels during Pomodoro

### Audio
- **6 Ambient Soundscapes** — Rain, Brown Noise, Forest (+ bird chirps), Café, Ocean (3-layer waves), Fireplace — all Web Audio API synthesis, zero audio files
- **Binaural Beats** — Gamma (40Hz), Beta (18Hz), Alpha (10Hz), Theta (6Hz), Delta (2Hz)
- **ILD+ITD Spatial Audio** — real Inter-aural Level Difference + Inter-aural Time Difference (0.65ms max) via StereoPannerNode + DelayNode — not just pan, actual headphone spatial positioning
- **Per-sound spatial profiles** — rain sweeps wide, fire stays slightly right, forest birds dart unexpectedly, café wanders fast
- **Saveable Mixer Presets** — save up to 5 named sound mixes
- **MediaSession API** — lock screen media controls show active tracks; play/pause from headphone buttons

### OS Integration
- **Picture-in-Picture** — Document PiP (Chrome/Edge) floats a live themed clock above any app; Canvas PiP fallback for Safari/Firefox
- **OS Notifications** — Pomodoro phase changes fire system notifications even when the tab is hidden
- **Wake Lock** — keeps screen on during sessions; releases on break
- **PWA** — fully installable on desktop and mobile, works offline via service worker

### Privacy
- **Zero Backend** — everything in `localStorage`. No server, no accounts, no analytics
- **Privacy Mode** — disables geolocation, weather, time sync, and Google Fonts (system fonts fallback)
- **Incognito Sessions** — sessions run in memory only, nothing persisted
- **Auto-Clear on Close** — optionally wipe session log when the tab closes
- **Data Management Panel** — view all stored data by category with size, delete selectively, export as JSON

### Sharing
- **Share Focus Card** — 1200×630 PNG with theme art, focus time, task, streak, decorative clock; uses native OS share sheet on mobile
- **QR Handoff** — pure-TypeScript QR encoder; scan to resume session on another device
- **Cross-Tab Sync** — BroadcastChannel keeps theme + session in sync across all open tabs

### Display
- **6 Clock Styles** — Digital · Analogue · Flip (3D) · Word · Minimal · 7-Segment LED
- **Parallax Depth** — mouse and gyroscope drive a multi-layer canvas parallax
- **Adaptive Quality** — auto-detects device tier (LOW/MED/HIGH) from RAM/CPU/DPR; auto-degrades on low FPS
- **Reduce Motion** — respects `prefers-reduced-motion` and has a manual override in Settings
- **Battery Saver** — below 20% battery → auto-downgrades to LOW quality tier

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Start / Pause |
| `R` | Reset timer |
| `T` | Cycle next theme |
| `F` | Toggle fullscreen |
| `P` | Toggle Pomodoro |
| `M` | Sound mixer |
| `L` | Focus log |
| `K` | Collapse/expand panel |
| `G` | Custom theme builder |
| `?` | All shortcuts |
| `Esc` | Close panel / exit Hyperfocus |

---

## Security

Session Clock is CodeQL-verified — zero `innerHTML` injections of user-supplied data. All dynamic content uses `textContent`, developer-authored SVG constants, or canvas rendering. See the GitHub Security tab for the clean CodeQL report.

## Getting Started

```bash
npm install          # install dev deps (TypeScript + Vite only)
npm run dev          # dev server at localhost:5173
npm run typecheck    # type-check without building
npm run build        # production build → dist/
npm run preview      # preview production build
```

## Deploy to GitHub Pages

```bash
git init && git add . && git commit -m "feat: session clock"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/session-clock.git
git push -u origin main
```

Then: **Settings → Pages → Source → GitHub Actions**

The included `deploy.yml` type-checks, builds, and deploys automatically on every push.

---

## Architecture

```
session-clock/
├── public/
│   ├── manifest.json     PWA manifest
│   ├── sw.js             Service worker (offline cache)
│   ├── icon-192.svg      App icon
│   └── icon-512.svg      App icon
├── src/
│   ├── main.ts           App entry: render loop, UI, all feature orchestration
│   ├── renderer.ts       Canvas engine: 42 theme backgrounds, transitions, parallax
│   ├── themes.ts         42 typed theme definitions
│   ├── easter.ts         Easter eggs: Konami, keywords, midnight, shake, hyperfocus
│   ├── intelligence.ts   Streak, velocity score, peak hours, flow state, smart break
│   ├── apis.ts           Notifications, MediaSession, Wake Lock, PiP, Share, Clipboard, Battery
│   ├── privacy.ts        Data management, incognito sessions, auto-clear, export
│   ├── perf.ts           Adaptive quality tier, FPS tracker, visibility API
│   ├── sound.ts          Web Audio: 6 tracks + binaural + ILD+ITD spatial + compressor
│   ├── share.ts          1200×630 PNG focus card generator
│   ├── shop.ts           Token economy: 50+ items, buy/equip
│   ├── focuslog.ts       Session logging, GitHub heatmap, CSV export
│   ├── pomodoro.ts       Pomodoro phase management, SVG ring
│   ├── weather.ts        Open-Meteo fetch + NOAA circadian solar maths
│   ├── timesync.ts       Cloudflare NTP + WorldTimeAPI fallback
│   ├── qr.ts             GF(256) Reed-Solomon QR encoder
│   ├── litclock.ts       288 prose entries for Literary Clock
│   ├── utils.ts          Shared helpers
│   └── types.ts          TypeScript interfaces
├── index.html            HTML shell + all modal scaffolding
├── style.css             ~1400 lines: CSS custom properties, animations, themes
└── .github/workflows/
    └── deploy.yml        CI/CD: typecheck → build → GitHub Pages
```

### Performance

- **Single RAF loop** — one `requestAnimationFrame` drives everything
- **Gradient cache** — background gradients recomputed only on theme/resize change
- **Adaptive particles** — 100% → 55% → 25% count on HIGH/MED/LOW tier
- **Frame skip** — expensive draws skip 1–2 frames on MED/LOW
- **Tab hidden** — canvas render fully paused when tab is not visible
- **DynamicsCompressor** — prevents clipping at 200% volume boost

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5 — strict mode |
| Build | Vite 5 + Terser (2-pass, toplevel mangle, console drop) |
| Canvas | HTML5 2D Canvas — bgCanvas (backgrounds) + transCanvas (transitions) |
| Audio | Web Audio API — zero audio files; ILD+ITD spatial via StereoPannerNode + DelayNode |
| Time | Cloudflare multi-probe NTP + WorldTimeAPI fallback |
| Weather | Open-Meteo — free, no API key |
| Solar | NOAA Spencer/hour-angle formula — local computation |
| QR | Custom GF(256) Reed-Solomon — Version 2-M, pure TypeScript |
| Cross-tab | BroadcastChannel API |
| PWA | Manifest + service worker |
| Storage | localStorage only — no backend, no cookies, no tracking |
| Deployment | GitHub Actions → GitHub Pages |

---

## License

MIT — use it, fork it, ship it.

---

<div align="center">
<sub>21 TypeScript modules · Zero runtime dependencies · Everything runs in your browser</sub>
</div>
