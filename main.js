// ═══════════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════════
function init() {
  resize();
  buildPanel();
  applyTheme(THEMES[0], true);
  requestAnimationFrame(ts => { lastTs = ts; renderFrame(ts); });
  syncTime(); // self-reschedules every SYNC_INTERVAL_MS (15 min)
}

init();
