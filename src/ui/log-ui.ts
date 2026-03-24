// ── Focus Log UI ──────────────────────────────────────────────────────
import * as Log from '../focuslog';
import { $, openModal } from './modals';

let logView: 'list' | 'heatmap' = 'list';

export function openLog() {
  renderLogView();
  openModal('logOverlay');
}

export function renderLogView() {
  const listBtn = $('logTabList');
  const heatBtn = $('logTabHeat');
  const container = $('logEntries');
  if (listBtn) listBtn.classList.toggle('active', logView === 'list');
  if (heatBtn) heatBtn.classList.toggle('active', logView === 'heatmap');
  if (logView === 'heatmap') Log.renderHeatmap(container);
  else Log.render(container);
}

export function switchLogTab(tab: 'list' | 'heatmap') {
  logView = tab;
  renderLogView();
}

export function initLogUI() {
  (window as any).SC = {
    ...((window as any).SC ?? {}),
    focusLog: {
      exportCSV: Log.exportCSV,
      clear: () => { Log.clear(); renderLogView(); },
      switchTab: switchLogTab,
    },
  };
}
