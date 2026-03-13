// ═══════════════════════════════════════════════════════════════════════
// PANEL BUILD — built once on init
// ═══════════════════════════════════════════════════════════════════════
function buildPanel() {
  const panel = document.getElementById('themePanel');
  panel.innerHTML = '';

  /**
   * @param {string} label
   * @param {Theme[]} items
   * @param {(t:Theme)=>HTMLElement} makeItem
   * @returns {HTMLElement}
   */
  const makeRow = (label, items, makeItem) => {
    const row = document.createElement('div');
    row.className = 'theme-row';
    const lbl = document.createElement('span');
    lbl.className = 'row-label';
    lbl.textContent = label;
    row.appendChild(lbl);
    items.forEach(t => row.appendChild(makeItem(t)));
    return row;
  };

  const makeDivider = () => {
    const d = document.createElement('div');
    d.className = 'row-divider';
    return d;
  };

  /** @param {Theme} t @returns {HTMLButtonElement} */
  const makeNatBtn = (t) => {
    const btn = /** @type {HTMLButtonElement} */ (document.createElement('button'));
    btn.className = 'nat-btn';
    btn.dataset.id = t.id;
    btn.title = t.name;
    btn.style.background = t.swatch || t.accent;
    btn.addEventListener('click', () => applyTheme(t));
    return btn;
  };

  /** @param {Theme} t @returns {HTMLButtonElement} */
  const makeCard = (t) => {
    const card = /** @type {HTMLButtonElement} */ (document.createElement('button'));
    card.className = 'media-card';
    card.dataset.id = t.id;
    card.addEventListener('click', () => applyTheme(t));

    const logo = document.createElement('div');
    logo.className = 'media-logo';
    logo.innerHTML = LOGOS[t.id] ||
      `<svg viewBox="0 0 32 22"><rect width="32" height="22" fill="${t.baseBg[0]}"/><text x="16" y="14" text-anchor="middle" fill="${t.accent}" font-size="8" font-weight="700">${t.name.slice(0,2).toUpperCase()}</text></svg>`;

    const txt = document.createElement('div');
    txt.style.cssText = 'display:flex;flex-direction:column';

    const nm = document.createElement('div');
    nm.className = 'media-name';
    nm.textContent = t.name;

    const sb = document.createElement('div');
    sb.className = 'media-sub';
    sb.style.color = t.accent;
    sb.textContent = t.sub || '';

    txt.append(nm, sb);
    card.append(logo, txt);
    return card;
  };

  panel.appendChild(makeRow('Themes',   THEMES_BY_CAT.nat,   makeNatBtn));
  panel.appendChild(makeDivider());
  panel.appendChild(makeRow('F1 Teams', THEMES_BY_CAT.f1,    makeCard));
  panel.appendChild(makeDivider());
  panel.appendChild(makeRow('TV Shows', THEMES_BY_CAT.tv,    makeCard));
  panel.appendChild(makeDivider());
  panel.appendChild(makeRow('Movies',   THEMES_BY_CAT.movie, makeCard));
}

