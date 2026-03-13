'use strict';

// ═══════════════════════════════════════════════════════════════════════
// TYPES (JSDoc — TypeScript-compatible without a build step)
// ═══════════════════════════════════════════════════════════════════════
/**
 * @typedef {'nat'|'tv'|'movie'|'f1'} ThemeCat
 *
 * @typedef {Object} Theme
 * @property {string}   id
 * @property {string}   name
 * @property {ThemeCat} cat
 * @property {string}   [sub]
 * @property {string}   [tagline]
 * @property {string}   font
 * @property {string}   bgType
 * @property {string[]} baseBg
 * @property {string}   overlay
 * @property {string}   vignette
 * @property {string}   text
 * @property {string}   accent
 * @property {string}   accent2
 * @property {string}   track
 * @property {string}   btnBg
 * @property {string}   btnFg
 * @property {string}   pill
 * @property {string}   panel
 * @property {string}   glow
 * @property {boolean}  hdr
 * @property {boolean}  grain
 * @property {boolean}  scanlines
 * @property {boolean}  lb
 * @property {boolean}  isMedia
 * @property {string}   [transition]
 * @property {string[]} [quotes]
 * @property {string[]} [bgColors]
 * @property {boolean}  [light]
 * @property {string}   [swatch]
 */

// ═══════════════════════════════════════════════════════════════════════
// LOGOS — SVG strings keyed by theme id
// ═══════════════════════════════════════════════════════════════════════
/** @type {Record<string, string>} */
const LOGOS = {
  supernatural:   `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#1a0800"/><path d="M6 17L16 5L26 17" stroke="#e05500" stroke-width="1.5" fill="none"/><path d="M10 17L16 9L22 17" stroke="#ff9944" stroke-width="1" fill="none" opacity=".6"/><circle cx="16" cy="14" r="2" fill="#e05500" opacity=".8"/></svg>`,
  mentalist:      `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#180800"/><circle cx="16" cy="11" r="7" stroke="#cc1100" stroke-width="1.2" fill="none"/><circle cx="13" cy="9.5" r="1.2" fill="#cc1100"/><circle cx="19" cy="9.5" r="1.2" fill="#cc1100"/><path d="M12 14Q16 17 20 14" stroke="#cc1100" stroke-width="1.2" fill="none"/></svg>`,
  sopranos:       `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#080808"/><rect x="4" y="6" width="24" height="10" rx="1" stroke="#c8a000" stroke-width="1" fill="none" opacity=".7"/><text x="16" y="14.5" text-anchor="middle" fill="#c8a000" font-size="6" font-family="Georgia,serif" font-weight="700">TS</text></svg>`,
  dark:           `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000004"/><circle cx="16" cy="11" r="8" stroke="#4488cc" stroke-width=".8" fill="none" opacity=".5"/><circle cx="16" cy="11" r="5" stroke="#4488cc" stroke-width=".6" fill="none" opacity=".35"/><circle cx="16" cy="11" r="2" fill="#4488cc" opacity=".7"/></svg>`,
  breakingbad:    `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#040900"/><text x="4" y="10" fill="#7ec800" font-size="7.5" font-family="Arial,sans-serif" font-weight="900">Br</text><text x="13" y="10" fill="#7ec800" font-size="7.5" font-family="Arial,sans-serif" font-weight="900" opacity=".5">eaking</text><text x="4" y="19" fill="#b8f040" font-size="6" font-family="Arial,sans-serif" font-weight="700" letter-spacing="2">BAD</text></svg>`,
  strangerthings: `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#04000e"/><text x="16" y="9" text-anchor="middle" fill="#cc44ff" font-size="5.5" font-family="Georgia,serif" font-weight="700" letter-spacing="-.5">STRANGER</text><text x="16" y="17" text-anchor="middle" fill="#ee88ff" font-size="5.5" font-family="Georgia,serif" font-weight="700" letter-spacing="-.5">THINGS</text></svg>`,
  interstellar:   `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000305"/><circle cx="16" cy="11" r="6" fill="none" stroke="#4499ee" stroke-width=".8" opacity=".6"/><ellipse cx="16" cy="11" rx="9" ry="2.5" fill="none" stroke="#88ccff" stroke-width=".7" opacity=".4"/><circle cx="16" cy="11" r="1.2" fill="#4499ee" opacity=".6"/></svg>`,
  dune:           `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#1a1000"/><path d="M2 16Q8 8 16 10Q24 12 30 6" stroke="#d4a020" stroke-width="1.2" fill="none" opacity=".7"/><circle cx="16" cy="5" r="3.5" fill="none" stroke="#f0c840" stroke-width=".8" opacity=".5"/><text x="16" y="21" text-anchor="middle" fill="#d4a020" font-size="4.5" font-family="Georgia,serif" letter-spacing="3" opacity=".8">DUNE</text></svg>`,
  matrix:         `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000a00"/><text x="4" y="8" fill="#00ee00" font-size="5" font-family="monospace" opacity=".9">10110</text><text x="4" y="14" fill="#00ee00" font-size="5" font-family="monospace" opacity=".6">01001</text><rect x="20" y="4" width="9" height="14" rx="1" fill="rgba(0,180,0,.12)" stroke="#00ee00" stroke-width=".6" opacity=".5"/><text x="24.5" y="13" text-anchor="middle" fill="#00ee00" font-size="7" font-family="monospace" font-weight="700">M</text></svg>`,
  bladerunner:    `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#0a0500"/><rect x="2" y="14" width="28" height="6" fill="#050200"/><rect x="9" y="9" width="4" height="7" fill="#0a0500"/><rect x="15" y="11" width="5" height="5" fill="#0a0500"/><path d="M2 5L5 2L27 2L30 5" stroke="#e87020" stroke-width=".6" fill="none" opacity=".5"/></svg>`,
  inception:      `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#060608"/><circle cx="16" cy="11" r="9" stroke="#9090ee" stroke-width=".6" fill="none" opacity=".35"/><circle cx="16" cy="11" r="6" stroke="#9090ee" stroke-width=".6" fill="none" opacity=".3"/><circle cx="16" cy="11" r="3.5" stroke="#bbbbff" stroke-width=".6" fill="none" opacity=".4"/><circle cx="16" cy="11" r="1.5" fill="#9090ee" opacity=".6"/></svg>`,
  godfather:      `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#050500"/><path d="M16 4Q10 8 10 12Q10 17 16 18Q22 17 22 12Q22 8 16 4Z" fill="none" stroke="#b09040" stroke-width=".8" opacity=".6"/><path d="M13 13Q16 15.5 19 13" stroke="#b09040" stroke-width=".8" fill="none" opacity=".7"/></svg>`,
  redbull:        `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#1c1f26"/><text x="16" y="10" text-anchor="middle" fill="#e8002d" font-size="5" font-family="Arial Black,sans-serif" font-weight="900">RED BULL</text><text x="16" y="17" text-anchor="middle" fill="#1e41ff" font-size="3.8" font-family="Arial,sans-serif" font-weight="700" letter-spacing="1">RACING</text><circle cx="6" cy="7" r="2.2" fill="#e8002d" opacity=".9"/><circle cx="26" cy="7" r="2.2" fill="#1e41ff" opacity=".9"/></svg>`,
  ferrari:        `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#dc0000"/><text x="16" y="13" text-anchor="middle" fill="#ffed00" font-size="8" font-family="Arial Black,sans-serif" font-weight="900">SF</text><rect x="3" y="16" width="26" height="3" fill="#ffed00" opacity=".9"/><rect x="3" y="3" width="26" height="3" fill="#ffed00" opacity=".6"/></svg>`,
  mercedes:       `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#00d2be"/><text x="16" y="13" text-anchor="middle" fill="#fff" font-size="5" font-family="Arial Black,sans-serif" font-weight="900" letter-spacing=".5">AMG</text><path d="M16 5 L19 9 L16 8 L13 9 Z" fill="white" opacity=".9"/></svg>`,
  mclaren:        `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#ff8000"/><path d="M3 11 Q16 4 29 11 Q16 18 3 11Z" fill="#c86000" opacity=".7"/><text x="16" y="13" text-anchor="middle" fill="white" font-size="5.5" font-family="Arial Black,sans-serif" font-weight="900">MCL</text></svg>`,
  astonmartin:    `<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#006f62"/><path d="M8 14 Q16 6 24 14" stroke="#cedc00" stroke-width="1.5" fill="none"/><text x="16" y="19" text-anchor="middle" fill="#cedc00" font-size="3.5" font-family="Arial,sans-serif" font-weight="700" letter-spacing=".5">ASTON MARTIN</text></svg>`
};

// ═══════════════════════════════════════════════════════════════════════
// THEME DATA — pure data, no DOM refs, no trailing commas
// ═══════════════════════════════════════════════════════════════════════
/** @type {Theme[]} */
const THEMES = [
  // ── NATURAL ──────────────────────────────────────────────────────────
  {
    id:'aurora', name:'Aurora', cat:'nat',
    swatch:'linear-gradient(135deg,#6ee7b7,#3b82f6,#8b5cf6)',
    font:"'Orbitron',monospace", bgType:'aurora',
    baseBg:['#06030f','#080520','#030212'],
    overlay:'linear-gradient(160deg,rgba(8,5,25,.55),rgba(3,15,35,.4))',
    vignette:'radial-gradient(ellipse at center,transparent 30%,rgba(0,0,15,.82) 100%)',
    text:'#e0f2fe', accent:'#6ee7b7', accent2:'#818cf8',
    track:'rgba(255,255,255,.1)', btnBg:'rgba(110,231,183,.16)', btnFg:'#6ee7b7',
    pill:'rgba(255,255,255,.06)', panel:'rgba(4,3,18,.7)',
    glow:'0 0 55px rgba(110,231,183,.35),0 0 130px rgba(129,140,248,.15)',
    hdr:true, grain:false, scanlines:false, lb:false, isMedia:false,
    bgColors:['#6ee7b7','#38bdf8','#818cf8','#c084fc']
  },
  {
    id:'sunrise', name:'Sunrise', cat:'nat',
    swatch:'linear-gradient(135deg,#fde68a,#f97316,#ec4899)',
    font:"'Playfair Display',serif", bgType:'sunrise',
    baseBg:['#1a0900','#3d1200','#180420'],
    overlay:'linear-gradient(180deg,rgba(18,4,0,.22),rgba(38,8,0,.12) 60%,rgba(18,4,18,.28))',
    vignette:'radial-gradient(ellipse at center,transparent 28%,rgba(8,0,0,.85) 100%)',
    text:'#fff7ed', accent:'#fb923c', accent2:'#f472b6',
    track:'rgba(255,170,70,.14)', btnBg:'rgba(251,146,60,.18)', btnFg:'#fde68a',
    pill:'rgba(255,110,35,.09)', panel:'rgba(22,7,0,.72)',
    glow:'0 0 65px rgba(251,146,60,.38)',
    hdr:true, grain:false, scanlines:false, lb:false, isMedia:false
  },
  {
    id:'forest', name:'Forest', cat:'nat',
    swatch:'linear-gradient(135deg,#bbf7d0,#4ade80,#166534)',
    font:"'Fraunces',serif", bgType:'forest',
    baseBg:['#061509','#0b2212','#040e06'],
    overlay:'radial-gradient(ellipse at 50% 0%,rgba(74,222,128,.09),rgba(6,21,9,.55) 70%)',
    vignette:'radial-gradient(ellipse at center,transparent 38%,rgba(0,8,3,.84) 100%)',
    text:'#dcfce7', accent:'#4ade80', accent2:'#86efac',
    track:'rgba(74,222,128,.13)', btnBg:'rgba(74,222,128,.13)', btnFg:'#bbf7d0',
    pill:'rgba(74,222,128,.06)', panel:'rgba(3,12,5,.72)',
    glow:'0 0 65px rgba(74,222,128,.22)',
    hdr:true, grain:false, scanlines:false, lb:false, isMedia:false
  },
  {
    id:'ocean', name:'Ocean', cat:'nat',
    swatch:'linear-gradient(135deg,#e0f2fe,#38bdf8,#0369a1)',
    font:"'Josefin Sans',sans-serif", bgType:'ocean',
    baseBg:['#010d18','#031422','#040f1e'],
    overlay:'radial-gradient(ellipse at 50% 100%,rgba(56,189,248,.13),rgba(1,13,24,.45) 70%)',
    vignette:'radial-gradient(ellipse at center,transparent 32%,rgba(0,5,14,.85) 100%)',
    text:'#e0f2fe', accent:'#38bdf8', accent2:'#7dd3fc',
    track:'rgba(56,189,248,.13)', btnBg:'rgba(56,189,248,.13)', btnFg:'#bae6fd',
    pill:'rgba(56,189,248,.06)', panel:'rgba(1,9,20,.72)',
    glow:'0 0 65px rgba(56,189,248,.25)',
    hdr:true, grain:false, scanlines:false, lb:false, isMedia:false
  },
  {
    id:'candy', name:'Candy', cat:'nat',
    swatch:'linear-gradient(135deg,#fce7f3,#f9a8d4,#a855f7)',
    font:"'Comfortaa',cursive", bgType:'candy',
    baseBg:['#180420','#220830','#10021a'],
    overlay:'radial-gradient(ellipse at 30% 30%,rgba(244,114,182,.12),transparent 60%)',
    vignette:'radial-gradient(ellipse at center,transparent 38%,rgba(12,2,20,.84) 100%)',
    text:'#fdf4ff', accent:'#f472b6', accent2:'#c084fc',
    track:'rgba(244,114,182,.13)', btnBg:'rgba(244,114,182,.15)', btnFg:'#fce7f3',
    pill:'rgba(244,114,182,.07)', panel:'rgba(18,3,26,.72)',
    glow:'0 0 65px rgba(244,114,182,.28)',
    hdr:true, grain:false, scanlines:false, lb:false, isMedia:false
  },
  {
    id:'nordic', name:'Nordic', cat:'nat',
    swatch:'linear-gradient(135deg,#f8fafc,#cbd5e1,#64748b)',
    font:"'Josefin Sans',sans-serif", bgType:'nordic',
    baseBg:['#f1f5f9','#e2e8f0','#f8fafc'],
    overlay:'none', vignette:'none',
    text:'#0f172a', accent:'#334155', accent2:'#64748b',
    track:'rgba(15,23,42,.09)', btnBg:'rgba(15,23,42,.07)', btnFg:'#0f172a',
    pill:'rgba(15,23,42,.05)', panel:'rgba(232,238,246,.9)',
    glow:'none', hdr:false, grain:false, scanlines:false, lb:false, isMedia:false, light:true
  },
  {
    id:'midnight', name:'Midnight', cat:'nat',
    swatch:'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)',
    font:"'Orbitron',monospace", bgType:'midnight',
    baseBg:['#02010a','#03000d','#050010'],
    overlay:'radial-gradient(ellipse at 50% 50%,rgba(109,40,217,.09),transparent 70%)',
    vignette:'radial-gradient(ellipse at center,transparent 28%,rgba(1,0,7,.9) 100%)',
    text:'#ede9fe', accent:'#a78bfa', accent2:'#c4b5fd',
    track:'rgba(167,139,250,.13)', btnBg:'rgba(167,139,250,.13)', btnFg:'#ddd6fe',
    pill:'rgba(167,139,250,.06)', panel:'rgba(2,1,8,.78)',
    glow:'0 0 65px rgba(167,139,250,.22)',
    hdr:true, grain:false, scanlines:false, lb:false, isMedia:false
  },
  {
    id:'lemon', name:'Lemon', cat:'nat',
    swatch:'linear-gradient(135deg,#fef9c3,#fde047,#ca8a04)',
    font:"'Nunito',sans-serif", bgType:'lemon',
    baseBg:['#fefce8','#fef9c3','#fef3c7'],
    overlay:'none', vignette:'none',
    text:'#713f12', accent:'#ca8a04', accent2:'#d97706',
    track:'rgba(202,138,4,.13)', btnBg:'rgba(202,138,4,.11)', btnFg:'#78350f',
    pill:'rgba(202,138,4,.06)', panel:'rgba(254,250,228,.92)',
    glow:'none', hdr:false, grain:false, scanlines:false, lb:false, isMedia:false, light:true
  },

  // ── TV SHOWS ─────────────────────────────────────────────────────────
  {
    id:'supernatural', name:'Supernatural', cat:'tv', sub:'TV Series', tagline:'🔥 The Road So Far…',
    font:"'Cinzel',serif", bgType:'supernatural',
    baseBg:['#0c0300','#190700','#090200'],
    overlay:'radial-gradient(ellipse at 50% 85%,rgba(190,55,0,.2),rgba(9,2,0,.6) 58%)',
    vignette:'radial-gradient(ellipse at center,transparent 18%,rgba(4,0,0,.94) 100%)',
    text:'#fde8c8', accent:'#e05500', accent2:'#ff9944',
    track:'rgba(220,85,0,.2)', btnBg:'rgba(200,65,0,.2)', btnFg:'#fde8c8',
    pill:'rgba(200,65,0,.1)', panel:'rgba(8,2,0,.88)',
    glow:'0 0 50px rgba(220,75,0,.5)',
    hdr:true, grain:true, scanlines:false, lb:true, isMedia:true, transition:'fire',
    quotes:[
      '"Saving people, hunting things — the family business."',
      '"Driver picks the music. Shotgun shuts his cakehole."',
      '"I\'m the one who gripped you tight and raised you from perdition."',
      '"Family don\'t end with blood."'
    ]
  },
  {
    id:'mentalist', name:'The Mentalist', cat:'tv', sub:'TV Series', tagline:'🔴 Red John was here.',
    font:"'Playfair Display',serif", bgType:'mentalist',
    baseBg:['#0c0600','#180d00','#090400'],
    overlay:'radial-gradient(ellipse at 50% 25%,rgba(180,15,0,.11),rgba(9,4,0,.55) 70%)',
    vignette:'radial-gradient(ellipse at center,transparent 22%,rgba(4,2,0,.93) 100%)',
    text:'#fdf0e0', accent:'#cc1100', accent2:'#ff4422',
    track:'rgba(200,12,0,.18)', btnBg:'rgba(180,12,0,.18)', btnFg:'#fdf0e0',
    pill:'rgba(180,12,0,.09)', panel:'rgba(10,5,0,.88)',
    glow:'0 0 40px rgba(180,12,0,.35)',
    hdr:true, grain:true, scanlines:false, lb:true, isMedia:true, transition:'redblood',
    quotes:[
      '"I\'m a mentalist — I see what others choose to ignore."',
      '"Everyone lies. The trick is knowing which lies matter."',
      '"The truth is rarely pure and never simple."'
    ]
  },
  {
    id:'sopranos', name:'The Sopranos', cat:'tv', sub:'TV Series', tagline:'🥃 You\'re gonna die anyway.',
    font:"'Special Elite',cursive", bgType:'sopranos',
    baseBg:['#070707','#0e0e0e','#040404'],
    overlay:'radial-gradient(ellipse at 50% 65%,rgba(120,88,0,.09),rgba(7,7,7,.6) 70%)',
    vignette:'radial-gradient(ellipse at center,transparent 18%,rgba(0,0,0,.96) 100%)',
    text:'#e8d5a0', accent:'#c8a000', accent2:'#e8c840',
    track:'rgba(200,158,0,.15)', btnBg:'rgba(180,138,0,.17)', btnFg:'#e8d5a0',
    pill:'rgba(180,138,0,.07)', panel:'rgba(4,4,4,.92)',
    glow:'0 0 38px rgba(200,148,0,.22)',
    hdr:true, grain:true, scanlines:true, lb:true, isMedia:true, transition:'smoke',
    quotes:[
      '"Those who want respect, give respect."',
      '"A wrong decision is better than none."',
      '"Keep your friends close, but your enemies closer."'
    ]
  },
  {
    id:'dark', name:'Dark', cat:'tv', sub:'TV Series', tagline:'⏳ The beginning is the end.',
    font:"'Josefin Sans',sans-serif", bgType:'dark',
    baseBg:['#000000','#020206','#010104'],
    overlay:'radial-gradient(ellipse at 50% 50%,rgba(0,70,150,.07),rgba(0,0,4,.72) 70%)',
    vignette:'radial-gradient(ellipse at center,transparent 12%,rgba(0,0,4,.97) 100%)',
    text:'#c8d8e8', accent:'#4488cc', accent2:'#88aadd',
    track:'rgba(68,136,204,.14)', btnBg:'rgba(50,100,180,.15)', btnFg:'#c8d8e8',
    pill:'rgba(50,100,180,.07)', panel:'rgba(0,0,4,.95)',
    glow:'0 0 38px rgba(50,100,200,.22)',
    hdr:true, grain:false, scanlines:true, lb:true, isMedia:true, transition:'timeloop',
    quotes:[
      '"The beginning is the end and the end is the beginning."',
      '"We are not free in what we do."',
      '"Time is not a straight line. It\'s a circle."'
    ]
  },
  {
    id:'breakingbad', name:'Breaking Bad', cat:'tv', sub:'TV Series', tagline:'⚗️ I am the danger.',
    font:"'Bebas Neue',cursive", bgType:'breakingbad',
    baseBg:['#040900','#090e00','#030700'],
    overlay:'radial-gradient(ellipse at 50% 75%,rgba(95,190,0,.1),rgba(4,9,0,.62) 68%)',
    vignette:'radial-gradient(ellipse at center,transparent 22%,rgba(2,5,0,.95) 100%)',
    text:'#e8f8c0', accent:'#7ec800', accent2:'#b8f040',
    track:'rgba(118,198,0,.17)', btnBg:'rgba(100,178,0,.17)', btnFg:'#e8f8c0',
    pill:'rgba(100,178,0,.07)', panel:'rgba(3,7,0,.9)',
    glow:'0 0 48px rgba(108,198,0,.32)',
    hdr:true, grain:true, scanlines:false, lb:true, isMedia:true, transition:'chemical',
    quotes:[
      '"I am the one who knocks."',
      '"Say my name."',
      '"Science, bitch!"',
      '"I did it for me. I liked it. I was good at it."'
    ]
  },
  {
    id:'strangerthings', name:'Stranger Things', cat:'tv', sub:'TV Series', tagline:'🔦 The Upside Down awaits.',
    font:"'Orbitron',monospace", bgType:'strangerthings',
    baseBg:['#04000e','#080018','#020008'],
    overlay:'radial-gradient(ellipse at 50% 50%,rgba(170,0,215,.11),rgba(4,0,12,.62) 70%)',
    vignette:'radial-gradient(ellipse at center,transparent 18%,rgba(2,0,8,.96) 100%)',
    text:'#f0e0ff', accent:'#cc44ff', accent2:'#ee88ff',
    track:'rgba(200,55,255,.15)', btnBg:'rgba(180,38,220,.17)', btnFg:'#f0e0ff',
    pill:'rgba(180,38,220,.07)', panel:'rgba(2,0,10,.92)',
    glow:'0 0 55px rgba(180,38,220,.38)',
    hdr:true, grain:false, scanlines:true, lb:true, isMedia:true, transition:'updown',
    quotes:[
      '"Friends don\'t lie."',
      '"She\'s our friend and she\'s crazy."',
      '"Mornings are for coffee and contemplation."'
    ]
  },

  // ── MOVIES ───────────────────────────────────────────────────────────
  {
    id:'interstellar', name:'Interstellar', cat:'movie', sub:'2014 · Sci-Fi', tagline:'🌌 Do not go gentle into that good night.',
    font:"'Josefin Sans',sans-serif", bgType:'interstellar',
    baseBg:['#000305','#000810','#000204'],
    overlay:'radial-gradient(ellipse at 50% 40%,rgba(0,100,200,.08),rgba(0,3,8,.7) 70%)',
    vignette:'radial-gradient(ellipse at center,transparent 10%,rgba(0,2,6,.97) 100%)',
    text:'#d0e8ff', accent:'#4499ee', accent2:'#88ccff',
    track:'rgba(68,153,238,.15)', btnBg:'rgba(50,130,220,.15)', btnFg:'#d0e8ff',
    pill:'rgba(50,130,220,.07)', panel:'rgba(0,2,6,.95)',
    glow:'0 0 45px rgba(50,130,220,.25)',
    hdr:true, grain:false, scanlines:false, lb:true, isMedia:true, transition:'warp',
    quotes:[
      '"Do not go gentle into that good night."',
      '"Love transcends dimensions of time and space."',
      '"Mankind was born on Earth. It was never meant to die here."'
    ]
  },
  {
    id:'dune', name:'Dune', cat:'movie', sub:'2021 · Epic', tagline:'🏜️ The spice must flow.',
    font:"'Cinzel',serif", bgType:'dune',
    baseBg:['#1a1000','#2e1c00','#120c00'],
    overlay:'radial-gradient(ellipse at 50% 80%,rgba(210,140,0,.12),rgba(18,10,0,.6) 65%)',
    vignette:'radial-gradient(ellipse at center,transparent 20%,rgba(8,5,0,.96) 100%)',
    text:'#f5e8c0', accent:'#d4a020', accent2:'#f0c840',
    track:'rgba(212,158,30,.18)', btnBg:'rgba(190,140,20,.18)', btnFg:'#f5e8c0',
    pill:'rgba(190,140,20,.08)', panel:'rgba(10,6,0,.9)',
    glow:'0 0 48px rgba(210,155,20,.3)',
    hdr:true, grain:true, scanlines:false, lb:true, isMedia:true, transition:'sandstorm',
    quotes:[
      '"The spice must flow."',
      '"I must not fear. Fear is the mind-killer."',
      '"He who controls the spice controls the universe."'
    ]
  },
  {
    id:'matrix', name:'The Matrix', cat:'movie', sub:'1999 · Sci-Fi', tagline:'💊 There is no spoon.',
    font:"'Orbitron',monospace", bgType:'matrix',
    baseBg:['#000a00','#001200','#000800'],
    overlay:'radial-gradient(ellipse at 50% 50%,rgba(0,180,0,.07),rgba(0,8,0,.65) 70%)',
    vignette:'radial-gradient(ellipse at center,transparent 20%,rgba(0,5,0,.97) 100%)',
    text:'#c0ffc0', accent:'#00ee00', accent2:'#44ff44',
    track:'rgba(0,220,0,.17)', btnBg:'rgba(0,180,0,.17)', btnFg:'#c0ffc0',
    pill:'rgba(0,180,0,.07)', panel:'rgba(0,5,0,.92)',
    glow:'0 0 50px rgba(0,200,0,.35)',
    hdr:true, grain:false, scanlines:true, lb:true, isMedia:true, transition:'matrixrain',
    quotes:[
      '"There is no spoon."',
      '"Free your mind."',
      '"What is real? How do you define real?"'
    ]
  },
  {
    id:'bladerunner', name:'Blade Runner 2049', cat:'movie', sub:'2017 · Neo-Noir', tagline:'🌧️ All those moments will be lost in time.',
    font:"'Teko',sans-serif", bgType:'bladerunner',
    baseBg:['#0a0500','#120800','#080400'],
    overlay:'radial-gradient(ellipse at 50% 30%,rgba(255,120,0,.09),rgba(8,4,0,.65) 70%)',
    vignette:'radial-gradient(ellipse at center,transparent 14%,rgba(5,2,0,.97) 100%)',
    text:'#f5d0a0', accent:'#e87020', accent2:'#ffaa55',
    track:'rgba(230,108,28,.18)', btnBg:'rgba(200,95,20,.18)', btnFg:'#f5d0a0',
    pill:'rgba(200,95,20,.08)', panel:'rgba(6,3,0,.92)',
    glow:'0 0 50px rgba(220,100,20,.3)',
    hdr:true, grain:true, scanlines:true, lb:true, isMedia:true, transition:'neon_rain',
    quotes:[
      '"All those moments will be lost in time, like tears in rain."',
      '"Dying for the right cause — that\'s the most human thing."'
    ]
  },
  {
    id:'inception', name:'Inception', cat:'movie', sub:'2010 · Thriller', tagline:'🌀 One small step into the dream.',
    font:"'Playfair Display',serif", bgType:'inception',
    baseBg:['#060608','#0a0a10','#040406'],
    overlay:'radial-gradient(ellipse at 50% 50%,rgba(80,80,200,.08),rgba(5,5,8,.68) 70%)',
    vignette:'radial-gradient(ellipse at center,transparent 16%,rgba(3,3,5,.97) 100%)',
    text:'#e0deff', accent:'#9090ee', accent2:'#bbbbff',
    track:'rgba(140,140,230,.15)', btnBg:'rgba(120,120,200,.15)', btnFg:'#e0deff',
    pill:'rgba(120,120,200,.07)', panel:'rgba(3,3,6,.92)',
    glow:'0 0 45px rgba(120,120,210,.28)',
    hdr:true, grain:false, scanlines:false, lb:true, isMedia:true, transition:'dream',
    quotes:[
      '"You\'re waiting for a train... you know where you hope it will take you."',
      '"An idea is like a virus — resilient, highly contagious."',
      '"Dreams feel real while we\'re in them."'
    ]
  },
  {
    id:'godfather', name:'The Godfather', cat:'movie', sub:'1972 · Crime', tagline:'🌹 I\'m gonna make him an offer he can\'t refuse.',
    font:"'IM Fell English',serif", bgType:'godfather',
    baseBg:['#050500','#0a0900','#030300'],
    overlay:'radial-gradient(ellipse at 30% 30%,rgba(80,60,0,.08),rgba(5,5,0,.65) 70%)',
    vignette:'radial-gradient(ellipse at center,transparent 12%,rgba(2,2,0,.98) 100%)',
    text:'#e0d0a8', accent:'#b09040', accent2:'#d0b060',
    track:'rgba(176,142,58,.15)', btnBg:'rgba(150,125,45,.16)', btnFg:'#e0d0a8',
    pill:'rgba(150,125,45,.07)', panel:'rgba(3,3,0,.95)',
    glow:'0 0 35px rgba(170,135,50,.2)',
    hdr:true, grain:true, scanlines:false, lb:true, isMedia:true, transition:'rose',
    quotes:[
      '"I\'m gonna make him an offer he can\'t refuse."',
      '"Leave the gun. Take the cannoli."',
      '"Keep your friends close, but your enemies closer."'
    ]
  },

  // ── F1 TEAMS ─────────────────────────────────────────────────────────
  {
    id:'redbull', name:'Red Bull Racing', cat:'f1', sub:'Constructor · RB20', tagline:'🏆 Verstappen. Maximum attack.',
    font:"'Orbitron',monospace", bgType:'redbull',
    baseBg:['#0a0d1a','#121728','#060810'],
    overlay:'radial-gradient(ellipse at 50% 80%,rgba(232,0,45,.13),rgba(8,10,22,.65) 65%)',
    vignette:'radial-gradient(ellipse at center,transparent 20%,rgba(2,3,10,.97) 100%)',
    text:'#f0f4ff', accent:'#e8002d', accent2:'#1e41ff',
    track:'rgba(232,0,45,.2)', btnBg:'rgba(232,0,45,.18)', btnFg:'#f0f4ff',
    pill:'rgba(232,0,45,.1)', panel:'rgba(6,8,20,.92)',
    glow:'0 0 55px rgba(232,0,45,.4),0 0 110px rgba(30,65,255,.18)',
    hdr:true, grain:false, scanlines:false, lb:true, isMedia:true, transition:'f1_launch',
    quotes:[
      '"To finish first, first you must finish." — Red Bull Racing',
      '"Maximum attack." — Max Verstappen',
      '"We never give up. Never." — Christian Horner',
      '"The car feels incredible today." — Max Verstappen',
      '"Hungry, driven, unstoppable." — RBR motto'
    ]
  },
  {
    id:'ferrari', name:'Scuderia Ferrari', cat:'f1', sub:'Constructor · SF-24', tagline:'🐎 Forza Ferrari.',
    font:"'Cinzel',serif", bgType:'ferrari',
    baseBg:['#1a0000','#2d0000','#100000'],
    overlay:'radial-gradient(ellipse at 50% 70%,rgba(255,237,0,.08),rgba(20,0,0,.6) 65%)',
    vignette:'radial-gradient(ellipse at center,transparent 18%,rgba(8,0,0,.97) 100%)',
    text:'#fff9e6', accent:'#ff2800', accent2:'#ffed00',
    track:'rgba(255,40,0,.2)', btnBg:'rgba(255,40,0,.2)', btnFg:'#fff9e6',
    pill:'rgba(255,40,0,.1)', panel:'rgba(12,0,0,.92)',
    glow:'0 0 60px rgba(255,40,0,.45),0 0 120px rgba(255,237,0,.12)',
    hdr:true, grain:true, scanlines:false, lb:true, isMedia:true, transition:'f1_burnout',
    quotes:[
      '"Il Cavallino Rampante — the Prancing Horse." — Ferrari motto',
      '"We are Ferrari. We win together." — Scuderia Ferrari',
      '"Forza Ferrari! This is our passion." — Tifosi chant',
      '"Every detail matters. Every tenth counts." — Ferrari engineering',
      '"The heart of F1 beats in red." — Enzo Ferrari'
    ]
  },
  {
    id:'mercedes', name:'Mercedes-AMG F1', cat:'f1', sub:'Constructor · W15', tagline:'⭐ Still we rise.',
    font:"'Josefin Sans',sans-serif", bgType:'mercedes',
    baseBg:['#001a17','#002520','#000e0d'],
    overlay:'radial-gradient(ellipse at 50% 50%,rgba(0,210,190,.09),rgba(0,14,13,.65) 65%)',
    vignette:'radial-gradient(ellipse at center,transparent 22%,rgba(0,6,5,.97) 100%)',
    text:'#e8fffd', accent:'#00d2be', accent2:'#c0c0c0',
    track:'rgba(0,210,190,.18)', btnBg:'rgba(0,210,190,.15)', btnFg:'#e8fffd',
    pill:'rgba(0,210,190,.08)', panel:'rgba(0,10,9,.92)',
    glow:'0 0 55px rgba(0,210,190,.35)',
    hdr:true, grain:false, scanlines:false, lb:true, isMedia:true, transition:'f1_launch',
    quotes:[
      '"Still I rise." — Lewis Hamilton',
      '"We never stop pushing." — Toto Wolff',
      '"One team, one dream." — Mercedes-AMG Petronas',
      '"Bwoah." — the fans',
      '"Eight titles. The dynasty continues." — MAPF1'
    ]
  },
  {
    id:'mclaren', name:'McLaren F1 Team', cat:'f1', sub:'Constructor · MCL38', tagline:'🟠 Relentless.',
    font:"'Bebas Neue',cursive", bgType:'mclaren',
    baseBg:['#1a0900','#2e1200','#0f0600'],
    overlay:'radial-gradient(ellipse at 50% 60%,rgba(255,128,0,.14),rgba(18,8,0,.65) 65%)',
    vignette:'radial-gradient(ellipse at center,transparent 20%,rgba(8,4,0,.97) 100%)',
    text:'#fff5e6', accent:'#ff8000', accent2:'#ffffff',
    track:'rgba(255,128,0,.2)', btnBg:'rgba(255,128,0,.18)', btnFg:'#fff5e6',
    pill:'rgba(255,128,0,.1)', panel:'rgba(12,5,0,.92)',
    glow:'0 0 55px rgba(255,128,0,.42)',
    hdr:true, grain:false, scanlines:false, lb:true, isMedia:true, transition:'f1_burnout',
    quotes:[
      '"Relentless." — McLaren ethos',
      '"The papaya spirit never dies." — McLaren fans',
      '"We are back." — Zak Brown',
      '"Lando is the future. The future is now." — McLaren',
      '"Speed and style since 1966." — McLaren Racing'
    ]
  },
  {
    id:'astonmartin', name:'Aston Martin F1', cat:'f1', sub:'Constructor · AMR24', tagline:'🟢 British Racing Green.',
    font:"'Playfair Display',serif", bgType:'astonmartin',
    baseBg:['#001a16','#002820','#000e0b'],
    overlay:'radial-gradient(ellipse at 50% 50%,rgba(0,111,98,.14),rgba(0,12,10,.65) 65%)',
    vignette:'radial-gradient(ellipse at center,transparent 22%,rgba(0,6,4,.97) 100%)',
    text:'#e6fff8', accent:'#006f62', accent2:'#cedc00',
    track:'rgba(0,111,98,.2)', btnBg:'rgba(0,111,98,.18)', btnFg:'#e6fff8',
    pill:'rgba(0,111,98,.09)', panel:'rgba(0,10,8,.92)',
    glow:'0 0 50px rgba(0,111,98,.35),0 0 100px rgba(206,220,0,.1)',
    hdr:true, grain:false, scanlines:false, lb:true, isMedia:true, transition:'f1_launch',
    quotes:[
      '"British Racing Green. Always." — Aston Martin tradition',
      '"The chase begins." — AMF1',
      '"Power, beauty, soul." — Aston Martin brand',
      '"Fernando is still here. Still fast." — AMF1 fans',
      '"Green is the colour of speed." — Aston Martin F1'
    ]
  }
];

/** @type {Record<string, Theme>} */
const THEME_BY_ID = Object.fromEntries(THEMES.map(t => [t.id, t]));

/** @type {Record<ThemeCat, Theme[]>} */
const THEMES_BY_CAT = {
  nat:   THEMES.filter(t => t.cat === 'nat'),
  tv:    THEMES.filter(t => t.cat === 'tv'),
  movie: THEMES.filter(t => t.cat === 'movie'),
  f1:    THEMES.filter(t => t.cat === 'f1')
};

/** @type {string[]} */
const NAT_QUOTES = [
  'The secret of getting ahead is getting started.',
  'Focus on being productive instead of busy.',
  'Small steps every day lead to giant leaps.',
  'Deep work is the superpower of the 21st century.',
  'Done is better than perfect.',
  'The present moment is where all your power lives.',
  'Consistency beats intensity every single time.',
  "You don't rise to goals — you fall to your systems."
];

