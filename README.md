# 🕐 Session Clock v8

A beautiful, animated clock app with 32 themes, Pomodoro mode, ambient soundscapes, a literary clock, session focus logging, and more — built in **TypeScript** with **Vite**, zero runtime dependencies.

---

## ✨ Features

| Feature | Details |
|---|---|
| **32 Animated Themes** | Natural (Aurora, Forest, Ocean…), Literary Clock, F1 teams, TV shows, Movies |
| **🍅 Pomodoro Mode** | Customisable work/break cycles, animated SVG ring, audio chime |
| **🌤 Live Weather** | Open-Meteo API — free, no key needed, requests geolocation |
| **🎵 Ambient Soundscapes** | 6 synthesised sounds (Rain, Brown Noise, Forest, Café, Ocean, Fire) — Web Audio API, zero audio files |
| **🎨 Custom Theme Builder** | Pick your own colours, preview live, save up to 10 custom themes |
| **📋 Session Focus Log** | Label what you're working on, grouped by day, export as CSV |
| **📖 Literary Clock** | Every 5-minute slot (00:00–23:55) mapped to a prose sentence |
| **⌨ Keyboard Shortcuts** | Space, R, T, F, P, M, L, K, G, ? |
| **📺 Presentation Mode** | Hides everything except the clock |
| **⛶ Kiosk Mode** | Fullscreen via the Fullscreen API |
| **⏱ Cloudflare Time Sync** | Multi-probe NTP-over-HTTP with WorldTimeAPI fallback |

---

## 🚀 Getting Started


## ⌨ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Start / Pause session timer |
| `R` | Reset timer |
| `T` | Cycle to next theme |
| `F` | Toggle fullscreen / kiosk mode |
| `P` | Toggle Pomodoro mode |
| `M` | Open ambient sound mixer |
| `L` | Open session focus log |
| `K` | Collapse / expand theme panel |
| `G` | Open custom theme builder |
| `?` | Show all shortcuts |
| `Esc` | Close any open panel |

---


## 🎨 Themes

**Natural** — Aurora, Sunrise, Forest, Ocean, Candy, Nordic, Midnight, Lemon

**Literary** — Literary Clock (every 5 minutes mapped to a prose sentence, 00:00–23:55)

**F1 Teams** — Red Bull Racing, Scuderia Ferrari, Mercedes-AMG, McLaren, Aston Martin

**TV Shows** — Supernatural, The Mentalist, The Sopranos, Dark, Breaking Bad, Stranger Things

**Movies** — Interstellar, Dune, The Matrix, Blade Runner 2049, Inception, The Godfather

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5 — strict mode |
| Build | Vite 5 + Terser (minify, tree-shake, drop console) |
| Rendering | HTML5 Canvas (`bgCanvas`) + CSS custom properties |
| Animation | Single `requestAnimationFrame` loop, delta-time capped at 50 ms |
| Particles | `Float32Array` pool, SoA layout |
| Time sync | Cloudflare `/cdn-cgi/trace` (multi-probe, 3 endpoints) + WorldTimeAPI fallback |
| Weather | [Open-Meteo](https://open-meteo.com/) — free, no API key |
| Sound | Web Audio API synthesis — zero audio files |
| Storage | `localStorage` only — no backend, no cookies |
| Fonts | Google Fonts CDN (only external resource) |
| Deployment | GitHub Actions → GitHub Pages |

---

## 🐛 Bugs Fixed vs v7

| Bug | Fix |
|---|---|
| Pomodoro had two conflicting timer paths (`tick` vs `pomTimerTick`) | Unified into single `tick()` in `pomodoro.ts` |
| `buildPanel()` stacked duplicate buttons on re-call | Containers cleared before rebuild; `onclick` used instead of `addEventListener` |
| `syncResult` had unused `serverMs` field causing type confusion | Removed from interface |

---

## 📜 License

MIT — do whatever you like with it.
