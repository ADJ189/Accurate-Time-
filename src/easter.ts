// ── Easter Eggs & Secret Features ────────────────────────────────────
// All self-contained. Imported and initialised once in main.ts.

// ── 1. Konami Code → 8-bit theme ─────────────────────────────────────
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
let konamiActive = false;
type ThemeApplier  = (id: string) => void;
type ToastFn       = (msg: string, dur?: number) => void;
type SoundPlayer   = (id: string) => void;

let _applyThemeById: ThemeApplier  = () => {};
let _showToast:      ToastFn       = () => {};
let _playChiptune:   (() => void)  = () => {};

export function initEaster(applyById: ThemeApplier, toast: ToastFn, chiptune: () => void) {
  _applyThemeById = applyById;
  _showToast      = toast;
  _playChiptune   = chiptune;
  setupKonami();
  setupKeywordDetector();
  setupTripleClick();
  setupMidnightWatch();
  setupDeviceShake();
  setupHyperfocusHold();
  setupUTCPillSecret();
  check100Sessions();
}

function setupKonami() {
  window.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0;
        konamiActive = !konamiActive;
        if (konamiActive) {
          _applyThemeById('8bit');
          _showToast('👾 8-bit mode activated!', 4000);
          _playChiptune();
        } else {
          _applyThemeById('aurora');
          _showToast('8-bit mode off', 2000);
        }
      }
    } else {
      konamiIdx = 0;
    }
  });
}

// ── 2. Keyword detector (type "matrix", "heisenberg", etc.) ───────────
let typedBuffer = '';
let typedTimer  = 0;

const KEYWORD_ACTIONS: Record<string, () => void> = {
  'matrix':      () => { triggerMatrixRain(); _showToast('💊 Wake up, Neo…', 3000); },
  'heisenberg':  () => { triggerThemeEasterEgg('breakingbad', '⚗️ You\'re goddamn right.'); },
  'winchester':  () => { triggerThemeEasterEgg('supernatural', '🔥 The Road So Far…'); },
  'redjohn':     () => { triggerThemeEasterEgg('mentalist', '🔴 He\'s been here.'); },
  'bada bing':   () => { triggerThemeEasterEgg('sopranos', '🥃 Bada bing.'); },
  'winden':      () => { triggerThemeEasterEgg('dark', '⏳ Sic Mundus Creatus Est.'); },
  'fncs':        () => { triggerThemeEasterEgg('severance', '🏢 We hope your time here is… agreeable.'); },
  'interstellar':() => { triggerThemeEasterEgg('interstellar', '🌌 Do not go gentle.'); },
  'spice':       () => { triggerThemeEasterEgg('dune', '🏜️ The spice must flow.'); },
  'inception':   () => { triggerDreamSpin(); },
  'godfather':   () => { triggerThemeEasterEgg('godfather', '🌹 Leave the gun. Take the cannoli.'); },
  'mrrobot':     () => { triggerThemeEasterEgg('mrrobot', '💻 Hello, friend.'); },
  'fsociety':    () => { triggerThemeEasterEgg('mrrobot', '💻 fsociety — we are finally free.'); },
  'oppenheimer': () => { triggerThemeEasterEgg('oppenheimer', '☢️ Now I am become Death.'); },
  'thebear':     () => { triggerThemeEasterEgg('thebear', '🍳 Yes, chef!'); },
};

function setupKeywordDetector() {
  window.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length === 1) typedBuffer = (typedBuffer + e.key.toLowerCase()).slice(-15);
    clearTimeout(typedTimer);
    typedTimer = window.setTimeout(() => { typedBuffer = ''; }, 2000);
    for (const keyword of Object.keys(KEYWORD_ACTIONS)) {
      if (typedBuffer.endsWith(keyword)) {
        typedBuffer = '';
        KEYWORD_ACTIONS[keyword]?.();
        break;
      }
    }
  });
}

function triggerThemeEasterEgg(themeId: string, msg: string) {
  _applyThemeById(themeId);
  _showToast(msg, 4000);
  flashScreen();
}

function flashScreen() {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:9999;pointer-events:none;animation:eggFlash .5s ease forwards;';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 600);
}

// ── Matrix rain overlay ───────────────────────────────────────────────
let matrixRainActive = false;
export function triggerMatrixRain() {
  if (matrixRainActive) return;
  matrixRainActive = true;
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:fixed;inset:0;z-index:888;pointer-events:none;opacity:0;transition:opacity .4s;';
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d')!;
  const cols = Math.floor(cv.width / 14);
  const drops = new Array(cols).fill(1);
  requestAnimationFrame(() => cv.style.opacity = '1');
  const chars = '田由甲申甴电甶男甸甹町画甼甽甾甿畀ABCDEFabcdef0123456789';
  let frame = 0;
  const raf = setInterval(() => {
    ctx.fillStyle = 'rgba(0,0,0,.05)'; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.fillStyle = '#00ee00'; ctx.font = '13px monospace';
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)]!;
      ctx.fillText(ch, i * 14, y * 14);
      if (y * 14 > cv.height && Math.random() > .975) drops[i] = 0;
      else drops[i] = y + 1;
    });
    if (++frame > 300) {
      clearInterval(raf);
      cv.style.opacity = '0';
      setTimeout(() => { cv.remove(); matrixRainActive = false; }, 500);
    }
  }, 33);
}

function triggerDreamSpin() {
  _showToast('🌀 "You\'re waiting for a train…"', 5000);
  document.body.style.transition = 'transform 1.2s cubic-bezier(.65,0,.35,1)';
  document.body.style.transform  = 'rotate(360deg)';
  setTimeout(() => {
    document.body.style.transform  = '';
    setTimeout(() => document.body.style.transition = '', 1500);
  }, 1300);
}

// ── 3. Triple-click clock → dev console ──────────────────────────────
let clickCount = 0; let clickTimer = 0;

function setupTripleClick() {
  const clockEl = document.getElementById('clock-block-wrap') ??
                  document.getElementById('mainUI');
  if (!clockEl) return;
  clockEl.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimer);
    if (clickCount >= 3) {
      clickCount = 0;
      openDevConsole();
    } else {
      clickTimer = window.setTimeout(() => { clickCount = 0; }, 500);
    }
  });
}

function openDevConsole() {
  const existing = document.getElementById('devConsole');
  if (existing) { existing.remove(); return; }
  const fps = (window as any).__scFps?.() ?? 0;
  const tier = (window as any).__scTier?.() ?? '?';
  const lsSize = JSON.stringify(localStorage).length;
  const audioNodes = (window as any).__scAudioNodes?.() ?? '?';
  const panel = document.createElement('div');
  panel.id = 'devConsole';
  panel.style.cssText = `
    position:fixed;bottom:80px;right:16px;z-index:9000;
    background:rgba(0,0,0,.92);color:#00ff41;font-family:monospace;
    font-size:.65rem;padding:14px 18px;border-radius:10px;line-height:1.9;
    border:1px solid #00ff4133;backdrop-filter:blur(12px);
    animation:fadeUp .3s ease;min-width:220px;
  `;
  const rows = [
    `🎯 Render tier : ${tier.toUpperCase()}`,
    `📊 FPS         : ${fps}`,
    `🔊 Audio nodes : ${audioNodes}`,
    `💾 localStorage: ${(lsSize/1024).toFixed(1)} KB`,
    `🎨 Themes      : ${(window as any).__scThemeCount?.() ?? '?'}`,
    `📋 Sessions    : ${JSON.parse(localStorage.getItem('sc_focus_log')||'[]').length}`,
    `🔥 Streak      : ${JSON.parse(localStorage.getItem('sc_streak')||'{"current":0}').current} days`,
    ``,
    `<span style="opacity:.4;font-size:.55rem">click clock again to close</span>`,
  ];
  panel.innerHTML = rows.join('<br>');
  document.body.appendChild(panel);
}

// ── 4. Midnight confetti ──────────────────────────────────────────────
function setupMidnightWatch() {
  const checkMidnight = () => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
      fireConfetti();
      _showToast('✨ Happy New Day!', 5000);
    }
  };
  // Check every second via the main clock tick — expose via window
  (window as any).__checkMidnight = checkMidnight;
}

export function fireConfetti() {
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:fixed;inset:0;z-index:999;pointer-events:none;';
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d')!;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--clr-accent').trim() || '#6ee7b7';
  const colours = [accent, '#f472b6', '#fbbf24', '#60a5fa', '#a78bfa', '#34d399'];
  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * cv.width,
    y: -10 - Math.random() * 100,
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.2,
    w: 6 + Math.random() * 8,
    h: 3 + Math.random() * 5,
    col: colours[Math.floor(Math.random() * colours.length)]!,
    alpha: 1,
  }));
  let frame = 0;
  const raf = requestAnimationFrame(function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
      p.vy *= 1.01; p.alpha = Math.max(0, 1 - frame / 140);
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.col; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    if (++frame < 150) requestAnimationFrame(draw);
    else cv.remove();
  });
  void raf;
}

// ── 5. Device shake → random theme ───────────────────────────────────
let lastShake = 0;
let lastAcc = { x: 0, y: 0, z: 0 };

function setupDeviceShake() {
  if (!('DeviceMotionEvent' in window)) return;
  window.addEventListener('devicemotion', (e: DeviceMotionEvent) => {
    const a = e.accelerationIncludingGravity;
    if (!a) return;
    const dx = Math.abs((a.x ?? 0) - lastAcc.x);
    const dy = Math.abs((a.y ?? 0) - lastAcc.y);
    const dz = Math.abs((a.z ?? 0) - lastAcc.z);
    lastAcc = { x: a.x ?? 0, y: a.y ?? 0, z: a.z ?? 0 };
    if (dx + dy + dz > 30 && Date.now() - lastShake > 2000) {
      lastShake = Date.now();
      (window as any).__scRandomTheme?.();
      _showToast('🎲 Theme shuffled!', 2500);
    }
  });
}

// ── 6. Hyperfocus hold (hold session timer 3s) ────────────────────────
let holdTimer = 0; let holdActive = false;

function setupHyperfocusHold() {
  const btn = document.getElementById('sessionTimer');
  if (!btn) return;
  const startHold = () => {
    holdTimer = window.setTimeout(() => {
      holdActive = !holdActive;
      document.body.classList.toggle('hyperfocus', holdActive);
      _showToast(holdActive ? '🧘 Hyperfocus — press Escape to exit' : 'Hyperfocus off', 3000);
    }, 3000);
  };
  const cancelHold = () => clearTimeout(holdTimer);
  btn.addEventListener('mousedown',  startHold);
  btn.addEventListener('touchstart', startHold, { passive: true });
  btn.addEventListener('mouseup',    cancelHold);
  btn.addEventListener('touchend',   cancelHold);
  btn.addEventListener('mouseleave', cancelHold);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && holdActive) {
      holdActive = false;
      document.body.classList.remove('hyperfocus');
    }
  });
}

// ── 7. UTC pill 7× → Sidereal Time ────────────────────────────────────
let utcClickCount = 0; let utcClickTimer = 0;
let siderealMode = false;

function setupUTCPillSecret() {
  const pill = document.getElementById('utcPill');
  if (!pill) return;
  pill.addEventListener('click', () => {
    utcClickCount++;
    clearTimeout(utcClickTimer);
    if (utcClickCount >= 7) {
      utcClickCount = 0;
      siderealMode = !siderealMode;
      pill.title = siderealMode ? 'Local Sidereal Time — astronomical measure' : '';
      _showToast(siderealMode ? '🔭 Sidereal time mode — for astronomers' : 'UTC mode restored', 3500);
    }
    utcClickTimer = window.setTimeout(() => { utcClickCount = 0; }, 1500);
  });
}

export function isSiderealMode() { return siderealMode; }

export function getSiderealTime(lat: number): string {
  // Greenwich Mean Sidereal Time calculation
  const now    = new Date();
  const J2000  = new Date('2000-01-01T12:00:00Z');
  const D      = (now.getTime() - J2000.getTime()) / 86400000; // days since J2000
  const GMST_h = (18.697374558 + 24.06570982441908 * D) % 24;
  const LMST_h = ((GMST_h + lat / 15) % 24 + 24) % 24;
  const h = Math.floor(LMST_h);
  const m = Math.floor((LMST_h - h) * 60);
  const s = Math.floor(((LMST_h - h) * 60 - m) * 60);
  return `🔭 ${String(h).padStart(2,'0')}ʰ${String(m).padStart(2,'0')}ᵐ${String(s).padStart(2,'0')}ˢ`;
}

// ── 8. 100 sessions → Phoenix unlock ──────────────────────────────────
function check100Sessions() {
  const sessions = (() => { try { return JSON.parse(localStorage.getItem('sc_focus_log')||'[]').length; } catch { return 0; } })();
  if (sessions >= 100 && !localStorage.getItem('sc_phoenix_unlocked')) {
    localStorage.setItem('sc_phoenix_unlocked', '1');
    setTimeout(() => {
      _showToast('🔥 100 sessions! Phoenix theme unlocked — check the shop!', 6000);
    }, 2000);
  }
}

export function isPhoenixUnlocked(): boolean {
  return localStorage.getItem('sc_phoenix_unlocked') === '1' ||
    ((() => { try { return JSON.parse(localStorage.getItem('sc_focus_log')||'[]').length >= 100; } catch { return false; } })());
}
