// ═══════════════════════════════════════════════════════════════════════
// CANVAS SETUP
// ═══════════════════════════════════════════════════════════════════════
const bgCanvas  = /** @type {HTMLCanvasElement} */ (document.getElementById('bgCanvas'));
const bgCtx     = /** @type {CanvasRenderingContext2D} */ (bgCanvas.getContext('2d', { alpha: false }));
const tCanvas   = /** @type {HTMLCanvasElement} */ (document.getElementById('transCanvas'));
const tCtx      = /** @type {CanvasRenderingContext2D} */ (tCanvas.getContext('2d'));

let W = 0, H = 0;

function resize() {
  W = bgCanvas.width = tCanvas.width = window.innerWidth;
  H = bgCanvas.height = tCanvas.height = window.innerHeight;
  skylineReady = false;
  buildParticles();
}
window.addEventListener('resize', resize, { passive: true });

// ═══════════════════════════════════════════════════════════════════════
// PARTICLE SYSTEM — typed Float32Array pools
// Stride layout: [x, y, vx, vy, r, a, life, aux1, aux2]
// ═══════════════════════════════════════════════════════════════════════
const PSTRIDE = 9;
let pool  = new Float32Array(0);
let poolN = 0;

// Matrix rain — column-based
let matCols = /** @type {Float32Array|null} */ (null);
const MAT_CHARS = '日ｦｲｸｺｻｼｽｾｿﾀﾂﾃﾄﾅﾆﾇﾈﾊﾋﾌﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾙﾚﾛﾜ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Skyline — rebuilt on resize
let skylineReady = false;
let skylineCount = 0;
const MAX_SKY = 120;
const skyX  = new Float32Array(MAX_SKY);
const skyW  = new Float32Array(MAX_SKY);
const skyHt = new Float32Array(MAX_SKY);

function buildParticles() {
  const t = currentTheme;
  poolN = 0;
  matCols = null;

  /** @param {number} n */
  const make = (n) => { pool = new Float32Array(n * PSTRIDE); poolN = n; };
  /** @param {number} i @returns {number} */
  const p = (i) => i * PSTRIDE;

  switch (t.bgType) {
    case 'aurora': {
      make(80);
      const cols = t.bgColors || ['#6ee7b7'];
      for (let i = 0; i < 80; i++) {
        const o = p(i);
        pool[o]=rnd(W); pool[o+1]=rnd(H);
        pool[o+2]=rndpm(.28); pool[o+3]=rndpm(.28);
        pool[o+4]=rnd(2)+.5; pool[o+5]=rnd(.55)+.2;
        pool[o+7]=i % cols.length;
      }
      break;
    }
    case 'midnight': case 'strangerthings': case 'interstellar': {
      const n = t.bgType === 'interstellar' ? 280 : 200;
      make(n);
      for (let i = 0; i < n; i++) {
        const o = p(i);
        pool[o]=rnd(W); pool[o+1]=rnd(H);
        pool[o+4]=rnd(t.bgType === 'interstellar' ? 1.2 : 1.5)+.2;
        pool[o+5]=rnd(.8)+.15;
        pool[o+7]=rnd(Math.PI*2); pool[o+8]=rnd(.018)+.004;
      }
      break;
    }
    case 'candy': {
      make(22);
      for (let i = 0; i < 22; i++) {
        const o = p(i);
        pool[o]=rnd(W); pool[o+1]=H+60;
        pool[o+2]=rndpm(.3); pool[o+3]=-(rnd(.3)+.1);
        pool[o+4]=rnd(36)+10; pool[o+5]=rnd(.1)+.03;
        pool[o+7]=rnd(Math.PI*2);
      }
      break;
    }
    case 'ocean': case 'dark': {
      make(5);
      for (let i = 0; i < 5; i++) {
        const o = p(i);
        pool[o+1]=H*(.26+i*.13);
        pool[o+7]=16+i*13; pool[o+8]=.004+i*.002;
        pool[o+2]=.0025+i*.001; pool[o+3]=i*.7;
        pool[o+5]=t.bgType === 'dark' ? .032 : .065;
      }
      break;
    }
    case 'supernatural': {
      make(50);
      for (let i = 0; i < 50; i++) {
        const o = p(i);
        pool[o]=rnd(W); pool[o+1]=rnd(H);
        pool[o+2]=rndpm(.25); pool[o+3]=-(rnd(.45)+.12);
        pool[o+4]=rnd(2)+.5; pool[o+5]=rnd(.8)+.2;
        pool[o+6]=rnd(1); pool[o+7]=rnd(.0025)+.0008;
      }
      break;
    }
    case 'mentalist': {
      make(12);
      for (let i = 0; i < 12; i++) {
        const o = p(i);
        pool[o]=rnd(W); pool[o+1]=rnd(H);
        pool[o+2]=rndpm(.18); pool[o+3]=rndpm(.18);
        pool[o+4]=rnd(3)+1; pool[o+5]=rnd(.3)+.07;
        pool[o+7]=rnd(Math.PI*2); pool[o+8]=rndpm(.008);
      }
      break;
    }
    case 'sopranos': {
      make(14);
      for (let i = 0; i < 14; i++) {
        const o = p(i);
        pool[o]=rnd(W*.5)+W*.25; pool[o+1]=H;
        pool[o+2]=rndpm(.1); pool[o+3]=-(rnd(.35)+.08);
        pool[o+4]=rnd(16)+5; pool[o+5]=rnd(.06)+.02;
        pool[o+7]=rnd(.1)+.04;
      }
      break;
    }
    case 'breakingbad': {
      make(22);
      for (let i = 0; i < 22; i++) {
        const o = p(i);
        pool[o]=rnd(W); pool[o+1]=rnd(H);
        pool[o+2]=rndpm(.22); pool[o+3]=rndpm(.22);
        pool[o+4]=rnd(22)+7; pool[o+5]=rnd(.15)+.04;
        pool[o+7]=rnd(Math.PI*2); pool[o+8]=rndpm(.007);
      }
      break;
    }
    case 'dune': {
      make(60);
      for (let i = 0; i < 60; i++) {
        const o = p(i);
        pool[o]=rnd(W); pool[o+1]=rnd(H);
        pool[o+2]=rndpm(.12); pool[o+3]=rnd(.16)+.04;
        pool[o+4]=rnd(1.5)+.3; pool[o+5]=rnd(.5)+.15;
        pool[o+6]=rnd(1);
      }
      break;
    }
    case 'bladerunner': {
      make(90);
      for (let i = 0; i < 90; i++) {
        const o = p(i);
        pool[o]=rnd(W); pool[o+1]=rnd(H*.6);
        pool[o+2]=rndpm(.4)-.1; pool[o+3]=rnd(.9)+.3;
        pool[o+4]=rnd(.8)+.2; pool[o+5]=rnd(.45)+.1;
      }
      buildSkyline();
      break;
    }
    case 'inception': {
      make(4);
      for (let i = 0; i < 4; i++) {
        const o = p(i);
        pool[o]=W/2; pool[o+1]=H/2;
        pool[o+4]=80+i*90; pool[o+5]=.045-i*.008;
        pool[o+7]=i*.8; pool[o+8]=.004-i*.0007;
      }
      break;
    }
    case 'godfather': {
      make(8);
      for (let i = 0; i < 8; i++) {
        const o = p(i);
        pool[o]=rnd(W*.5)+W*.25; pool[o+1]=rnd(H*.5)+H*.2;
        pool[o+2]=rndpm(.07); pool[o+3]=-(rnd(.1)+.04);
        pool[o+4]=rnd(20)+8; pool[o+5]=rnd(.05)+.02;
        pool[o+7]=rnd(.04)+.01;
      }
      break;
    }
    case 'redbull': case 'ferrari': case 'mercedes': case 'mclaren': case 'astonmartin': {
      make(60);
      for (let i = 0; i < 60; i++) {
        const o = p(i);
        pool[o]=rnd(W); pool[o+1]=rnd(H);
        pool[o+2]=rnd(3)+1.5; pool[o+3]=rndpm(.15);
        pool[o+4]=rnd(.8)+.3; pool[o+5]=rnd(.55)+.15;
        pool[o+7]=Math.random();
      }
      break;
    }
    case 'matrix': {
      buildMatrixRain();
      break;
    }
    // nat themes with no particles — base gradient only
    default: break;
  }
}

function buildMatrixRain() {
  const cols = Math.floor(W / 15);
  matCols = new Float32Array(cols * 2);
  for (let i = 0; i < cols; i++) {
    matCols[i*2]   = rnd(H);
    matCols[i*2+1] = rnd(3)+1.5;
  }
}

function buildSkyline() {
  skylineCount = 0;
  let x = 0;
  while (x < W && skylineCount < MAX_SKY) {
    const si  = skylineCount++;
    const sw  = rnd(45)+12;
    skyX[si]  = x;
    skyW[si]  = sw;
    skyHt[si] = rnd(H*.38)+H*.07;
    x += sw + rnd(4)+1;
  }
  skylineReady = true;
}
