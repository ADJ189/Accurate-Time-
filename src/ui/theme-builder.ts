// ── Custom Theme Builder ──────────────────────────────────────────────
import { $, openModal } from './modals';

const THEME_FIELDS = [
  { key: 'text',    label: 'Text color'    },
  { key: 'accent',  label: 'Accent (main)' },
  { key: 'accent2', label: 'Accent 2'      },
  { key: 'btnFg',   label: 'Button text'   },
  { key: 'panel',   label: 'Panel BG'      },
  { key: 'baseBg0', label: 'Background'    },
];

let draft: Record<string, string> = {
  text: '#e0f2fe', accent: '#6ee7b7', accent2: '#818cf8',
  btnFg: '#6ee7b7', panel: 'rgba(4,3,18,.7)', baseBg0: '#06030f',
};

const rgbaToHex = (s: string) => {
  const m = s.match(/[\d.]+/g);
  return m ? '#' + [m[0], m[1], m[2]].map(v => parseInt(v).toString(16).padStart(2, '0')).join('') : '#ffffff';
};

// Callback set by main.ts so theme-builder can preview without circular import
let _onPreview: ((d: Record<string, string>) => void) | null = null;
export function setPreviewCallback(fn: (d: Record<string, string>) => void) { _onPreview = fn; }

export function buildColorRows() {
  const container = $('colorRows'); if (!container) return;
  container.innerHTML = '';

  THEME_FIELDS.forEach(f => {
    const raw = draft[f.key] ?? '#ffffff';
    const hex = (raw.startsWith('rgba') || raw.startsWith('rgb')) ? rgbaToHex(raw) : raw;

    const row   = document.createElement('div'); row.className = 'color-row';
    const label = document.createElement('span'); label.className = 'color-label'; label.textContent = f.label;
    const wrap  = document.createElement('div'); wrap.className = 'color-picker-wrap';
    const inp   = document.createElement('input') as HTMLInputElement;
    inp.type = 'color'; inp.value = hex; inp.dataset.key = f.key;
    const hexSpan = document.createElement('span');
    hexSpan.className = 'color-hex'; hexSpan.id = 'hex_' + f.key; hexSpan.textContent = hex;
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

export function previewCustomTheme() {
  _onPreview?.(draft);
}

export function saveCustomTheme() {
  const saved: { id: string; name: string; draft: typeof draft }[] =
    JSON.parse(localStorage.getItem('sc_custom_themes') || '[]');
  saved.push({ id: 'custom_' + Date.now(), name: 'Custom ' + saved.length, draft: { ...draft } });
  if (saved.length > 10) saved.shift();
  localStorage.setItem('sc_custom_themes', JSON.stringify(saved));
  renderSavedSwatches();
  alert('Custom theme saved!');
}

export function renderSavedSwatches() {
  const row = $('savedThemeRow'); if (!row) return;
  const saved: { id: string; name: string; draft: typeof draft }[] =
    JSON.parse(localStorage.getItem('sc_custom_themes') || '[]');
  row.innerHTML = '';
  if (!saved.length) {
    const msg = document.createElement('span');
    msg.style.cssText = 'font-size:.65rem;opacity:.3;color:var(--clr-text)';
    msg.textContent = 'No saved themes yet';
    row.appendChild(msg); return;
  }
  saved.forEach(item => {
    const sw = document.createElement('div');
    sw.className = 'saved-swatch'; sw.style.background = item.draft.accent; sw.title = item.name;
    sw.onclick = () => { draft = { ...item.draft }; previewCustomTheme(); buildColorRows(); };
    row.appendChild(sw);
  });
}

export function openThemeBuilder() {
  buildColorRows();
  openModal('themeBuilderOverlay');
}

export function initThemeBuilder(
  onPreview: (d: Record<string, string>) => void,
  onReset: () => void,
) {
  setPreviewCallback(onPreview);
  (window as any).SC = {
    ...((window as any).SC ?? {}),
    themeBuilder: {
      preview: previewCustomTheme,
      save: saveCustomTheme,
      reset: onReset,
      openBuilder: openThemeBuilder,
    },
  };
}
