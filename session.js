// ═══════════════════════════════════════════════════════════════════════
// SESSION TIMER
// ═══════════════════════════════════════════════════════════════════════
let sessionRunning = false;
let sessionStart   = 0;
let sessionElapsed = 0;

document.getElementById('btnStart').addEventListener('click', () => {
  sessionRunning = !sessionRunning;
  if (sessionRunning) {
    sessionStart = performance.now() - sessionElapsed;
    document.getElementById('btnStart').textContent = 'Pause';
  } else {
    sessionElapsed = performance.now() - sessionStart;
    document.getElementById('btnStart').textContent = 'Resume';
  }
});

document.getElementById('btnReset').addEventListener('click', () => {
  sessionRunning = false;
  sessionStart = sessionElapsed = 0;
  document.getElementById('btnStart').textContent = 'Start';
  document.getElementById('sessionTimer').textContent = '00:00:00';
});

/** @param {number} ms @returns {string} */
function fmtSession(ms) {
  const s=ms/1000|0, h=s/3600|0, m=(s%3600)/60|0, sc=s%60;
  return p2(h)+':'+p2(m)+':'+p2(sc);
}

