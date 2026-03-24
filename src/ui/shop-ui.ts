// ── Token Shop UI ─────────────────────────────────────────────────────
import * as Shop from '../shop';
import { THEMES_BY_CAT, THEME_BY_ID } from '../themes';
import { $, openModal } from './modals';

// ── Shop SVG art (developer-authored, safe for innerHTML) ─────────────
export const SHOP_SVG: Record<string, string> = {
  sn_colt:      `<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="14" width="34" height="6" rx="1.5" fill="#8B6914"/><rect x="34" y="13" width="12" height="8" rx="1" fill="#7a5c10"/><rect x="2" y="16" width="30" height="2" rx="1" fill="#c8a850" opacity=".4"/><rect x="8" y="20" width="20" height="9" rx="2" fill="#6b4d0e"/><circle cx="40" cy="17" r="2.5" fill="#3d2c06"/><rect x="35" y="8" width="3" height="5" rx="1" fill="#6b4d0e"/><rect x="1" y="15" width="5" height="4" rx="1" fill="#5a3e09"/></svg>`,
  sn_impala:    `<svg viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="12" width="44" height="10" rx="2" fill="#111"/><path d="M8 12 Q12 5 20 5 L32 5 Q38 5 42 12Z" fill="#111"/><rect x="4" y="19" width="8" height="4" rx="2" fill="#222"/><rect x="36" y="19" width="8" height="4" rx="2" fill="#222"/><rect x="12" y="7" width="10" height="5" rx="1" fill="#1a3a5c" opacity=".8"/><rect x="26" y="7" width="10" height="5" rx="1" fill="#1a3a5c" opacity=".8"/><rect x="2" y="14" width="6" height="4" rx="1" fill="#e8b800" opacity=".9"/><rect x="40" y="14" width="6" height="4" rx="1" fill="#e8b800" opacity=".9"/></svg>`,
  sn_pentagram: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" stroke="#c84000" stroke-width="1.5" fill="none"/><polygon points="16,3 19.5,13 30,13 21.5,19 24.5,30 16,23.5 7.5,30 10.5,19 2,13 12.5,13" fill="none" stroke="#e05500" stroke-width="1.2" stroke-linejoin="round"/><circle cx="16" cy="16" r="3" fill="#e05500" opacity=".6"/></svg>`,
  mn_redj:      `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" fill="#8b0000"/><circle cx="10" cy="12" r="2.5" fill="#ff2200"/><circle cx="22" cy="12" r="2.5" fill="#ff2200"/><path d="M8 22 Q16 28 24 22" stroke="#ff2200" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
  mn_card:      `<svg viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="30" height="42" rx="3" fill="#f8f0e0" stroke="#ccc" stroke-width="1"/><text x="16" y="26" text-anchor="middle" font-size="20" fill="#cc1100">♠</text></svg>`,
  bb_hat:       `<svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="24" rx="22" ry="5" fill="#1a1a1a"/><path d="M6 24 Q6 8 24 8 Q42 8 42 24" fill="#0a0a0a"/><ellipse cx="24" cy="24" rx="22" ry="5" fill="none" stroke="#333" stroke-width="1"/></svg>`,
  bb_crystal:   `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="16,2 26,10 26,22 16,30 6,22 6,10" fill="#88ccff" opacity=".7" stroke="#5599ff" stroke-width="1"/><polygon points="16,2 26,10 16,14" fill="#aaddff" opacity=".5"/></svg>`,
  bb_pizza:     `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 3 L30 28 Q16 30 2 28 Z" fill="#e8a820"/><circle cx="12" cy="20" r="2" fill="#cc2200"/><circle cx="20" cy="16" r="1.5" fill="#cc2200"/><circle cx="16" cy="24" r="1.5" fill="#cc2200"/></svg>`,
  dk_knot:      `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4 C24 4 28 10 26 16 C24 22 18 24 16 24 C14 24 8 22 6 16 C4 10 8 4 16 4 Z" fill="none" stroke="#8888ff" stroke-width="2"/><circle cx="16" cy="16" r="2" fill="#aaaaff"/></svg>`,
  dk_clock:     `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" stroke="#8888aa" stroke-width="1.5" fill="#0a0a14"/><circle cx="16" cy="16" r="1.5" fill="#aaaacc"/><line x1="16" y1="6" x2="16" y2="12" stroke="#aaaacc" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="16" x2="22" y2="18" stroke="#888899" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  st_lights:    `<svg viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10 Q12 4 24 10 Q36 16 44 10" stroke="#555" stroke-width="1" fill="none"/><circle cx="4" cy="8" r="2.5" fill="#ff2200" opacity=".9"/><circle cx="12" cy="12" r="2.5" fill="#00cc00" opacity=".9"/><circle cx="20" cy="8" r="2.5" fill="#ffee00" opacity=".9"/><circle cx="28" cy="12" r="2.5" fill="#0088ff" opacity=".9"/><circle cx="36" cy="8" r="2.5" fill="#ff4400" opacity=".9"/><circle cx="44" cy="12" r="2.5" fill="#cc00cc" opacity=".9"/></svg>`,
  st_eggo:      `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="26" height="26" rx="4" fill="#c8a020"/><line x1="16" y1="3" x2="16" y2="29" stroke="#a88010" stroke-width="1"/><line x1="3" y1="16" x2="29" y2="16" stroke="#a88010" stroke-width="1"/></svg>`,
  in_watch:     `<svg viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="1" width="12" height="6" rx="2" fill="#333"/><rect x="8" y="33" width="12" height="6" rx="2" fill="#333"/><rect x="2" y="7" width="24" height="26" rx="5" fill="#222" stroke="#555" stroke-width="1"/><circle cx="14" cy="20" r="9" fill="#111" stroke="#444" stroke-width="1"/><line x1="14" y1="13" x2="14" y2="20" stroke="#888" stroke-width="1.2" stroke-linecap="round"/><line x1="14" y1="20" x2="19" y2="22" stroke="#666" stroke-width="1" stroke-linecap="round"/></svg>`,
  du_crysknife: `<svg viewBox="0 0 12 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2 L9 20 L9 34 L6 42 L3 34 L3 20 Z" fill="#e8d8b0" stroke="#c8b880" stroke-width=".8"/><rect x="3" y="32" width="6" height="10" rx="1.5" fill="#8B6914"/></svg>`,
  du_spice:     `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="20" rx="12" ry="8" fill="#c86420"/><ellipse cx="16" cy="16" rx="12" ry="8" fill="#e08840"/><ellipse cx="16" cy="13" rx="6" ry="2.5" fill="#f0a050" opacity=".5"/></svg>`,
  mx_pill:      `<svg viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="14" height="14" rx="7" fill="#cc0000"/><rect x="17" y="1" width="14" height="14" rx="7" fill="#1a1a1a" stroke="#444" stroke-width="1"/><rect x="15" y="5" width="2" height="6" fill="#888"/></svg>`,
  br_origami:   `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="16,3 28,20 22,20 28,29 4,29 10,20 4,20" fill="#e8e0d0" stroke="#c8c0b0" stroke-width="1"/><line x1="16" y1="3" x2="16" y2="29" stroke="#c8c0b0" stroke-width=".8"/></svg>`,
  ic_totem:     `<svg viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="28" rx="8" ry="4" fill="#888" opacity=".3"/><path d="M4 28 L10 4 L16 28 Z" fill="#aaa" stroke="#888" stroke-width="1"/><ellipse cx="10" cy="28" rx="6" ry="3" fill="#999"/></svg>`,
  gf_offer:     `<svg viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 14 C4 8 10 4 16 6 C22 4 28 8 28 14 C28 20 22 24 16 24 C10 24 4 20 4 14Z" fill="#1a0a00" stroke="#4a2000" stroke-width="1"/><path d="M10 14 L14 18 L22 10" stroke="#c8a060" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  f1rb_trophy:  `<svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="32" width="12" height="4" rx="1" fill="#c8a820"/><rect x="6" y="36" width="20" height="3" rx="1" fill="#a88810"/><path d="M8 4 L8 24 Q8 32 16 32 Q24 32 24 24 L24 4 Z" fill="#f0c020"/><ellipse cx="16" cy="4" rx="8" ry="2" fill="#f8d030"/></svg>`,
  f1fe_horse:   `<svg viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 28 C14 28 6 22 6 14 C6 8 10 4 14 4 C18 4 22 8 22 14 C22 22 14 28 14 28Z" fill="#ff2800"/><path d="M14 6 C14 6 10 10 10 14 L14 13 L18 14 C18 10 14 6 14 6Z" fill="#1a1a1a"/></svg>`,
  cp_shard:     `<svg viewBox="0 0 24 32" fill="none"><rect x="2" y="1" width="20" height="30" rx="3" fill="#0a0020" stroke="#ff0090" stroke-width=".8"/><rect x="5" y="6" width="14" height="2" rx="1" fill="#ff0090" opacity=".7"/><rect x="5" y="10" width="10" height="2" rx="1" fill="#00eeff" opacity=".6"/><circle cx="12" cy="26" r="2" fill="#ff0090" opacity=".8"/></svg>`,
  cp_katana:    `<svg viewBox="0 0 8 44" fill="none"><rect x="2" y="2" width="4" height="32" rx="2" fill="#c0c0c0"/><rect x="1" y="32" width="6" height="2" rx="1" fill="#ff0090" opacity=".9"/><rect x="1.5" y="34" width="5" height="9" rx="1.5" fill="#1a0030"/></svg>`,
  cp_ripperdoc: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" fill="#0a0020" stroke="#ff0090" stroke-width="1"/><path d="M10 16 L13 10 L16 16 L19 12 L22 16" stroke="#00eeff" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="16" cy="16" r="2" fill="#ff0090"/></svg>`,
  hal_eye:      `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="#000"/><circle cx="16" cy="16" r="10" fill="#880000"/><circle cx="16" cy="16" r="6" fill="#cc0000"/><circle cx="16" cy="16" r="2" fill="#ff0000"/></svg>`,
  hal_mono:     `<svg viewBox="0 0 12 28" fill="none"><rect x="1" y="1" width="10" height="26" rx="1" fill="#050505" stroke="rgba(255,220,100,.2)" stroke-width=".5"/></svg>`,
  hal_pod:      `<svg viewBox="0 0 32 24" fill="none"><ellipse cx="16" cy="12" rx="14" ry="10" fill="#111" stroke="#444" stroke-width="1"/><circle cx="16" cy="12" r="5" fill="#222"/><circle cx="16" cy="12" r="1.5" fill="#cc0000" opacity=".7"/></svg>`,
  tn_invert:    `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" fill="#040408" stroke="#8888ff" stroke-width=".8"/><path d="M10 12 L22 12 L16 8 Z" fill="#8888ff" opacity=".7"/><path d="M10 20 L22 20 L16 24 Z" fill="#ff8800" opacity=".7"/></svg>`,
  tn_alg:       `<svg viewBox="0 0 28 28" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" fill="#040408" stroke="#8888ff" stroke-width=".8"/><rect x="15" y="1" width="12" height="12" rx="2" fill="#040408" stroke="#ff8800" stroke-width=".8"/><rect x="1" y="15" width="12" height="12" rx="2" fill="#040408" stroke="#ff8800" stroke-width=".8"/><rect x="15" y="15" width="12" height="12" rx="2" fill="#040408" stroke="#8888ff" stroke-width=".8"/></svg>`,
  hd_egg:       `<svg viewBox="0 0 20 28" fill="none"><ellipse cx="10" cy="15" rx="8" ry="12" fill="#1a0800" stroke="#e84000" stroke-width=".8"/></svg>`,
  hd_crown:     `<svg viewBox="0 0 32 20" fill="none"><path d="M2 18 L2 8 L8 14 L16 4 L24 14 L30 8 L30 18 Z" fill="#1a0800" stroke="#e84000" stroke-width="1"/><rect x="2" y="16" width="28" height="3" rx="1" fill="#e84000" opacity=".8"/><circle cx="16" cy="5" r="2" fill="#ffa020"/></svg>`,
  hd_scale:     `<svg viewBox="0 0 24 20" fill="none"><path d="M12 2 L20 8 L20 14 L12 18 L4 14 L4 8 Z" fill="#e84000" opacity=".6" stroke="#ffa020" stroke-width=".8"/></svg>`,
  mk_scarab:    `<svg viewBox="0 0 28 20" fill="none"><ellipse cx="14" cy="12" rx="7" ry="6" fill="#ffd080" opacity=".8"/><ellipse cx="14" cy="10" rx="4" ry="3" fill="#c8a000" opacity=".6"/></svg>`,
  mk_ankh:      `<svg viewBox="0 0 16 28" fill="none"><circle cx="8" cy="7" r="4.5" fill="none" stroke="#c8d8ff" stroke-width="1.5"/><line x1="8" y1="11.5" x2="8" y2="26" stroke="#c8d8ff" stroke-width="1.5"/><line x1="3" y1="18" x2="13" y2="18" stroke="#c8d8ff" stroke-width="1.5"/></svg>`,
  mk_crescent:  `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#c8d8ff" opacity=".8"/><circle cx="15.5" cy="10.5" r="8" fill="#04060e"/></svg>`,
  f1mc_papaya:  `<svg viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="30" height="12" rx="3" fill="#ff8000"/><path d="M1 10 L8 4 L8 16 Z" fill="#1a1a1a"/><text x="16" y="13" text-anchor="middle" font-size="7" font-weight="bold" fill="white">McLAREN</text></svg>`,
};

// ── Coin SVG ──────────────────────────────────────────────────────────
export const COIN_SVG = `<svg class="token-coin" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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

export function createCoinEl(count: number): HTMLElement {
  const wrap = document.createElement('span'); wrap.className = 'feat-tokens';
  wrap.innerHTML = COIN_SVG;
  const cnt = document.createElement('span'); cnt.className = 'token-count';
  cnt.textContent = String(count);
  wrap.appendChild(cnt);
  return wrap;
}

export function coinHTML(count: number): string {
  return `${COIN_SVG}<span class="token-count">${count}</span>`;
}

// ── Award tokens ──────────────────────────────────────────────────────
let _toast: (msg: string) => void = () => {};
export function setShopToast(fn: (msg: string) => void) { _toast = fn; }

export function awardTokens(minutes: number) {
  const tokens = Math.max(1, Math.floor(minutes / 5));
  Shop.addTokens(tokens);
  const shopBtn = $('btnShop');
  if (shopBtn) {
    shopBtn.innerHTML = `🛒 Shop ${coinHTML(Shop.getTokens())}`;
    const pop = document.createElement('div');
    pop.className = 'token-pop'; pop.textContent = `+${tokens}`;
    shopBtn.appendChild(pop);
    setTimeout(() => pop.remove(), 1200);
  }
  const tokenEl = $('shopTokenDisplay');
  if (tokenEl) tokenEl.innerHTML = coinHTML(Shop.getTokens());
}

// ── Shop panel ────────────────────────────────────────────────────────
let shopTab = 'tv';

export function openShop() { buildShopUI(); openModal('shopOverlay'); }

export function buildShopUI(tab?: string) {
  if (tab) shopTab = tab;
  const grid    = $('shopGrid');
  const tabsEl  = $('shopTabs');
  const tokenEl = $('shopTokenDisplay');
  if (!grid || !tabsEl) return;
  if (tokenEl) tokenEl.innerHTML = coinHTML(Shop.getTokens());

  const shopTabDefs: [string, string][] = [
    ['tv', '📺 TV'], ['movie', '🎬 Movies'], ['f1', '🏎 F1'], ['nat', '🌿 Special'],
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
    : THEMES_BY_CAT[shopTab as 'tv' | 'movie' | 'f1'].map(t => t.id);

  const items    = Shop.SHOP_ITEMS.filter(i => catThemes.includes(i.themeId));
  const owned    = Shop.getOwned();
  const equipped = Shop.getEquipped();

  grid.innerHTML = '';
  if (items.length === 0) {
    const empty = document.createElement('p'); empty.className = 'shop-empty';
    empty.textContent = 'No items in this category yet.';
    grid.appendChild(empty); return;
  }

  const byTheme = new Map<string, typeof items>();
  items.forEach(item => {
    if (!byTheme.has(item.themeId)) byTheme.set(item.themeId, []);
    byTheme.get(item.themeId)!.push(item);
  });

  byTheme.forEach((themeItems, themeId) => {
    const theme = THEME_BY_ID[themeId]; if (!theme) return;
    const section = document.createElement('div'); section.className = 'shop-section';
    const header  = document.createElement('div'); header.className = 'shop-section-header';
    header.style.borderColor = theme.accent + '44';
    const nameSpan = document.createElement('span'); nameSpan.className = 'shop-section-name';
    nameSpan.style.color = theme.accent; nameSpan.textContent = theme.name;
    header.appendChild(nameSpan); section.appendChild(header);

    const itemsGrid = document.createElement('div'); itemsGrid.className = 'shop-items-grid';
    themeItems.forEach(item => {
      const isOwned    = owned.has(item.id);
      const isEquipped = equipped.has(item.id);
      const card = document.createElement('div');
      card.className = ['shop-item', isOwned ? 'owned' : '', isEquipped ? 'equipped' : ''].filter(Boolean).join(' ');

      const iconEl = document.createElement('div'); iconEl.className = 'shop-item-icon';
      const svgArt = SHOP_SVG[item.id];
      if (svgArt) iconEl.innerHTML = svgArt;
      else        iconEl.textContent = item.icon;

      const info    = document.createElement('div'); info.className = 'shop-item-info';
      const nameEl  = document.createElement('div'); nameEl.className = 'shop-item-name'; nameEl.textContent = item.name;
      const descEl  = document.createElement('div'); descEl.className = 'shop-item-desc'; descEl.textContent = item.desc;
      info.append(nameEl, descEl);

      const action = document.createElement('div'); action.className = 'shop-item-action';
      if (isOwned) {
        const equipBtn = document.createElement('button');
        equipBtn.className = 'shop-equip-btn' + (isEquipped ? ' on' : '');
        equipBtn.textContent = isEquipped ? '✓ On' : 'Equip';
        equipBtn.addEventListener('click', () => { Shop.toggleEquip(item.id); buildShopUI(); });
        action.appendChild(equipBtn);
      } else {
        const buyBtn = document.createElement('button'); buyBtn.className = 'shop-buy-btn';
        buyBtn.disabled = Shop.getTokens() < item.cost;
        const costSpan = document.createElement('span'); costSpan.className = 'shop-cost';
        costSpan.textContent = `🪙 ${item.cost}`;
        buyBtn.appendChild(costSpan);
        buyBtn.addEventListener('click', () => {
          const result = Shop.buyItem(item.id);
          if (result === 'ok') { buildShopUI(); }
          else if (result === 'poor') { card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 500); }
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
