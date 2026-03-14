# 🕐 Session Clock

A beautiful, animated clock app with 30+ themes, Pomodoro mode, ambient soundscapes, a literary clock, session focus logging, and more — all in a single-page app with zero build steps and zero runtime dependencies.

---

## ✨ Features

| Feature | Details |
|---|---|
| **30+ Animated Themes** | Natural (Aurora, Forest, Ocean…), F1 teams, TV shows, Movies |
| **🍅 Pomodoro Mode** | Customisable work/break cycles, animated SVG ring, audio chime |
| **🌤 Live Weather** | Open-Meteo API — free, no key needed, requests geolocation |
| **🎵 Ambient Soundscapes** | 6 synthesised sounds (Rain, Brown Noise, Forest, Café, Ocean, Fire) — all Web Audio, no audio files |
| **🎨 Custom Theme Builder** | Pick your own colours, preview live, save up to 10 custom themes |
| **📋 Session Focus Log** | Label what you're working on, grouped by day, export as CSV |
| **📖 Literary Clock** | Every 5-minute slot (00:00–23:55) mapped to a prose sentence |
| **⌨ Keyboard Shortcuts** | Space, R, T, F, P, M, L, K, G, ? |
| **📺 Presentation Mode** | Hides everything except the clock — perfect for a second screen |
| **⛶ Kiosk Mode** | Fullscreen via the Fullscreen API |
| **⏱ Cloudflare Time Sync** | Multi-probe NTP-over-HTTP with WorldTimeAPI fallback |

---

## 🚀 Live Demo

> **[https://YOUR-USERNAME.github.io/session-clock](https://YOUR-USERNAME.github.io/session-clock)**

*(Replace `YOUR-USERNAME` with your GitHub username after deploying)*

---

## 📁 File Structure

```
session-clock/
├── index.html          # HTML shell — structure + modals + canvas layers
├── style.css           # All CSS — themes, animations, responsive layout
├── app.js              # All JS — themes, canvas renderer, all feature modules
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions — auto-deploys to GitHub Pages on push
├── .gitignore
└── README.md
```

---

## 🛠 Deployment (GitHub Pages)

### Step 1 — Create the repo

```bash
git init
git add .
git commit -m "feat: initial session clock v7"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/session-clock.git
git push -u origin main
```

### Step 2 — Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The `deploy.yml` workflow runs automatically on every push to `main`
4. Your site will be live at `https://YOUR-USERNAME.github.io/session-clock`

> **That's it.** No npm, no build step, no config.

---

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

**Literary** — Literary Clock (every minute mapped to a prose quote)

**F1 Teams** — Red Bull, Ferrari, Mercedes-AMG, McLaren, Aston Martin

**TV Shows** — Supernatural, The Mentalist, The Sopranos, Dark, Breaking Bad, Stranger Things

**Movies** — Interstellar, Dune, The Matrix, Blade Runner 2049, Inception, The Godfather

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Rendering | HTML5 Canvas (`bgCanvas`) + CSS custom properties |
| Animation | Single `requestAnimationFrame` loop, delta-time capped at 50 ms |
| Particles | `Float32Array` pool, SoA layout — Rust-like memory efficiency |
| Time sync | Cloudflare `/cdn-cgi/trace` (multi-probe) + WorldTimeAPI fallback |
| Weather | [Open-Meteo](https://open-meteo.com/) — free, no API key |
| Sound | Web Audio API synthesis — zero audio files |
| Storage | `localStorage` only — no backend, no cookies |
| Fonts | Google Fonts CDN (only external resource) |
| Deployment | GitHub Actions → GitHub Pages |

---

## 📜 License

MIT — do whatever you like with it.
