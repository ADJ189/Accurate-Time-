import type { Theme } from './types';
import { THEMES, THEME_BY_ID, THEMES_BY_CAT, NAT_QUOTES } from './themes';
import { LIT_CLOCK } from './litclock';
import { p2, p3, fmtSession, DAYS, MONTHS, GREETS } from './utils';
import { clockOffset, synced, syncTime, setSyncHandler } from './timesync';
import { initWeather, stopWeather } from './weather';
import * as Sound from './sound';
import * as Pom from './pomodoro';
import * as Log from './focuslog';
import { resize, buildParticles, drawBg, runTransition, setBreathing, setParallax } from './renderer';
import { drawQR } from './qr';
import * as Shop from './shop';
import * as Intel from './intelligence';
import { generateShareCard } from './share';

// ── Clock mode ────────────────────────────────────────────────────────
export type ClockMode = 'digital' | 'analogue' | 'flip' | 'word' | 'minimal' | 'segment';
let clockMode: ClockMode = (localStorage.getItem('sc_clock_mode') as ClockMode) || 'digital';
function setClockMode(m: ClockMode) {
  clockMode = m;
  localStorage.setItem('sc_clock_mode', m);
  updateClockModeDOM();
}
function updateClockModeDOM() {
  const cb = document.getElementById('clock-block-wrap');
  if (cb) cb.dataset.mode = clockMode;
  document.querySelectorAll('.clock-mode-btn').forEach(b => {
    (b as HTMLElement).classList.toggle('active', (b as HTMLElement).dataset.mode === clockMode);
  });
}

// ── SVG Logos ─────────────────────────────────────────────────────────
const LOGOS: Record<string, string> = {
  supernatural: `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#1a0800"/><path d="M6 17L16 5L26 17" stroke="#e05500" stroke-width="1.5" fill="none"/><path d="M10 17L16 9L22 17" stroke="#ff9944" stroke-width="1" fill="none" opacity=".6"/><circle cx="16" cy="14" r="2" fill="#e05500" opacity=".8"/></svg>`,
  mentalist:    `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#180800"/><circle cx="16" cy="11" r="7" stroke="#cc1100" stroke-width="1.2" fill="none"/><circle cx="13" cy="9.5" r="1.2" fill="#cc1100"/><circle cx="19" cy="9.5" r="1.2" fill="#cc1100"/><path d="M12 14Q16 17 20 14" stroke="#cc1100" stroke-width="1.2" fill="none"/></svg>`,
  sopranos:     `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#080808"/><rect x="4" y="6" width="24" height="10" rx="1" stroke="#c8a000" stroke-width="1" fill="none" opacity=".7"/><text x="16" y="14.5" text-anchor="middle" fill="#c8a000" font-size="6" font-family="Georgia,serif" font-weight="700">TS</text></svg>`,
  dark:         `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000004"/><circle cx="16" cy="11" r="8" stroke="#4488cc" stroke-width=".8" fill="none" opacity=".5"/><circle cx="16" cy="11" r="5" stroke="#4488cc" stroke-width=".6" fill="none" opacity=".35"/><circle cx="16" cy="11" r="2" fill="#4488cc" opacity=".7"/></svg>`,
  breakingbad:  `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#040900"/><text x="4" y="10" fill="#7ec800" font-size="7.5" font-family="Arial,sans-serif" font-weight="900">Br</text><text x="4" y="19" fill="#b8f040" font-size="6" font-family="Arial,sans-serif" font-weight="700" letter-spacing="2">BAD</text></svg>`,
  strangerthings:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#04000e"/><text x="16" y="9" text-anchor="middle" fill="#cc44ff" font-size="5.5" font-family="Georgia,serif" font-weight="700" letter-spacing="-.5">STRANGER</text><text x="16" y="17" text-anchor="middle" fill="#ee88ff" font-size="5.5" font-family="Georgia,serif" font-weight="700" letter-spacing="-.5">THINGS</text></svg>`,
  interstellar: `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000305"/><circle cx="16" cy="11" r="6" fill="none" stroke="#4499ee" stroke-width=".8" opacity=".6"/><ellipse cx="16" cy="11" rx="9" ry="2.5" fill="none" stroke="#88ccff" stroke-width=".7" opacity=".4"/><circle cx="16" cy="11" r="1.2" fill="#4499ee" opacity=".6"/></svg>`,
  dune:         `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#1a1000"/><path d="M2 16Q8 8 16 10Q24 12 30 6" stroke="#d4a020" stroke-width="1.2" fill="none" opacity=".7"/><text x="16" y="21" text-anchor="middle" fill="#d4a020" font-size="4.5" font-family="Georgia,serif" letter-spacing="3" opacity=".8">DUNE</text></svg>`,
  matrix:       `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000a00"/><text x="4" y="8" fill="#00ee00" font-size="5" font-family="monospace" opacity=".9">10110</text><text x="4" y="14" fill="#00ee00" font-size="5" font-family="monospace" opacity=".6">01001</text><text x="24.5" y="13" text-anchor="middle" fill="#00ee00" font-size="7" font-family="monospace" font-weight="700">M</text></svg>`,
  bladerunner:  `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#0a0500"/><rect x="2" y="14" width="28" height="6" fill="#050200"/><path d="M2 5L5 2L27 2L30 5" stroke="#e87020" stroke-width=".6" fill="none" opacity=".5"/></svg>`,
  inception:    `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#060608"/><circle cx="16" cy="11" r="9" stroke="#9090ee" stroke-width=".6" fill="none" opacity=".35"/><circle cx="16" cy="11" r="5" stroke="#9090ee" stroke-width=".6" fill="none" opacity=".3"/><circle cx="16" cy="11" r="1.5" fill="#9090ee" opacity=".6"/></svg>`,
  godfather:    `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#050500"/><path d="M16 4Q10 8 10 12Q10 17 16 18Q22 17 22 12Q22 8 16 4Z" fill="none" stroke="#b09040" stroke-width=".8" opacity=".6"/></svg>`,
  redbull:      `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#1c1f26"/><text x="16" y="10" text-anchor="middle" fill="#e8002d" font-size="5" font-family="Arial Black,sans-serif" font-weight="900">RED BULL</text><text x="16" y="17" text-anchor="middle" fill="#1e41ff" font-size="3.8" font-family="Arial,sans-serif" font-weight="700" letter-spacing="1">RACING</text></svg>`,
  ferrari:      `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#dc0000"/><text x="16" y="13" text-anchor="middle" fill="#ffed00" font-size="8" font-family="Arial Black,sans-serif" font-weight="900">SF</text></svg>`,
  mercedes:     `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#00d2be"/><text x="16" y="13" text-anchor="middle" fill="#fff" font-size="5" font-family="Arial Black,sans-serif" font-weight="900" letter-spacing=".5">AMG</text><path d="M16 5 L19 9 L16 8 L13 9 Z" fill="white" opacity=".9"/></svg>`,
  mclaren:      `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#ff8000"/><path d="M3 11 Q16 4 29 11 Q16 18 3 11Z" fill="#c86000" opacity=".7"/><text x="16" y="13" text-anchor="middle" fill="white" font-size="5.5" font-family="Arial Black,sans-serif" font-weight="900">MCL</text></svg>`,
  astonmartin:  `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#006f62"/><path d="M8 14 Q16 6 24 14" stroke="#cedc00" stroke-width="1.5" fill="none"/><text x="16" y="19" text-anchor="middle" fill="#cedc00" font-size="3.5" font-family="Arial,sans-serif" font-weight="700" letter-spacing=".5">ASTON MARTIN</text></svg>`,
  severance:    `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000408"/><rect x="2" y="9" width="28" height="4" rx=".5" fill="#0088cc" opacity=".15"/><text x="16" y="12.5" text-anchor="middle" fill="#0088cc" font-size="5.5" font-family="'Josefin Sans',Arial,sans-serif" font-weight="300" letter-spacing="3" opacity=".9">LUMON</text><line x1="2" y1="16" x2="30" y2="16" stroke="#0088cc" stroke-width=".4" opacity=".3"/></svg>`,
  blueprint:    `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#040d1a"/><line x1="4" y1="4" x2="28" y2="4" stroke="#00cfff" stroke-width=".6" opacity=".4"/><line x1="4" y1="11" x2="28" y2="11" stroke="#00cfff" stroke-width=".6" opacity=".4"/><line x1="4" y1="18" x2="28" y2="18" stroke="#00cfff" stroke-width=".6" opacity=".4"/><line x1="4" y1="4" x2="4" y2="18" stroke="#00cfff" stroke-width=".6" opacity=".4"/><line x1="16" y1="4" x2="16" y2="18" stroke="#00cfff" stroke-width=".6" opacity=".4"/><line x1="28" y1="4" x2="28" y2="18" stroke="#00cfff" stroke-width=".6" opacity=".4"/><circle cx="16" cy="11" r="4" stroke="#00cfff" stroke-width="1" fill="none" opacity=".9"/><line x1="12" y1="11" x2="20" y2="11" stroke="#00cfff" stroke-width=".7" opacity=".7"/><line x1="16" y1="7" x2="16" y2="15" stroke="#00cfff" stroke-width=".7" opacity=".7"/></svg>`,
  commonroom:   `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#0d0603"/><path d="M6 18 Q10 8 16 12 Q22 8 26 18" stroke="#e07030" stroke-width="1.2" fill="rgba(200,60,10,.3)"/><circle cx="16" cy="10" r="2.5" fill="#e8a040" opacity=".8"/><path d="M13 14 Q16 10 19 14" stroke="#ff8020" stroke-width=".8" fill="none" opacity=".6"/></svg>`,
  smpte:        `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#0d0d0d"/><rect x="2" y="14" width="28" height="5" rx=".5" fill="#222"/><rect x="14" y="11" width="2" height="9" fill="#e94560" opacity=".9"/><line x1="2" y1="14" x2="30" y2="14" stroke="#444" stroke-width=".4"/><text x="16" y="9" text-anchor="middle" fill="#e94560" font-size="4" font-family="monospace" opacity=".8">TIMELINE</text></svg>`,
  terminal:     `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000a00"/><text x="4" y="9" fill="#00ff41" font-size="4.5" font-family="monospace" opacity=".7">0f3a 88c1</text><text x="4" y="16" fill="#00ff41" font-size="4.5" font-family="monospace" opacity=".4">b72d 0044</text><rect x="25" y="11" width="2.5" height="5" fill="#00ff41" opacity=".9"/></svg>`,
  gameoflife:   `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#050a05"/><rect x="5" y="5" width="2" height="2" fill="#00e87a" opacity=".8"/><rect x="9" y="5" width="2" height="2" fill="#00e87a" opacity=".8"/><rect x="7" y="7" width="2" height="2" fill="#00e87a" opacity=".8"/><rect x="5" y="9" width="2" height="2" fill="#00e87a" opacity=".5"/><rect x="7" y="9" width="2" height="2" fill="#00e87a" opacity=".8"/><rect x="17" y="6" width="2" height="2" fill="#00e87a" opacity=".7"/><rect x="19" y="8" width="2" height="2" fill="#00e87a" opacity=".7"/><rect x="15" y="8" width="2" height="2" fill="#00e87a" opacity=".7"/><rect x="15" y="10" width="2" height="2" fill="#00e87a" opacity=".5"/><rect x="17" y="10" width="2" height="2" fill="#00e87a" opacity=".7"/></svg>`,
};

// ── Cached DOM refs ────────────────────────────────────────────────────
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const DOM = {
  digitHr:        $('digitHr'),
  digitMin:       $('digitMin'),
  digitSec:       $('digitSec'),
  timeDis:        $('timeDis'),   // hidden, kept for compat
  ampmDis:        $('ampmDis'),
  secMs:          $('secMs'),
  dateDis:        $('dateDis'),
  dayPct:         $('dayPct'),
  pFill:          $('progressFill'),
  sTmr:           $('sessionTimer'),
  utcPill:        $('utcPill'),
  greeting:       $('greeting'),
  quoteText:      $('quoteText'),
  litMeta:        $('litMeta'),
  syncDot:        $('syncDot'),
  syncLabel:      $('syncLabel'),
  focusInput:     $<HTMLInputElement>('focusInput'),
  focusInputWrap: $('focusInputWrap'),
  themePanel:     $('themePanel'),
  btnStart:       $('btnStart'),
  btnReset:       $('btnReset'),
  pomPill:        $('pomModePill'),
  sessionLabel:   $('sessionLabel'),
  pomRingSvg:     document.getElementById('pomRingSvg') as unknown as SVGSVGElement,
  pomRingArc:     document.getElementById('pomRingArc') as unknown as SVGCircleElement,
  showBadge:      $('showBadge'),
  infoLabel:      $('infoLabel'),
  infoSlide:      $('infoSlide'),
};

// ── Session timer ──────────────────────────────────────────────────────
let sessionRunning = false;
let sessionStart = 0;
let sessionElapsed = 0;

function startTimer() {
  sessionRunning = true;
  sessionStart = performance.now() - sessionElapsed;
  DOM.btnStart.textContent = 'Pause';
  DOM.focusInputWrap.classList.add('visible');
  if (Pom.isActive()) Pom.onStart();
  Intel.onSessionStart();
  Intel.onFlowInterrupt(); // reset flow clock on new start
  bcBroadcast('session', { running: true });
}

function pauseTimer() {
  sessionRunning = false;
  sessionElapsed = performance.now() - sessionStart;
  DOM.btnStart.textContent = 'Resume';
  Intel.onFlowInterrupt();
  bcBroadcast('session', { running: false });
}

function resetTimer() {
  const dur = sessionRunning ? performance.now() - sessionStart : sessionElapsed;
  Log.record(DOM.focusInput.value.trim(), dur);
  if (dur > 60_000) {
    awardTokens(Math.floor(dur / 60000));
    Intel.recordCompleted();
    const streak = Intel.updateStreak();
    const milestone = Intel.getStreakMilestone(streak.current);
    if (milestone) showToast(milestone);
    Intel.onBreakTaken();
  } else if (dur > 5_000) {
    Intel.recordAbandoned();
  }
  Intel.onFlowInterrupt();
  sessionRunning = false; sessionStart = sessionElapsed = 0;
  DOM.btnStart.textContent = 'Start';
  DOM.sTmr.textContent = '00:00:00';
  DOM.focusInputWrap.classList.remove('visible');
  DOM.focusInput.value = '';
  if (Pom.isActive()) Pom.reset();
  bcBroadcast('session', { running: false });
}

DOM.btnStart.addEventListener('click', () => sessionRunning ? pauseTimer() : startTimer());
DOM.btnReset.addEventListener('click', resetTimer);

// ── Privacy toggle ────────────────────────────────────────────────────
let privacyMode = localStorage.getItem('sc_privacy') === '1';
let breathingBreakEnabled = localStorage.getItem('sc_breathing_break') !== '0'; // on by default
function isPrivacyMode() { return privacyMode; }
function togglePrivacy() {
  privacyMode = !privacyMode;
  localStorage.setItem('sc_privacy', privacyMode ? '1' : '0');
  const btn = document.getElementById('btnPrivacy');
  if (btn) btn.classList.toggle('on', privacyMode);
  // Update sync dot label
  if (privacyMode) {
    updateSyncDisplay('failed'); // shows "Local clock"
    stopWeather();
    const wp = $('weatherPill');
    if (wp) { wp.classList.remove('loaded'); }
  } else {
    syncTime();
    initWeather($('weatherIcon'), $('weatherText'), $('weatherPill'), isPrivacyMode);
  }
}

function toggleFocusLock() {
  focusLockEnabled = !focusLockEnabled;
  localStorage.setItem('sc_focus_lock', focusLockEnabled ? '1' : '0');
  const btn = document.getElementById('btnFocusLock');
  if (btn) btn.classList.toggle('on', focusLockEnabled);
}

// ── Current theme ──────────────────────────────────────────────────────
let currentTheme: Theme = THEMES[0];
const root = document.documentElement;
const cssVar = (name: string, val: string) => root.style.setProperty(name, val);

function applyTheme(theme: Theme, instant = false) {
  const doApply = () => {
    currentTheme = theme;
    buildParticles(theme);
    cssVar('--clr-text',    theme.text);
    cssVar('--clr-accent',  theme.accent);
    cssVar('--clr-accent2', theme.accent2);
    cssVar('--clr-track',   theme.track);
    cssVar('--clr-btn-bg',  theme.btnBg);
    cssVar('--clr-btn-fg',  theme.btnFg);
    cssVar('--clr-pill',    theme.pill);
    cssVar('--clr-panel',   theme.panel);
    cssVar('--font-main',   theme.font);
    cssVar('--glow', theme.glow === 'none' ? 'none' : `0 0 45px ${theme.accent}44,0 0 100px ${theme.accent}18`);
    cssVar('--btn-radius',  theme.isMedia ? '3px' : '99px');
    cssVar('--lb-h', (theme.isMedia && theme.lb) ? '3.8vh' : '0px');

    // Light theme body class (Nordic, Lemon)
    document.body.classList.toggle('light-theme', !!theme.light);

    $('overlay').style.background  = theme.overlay  === 'none' ? '' : theme.overlay;
    $('vignette').style.background = theme.vignette === 'none' ? '' : theme.vignette;
    ($('scanlines') as HTMLElement).style.opacity = theme.scanlines ? '1' : '0';
    const grainEl = $('grain');
    grainEl.style.opacity = theme.grain ? '0.25' : '0';
    if (theme.grain) grainEl.style.backgroundImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`;
    const hdrEl = $('hdrBloom');
    if (theme.hdr) { hdrEl.style.background = `radial-gradient(ellipse at 50% 50%,${theme.accent}09 0%,transparent 65%)`; hdrEl.style.opacity = '1'; }
    else hdrEl.style.opacity = '0';

    // Show badge for media themes
    if (theme.isMedia && theme.tagline) { DOM.showBadge.textContent = theme.tagline; DOM.showBadge.classList.add('visible'); }
    else DOM.showBadge.classList.remove('visible');

    // Literary mode
    if (theme.id === 'literary') {
      DOM.quoteText.style.fontFamily = "'Lora',serif";
      DOM.quoteText.style.fontSize = 'clamp(.75rem,1.4vw,.95rem)';
      DOM.litMeta.style.display = 'block';
    } else {
      DOM.quoteText.style.fontFamily = DOM.quoteText.style.fontSize = '';
      DOM.litMeta.style.display = 'none';
      const qs = theme.quotes?.length ? theme.quotes : NAT_QUOTES;
      DOM.quoteText.style.opacity = '0';
      setTimeout(() => { DOM.quoteText.textContent = `"${qs[0]}"`; DOM.quoteText.style.opacity = '.38'; }, 420);
    }

    updateSyncDisplay(synced ? 'ok' : 'failed');
    document.querySelectorAll<HTMLElement>('.nat-btn,.media-card').forEach(b => b.classList.toggle('active', b.dataset.id === theme.id));
    lastQKey = '';
    localStorage.setItem('sc_last_theme', theme.id);
    bcBroadcast('theme', { id: theme.id });
    // Common Room: auto-start rain + fire
    if (theme.id === 'commonroom') setTimeout(() => Sound.autoStartCommonRoom(), 400);
    // Rebuild clock canvas so font/colours update for current theme
    updateClockCanvas();
  };

  if (instant || !theme.isMedia) { doApply(); if (!instant) flashTheme(); return; }
  runTransition(theme.transition ?? 'defaultFade', doApply);
}

// ── Sync UI ────────────────────────────────────────────────────────────
function updateSyncDisplay(state: 'syncing' | 'ok' | 'failed', rtt?: number) {
  if (!DOM.syncDot) return;
  if (state === 'syncing') { DOM.syncDot.style.background = '#f59e0b'; DOM.syncLabel.textContent = 'Syncing…'; }
  else if (state === 'ok') {
    DOM.syncDot.style.background = currentTheme.accent;
    const ms = Math.abs(Math.round(clockOffset));
    DOM.syncLabel.textContent = `Synced · ±${ms}ms${rtt != null ? ` · ${Math.round(rtt)}ms RTT` : ''}`;
  } else { DOM.syncDot.style.background = '#ef4444'; DOM.syncLabel.textContent = 'Local clock'; }
}
setSyncHandler(updateSyncDisplay);

// ── Render loop ────────────────────────────────────────────────────────
let lastTs = 0, lastSec = -1, lastQKey = '';

function tickDigit(el: HTMLElement, val: string) {
  if (el.textContent === val) return;
  el.classList.remove('tick');
  void (el as HTMLElement).offsetWidth;
  el.textContent = val;
  el.classList.add('tick');
}

function renderFrame(ts: number) {
  requestAnimationFrame(renderFrame);
  const dt = Math.min((ts - lastTs) / 1000, 0.05); lastTs = ts;
  // Smooth parallax
  parallaxX += (targetPX - parallaxX) * 0.06;
  parallaxY += (targetPY - parallaxY) * 0.06;
  setParallax(parallaxX, parallaxY);
  drawBg(dt, currentTheme);
  Sound.tickSpatial(ts / 1000);

  const now = new Date(Date.now() + clockOffset);
  const ms = now.getMilliseconds(), sec = now.getSeconds(), min = now.getMinutes(), hr = now.getHours();
  const hr12 = hr % 12 || 12;
  const hrStr = p2(hr12), minStr = p2(min), secStr = p2(sec);

  // Route to correct clock renderer
  switch (clockMode) {
    case 'analogue':  renderAnalogue(hr, min, sec, ms);  break;
    case 'flip':      renderFlip(hrStr, minStr, secStr); break;
    case 'word':      renderWord(hr, min);               break;
    case 'minimal':   renderMinimal(hr12, hr);           break;
    case 'segment':   renderSegment(hrStr, minStr, secStr); break;
    default:
      tickDigit(DOM.digitHr, hrStr);
      tickDigit(DOM.digitMin, minStr);
      tickDigit(DOM.digitSec, secStr);
      DOM.ampmDis.textContent = hr >= 12 ? 'PM' : 'AM';
      DOM.secMs.textContent = '.' + p3(ms);
  }

  // SMPTE: override seconds-ms display with frame counter
  if (currentTheme.id === 'smpte' && clockMode === 'digital') {
    const frame = Math.floor(ms / (1000 / 24)) % 24;
    DOM.secMs.textContent = ':' + p2(frame);
  }
  // Terminal: show 24hr time
  if (currentTheme.id === 'terminal' && clockMode === 'digital') {
    tickDigit(DOM.digitHr, p2(hr));
  }

  DOM.timeDis.textContent = `${hrStr}:${minStr}:${secStr}`;
  const dp = ((hr * 3600 + min * 60 + sec) * 1000 + ms) / 864e5 * 100;
  DOM.pFill.style.width = dp.toFixed(4) + '%';

  if (sessionRunning) {
    if (Pom.isActive()) Pom.tick(performance.now());
    else DOM.sTmr.textContent = fmtSession(performance.now() - sessionStart);
  }

  if (sec !== lastSec) {
    lastSec = sec;
    const uh = now.getUTCHours(), um = now.getUTCMinutes(), us = now.getUTCSeconds();
    DOM.utcPill.textContent = `UTC ${p2(uh)}:${p2(um)}:${p2(us)}`;
    DOM.dateDis.textContent = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    DOM.greeting.textContent = GREETS.find(([s, e]) => hr >= s && hr < e)?.[2] ?? '';
    DOM.dayPct.textContent = dp.toFixed(1) + '%';

    if (currentTheme.id === 'literary') {
      const key = p2(hr) + ':' + p2(Math.floor(min / 5) * 5);
      if (key !== lastQKey) {
        lastQKey = key;
        const entry = LIT_CLOCK[key];
        if (entry) {
          DOM.quoteText.style.opacity = '0';
          setTimeout(() => { DOM.quoteText.textContent = `"${entry.quote}"`; DOM.litMeta.textContent = entry.source; DOM.quoteText.style.opacity = '.55'; }, 400);
        }
      }
    } else {
      const qs = currentTheme.quotes?.length ? currentTheme.quotes : NAT_QUOTES;
      const qi = (((hr * 60 + min) / 5) | 0) % qs.length;
      const qKey = String(qi);
      if (qKey !== lastQKey) { lastQKey = qKey; DOM.quoteText.style.opacity = '0'; setTimeout(() => { DOM.quoteText.textContent = `"${qs[qi]}"`; DOM.quoteText.style.opacity = '.38'; }, 400); }
    }
  }
}

// ── Clock renderers ───────────────────────────────────────────────────

// ANALOGUE — SVG hands drawn into #analogueClock canvas element
function renderAnalogue(hr: number, min: number, sec: number, ms: number) {
  const el = document.getElementById('analogueClock') as HTMLCanvasElement | null;
  if (!el) return;
  const size = el.width; const cx = size / 2, cy = size / 2, R = size / 2 - 4;
  const ctx2 = el.getContext('2d')!;
  ctx2.clearRect(0, 0, size, size);
  const acc = currentTheme.accent;

  // Dial face
  ctx2.beginPath(); ctx2.arc(cx, cy, R, 0, Math.PI * 2);
  ctx2.strokeStyle = acc + '30'; ctx2.lineWidth = 1.5; ctx2.stroke();

  // Hour ticks
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const inner = i % 3 === 0 ? R * 0.82 : R * 0.88;
    ctx2.beginPath();
    ctx2.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    ctx2.lineTo(cx + Math.cos(a) * R,     cy + Math.sin(a) * R);
    ctx2.strokeStyle = acc + (i % 3 === 0 ? 'cc' : '55');
    ctx2.lineWidth = i % 3 === 0 ? 2 : 1;
    ctx2.stroke();
  }

  // Smooth second hand — interpolate with ms
  const secAngle = ((sec + ms / 1000) / 60) * Math.PI * 2 - Math.PI / 2;
  const minAngle = ((min + sec / 60) / 60) * Math.PI * 2 - Math.PI / 2;
  const hrAngle  = (((hr % 12) + min / 60) / 12) * Math.PI * 2 - Math.PI / 2;

  const drawHand = (angle: number, length: number, width: number, color: string) => {
    ctx2.beginPath();
    ctx2.moveTo(cx - Math.cos(angle) * R * 0.12, cy - Math.sin(angle) * R * 0.12);
    ctx2.lineTo(cx + Math.cos(angle) * length,   cy + Math.sin(angle) * length);
    ctx2.strokeStyle = color; ctx2.lineWidth = width;
    ctx2.lineCap = 'round'; ctx2.stroke();
  };

  drawHand(hrAngle,  R * 0.55, 3.5, currentTheme.text);
  drawHand(minAngle, R * 0.78, 2.2, currentTheme.text);
  drawHand(secAngle, R * 0.88, 1.2, acc);

  // Centre dot
  ctx2.beginPath(); ctx2.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx2.fillStyle = acc; ctx2.fill();
}

// FLIP — CSS 3D card flip per digit group
let flipPrev = { hr: '', min: '', sec: '' };
function renderFlip(hr: string, min: string, sec: string) {
  const update = (id: string, val: string, prev: string) => {
    const el = document.getElementById(id);
    if (!el || val === prev) return;
    const top = el.querySelector<HTMLElement>('.flip-top');
    const bot = el.querySelector<HTMLElement>('.flip-bot');
    const topBack = el.querySelector<HTMLElement>('.flip-top-back');
    if (!top || !bot || !topBack) return;
    top.textContent = prev;
    bot.textContent = val;
    topBack.textContent = val;
    el.classList.remove('flipping');
    void el.offsetWidth;
    el.classList.add('flipping');
  };
  update('flipHr',  hr,  flipPrev.hr);
  update('flipMin', min, flipPrev.min);
  update('flipSec', sec, flipPrev.sec);
  flipPrev = { hr, min, sec };
}

// WORD CLOCK — 10×11 letter grid, lit words
const WORD_GRID = [
  'ITLISASTIME',
  'ACQUARTERDC',
  'TWENTYFIVEX',
  'HALFSTENFTO',
  'PASTERUNINE',
  'ONESIXTHREE',
  'FOURFIVETWO',
  'EIGHTELEVEN',
  'SEVENTWELVE',
  'TENSEOCLOCK',
];
// Word positions [row, colStart, colEnd] (inclusive)
const WORDS: Record<string, [number,number,number][]> = {
  IT:       [[0,0,1]], IS:      [[0,3,4]], A:   [[0,5,5]],
  QUARTER:  [[1,2,8]], TWENTY:  [[2,0,5]], FIVE:[[2,6,9]],
  HALF:     [[3,0,3]], TEN:     [[3,5,7]], TO:  [[3,9,10]],
  PAST:     [[4,0,3]],
  ONE:      [[5,0,2]], SIX:     [[5,3,5]], THREE:[[5,6,10]],
  FOUR:     [[6,0,3]], FIVE2:   [[6,4,7]], TWO: [[6,8,10]],
  EIGHT:    [[7,0,4]], ELEVEN:  [[7,5,10]],
  SEVEN:    [[8,0,4]], TWELVE:  [[8,5,10]],
  TEN2:     [[9,0,2]], OCLOCK:  [[9,4,9]],
};
const HOUR_WORDS = ['TWELVE','ONE','TWO','THREE','FOUR','FIVE2','SIX','SEVEN','EIGHT','NINE','TEN2','ELEVEN'];

function getWordClockWords(hr: number, min: number): Set<string> {
  const lit = new Set<string>(['IT','IS']);
  const m5 = Math.round(min / 5) * 5;
  if      (m5 === 0)  { lit.add('OCLOCK'); }
  else if (m5 === 5)  { lit.add('FIVE');  lit.add('PAST'); }
  else if (m5 === 10) { lit.add('TEN');   lit.add('PAST'); }
  else if (m5 === 15) { lit.add('A'); lit.add('QUARTER'); lit.add('PAST'); }
  else if (m5 === 20) { lit.add('TWENTY'); lit.add('PAST'); }
  else if (m5 === 25) { lit.add('TWENTY'); lit.add('FIVE'); lit.add('PAST'); }
  else if (m5 === 30) { lit.add('HALF'); lit.add('PAST'); }
  else if (m5 === 35) { lit.add('TWENTY'); lit.add('FIVE'); lit.add('TO'); }
  else if (m5 === 40) { lit.add('TWENTY'); lit.add('TO'); }
  else if (m5 === 45) { lit.add('A'); lit.add('QUARTER'); lit.add('TO'); }
  else if (m5 === 50) { lit.add('TEN'); lit.add('TO'); }
  else if (m5 === 55) { lit.add('FIVE'); lit.add('TO'); }
  const hIdx = (m5 >= 35 ? (hr % 12) + 1 : hr % 12) % 12;
  lit.add(HOUR_WORDS[hIdx]);
  return lit;
}

let wordPrevKey = '';
function renderWord(hr: number, min: number) {
  const key = `${hr}:${Math.floor(min / 5)}`;
  if (key === wordPrevKey) return;
  wordPrevKey = key;
  const lit = getWordClockWords(hr, min);
  const el = document.getElementById('wordClockGrid');
  if (!el) return;
  el.innerHTML = '';
  WORD_GRID.forEach((row, ri) => {
    [...row].forEach((ch, ci) => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.className = 'wc-char';
      // Check if this char is part of a lit word
      let isLit = false;
      for (const [word, positions] of Object.entries(WORDS)) {
        if (!lit.has(word)) continue;
        for (const [r, cs, ce] of positions) {
          if (r === ri && ci >= cs && ci <= ce) { isLit = true; break; }
        }
        if (isLit) break;
      }
      span.classList.toggle('wc-lit', isLit);
      el.appendChild(span);
    });
  });
}

// MINIMAL — just the hour, enormous
function renderMinimal(hr12: number, hr: number) {
  const el = document.getElementById('minimalHr');
  const ap = document.getElementById('minimalAP');
  if (el) el.textContent = String(hr12);
  if (ap) ap.textContent = hr >= 12 ? 'PM' : 'AM';
}

// SEGMENT — 7-segment style per digit
const SEG_PATHS: Record<string, number[]> = {
  // Which of 7 segments [top,topR,botR,bot,botL,topL,mid] are ON per digit
  '0':[1,1,1,1,1,1,0], '1':[0,1,1,0,0,0,0], '2':[1,1,0,1,1,0,1],
  '3':[1,1,1,1,0,0,1], '4':[0,1,1,0,0,1,1], '5':[1,0,1,1,0,1,1],
  '6':[1,0,1,1,1,1,1], '7':[1,1,1,0,0,0,0], '8':[1,1,1,1,1,1,1],
  '9':[1,1,1,1,0,1,1],
};
function drawSegDigit(ctx2: CanvasRenderingContext2D, digit: string, x: number, y: number, w: number, h: number, color: string, dimColor: string) {
  const segs = SEG_PATHS[digit] ?? SEG_PATHS['8'];
  const t = 4, g = 3; // thickness, gap
  const iw = w - t * 2 - g * 2, ih = (h - t * 3 - g * 4) / 2;
  // top, topR, botR, bot, botL, topL, mid
  const drawSeg = (on: number, draw: () => void) => {
    ctx2.fillStyle = on ? color : dimColor; draw();
  };
  // top
  drawSeg(segs[0], () => { ctx2.fillRect(x + t + g, y, iw, t); });
  // topR
  drawSeg(segs[1], () => { ctx2.fillRect(x + w - t, y + t + g, t, ih); });
  // botR
  drawSeg(segs[2], () => { ctx2.fillRect(x + w - t, y + t * 2 + g * 3 + ih, t, ih); });
  // bot
  drawSeg(segs[3], () => { ctx2.fillRect(x + t + g, y + h - t, iw, t); });
  // botL
  drawSeg(segs[4], () => { ctx2.fillRect(x, y + t * 2 + g * 3 + ih, t, ih); });
  // topL
  drawSeg(segs[5], () => { ctx2.fillRect(x, y + t + g, t, ih); });
  // mid
  drawSeg(segs[6], () => { ctx2.fillRect(x + t + g, y + t + g * 3 + ih, iw, t); });
}

function renderSegment(hr: string, min: string, sec: string) {
  const el = document.getElementById('segmentClock') as HTMLCanvasElement | null;
  if (!el) return;
  const ctx2 = el.getContext('2d')!;
  ctx2.clearRect(0, 0, el.width, el.height);
  const acc = currentTheme.accent;
  const dim = acc + '18';
  const dw = 42, dh = 80, gap = 12, colonW = 18;
  const totalW = 6 * dw + 5 * gap + 2 * colonW;
  let ox = (el.width - totalW) / 2, oy = (el.height - dh) / 2;
  const digits = [hr[0], hr[1], min[0], min[1], sec[0], sec[1]];
  digits.forEach((d, i) => {
    if (i === 2 || i === 4) {
      // Colon
      ctx2.fillStyle = Math.floor(Date.now() / 500) % 2 === 0 ? acc : dim;
      ctx2.beginPath(); ctx2.arc(ox + colonW / 2, oy + dh * 0.33, 3, 0, Math.PI * 2); ctx2.fill();
      ctx2.beginPath(); ctx2.arc(ox + colonW / 2, oy + dh * 0.67, 3, 0, Math.PI * 2); ctx2.fill();
      ox += colonW + gap;
    }
    drawSegDigit(ctx2, d, ox, oy, dw, dh, acc, dim);
    ox += dw + gap;
  });
}

// Generate a tiny canvas logo for themes without a LOGOS entry (safe — no user data)
function makeFallbackLogo(t: Theme): string {
  const cv = document.createElement('canvas'); cv.width = 32; cv.height = 22;
  const cx2 = cv.getContext('2d')!;
  cx2.fillStyle = t.baseBg[0]; cx2.fillRect(0,0,32,22);
  cx2.fillStyle = t.accent; cx2.font = 'bold 8px system-ui';
  cx2.textAlign = 'center'; cx2.textBaseline = 'middle';
  cx2.fillText(t.name.slice(0,2).toUpperCase(), 16, 11);
  const img = document.createElement('img');
  img.src = cv.toDataURL(); img.style.cssText = 'width:32px;height:22px;display:block';
  const wrap = document.createElement('div');
  wrap.appendChild(img);
  return wrap.innerHTML; // returns only <img src="data:..."> — safe data URL, no user content
}

// ── Theme panel ────────────────────────────────────────────────────────
let activePanelTab = 'nat';

function buildPanel() {
  const panelRows = $('themePanelRows'); panelRows.innerHTML = '';
  const featBar   = $('featBar');       featBar.innerHTML   = '';

  // ── Tab bar ──────────────────────────────────────────────────────────
  const tabs = document.createElement('div');
  tabs.className = 'panel-tabs';
  const tabDefs: [string, string, string][] = [
    ['nat',   '🌿', 'Natural'],
    ['tv',    '📺', 'TV Shows'],
    ['movie', '🎬', 'Movies'],
    ['f1',    '🏎', 'F1 Teams'],
  ];
  const contents: Record<string, HTMLElement> = {};
  tabDefs.forEach(([id, icon, label]) => {
    const btn = document.createElement('button');
    btn.className = 'panel-tab' + (id === activePanelTab ? ' active' : '');
    btn.dataset.tab = id;
    const iconEl = document.createElement('span'); iconEl.className = 'tab-icon'; iconEl.textContent = icon;
    const lblEl  = document.createElement('span'); lblEl.className  = 'tab-label'; lblEl.textContent  = label;
    btn.append(iconEl, lblEl);
    btn.addEventListener('click', () => switchPanelTab(id));
    tabs.appendChild(btn);
  });
  panelRows.appendChild(tabs);

  // ── Tab contents ──────────────────────────────────────────────────────
  const makeNatBtn = (t: Theme) => {
    const btn = document.createElement('button');
    btn.className = 'nat-btn' + (t.id === currentTheme.id ? ' active' : '');
    btn.dataset.id = t.id; btn.title = t.name;
    btn.style.background = t.swatch ?? t.accent;
    const tip = document.createElement('span'); tip.className = 'nat-tip'; tip.textContent = t.name;
    btn.appendChild(tip);
    btn.addEventListener('click', () => applyTheme(t));
    return btn;
  };

  const makeCard = (t: Theme) => {
    const card = document.createElement('button');
    card.className = 'media-card' + (t.id === currentTheme.id ? ' active' : '');
    card.dataset.id = t.id;
    card.addEventListener('click', () => applyTheme(t));
    const logo = document.createElement('div'); logo.className = 'media-logo';
    logo.innerHTML = LOGOS[t.id] ?? makeFallbackLogo(t);
    const nm = document.createElement('div'); nm.className = 'media-name'; nm.textContent = t.name;
    const sb = document.createElement('div'); sb.className = 'media-sub'; sb.style.color = t.accent; sb.textContent = t.sub ?? '';
    const txt = document.createElement('div'); txt.className = 'media-card-text'; txt.append(nm, sb);

    // Shop badge — show item count for this theme
    const shopItems = Shop.getItemsForTheme(t.id);
    if (shopItems.length > 0) {
      const owned = Shop.getOwned();
      const ownedCount = shopItems.filter(i => owned.has(i.id)).length;
      const badge = document.createElement('span');
      badge.className = 'shop-badge';
      badge.textContent = ownedCount > 0 ? `${ownedCount}/${shopItems.length}` : `${shopItems.length}`;
      badge.title = 'Shop items';
      txt.appendChild(badge);
    }

    card.append(logo, txt); return card;
  };

  // Natural tab
  const natContent = document.createElement('div');
  natContent.className = 'tab-content' + (activePanelTab === 'nat' ? ' active' : '');
  natContent.dataset.tab = 'nat';

  const pureNat = THEMES_BY_CAT.nat.filter(t => !['literary'].includes(t.id));
  const specialNat = THEMES_BY_CAT.nat.filter(t => ['literary'].includes(t.id));

  const natGrid = document.createElement('div'); natGrid.className = 'nat-grid';
  pureNat.forEach(t => natGrid.appendChild(makeNatBtn(t)));
  natContent.appendChild(natGrid);

  if (specialNat.length) {
    const specLabel = document.createElement('div'); specLabel.className = 'tab-sub-label'; specLabel.textContent = 'Special';
    const specRow = document.createElement('div'); specRow.className = 'media-grid';
    specialNat.forEach(t => specRow.appendChild(makeCard(t)));
    natContent.append(specLabel, specRow);
  }
  contents['nat'] = natContent;

  // TV, Movie, F1 tabs
  (['tv','movie','f1'] as const).forEach(cat => {
    const content = document.createElement('div');
    content.className = 'tab-content' + (activePanelTab === cat ? ' active' : '');
    content.dataset.tab = cat;
    const grid = document.createElement('div'); grid.className = 'media-grid';
    THEMES_BY_CAT[cat].forEach(t => grid.appendChild(makeCard(t)));
    content.appendChild(grid);
    contents[cat] = content;
  });

  Object.values(contents).forEach(c => panelRows.appendChild(c));

  // ── Feature bar ───────────────────────────────────────────────────────
  ([ ['btnSound',       '🎵 Sound',      () => { buildSoundUI(); openModal('soundOverlay'); }],
     ['btnKiosk',       '⛶ Kiosk',      toggleKiosk],
     ['btnPresent',     '📺 Present',    togglePresent],
     ['btnThemeBuilder','🎨 Custom',     openThemeBuilder],
     ['btnKb',          '⌨ Keys',       () => openModal('kbOverlay')],
     ['btnPrivacy',     '🔒 Privacy',   togglePrivacy],
     ['btnFocusLock',   '🔐 Focus Lock',toggleFocusLock],
     ['btnQR',          '📱 Handoff',   openQRHandoff],
     ['btnShare',       '🖼 Share',      openShareCard],
     ['btnAnimedoro',   '🎬 Animedoro', () => { startAnimedoro(); openModal('pomOverlay'); }],
     ['btnShop',        '🛒 Shop',      openShop],
     ['btnSettings',    '⚙️ Settings',  openSettings],
  ] as [string, string, () => void][]).forEach(([id, label, action]) => {
    const b = document.createElement('button');
    b.className = 'feat-btn'; b.id = id;
    if (id === 'btnShop') {
      b.textContent = '🛒 Shop ';
      b.appendChild(createCoinEl(Shop.getTokens()));
    } else {
      b.textContent = label;
    }
    if (id === 'btnPrivacy'   && privacyMode)      b.classList.add('on');
    if (id === 'btnFocusLock' && focusLockEnabled) b.classList.add('on');
    b.addEventListener('click', action);
    featBar.appendChild(b);
  });
}

function switchPanelTab(id: string) {
  activePanelTab = id;
  document.querySelectorAll<HTMLElement>('.panel-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  document.querySelectorAll<HTMLElement>('.tab-content').forEach(c => c.classList.toggle('active', c.dataset.tab === id));
}

// ── Modals ─────────────────────────────────────────────────────────────
const openModal  = (id: string) => $(id).classList.add('open');
const closeModal = (id: string) => $(id).classList.remove('open');
document.querySelectorAll('.sc-overlay').forEach(el => {
  el.addEventListener('click', e => { if (e.target === el) (el as HTMLElement).classList.remove('open'); });
});
(window as any).SC = { modals: { open: openModal, close: closeModal } };

// ── Keyboard shortcuts ─────────────────────────────────────────────────
const SHORTCUTS: [string, string, () => void][] = [
  ['Space', 'Start / Pause session timer', () => DOM.btnStart.click()],
  ['R',     'Reset timer',                  () => DOM.btnReset.click()],
  ['T',     'Cycle to next theme',          () => { const idx = THEMES.indexOf(currentTheme); applyTheme(THEMES[(idx+1)%THEMES.length]); }],
  ['F',     'Toggle fullscreen / kiosk',    toggleKiosk],
  ['P',     'Toggle Pomodoro mode',         () => $('btnPomToggle').click()],
  ['M',     'Open ambient sound mixer',     () => { buildSoundUI(); openModal('soundOverlay'); }],
  ['L',     'Open session focus log',       () => { Log.render($('logEntries')); openModal('logOverlay'); }],
  ['K',     'Collapse / expand panel',      () => { DOM.themePanel.classList.toggle('collapsed'); updateRevealBtn(); }],
  ['G',     'Open custom theme builder',    openThemeBuilder],
  ['?',     'Show shortcuts',               () => openModal('kbOverlay')],
  ['Escape','Close any open panel',         () => document.querySelectorAll<HTMLElement>('.sc-overlay.open').forEach(el => el.classList.remove('open'))],
];

// Build keyboard grid
const kbGrid = $('kbGrid'); kbGrid.innerHTML = '';
SHORTCUTS.forEach(([key, desc]) => {
  const k = document.createElement('kbd'); k.textContent = key;
  const d = document.createElement('span'); d.className = 'kb-desc'; d.textContent = desc;
  kbGrid.append(k, d);
});

document.addEventListener('keydown', e => {
  const tag = (document.activeElement as HTMLElement).tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') { if (e.key === 'Escape') (document.activeElement as HTMLElement).blur(); return; }
  const hasOpen = document.querySelector('.sc-overlay.open');
  if (hasOpen && e.key !== 'Escape') return;
  for (const [key, , action] of SHORTCUTS) {
    const ek = e.key.toLowerCase();
    const match =
      (key === 'Space'  && e.code === 'Space') ||
      (key === '?'      && (e.key === '?' || (e.code === 'Slash' && e.shiftKey))) ||
      (key === 'Escape' && e.key === 'Escape') ||
      (key.length === 1 && key.toLowerCase() === ek && key !== '?');
    if (match) { e.preventDefault(); action(); return; }
  }
});

// ── Display modes ──────────────────────────────────────────────────────
let kioskOn = false, presentOn = false;

function updateRevealBtn() {
  const btn = $('themesRevealBtn');
  const hidden = kioskOn || presentOn || DOM.themePanel.classList.contains('collapsed');
  btn.style.opacity = hidden ? '1' : '0';
  btn.style.transform = hidden ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(80px)';
  (btn as HTMLButtonElement).disabled = !hidden;
}

function toggleKiosk() {
  kioskOn = !kioskOn;
  document.body.classList.toggle('kiosk', kioskOn);
  if (kioskOn) document.documentElement.requestFullscreen?.().catch(() => {});
  else document.exitFullscreen?.().catch(() => {});
  updateRevealBtn();
}
// Sync kioskOn if user exits fullscreen via browser Escape (bypasses toggleKiosk)
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && kioskOn) {
    kioskOn = false;
    document.body.classList.remove('kiosk');
    updateRevealBtn();
  }
});
function togglePresent() {
  presentOn = !presentOn;
  document.body.classList.toggle('present', presentOn);
  updateRevealBtn();
}

// ── Focus Lock Delay ──────────────────────────────────────────────────
// When Pomodoro work is active, intercept distracting UI with a 3s delay
let focusLockEnabled = localStorage.getItem('sc_focus_lock') === '1';
let focusLockTimer: number | null = null;
let focusLockBar: HTMLElement | null = null;

function isFocusLocked(): boolean {
  return focusLockEnabled && Pom.isActive() && sessionRunning;
}

function focusLockIntercept(action: () => void): void {
  if (!isFocusLocked()) { action(); return; }

  // Already counting down — cancel it (double-click = immediate)
  if (focusLockTimer !== null) {
    clearTimeout(focusLockTimer);
    focusLockTimer = null;
    if (focusLockBar) { focusLockBar.remove(); focusLockBar = null; }
    action();
    return;
  }

  // Create progress bar overlay
  const bar = document.createElement('div');
  bar.className = 'focus-lock-bar';
  const fill = document.createElement('div'); fill.className = 'focus-lock-fill';
  const lbl  = document.createElement('span'); lbl.className = 'focus-lock-label';
  lbl.textContent = 'Stay focused… click again to open';
  bar.append(fill, lbl);
  document.body.appendChild(bar);
  focusLockBar = bar;

  requestAnimationFrame(() => {
    fill.style.transition = 'width 3s linear'; fill.style.width = '100%';
  });

  focusLockTimer = window.setTimeout(() => {
    if (focusLockBar) { focusLockBar.remove(); focusLockBar = null; }
    focusLockTimer = null;
    action();
  }, 3000);
}

// THEMES reveal button
$('themesRevealBtn').addEventListener('click', () => {
  if (kioskOn) { toggleKiosk(); return; }
  if (presentOn) { togglePresent(); return; }
  focusLockIntercept(() => {
    DOM.themePanel.classList.remove('collapsed');
    updateRevealBtn();
  });
});

// Hook panel toggle to also update reveal button
$('panelToggle').onclick = () => {
  focusLockIntercept(() => {
    DOM.themePanel.classList.toggle('collapsed');
    updateRevealBtn();
  });
};

// ── Pomodoro UI ────────────────────────────────────────────────────────
Pom.init({
  isRunning: () => sessionRunning,
  getStart:  () => sessionStart,
  timer:     DOM.sTmr,
  arc:       DOM.pomRingArc as unknown as SVGCircleElement,
  ring:      DOM.pomRingSvg as unknown as SVGSVGElement,
  pill:      DOM.pomPill,
  label:     DOM.sessionLabel,
  onPhase: txt => {
    DOM.pomPill.textContent = txt;
    if (txt.includes('Work')) {
      Sound.adaptOnWorkStart();
      setBreathing(false);
    } else {
      // Work phase just ended → award tokens
      awardTokens(Pom.getSettings().workMins);
      Sound.adaptOnBreak();
      if (breathingBreakEnabled && !animedoroActive) {
        setBreathing(true);
        const s = Pom.getSettings();
        const dur = txt.includes('Long') ? s.longBreakMins : s.breakMins;
        setTimeout(() => setBreathing(false), dur * 60_000);
      }
      if (animedoroActive) {
        const s = Pom.getSettings();
        const dur = txt.includes('Long') ? s.longBreakMins : s.breakMins;
        triggerTheaterMode(dur);
      }
    }
  },
});

$('btnPomToggle').addEventListener('click', () => {
  Pom.toggle();
  buildPomUI();
  openModal('pomOverlay');
});

function buildPomUI() {
  const s = Pom.getSettings();
  const countEl = $('pomCountToday');
  if (countEl) countEl.textContent = String(Pom.todayCount());
  (['pomWorkBtns','pomBreakBtns','pomLongBtns'] as const).forEach((id, i) => {
    const el = $(id); if (!el) return; el.innerHTML = '';
    const opts = i===0?[15,20,25,30,45,60]:i===1?[5,10,15]:[3,4,5,6];
    const cur  = i===0?s.workMins:i===1?s.breakMins:s.longBreakAfter;
    opts.forEach(v => {
      const b = document.createElement('button');
      b.className = 'btn' + (cur===v?' active-btn':'');
      b.textContent = i<2?`${v}m`:`${v}`;
      b.onclick = () => {
        if (i===0) Pom.updateSettings({workMins:v});
        else if (i===1) Pom.updateSettings({breakMins:v});
        else Pom.updateSettings({longBreakAfter:v});
        buildPomUI();
      };
      el.appendChild(b);
    });
  });
}

// ── Sound UI ───────────────────────────────────────────────────────────
function makeSoundTrack(
  id: string, icon: string, name: string, desc: string,
  active: boolean, vol: number, isBinaural = false
): HTMLDivElement {
  const track = document.createElement('div');
  track.className = ['sound-track', isBinaural ? 'binaural-track' : '', active ? 'active' : ''].filter(Boolean).join(' ');

  const iconEl = document.createElement('div'); iconEl.className = 'sound-track-icon';
  iconEl.textContent = icon;

  const info = document.createElement('div'); info.className = 'sound-track-info';
  const nm = document.createElement('div'); nm.className = 'sound-track-name'; nm.textContent = name;
  const ds = document.createElement('div'); ds.className = 'sound-track-desc';  ds.textContent = desc;
  info.append(nm, ds);

  const toggle = document.createElement('button');
  toggle.className = 'track-toggle' + (active ? ' on' : '');
  toggle.dataset.id = id;
  toggle.title = active ? 'Stop' : 'Play';

  if (!isBinaural) {
    const volWrap = document.createElement('div'); volWrap.className = 'sound-track-vol';
    const slider = document.createElement('input') as HTMLInputElement;
    slider.type = 'range'; slider.className = 'track-vol-slider';
    slider.min = '0'; slider.max = '100'; slider.value = String(vol);
    slider.dataset.id = id;
    const pct = document.createElement('span'); pct.className = 'sound-vol-pct';
    pct.id = 'tvp_' + id; pct.textContent = vol + '%';
    slider.addEventListener('input', e => {
      const v = +(e.target as HTMLInputElement).value / 100;
      Sound.setTrackVolume(id, v);
      pct.textContent = Math.round(v * 100) + '%';
    });
    volWrap.append(slider, pct);
    track.append(iconEl, info, volWrap, toggle);
    toggle.addEventListener('click', () => Sound.toggleTrack(id));
  } else {
    track.append(iconEl, info, toggle);
    toggle.addEventListener('click', () => Sound.toggleBinaural(id));
  }

  return track;
}

function buildSoundUI() {
  const container = $('soundGrid'); container.innerHTML = '';

  Sound.SOUNDS.forEach(s => {
    const vol = Math.round(Sound.getTrackVolume(s.id) * 100);
    container.appendChild(makeSoundTrack(s.id, s.icon, s.name, s.desc ?? '', Sound.isPlaying(s.id), vol));
  });

  // Binaural section header
  const binHeader = document.createElement('div'); binHeader.className = 'sound-section-header';
  const binTitle = document.createElement('span'); binTitle.className = 'sound-section-title'; binTitle.textContent = '🧠 Binaural Beats';
  const binNote  = document.createElement('span'); binNote.className  = 'sound-section-note';  binNote.textContent  = 'Requires headphones';
  binHeader.append(binTitle, binNote);
  container.appendChild(binHeader);

  Sound.BINAURAL_PRESETS.forEach(p => {
    container.appendChild(makeSoundTrack(p.id, p.icon, p.name, p.desc, Sound.binauralPresetId === p.id, 100, true));
  });

  // ── Sound Presets ─────────────────────────────────────────────────────
  const presetsSection = document.createElement('div'); presetsSection.className = 'sound-presets';

  const saveChip = document.createElement('button');
  saveChip.className = 'preset-chip save-btn'; saveChip.textContent = '+ Save Mix';
  saveChip.addEventListener('click', () => {
    const name = prompt('Name this preset (e.g. "Late Night"):');
    if (!name?.trim()) return;
    saveSoundPreset(name.trim());
    buildSoundUI(); // rebuilds presets row
    showToast(`Saved "${name.trim()}" mix`);
  });
  presetsSection.appendChild(saveChip);

  getSoundPresets().forEach(p => {
    const chip = document.createElement('button');
    chip.className = 'preset-chip'; chip.textContent = p.name;
    chip.title = 'Click to load, right-click to delete';
    chip.addEventListener('click',        () => { loadSoundPreset(p); showToast(`Loaded "${p.name}"`); });
    chip.addEventListener('contextmenu',  e  => {
      e.preventDefault();
      const presets = getSoundPresets().filter(pr => pr.name !== p.name);
      localStorage.setItem('sc_sound_presets', JSON.stringify(presets));
      buildSoundUI();
    });
    presetsSection.appendChild(chip);
  });
  container.appendChild(presetsSection);
}

Sound.setTrackChangeHandler(buildSoundUI);

($('volSlider') as HTMLInputElement).value = String(Math.round(Sound.getMasterVolume() * 100));
($('volLabel') as HTMLElement).textContent = Math.round(Sound.getMasterVolume() * 100) + '%';
($('volSlider') as HTMLInputElement).addEventListener('input', e => {
  const v = +(e.target as HTMLInputElement).value / 100;
  Sound.setMasterVolume(v);
  $('volLabel').textContent = Math.round(v * 100) + '%';
});
($('fadeSlider') as HTMLInputElement).addEventListener('input', e => {
  const v = +(e.target as HTMLInputElement).value;
  Sound.setFade(v);
  $('fadeLabel').textContent = v === 0 ? 'Off' : `${v}m`;
});

// ── Focus log UI ───────────────────────────────────────────────────────
let logView: 'list' | 'heatmap' = 'list';

function openLog() {
  renderLogView();
  openModal('logOverlay');
}

function renderLogView() {
  const listBtn = $('logTabList');
  const heatBtn = $('logTabHeat');
  const container = $('logEntries');
  if (listBtn) listBtn.classList.toggle('active', logView === 'list');
  if (heatBtn) heatBtn.classList.toggle('active', logView === 'heatmap');
  if (logView === 'heatmap') Log.renderHeatmap(container);
  else Log.render(container);
}

$('btnLog').addEventListener('click', openLog);

// Tab buttons wired via onclick in HTML — expose via SC
(window as any).SC = {
  ...(window as any).SC,
  focusLog: {
    exportCSV: Log.exportCSV,
    clear: () => { Log.clear(); renderLogView(); },
    switchTab: (tab: 'list' | 'heatmap') => { logView = tab; renderLogView(); },
  },
};

// ── Custom Theme Builder ───────────────────────────────────────────────
const THEME_FIELDS = [
  { key: 'text', label: 'Text color' }, { key: 'accent', label: 'Accent (main)' },
  { key: 'accent2', label: 'Accent 2' }, { key: 'btnFg', label: 'Button text' },
  { key: 'panel', label: 'Panel BG' }, { key: 'baseBg0', label: 'Background' },
];
let draft: Record<string, string> = { text:'#e0f2fe', accent:'#6ee7b7', accent2:'#818cf8', btnFg:'#6ee7b7', panel:'rgba(4,3,18,.7)', baseBg0:'#06030f' };
const rgbaToHex = (s: string) => { const m = s.match(/[\d.]+/g); return m ? '#'+[m[0],m[1],m[2]].map(v=>parseInt(v).toString(16).padStart(2,'0')).join('') : '#ffffff'; };

function buildColorRows() {
  const container = $('colorRows'); if (!container) return;
  container.innerHTML = '';
  THEME_FIELDS.forEach(f => {
    const raw = draft[f.key] ?? '#ffffff';
    const hex = (raw.startsWith('rgba')||raw.startsWith('rgb')) ? rgbaToHex(raw) : raw;

    const row   = document.createElement('div'); row.className = 'color-row';
    const label = document.createElement('span'); label.className = 'color-label';
    label.textContent = f.label;                          // ← textContent, not innerHTML

    const wrap  = document.createElement('div'); wrap.className = 'color-picker-wrap';
    const inp   = document.createElement('input') as HTMLInputElement;
    inp.type = 'color'; inp.value = hex; inp.dataset.key = f.key;

    const hexSpan = document.createElement('span');
    hexSpan.className = 'color-hex'; hexSpan.id = 'hex_' + f.key;
    hexSpan.textContent = hex;                            // ← textContent

    wrap.appendChild(inp);
    row.append(label, wrap, hexSpan);
    container.appendChild(row);
  });
  container.querySelectorAll<HTMLInputElement>('input[type=color]').forEach(inp => {
    inp.addEventListener('input', e => {
      const el = e.target as HTMLInputElement;
      draft[el.dataset.key!] = el.value;
      const hexEl = document.getElementById('hex_' + el.dataset.key);
      if (hexEl) hexEl.textContent = el.value;
    });
  });
  renderSavedSwatches();
}

function previewCustomTheme() {
  cssVar('--clr-text', draft.text); cssVar('--clr-accent', draft.accent);
  cssVar('--clr-accent2', draft.accent2); cssVar('--clr-btn-fg', draft.btnFg);
  cssVar('--clr-panel', draft.panel);
}

function saveCustomTheme() {
  const saved: {id:string; name:string; draft:typeof draft}[] = JSON.parse(localStorage.getItem('sc_custom_themes')||'[]');
  saved.push({ id:'custom_'+Date.now(), name:'Custom '+saved.length, draft:{...draft} });
  if (saved.length > 10) saved.shift();
  localStorage.setItem('sc_custom_themes', JSON.stringify(saved));
  renderSavedSwatches(); alert('Custom theme saved!');
}

function renderSavedSwatches() {
  const row = $('savedThemeRow'); if (!row) return;
  const saved: {id:string; name:string; draft:typeof draft}[] = JSON.parse(localStorage.getItem('sc_custom_themes')||'[]');
  row.innerHTML = '';
  if (!saved.length) {
    const msg = document.createElement('span');
    msg.style.cssText = 'font-size:.65rem;opacity:.3;color:var(--clr-text)';
    msg.textContent = 'No saved themes yet';
    row.appendChild(msg); return;
  }
  saved.forEach(item => {
    const sw = document.createElement('div'); sw.className = 'saved-swatch'; sw.style.background = item.draft.accent; sw.title = item.name;
    sw.onclick = () => { draft = {...item.draft}; previewCustomTheme(); buildColorRows(); };
    row.appendChild(sw);
  });
}

function openThemeBuilder() { buildColorRows(); openModal('themeBuilderOverlay'); }

(window as any).SC = { ...(window as any).SC, themeBuilder: { preview: previewCustomTheme, save: saveCustomTheme, reset: () => applyTheme(currentTheme, true), openBuilder: openThemeBuilder } };

// ── Settings modal ────────────────────────────────────────────────────
function openSettings() { buildSettingsUI(); openModal('settingsOverlay'); }

function buildSettingsUI() {
  const el = $('settingsContent');
  if (!el) return;
  el.innerHTML = '';

  const clockModes: { mode: ClockMode; label: string; icon: string; desc: string }[] = [
    { mode: 'digital',  label: 'Digital',  icon: '🔢', desc: 'Classic digits'   },
    { mode: 'analogue', label: 'Analogue', icon: '🕐', desc: 'Sweep hands'      },
    { mode: 'flip',     label: 'Flip',     icon: '📅', desc: '3D card flip'     },
    { mode: 'word',     label: 'Word',     icon: '📝', desc: 'It is half past'  },
    { mode: 'minimal',  label: 'Minimal',  icon: '○',  desc: 'Hour only, huge'  },
    { mode: 'segment',  label: 'Segment',  icon: '📟', desc: 'LED 7-segment'    },
  ];

  const makeSection = (title: string) => {
    const s = document.createElement('div'); s.className = 'settings-section';
    const h = document.createElement('div'); h.className = 'settings-section-title'; h.textContent = title;
    s.appendChild(h); return s;
  };
  const makeRow = (lText: string, dText: string, btnId: string, on: boolean) => {
    const row  = document.createElement('div'); row.className = 'settings-row';
    const info = document.createElement('div'); info.className = 'settings-row-info';
    const lbl  = document.createElement('span'); lbl.className = 'settings-row-label'; lbl.textContent = lText;
    const dsc  = document.createElement('span'); dsc.className = 'settings-row-desc';  dsc.textContent = dText;
    info.append(lbl, dsc);
    const btn  = document.createElement('button'); btn.className = 'settings-toggle' + (on ? ' on' : ''); btn.id = btnId;
    row.append(info, btn); return row;
  };

  // ── Clock section
  const clockSec = makeSection('Clock Style');
  const grid = document.createElement('div'); grid.className = 'clock-mode-grid';
  clockModes.forEach(({ mode, label, icon, desc }) => {
    const btn = document.createElement('button');
    btn.className = 'clock-mode-btn' + (clockMode === mode ? ' active' : '');
    btn.dataset.mode = mode;
    const iEl = document.createElement('span'); iEl.className = 'cmb-icon';  iEl.textContent = icon;
    const lEl = document.createElement('span'); lEl.className = 'cmb-label'; lEl.textContent = label;
    const dEl = document.createElement('span'); dEl.className = 'cmb-desc';  dEl.textContent = desc;
    btn.append(iEl, lEl, dEl);
    btn.addEventListener('click', () => {
      setClockMode(mode); updateClockCanvas();
      grid.querySelectorAll('.clock-mode-btn').forEach(b => b.classList.toggle('active', (b as HTMLElement).dataset.mode === mode));
    });
    grid.appendChild(btn);
  });
  clockSec.appendChild(grid);
  el.appendChild(clockSec);

  // ── Audio section
  const audioSec = makeSection('Audio');
  audioSec.appendChild(makeRow('3D Spatial Audio', 'Ambient sounds pan left/right — requires headphones', 'toggleSpatial', Sound.isSpatialEnabled()));
  audioSec.appendChild(makeRow('Box Breathing on Break', 'Guided breathing overlay during Pomodoro breaks', 'toggleBreathing', breathingBreakEnabled));
  el.appendChild(audioSec);

  // ── Focus section
  const focusSec = makeSection('Focus');
  focusSec.appendChild(makeRow('Focus Lock Delay', '3-second delay before opening panels during Pomodoro', 'toggleFocusLockS', focusLockEnabled));
  el.appendChild(focusSec);

  // ── Privacy section
  const privSec = makeSection('Privacy');
  privSec.appendChild(makeRow('Privacy Mode', 'Disable weather & time sync — local clock only', 'togglePrivacyS', privacyMode));
  el.appendChild(privSec);

  // Wire toggles
  const wire = (id: string, fn: () => void) =>
    el.querySelector<HTMLElement>('#' + id)?.addEventListener('click', e => {
      (e.currentTarget as HTMLElement).classList.toggle('on'); fn();
    });
  wire('toggleSpatial',    () => Sound.setSpatial(!Sound.isSpatialEnabled()));
  wire('toggleBreathing',  () => { breathingBreakEnabled = !breathingBreakEnabled; localStorage.setItem('sc_breathing_break', breathingBreakEnabled ? '1' : '0'); });
  wire('toggleFocusLockS', () => toggleFocusLock());
  wire('togglePrivacyS',   () => togglePrivacy());
}

// ── Shop SVG art (developer-authored, safe for innerHTML) ─────────────
const SHOP_SVG: Record<string, string> = {
  // Supernatural
  sn_colt: `<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="14" width="34" height="6" rx="1.5" fill="#8B6914"/><rect x="34" y="13" width="12" height="8" rx="1" fill="#7a5c10"/><rect x="2" y="16" width="30" height="2" rx="1" fill="#c8a850" opacity=".4"/><rect x="8" y="20" width="20" height="9" rx="2" fill="#6b4d0e"/><circle cx="40" cy="17" r="2.5" fill="#3d2c06"/><rect x="35" y="8" width="3" height="5" rx="1" fill="#6b4d0e"/><rect x="1" y="15" width="5" height="4" rx="1" fill="#5a3e09"/></svg>`,
  sn_impala: `<svg viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="12" width="44" height="10" rx="2" fill="#111"/><path d="M8 12 Q12 5 20 5 L32 5 Q38 5 42 12Z" fill="#111"/><rect x="4" y="19" width="8" height="4" rx="2" fill="#222"/><rect x="36" y="19" width="8" height="4" rx="2" fill="#222"/><rect x="12" y="7" width="10" height="5" rx="1" fill="#1a3a5c" opacity=".8"/><rect x="26" y="7" width="10" height="5" rx="1" fill="#1a3a5c" opacity=".8"/><rect x="2" y="14" width="6" height="4" rx="1" fill="#e8b800" opacity=".9"/><rect x="40" y="14" width="6" height="4" rx="1" fill="#e8b800" opacity=".9"/><rect x="6" y="21" width="3" height="1" rx=".5" fill="#c0c0c0"/><rect x="39" y="21" width="3" height="1" rx=".5" fill="#c0c0c0"/></svg>`,
  sn_pentagram: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" stroke="#c84000" stroke-width="1.5" fill="none"/><polygon points="16,3 19.5,13 30,13 21.5,19 24.5,30 16,23.5 7.5,30 10.5,19 2,13 12.5,13" fill="none" stroke="#e05500" stroke-width="1.2" stroke-linejoin="round"/><circle cx="16" cy="16" r="3" fill="#e05500" opacity=".6"/></svg>`,

  // Mentalist
  mn_redj: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" fill="#8b0000"/><circle cx="10" cy="12" r="2.5" fill="#ff2200"/><circle cx="22" cy="12" r="2.5" fill="#ff2200"/><path d="M8 22 Q16 28 24 22" stroke="#ff2200" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  mn_card: `<svg viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="30" height="42" rx="3" fill="#f8f0e0" stroke="#ccc" stroke-width="1"/><text x="16" y="26" text-anchor="middle" font-size="20" fill="#cc1100">♠</text><text x="5" y="10" font-size="7" fill="#cc1100">A</text><text x="27" y="44" font-size="7" fill="#cc1100" transform="rotate(180,27,44)">A</text></svg>`,

  // Breaking Bad
  bb_hat: `<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="24" rx="22" ry="5" fill="#1a1a1a"/><path d="M6 24 Q6 8 24 8 Q42 8 42 24" fill="#0a0a0a"/><ellipse cx="24" cy="24" rx="22" ry="5" fill="none" stroke="#333" stroke-width="1"/></svg>`,
  bb_crystal: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="16,2 26,10 26,22 16,30 6,22 6,10" fill="#88ccff" opacity=".7" stroke="#5599ff" stroke-width="1"/><polygon points="16,2 26,10 16,14" fill="#aaddff" opacity=".5"/><polygon points="16,14 26,22 16,30 6,22" fill="#66aaee" opacity=".6"/><line x1="16" y1="2" x2="16" y2="30" stroke="white" stroke-width=".5" opacity=".4"/></svg>`,
  bb_pizza: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 3 L30 28 Q16 30 2 28 Z" fill="#e8a820"/><path d="M16 3 L30 28 Q16 30 2 28 Z" fill="none" stroke="#c88010" stroke-width="1"/><circle cx="12" cy="20" r="2" fill="#cc2200"/><circle cx="20" cy="16" r="1.5" fill="#cc2200"/><circle cx="16" cy="24" r="1.5" fill="#cc2200"/><path d="M16 3 L30 28" stroke="#c88010" stroke-width=".8"/><path d="M16 3 L2 28" stroke="#c88010" stroke-width=".8"/></svg>`,

  // Dark
  dk_knot: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4 C24 4 28 10 26 16 C24 22 18 24 16 24 C14 24 8 22 6 16 C4 10 8 4 16 4 Z" fill="none" stroke="#8888ff" stroke-width="2"/><path d="M10 16 C10 20 13 24 16 24 C19 24 22 20 22 16 C22 12 19 8 16 8 C13 8 10 12 10 16 Z" fill="none" stroke="#6666cc" stroke-width="1.5"/><circle cx="16" cy="16" r="2" fill="#aaaaff"/></svg>`,
  dk_clock: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" stroke="#8888aa" stroke-width="1.5" fill="#0a0a14"/><circle cx="16" cy="16" r="1.5" fill="#aaaacc"/><line x1="16" y1="6" x2="16" y2="12" stroke="#aaaacc" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="16" x2="22" y2="18" stroke="#888899" stroke-width="1.2" stroke-linecap="round"/><text x="16" y="26" text-anchor="middle" font-size="4.5" fill="#666688">33 YEARS</text></svg>`,

  // Stranger Things
  st_lights: `<svg viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10 Q12 4 24 10 Q36 16 44 10" stroke="#555" stroke-width="1" fill="none"/>${[4,12,20,28,36,44].map((x,i)=>`<circle cx="${x}" cy="${i%2===0?8:12}" r="2.5" fill="${['#ff2200','#00cc00','#ffee00','#0088ff','#ff4400','#cc00cc'][i]}" opacity=".9"/>`).join('')}</svg>`,
  st_eggo: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="26" height="26" rx="4" fill="#c8a020"/><line x1="16" y1="3" x2="16" y2="29" stroke="#a88010" stroke-width="1"/><line x1="3" y1="16" x2="29" y2="16" stroke="#a88010" stroke-width="1"/><rect x="5" y="5" width="10" height="10" rx="2" fill="#d4aa30" opacity=".5"/><rect x="17" y="5" width="10" height="10" rx="2" fill="#d4aa30" opacity=".5"/><rect x="5" y="17" width="10" height="10" rx="2" fill="#d4aa30" opacity=".5"/><rect x="17" y="17" width="10" height="10" rx="2" fill="#d4aa30" opacity=".5"/></svg>`,

  // Movies — Interstellar
  in_watch: `<svg viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="1" width="12" height="6" rx="2" fill="#333"/><rect x="8" y="33" width="12" height="6" rx="2" fill="#333"/><rect x="2" y="7" width="24" height="26" rx="5" fill="#222" stroke="#555" stroke-width="1"/><circle cx="14" cy="20" r="9" fill="#111" stroke="#444" stroke-width="1"/><line x1="14" y1="13" x2="14" y2="20" stroke="#888" stroke-width="1.2" stroke-linecap="round"/><line x1="14" y1="20" x2="19" y2="22" stroke="#666" stroke-width="1" stroke-linecap="round"/></svg>`,

  // Dune
  du_crysknife: `<svg viewBox="0 0 12 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2 L9 20 L9 34 L6 42 L3 34 L3 20 Z" fill="#e8d8b0" stroke="#c8b880" stroke-width=".8"/><rect x="3" y="32" width="6" height="10" rx="1.5" fill="#8B6914"/><line x1="6" y1="4" x2="6" y2="32" stroke="white" stroke-width=".5" opacity=".3"/></svg>`,
  du_spice: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="20" rx="12" ry="8" fill="#c86420"/><ellipse cx="16" cy="18" rx="12" ry="8" fill="#d47830"/><ellipse cx="16" cy="16" rx="12" ry="8" fill="#e08840"/><ellipse cx="16" cy="14" rx="10" ry="5" fill="#e89040" opacity=".8"/><ellipse cx="16" cy="13" rx="6" ry="2.5" fill="#f0a050" opacity=".5"/></svg>`,

  // Matrix
  mx_pill: `<svg viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="14" height="14" rx="7" fill="#cc0000"/><rect x="17" y="1" width="14" height="14" rx="7" fill="#1a1a1a" stroke="#444" stroke-width="1"/><rect x="15" y="5" width="2" height="6" fill="#888"/></svg>`,

  // Blade Runner
  br_origami: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="16,3 28,20 22,20 28,29 4,29 10,20 4,20" fill="#e8e0d0" stroke="#c8c0b0" stroke-width="1"/><line x1="16" y1="3" x2="16" y2="29" stroke="#c8c0b0" stroke-width=".8"/><line x1="4" y1="20" x2="28" y2="20" stroke="#c8c0b0" stroke-width=".8"/></svg>`,

  // Inception
  ic_totem: `<svg viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="28" rx="8" ry="4" fill="#888" opacity=".3"/><path d="M4 28 L10 4 L16 28 Z" fill="#aaa" stroke="#888" stroke-width="1"/><ellipse cx="10" cy="28" rx="6" ry="3" fill="#999"/><line x1="10" y1="6" x2="10" y2="28" stroke="white" stroke-width=".6" opacity=".25"/></svg>`,

  // Godfather
  gf_offer: `<svg viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 14 C4 8 10 4 16 6 C22 4 28 8 28 14 C28 20 22 24 16 24 C10 24 4 20 4 14Z" fill="#1a0a00" stroke="#4a2000" stroke-width="1"/><path d="M10 14 L14 18 L22 10" stroke="#c8a060" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  // F1
  f1rb_trophy: `<svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="32" width="12" height="4" rx="1" fill="#c8a820"/><rect x="6" y="36" width="20" height="3" rx="1" fill="#a88810"/><path d="M8 4 L8 24 Q8 32 16 32 Q24 32 24 24 L24 4 Z" fill="#f0c020"/><path d="M8 12 L4 14 L4 20 Q4 24 8 24" fill="#e0b018" stroke="#c89010" stroke-width=".8"/><path d="M24 12 L28 14 L28 20 Q28 24 24 24" fill="#e0b018" stroke="#c89010" stroke-width=".8"/><ellipse cx="16" cy="4" rx="8" ry="2" fill="#f8d030"/></svg>`,
  f1fe_horse: `<svg viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 28 C14 28 6 22 6 14 C6 8 10 4 14 4 C18 4 22 8 22 14 C22 22 14 28 14 28Z" fill="#ff2800"/><path d="M14 6 C14 6 10 10 10 14 L14 13 L18 14 C18 10 14 6 14 6Z" fill="#1a1a1a"/><path d="M12 14 L12 22 L14 24 L16 22 L16 14" fill="#1a1a1a" stroke="#ff2800" stroke-width=".5"/></svg>`,
  f1mc_papaya: `<svg viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="30" height="12" rx="3" fill="#ff8000"/><path d="M1 10 L8 4 L8 16 Z" fill="#1a1a1a"/><text x="16" y="13" text-anchor="middle" font-size="7" font-weight="bold" fill="white">McLAREN</text></svg>`,
};

// ── Token Shop UI ─────────────────────────────────────────────────────
let shopTab = 'tv';

function openShop() { buildShopUI(); openModal('shopOverlay'); }

function buildShopUI(tab?: string) {
  if (tab) shopTab = tab;
  const grid    = $('shopGrid');
  const tabsEl  = $('shopTabs');
  const tokenEl = $('shopTokenDisplay');
  if (!grid || !tabsEl) return;
  if (tokenEl) tokenEl.innerHTML = coinHTML(Shop.getTokens());

  // Shop tab bar
  const shopTabDefs: [string, string][] = [
    ['tv','📺 TV'], ['movie','🎬 Movies'], ['f1','🏎 F1'], ['nat','🌿 Special'],
  ];
  tabsEl.innerHTML = '';
  shopTabDefs.forEach(([id, label]) => {
    const b = document.createElement('button');
    b.className = 'shop-tab-btn' + (shopTab === id ? ' active' : '');
    b.textContent = label; b.dataset.tab = id;
    b.addEventListener('click', () => buildShopUI(id));
    tabsEl.appendChild(b);
  });

  const catThemes = shopTab === 'nat'
    ? THEMES_BY_CAT.nat.map(t => t.id)
    : THEMES_BY_CAT[shopTab as 'tv'|'movie'|'f1'].map(t => t.id);

  const items = Shop.SHOP_ITEMS.filter(i => catThemes.includes(i.themeId));
  const owned    = Shop.getOwned();
  const equipped = Shop.getEquipped();

  grid.innerHTML = '';
  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'shop-empty';
    empty.textContent = 'No items in this category yet.';
    grid.appendChild(empty); return;
  }

  // Group by theme
  const byTheme = new Map<string, typeof items>();
  items.forEach(item => {
    if (!byTheme.has(item.themeId)) byTheme.set(item.themeId, []);
    byTheme.get(item.themeId)!.push(item);
  });

  byTheme.forEach((themeItems, themeId) => {
    const theme = THEME_BY_ID[themeId];
    if (!theme) return;

    const section = document.createElement('div'); section.className = 'shop-section';
    const header  = document.createElement('div'); header.className = 'shop-section-header';
    header.style.borderColor = theme.accent + '44';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'shop-section-name';
    nameSpan.style.color = theme.accent;
    nameSpan.textContent = theme.name;
    header.appendChild(nameSpan);
    section.appendChild(header);

    const itemsGrid = document.createElement('div'); itemsGrid.className = 'shop-items-grid';
    themeItems.forEach(item => {
      const isOwned    = owned.has(item.id);
      const isEquipped = equipped.has(item.id);
      const card = document.createElement('div');
      card.className = ['shop-item', isOwned ? 'owned' : '', isEquipped ? 'equipped' : ''].filter(Boolean).join(' ');

      // Icon — use SVG art if available, else emoji
      const iconEl = document.createElement('div'); iconEl.className = 'shop-item-icon';
      const svgArt = SHOP_SVG[item.id];
      if (svgArt) iconEl.innerHTML = svgArt;        // SVG strings are developer-authored, safe
      else        iconEl.textContent = item.icon;   // emoji fallback

      const info = document.createElement('div'); info.className = 'shop-item-info';
      const nameEl = document.createElement('div'); nameEl.className = 'shop-item-name';
      nameEl.textContent = item.name;
      const descEl = document.createElement('div'); descEl.className = 'shop-item-desc';
      descEl.textContent = item.desc;
      info.append(nameEl, descEl);

      const action = document.createElement('div'); action.className = 'shop-item-action';

      if (isOwned) {
        const equipBtn = document.createElement('button');
        equipBtn.className = 'shop-equip-btn' + (isEquipped ? ' on' : '');
        equipBtn.textContent = isEquipped ? '✓ On' : 'Equip';
        equipBtn.addEventListener('click', () => { Shop.toggleEquip(item.id); buildShopUI(); });
        action.appendChild(equipBtn);
      } else {
        const buyBtn = document.createElement('button');
        buyBtn.className = 'shop-buy-btn';
        buyBtn.disabled = Shop.getTokens() < item.cost;
        const costSpan = document.createElement('span');
        costSpan.className = 'shop-cost';
        costSpan.textContent = `🪙 ${item.cost}`;
        buyBtn.appendChild(costSpan);
        buyBtn.addEventListener('click', () => {
          const result = Shop.buyItem(item.id);
          if (result === 'ok') { buildShopUI(); buildPanel(); }
          else if (result === 'poor') {
            card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 500);
          }
        });
        action.appendChild(buyBtn);
      }

      card.append(iconEl, info, action);
      itemsGrid.appendChild(card);
    });
    section.appendChild(itemsGrid);
    grid.appendChild(section);
  });
}

// ── Coin SVG — Apple-style gold coin ────────────────────────────────
const COIN_SVG = `<svg class="token-coin" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="coinGrad" cx="38%" cy="32%" r="65%">
      <stop offset="0%"   stop-color="#ffe566"/>
      <stop offset="45%"  stop-color="#f0b800"/>
      <stop offset="100%" stop-color="#c88000"/>
    </radialGradient>
    <radialGradient id="coinShine" cx="35%" cy="28%" r="50%">
      <stop offset="0%"   stop-color="white" stop-opacity=".45"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="10" cy="10" r="9.5" fill="#c88000"/>
  <circle cx="10" cy="10" r="9"   fill="url(#coinGrad)"/>
  <circle cx="10" cy="10" r="9"   fill="url(#coinShine)"/>
  <circle cx="10" cy="10" r="7.2" fill="none" stroke="#c88000" stroke-width=".6" opacity=".4"/>
  <text x="10" y="13.5" text-anchor="middle" font-size="8" font-weight="700"
        fill="#8b5500" font-family="system-ui,sans-serif" opacity=".9">S</text>
</svg>`;

function createCoinEl(count: number): HTMLElement {
  const wrap = document.createElement('span'); wrap.className = 'feat-tokens';
  wrap.innerHTML = COIN_SVG; // developer-authored SVG constant — safe
  const cnt = document.createElement('span'); cnt.className = 'token-count';
  cnt.textContent = String(count);
  wrap.appendChild(cnt);
  return wrap;
}

function coinHTML(count: number): string {
  return `${COIN_SVG}<span class="token-count">${count}</span>`;
}

// Award tokens on session events
function awardTokens(minutes: number) {
  const tokens = Math.max(1, Math.floor(minutes / 5));
  Shop.addTokens(tokens);

  // Animate +N tokens above the shop button
  const shopBtn = $('btnShop');
  if (shopBtn) {
    shopBtn.innerHTML = `🛒 Shop ${coinHTML(Shop.getTokens())}`;
    const pop = document.createElement('div');
    pop.className = 'token-pop';
    pop.textContent = `+${tokens}`;
    shopBtn.appendChild(pop);
    setTimeout(() => pop.remove(), 1200);
  }
  // Update open shop if visible
  const tokenEl = $('shopTokenDisplay');
  if (tokenEl) tokenEl.innerHTML = coinHTML(Shop.getTokens());
}

// ── QR Handoff ────────────────────────────────────────────────────────
function openQRHandoff() {
  const canvas = $<HTMLCanvasElement>('qrCanvas');
  const label  = $('qrLabel');
  const urlEl  = $('qrUrl');
  if (!canvas) return;

  // Build state URL
  const state: Record<string, string> = {
    theme: currentTheme.id,
    clock: clockMode,
  };
  if (sessionRunning) {
    state.ses = '1';
    state.elapsed = String(Math.round(performance.now() - sessionStart));
  }
  if (Pom.isActive()) {
    state.pom = '1';
    const s = Pom.getSettings();
    state.pw = String(s.workMins);
    state.pb = String(s.breakMins);
  }
  if (DOM.focusInput.value.trim()) {
    state.task = DOM.focusInput.value.trim().slice(0, 30);
  }

  const params = new URLSearchParams(state).toString();
  const url = `${location.origin}${location.pathname}?${params}`;

  if (urlEl) {
    urlEl.textContent = url.length > 60 ? url.slice(0, 57) + '…' : url;
  }

  // Draw QR using theme colours
  const fg = currentTheme.text;
  const bg = currentTheme.baseBg[1] ?? currentTheme.baseBg[0];
  drawQR(canvas, url, fg, bg);

  if (label) label.textContent = url.length > 77
    ? 'URL too long for QR — shorten task name'
    : 'Scan to continue this session on another device';

  openModal('qrOverlay');
}

// Read handoff state from URL on load
function applyHandoffState() {
  const p = new URLSearchParams(location.search);
  if (!p.has('theme') && !p.has('ses')) return;
  const themeId = p.get('theme');
  if (themeId && THEME_BY_ID[themeId]) applyTheme(THEME_BY_ID[themeId], true);
  const cm = p.get('clock') as ClockMode | null;
  if (cm) { setClockMode(cm); updateClockCanvas(); }
  const task = p.get('task');
  if (task) { DOM.focusInput.value = task; }
  if (p.get('ses') === '1') {
    const elapsed = parseInt(p.get('elapsed') ?? '0');
    sessionElapsed = elapsed;
    setTimeout(() => DOM.btnStart.click(), 800); // auto-resume
  }
  // Clean URL
  history.replaceState({}, '', location.pathname);
}

// ── Animedoro mode ────────────────────────────────────────────────────
let animedoroActive = false;
let theaterTimer: number | null = null;
let theaterRemainMs = 20 * 60_000;

function startAnimedoro() {
  // 50 min work / 20 min theater break variant
  Pom.updateSettings({ workMins: 50, breakMins: 20 });
  animedoroActive = true;
  if (!Pom.isActive()) {
    Pom.toggle();
    buildPomUI();
  }
}

function triggerTheaterMode(breakMins: number) {
  const overlay = document.getElementById('theaterOverlay');
  const timerEl = document.getElementById('theaterTimer');
  const minEl   = document.getElementById('theaterMinutes');
  if (!overlay) return;

  theaterRemainMs = breakMins * 60_000;
  if (minEl) minEl.textContent = String(breakMins);
  overlay.classList.add('visible');

  const tick = () => {
    theaterRemainMs -= 1000;
    if (timerEl) {
      const m = Math.floor(theaterRemainMs / 60000);
      const s = Math.floor((theaterRemainMs % 60000) / 1000);
      timerEl.textContent = `${p2(m)}:${p2(s)}`;
    }
    if (theaterRemainMs <= 0) {
      overlay.classList.remove('visible');
      if (theaterTimer) clearInterval(theaterTimer);
    }
  };
  if (theaterTimer) clearInterval(theaterTimer);
  theaterTimer = window.setInterval(tick, 1000);

  const skipBtn = document.getElementById('theaterSkip');
  if (skipBtn) skipBtn.onclick = () => {
    overlay.classList.remove('visible');
    if (theaterTimer) clearInterval(theaterTimer);
  };
}

function updatePanelHeight() {
  const panel = $('themePanel');
  if (!panel) return;
  const h = panel.offsetHeight;
  document.documentElement.style.setProperty('--panel-h', h + 'px');
}

// ── Info strip — intelligence-powered ────────────────────────────────
const BASE_INFO_ITEMS = [
  () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
    const weekNum = Math.ceil(dayOfYear / 7);
    return `Week ${weekNum} · Day ${dayOfYear} of ${now.getFullYear()}`;
  },
  () => {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    const daysLeft = Math.ceil((endOfYear.getTime() - now.getTime()) / 86400000);
    return `${daysLeft} days left in ${now.getFullYear()}`;
  },
  () => {
    const now = new Date();
    const pct = ((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400 * 100).toFixed(1);
    return `${pct}% of today complete`;
  },
];

function getAllInfoItems(): Array<() => string> {
  return [...Intel.getIntelligenceInsights(), ...BASE_INFO_ITEMS];
}

let infoIdx = 0;
function rotateInfo() {
  const slide = DOM.infoSlide;
  const label = DOM.infoLabel;
  if (!slide || !label) return;
  slide.classList.add('leaving');
  setTimeout(() => {
    const items = getAllInfoItems();
    infoIdx = (infoIdx + 1) % items.length;
    label.textContent = items[infoIdx]();
    slide.classList.remove('leaving');
    slide.style.animation = 'none';
    void slide.offsetWidth;
    slide.style.animation = '';
  }, 420);
}

// ── Clock canvas/DOM manager ──────────────────────────────────────────
function updateClockCanvas() {
  const block = document.getElementById('clock-block-wrap');
  if (!block) return;
  block.dataset.mode = clockMode;

  // Remove all existing alt clock elements
  ['analogueClock','flipClockWrap','wordClockGrid','minimalClockWrap','segmentClock'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });

  // Show/hide digital clock row
  const digitalRow = document.querySelector<HTMLElement>('.clock-row');
  if (digitalRow) digitalRow.style.display = (clockMode === 'digital') ? '' : 'none';
  const ampmStack = document.querySelector<HTMLElement>('.ampm-stack');
  if (ampmStack) ampmStack.style.display = (clockMode === 'digital') ? '' : 'none';

  if (clockMode === 'analogue') {
    const canvas = document.createElement('canvas');
    canvas.id = 'analogueClock';
    const sz = Math.min(Math.min(window.innerWidth * 0.65, window.innerHeight * 0.38), 340);
    canvas.width = canvas.height = sz;
    block.appendChild(canvas);

  } else if (clockMode === 'flip') {
    const wrap = document.createElement('div');
    wrap.id = 'flipClockWrap'; wrap.className = 'flip-clock-wrap';
    ['Hr','Min','Sec'].forEach((part, i) => {
      if (i > 0) { const sep = document.createElement('span'); sep.className = 'flip-sep'; sep.textContent = ':'; wrap.appendChild(sep); }
      const card = document.createElement('div');
      card.id = `flip${part}`; card.className = 'flip-card';
      card.innerHTML = `<div class="flip-top">00</div><div class="flip-bot">00</div><div class="flip-top-back">00</div>`;
      wrap.appendChild(card);
    });
    block.appendChild(wrap);

  } else if (clockMode === 'word') {
    const grid = document.createElement('div');
    grid.id = 'wordClockGrid'; grid.className = 'word-clock-grid';
    block.appendChild(grid);
    wordPrevKey = ''; // force redraw

  } else if (clockMode === 'minimal') {
    const wrap = document.createElement('div');
    wrap.id = 'minimalClockWrap'; wrap.className = 'minimal-clock-wrap';
    wrap.innerHTML = `<span id="minimalHr" class="minimal-hr">--</span><span id="minimalAP" class="minimal-ap">AM</span>`;
    block.appendChild(wrap);

  } else if (clockMode === 'segment') {
    const canvas = document.createElement('canvas');
    canvas.id = 'segmentClock';
    canvas.width = Math.min(window.innerWidth * 0.88, 520);
    canvas.height = 110;
    block.appendChild(canvas);
  }
}

function startInfoStrip() {
  const items0 = getAllInfoItems();
  if (DOM.infoLabel) DOM.infoLabel.textContent = items0[0]();
  setInterval(rotateInfo, 6000);
}

// ── Parallax depth ────────────────────────────────────────────────────
let parallaxX = 0, parallaxY = 0;
let targetPX = 0, targetPY = 0;
const PARALLAX_STRENGTH = 18; // max px offset

window.addEventListener('mousemove', e => {
  targetPX = (e.clientX / window.innerWidth  - 0.5) * PARALLAX_STRENGTH;
  targetPY = (e.clientY / window.innerHeight - 0.5) * PARALLAX_STRENGTH;
});

// Gyroscope for mobile
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', e => {
    if (e.gamma != null && e.beta != null) {
      targetPX = Math.max(-PARALLAX_STRENGTH, Math.min(PARALLAX_STRENGTH, e.gamma / 2));
      targetPY = Math.max(-PARALLAX_STRENGTH, Math.min(PARALLAX_STRENGTH, (e.beta - 45) / 2));
    }
  });
}

// ── Cross-tab BroadcastChannel sync ───────────────────────────────────
const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('sc_sync') : null;

function bcBroadcast(type: string, payload: Record<string, unknown> = {}) {
  bc?.postMessage({ type, ...payload });
}

if (bc) {
  bc.onmessage = (e) => {
    const { type } = e.data;
    if (type === 'theme')   applyTheme(THEME_BY_ID[e.data.id] ?? currentTheme, true);
    if (type === 'session') {
      if (e.data.running && !sessionRunning) DOM.btnStart.click();
      if (!e.data.running && sessionRunning)  DOM.btnStart.click();
    }
    if (type === 'pom_phase') {
      // Mirror phase label across tabs
      if (DOM.pomPill) DOM.pomPill.textContent = e.data.pill;
    }
  };
}

// ── Flow State UI ─────────────────────────────────────────────────────
let flowUIActive = false;
const FLOW_BADGE_ID = 'flowBadge';

function updateFlowState() {
  const isFlow = Intel.checkFlowState(sessionRunning);
  if (isFlow === flowUIActive) return;
  flowUIActive = isFlow;

  if (isFlow) {
    // Collapse panel, deepen vignette
    DOM.themePanel.classList.add('collapsed');
    updateRevealBtn();
    document.body.classList.add('flow-state');
    // Show flow badge
    let badge = document.getElementById(FLOW_BADGE_ID);
    if (!badge) {
      badge = document.createElement('div');
      badge.id = FLOW_BADGE_ID;
      badge.className = 'flow-badge';
      document.body.appendChild(badge);
    }
    badge.textContent = '⚡ Flow State';
    badge.classList.add('visible');
  } else {
    document.body.classList.remove('flow-state');
    const badge = document.getElementById(FLOW_BADGE_ID);
    if (badge) badge.classList.remove('visible');
  }
}

// Intercept theme panel open as flow interrupt
const _origFocusLockIntercept = focusLockIntercept;

// ── Smart Break Suggester ─────────────────────────────────────────────
let breakBadgeShown = false;

function checkSmartBreak() {
  if (!Intel.checkBreakNeeded(sessionRunning)) return;
  if (breakBadgeShown) return;
  breakBadgeShown = true;

  const pill = document.querySelector<HTMLElement>('.sync-pill');
  if (!pill) return;
  pill.classList.add('break-hint');
  pill.title = 'You\'ve been focused for 90+ minutes — consider a short break';
  setTimeout(() => { pill.classList.remove('break-hint'); breakBadgeShown = false; }, 30_000);
}

// ── Sound Preset Saving ───────────────────────────────────────────────
interface SoundPreset { name: string; tracks: Record<string, number>; master: number; }
const PRESETS_KEY = 'sc_sound_presets';

function getSoundPresets(): SoundPreset[] {
  try { return JSON.parse(localStorage.getItem(PRESETS_KEY) || '[]'); } catch { return []; }
}

function saveSoundPreset(name: string) {
  const presets = getSoundPresets();
  const tracks: Record<string, number> = {};
  Sound.SOUNDS.forEach(s => { tracks[s.id] = Sound.getTrackVolume(s.id); });
  const preset: SoundPreset = { name, tracks, master: Sound.getMasterVolume() };
  // Replace existing with same name, otherwise add
  const idx = presets.findIndex(p => p.name === name);
  if (idx >= 0) presets[idx] = preset; else presets.push(preset);
  if (presets.length > 5) presets.shift();
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

function loadSoundPreset(preset: SoundPreset) {
  Sound.setMasterVolume(preset.master);
  Sound.SOUNDS.forEach(s => {
    const vol = preset.tracks[s.id];
    if (vol !== undefined) Sound.setTrackVolume(s.id, vol);
  });
  buildSoundUI();
}

// ── Custom Wallpaper Theme ────────────────────────────────────────────
function initWallpaperDrop() {
  document.addEventListener('dragover', e => e.preventDefault());
  document.addEventListener('drop', e => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        // Sample 16×16 thumbnail for dominant colour
        const cv = document.createElement('canvas'); cv.width = cv.height = 16;
        const ctx = cv.getContext('2d')!;
        ctx.drawImage(img, 0, 0, 16, 16);
        const px = ctx.getImageData(0, 0, 16, 16).data;
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < px.length; i += 4) {
          // Skip very dark or very bright pixels
          const luma = 0.299 * px[i]! + 0.587 * px[i+1]! + 0.114 * px[i+2]!;
          if (luma < 20 || luma > 235) continue;
          r += px[i]!; g += px[i+1]!; b += px[i+2]!; n++;
        }
        if (n === 0) return;
        r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n);
        const accent = `#${[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}`;

        // Generate wallpaper-based theme
        const wallTheme = {
          ...currentTheme,
          id: 'wallpaper',
          name: 'Wallpaper',
          accent, accent2: lightenHex(accent, 0.3),
          btnBg: accent + '22', btnFg: '#ffffff',
          glow: `0 0 55px ${accent}44`,
          hdr: true,
          baseBg: [darkenHex2(accent, 0.9), darkenHex2(accent, 0.85), darkenHex2(accent, 0.92)],
        };

        // Set wallpaper as CSS background
        document.body.style.backgroundImage = `url('${ev.target?.result as string}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.getElementById('overlay')!.style.background = 'rgba(0,0,0,0.55)';

        applyTheme(wallTheme as typeof currentTheme, true);
        showToast('Wallpaper theme applied! Drop a new image to change.');
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function lightenHex(hex: string, amt: number): string {
  if (!hex.startsWith('#')) return hex;
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 0xff) + 255 * amt));
  const g = Math.min(255, Math.round(((n >> 8)  & 0xff) + 255 * amt));
  const b = Math.min(255, Math.round(( n        & 0xff) + 255 * amt));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function darkenHex2(hex: string, amt: number): string {
  if (!hex.startsWith('#')) return hex;
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.round(((n >> 16) & 0xff) * (1 - amt)));
  const g = Math.max(0, Math.round(((n >> 8)  & 0xff) * (1 - amt)));
  const b = Math.max(0, Math.round(( n        & 0xff) * (1 - amt)));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ── Toast notifications ───────────────────────────────────────────────
function showToast(msg: string, duration = 3500) {
  const existing = document.getElementById('scToast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'scToast'; toast.className = 'sc-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ── Share focus card ──────────────────────────────────────────────────
function openShareCard() {
  const log = (() => { try { return JSON.parse(localStorage.getItem('sc_focus_log') || '[]'); } catch { return []; } })();
  const today = new Date().toDateString();
  const todayMs = (log as Array<{date:string;dur:number}>).filter(e => e.date === today).reduce((s, e) => s + e.dur, 0);
  const todayMins = Math.max(1, Math.floor(todayMs / 60000));

  generateShareCard({
    themeName:    currentTheme.name,
    accentColor:  currentTheme.accent,
    bgColor:      currentTheme.baseBg[0],
    textColor:    currentTheme.text,
    glow:         currentTheme.glow,
    focusMinutes: todayMins,
    taskName:     DOM.focusInput.value.trim(),
    streakDays:   Intel.getStreak().current,
    date:         new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  });
  showToast('Focus card saved to your downloads!');
}

// ── Service Worker registration ───────────────────────────────────────
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {/* silent */});
  }
}

// ── Theme flash on switch ─────────────────────────────────────────────
function flashTheme() {
  document.body.classList.remove('theme-flash');
  void document.body.offsetWidth;
  document.body.classList.add('theme-flash');
  setTimeout(() => document.body.classList.remove('theme-flash'), 500);
}

// ── Init ───────────────────────────────────────────────────────────────
function init() {
  resize();
  window.addEventListener('resize', () => { resize(); updatePanelHeight(); });
  buildPanel();
  updatePanelHeight();
  updateClockCanvas();
  startInfoStrip();
  initWallpaperDrop();
  registerSW();

  // Drag-over visual feedback
  document.addEventListener('dragenter', () => document.body.classList.add('drag-over'));
  document.addEventListener('dragleave', e => { if (!e.relatedTarget) document.body.classList.remove('drag-over'); });
  document.addEventListener('drop', () => document.body.classList.remove('drag-over'));

  // PWA install prompt
  let deferredInstall: Event | null = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredInstall = e;
    const btn = document.createElement('button');
    btn.id = 'pwaInstallBtn'; btn.className = 'show';
    btn.innerHTML = '⬇ Install App';
    btn.addEventListener('click', () => {
      (deferredInstall as any)?.prompt?.();
      btn.remove(); deferredInstall = null;
    });
    document.body.appendChild(btn);
  });

  const kbBtn = $('btnKbShortcuts');
  if (kbBtn) kbBtn.addEventListener('click', () => openModal('kbOverlay'));

  const topbarThemesBtn = $('topbarThemesBtn');
  if (topbarThemesBtn) {
    topbarThemesBtn.addEventListener('click', () => {
      focusLockIntercept(() => {
        DOM.themePanel.classList.toggle('collapsed');
        updateRevealBtn();
      });
    });
  }

  const lastId = localStorage.getItem('sc_last_theme');
  applyTheme(lastId && THEME_BY_ID[lastId] ? THEME_BY_ID[lastId] : THEMES[0], true);
  applyHandoffState();

  // Smart break + flow state tick every 60s
  setInterval(() => {
    updateFlowState();
    checkSmartBreak();
  }, 60_000);

  requestAnimationFrame(ts => { lastTs = ts; renderFrame(ts); });

  if (!privacyMode) {
    syncTime();
    initWeather($('weatherIcon'), $('weatherText'), $('weatherPill'), isPrivacyMode);
  } else {
    updateSyncDisplay('failed');
  }
}

init();
