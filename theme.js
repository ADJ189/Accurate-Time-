// ═══════════════════════════════════════════════════════════════════════
// THEME APPLICATION — CSS custom properties only, minimal DOM writes
// ═══════════════════════════════════════════════════════════════════════
let currentTheme = THEMES[0];
const root = document.documentElement;

/** @param {string} name @param {string} val */
function setCSSVar(name, val) { root.style.setProperty(name, val); }

/** @param {Theme} theme @param {boolean} [instant] */
function applyTheme(theme, instant) {
  const doApply = () => {
    currentTheme = theme;
    buildParticles();

    setCSSVar('--clr-text',   theme.text);
    setCSSVar('--clr-accent', theme.accent);
    setCSSVar('--clr-accent2',theme.accent2);
    setCSSVar('--clr-track',  theme.track);
    setCSSVar('--clr-btn-bg', theme.btnBg);
    setCSSVar('--clr-btn-fg', theme.btnFg);
    setCSSVar('--clr-pill',   theme.pill);
    setCSSVar('--clr-panel',  theme.panel);
    setCSSVar('--font-main',  theme.font);
    setCSSVar('--glow',       theme.glow === 'none' ? 'none' : `0 0 45px ${theme.accent}44,0 0 100px ${theme.accent}18`);
    setCSSVar('--btn-radius', theme.isMedia ? '3px' : '99px');
    setCSSVar('--lb-h',       (theme.isMedia && theme.lb) ? '3.8vh' : '0px');

    document.getElementById('overlay').style.background  = theme.overlay  === 'none' ? '' : theme.overlay;
    document.getElementById('vignette').style.background = theme.vignette === 'none' ? '' : theme.vignette;
    document.getElementById('scanlines').style.opacity   = theme.scanlines ? '1' : '0';

    const grainEl = document.getElementById('grain');
    grainEl.style.opacity = theme.grain ? '0.25' : '0';
    if (theme.grain) {
      grainEl.style.backgroundImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`;
    }

    const hdr = document.getElementById('hdrBloom');
    if (theme.hdr) {
      hdr.style.background = `radial-gradient(ellipse at 50% 50%,${theme.accent}09 0%,transparent 65%)`;
      hdr.style.opacity = '1';
    } else {
      hdr.style.opacity = '0';
    }

    const badge = document.getElementById('showBadge');
    if (theme.isMedia && theme.tagline) {
      badge.textContent = theme.tagline;
      badge.classList.add('visible');
    } else {
      badge.classList.remove('visible');
    }

    const qs = theme.quotes || NAT_QUOTES;
    DOM.quoteText.style.opacity = '0';
    setTimeout(() => { DOM.quoteText.textContent = '"'+qs[0]+'"'; DOM.quoteText.style.opacity = '.38'; }, 420);

    updateSyncUI(synced ? 'ok' : 'failed');

    document.querySelectorAll('.nat-btn,.media-card').forEach(b => {
      b.classList.toggle('active', (/** @type {HTMLElement} */(b)).dataset.id === theme.id);
    });
    lastQIdx = -1;
  };

  if (instant || !theme.isMedia) { doApply(); return; }
  runTransition(theme.transition || 'defaultFade', doApply);
}

