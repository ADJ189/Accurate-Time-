// ═══════════════════════════════════════════════════════════════════════
// RENDER LOOP — single rAF, delta-time capped at 50ms
// ═══════════════════════════════════════════════════════════════════════
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const GREETS = [[0,5,'🌙 Good Night'],[5,12,'☀️ Good Morning'],[12,17,'🌤️ Good Afternoon'],[17,21,'🌆 Good Evening'],[21,24,'🌙 Good Night']];

// Cached DOM refs — zero querySelector per frame
const DOM = {
  timeDis:    /** @type {HTMLElement} */ (document.getElementById('timeDis')),
  ampmDis:    /** @type {HTMLElement} */ (document.getElementById('ampmDis')),
  secMs:      /** @type {HTMLElement} */ (document.getElementById('secMs')),
  dateDis:    /** @type {HTMLElement} */ (document.getElementById('dateDis')),
  dayPct:     /** @type {HTMLElement} */ (document.getElementById('dayPct')),
  pFill:      /** @type {HTMLElement} */ (document.getElementById('progressFill')),
  sTmr:       /** @type {HTMLElement} */ (document.getElementById('sessionTimer')),
  utcPill:    /** @type {HTMLElement} */ (document.getElementById('utcPill')),
  greeting:   /** @type {HTMLElement} */ (document.getElementById('greeting')),
  quoteText:  /** @type {HTMLElement} */ (document.getElementById('quoteText')),
  syncDot:    /** @type {HTMLElement} */ (document.getElementById('syncDot')),
  syncLabel:  /** @type {HTMLElement} */ (document.getElementById('syncLabel'))
};

let lastSec  = -1;
let lastQIdx = -1;

/** @param {number} ts */
function renderFrame(ts) {
  requestAnimationFrame(renderFrame);
  const dt = Math.min((ts - lastTs) / 1000, .05);
  lastTs = ts;

  drawBg(dt);

  const now   = new Date(Date.now() + clockOffset);
  const ms    = now.getMilliseconds();
  const sec   = now.getSeconds();
  const min   = now.getMinutes();
  const hr    = now.getHours();
  const hr12  = hr % 12 || 12;
  const ampm  = hr >= 12 ? 'PM' : 'AM';

  DOM.timeDis.textContent = p2(hr12)+':'+p2(min)+':'+p2(sec);
  DOM.ampmDis.textContent = ampm;
  DOM.secMs.textContent   = '.'+p3(ms);

  const dp = ((hr*3600+min*60+sec)*1000+ms) / 864e5 * 100;
  DOM.pFill.style.width = dp.toFixed(4)+'%';

  if (sessionRunning) DOM.sTmr.textContent = fmtSession(performance.now()-sessionStart);

  if (sec !== lastSec) {
    lastSec = sec;
    const uh=now.getUTCHours(), um=now.getUTCMinutes(), us=now.getUTCSeconds();
    DOM.utcPill.textContent = 'UTC '+p2(uh)+':'+p2(um)+':'+p2(us);
    DOM.dateDis.textContent = DAYS[now.getDay()]+', '+MONTHS[now.getMonth()]+' '+now.getDate()+', '+now.getFullYear();
    const g = GREETS.find(x => hr >= x[0] && hr < x[1]);
    if (g) DOM.greeting.textContent = g[2];
    DOM.dayPct.textContent = dp.toFixed(1)+'%';
    const qs = currentTheme.quotes || NAT_QUOTES;
    const qi = ((hr*60+min)/5|0) % qs.length;
    if (qi !== lastQIdx) {
      lastQIdx = qi;
      DOM.quoteText.style.opacity = '0';
      setTimeout(() => { DOM.quoteText.textContent = '"'+qs[qi]+'"'; DOM.quoteText.style.opacity = '.38'; }, 400);
    }
  }
}

