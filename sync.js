// ═══════════════════════════════════════════════════════════════════════
// TIME SYNC — async, non-blocking
// ═══════════════════════════════════════════════════════════════════════
// ── Clock sync state ──────────────────────────────────────────────────
let clockOffset  = 0;   // ms to add to Date.now() to get true time
let synced       = false;
let lastSyncAt   = 0;   // performance.now() of last successful sync
let syncAttempts = 0;

// Cloudflare PoP endpoints — browser routes to nearest edge automatically.
// We probe all of them in parallel and keep the lowest-RTT result.
const CF_ENDPOINTS = [
  'https://cloudflare.com/cdn-cgi/trace',
  'https://1.1.1.1/cdn-cgi/trace',
  'https://one.one.one.one/cdn-cgi/trace'
];

// Fallback if all Cloudflare probes fail
const FALLBACK_ENDPOINT = 'https://worldtimeapi.org/api/ip';

/**
 * Probe one URL and return { serverMs, rtt } or null.
 * Uses the HTTP Date response header (1-second resolution) compensated
 * for half-RTT to estimate the true server time at moment of response.
 * @param {string} url
 * @param {number} timeoutMs
 * @returns {Promise<{serverMs:number, rtt:number}|null>}
 */
async function probeEndpoint(url, timeoutMs) {
  try {
    const t0  = performance.now();
    const res = await fetch(url, {
      cache:  'no-store',
      signal: AbortSignal.timeout(timeoutMs)
    });
    const rtt = performance.now() - t0;
    const ds  = res.headers.get('date');
    if (!ds) return null;
    // Consume body so connection is reused (keep-alive)
    res.text().catch(() => {});
    return { serverMs: new Date(ds).getTime(), rtt };
  } catch {
    return null;
  }
}

/**
 * Same endpoint, multiple rapid probes — returns median offset to smooth
 * over HTTP Date's 1-second granularity. Each probe fires sequentially
 * to avoid congestion; we want the tightest RTT, not parallelism here.
 * @param {string} url
 * @param {number} probes   number of sequential probes
 * @param {number} timeout  per-probe timeout ms
 * @returns {Promise<{offset:number, rtt:number}|null>}
 */
async function multiProbe(url, probes, timeout) {
  const results = [];
  for (let i = 0; i < probes; i++) {
    const r = await probeEndpoint(url, timeout);
    if (r) {
      // offset = server_time_at_midpoint − local_time_at_midpoint
      // midpoint of request = t0 + rtt/2  →  local time = Date.now() − rtt/2
      // But we captured t0 relative to performance.now(), so reconstruct:
      // localAtMidpoint ≈ Date.now() − rtt/2 at probe time
      // We stored serverMs and rtt; reconstruct localAtMidpoint:
      const localAtMidpoint = Date.now() - r.rtt / 2;
      results.push({ offset: r.serverMs - localAtMidpoint, rtt: r.rtt });
    }
    // tiny gap between probes to let the TCP stack breathe
    if (i < probes - 1) await new Promise(res => setTimeout(res, 80));
  }
  if (!results.length) return null;
  // Sort by RTT; pick lowest-RTT result (most accurate half-RTT estimate)
  results.sort((a, b) => a.rtt - b.rtt);
  return results[0];
}

/**
 * Main sync function.
 * Strategy:
 *   1. Fire all CF_ENDPOINTS in parallel (each gets 3 sequential probes).
 *   2. Keep the single result with the lowest RTT across all endpoints.
 *   3. Fall back to WorldTimeAPI if every CF probe failed.
 *   4. Update clockOffset, UI, and schedule the next sync.
 */
async function syncTime() {
  syncAttempts++;
  updateSyncUI('syncing');

  // Step 1 — parallel multi-probe across all CF endpoints
  const cfResults = await Promise.all(
    CF_ENDPOINTS.map(url => multiProbe(url, 3, 2500))
  );

  // Step 2 — pick best CF result
  let best = null;
  for (const r of cfResults) {
    if (r && (!best || r.rtt < best.rtt)) best = r;
  }

  // Step 3 — fallback
  if (!best) {
    try {
      const t0  = performance.now();
      const res = await fetch(FALLBACK_ENDPOINT, {
        cache:  'no-store',
        signal: AbortSignal.timeout(5000)
      });
      const rtt = performance.now() - t0;
      const d   = await res.json();
      // WorldTimeAPI provides sub-second precision in 'datetime' field
      const serverMs = new Date(d.datetime).getTime();
      best = { offset: serverMs - (Date.now() - rtt / 2), rtt };
    } catch { /* will surface as null */ }
  }

  if (!best) {
    updateSyncUI('failed');
    // Retry in 60 s if this was a startup failure, otherwise wait full interval
    const retryMs = synced ? SYNC_INTERVAL_MS : 60_000;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncTime, retryMs);
    return;
  }

  // Step 4 — apply
  clockOffset = best.offset;
  synced      = true;
  lastSyncAt  = performance.now();
  updateSyncUI('ok', best.rtt);

  // Schedule next sync
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncTime, SYNC_INTERVAL_MS);
}

/** @param {'syncing'|'ok'|'failed'} state @param {number} [rtt] */
function updateSyncUI(state, rtt) {
  const dot   = DOM.syncDot   || document.getElementById('syncDot');
  const label = DOM.syncLabel || document.getElementById('syncLabel');
  if (!dot || !label) return;
  if (state === 'syncing') {
    dot.style.background   = '#f59e0b';
    label.textContent      = 'Syncing…';
  } else if (state === 'ok') {
    dot.style.background   = currentTheme ? currentTheme.accent : '#6ee7b7';
    const ms               = Math.abs(Math.round(clockOffset));
    const rttStr           = rtt != null ? ` · ${Math.round(rtt)}ms RTT` : '';
    label.textContent      = `Synced · ±${ms}ms${rttStr}`;
  } else {
    dot.style.background   = '#ef4444';
    label.textContent      = 'Local clock';
  }
}

// 15-minute interval (ms). Cloudflare doesn't rate-limit /cdn-cgi/trace
// and the endpoint is designed for this kind of lightweight polling.
const SYNC_INTERVAL_MS = 15 * 60 * 1000;
/** @type {ReturnType<typeof setTimeout>} */
let syncTimer;

