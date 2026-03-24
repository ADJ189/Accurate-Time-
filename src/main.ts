import type { Theme } from './types';
import type { ClockMode } from './types';
import { THEMES, THEME_BY_ID, NAT_QUOTES } from './themes';
import { LIT_CLOCK } from './litclock';
import { p2, p3, fmtSession, DAYS, MONTHS, GREETS } from './utils';
import { clockOffset, synced, syncTime, setSyncHandler } from './timesync';
import { initWeather, stopWeather } from './weather';
import * as Sound from './sound';
import * as Pom from './pomodoro';
import * as Log from './focuslog';
import { resize, buildParticles, drawBg, runTransition, setBreathing, setParallax, invalidateCache } from './renderer';
import { drawQR } from './qr';
import * as Shop from './shop';
import * as Intel from './intelligence';
import { generateShareCard } from './share';
import { initPerf, getTier, setTier, tickFps, getFps } from './perf';
import type { QualityTier } from './perf';
import * as APIs from './apis';
import * as Privacy from './privacy';
import * as Easter from './easter';
import { triggerKeyword } from './easter';
// ── UI modules ────────────────────────────────────────────────────────
import { $, openModal, closeModal, initModalClickOutside } from './ui/modals';
import { openLog, initLogUI, switchLogTab } from './ui/log-ui';
import { initSoundUI, buildSoundUI } from './ui/sound-ui';
import { openThemeBuilder, initThemeBuilder, previewCustomTheme } from './ui/theme-builder';
import { openShop, buildShopUI, awardTokens, coinHTML } from './ui/shop-ui';
import { buildPanel, initPanel, setCurrentThemeId } from './ui/panel';
import { openSettings, initSettings } from './ui/settings';
// ── Svelte command palette ─────────────────────────────────────────────
import CommandPalette from './ui/CommandPalette.svelte';

export type { ClockMode };

// ── Clock mode ────────────────────────────────────────────────────────
let clockMode: ClockMode = (localStorage.getItem('sc_clock_mode') as ClockMode) || 'digital';
function setClockMode(m: ClockMode) {
  clockMode = m;
  localStorage.setItem('sc_clock_mode', m);
  document.querySelectorAll('.clock-mode-btn').forEach(b =>
    (b as HTMLElement).classList.toggle('active', (b as HTMLElement).dataset.mode === m)
  );
}

// ── Cached DOM refs ───────────────────────────────────────────────────
const DOM = {
  digitHr:        $('digitHr'),
  digitMin:       $('digitMin'),
  digitSec:       $('digitSec'),
  timeDis:        $('timeDis'),
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

// ── Session timer ─────────────────────────────────────────────────────
let sessionRunning = false;
let sessionStart   = 0;
let sessionElapsed = 0;

function startTimer() {
  sessionRunning = true;
  sessionStart   = performance.now() - sessionElapsed;
  DOM.btnStart.textContent = 'Pause';
  DOM.focusInputWrap.classList.add('visible');
  if (Pom.isActive()) Pom.onStart();
  Intel.onSessionStart();
  Intel.onFlowInterrupt();
  bcBroadcast('session', { running: true });
  APIs.requestNotifications();
  APIs.acquireWakeLock();
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
    const streak    = Intel.updateStreak();
    const milestone = Intel.getStreakMilestone(streak.current);
    if (milestone) showToast(milestone);
    Intel.onBreakTaken();
  } else if (dur > 5_000) {
    Intel.recordAbandoned();
  }
  Intel.onFlowInterrupt();
  sessionRunning = false; sessionStart = sessionElapsed = 0;
  DOM.btnStart.textContent = 'Start';
  DOM.sTmr.textContent     = '00:00:00';
  DOM.focusInputWrap.classList.remove('visible');
  DOM.focusInput.value = '';
  if (Pom.isActive()) Pom.reset();
  bcBroadcast('session', { running: false });
}

DOM.btnStart.addEventListener('click', () => sessionRunning ? pauseTimer() : startTimer());
DOM.btnReset.addEventListener('click', resetTimer);

// ── Privacy ───────────────────────────────────────────────────────────
let privacyMode           = localStorage.getItem('sc_privacy') === '1';
let breathingBreakEnabled = localStorage.getItem('sc_breathing_break') !== '0';
function isPrivacyMode() { return privacyMode; }

function togglePrivacy() {
  privacyMode = !privacyMode;
  localStorage.setItem('sc_privacy', privacyMode ? '1' : '0');
  if (privacyMode) {
    updateSyncDisplay('failed'); stopWeather();
    const wp = $('weatherPill'); if (wp) wp.classList.remove('loaded');
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';
    showToast('🔒 Privacy Mode: fonts, weather & sync disabled');
  } else {
    syncTime();
    initWeather($('weatherIcon'), $('weatherText'), $('weatherPill'), isPrivacyMode);
    document.body.style.fontFamily = '';
    showToast('Privacy Mode off — reconnected');
  }
  document.getElementById('togglePrivacyS')?.classList.toggle('on', privacyMode);
}

// ── Data panel ────────────────────────────────────────────────────────
function openDataPanel() { buildDataPanel(); openModal('dataOverlay'); }

function buildDataPanel() {
  const el = $('dataContent'); if (!el) return;
  el.innerHTML = '';
  const summary = document.createElement('div'); summary.className = 'data-summary';
  const totalEl = document.createElement('p');   totalEl.className  = 'data-total';
  totalEl.textContent = `Total stored: ${Privacy.formatBytes(Privacy.getTotalSize())} — all on your device, never sent anywhere.`;
  summary.appendChild(totalEl);

  // Incognito row
  const incogRow = document.createElement('div'); incogRow.className = 'settings-row';
  const incogInfo = document.createElement('div'); incogInfo.className = 'settings-row-info';
  const incogLbl = document.createElement('span'); incogLbl.className = 'settings-row-label'; incogLbl.textContent = '🕵 Incognito Sessions';
  const incogDesc = document.createElement('span'); incogDesc.className = 'settings-row-desc'; incogDesc.textContent = 'Sessions run in memory only — nothing written to storage';
  incogInfo.append(incogLbl, incogDesc);
  const incogToggle = document.createElement('button'); incogToggle.className = 'settings-toggle' + (Privacy.isIncognito() ? ' on' : '');
  incogToggle.addEventListener('click', () => { Privacy.setIncognito(!Privacy.isIncognito()); incogToggle.classList.toggle('on', Privacy.isIncognito()); showToast(Privacy.isIncognito() ? '🕵 Incognito mode on' : 'Incognito mode off'); });
  incogRow.append(incogInfo, incogToggle); summary.appendChild(incogRow);

  // Auto-clear row
  const clearRow = document.createElement('div'); clearRow.className = 'settings-row';
  const clearInfo = document.createElement('div'); clearInfo.className = 'settings-row-info';
  const clearLbl = document.createElement('span'); clearLbl.className = 'settings-row-label'; clearLbl.textContent = '🗑 Auto-Clear on Close';
  const clearDesc = document.createElement('span'); clearDesc.className = 'settings-row-desc'; clearDesc.textContent = 'Wipe session log & focus data when you close the tab';
  clearInfo.append(clearLbl, clearDesc);
  const clearToggle = document.createElement('button'); clearToggle.className = 'settings-toggle' + (Privacy.isAutoClear() ? ' on' : '');
  clearToggle.addEventListener('click', () => { Privacy.setAutoClear(!Privacy.isAutoClear()); clearToggle.classList.toggle('on', Privacy.isAutoClear()); showToast(Privacy.isAutoClear() ? 'Auto-clear enabled' : 'Auto-clear disabled'); });
  clearRow.append(clearInfo, clearToggle); summary.appendChild(clearRow);
  el.appendChild(summary);

  const catTitle = document.createElement('div'); catTitle.className = 'settings-section-title'; catTitle.textContent = 'Data Categories';
  el.appendChild(catTitle);

  Privacy.DATA_CATEGORIES.forEach(cat => {
    const size = Privacy.getCategorySize(cat);
    const row  = document.createElement('div'); row.className = 'data-cat-row';
    const left = document.createElement('div'); left.className = 'data-cat-info';
    const icon = document.createElement('span'); icon.className = 'data-cat-icon'; icon.textContent = cat.icon;
    const info = document.createElement('div');
    const name = document.createElement('span'); name.className = 'data-cat-name'; name.textContent = cat.label;
    if (cat.sensitive) { const b = document.createElement('span'); b.className = 'data-sensitive-badge'; b.textContent = 'Personal'; name.appendChild(b); }
    const desc = document.createElement('span'); desc.className = 'data-cat-desc'; desc.textContent = cat.desc;
    info.append(name, desc); left.append(icon, info);
    const right  = document.createElement('div');  right.className  = 'data-cat-right';
    const sizeEl = document.createElement('span'); sizeEl.className = 'data-cat-size'; sizeEl.textContent = size > 0 ? Privacy.formatBytes(size) : 'empty';
    const delBtn = document.createElement('button'); delBtn.className = 'data-del-btn'; delBtn.textContent = 'Clear'; delBtn.disabled = size === 0;
    delBtn.addEventListener('click', () => { if (!confirm(`Clear "${cat.label}"?`)) return; Privacy.deleteCategory(cat); showToast(`${cat.icon} ${cat.label} cleared`); buildDataPanel(); });
    right.append(sizeEl, delBtn); row.append(left, right); el.appendChild(row);
  });

  const actions   = document.createElement('div'); actions.className = 'data-actions';
  const exportBtn = document.createElement('button'); exportBtn.className = 'btn btn-ghost'; exportBtn.textContent = '⬇ Export All Data';
  exportBtn.addEventListener('click', () => { Privacy.exportAllData(); showToast('Data exported as JSON'); });
  const nukeBtn = document.createElement('button'); nukeBtn.className = 'btn btn-ghost data-nuke-btn'; nukeBtn.textContent = '🗑 Delete Everything';
  nukeBtn.addEventListener('click', () => { if (!confirm('Delete ALL Session Clock data?')) return; Privacy.deleteAll(); showToast('All data deleted'); buildDataPanel(); });
  actions.append(exportBtn, nukeBtn); el.appendChild(actions);
}

// ── Focus lock ────────────────────────────────────────────────────────
let focusLockEnabled  = localStorage.getItem('sc_focus_lock') === '1';
let focusLockTimer: number | null = null;
let focusLockBar: HTMLElement | null = null;

function isFocusLocked() { return focusLockEnabled && Pom.isActive() && sessionRunning; }

function focusLockIntercept(action: () => void) {
  if (!isFocusLocked()) { action(); return; }
  if (focusLockTimer !== null) {
    clearTimeout(focusLockTimer); focusLockTimer = null;
    if (focusLockBar) { focusLockBar.remove(); focusLockBar = null; }
    action(); return;
  }
  const bar  = document.createElement('div'); bar.className  = 'focus-lock-bar';
  const fill = document.createElement('div'); fill.className = 'focus-lock-fill';
  const lbl  = document.createElement('span'); lbl.className = 'focus-lock-label'; lbl.textContent = 'Stay focused… click again to open';
  bar.append(fill, lbl); document.body.appendChild(bar); focusLockBar = bar;
  requestAnimationFrame(() => { fill.style.transition = 'width 3s linear'; fill.style.width = '100%'; });
  focusLockTimer = window.setTimeout(() => {
    if (focusLockBar) { focusLockBar.remove(); focusLockBar = null; }
    focusLockTimer = null; action();
  }, 3000);
}

function toggleFocusLock() {
  focusLockEnabled = !focusLockEnabled;
  localStorage.setItem('sc_focus_lock', focusLockEnabled ? '1' : '0');
}

// ── Current theme ─────────────────────────────────────────────────────
let currentTheme: Theme = THEMES[0]!;
const root   = document.documentElement;
const cssVar = (name: string, val: string) => root.style.setProperty(name, val);

function applyTheme(theme: Theme, instant = false) {
  const doApply = () => {
    currentTheme = theme;
    setCurrentThemeId(theme.id);
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
    cssVar('--btn-radius', theme.isMedia ? '3px' : '99px');
    cssVar('--lb-h', (theme.isMedia && theme.lb) ? '3.8vh' : '0px');
    document.body.classList.toggle('light-theme', !!theme.light);
    document.body.className = document.body.className.replace(/\btheme-\S+/g, '').trim();
    document.body.classList.add(`theme-${theme.id}`);
    $('overlay').style.background  = theme.overlay  === 'none' ? '' : theme.overlay;
    $('vignette').style.background = theme.vignette === 'none' ? '' : theme.vignette;
    ($('scanlines') as HTMLElement).style.opacity = theme.scanlines ? '1' : '0';
    const grainEl = $('grain');
    grainEl.style.opacity = theme.grain ? '0.25' : '0';
    if (theme.grain) grainEl.style.backgroundImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`;
    const hdrEl = $('hdrBloom');
    if (theme.hdr) { hdrEl.style.background = `radial-gradient(ellipse at 50% 50%,${theme.accent}09 0%,transparent 65%)`; hdrEl.style.opacity = '1'; }
    else hdrEl.style.opacity = '0';
    if (theme.isMedia && theme.tagline) { DOM.showBadge.textContent = theme.tagline; DOM.showBadge.classList.add('visible'); }
    else DOM.showBadge.classList.remove('visible');
    if (theme.id === 'literary') {
      DOM.quoteText.style.fontFamily = "'Lora',serif";
      DOM.quoteText.style.fontSize   = 'clamp(.75rem,1.4vw,.95rem)';
      DOM.litMeta.style.display      = 'block';
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
    if (theme.id === 'commonroom') setTimeout(() => Sound.autoStartCommonRoom(), 400);
    updateClockCanvas();
  };
  if (instant || !theme.isMedia) { doApply(); if (!instant) flashTheme(); return; }
  runTransition(theme.transition ?? 'defaultFade', doApply);
}

// ── Sync display ──────────────────────────────────────────────────────
function updateSyncDisplay(state: 'syncing' | 'ok' | 'failed', rtt?: number) {
  if (!DOM.syncDot) return;
  if (state === 'syncing') { DOM.syncDot.style.background = '#f59e0b'; DOM.syncLabel.textContent = 'Syncing…'; }
  else if (state === 'ok') {
    DOM.syncDot.style.background = currentTheme.accent;
    DOM.syncLabel.textContent = `Synced · ±${Math.abs(Math.round(clockOffset))}ms${rtt != null ? ` · ${Math.round(rtt)}ms RTT` : ''}`;
  } else { DOM.syncDot.style.background = '#ef4444'; DOM.syncLabel.textContent = 'Local clock'; }
}
setSyncHandler(updateSyncDisplay);

// ── Render loop ───────────────────────────────────────────────────────
let lastTs = 0, lastSec = -1, lastQKey = '';

function tickDigit(el: HTMLElement, val: string) {
  if (el.textContent === val) return;
  el.classList.remove('tick'); void el.offsetWidth; el.textContent = val; el.classList.add('tick');
}

function renderFrame(ts: number) {
  requestAnimationFrame(renderFrame);
  const dt = Math.min((ts - lastTs) / 1000, 0.05); lastTs = ts;
  tickFps(ts);
  const tier = getTier();
  const parallaxEnabled = localStorage.getItem('sc_parallax') !== '0' && !document.body.classList.contains('reduced-motion');
  if (tier !== 'low' && parallaxEnabled) {
    parallaxX += (targetPX - parallaxX) * 0.06; parallaxY += (targetPY - parallaxY) * 0.06;
    setParallax(parallaxX, parallaxY);
  } else { setParallax(0, 0); }
  drawBg(dt, currentTheme);
  if (tier !== 'low') Sound.tickSpatial(ts / 1000);

  const now   = new Date(Date.now() + clockOffset);
  const ms    = now.getMilliseconds(), sec = now.getSeconds(), min = now.getMinutes(), hr = now.getHours();
  const hr12  = hr % 12 || 12;
  const hrStr = p2(hr12), minStr = p2(min), secStr = p2(sec);

  switch (clockMode) {
    case 'analogue': renderAnalogue(hr, min, sec, ms);   break;
    case 'flip':     renderFlip(hrStr, minStr, secStr);  break;
    case 'word':     renderWord(hr, min);                break;
    case 'minimal':  renderMinimal(hr12, hr);            break;
    case 'segment':  renderSegment(hrStr, minStr, secStr); break;
    default:
      tickDigit(DOM.digitHr,  hrStr);
      tickDigit(DOM.digitMin, minStr);
      tickDigit(DOM.digitSec, secStr);
      DOM.ampmDis.textContent = hr >= 12 ? 'PM' : 'AM';
      DOM.secMs.textContent   = '.' + p3(ms);
  }
  if (currentTheme.id === 'smpte' && clockMode === 'digital') DOM.secMs.textContent = ':' + p2(Math.floor(ms / (1000/24)) % 24);
  if (currentTheme.id === 'terminal' && clockMode === 'digital') tickDigit(DOM.digitHr, p2(hr));
  DOM.timeDis.textContent = `${hrStr}:${minStr}:${secStr}`;
  const dp = ((hr * 3600 + min * 60 + sec) * 1000 + ms) / 864e5 * 100;
  DOM.pFill.style.width = dp.toFixed(4) + '%';
  if (sessionRunning) {
    if (Pom.isActive()) Pom.tick(performance.now());
    else DOM.sTmr.textContent = fmtSession(performance.now() - sessionStart);
  }
  if (sec !== lastSec) {
    lastSec = sec;
    (window as any).__checkMidnight?.();
    const uh = now.getUTCHours(), um = now.getUTCMinutes(), us = now.getUTCSeconds();
    DOM.utcPill.textContent = Easter.isSiderealMode()
      ? Easter.getSiderealTime((window as any).__scLat ?? 0)
      : `UTC ${p2(uh)}:${p2(um)}:${p2(us)}`;
    DOM.dateDis.textContent  = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    DOM.greeting.textContent = GREETS.find(([s, e]) => hr >= s && hr < e)?.[2] ?? '';
    DOM.dayPct.textContent   = dp.toFixed(1) + '%';
    if (currentTheme.id === 'literary') {
      const key = p2(hr) + ':' + p2(Math.floor(min / 5) * 5);
      if (key !== lastQKey) {
        lastQKey = key;
        const entry = LIT_CLOCK[key];
        if (entry) { DOM.quoteText.style.opacity = '0'; setTimeout(() => { DOM.quoteText.textContent = `"${entry.quote}"`; DOM.litMeta.textContent = entry.source; DOM.quoteText.style.opacity = '.55'; }, 400); }
      }
    } else {
      const qs  = currentTheme.quotes?.length ? currentTheme.quotes : NAT_QUOTES;
      const qi  = (((hr * 60 + min) / 5) | 0) % qs.length;
      const qKey = String(qi);
      if (qKey !== lastQKey) { lastQKey = qKey; DOM.quoteText.style.opacity = '0'; setTimeout(() => { DOM.quoteText.textContent = `"${qs[qi]}"`; DOM.quoteText.style.opacity = '.38'; }, 400); }
    }
  }
}

// ── Clock renderers ───────────────────────────────────────────────────
function renderAnalogue(hr: number, min: number, sec: number, ms: number) {
  const el = document.getElementById('analogueClock') as HTMLCanvasElement | null; if (!el) return;
  const sz  = el.width; const cx = sz/2, cy = sz/2, R = sz/2 - 4;
  const ctx = el.getContext('2d')!; ctx.clearRect(0,0,sz,sz);
  const acc = currentTheme.accent;
  ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.strokeStyle = acc+'30'; ctx.lineWidth = 1.5; ctx.stroke();
  for (let i=0;i<12;i++) { const a=(i/12)*Math.PI*2-Math.PI/2, inner=i%3===0?R*.82:R*.88; ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*inner,cy+Math.sin(a)*inner); ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R); ctx.strokeStyle=acc+(i%3===0?'cc':'55'); ctx.lineWidth=i%3===0?2:1; ctx.stroke(); }
  const sA = ((sec+ms/1000)/60)*Math.PI*2-Math.PI/2, mA = ((min+sec/60)/60)*Math.PI*2-Math.PI/2, hA = (((hr%12)+min/60)/12)*Math.PI*2-Math.PI/2;
  const hand = (a: number, l: number, w: number, c: string) => { ctx.beginPath(); ctx.moveTo(cx-Math.cos(a)*R*.12,cy-Math.sin(a)*R*.12); ctx.lineTo(cx+Math.cos(a)*l,cy+Math.sin(a)*l); ctx.strokeStyle=c; ctx.lineWidth=w; ctx.lineCap='round'; ctx.stroke(); };
  hand(hA,R*.55,3.5,currentTheme.text); hand(mA,R*.78,2.2,currentTheme.text); hand(sA,R*.88,1.2,acc);
  ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.fillStyle=acc; ctx.fill();
}

let flipPrev = { hr:'', min:'', sec:'' };
function renderFlip(hr: string, min: string, sec: string) {
  const up = (id: string, v: string, p: string) => { const el=document.getElementById(id); if(!el||v===p) return; const top=el.querySelector<HTMLElement>('.flip-top'), bot=el.querySelector<HTMLElement>('.flip-bot'), tb=el.querySelector<HTMLElement>('.flip-top-back'); if(!top||!bot||!tb) return; top.textContent=p; bot.textContent=v; tb.textContent=v; el.classList.remove('flipping'); void el.offsetWidth; el.classList.add('flipping'); };
  up('flipHr',hr,flipPrev.hr); up('flipMin',min,flipPrev.min); up('flipSec',sec,flipPrev.sec);
  flipPrev={hr,min,sec};
}

const WORD_GRID=['ITLISASTIME','ACQUARTERDC','TWENTYFIVEX','HALFSTENFTO','PASTERUNINE','ONESIXTHREE','FOURFIVETWO','EIGHTELEVEN','SEVENTWELVE','TENSEOCLOCK'];
const WORDS: Record<string,[number,number,number][]> = { IT:[[0,0,1]],IS:[[0,3,4]],A:[[0,5,5]],QUARTER:[[1,2,8]],TWENTY:[[2,0,5]],FIVE:[[2,6,9]],HALF:[[3,0,3]],TEN:[[3,5,7]],TO:[[3,9,10]],PAST:[[4,0,3]],ONE:[[5,0,2]],SIX:[[5,3,5]],THREE:[[5,6,10]],FOUR:[[6,0,3]],FIVE2:[[6,4,7]],TWO:[[6,8,10]],EIGHT:[[7,0,4]],ELEVEN:[[7,5,10]],SEVEN:[[8,0,4]],TWELVE:[[8,5,10]],TEN2:[[9,0,2]],OCLOCK:[[9,4,9]] };
const HOUR_WORDS=['TWELVE','ONE','TWO','THREE','FOUR','FIVE2','SIX','SEVEN','EIGHT','NINE','TEN2','ELEVEN'];
function getWordClockWords(hr: number, min: number): Set<string> {
  const lit=new Set<string>(['IT','IS']); const m5=Math.round(min/5)*5;
  if(m5===0){lit.add('OCLOCK');}else if(m5===5){lit.add('FIVE');lit.add('PAST');}else if(m5===10){lit.add('TEN');lit.add('PAST');}else if(m5===15){lit.add('A');lit.add('QUARTER');lit.add('PAST');}else if(m5===20){lit.add('TWENTY');lit.add('PAST');}else if(m5===25){lit.add('TWENTY');lit.add('FIVE');lit.add('PAST');}else if(m5===30){lit.add('HALF');lit.add('PAST');}else if(m5===35){lit.add('TWENTY');lit.add('FIVE');lit.add('TO');}else if(m5===40){lit.add('TWENTY');lit.add('TO');}else if(m5===45){lit.add('A');lit.add('QUARTER');lit.add('TO');}else if(m5===50){lit.add('TEN');lit.add('TO');}else if(m5===55){lit.add('FIVE');lit.add('TO');}
  lit.add(HOUR_WORDS[(m5>=35?(hr%12)+1:hr%12)%12]!); return lit;
}
let wordPrevKey='';
function renderWord(hr: number, min: number) {
  const key=`${hr}:${Math.floor(min/5)}`; if(key===wordPrevKey) return; wordPrevKey=key;
  const lit=getWordClockWords(hr,min); const el=document.getElementById('wordClockGrid'); if(!el) return; el.innerHTML='';
  WORD_GRID.forEach((row,ri)=>[...row].forEach((ch,ci)=>{ const span=document.createElement('span'); span.textContent=ch; span.className='wc-char'; let isLit=false; for(const [w,pos] of Object.entries(WORDS)){if(!lit.has(w)) continue; for(const [r,cs,ce] of pos){if(r===ri&&ci>=cs&&ci<=ce){isLit=true;break;}} if(isLit) break;} span.classList.toggle('wc-lit',isLit); el.appendChild(span); }));
}
function renderMinimal(hr12: number, hr: number) { const el=document.getElementById('minimalHr'),ap=document.getElementById('minimalAP'); if(el) el.textContent=String(hr12); if(ap) ap.textContent=hr>=12?'PM':'AM'; }
const SEG_PATHS: Record<string,number[]> = {'0':[1,1,1,1,1,1,0],'1':[0,1,1,0,0,0,0],'2':[1,1,0,1,1,0,1],'3':[1,1,1,1,0,0,1],'4':[0,1,1,0,0,1,1],'5':[1,0,1,1,0,1,1],'6':[1,0,1,1,1,1,1],'7':[1,1,1,0,0,0,0],'8':[1,1,1,1,1,1,1],'9':[1,1,1,1,0,1,1]};
function drawSegDigit(ctx: CanvasRenderingContext2D,digit: string,x: number,y: number,w: number,h: number,color: string,dim: string) {
  const segs=SEG_PATHS[digit]??SEG_PATHS['8']!,t=4,g=3,iw=w-t*2-g*2,ih=(h-t*3-g*4)/2;
  const s=(on: number,draw: ()=>void)=>{ctx.fillStyle=on?color:dim;draw();};
  s(segs[0]!,()=>ctx.fillRect(x+t+g,y,iw,t)); s(segs[1]!,()=>ctx.fillRect(x+w-t,y+t+g,t,ih)); s(segs[2]!,()=>ctx.fillRect(x+w-t,y+t*2+g*3+ih,t,ih));
  s(segs[3]!,()=>ctx.fillRect(x+t+g,y+h-t,iw,t)); s(segs[4]!,()=>ctx.fillRect(x,y+t*2+g*3+ih,t,ih)); s(segs[5]!,()=>ctx.fillRect(x,y+t+g,t,ih)); s(segs[6]!,()=>ctx.fillRect(x+t+g,y+t+g*3+ih,iw,t));
}
function renderSegment(hr: string,min: string,sec: string) {
  const el=document.getElementById('segmentClock') as HTMLCanvasElement|null; if(!el) return;
  const ctx=el.getContext('2d')!; ctx.clearRect(0,0,el.width,el.height);
  const acc=currentTheme.accent,dim=acc+'18',dw=42,dh=80,gap=12,cW=18,tot=6*dw+5*gap+2*cW;
  let ox=(el.width-tot)/2,oy=(el.height-dh)/2;
  [hr[0]!,hr[1]!,min[0]!,min[1]!,sec[0]!,sec[1]!].forEach((d,i)=>{
    if(i===2||i===4){ctx.fillStyle=Math.floor(Date.now()/500)%2===0?acc:dim;ctx.beginPath();ctx.arc(ox+cW/2,oy+dh*.33,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(ox+cW/2,oy+dh*.67,3,0,Math.PI*2);ctx.fill();ox+=cW+gap;}
    drawSegDigit(ctx,d,ox,oy,dw,dh,acc,dim); ox+=dw+gap;
  });
}

// ── Clock canvas DOM manager ──────────────────────────────────────────
function updateClockCanvas() {
  const block=document.getElementById('clock-block-wrap'); if(!block) return;
  block.dataset.mode=clockMode;
  ['analogueClock','flipClockWrap','wordClockGrid','minimalClockWrap','segmentClock'].forEach(id=>document.getElementById(id)?.remove());
  const dr=document.querySelector<HTMLElement>('.clock-row'),as=document.querySelector<HTMLElement>('.ampm-stack');
  if(dr) dr.style.display=clockMode==='digital'?'':'none'; if(as) as.style.display=clockMode==='digital'?'':'none';
  if(clockMode==='analogue'){const c=document.createElement('canvas');c.id='analogueClock';const sz=Math.min(Math.min(window.innerWidth*.65,window.innerHeight*.38),340);c.width=c.height=sz;block.appendChild(c);}
  else if(clockMode==='flip'){const w=document.createElement('div');w.id='flipClockWrap';w.className='flip-clock-wrap';['Hr','Min','Sec'].forEach((p,i)=>{if(i>0){const s=document.createElement('span');s.className='flip-sep';s.textContent=':';w.appendChild(s);}const c=document.createElement('div');c.id=`flip${p}`;c.className='flip-card';c.innerHTML=`<div class="flip-top">00</div><div class="flip-bot">00</div><div class="flip-top-back">00</div>`;w.appendChild(c);});block.appendChild(w);}
  else if(clockMode==='word'){const g=document.createElement('div');g.id='wordClockGrid';g.className='word-clock-grid';block.appendChild(g);wordPrevKey='';}
  else if(clockMode==='minimal'){const w=document.createElement('div');w.id='minimalClockWrap';w.className='minimal-clock-wrap';w.innerHTML=`<span id="minimalHr" class="minimal-hr">--</span><span id="minimalAP" class="minimal-ap">AM</span>`;block.appendChild(w);}
  else if(clockMode==='segment'){const c=document.createElement('canvas');c.id='segmentClock';c.width=Math.min(window.innerWidth*.88,520);c.height=110;block.appendChild(c);}
}

// ── Keyboard shortcuts ────────────────────────────────────────────────
const SHORTCUTS: [string, string, () => void][] = [
  ['Space','Start / Pause',            () => DOM.btnStart.click()],
  ['R',    'Reset timer',              () => DOM.btnReset.click()],
  ['T',    'Cycle theme',              () => { const i=THEMES.indexOf(currentTheme); applyTheme(THEMES[(i+1)%THEMES.length]!); }],
  ['F',    'Toggle fullscreen',        toggleKiosk],
  ['P',    'Toggle Pomodoro',          () => $('btnPomToggle').click()],
  ['M',    'Sound mixer',              () => { buildSoundUI(); openModal('soundOverlay'); }],
  ['L',    'Focus log',                openLog],
  ['K',    'Collapse panel',           () => { DOM.themePanel.classList.toggle('collapsed'); updateRevealBtn(); }],
  ['G',    'Custom theme builder',     openThemeBuilder],
  ['?',    'Show shortcuts',           () => openModal('kbOverlay')],
  ['Escape','Close panel',             () => document.querySelectorAll<HTMLElement>('.sc-overlay.open').forEach(el => el.classList.remove('open'))],
];
const kbGrid=$('kbGrid'); kbGrid.innerHTML='';
SHORTCUTS.forEach(([key,desc])=>{ const k=document.createElement('kbd');k.textContent=key;const d=document.createElement('span');d.className='kb-desc';d.textContent=desc;kbGrid.append(k,d); });
// Add Cmd+K palette entry to the KB grid
{ const k=document.createElement('kbd');k.textContent='⌘K';const d=document.createElement('span');d.className='kb-desc';d.textContent='Command palette — easter eggs & themes';kbGrid.append(k,d); }
document.addEventListener('keydown',e=>{
  const tag=(document.activeElement as HTMLElement).tagName;
  if(tag==='INPUT'||tag==='TEXTAREA'){if(e.key==='Escape')(document.activeElement as HTMLElement).blur();return;}
  if((e.metaKey||e.ctrlKey)&&e.key==='k') return; // CommandPalette owns Cmd+K
  if(document.querySelector('.sc-overlay.open')&&e.key!=='Escape') return;
  for(const [key,,action] of SHORTCUTS){const ek=e.key.toLowerCase();const match=(key==='Space'&&e.code==='Space')||(key==='?'&&(e.key==='?'||(e.code==='Slash'&&e.shiftKey)))||(key==='Escape'&&e.key==='Escape')||(key.length===1&&key.toLowerCase()===ek&&key!=='?');if(match){e.preventDefault();action();return;}}
});

// ── Display modes ─────────────────────────────────────────────────────
let kioskOn=false,presentOn=false;
function updateRevealBtn(){const btn=$('themesRevealBtn'),hidden=kioskOn||presentOn||DOM.themePanel.classList.contains('collapsed');btn.style.opacity=hidden?'1':'0';btn.style.transform=hidden?'translateX(-50%) translateY(0)':'translateX(-50%) translateY(80px)';(btn as HTMLButtonElement).disabled=!hidden;}
function toggleKiosk(){kioskOn=!kioskOn;document.body.classList.toggle('kiosk',kioskOn);if(kioskOn)document.documentElement.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.().catch(()=>{});updateRevealBtn();}
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&kioskOn){kioskOn=false;document.body.classList.remove('kiosk');updateRevealBtn();}});
function togglePresent(){presentOn=!presentOn;document.body.classList.toggle('present',presentOn);updateRevealBtn();}
$('themesRevealBtn').addEventListener('click',()=>{if(kioskOn){toggleKiosk();return;}if(presentOn){togglePresent();return;}focusLockIntercept(()=>{DOM.themePanel.classList.remove('collapsed');updateRevealBtn();});});
$('panelToggle').onclick=()=>focusLockIntercept(()=>{DOM.themePanel.classList.toggle('collapsed');updateRevealBtn();});

// ── Pomodoro ──────────────────────────────────────────────────────────
let animedoroActive=false,theaterTimer: number|null=null,theaterRemainMs=20*60_000;
Pom.init({ isRunning:()=>sessionRunning, getStart:()=>sessionStart, timer:DOM.sTmr, arc:DOM.pomRingArc as unknown as SVGCircleElement, ring:DOM.pomRingSvg as unknown as SVGSVGElement, pill:DOM.pomPill, label:DOM.sessionLabel,
  onPhase:txt=>{
    DOM.pomPill.textContent=txt;
    if(txt.includes('Work')){Sound.adaptOnWorkStart();setBreathing(false);APIs.acquireWakeLock();APIs.sendNotification('🍅 Work Session Started',"Stay focused. You've got this.",'pom-work');}
    else{awardTokens(Pom.getSettings().workMins);Sound.adaptOnBreak();APIs.releaseWakeLock();const isLong=txt.includes('Long'),mins=isLong?Pom.getSettings().longBreakMins:Pom.getSettings().breakMins;APIs.sendNotification(isLong?'💤 Long Break Time!':'☕ Break Time!',`Take a ${mins}-minute break.`,'pom-break');if(breathingBreakEnabled&&!animedoroActive){setBreathing(true);setTimeout(()=>setBreathing(false),mins*60_000);}if(animedoroActive)triggerTheaterMode(mins);}
  }
});
$('btnPomToggle').addEventListener('click',()=>{Pom.toggle();buildPomUI();openModal('pomOverlay');});
function buildPomUI(){const s=Pom.getSettings();const ce=$('pomCountToday');if(ce)ce.textContent=String(Pom.todayCount());(['pomWorkBtns','pomBreakBtns','pomLongBtns']as const).forEach((id,i)=>{const el=$(id);if(!el)return;el.innerHTML='';const opts=i===0?[15,20,25,30,45,60]:i===1?[5,10,15]:[3,4,5,6];const cur=i===0?s.workMins:i===1?s.breakMins:s.longBreakAfter;opts.forEach(v=>{const b=document.createElement('button');b.className='btn'+(cur===v?' active-btn':'');b.textContent=i<2?`${v}m`:`${v}`;b.onclick=()=>{if(i===0)Pom.updateSettings({workMins:v});else if(i===1)Pom.updateSettings({breakMins:v});else Pom.updateSettings({longBreakAfter:v});buildPomUI();};el.appendChild(b);});});}
function startAnimedoro(){Pom.updateSettings({workMins:50,breakMins:20});animedoroActive=true;if(!Pom.isActive()){Pom.toggle();buildPomUI();}}
function triggerTheaterMode(breakMins: number){const o=document.getElementById('theaterOverlay'),t=document.getElementById('theaterTimer'),m=document.getElementById('theaterMinutes');if(!o)return;theaterRemainMs=breakMins*60_000;if(m)m.textContent=String(breakMins);o.classList.add('visible');const tick=()=>{theaterRemainMs-=1000;if(t){const mm=Math.floor(theaterRemainMs/60000),ss=Math.floor((theaterRemainMs%60000)/1000);t.textContent=`${p2(mm)}:${p2(ss)}`;}if(theaterRemainMs<=0){o.classList.remove('visible');if(theaterTimer)clearInterval(theaterTimer);}};if(theaterTimer)clearInterval(theaterTimer);theaterTimer=window.setInterval(tick,1000);const sk=document.getElementById('theaterSkip');if(sk)sk.onclick=()=>{o.classList.remove('visible');if(theaterTimer)clearInterval(theaterTimer);};}

// ── Info strip ────────────────────────────────────────────────────────
const BASE_INFO=[()=>{const n=new Date(),s=new Date(n.getFullYear(),0,0),d=Math.floor((n.getTime()-s.getTime())/86400000);return`Week ${Math.ceil(d/7)} · Day ${d} of ${n.getFullYear()}`;},()=>{const n=new Date(),e=new Date(n.getFullYear(),11,31);return`${Math.ceil((e.getTime()-n.getTime())/86400000)} days left in ${n.getFullYear()}`;},()=>{const n=new Date();return`${((n.getHours()*3600+n.getMinutes()*60+n.getSeconds())/86400*100).toFixed(1)}% of today complete`;}];
function getAllInfo(){return[...Intel.getIntelligenceInsights(),...BASE_INFO];}
let infoIdx=0;
function rotateInfo(){const sl=DOM.infoSlide,lb=DOM.infoLabel;if(!sl||!lb)return;sl.classList.add('leaving');setTimeout(()=>{const items=getAllInfo();infoIdx=(infoIdx+1)%items.length;lb.textContent=items[infoIdx]!();sl.classList.remove('leaving');sl.style.animation='none';void sl.offsetWidth;sl.style.animation='';},420);}
function startInfoStrip(){const items=getAllInfo();if(DOM.infoLabel)DOM.infoLabel.textContent=items[0]!();setInterval(rotateInfo,6000);}

// ── Parallax ──────────────────────────────────────────────────────────
let parallaxX=0,parallaxY=0,targetPX=0,targetPY=0;
const PS=18;
window.addEventListener('mousemove',e=>{targetPX=(e.clientX/window.innerWidth-.5)*PS;targetPY=(e.clientY/window.innerHeight-.5)*PS;});
if(window.DeviceOrientationEvent)window.addEventListener('deviceorientation',e=>{if(e.gamma!=null&&e.beta!=null){targetPX=Math.max(-PS,Math.min(PS,e.gamma/2));targetPY=Math.max(-PS,Math.min(PS,(e.beta-45)/2));}});

// ── BroadcastChannel ──────────────────────────────────────────────────
const bc=typeof BroadcastChannel!=='undefined'?new BroadcastChannel('sc_sync'):null;
function bcBroadcast(type: string,payload: Record<string,unknown>={}){bc?.postMessage({type,...payload});}
if(bc)bc.onmessage=(e)=>{const{type}=e.data;if(type==='theme')applyTheme(THEME_BY_ID[e.data.id]??currentTheme,true);if(type==='session'){if(e.data.running&&!sessionRunning)DOM.btnStart.click();if(!e.data.running&&sessionRunning)DOM.btnStart.click();}};

// ── Flow state ────────────────────────────────────────────────────────
let flowUIActive=false;
function updateFlowState(){const isFlow=Intel.checkFlowState(sessionRunning);if(isFlow===flowUIActive)return;flowUIActive=isFlow;if(isFlow){DOM.themePanel.classList.add('collapsed');updateRevealBtn();document.body.classList.add('flow-state');let b=document.getElementById('flowBadge');if(!b){b=document.createElement('div');b.id='flowBadge';b.className='flow-badge';document.body.appendChild(b);}b.textContent='⚡ Flow State';b.classList.add('visible');}else{document.body.classList.remove('flow-state');document.getElementById('flowBadge')?.classList.remove('visible');}}
let breakBadgeShown=false;
function checkSmartBreak(){if(!Intel.checkBreakNeeded(sessionRunning)||breakBadgeShown)return;breakBadgeShown=true;const p=document.querySelector<HTMLElement>('.sync-pill');if(!p)return;p.classList.add('break-hint');p.title="You've been focused for 90+ minutes — consider a short break";setTimeout(()=>{p.classList.remove('break-hint');breakBadgeShown=false;},30_000);}

// ── QR Handoff ────────────────────────────────────────────────────────
function openQRHandoff(){const canvas=$<HTMLCanvasElement>('qrCanvas'),label=$('qrLabel'),urlEl=$('qrUrl');if(!canvas)return;const state: Record<string,string>={theme:currentTheme.id,clock:clockMode};if(sessionRunning){state.ses='1';state.elapsed=String(Math.round(performance.now()-sessionStart));}if(Pom.isActive()){state.pom='1';const s=Pom.getSettings();state.pw=String(s.workMins);state.pb=String(s.breakMins);}if(DOM.focusInput.value.trim())state.task=DOM.focusInput.value.trim().slice(0,30);const url=`${location.origin}${location.pathname}?${new URLSearchParams(state).toString()}`;if(urlEl)urlEl.textContent=url.length>60?url.slice(0,57)+'…':url;drawQR(canvas,url,currentTheme.text,currentTheme.baseBg[1]??currentTheme.baseBg[0]!);if(label)label.textContent=url.length>77?'URL too long for QR — shorten task name':'Scan to continue this session on another device';openModal('qrOverlay');}
function applyHandoffState(){const p=new URLSearchParams(location.search);if(!p.has('theme')&&!p.has('ses'))return;const tid=p.get('theme');if(tid&&THEME_BY_ID[tid])applyTheme(THEME_BY_ID[tid]!,true);const cm=p.get('clock') as ClockMode|null;if(cm){setClockMode(cm);updateClockCanvas();}if(p.get('task'))DOM.focusInput.value=p.get('task')!;if(p.get('ses')==='1'){sessionElapsed=parseInt(p.get('elapsed')??'0');setTimeout(()=>DOM.btnStart.click(),800);}history.replaceState({},'',location.pathname);}

// ── Share card ────────────────────────────────────────────────────────
async function openShareCard(){const log: Array<{date:string;dur:number}>=(() => {try{return JSON.parse(localStorage.getItem('sc_focus_log')||'[]');}catch{return [];}})();const today=new Date().toDateString(),todayMins=Math.max(1,Math.floor(log.filter(e=>e.date===today).reduce((s,e)=>s+e.dur,0)/60000));generateShareCard({themeName:currentTheme.name,accentColor:currentTheme.accent,bgColor:currentTheme.baseBg[0]!,textColor:currentTheme.text,glow:currentTheme.glow,focusMinutes:todayMins,taskName:DOM.focusInput.value.trim(),streakDays:Intel.getStreak().current,date:new Date().toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'})});if(APIs.canShare()){const offCv=document.createElement('canvas');offCv.width=1200;offCv.height=630;const shared=await APIs.shareCard(offCv,DOM.focusInput.value.trim(),todayMins).catch(()=>false);if(shared){showToast('Shared!');return;}}const offCv2=document.createElement('canvas');offCv2.width=400;offCv2.height=210;showToast(await APIs.copyCardToClipboard(offCv2).catch(()=>false)?'Focus card copied to clipboard!':'Focus card saved to your downloads!');}

// ── Toast ─────────────────────────────────────────────────────────────
function showToast(msg: string,duration=3500){document.getElementById('scToast')?.remove();const t=document.createElement('div');t.id='scToast';t.className='sc-toast';t.textContent=msg;document.body.appendChild(t);requestAnimationFrame(()=>t.classList.add('visible'));setTimeout(()=>{t.classList.remove('visible');setTimeout(()=>t.remove(),400);},duration);}

// ── Wallpaper drop ────────────────────────────────────────────────────
function initWallpaperDrop(){document.addEventListener('dragover',e=>e.preventDefault());document.addEventListener('drop',e=>{e.preventDefault();const file=e.dataTransfer?.files[0];if(!file?.type.startsWith('image/'))return;const reader=new FileReader();reader.onload=ev=>{const img=new Image();img.onload=()=>{const cv=document.createElement('canvas');cv.width=cv.height=16;const ctx=cv.getContext('2d')!;ctx.drawImage(img,0,0,16,16);const px=ctx.getImageData(0,0,16,16).data;let r=0,g=0,b=0,n=0;for(let i=0;i<px.length;i+=4){const l=.299*px[i]!+.587*px[i+1]!+.114*px[i+2]!;if(l<20||l>235)continue;r+=px[i]!;g+=px[i+1]!;b+=px[i+2]!;n++;}if(!n)return;const accent='#'+[Math.round(r/n),Math.round(g/n),Math.round(b/n)].map(v=>v.toString(16).padStart(2,'0')).join('');const dk=(h: string,a: number)=>{const n2=parseInt(h.slice(1),16);return'#'+[16,8,0].map(s=>Math.max(0,Math.round(((n2>>s)&0xff)*(1-a))).toString(16).padStart(2,'0')).join('');};const wt={...currentTheme,id:'wallpaper',name:'Wallpaper',accent,accent2:accent,btnBg:accent+'22',btnFg:'#ffffff',glow:`0 0 55px ${accent}44`,hdr:true,baseBg:[dk(accent,.9),dk(accent,.85),dk(accent,.92)]};document.body.style.backgroundImage=`url('${ev.target?.result as string}')`;document.body.style.backgroundSize='cover';document.body.style.backgroundPosition='center';document.getElementById('overlay')!.style.background='rgba(0,0,0,0.55)';applyTheme(wt as typeof currentTheme,true);showToast('Wallpaper theme applied!');};img.src=ev.target?.result as string;};reader.readAsDataURL(file);});}

// ── Misc ──────────────────────────────────────────────────────────────
function registerSW(){if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{});}
function flashTheme(){document.body.classList.remove('theme-flash');void document.body.offsetWidth;document.body.classList.add('theme-flash');setTimeout(()=>document.body.classList.remove('theme-flash'),500);}
function updatePanelHeight(){const p=$('themePanel');if(!p)return;document.documentElement.style.setProperty('--panel-h',p.offsetHeight+'px');}

// ── Init ──────────────────────────────────────────────────────────────
function init() {
  initPerf();
  if(localStorage.getItem('sc_reduce_motion')==='1'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.body.classList.add('reduced-motion');

  APIs.initBattery().then(()=>APIs.onBatteryChange((level,charging)=>{if(!charging&&level<.2&&getTier()!=='low'){setTier('low');showToast('🔋 Battery saver: quality reduced to Low');}}));
  APIs.acquireWakeLock();
  resize();
  window.addEventListener('resize',()=>{resize();updatePanelHeight();});

  // Wire UI modules
  initModalClickOutside();
  initLogUI();
  initSoundUI(showToast);
  initThemeBuilder(
    draft=>{const r=document.documentElement;r.style.setProperty('--clr-text',draft.text);r.style.setProperty('--clr-accent',draft.accent);r.style.setProperty('--clr-accent2',draft.accent2);r.style.setProperty('--clr-btn-fg',draft.btnFg);r.style.setProperty('--clr-panel',draft.panel);},
    ()=>applyTheme(currentTheme,true),
  );
  initSettings({
    clockMode:()=>clockMode, setClockMode, updateClockCanvas, openThemeBuilder, openQRHandoff,
    startAnimedoro, toggleKiosk, togglePresent, openDataPanel, togglePrivacy, toggleFocusLock,
    showToast, isPrivacyMode, focusLockEnabled:()=>focusLockEnabled, isPiPActive:APIs.isPiPActive,
    enterPiP:()=>APIs.enterPiP(document.getElementById('clock-block-wrap')!,{accent:currentTheme.accent,text:currentTheme.text,baseBg:currentTheme.baseBg}),
    exitPiP:APIs.exitPiP,
    breathingEnabled:()=>breathingBreakEnabled,
    setBreathingEnabled:v=>{breathingBreakEnabled=v;localStorage.setItem('sc_breathing_break',v?'1':'0');},
  });
  initPanel({applyTheme,openShareCard,openThemeBuilder,buildPomUI,startAnimedoro,toggleKiosk,togglePresent,focusLockIntercept});

  buildPanel(); updatePanelHeight(); updateClockCanvas(); startInfoStrip(); initWallpaperDrop();

  // Easter eggs
  Easter.initEaster((id)=>{const t=THEME_BY_ID[id];if(t)applyTheme(t);},showToast,()=>Sound.playChime());
  (window as any).__scFps=()=>getFps();
  (window as any).__scTier=()=>getTier();
  (window as any).__scThemeCount=()=>THEMES.length;
  (window as any).__scAudioNodes=()=>{try{const a=new AudioContext();a.close();return'ok';}catch{return'?';}};
  (window as any).__scRandomTheme=()=>applyTheme(THEMES[Math.floor(Math.random()*THEMES.length)]!);
  (window as any).__scIncognito=Privacy.isIncognito;

  // Svelte Command Palette
  const cpMount=document.createElement('div'); cpMount.id='command-palette-root'; document.body.appendChild(cpMount);
  new CommandPalette({ target:cpMount, props:{
    onAction:(keyword: string)=>{
      if(keyword==='_konami'){['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'].forEach(k=>window.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true})));}
      else { triggerKeyword(keyword); }
    },
    onRandomTheme:()=>(window as any).__scRandomTheme?.(),
  }});

  registerSW();
  (window as any).__scIncognito=Privacy.isIncognito;
  document.addEventListener('dragenter',()=>document.body.classList.add('drag-over'));
  document.addEventListener('dragleave',e=>{if(!e.relatedTarget)document.body.classList.remove('drag-over');});
  document.addEventListener('drop',()=>document.body.classList.remove('drag-over'));

  let deferredInstall: Event|null=null;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;const btn=document.createElement('button');btn.id='pwaInstallBtn';btn.className='show';btn.textContent='⬇ Install App';btn.addEventListener('click',()=>{(deferredInstall as any)?.prompt?.();btn.remove();deferredInstall=null;});document.body.appendChild(btn);});

  $('btnKbShortcuts')?.addEventListener('click',()=>openModal('kbOverlay'));
  $('topbarThemesBtn')?.addEventListener('click',()=>focusLockIntercept(()=>{DOM.themePanel.classList.toggle('collapsed');updateRevealBtn();}));

  const lastId=localStorage.getItem('sc_last_theme');
  applyTheme(lastId&&THEME_BY_ID[lastId]?THEME_BY_ID[lastId]!:THEMES[0]!,true);
  applyHandoffState();

  setInterval(()=>{updateFlowState();checkSmartBreak();},60_000);
  requestAnimationFrame(ts=>{lastTs=ts;renderFrame(ts);});

  if(!privacyMode){syncTime();initWeather($('weatherIcon'),$('weatherText'),$('weatherPill'),isPrivacyMode);}
  else updateSyncDisplay('failed');

  // SC namespace for HTML onclick handlers
  (window as any).SC={
    modals:{open:openModal,close:closeModal},
    focusLog:{exportCSV:Log.exportCSV,clear:()=>{Log.clear();},switchTab:(tab: 'list'|'heatmap')=>switchLogTab(tab)},
    themeBuilder:{preview:previewCustomTheme,save:()=>{},reset:()=>applyTheme(currentTheme,true),openBuilder:openThemeBuilder},
  };
}

init();
