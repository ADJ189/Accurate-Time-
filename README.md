# Session Clock

A feature-rich animated clock with 25 themes — Natural, TV Shows, Movies, and F1 Teams.

## Features

- ⏰ Accurate time synced to nearest Cloudflare edge server (re-syncs every 15 minutes)
- 🎨 25 themes across 4 categories (Natural · F1 Teams · TV Shows · Movies)
- 🎬 14 cinematic theme transitions (fire, matrix rain, F1 lights-out, burnout smoke, etc.)
- 🌌 Canvas-animated backgrounds per theme (aurora particles, matrix rain, ocean waves, skyline, etc.)
- 🏎️ F1 team symbols with animated team-specific art
- 📺 Iconic animated canvas symbols per TV/movie theme
- ⏱️ Session timer with start / pause / resume / reset
- 📊 Day progress bar
- 🌐 UTC pill display
- 💬 Rotating quotes per theme

## File Structure

```
index.html                        ← HTML shell, loads everything
style.css                         ← All CSS custom properties + layout
js/
  themes.js       ← Theme data, logos, quotes
  utils.js        ← Math helpers (rnd, p2, p3, easeIO)
  canvas.js       ← Canvas setup, particle pools, buildParticles
  renderer.js     ← drawBg() — per-theme background rendering
  symbols.js      ← Iconic canvas symbols (Devil's Trap, Gargantua, etc.)
  f1symbols.js    ← F1 team canvas symbols (RB #1 plate, Ferrari horse, etc.)
  sync.js         ← Cloudflare time sync, multi-probe, 15-min intervals
  session.js      ← Session timer logic
  clock.js        ← Main render loop, DOM updates
  theme.js        ← applyTheme(), CSS custom property updates
  transitions.js  ← 14 cinematic transitions
  panel.js        ← Theme switcher panel builder
  main.js         ← init() entry point
.github/
  workflows/
    deploy.yml    ← GitHub Pages auto-deploy on push to main
```

## Deploy to GitHub Pages

1. Push this repo to GitHub (must be **public**)
2. Go to **Settings → Pages → Source** → select `Deploy from a branch` → `main` / `root`
3. Or let the included workflow handle it automatically on every push

Live URL will be: `https://YOUR-USERNAME.github.io/REPO-NAME/`

## Themes

| Category | Themes |
|----------|--------|
| 🌿 Natural | Aurora · Sunrise · Forest · Ocean · Candy · Nordic · Midnight · Lemon |
| 🏎️ F1 Teams | Red Bull · Ferrari · Mercedes · McLaren · Aston Martin |
| 📺 TV Shows | Supernatural · The Mentalist · The Sopranos · Dark · Breaking Bad · Stranger Things |
| 🎬 Movies | Interstellar · Dune · The Matrix · Blade Runner 2049 · Inception · The Godfather |
