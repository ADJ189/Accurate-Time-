<div align="center">

# Session Clock

**The most feature-complete focus timer on the open web.**

*34 animated themes · Pomodoro · Binaural beats · Session intelligence · Token shop · Ambient soundscapes · Literary clock · PWA · Zero backend*

[![Deploy](https://img.shields.io/github/actions/workflow/status/ADJ189/Accurate-Time-/deploy.yml?label=Deploy&style=flat-square)](https://github.com/ADJ189/Accurate-Time-/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

[**Live Demo →**](https://ADJ189.github.io/Accurate-Time-)

</div>

---

## Why Session Clock?

Most focus timers are bare-bones Pomodoro counters with a start button. Session Clock is different — it is a *complete productivity environment* that lives in your browser tab.

| What others give you | What Session Clock gives you |
|---|---|
| A countdown timer | A full session intelligence engine with streak tracking, velocity scores, and peak-hour analysis |
| A plain background | 34 cinematic animated themes with canvas particle systems, audio-reactive visuals, and circadian colour temperature |
| A beep | 6 synthesised ambient soundscapes, binaural beats generator, 3D spatial audio, and saveable mixer presets |
| A timer log | A GitHub-style contribution heatmap, 24-hour timeline, CSV export, and shareable focus cards |
| A webpage | A fully installable PWA that works offline and syncs across browser tabs via BroadcastChannel |

---

## Features

### Clock & Display
| Feature | Detail |
|---|---|
| **6 Clock Styles** | Digital · Analogue (smooth sweep) · Flip (3D CSS) · Word ("It is half past") · Minimal · 7-Segment LED |
| **34 Animated Themes** | Natural, SMPTE, Terminal, Literary, Severance, TV Shows, Movies, F1 Teams |
| **Parallax Depth** | Mouse and gyroscope drive a multi-layer parallax on every canvas background |
| **Circadian Sync** | Canvas temperature shifts from cool blue to warm amber at local sunset using NOAA solar maths — no API |
| **Audio-Reactive Canvas** | Ambient sound volume modulates the HDR bloom radius and grain layer in real time |
| **Flow State Mode** | 25 minutes of uninterrupted focus triggers an automatic UI simplification and a glowing Flow State badge |

### Productivity
| Feature | Detail |
|---|---|
| **Pomodoro** | Configurable work/break/long-break with animated SVG ring, audio chime, and adaptive volume ducking |
| **Animedoro** | 50-minute work / 20-minute Theater Mode break variant with a cinematic reward overlay |
| **Session Velocity Score** | A 0–100 focus quality score based on completed vs abandoned sessions — updates in real time |
| **Streak System** | Daily streak with milestone toasts (3, 7, 14, 21, 30, 60, 90, 365 days) and personal best tracking |
| **Peak Hours Intelligence** | After 5+ sessions, the info strip shows your personal peak focus hour derived from log data |
| **Smart Break Suggester** | Gently pulses the sync pill amber after 90 uninterrupted minutes |
| **Focus Lock Delay** | Optional 3-second intentional friction before opening panels during an active Pomodoro |
| **Box Breathing** | Animated canvas breathing pacer on every break — 4s inhale / hold / exhale / hold |

### Audio
| Feature | Detail |
|---|---|
| **6 Ambient Tracks** | Rain · Brown Noise · Forest · Café · Ocean · Fireplace — all synthesised via Web Audio API, zero files |
| **Binaural Beats** | 5 presets: Gamma (40Hz focus), Beta (18Hz alert), Alpha (10Hz calm), Theta (6Hz flow), Delta (2Hz rest) |
| **3D Spatial Audio** | Per-track `PannerNode` LFOs move sounds left/right at different rates for living stereo depth |
| **Saveable Mixer Presets** | Save named sound mixes (up to 5 slots); right-click a preset to delete it |
| **Adaptive Audio** | Volume ducks 22% on Pomodoro work start, restores on break; fire crackle boosts in the final 2 minutes |

### Themes
| Category | Themes |
|---|---|
| **Natural** | Aurora · Sunrise · Forest · Ocean · Candy · Nordic · Midnight · Lemon · Blueprint · Living (Game of Life) · Common Room · SMPTE Timeline · Air-Gapped Terminal |
| **Literary** | Literary Clock — 288 prose sentences, one for every 5-minute slot from 00:00 to 23:55 |
| **Severance** | Lumon Industries — scrolling MDR refinement number grid, Josefin Sans, corporate blue |
| **TV Shows** | Supernatural · The Mentalist · The Sopranos · Dark · Breaking Bad · Stranger Things |
| **Movies** | Interstellar · Dune · The Matrix · Blade Runner 2049 · Inception · The Godfather |
| **F1 Teams** | Red Bull · Ferrari · Mercedes-AMG · McLaren · Aston Martin |

### Shop & Personalisation
| Feature | Detail |
|---|---|
| **Token Economy** | Earn session coins (🪙) for every 5 minutes of focused work or completed Pomodoro |
| **Theme Shop** | 50+ collectible SVG-art items across all themes — The Colt, Baby the Impala, Heisenberg Hat, Crysknife, Red Pill, and more |
| **Custom Theme Builder** | Pick your own hex colours, preview live, save up to 10 named themes |
| **Wallpaper Theme** | Drag-and-drop any image — Session Clock samples the dominant palette and generates a matching theme instantly |

### Sharing & Handoff
| Feature | Detail |
|---|---|
| **Share Focus Card** | Generates a 1200×630 PNG — theme art, focus time, task name, streak count, decorative clock — downloads instantly |
| **QR Handoff** | Pure-TypeScript QR encoder (Reed-Solomon, Version 2-M) encodes session state into a URL; scan to resume on any device |
| **Cross-Tab Sync** | `BroadcastChannel` API keeps theme, session state, and Pomodoro phase in sync across all open tabs — no server |
| **PWA** | Installable on desktop and mobile; works fully offline via service worker cache |

### Privacy & Security
| Feature | Detail |
|---|---|
| **Zero Backend** | No server, no database, no accounts, no analytics. Everything lives in `localStorage` |
| **Privacy Mode** | Disables geolocation, weather, and time sync; all data stays local |
| **CodeQL Clean** | Zero `innerHTML` injections of user-supplied data; all dynamic content uses `textContent` or developer-authored SVG constants |
| **No Runtime Dependencies** | TypeScript + Vite at build time only. The shipped bundle is vanilla JS/CSS/HTML |

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Start / Pause session |
| `R` | Reset timer |
| `T` | Cycle next theme |
| `F` | Toggle fullscreen / kiosk |
| `P` | Toggle Pomodoro |
| `M` | Open sound mixer |
| `L` | Open focus log |
| `K` | Collapse / expand theme panel |
| `G` | Open custom theme builder |
| `?` | Show all shortcuts |
| `Esc` | Close open panel |

---

## Getting Started

```bash
# Install dev dependencies (TypeScript + Vite only — zero runtime deps)
npm install

# Start dev server with hot-reload at localhost:5173
npm run dev

# Type-check without building
npm run typecheck

# Production build → dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## Deploy to GitHub Pages

### One-time setup

```bash
git init
git add .
git commit -m "feat: session clock"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/session-clock.git
git push -u origin main
```

Then in your repo: **Settings → Pages → Source → GitHub Actions**

The included `.github/workflows/deploy.yml` type-checks, builds, and deploys automatically on every push to `main`. No manual steps. Your app will be live at `https://YOUR_USERNAME.github.io/session-clock`.

---

## Architecture

```
session-clock/
├── public/
│   ├── manifest.json           # PWA manifest — install, icons, shortcuts
│   ├── sw.js                   # Service worker — offline cache
│   ├── icon-192.svg            # App icon (small)
│   └── icon-512.svg            # App icon (large)
├── src/
│   ├── main.ts                 # App entry: render loop, UI wiring, all feature orchestration
│   ├── renderer.ts             # Canvas engine: all theme backgrounds, transitions, breathing, parallax
│   ├── themes.ts               # 34 typed theme definitions
│   ├── sound.ts                # Web Audio synthesiser: 6 tracks + binaural + spatial + analyser
│   ├── intelligence.ts         # Session intelligence: streak, velocity score, peak hours, flow state
│   ├── shop.ts                 # Token economy: 50+ items, persistence, equip system
│   ├── share.ts                # Share card: canvas-rendered 1200×630 PNG generator
│   ├── qr.ts                   # QR encoder: GF(256) Reed-Solomon, Version 2-M, pure TypeScript
│   ├── focuslog.ts             # Session logging: heatmap, CSV export, day grouping
│   ├── pomodoro.ts             # Pomodoro: phase management, SVG ring, adaptive audio hooks
│   ├── weather.ts              # Weather: Open-Meteo fetch + NOAA circadian solar maths
│   ├── timesync.ts             # Time: Cloudflare multi-probe NTP + WorldTimeAPI fallback
│   ├── litclock.ts             # Literary clock: 288 prose entries (00:00–23:55)
│   ├── utils.ts                # Shared helpers: p2, p3, fmtSession, rnd, DAYS, MONTHS, GREETS
│   └── types.ts                # All TypeScript interfaces and types
├── index.html                  # HTML shell: DOM structure, all modal scaffolding
├── style.css                   # All styles: 1100+ lines, CSS custom properties, animations
├── vite.config.ts              # Build: Terser minification, es2022 target, public dir
├── tsconfig.json               # TypeScript: strict mode, ES2022, bundler resolution
└── .github/workflows/
    └── deploy.yml              # CI/CD: typecheck → build → GitHub Pages deploy
```

### Performance design

- **Single RAF loop** — one `requestAnimationFrame` drives canvas animation, clock digits, Pomodoro ring, and all UI ticks
- **`Float32Array` SoA particle pool** — particle positions stored in a flat typed array with stride-6 layout; no object allocation per frame
- **Delta-time cap** — `dt` is capped at 50ms to prevent physics explosions on tab restore
- **Visibility API** — canvas loop pauses when the tab is hidden
- **Parallax via `canvas.save()/restore()`** — a single translate per frame, no additional layers
- **AnalyserNode once** — inserted once in the Web Audio graph between all tracks and master gain; sampled each frame with `getByteFrequencyData`
- **localStorage-only** — no IndexedDB, no HTTP requests except weather/timesync; all reads are synchronous and bounded

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5 — strict, `noImplicitReturns`, `noFallthroughCasesInSwitch` |
| Build | Vite 5 + Terser (2-pass compression, toplevel mangle, console drop) |
| Canvas | HTML5 2D Canvas — one `bgCanvas` for backgrounds, one `transCanvas` for transitions |
| Audio | Web Audio API — OscillatorNode, BiquadFilterNode, AnalyserNode, PannerNode, GainNode; zero audio files |
| Time | Cloudflare `/cdn-cgi/trace` multi-probe + WorldTimeAPI fallback, half-RTT compensation |
| Weather | [Open-Meteo](https://open-meteo.com/) — free, no key, CORS-friendly |
| Solar maths | NOAA Spencer/hour-angle formula — sunrise/sunset calculated locally from lat/lon |
| QR codes | Custom GF(256) Reed-Solomon encoder — Version 2-M, mask pattern 2, pure TypeScript |
| Cross-tab | `BroadcastChannel` API — zero-latency tab sync, no server |
| PWA | Manifest + service worker — installable, offline-capable |
| Fonts | Google Fonts CDN — Inter, Orbitron, Cinzel, Playfair Display, and more |
| Storage | `localStorage` only — no backend, no cookies, no tracking |
| Deployment | GitHub Actions → GitHub Pages |

---

## License

MIT — use it, modify it, ship it. No attribution required.

---

<div align="center">
<sub>Built with TypeScript · Zero runtime dependencies · Everything runs in your browser</sub>
</div>
