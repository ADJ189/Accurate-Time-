// ── Settings Modal ────────────────────────────────────────────────────
import type { ClockMode } from '../types';
import type { QualityTier } from '../perf';
import * as Sound   from '../sound';
import * as Privacy from '../privacy';
import { getFps, getTier, setTier } from '../perf';
import { invalidateCache } from '../renderer';
import { $, openModal, closeModal } from './modals';
import { buildSoundUI } from './sound-ui';

// Callbacks injected from main.ts — avoids circular imports
let _clockMode:          () => ClockMode         = () => 'digital';
let _setClockMode:       (m: ClockMode) => void  = () => {};
let _updateClockCanvas:  () => void              = () => {};
let _openThemeBuilder:   () => void              = () => {};
let _openQRHandoff:      () => void              = () => {};
let _startAnimedoro:     () => void              = () => {};
let _toggleKiosk:        () => void              = () => {};
let _togglePresent:      () => void              = () => {};
let _openDataPanel:      () => void              = () => {};
let _togglePrivacy:      () => void              = () => {};
let _toggleFocusLock:    () => void              = () => {};
let _showToast:          (msg: string) => void   = () => {};
let _isPrivacyMode:      () => boolean           = () => false;
let _isBreathing:        () => boolean           = () => false;
let _setBreathing:       (v: boolean) => void    = () => {};
let _focusLockEnabled:   () => boolean           = () => false;
let _isPiPActive:        () => boolean           = () => false;
let _enterPiP:           () => void              = () => {};
let _exitPiP:            () => void              = () => {};
let _breathingEnabled:   () => boolean           = () => true;
let _setBreathingEnabled:(v: boolean) => void    = () => {};

export function initSettings(opts: {
  clockMode:           () => ClockMode;
  setClockMode:        (m: ClockMode) => void;
  updateClockCanvas:   () => void;
  openThemeBuilder:    () => void;
  openQRHandoff:       () => void;
  startAnimedoro:      () => void;
  toggleKiosk:         () => void;
  togglePresent:       () => void;
  openDataPanel:       () => void;
  togglePrivacy:       () => void;
  toggleFocusLock:     () => void;
  showToast:           (msg: string) => void;
  isPrivacyMode:       () => boolean;
  focusLockEnabled:    () => boolean;
  isPiPActive:         () => boolean;
  enterPiP:            () => void;
  exitPiP:             () => void;
  breathingEnabled:    () => boolean;
  setBreathingEnabled: (v: boolean) => void;
}) {
  _clockMode           = opts.clockMode;
  _setClockMode        = opts.setClockMode;
  _updateClockCanvas   = opts.updateClockCanvas;
  _openThemeBuilder    = opts.openThemeBuilder;
  _openQRHandoff       = opts.openQRHandoff;
  _startAnimedoro      = opts.startAnimedoro;
  _toggleKiosk         = opts.toggleKiosk;
  _togglePresent       = opts.togglePresent;
  _openDataPanel       = opts.openDataPanel;
  _togglePrivacy       = opts.togglePrivacy;
  _toggleFocusLock     = opts.toggleFocusLock;
  _showToast           = opts.showToast;
  _isPrivacyMode       = opts.isPrivacyMode;
  _focusLockEnabled    = opts.focusLockEnabled;
  _isPiPActive         = opts.isPiPActive;
  _enterPiP            = opts.enterPiP;
  _exitPiP             = opts.exitPiP;
  _breathingEnabled    = opts.breathingEnabled;
  _setBreathingEnabled = opts.setBreathingEnabled;
}

let _lastSettingsTab = 'general';

export function openSettings() {
  buildSettingsUI(_lastSettingsTab);
  openModal('settingsOverlay');
}

export function buildSettingsUI(activeTab = 'general') {
  const tabBarEl = $('settingsTabBar');
  const el       = $('settingsContent');
  if (!el || !tabBarEl) return;
  el.innerHTML = ''; tabBarEl.innerHTML = '';

  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'paneFadeIn .18s ease';

  const tabs = [
    { id: 'general', icon: '✦',  label: 'General'  },
    { id: 'sound',   icon: '🎵', label: 'Sound'    },
    { id: 'focus',   icon: '⏱',  label: 'Focus'    },
    { id: 'display', icon: '🎨', label: 'Display'  },
    { id: 'privacy', icon: '🔒', label: 'Privacy'  },
  ];

  const tabBar = document.createElement('div'); tabBar.className = 'settings-tab-bar';
  tabs.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'settings-tab-btn' + (t.id === activeTab ? ' active' : '');
    btn.dataset.tab = t.id;
    const ic = document.createElement('span'); ic.className = 'stb-icon'; ic.textContent = t.icon;
    const lb = document.createElement('span'); lb.className = 'stb-label'; lb.textContent = t.label;
    btn.append(ic, lb);
    btn.addEventListener('click', () => { _lastSettingsTab = t.id; buildSettingsUI(t.id); });
    tabBar.appendChild(btn);
  });
  tabBarEl.appendChild(tabBar);

  const paneWrap = el;

  const makeSection = (title: string) => {
    const s = document.createElement('div'); s.className = 'settings-section';
    const h = document.createElement('div'); h.className = 'settings-section-title'; h.textContent = title;
    s.appendChild(h); return s;
  };

  const makeRow = (lText: string, dText: string, btnId: string, on: boolean, badge?: string) => {
    const row  = document.createElement('div'); row.className = 'settings-row';
    const info = document.createElement('div'); info.className = 'settings-row-info';
    const top  = document.createElement('div'); top.className  = 'settings-row-top';
    const lbl  = document.createElement('span'); lbl.className = 'settings-row-label'; lbl.textContent = lText;
    top.appendChild(lbl);
    if (badge) { const b = document.createElement('span'); b.className = 'settings-badge'; b.textContent = badge; top.appendChild(b); }
    const dsc = document.createElement('span'); dsc.className = 'settings-row-desc'; dsc.textContent = dText;
    info.append(top, dsc);
    const tog = document.createElement('button'); tog.className = 'settings-toggle' + (on ? ' on' : ''); tog.id = btnId;
    row.append(info, tog); return row;
  };

  const wireToggle = (id: string, fn: (on: boolean) => void) => {
    paneWrap.querySelector<HTMLButtonElement>('#' + id)?.addEventListener('click', e => {
      const btn = e.currentTarget as HTMLButtonElement;
      const wasOn = btn.classList.contains('on');
      btn.classList.toggle('on');
      if (!wasOn) { const rip = document.createElement('span'); rip.className = 'toggle-ripple'; btn.appendChild(rip); setTimeout(() => rip.remove(), 600); }
      fn(!wasOn);
    });
  };

  // ══ GENERAL ══════════════════════════════════════════════════════════
  if (activeTab === 'general') {
    const clockModes: { mode: ClockMode; label: string; icon: string; desc: string }[] = [
      { mode: 'digital',  label: 'Digital',  icon: '🔢', desc: 'Classic digits'  },
      { mode: 'analogue', label: 'Analogue', icon: '🕐', desc: 'Sweep hands'     },
      { mode: 'flip',     label: 'Flip',     icon: '📅', desc: '3D card flip'    },
      { mode: 'word',     label: 'Word',     icon: '📝', desc: 'It is half past' },
      { mode: 'minimal',  label: 'Minimal',  icon: '○',  desc: 'Hour only, huge' },
      { mode: 'segment',  label: 'Segment',  icon: '📟', desc: 'LED 7-segment'   },
    ];
    const clockSec = makeSection('Clock Style');
    const grid = document.createElement('div'); grid.className = 'clock-mode-grid';
    clockModes.forEach(({ mode, label, icon, desc }) => {
      const btn = document.createElement('button');
      btn.className = 'clock-mode-btn' + (_clockMode() === mode ? ' active' : '');
      btn.dataset.mode = mode;
      const iEl = document.createElement('span'); iEl.className = 'cmb-icon';  iEl.textContent = icon;
      const lEl = document.createElement('span'); lEl.className = 'cmb-label'; lEl.textContent = label;
      const dEl = document.createElement('span'); dEl.className = 'cmb-desc';  dEl.textContent = desc;
      btn.append(iEl, lEl, dEl);
      btn.addEventListener('click', () => {
        _setClockMode(mode); _updateClockCanvas();
        grid.querySelectorAll('.clock-mode-btn').forEach(b => b.classList.toggle('active', (b as HTMLElement).dataset.mode === mode));
      });
      grid.appendChild(btn);
    });
    clockSec.appendChild(grid); paneWrap.appendChild(clockSec);

    const actionSec = makeSection('Quick Actions');
    const actionGrid = document.createElement('div'); actionGrid.className = 'settings-action-grid';
    const quickActions: { label: string; fn: () => void | Promise<void> }[] = [
      { label: '🎨 Custom Theme',        fn: () => { closeModal('settingsOverlay'); _openThemeBuilder(); } },
      { label: '📱 QR Handoff',          fn: () => { closeModal('settingsOverlay'); _openQRHandoff(); } },
      { label: '🎬 Animedoro',           fn: () => { closeModal('settingsOverlay'); _startAnimedoro(); openModal('pomOverlay'); } },
      { label: '⛶ Kiosk Mode',          fn: () => { closeModal('settingsOverlay'); _toggleKiosk(); } },
      { label: '📺 Present',             fn: () => { closeModal('settingsOverlay'); _togglePresent(); } },
      { label: '🖼 Picture-in-Picture',  fn: async () => {
        closeModal('settingsOverlay');
        if (_isPiPActive()) { _exitPiP(); _showToast('PiP closed'); }
        else { _enterPiP(); _showToast('Clock floating in PiP'); }
      }},
    ];
    quickActions.forEach(({ label, fn }) => {
      const btn = document.createElement('button'); btn.className = 'settings-action-btn';
      btn.textContent = label; btn.addEventListener('click', fn as () => void);
      actionGrid.appendChild(btn);
    });
    actionSec.appendChild(actionGrid); paneWrap.appendChild(actionSec);
  }

  // ══ SOUND ════════════════════════════════════════════════════════════
  else if (activeTab === 'sound') {
    const audioSec = makeSection('Audio');
    audioSec.appendChild(makeRow('3D Spatial Audio', 'Sounds pan independently — best with headphones', 'toggleSpatial', Sound.isSpatialEnabled(), 'ILD+ITD'));
    audioSec.appendChild(makeRow('Box Breathing on Break', 'Guided breathing overlay during Pomodoro breaks', 'toggleBreathing', _breathingEnabled()));
    paneWrap.appendChild(audioSec);

    const soundBtnSec = makeSection('Mixer');
    const openMixerBtn = document.createElement('button'); openMixerBtn.className = 'settings-action-btn settings-action-btn--full';
    openMixerBtn.textContent = '🎵 Open Sound Mixer';
    openMixerBtn.addEventListener('click', () => { closeModal('settingsOverlay'); buildSoundUI(); openModal('soundOverlay'); });
    soundBtnSec.appendChild(openMixerBtn); paneWrap.appendChild(soundBtnSec);

    wireToggle('toggleSpatial',   (on) => Sound.setSpatial(on));
    wireToggle('toggleBreathing', (on) => _setBreathingEnabled(on));
  }

  // ══ FOCUS ════════════════════════════════════════════════════════════
  else if (activeTab === 'focus') {
    const focusSec = makeSection('Pomodoro & Sessions');
    focusSec.appendChild(makeRow('Focus Lock Delay', '3-second intentional friction before opening panels during Pomodoro', 'toggleFocusLockS', _focusLockEnabled()));
    focusSec.appendChild(makeRow('Smart Break Reminder', 'Gently pulses after 90 uninterrupted minutes', 'toggleSmartBreak', localStorage.getItem('sc_smart_break') !== '0'));
    paneWrap.appendChild(focusSec);

    const pomBtn = document.createElement('button'); pomBtn.className = 'settings-action-btn settings-action-btn--full';
    pomBtn.textContent = '⏱ Pomodoro Settings';
    pomBtn.addEventListener('click', () => { closeModal('settingsOverlay'); openModal('pomOverlay'); });
    const pomSec = makeSection('Timer'); pomSec.appendChild(pomBtn);
    paneWrap.appendChild(pomSec);

    wireToggle('toggleFocusLockS', () => _toggleFocusLock());
    wireToggle('toggleSmartBreak', (on) => { localStorage.setItem('sc_smart_break', on ? '1' : '0'); });
  }

  // ══ DISPLAY ══════════════════════════════════════════════════════════
  else if (activeTab === 'display') {
    const animSec = makeSection('Motion & Animations');
    const reduceMotion = localStorage.getItem('sc_reduce_motion') === '1' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    animSec.appendChild(makeRow('Reduce Motion', 'Simpler transitions, no parallax, no particle animations', 'toggleReduceMotion', reduceMotion));
    animSec.appendChild(makeRow('Parallax Depth', 'Canvas layers shift with mouse/gyroscope movement', 'toggleParallax', localStorage.getItem('sc_parallax') !== '0'));
    paneWrap.appendChild(animSec);

    const perfSec = makeSection('Performance');
    const qualityRow = document.createElement('div'); qualityRow.className = 'settings-row';
    const qualInfo   = document.createElement('div'); qualInfo.className = 'settings-row-info';
    const qualTop    = document.createElement('div'); qualTop.className  = 'settings-row-top';
    const qualLbl    = document.createElement('span'); qualLbl.className = 'settings-row-label'; qualLbl.textContent = 'Render Quality';
    const fpsBadge   = document.createElement('span'); fpsBadge.className = 'settings-badge'; fpsBadge.textContent = `${getFps()} fps`;
    qualTop.append(qualLbl, fpsBadge);
    const qualDesc = document.createElement('span'); qualDesc.className = 'settings-row-desc';
    qualDesc.textContent = `Auto-detected: ${getTier().toUpperCase()}`;
    qualInfo.append(qualTop, qualDesc);
    const qualSelect = document.createElement('select'); qualSelect.className = 'settings-select';
    (['auto', 'high', 'med', 'low'] as const).forEach(v => {
      const opt = document.createElement('option');
      opt.value = v === 'auto' ? '' : v;
      opt.textContent = v === 'auto' ? 'Auto' : v.charAt(0).toUpperCase() + v.slice(1);
      const stored = localStorage.getItem('sc_quality');
      if ((v === 'auto' && !stored) || stored === v) opt.selected = true;
      qualSelect.appendChild(opt);
    });
    qualSelect.addEventListener('change', () => {
      const val = qualSelect.value as QualityTier | '';
      if (val) setTier(val as QualityTier); else localStorage.removeItem('sc_quality');
      invalidateCache();
      qualDesc.textContent = `Quality: ${getTier().toUpperCase()}`;
      fpsBadge.textContent = `${getFps()} fps`;
      _showToast(`Quality set to ${getTier().toUpperCase()}`);
    });
    qualityRow.append(qualInfo, qualSelect); perfSec.appendChild(qualityRow);
    paneWrap.appendChild(perfSec);

    wireToggle('toggleReduceMotion', (on) => {
      localStorage.setItem('sc_reduce_motion', on ? '1' : '0');
      document.body.classList.toggle('reduced-motion', on);
      _showToast(on ? 'Reduced motion on' : 'Full animations on');
    });
    wireToggle('toggleParallax', (on) => {
      localStorage.setItem('sc_parallax', on ? '1' : '0');
      _showToast(on ? 'Parallax on' : 'Parallax off');
    });
  }

  // ══ PRIVACY ══════════════════════════════════════════════════════════
  else if (activeTab === 'privacy') {
    const privacyMode = _isPrivacyMode();
    const privSec = makeSection('Privacy Mode');
    privSec.appendChild(makeRow('Privacy Mode', 'Disables weather, time sync & Google Fonts — local only', 'togglePrivacyS', privacyMode, privacyMode ? 'On' : undefined));
    paneWrap.appendChild(privSec);

    const sessionSec = makeSection('Sessions');
    sessionSec.appendChild(makeRow('Incognito Sessions', 'Sessions run in memory — nothing written to storage', 'toggleIncognito', Privacy.isIncognito()));
    sessionSec.appendChild(makeRow('Auto-Clear on Close', 'Wipe session log & focus data when tab closes', 'toggleAutoClear', Privacy.isAutoClear()));
    paneWrap.appendChild(sessionSec);

    const dataBtnSec = makeSection('Data');
    const dataBtn = document.createElement('button'); dataBtn.className = 'settings-action-btn settings-action-btn--full';
    dataBtn.textContent = '🛡 View & Manage My Data';
    dataBtn.addEventListener('click', () => { closeModal('settingsOverlay'); _openDataPanel(); });
    dataBtnSec.appendChild(dataBtn); paneWrap.appendChild(dataBtnSec);

    wireToggle('togglePrivacyS', (on) => {
      _togglePrivacy();
      if (on) { document.body.classList.add('privacy-activating'); setTimeout(() => document.body.classList.remove('privacy-activating'), 800); }
    });
    wireToggle('toggleIncognito', (on) => { Privacy.setIncognito(on); _showToast(on ? '🕵 Incognito on — sessions not saved' : 'Incognito off'); });
    wireToggle('toggleAutoClear', (on) => { Privacy.setAutoClear(on); _showToast(on ? 'Auto-clear on close enabled' : 'Auto-clear disabled'); });
  }

  const pad = document.createElement('div'); pad.style.height = '12px';
  el.appendChild(pad);
}
