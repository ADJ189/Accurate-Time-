// ── Theme Panel ───────────────────────────────────────────────────────
import type { Theme } from '../types';
import { THEMES_BY_CAT } from '../themes';
import * as Shop from '../shop';
import { $, openModal } from './modals';
import { buildSoundUI } from './sound-ui';
import { openShop, coinHTML, createCoinEl } from './shop-ui';
import { openLog } from './log-ui';
import { openSettings } from './settings';

// ── SVG Logos (developer-authored) ────────────────────────────────────
export const LOGOS: Record<string, string> = {
  supernatural:  `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#1a0800"/><path d="M6 17L16 5L26 17" stroke="#e05500" stroke-width="1.5" fill="none"/><path d="M10 17L16 9L22 17" stroke="#ff9944" stroke-width="1" fill="none" opacity=".6"/><circle cx="16" cy="14" r="2" fill="#e05500" opacity=".8"/></svg>`,
  mentalist:     `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#180800"/><circle cx="16" cy="11" r="7" stroke="#cc1100" stroke-width="1.2" fill="none"/><circle cx="13" cy="9.5" r="1.2" fill="#cc1100"/><circle cx="19" cy="9.5" r="1.2" fill="#cc1100"/><path d="M12 14Q16 17 20 14" stroke="#cc1100" stroke-width="1.2" fill="none"/></svg>`,
  sopranos:      `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#080808"/><rect x="4" y="6" width="24" height="10" rx="1" stroke="#c8a000" stroke-width="1" fill="none" opacity=".7"/><text x="16" y="14.5" text-anchor="middle" fill="#c8a000" font-size="6" font-family="Georgia,serif" font-weight="700">TS</text></svg>`,
  dark:          `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000004"/><circle cx="16" cy="11" r="8" stroke="#4488cc" stroke-width=".8" fill="none" opacity=".5"/><circle cx="16" cy="11" r="2" fill="#4488cc" opacity=".7"/></svg>`,
  breakingbad:   `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#040900"/><text x="4" y="10" fill="#7ec800" font-size="7.5" font-family="Arial,sans-serif" font-weight="900">Br</text><text x="4" y="19" fill="#b8f040" font-size="6" font-family="Arial,sans-serif" font-weight="700" letter-spacing="2">BAD</text></svg>`,
  strangerthings:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#04000e"/><text x="16" y="9" text-anchor="middle" fill="#cc44ff" font-size="5.5" font-family="Georgia,serif" font-weight="700" letter-spacing="-.5">STRANGER</text><text x="16" y="17" text-anchor="middle" fill="#ee88ff" font-size="5.5" font-family="Georgia,serif" font-weight="700" letter-spacing="-.5">THINGS</text></svg>`,
  interstellar:  `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000305"/><circle cx="16" cy="11" r="6" fill="none" stroke="#4499ee" stroke-width=".8" opacity=".6"/><ellipse cx="16" cy="11" rx="9" ry="2.5" fill="none" stroke="#88ccff" stroke-width=".7" opacity=".4"/></svg>`,
  dune:          `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#1a1000"/><path d="M2 16Q8 8 16 10Q24 12 30 6" stroke="#d4a020" stroke-width="1.2" fill="none" opacity=".7"/><text x="16" y="21" text-anchor="middle" fill="#d4a020" font-size="4.5" font-family="Georgia,serif" letter-spacing="3" opacity=".8">DUNE</text></svg>`,
  matrix:        `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000a00"/><text x="4" y="8" fill="#00ee00" font-size="5" font-family="monospace" opacity=".9">10110</text><text x="4" y="14" fill="#00ee00" font-size="5" font-family="monospace" opacity=".6">01001</text><text x="24.5" y="13" text-anchor="middle" fill="#00ee00" font-size="7" font-family="monospace" font-weight="700">M</text></svg>`,
  bladerunner:   `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#0a0500"/><rect x="2" y="14" width="28" height="6" fill="#050200"/><path d="M2 5L5 2L27 2L30 5" stroke="#e87020" stroke-width=".6" fill="none" opacity=".5"/></svg>`,
  inception:     `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#060608"/><circle cx="16" cy="11" r="9" stroke="#9090ee" stroke-width=".6" fill="none" opacity=".35"/><circle cx="16" cy="11" r="1.5" fill="#9090ee" opacity=".6"/></svg>`,
  godfather:     `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#050500"/><path d="M16 4Q10 8 10 12Q10 17 16 18Q22 17 22 12Q22 8 16 4Z" fill="none" stroke="#b09040" stroke-width=".8" opacity=".6"/></svg>`,
  redbull:       `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#1c1f26"/><text x="16" y="10" text-anchor="middle" fill="#e8002d" font-size="5" font-family="Arial Black,sans-serif" font-weight="900">RED BULL</text><text x="16" y="17" text-anchor="middle" fill="#1e41ff" font-size="3.8" font-family="Arial,sans-serif" font-weight="700" letter-spacing="1">RACING</text></svg>`,
  ferrari:       `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#dc0000"/><text x="16" y="13" text-anchor="middle" fill="#ffed00" font-size="8" font-family="Arial Black,sans-serif" font-weight="900">SF</text></svg>`,
  mercedes:      `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#00d2be"/><text x="16" y="13" text-anchor="middle" fill="#fff" font-size="5" font-family="Arial Black,sans-serif" font-weight="900" letter-spacing=".5">AMG</text></svg>`,
  mclaren:       `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#ff8000"/><path d="M3 11 Q16 4 29 11 Q16 18 3 11Z" fill="#c86000" opacity=".7"/><text x="16" y="13" text-anchor="middle" fill="white" font-size="5.5" font-family="Arial Black,sans-serif" font-weight="900">MCL</text></svg>`,
  astonmartin:   `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#006f62"/><path d="M8 14 Q16 6 24 14" stroke="#cedc00" stroke-width="1.5" fill="none"/></svg>`,
  severance:     `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000408"/><text x="16" y="12.5" text-anchor="middle" fill="#0088cc" font-size="5.5" font-family="Arial,sans-serif" font-weight="300" letter-spacing="3" opacity=".9">LUMON</text></svg>`,
  blueprint:     `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#040d1a"/><circle cx="16" cy="11" r="4" stroke="#00cfff" stroke-width="1" fill="none" opacity=".9"/><line x1="12" y1="11" x2="20" y2="11" stroke="#00cfff" stroke-width=".7" opacity=".7"/><line x1="16" y1="7" x2="16" y2="15" stroke="#00cfff" stroke-width=".7" opacity=".7"/></svg>`,
  commonroom:    `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#0d0603"/><circle cx="16" cy="10" r="2.5" fill="#e8a040" opacity=".8"/></svg>`,
  smpte:         `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#0d0d0d"/><rect x="14" y="11" width="2" height="9" fill="#e94560" opacity=".9"/><text x="16" y="9" text-anchor="middle" fill="#e94560" font-size="4" font-family="monospace" opacity=".8">TIMELINE</text></svg>`,
  terminal:      `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000a00"/><text x="4" y="9" fill="#00ff41" font-size="4.5" font-family="monospace" opacity=".7">0f3a 88c1</text><rect x="25" y="11" width="2.5" height="5" fill="#00ff41" opacity=".9"/></svg>`,
  gameoflife:    `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#050a05"/><rect x="5" y="5" width="2" height="2" fill="#00e87a" opacity=".8"/><rect x="9" y="5" width="2" height="2" fill="#00e87a" opacity=".8"/><rect x="7" y="7" width="2" height="2" fill="#00e87a" opacity=".8"/></svg>`,
  cyberpunk:     `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#030010"/><rect x="5" y="7" width="1" height="1" fill="#ff0090" opacity=".9"/><text x="16" y="21" text-anchor="middle" fill="#ff0090" font-size="3.5" font-family="monospace" opacity=".7" letter-spacing="1">NIGHT CITY</text></svg>`,
  hal9000:       `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000000"/><circle cx="16" cy="11" r="7" fill="#880000"/><circle cx="13.5" cy="9" r="1.5" fill="rgba(255,200,200,.15)"/></svg>`,
  tenet:         `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#040408"/><text x="16" y="9" text-anchor="middle" fill="#8888ff" font-size="5" font-family="sans-serif" letter-spacing="2" opacity=".8">TENET</text></svg>`,
  dragonfire:    `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#0e0200"/><path d="M10 18 Q12 10 16 8 Q20 10 22 18" fill="#e84000" opacity=".6"/></svg>`,
  moonknight:    `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#04060e"/><circle cx="21" cy="8" r="5.5" fill="#c8d8ff" opacity=".85"/><circle cx="24" cy="7" r="4.5" fill="#04060e"/></svg>`,
  onepiece:      `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000d1a"/><circle cx="16" cy="8" r="4" fill="#ffcc00" opacity=".9"/></svg>`,
  attackontitan: `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#0a0800"/><path d="M22 22 L26 8 L28 22" fill="#1a1400" stroke="#c8a000" stroke-width=".8"/></svg>`,
  deathnote:     `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#060006"/><rect x="8" y="3" width="16" height="16" rx="2" fill="#0c000c" stroke="#cc00cc" stroke-width=".8"/><text x="16" y="11" text-anchor="middle" font-size="5" fill="#cc00cc" font-family="serif" opacity=".8">死</text></svg>`,
  oppenheimer:   `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#0a0800"/><circle cx="16" cy="11" r="6" fill="none" stroke="#e8a020" stroke-width="1" opacity=".7"/></svg>`,
  mrrobot:       `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#020202"/><text x="16" y="13" text-anchor="middle" fill="#00ff41" font-size="4.5" font-family="monospace" opacity=".8">fsociety</text></svg>`,
};

function makeFallbackLogo(t: Theme): string {
  const cv = document.createElement('canvas'); cv.width = 32; cv.height = 22;
  const cx2 = cv.getContext('2d')!;
  cx2.fillStyle = t.baseBg[0]; cx2.fillRect(0, 0, 32, 22);
  cx2.fillStyle = t.accent; cx2.font = 'bold 8px system-ui';
  cx2.textAlign = 'center'; cx2.textBaseline = 'middle';
  cx2.fillText(t.name.slice(0, 2).toUpperCase(), 16, 11);
  const img = document.createElement('img');
  img.src = cv.toDataURL(); img.style.cssText = 'width:32px;height:22px;display:block';
  const wrap = document.createElement('div'); wrap.appendChild(img);
  return wrap.innerHTML;
}

// Callbacks injected by main.ts
let _applyTheme: ((t: Theme) => void) = () => {};
let _openShareCard: (() => void) = () => {};
let _openThemeBuilder: (() => void) = () => {};
let _buildPomUI: (() => void) = () => {};
let _startAnimedoro: (() => void) = () => {};
let _toggleKiosk: (() => void) = () => {};
let _togglePresent: (() => void) = () => {};
let _focusLockIntercept: ((action: () => void) => void) = (a) => a();

export function initPanel(opts: {
  applyTheme: (t: Theme) => void;
  openShareCard: () => void;
  openThemeBuilder: () => void;
  buildPomUI: () => void;
  startAnimedoro: () => void;
  toggleKiosk: () => void;
  togglePresent: () => void;
  focusLockIntercept: (action: () => void) => void;
}) {
  _applyTheme          = opts.applyTheme;
  _openShareCard       = opts.openShareCard;
  _openThemeBuilder    = opts.openThemeBuilder;
  _buildPomUI          = opts.buildPomUI;
  _startAnimedoro      = opts.startAnimedoro;
  _toggleKiosk         = opts.toggleKiosk;
  _togglePresent       = opts.togglePresent;
  _focusLockIntercept  = opts.focusLockIntercept;
}

let activePanelTab = 'nat';

export function buildPanel() {
  const panelRows = $('themePanelRows'); panelRows.innerHTML = '';
  const featBar   = $('featBar');       featBar.innerHTML   = '';

  // ── Tab bar ──────────────────────────────────────────────────────────
  const tabs = document.createElement('div'); tabs.className = 'panel-tabs';
  const tabDefs: [string, string, string][] = [
    ['nat', '🌿', 'Natural'], ['tv', '📺', 'TV Shows'],
    ['movie', '🎬', 'Movies'], ['anime', '⛩', 'Anime'], ['f1', '🏎', 'F1 Teams'],
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

  const makeNatBtn = (t: Theme) => {
    const btn = document.createElement('button');
    btn.className = 'nat-btn' + (t.id === currentThemeId ? ' active' : '');
    btn.dataset.id = t.id; btn.title = t.name;
    btn.style.background = t.swatch ?? t.accent;
    const tip = document.createElement('span'); tip.className = 'nat-tip'; tip.textContent = t.name;
    btn.appendChild(tip);
    btn.addEventListener('click', () => _applyTheme(t));
    return btn;
  };

  const makeCard = (t: Theme) => {
    const card = document.createElement('button');
    card.className = 'media-card' + (t.id === currentThemeId ? ' active' : '');
    card.dataset.id = t.id;
    card.addEventListener('click', () => _applyTheme(t));
    const logo = document.createElement('div'); logo.className = 'media-logo';
    logo.innerHTML = LOGOS[t.id] ?? makeFallbackLogo(t);
    const nm = document.createElement('div'); nm.className = 'media-name'; nm.textContent = t.name;
    const sb = document.createElement('div'); sb.className = 'media-sub'; sb.style.color = t.accent; sb.textContent = t.sub ?? '';
    const txt = document.createElement('div'); txt.className = 'media-card-text'; txt.append(nm, sb);
    const shopItems = Shop.getItemsForTheme(t.id);
    if (shopItems.length > 0) {
      const owned = Shop.getOwned();
      const ownedCount = shopItems.filter(i => owned.has(i.id)).length;
      const badge = document.createElement('span'); badge.className = 'shop-badge';
      badge.textContent = ownedCount > 0 ? `${ownedCount}/${shopItems.length}` : `${shopItems.length}`;
      badge.title = 'Shop items'; txt.appendChild(badge);
    }
    card.append(logo, txt); return card;
  };

  // Natural tab
  const natContent = document.createElement('div');
  natContent.className = 'tab-content' + (activePanelTab === 'nat' ? ' active' : '');
  natContent.dataset.tab = 'nat';
  const pureNat    = THEMES_BY_CAT.nat.filter(t => !['literary'].includes(t.id));
  const specialNat = THEMES_BY_CAT.nat.filter(t =>  ['literary'].includes(t.id));
  const natGrid = document.createElement('div'); natGrid.className = 'nat-grid';
  pureNat.forEach(t => natGrid.appendChild(makeNatBtn(t)));
  natContent.appendChild(natGrid);
  if (specialNat.length) {
    const specLabel = document.createElement('div'); specLabel.className = 'tab-sub-label'; specLabel.textContent = 'Special';
    const specRow   = document.createElement('div'); specRow.className = 'media-grid';
    specialNat.forEach(t => specRow.appendChild(makeCard(t)));
    natContent.append(specLabel, specRow);
  }
  contents['nat'] = natContent;

  // TV, Movie, Anime, F1
  (['tv', 'movie', 'anime', 'f1'] as const).forEach(cat => {
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
  const featDefs: [string, string, string, () => void][] = [
    ['btnSound',    '🎵', 'Sound',    () => { buildSoundUI(); openModal('soundOverlay'); }],
    ['btnLog',      '📋', 'Log',      openLog],
    ['btnShare',    '🖼', 'Share',    _openShareCard],
    ['btnShop',     '🛒', 'Shop',     openShop],
    ['btnSettings', '⚙️', 'Settings', openSettings],
  ];
  featDefs.forEach(([id, emoji, label, action]) => {
    const b = document.createElement('button'); b.className = 'feat-btn'; b.id = id;
    const iconEl = document.createElement('span'); iconEl.className = 'feat-icon'; iconEl.textContent = emoji;
    const lblEl  = document.createElement('span'); lblEl.className  = 'feat-label';
    if (id === 'btnShop') {
      lblEl.textContent = 'Shop ';
      lblEl.appendChild(createCoinEl(Shop.getTokens()));
    } else {
      lblEl.textContent = label;
    }
    b.append(iconEl, lblEl);
    b.addEventListener('click', action);
    featBar.appendChild(b);
  });
}

export function switchPanelTab(id: string) {
  activePanelTab = id;
  document.querySelectorAll<HTMLElement>('.panel-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  document.querySelectorAll<HTMLElement>('.tab-content').forEach(c => c.classList.toggle('active', c.dataset.tab === id));
}

// Track current theme id for active highlighting — updated by main.ts
let currentThemeId = '';
export function setCurrentThemeId(id: string) { currentThemeId = id; }
