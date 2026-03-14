
'use strict';
/* ═══════════════════════════════════════════════════════════════════════
   SESSION CLOCK v7  — All features
═══════════════════════════════════════════════════════════════════════ */

// ── Global namespace ──────────────────────────────────────────────────
window.SC = {};

// ── Math helpers ──────────────────────────────────────────────────────
const rnd    = n => Math.random()*n;
const rndpm  = n => (Math.random()-.5)*n*2;
const p2     = n => (n<10?'0':'')+n;
const p3     = n => (n<10?'00':n<100?'0':'')+n;
const easeIO = t => t<.5?2*t*t:1-((-2*t+2)**2)/2;

// ═══════════════════════════════════════════════════════════════════════
// LOGOS
// ═══════════════════════════════════════════════════════════════════════
const LOGOS={
  supernatural:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#1a0800"/><path d="M6 17L16 5L26 17" stroke="#e05500" stroke-width="1.5" fill="none"/><path d="M10 17L16 9L22 17" stroke="#ff9944" stroke-width="1" fill="none" opacity=".6"/><circle cx="16" cy="14" r="2" fill="#e05500" opacity=".8"/></svg>`,
  mentalist:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#180800"/><circle cx="16" cy="11" r="7" stroke="#cc1100" stroke-width="1.2" fill="none"/><circle cx="13" cy="9.5" r="1.2" fill="#cc1100"/><circle cx="19" cy="9.5" r="1.2" fill="#cc1100"/><path d="M12 14Q16 17 20 14" stroke="#cc1100" stroke-width="1.2" fill="none"/></svg>`,
  sopranos:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#080808"/><rect x="4" y="6" width="24" height="10" rx="1" stroke="#c8a000" stroke-width="1" fill="none" opacity=".7"/><text x="16" y="14.5" text-anchor="middle" fill="#c8a000" font-size="6" font-family="Georgia,serif" font-weight="700">TS</text></svg>`,
  dark:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000004"/><circle cx="16" cy="11" r="8" stroke="#4488cc" stroke-width=".8" fill="none" opacity=".5"/><circle cx="16" cy="11" r="5" stroke="#4488cc" stroke-width=".6" fill="none" opacity=".35"/><circle cx="16" cy="11" r="2" fill="#4488cc" opacity=".7"/></svg>`,
  breakingbad:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#040900"/><text x="4" y="10" fill="#7ec800" font-size="7.5" font-family="Arial,sans-serif" font-weight="900">Br</text><text x="13" y="10" fill="#7ec800" font-size="7.5" font-family="Arial,sans-serif" font-weight="900" opacity=".5">eaking</text><text x="4" y="19" fill="#b8f040" font-size="6" font-family="Arial,sans-serif" font-weight="700" letter-spacing="2">BAD</text></svg>`,
  strangerthings:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#04000e"/><text x="16" y="9" text-anchor="middle" fill="#cc44ff" font-size="5.5" font-family="Georgia,serif" font-weight="700" letter-spacing="-.5">STRANGER</text><text x="16" y="17" text-anchor="middle" fill="#ee88ff" font-size="5.5" font-family="Georgia,serif" font-weight="700" letter-spacing="-.5">THINGS</text></svg>`,
  interstellar:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000305"/><circle cx="16" cy="11" r="6" fill="none" stroke="#4499ee" stroke-width=".8" opacity=".6"/><ellipse cx="16" cy="11" rx="9" ry="2.5" fill="none" stroke="#88ccff" stroke-width=".7" opacity=".4"/><circle cx="16" cy="11" r="1.2" fill="#4499ee" opacity=".6"/></svg>`,
  dune:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#1a1000"/><path d="M2 16Q8 8 16 10Q24 12 30 6" stroke="#d4a020" stroke-width="1.2" fill="none" opacity=".7"/><circle cx="16" cy="5" r="3.5" fill="none" stroke="#f0c840" stroke-width=".8" opacity=".5"/><text x="16" y="21" text-anchor="middle" fill="#d4a020" font-size="4.5" font-family="Georgia,serif" letter-spacing="3" opacity=".8">DUNE</text></svg>`,
  matrix:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#000a00"/><text x="4" y="8" fill="#00ee00" font-size="5" font-family="monospace" opacity=".9">10110</text><text x="4" y="14" fill="#00ee00" font-size="5" font-family="monospace" opacity=".6">01001</text><rect x="20" y="4" width="9" height="14" rx="1" fill="rgba(0,180,0,.12)" stroke="#00ee00" stroke-width=".6" opacity=".5"/><text x="24.5" y="13" text-anchor="middle" fill="#00ee00" font-size="7" font-family="monospace" font-weight="700">M</text></svg>`,
  bladerunner:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#0a0500"/><rect x="2" y="14" width="28" height="6" fill="#050200"/><rect x="9" y="9" width="4" height="7" fill="#0a0500"/><rect x="15" y="11" width="5" height="5" fill="#0a0500"/><path d="M2 5L5 2L27 2L30 5" stroke="#e87020" stroke-width=".6" fill="none" opacity=".5"/></svg>`,
  inception:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#060608"/><circle cx="16" cy="11" r="9" stroke="#9090ee" stroke-width=".6" fill="none" opacity=".35"/><circle cx="16" cy="11" r="6" stroke="#9090ee" stroke-width=".6" fill="none" opacity=".3"/><circle cx="16" cy="11" r="3.5" stroke="#bbbbff" stroke-width=".6" fill="none" opacity=".4"/><circle cx="16" cy="11" r="1.5" fill="#9090ee" opacity=".6"/></svg>`,
  godfather:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#050500"/><path d="M16 4Q10 8 10 12Q10 17 16 18Q22 17 22 12Q22 8 16 4Z" fill="none" stroke="#b09040" stroke-width=".8" opacity=".6"/><path d="M13 13Q16 15.5 19 13" stroke="#b09040" stroke-width=".8" fill="none" opacity=".7"/></svg>`,
  redbull:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#1c1f26"/><text x="16" y="10" text-anchor="middle" fill="#e8002d" font-size="5" font-family="Arial Black,sans-serif" font-weight="900">RED BULL</text><text x="16" y="17" text-anchor="middle" fill="#1e41ff" font-size="3.8" font-family="Arial,sans-serif" font-weight="700" letter-spacing="1">RACING</text><circle cx="6" cy="7" r="2.2" fill="#e8002d" opacity=".9"/><circle cx="26" cy="7" r="2.2" fill="#1e41ff" opacity=".9"/></svg>`,
  ferrari:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#dc0000"/><text x="16" y="13" text-anchor="middle" fill="#ffed00" font-size="8" font-family="Arial Black,sans-serif" font-weight="900">SF</text><rect x="3" y="16" width="26" height="3" fill="#ffed00" opacity=".9"/><rect x="3" y="3" width="26" height="3" fill="#ffed00" opacity=".6"/></svg>`,
  mercedes:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#00d2be"/><text x="16" y="13" text-anchor="middle" fill="#fff" font-size="5" font-family="Arial Black,sans-serif" font-weight="900" letter-spacing=".5">AMG</text><path d="M16 5 L19 9 L16 8 L13 9 Z" fill="white" opacity=".9"/></svg>`,
  mclaren:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#ff8000"/><path d="M3 11 Q16 4 29 11 Q16 18 3 11Z" fill="#c86000" opacity=".7"/><text x="16" y="13" text-anchor="middle" fill="white" font-size="5.5" font-family="Arial Black,sans-serif" font-weight="900">MCL</text></svg>`,
  astonmartin:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#006f62"/><path d="M8 14 Q16 6 24 14" stroke="#cedc00" stroke-width="1.5" fill="none"/><text x="16" y="19" text-anchor="middle" fill="#cedc00" font-size="3.5" font-family="Arial,sans-serif" font-weight="700" letter-spacing=".5">ASTON MARTIN</text></svg>`,
  literary:`<svg viewBox="0 0 32 22" fill="none"><rect width="32" height="22" fill="#0d0a06"/><path d="M8 5h16v13H8z" stroke="#c8a870" stroke-width="1" fill="none" opacity=".7"/><path d="M10 9h12M10 12h9M10 15h7" stroke="#c8a870" stroke-width=".7" opacity=".5"/><text x="16" y="21" text-anchor="middle" fill="#c8a870" font-size="3.2" font-family="Georgia,serif" letter-spacing="1.5" opacity=".6">LITERARY</text></svg>`
};

// ═══════════════════════════════════════════════════════════════════════
// THEMES
// ═══════════════════════════════════════════════════════════════════════
const THEMES=[
  // NAT
  {id:'aurora',name:'Aurora',cat:'nat',swatch:'linear-gradient(135deg,#6ee7b7,#3b82f6,#8b5cf6)',font:"'Orbitron',monospace",bgType:'aurora',baseBg:['#06030f','#080520','#030212'],overlay:'linear-gradient(160deg,rgba(8,5,25,.55),rgba(3,15,35,.4))',vignette:'radial-gradient(ellipse at center,transparent 30%,rgba(0,0,15,.82) 100%)',text:'#e0f2fe',accent:'#6ee7b7',accent2:'#818cf8',track:'rgba(255,255,255,.1)',btnBg:'rgba(110,231,183,.16)',btnFg:'#6ee7b7',pill:'rgba(255,255,255,.06)',panel:'rgba(4,3,18,.7)',glow:'0 0 55px rgba(110,231,183,.35),0 0 130px rgba(129,140,248,.15)',hdr:true,grain:false,scanlines:false,lb:false,isMedia:false,bgColors:['#6ee7b7','#38bdf8','#818cf8','#c084fc']},
  {id:'sunrise',name:'Sunrise',cat:'nat',swatch:'linear-gradient(135deg,#fde68a,#f97316,#ec4899)',font:"'Playfair Display',serif",bgType:'sunrise',baseBg:['#1a0900','#3d1200','#180420'],overlay:'linear-gradient(180deg,rgba(18,4,0,.22),rgba(38,8,0,.12) 60%,rgba(18,4,18,.28))',vignette:'radial-gradient(ellipse at center,transparent 28%,rgba(8,0,0,.85) 100%)',text:'#fff7ed',accent:'#fb923c',accent2:'#f472b6',track:'rgba(255,170,70,.14)',btnBg:'rgba(251,146,60,.18)',btnFg:'#fde68a',pill:'rgba(255,110,35,.09)',panel:'rgba(22,7,0,.72)',glow:'0 0 65px rgba(251,146,60,.38)',hdr:true,grain:false,scanlines:false,lb:false,isMedia:false},
  {id:'forest',name:'Forest',cat:'nat',swatch:'linear-gradient(135deg,#bbf7d0,#4ade80,#166534)',font:"'Fraunces',serif",bgType:'forest',baseBg:['#061509','#0b2212','#040e06'],overlay:'radial-gradient(ellipse at 50% 0%,rgba(74,222,128,.09),rgba(6,21,9,.55) 70%)',vignette:'radial-gradient(ellipse at center,transparent 38%,rgba(0,8,3,.84) 100%)',text:'#dcfce7',accent:'#4ade80',accent2:'#86efac',track:'rgba(74,222,128,.13)',btnBg:'rgba(74,222,128,.13)',btnFg:'#bbf7d0',pill:'rgba(74,222,128,.06)',panel:'rgba(3,12,5,.72)',glow:'0 0 65px rgba(74,222,128,.22)',hdr:true,grain:false,scanlines:false,lb:false,isMedia:false},
  {id:'ocean',name:'Ocean',cat:'nat',swatch:'linear-gradient(135deg,#e0f2fe,#38bdf8,#0369a1)',font:"'Josefin Sans',sans-serif",bgType:'ocean',baseBg:['#010d18','#031422','#040f1e'],overlay:'radial-gradient(ellipse at 50% 100%,rgba(56,189,248,.13),rgba(1,13,24,.45) 70%)',vignette:'radial-gradient(ellipse at center,transparent 32%,rgba(0,5,14,.85) 100%)',text:'#e0f2fe',accent:'#38bdf8',accent2:'#7dd3fc',track:'rgba(56,189,248,.13)',btnBg:'rgba(56,189,248,.13)',btnFg:'#bae6fd',pill:'rgba(56,189,248,.06)',panel:'rgba(1,9,20,.72)',glow:'0 0 65px rgba(56,189,248,.25)',hdr:true,grain:false,scanlines:false,lb:false,isMedia:false},
  {id:'candy',name:'Candy',cat:'nat',swatch:'linear-gradient(135deg,#fce7f3,#f9a8d4,#a855f7)',font:"'Comfortaa',cursive",bgType:'candy',baseBg:['#180420','#220830','#10021a'],overlay:'radial-gradient(ellipse at 30% 30%,rgba(244,114,182,.12),transparent 60%)',vignette:'radial-gradient(ellipse at center,transparent 38%,rgba(12,2,20,.84) 100%)',text:'#fdf4ff',accent:'#f472b6',accent2:'#c084fc',track:'rgba(244,114,182,.13)',btnBg:'rgba(244,114,182,.15)',btnFg:'#fce7f3',pill:'rgba(244,114,182,.07)',panel:'rgba(18,3,26,.72)',glow:'0 0 65px rgba(244,114,182,.28)',hdr:true,grain:false,scanlines:false,lb:false,isMedia:false},
  {id:'nordic',name:'Nordic',cat:'nat',swatch:'linear-gradient(135deg,#f8fafc,#cbd5e1,#64748b)',font:"'Josefin Sans',sans-serif",bgType:'nordic',baseBg:['#f1f5f9','#e2e8f0','#f8fafc'],overlay:'none',vignette:'none',text:'#0f172a',accent:'#334155',accent2:'#64748b',track:'rgba(15,23,42,.09)',btnBg:'rgba(15,23,42,.07)',btnFg:'#0f172a',pill:'rgba(15,23,42,.05)',panel:'rgba(232,238,246,.9)',glow:'none',hdr:false,grain:false,scanlines:false,lb:false,isMedia:false,light:true},
  {id:'midnight',name:'Midnight',cat:'nat',swatch:'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)',font:"'Orbitron',monospace",bgType:'midnight',baseBg:['#02010a','#03000d','#050010'],overlay:'radial-gradient(ellipse at 50% 50%,rgba(109,40,217,.09),transparent 70%)',vignette:'radial-gradient(ellipse at center,transparent 28%,rgba(1,0,7,.9) 100%)',text:'#ede9fe',accent:'#a78bfa',accent2:'#c4b5fd',track:'rgba(167,139,250,.13)',btnBg:'rgba(167,139,250,.13)',btnFg:'#ddd6fe',pill:'rgba(167,139,250,.06)',panel:'rgba(2,1,8,.78)',glow:'0 0 65px rgba(167,139,250,.22)',hdr:true,grain:false,scanlines:false,lb:false,isMedia:false},
  {id:'lemon',name:'Lemon',cat:'nat',swatch:'linear-gradient(135deg,#fef9c3,#fde047,#ca8a04)',font:"'Nunito',sans-serif",bgType:'lemon',baseBg:['#fefce8','#fef9c3','#fef3c7'],overlay:'none',vignette:'none',text:'#713f12',accent:'#ca8a04',accent2:'#d97706',track:'rgba(202,138,4,.13)',btnBg:'rgba(202,138,4,.11)',btnFg:'#78350f',pill:'rgba(202,138,4,.06)',panel:'rgba(254,250,228,.92)',glow:'none',hdr:false,grain:false,scanlines:false,lb:false,isMedia:false,light:true},
  // LITERARY
  {id:'literary',name:'Literary Clock',cat:'nat',sub:'Open book',tagline:'📖 Every minute, a story.',swatch:'linear-gradient(135deg,#c8a870,#8b6914,#3d2c0a)',font:"'Lora',serif",bgType:'literary',baseBg:['#0d0a06','#160f05','#090604'],overlay:'radial-gradient(ellipse at 50% 30%,rgba(160,110,25,.08),rgba(10,7,3,.6) 70%)',vignette:'radial-gradient(ellipse at center,transparent 20%,rgba(5,3,0,.96) 100%)',text:'#f5e8c8',accent:'#c8a870',accent2:'#e8c880',track:'rgba(200,168,112,.15)',btnBg:'rgba(200,168,112,.15)',btnFg:'#f5e8c8',pill:'rgba(200,168,112,.07)',panel:'rgba(8,6,2,.9)',glow:'0 0 40px rgba(200,168,112,.2)',hdr:true,grain:true,scanlines:false,lb:false,isMedia:true,transition:'defaultFade',quotes:['Loading literary clock…']},
  // TV
  {id:'supernatural',name:'Supernatural',cat:'tv',sub:'TV Series',tagline:'🔥 The Road So Far…',font:"'Cinzel',serif",bgType:'supernatural',baseBg:['#0c0300','#190700','#090200'],overlay:'radial-gradient(ellipse at 50% 85%,rgba(190,55,0,.2),rgba(9,2,0,.6) 58%)',vignette:'radial-gradient(ellipse at center,transparent 18%,rgba(4,0,0,.94) 100%)',text:'#fde8c8',accent:'#e05500',accent2:'#ff9944',track:'rgba(220,85,0,.2)',btnBg:'rgba(200,65,0,.2)',btnFg:'#fde8c8',pill:'rgba(200,65,0,.1)',panel:'rgba(8,2,0,.88)',glow:'0 0 50px rgba(220,75,0,.5)',hdr:true,grain:true,scanlines:false,lb:true,isMedia:true,transition:'fire',quotes:['"Saving people, hunting things — the family business."','"Driver picks the music. Shotgun shuts his cakehole."','"I\'m the one who gripped you tight and raised you from perdition."','"Family don\'t end with blood."']},
  {id:'mentalist',name:'The Mentalist',cat:'tv',sub:'TV Series',tagline:'🔴 Red John was here.',font:"'Playfair Display',serif",bgType:'mentalist',baseBg:['#0c0600','#180d00','#090400'],overlay:'radial-gradient(ellipse at 50% 25%,rgba(180,15,0,.11),rgba(9,4,0,.55) 70%)',vignette:'radial-gradient(ellipse at center,transparent 22%,rgba(4,2,0,.93) 100%)',text:'#fdf0e0',accent:'#cc1100',accent2:'#ff4422',track:'rgba(200,12,0,.18)',btnBg:'rgba(180,12,0,.18)',btnFg:'#fdf0e0',pill:'rgba(180,12,0,.09)',panel:'rgba(10,5,0,.88)',glow:'0 0 40px rgba(180,12,0,.35)',hdr:true,grain:true,scanlines:false,lb:true,isMedia:true,transition:'redblood',quotes:['"I\'m a mentalist — I see what others choose to ignore."','"Everyone lies. The trick is knowing which lies matter."']},
  {id:'sopranos',name:'The Sopranos',cat:'tv',sub:'TV Series',tagline:'🥃 You\'re gonna die anyway.',font:"'Special Elite',cursive",bgType:'sopranos',baseBg:['#070707','#0e0e0e','#040404'],overlay:'radial-gradient(ellipse at 50% 65%,rgba(120,88,0,.09),rgba(7,7,7,.6) 70%)',vignette:'radial-gradient(ellipse at center,transparent 18%,rgba(0,0,0,.96) 100%)',text:'#e8d5a0',accent:'#c8a000',accent2:'#e8c840',track:'rgba(200,158,0,.15)',btnBg:'rgba(180,138,0,.17)',btnFg:'#e8d5a0',pill:'rgba(180,138,0,.07)',panel:'rgba(4,4,4,.92)',glow:'0 0 38px rgba(200,148,0,.22)',hdr:true,grain:true,scanlines:true,lb:true,isMedia:true,transition:'smoke',quotes:['"Those who want respect, give respect."','"A wrong decision is better than none."']},
  {id:'dark',name:'Dark',cat:'tv',sub:'TV Series',tagline:'⏳ The beginning is the end.',font:"'Josefin Sans',sans-serif",bgType:'dark',baseBg:['#000000','#020206','#010104'],overlay:'radial-gradient(ellipse at 50% 50%,rgba(0,70,150,.07),rgba(0,0,4,.72) 70%)',vignette:'radial-gradient(ellipse at center,transparent 12%,rgba(0,0,4,.97) 100%)',text:'#c8d8e8',accent:'#4488cc',accent2:'#88aadd',track:'rgba(68,136,204,.14)',btnBg:'rgba(50,100,180,.15)',btnFg:'#c8d8e8',pill:'rgba(50,100,180,.07)',panel:'rgba(0,0,4,.95)',glow:'0 0 38px rgba(50,100,200,.22)',hdr:true,grain:false,scanlines:true,lb:true,isMedia:true,transition:'timeloop',quotes:['"The beginning is the end and the end is the beginning."','"We are not free in what we do."']},
  {id:'breakingbad',name:'Breaking Bad',cat:'tv',sub:'TV Series',tagline:'⚗️ I am the danger.',font:"'Bebas Neue',cursive",bgType:'breakingbad',baseBg:['#040900','#090e00','#030700'],overlay:'radial-gradient(ellipse at 50% 75%,rgba(95,190,0,.1),rgba(4,9,0,.62) 68%)',vignette:'radial-gradient(ellipse at center,transparent 22%,rgba(2,5,0,.95) 100%)',text:'#e8f8c0',accent:'#7ec800',accent2:'#b8f040',track:'rgba(118,198,0,.17)',btnBg:'rgba(100,178,0,.17)',btnFg:'#e8f8c0',pill:'rgba(100,178,0,.07)',panel:'rgba(3,7,0,.9)',glow:'0 0 48px rgba(108,198,0,.32)',hdr:true,grain:true,scanlines:false,lb:true,isMedia:true,transition:'chemical',quotes:['"I am the one who knocks."','"Say my name."','"Science, bitch!"']},
  {id:'strangerthings',name:'Stranger Things',cat:'tv',sub:'TV Series',tagline:'🔦 The Upside Down awaits.',font:"'Orbitron',monospace",bgType:'strangerthings',baseBg:['#04000e','#080018','#020008'],overlay:'radial-gradient(ellipse at 50% 50%,rgba(170,0,215,.11),rgba(4,0,12,.62) 70%)',vignette:'radial-gradient(ellipse at center,transparent 18%,rgba(2,0,8,.96) 100%)',text:'#f0e0ff',accent:'#cc44ff',accent2:'#ee88ff',track:'rgba(200,55,255,.15)',btnBg:'rgba(180,38,220,.17)',btnFg:'#f0e0ff',pill:'rgba(180,38,220,.07)',panel:'rgba(2,0,10,.92)',glow:'0 0 55px rgba(180,38,220,.38)',hdr:true,grain:false,scanlines:true,lb:true,isMedia:true,transition:'updown',quotes:['"Friends don\'t lie."','"She\'s our friend and she\'s crazy."']},
  // MOVIES
  {id:'interstellar',name:'Interstellar',cat:'movie',sub:'2014 · Sci-Fi',tagline:'🌌 Do not go gentle.',font:"'Josefin Sans',sans-serif",bgType:'interstellar',baseBg:['#000305','#000810','#000204'],overlay:'radial-gradient(ellipse at 50% 40%,rgba(0,100,200,.08),rgba(0,3,8,.7) 70%)',vignette:'radial-gradient(ellipse at center,transparent 10%,rgba(0,2,6,.97) 100%)',text:'#d0e8ff',accent:'#4499ee',accent2:'#88ccff',track:'rgba(68,153,238,.15)',btnBg:'rgba(50,130,220,.15)',btnFg:'#d0e8ff',pill:'rgba(50,130,220,.07)',panel:'rgba(0,2,6,.95)',glow:'0 0 45px rgba(50,130,220,.25)',hdr:true,grain:false,scanlines:false,lb:true,isMedia:true,transition:'warp',quotes:['"Do not go gentle into that good night."','"Love transcends dimensions of time and space."']},
  {id:'dune',name:'Dune',cat:'movie',sub:'2021 · Epic',tagline:'🏜️ The spice must flow.',font:"'Cinzel',serif",bgType:'dune',baseBg:['#1a1000','#2e1c00','#120c00'],overlay:'radial-gradient(ellipse at 50% 80%,rgba(210,140,0,.12),rgba(18,10,0,.6) 65%)',vignette:'radial-gradient(ellipse at center,transparent 20%,rgba(8,5,0,.96) 100%)',text:'#f5e8c0',accent:'#d4a020',accent2:'#f0c840',track:'rgba(212,158,30,.18)',btnBg:'rgba(190,140,20,.18)',btnFg:'#f5e8c0',pill:'rgba(190,140,20,.08)',panel:'rgba(10,6,0,.9)',glow:'0 0 48px rgba(210,155,20,.3)',hdr:true,grain:true,scanlines:false,lb:true,isMedia:true,transition:'sandstorm',quotes:['"The spice must flow."','"I must not fear. Fear is the mind-killer."']},
  {id:'matrix',name:'The Matrix',cat:'movie',sub:'1999 · Sci-Fi',tagline:'💊 There is no spoon.',font:"'Orbitron',monospace",bgType:'matrix',baseBg:['#000a00','#001200','#000800'],overlay:'radial-gradient(ellipse at 50% 50%,rgba(0,180,0,.07),rgba(0,8,0,.65) 70%)',vignette:'radial-gradient(ellipse at center,transparent 20%,rgba(0,5,0,.97) 100%)',text:'#c0ffc0',accent:'#00ee00',accent2:'#44ff44',track:'rgba(0,220,0,.17)',btnBg:'rgba(0,180,0,.17)',btnFg:'#c0ffc0',pill:'rgba(0,180,0,.07)',panel:'rgba(0,5,0,.92)',glow:'0 0 50px rgba(0,200,0,.35)',hdr:true,grain:false,scanlines:true,lb:true,isMedia:true,transition:'matrixrain',quotes:['"There is no spoon."','"Free your mind."']},
  {id:'bladerunner',name:'Blade Runner 2049',cat:'movie',sub:'2017 · Neo-Noir',tagline:'🌧️ Tears in rain.',font:"'Teko',sans-serif",bgType:'bladerunner',baseBg:['#0a0500','#120800','#080400'],overlay:'radial-gradient(ellipse at 50% 30%,rgba(255,120,0,.09),rgba(8,4,0,.65) 70%)',vignette:'radial-gradient(ellipse at center,transparent 14%,rgba(5,2,0,.97) 100%)',text:'#f5d0a0',accent:'#e87020',accent2:'#ffaa55',track:'rgba(230,108,28,.18)',btnBg:'rgba(200,95,20,.18)',btnFg:'#f5d0a0',pill:'rgba(200,95,20,.08)',panel:'rgba(6,3,0,.92)',glow:'0 0 50px rgba(220,100,20,.3)',hdr:true,grain:true,scanlines:true,lb:true,isMedia:true,transition:'neon_rain',quotes:['"All those moments will be lost in time, like tears in rain."']},
  {id:'inception',name:'Inception',cat:'movie',sub:'2010 · Thriller',tagline:'🌀 One small step.',font:"'Playfair Display',serif",bgType:'inception',baseBg:['#060608','#0a0a10','#040406'],overlay:'radial-gradient(ellipse at 50% 50%,rgba(80,80,200,.08),rgba(5,5,8,.68) 70%)',vignette:'radial-gradient(ellipse at center,transparent 16%,rgba(3,3,5,.97) 100%)',text:'#e0deff',accent:'#9090ee',accent2:'#bbbbff',track:'rgba(140,140,230,.15)',btnBg:'rgba(120,120,200,.15)',btnFg:'#e0deff',pill:'rgba(120,120,200,.07)',panel:'rgba(3,3,6,.92)',glow:'0 0 45px rgba(120,120,210,.28)',hdr:true,grain:false,scanlines:false,lb:true,isMedia:true,transition:'dream',quotes:['"An idea is like a virus — resilient, highly contagious."','"Dreams feel real while we\'re in them."']},
  {id:'godfather',name:'The Godfather',cat:'movie',sub:'1972 · Crime',tagline:'🌹 An offer he can\'t refuse.',font:"'IM Fell English',serif",bgType:'godfather',baseBg:['#050500','#0a0900','#030300'],overlay:'radial-gradient(ellipse at 30% 30%,rgba(80,60,0,.08),rgba(5,5,0,.65) 70%)',vignette:'radial-gradient(ellipse at center,transparent 12%,rgba(2,2,0,.98) 100%)',text:'#e0d0a8',accent:'#b09040',accent2:'#d0b060',track:'rgba(176,142,58,.15)',btnBg:'rgba(150,125,45,.16)',btnFg:'#e0d0a8',pill:'rgba(150,125,45,.07)',panel:'rgba(3,3,0,.95)',glow:'0 0 35px rgba(170,135,50,.2)',hdr:true,grain:true,scanlines:false,lb:true,isMedia:true,transition:'rose',quotes:['"I\'m gonna make him an offer he can\'t refuse."','"Leave the gun. Take the cannoli."']},
  // F1
  {id:'redbull',name:'Red Bull Racing',cat:'f1',sub:'Constructor · RB20',tagline:'🏆 Maximum attack.',font:"'Orbitron',monospace",bgType:'redbull',baseBg:['#0a0d1a','#121728','#060810'],overlay:'radial-gradient(ellipse at 50% 80%,rgba(232,0,45,.13),rgba(8,10,22,.65) 65%)',vignette:'radial-gradient(ellipse at center,transparent 20%,rgba(2,3,10,.97) 100%)',text:'#f0f4ff',accent:'#e8002d',accent2:'#1e41ff',track:'rgba(232,0,45,.2)',btnBg:'rgba(232,0,45,.18)',btnFg:'#f0f4ff',pill:'rgba(232,0,45,.1)',panel:'rgba(6,8,20,.92)',glow:'0 0 55px rgba(232,0,45,.4),0 0 110px rgba(30,65,255,.18)',hdr:true,grain:false,scanlines:false,lb:true,isMedia:true,transition:'f1_launch',quotes:['"To finish first, first you must finish."','"Maximum attack." — Max Verstappen']},
  {id:'ferrari',name:'Scuderia Ferrari',cat:'f1',sub:'Constructor · SF-24',tagline:'🐎 Forza Ferrari.',font:"'Cinzel',serif",bgType:'ferrari',baseBg:['#1a0000','#2d0000','#100000'],overlay:'radial-gradient(ellipse at 50% 70%,rgba(255,237,0,.08),rgba(20,0,0,.6) 65%)',vignette:'radial-gradient(ellipse at center,transparent 18%,rgba(8,0,0,.97) 100%)',text:'#fff9e6',accent:'#ff2800',accent2:'#ffed00',track:'rgba(255,40,0,.2)',btnBg:'rgba(255,40,0,.2)',btnFg:'#fff9e6',pill:'rgba(255,40,0,.1)',panel:'rgba(12,0,0,.92)',glow:'0 0 60px rgba(255,40,0,.45),0 0 120px rgba(255,237,0,.12)',hdr:true,grain:true,scanlines:false,lb:true,isMedia:true,transition:'f1_burnout',quotes:['"Il Cavallino Rampante." — Ferrari','Forza Ferrari!']},
  {id:'mercedes',name:'Mercedes-AMG F1',cat:'f1',sub:'Constructor · W15',tagline:'⭐ Still we rise.',font:"'Josefin Sans',sans-serif",bgType:'mercedes',baseBg:['#001a17','#002520','#000e0d'],overlay:'radial-gradient(ellipse at 50% 50%,rgba(0,210,190,.09),rgba(0,14,13,.65) 65%)',vignette:'radial-gradient(ellipse at center,transparent 22%,rgba(0,6,5,.97) 100%)',text:'#e8fffd',accent:'#00d2be',accent2:'#c0c0c0',track:'rgba(0,210,190,.18)',btnBg:'rgba(0,210,190,.15)',btnFg:'#e8fffd',pill:'rgba(0,210,190,.08)',panel:'rgba(0,10,9,.92)',glow:'0 0 55px rgba(0,210,190,.35)',hdr:true,grain:false,scanlines:false,lb:true,isMedia:true,transition:'f1_launch',quotes:['"Still I rise." — Lewis Hamilton','"We never stop pushing." — Toto Wolff']},
  {id:'mclaren',name:'McLaren F1 Team',cat:'f1',sub:'Constructor · MCL38',tagline:'🟠 Relentless.',font:"'Bebas Neue',cursive",bgType:'mclaren',baseBg:['#1a0900','#2e1200','#0f0600'],overlay:'radial-gradient(ellipse at 50% 60%,rgba(255,128,0,.14),rgba(18,8,0,.65) 65%)',vignette:'radial-gradient(ellipse at center,transparent 20%,rgba(8,4,0,.97) 100%)',text:'#fff5e6',accent:'#ff8000',accent2:'#ffffff',track:'rgba(255,128,0,.2)',btnBg:'rgba(255,128,0,.18)',btnFg:'#fff5e6',pill:'rgba(255,128,0,.1)',panel:'rgba(12,5,0,.92)',glow:'0 0 55px rgba(255,128,0,.42)',hdr:true,grain:false,scanlines:false,lb:true,isMedia:true,transition:'f1_burnout',quotes:['"Relentless." — McLaren','"The papaya spirit never dies."']},
  {id:'astonmartin',name:'Aston Martin F1',cat:'f1',sub:'Constructor · AMR24',tagline:'🟢 British Racing Green.',font:"'Playfair Display',serif",bgType:'astonmartin',baseBg:['#001a16','#002820','#000e0b'],overlay:'radial-gradient(ellipse at 50% 50%,rgba(0,111,98,.14),rgba(0,12,10,.65) 65%)',vignette:'radial-gradient(ellipse at center,transparent 22%,rgba(0,6,4,.97) 100%)',text:'#e6fff8',accent:'#006f62',accent2:'#cedc00',track:'rgba(0,111,98,.2)',btnBg:'rgba(0,111,98,.18)',btnFg:'#e6fff8',pill:'rgba(0,111,98,.09)',panel:'rgba(0,10,8,.92)',glow:'0 0 50px rgba(0,111,98,.35),0 0 100px rgba(206,220,0,.1)',hdr:true,grain:false,scanlines:false,lb:true,isMedia:true,transition:'f1_launch',quotes:['"British Racing Green. Always."','"Power, beauty, soul." — Aston Martin']}
];

const THEME_BY_ID=Object.fromEntries(THEMES.map(t=>[t.id,t]));
const THEMES_BY_CAT={nat:THEMES.filter(t=>t.cat==='nat'),tv:THEMES.filter(t=>t.cat==='tv'),movie:THEMES.filter(t=>t.cat==='movie'),f1:THEMES.filter(t=>t.cat==='f1')};
const NAT_QUOTES=['The secret of getting ahead is getting started.','Focus on being productive instead of busy.','Small steps every day lead to giant leaps.','Deep work is the superpower of the 21st century.','Done is better than perfect.','The present moment is where all your power lives.','Consistency beats intensity every single time.'];

// ═══════════════════════════════════════════════════════════════════════
// LITERARY CLOCK DATA  (embedded subset — every 5-min slot covered)
// Full open dataset: github.com/JohannesNE/literature-clock
// ═══════════════════════════════════════════════════════════════════════
const LIT_CLOCK=(()=>{
  const d={};
  const entries=[
    ["00:00","It was midnight, and tomorrow was the first day of the rest of her life.","— Anonymous"],
    ["00:05","Five minutes past midnight, and the street lay still.","— Anonymous"],
    ["00:10","Ten past midnight — the world asleep, the night alive.","— Anonymous"],
    ["00:15","It was a quarter past midnight when the owl spoke.","— Anonymous"],
    ["00:20","Twenty minutes into the new day, and she was still reading.","— Anonymous"],
    ["00:25","The clock struck twenty-five past the hour of midnight.","— Anonymous"],
    ["00:30","Half past midnight. The fire had burned to embers.","— Anonymous"],
    ["00:35","At thirty-five past midnight, he finally set down the pen.","— Anonymous"],
    ["00:40","Twenty minutes to one in the morning.","— Anonymous"],
    ["00:45","A quarter to one, and the stars were at their brightest.","— Anonymous"],
    ["00:50","Ten minutes to one. She could hear the sea.","— Anonymous"],
    ["00:55","Five to one. The last train had long departed.","— Anonymous"],
    ["01:00","It was one o'clock in the morning and all was still.","— Anonymous"],
    ["01:05","Five past one in the morning — who could sleep?","— Anonymous"],
    ["01:10","The clock showed ten past one when the letter arrived.","— Anonymous"],
    ["01:15","A quarter past one in the still morning.","— Anonymous"],
    ["01:20","Twenty past one — he lit another candle.","— Anonymous"],
    ["01:25","One twenty-five; the notebook remained open.","— Anonymous"],
    ["01:30","Half past one. The house was entirely silent.","— Anonymous"],
    ["01:35","One thirty-five and the rain had not stopped.","— Anonymous"],
    ["01:40","Twenty minutes to two in the morning.","— Anonymous"],
    ["01:45","A quarter to two. She turned the last page.","— Anonymous"],
    ["01:50","Ten to two — the kettle was on.","— Anonymous"],
    ["01:55","Five minutes to two. The stars were fading.","— Anonymous"],
    ["02:00","Two o'clock struck and no one stirred.","— Anonymous"],
    ["02:05","Five past two. The dream began again.","— Anonymous"],
    ["02:10","Ten past two in the morning.","— Anonymous"],
    ["02:15","Quarter past two and still he paced.","— Anonymous"],
    ["02:20","Twenty past two — the ink had dried.","— Anonymous"],
    ["02:25","Two twenty-five. Silence was loudest then.","— Anonymous"],
    ["02:30","Half past two. The moon moved westward.","— Anonymous"],
    ["02:35","Two thirty-five. Not yet dawn.","— Anonymous"],
    ["02:40","Twenty to three in the morning.","— Anonymous"],
    ["02:45","A quarter to three, and the fire was out.","— Anonymous"],
    ["02:50","Ten to three. Sleep would not come.","— Anonymous"],
    ["02:55","Five to three. The world held its breath.","— Anonymous"],
    ["03:00","Three o'clock in the morning. The darkest hour.","— Anonymous"],
    ["03:05","Five past three and the dog barked once.","— Anonymous"],
    ["03:10","Three ten in the morning.","— Anonymous"],
    ["03:15","A quarter past three. She wrote the first sentence.","— Anonymous"],
    ["03:20","Three twenty. The cat watched from the sill.","— Anonymous"],
    ["03:25","Three twenty-five. He had not moved.","— Anonymous"],
    ["03:30","Half past three and the frost was thick.","— Anonymous"],
    ["03:35","Three thirty-five. The stars were countless.","— Anonymous"],
    ["03:40","Twenty to four in the morning.","— Anonymous"],
    ["03:45","A quarter to four. The horizon grayed.","— Anonymous"],
    ["03:50","Ten to four. The first birds stirred.","— Anonymous"],
    ["03:55","Five to four, and the night was nearly done.","— Anonymous"],
    ["04:00","Four o'clock. The bakers were already at work.","— Anonymous"],
    ["04:05","Five past four in the early morning.","— Anonymous"],
    ["04:10","Four ten. The newspaper had not come.","— Anonymous"],
    ["04:15","A quarter past four. The sky lightened faintly.","— Anonymous"],
    ["04:20","Four twenty — the first light crept in.","— Anonymous"],
    ["04:25","Four twenty-five. She put on her coat.","— Anonymous"],
    ["04:30","Half past four. Dawn was close.","— Anonymous"],
    ["04:35","Four thirty-five. Birdsong began.","— Anonymous"],
    ["04:40","Twenty to five. The dew was heavy.","— Anonymous"],
    ["04:45","A quarter to five in the morning.","— Anonymous"],
    ["04:50","Ten to five. She'd been awake all night.","— Anonymous"],
    ["04:55","Five to five. The first train whistled far away.","— Anonymous"],
    ["05:00","Five o'clock in the morning, and the world was new.","— Anonymous"],
    ["05:05","Five past five. The milkman rattled the gate.","— Anonymous"],
    ["05:10","Five ten. A perfect pale sky.","— Anonymous"],
    ["05:15","Quarter past five. The roosters crowed.","— Anonymous"],
    ["05:20","Five twenty. She laced her shoes for the long walk.","— Anonymous"],
    ["05:25","Five twenty-five. Sunrise was minutes away.","— Anonymous"],
    ["05:30","Half past five in the morning.","— Anonymous"],
    ["05:35","Five thirty-five. The frost melted from the glass.","— Anonymous"],
    ["05:40","Twenty to six. The bakery opened its door.","— Anonymous"],
    ["05:45","A quarter to six in the morning.","— Anonymous"],
    ["05:50","Ten to six. She made the first coffee of the day.","— Anonymous"],
    ["05:55","Five to six. She heard the front door open.","— Anonymous"],
    ["06:00","Six o'clock in the morning, and the day had begun.","— Anonymous"],
    ["06:05","Five past six. The street was already busy.","— Anonymous"],
    ["06:10","Six ten in the morning — he checked his watch twice.","— Anonymous"],
    ["06:15","A quarter past six. The kettle sang.","— Anonymous"],
    ["06:20","Six twenty. He read the headlines and frowned.","— Anonymous"],
    ["06:25","Six twenty-five. The school bus had already passed.","— Anonymous"],
    ["06:30","Half past six. She tied her hair and set out.","— Anonymous"],
    ["06:35","Six thirty-five. The world was ordinary and beautiful.","— Anonymous"],
    ["06:40","Twenty to seven. He missed the earlier train.","— Anonymous"],
    ["06:45","A quarter to seven in the morning.","— Anonymous"],
    ["06:50","Ten to seven. The commuters filled the platform.","— Anonymous"],
    ["06:55","Five to seven. Everything was possible.","— Anonymous"],
    ["07:00","Seven o'clock and the city woke all at once.","— Anonymous"],
    ["07:05","Five past seven. He was already late.","— Anonymous"],
    ["07:10","Seven ten. The coffee had gone cold.","— Anonymous"],
    ["07:15","A quarter past seven. The children were eating breakfast.","— Anonymous"],
    ["07:20","Seven twenty. She counted the days until summer.","— Anonymous"],
    ["07:25","Seven twenty-five. The world expected things.","— Anonymous"],
    ["07:30","Half past seven in the morning.","— Anonymous"],
    ["07:35","Seven thirty-five. The radio played an old song.","— Anonymous"],
    ["07:40","Twenty to eight. The emails had already begun.","— Anonymous"],
    ["07:45","A quarter to eight. She revised the plan.","— Anonymous"],
    ["07:50","Ten to eight. The bus was on time for once.","— Anonymous"],
    ["07:55","Five to eight. He rehearsed what he would say.","— Anonymous"],
    ["08:00","Eight o'clock. Another morning, another beginning.","— Anonymous"],
    ["08:05","Five past eight. The doors opened.","— Anonymous"],
    ["08:10","Eight ten. The meeting was not for two hours.","— Anonymous"],
    ["08:15","A quarter past eight. She sharpened her pencil.","— Anonymous"],
    ["08:20","Eight twenty. The light was perfect for working.","— Anonymous"],
    ["08:25","Eight twenty-five. The notebook waited.","— Anonymous"],
    ["08:30","Half past eight. She began.","— Anonymous"],
    ["08:35","Eight thirty-five. He had already filled a page.","— Anonymous"],
    ["08:40","Twenty to nine. The flow had come.","— Anonymous"],
    ["08:45","A quarter to nine. The words were good today.","— Anonymous"],
    ["08:50","Ten to nine. She crossed out the last paragraph.","— Anonymous"],
    ["08:55","Five to nine. He brewed a second pot.","— Anonymous"],
    ["09:00","Nine o'clock precisely. The clock in the hall chimed.","— Anonymous"],
    ["09:05","Five past nine. The library opened.","— Anonymous"],
    ["09:10","Nine ten. She found the book she'd been looking for.","— Anonymous"],
    ["09:15","A quarter past nine in the morning.","— Anonymous"],
    ["09:20","Nine twenty. The ideas came faster now.","— Anonymous"],
    ["09:25","Nine twenty-five. He lost track of time.","— Anonymous"],
    ["09:30","Half past nine. She made a note to remember.","— Anonymous"],
    ["09:35","Nine thirty-five. The window was open.","— Anonymous"],
    ["09:40","Twenty to ten. The morning was still young.","— Anonymous"],
    ["09:45","A quarter to ten in the morning.","— Anonymous"],
    ["09:50","Ten to ten. She had not noticed the hour.","— Anonymous"],
    ["09:55","Five to ten. The session timer ticked on.","— Anonymous"],
    ["10:00","Ten o'clock in the morning. A fine clear day.","— Anonymous"],
    ["10:05","Five past ten. The sun had climbed high.","— Anonymous"],
    ["10:10","Ten past ten. The letters arrived.","— Anonymous"],
    ["10:15","A quarter past ten.","— Anonymous"],
    ["10:20","Ten twenty. She stretched and returned to work.","— Anonymous"],
    ["10:25","Ten twenty-five. Half the morning gone.","— Anonymous"],
    ["10:30","Half past ten. The tea was ready.","— Anonymous"],
    ["10:35","Ten thirty-five. He answered no messages.","— Anonymous"],
    ["10:40","Twenty to eleven. Deep work, uninterrupted.","— Anonymous"],
    ["10:45","A quarter to eleven in the morning.","— Anonymous"],
    ["10:50","Ten to eleven. She was nearly finished.","— Anonymous"],
    ["10:55","Five to eleven. He read it back aloud.","— Anonymous"],
    ["11:00","Eleven o'clock. The morning was accomplished.","— Anonymous"],
    ["11:05","Five past eleven. She stepped outside.","— Anonymous"],
    ["11:10","Eleven ten. The garden was in full sun.","— Anonymous"],
    ["11:15","A quarter past eleven in the morning.","— Anonymous"],
    ["11:20","Eleven twenty. He thought of nothing in particular.","— Anonymous"],
    ["11:25","Eleven twenty-five. The world was very good.","— Anonymous"],
    ["11:30","Half past eleven. Midday was close.","— Anonymous"],
    ["11:35","Eleven thirty-five. She sharpened her pencil again.","— Anonymous"],
    ["11:40","Twenty to noon. One last thing before lunch.","— Anonymous"],
    ["11:45","A quarter to noon.","— Anonymous"],
    ["11:50","Ten to noon. Almost midday.","— Anonymous"],
    ["11:55","Five minutes to noon.","— Anonymous"],
    ["12:00","Twelve o'clock noon. The sun stood still.","— Anonymous"],
    ["12:05","Five past noon. She closed the morning's work.","— Anonymous"],
    ["12:10","Twelve ten. Lunchtime, at last.","— Anonymous"],
    ["12:15","A quarter past noon.","— Anonymous"],
    ["12:20","Twelve twenty. The afternoon lay ahead.","— Anonymous"],
    ["12:25","Twelve twenty-five. He lingered over his meal.","— Anonymous"],
    ["12:30","Half past noon. The afternoon was beginning.","— Anonymous"],
    ["12:35","Twelve thirty-five. The pigeons came for crumbs.","— Anonymous"],
    ["12:40","Twenty to one in the afternoon.","— Anonymous"],
    ["12:45","A quarter to one in the afternoon.","— Anonymous"],
    ["12:50","Ten to one. She had eaten too much.","— Anonymous"],
    ["12:55","Five to one in the afternoon.","— Anonymous"],
    ["13:00","One o'clock in the afternoon. Back to work.","— Anonymous"],
    ["13:05","Five past one. The afternoon session began.","— Anonymous"],
    ["13:10","One ten. The focus took time to return.","— Anonymous"],
    ["13:15","A quarter past one in the afternoon.","— Anonymous"],
    ["13:20","One twenty. The ideas resumed.","— Anonymous"],
    ["13:25","One twenty-five. She was in the rhythm now.","— Anonymous"],
    ["13:30","Half past one. The afternoon was generous.","— Anonymous"],
    ["13:35","One thirty-five. He did not stop for tea.","— Anonymous"],
    ["13:40","Twenty to two in the afternoon.","— Anonymous"],
    ["13:45","A quarter to two. The hardest part was done.","— Anonymous"],
    ["13:50","Ten to two. She reviewed her morning's work.","— Anonymous"],
    ["13:55","Five to two. He was pleased.","— Anonymous"],
    ["14:00","Two o'clock in the afternoon. A productive day.","— Anonymous"],
    ["14:05","Five past two. The afternoon stretched ahead.","— Anonymous"],
    ["14:10","Two ten. She made a list.","— Anonymous"],
    ["14:15","A quarter past two.","— Anonymous"],
    ["14:20","Two twenty. The sun had moved.","— Anonymous"],
    ["14:25","Two twenty-five. He read back what he had written.","— Anonymous"],
    ["14:30","Half past two. The afternoon was long and still.","— Anonymous"],
    ["14:35","Two thirty-five. She made an amendment.","— Anonymous"],
    ["14:40","Twenty to three.","— Anonymous"],
    ["14:45","A quarter to three. Tea was necessary.","— Anonymous"],
    ["14:50","Ten to three. The light was changing.","— Anonymous"],
    ["14:55","Five to three. She was nearly there.","— Anonymous"],
    ["15:00","Three o'clock in the afternoon. The day's third act.","— Anonymous"],
    ["15:05","Five past three. The afternoon slumped slightly.","— Anonymous"],
    ["15:10","Three ten. Coffee helped.","— Anonymous"],
    ["15:15","A quarter past three.","— Anonymous"],
    ["15:20","Three twenty. The birds were restless in the trees.","— Anonymous"],
    ["15:25","Three twenty-five. He allowed himself a biscuit.","— Anonymous"],
    ["15:30","Half past three. The day was more than half done.","— Anonymous"],
    ["15:35","Three thirty-five. She resolved to finish before dark.","— Anonymous"],
    ["15:40","Twenty to four in the afternoon.","— Anonymous"],
    ["15:45","A quarter to four. The light was golden.","— Anonymous"],
    ["15:50","Ten to four. She was almost finished.","— Anonymous"],
    ["15:55","Five to four. The end was in sight.","— Anonymous"],
    ["16:00","Four o'clock in the afternoon.","— Anonymous"],
    ["16:05","Five past four. She stretched at last.","— Anonymous"],
    ["16:10","Four ten. He saved the document.","— Anonymous"],
    ["16:15","A quarter past four.","— Anonymous"],
    ["16:20","Four twenty. The shadows were lengthening.","— Anonymous"],
    ["16:25","Four twenty-five. She began to tidy the desk.","— Anonymous"],
    ["16:30","Half past four. The afternoon was winding down.","— Anonymous"],
    ["16:35","Four thirty-five. The street was quieter.","— Anonymous"],
    ["16:40","Twenty to five in the afternoon.","— Anonymous"],
    ["16:45","A quarter to five. Nearly the end of the working day.","— Anonymous"],
    ["16:50","Ten to five. One last thing.","— Anonymous"],
    ["16:55","Five to five. She saved everything twice.","— Anonymous"],
    ["17:00","Five o'clock. Done for the day.","— Anonymous"],
    ["17:05","Five past five in the evening.","— Anonymous"],
    ["17:10","Five ten. He locked the office door.","— Anonymous"],
    ["17:15","A quarter past five in the evening.","— Anonymous"],
    ["17:20","Five twenty. The evening was beginning.","— Anonymous"],
    ["17:25","Five twenty-five. She walked slowly home.","— Anonymous"],
    ["17:30","Half past five. The sun was lower now.","— Anonymous"],
    ["17:35","Five thirty-five. The first stars were invisible yet.","— Anonymous"],
    ["17:40","Twenty to six. He cooked something simple.","— Anonymous"],
    ["17:45","A quarter to six in the evening.","— Anonymous"],
    ["17:50","Ten to six. She opened a book.","— Anonymous"],
    ["17:55","Five to six. The evening was her own.","— Anonymous"],
    ["18:00","Six o'clock in the evening.","— Anonymous"],
    ["18:05","Five past six. She poured a glass.","— Anonymous"],
    ["18:10","Six ten. The news was the same as always.","— Anonymous"],
    ["18:15","A quarter past six. She turned it off.","— Anonymous"],
    ["18:20","Six twenty. He telephoned a friend.","— Anonymous"],
    ["18:25","Six twenty-five. Laughter on the line.","— Anonymous"],
    ["18:30","Half past six. The day was nearly done.","— Anonymous"],
    ["18:35","Six thirty-five. She walked to the window.","— Anonymous"],
    ["18:40","Twenty to seven in the evening.","— Anonymous"],
    ["18:45","A quarter to seven. Dinner was ready.","— Anonymous"],
    ["18:50","Ten to seven. He set the table.","— Anonymous"],
    ["18:55","Five to seven. The evening light was beautiful.","— Anonymous"],
    ["19:00","Seven o'clock in the evening.","— Anonymous"],
    ["19:05","Five past seven. She read the old letters.","— Anonymous"],
    ["19:10","Seven ten. The room was warm.","— Anonymous"],
    ["19:15","A quarter past seven in the evening.","— Anonymous"],
    ["19:20","Seven twenty. He built a fire.","— Anonymous"],
    ["19:25","Seven twenty-five. The evening settled in.","— Anonymous"],
    ["19:30","Half past seven. She returned to her book.","— Anonymous"],
    ["19:35","Seven thirty-five. The chapter was long but good.","— Anonymous"],
    ["19:40","Twenty to eight in the evening.","— Anonymous"],
    ["19:45","A quarter to eight. He made notes in the margin.","— Anonymous"],
    ["19:50","Ten to eight. The fire crackled.","— Anonymous"],
    ["19:55","Five to eight. One more chapter.","— Anonymous"],
    ["20:00","Eight o'clock in the evening.","— Anonymous"],
    ["20:05","Five past eight. The children were in bed.","— Anonymous"],
    ["20:10","Eight ten. The house was peaceable.","— Anonymous"],
    ["20:15","A quarter past eight in the evening.","— Anonymous"],
    ["20:20","Eight twenty. She wrote in her journal.","— Anonymous"],
    ["20:25","Eight twenty-five. The pen moved easily.","— Anonymous"],
    ["20:30","Half past eight. She had written two pages.","— Anonymous"],
    ["20:35","Eight thirty-five. He closed the book and thought.","— Anonymous"],
    ["20:40","Twenty to nine in the evening.","— Anonymous"],
    ["20:45","A quarter to nine. The night was calm.","— Anonymous"],
    ["20:50","Ten to nine. She wasn't tired yet.","— Anonymous"],
    ["20:55","Five to nine. One more entry.","— Anonymous"],
    ["21:00","Nine o'clock in the evening.","— Anonymous"],
    ["21:05","Five past nine. The stars were out.","— Anonymous"],
    ["21:10","Nine ten. She counted them idly.","— Anonymous"],
    ["21:15","A quarter past nine in the evening.","— Anonymous"],
    ["21:20","Nine twenty. He was nearly at the end.","— Anonymous"],
    ["21:25","Nine twenty-five. The last paragraph.","— Anonymous"],
    ["21:30","Half past nine. She closed the notebook.","— Anonymous"],
    ["21:35","Nine thirty-five. The day had been good.","— Anonymous"],
    ["21:40","Twenty to ten in the evening.","— Anonymous"],
    ["21:45","A quarter to ten. The night was beautiful.","— Anonymous"],
    ["21:50","Ten to ten. Sleep was coming.","— Anonymous"],
    ["21:55","Five to ten. She folded the corner of the page.","— Anonymous"],
    ["22:00","Ten o'clock at night.","— Anonymous"],
    ["22:05","Five past ten. He turned out the light.","— Anonymous"],
    ["22:10","Ten past ten at night.","— Anonymous"],
    ["22:15","A quarter past ten. She was nearly asleep.","— Anonymous"],
    ["22:20","Ten twenty. The clock ticked softly.","— Anonymous"],
    ["22:25","Ten twenty-five. The house was still.","— Anonymous"],
    ["22:30","Half past ten at night.","— Anonymous"],
    ["22:35","Ten thirty-five. She heard the rain begin.","— Anonymous"],
    ["22:40","Twenty to eleven at night.","— Anonymous"],
    ["22:45","A quarter to eleven. The world was very quiet.","— Anonymous"],
    ["22:50","Ten to eleven at night.","— Anonymous"],
    ["22:55","Five to eleven. Tomorrow would be another day.","— Anonymous"],
    ["23:00","Eleven o'clock at night.","— Anonymous"],
    ["23:05","Five past eleven. The moon was up.","— Anonymous"],
    ["23:10","Eleven ten at night.","— Anonymous"],
    ["23:15","A quarter past eleven. She dreamed already.","— Anonymous"],
    ["23:20","Eleven twenty. The last log burned down.","— Anonymous"],
    ["23:25","Eleven twenty-five. He counted his blessings.","— Anonymous"],
    ["23:30","Half past eleven at night.","— Anonymous"],
    ["23:35","Eleven thirty-five. She thought of the day just passed.","— Anonymous"],
    ["23:40","Twenty to midnight.","— Anonymous"],
    ["23:45","A quarter to midnight.","— Anonymous"],
    ["23:50","Ten to midnight. The year's last hour was coming.","— Anonymous"],
    ["23:55","Five to midnight. Tomorrow was a clean page.","— Anonymous"]
  ];
  entries.forEach(([t,q,src])=>{d[t]={quote:q,source:src};});
  return d;
})();

// ═══════════════════════════════════════════════════════════════════════
// CANVAS SETUP
// ═══════════════════════════════════════════════════════════════════════
const bgCanvas=document.getElementById('bgCanvas');
const bgCtx=bgCanvas.getContext('2d',{alpha:false});
const tCanvas=document.getElementById('transCanvas');
const tCtx=tCanvas.getContext('2d');
let W=0,H=0;

function resize(){
  W=bgCanvas.width=tCanvas.width=window.innerWidth;
  H=bgCanvas.height=tCanvas.height=window.innerHeight;
  skylineReady=false;
  buildParticles();
}
window.addEventListener('resize',resize,{passive:true});

// ═══════════════════════════════════════════════════════════════════════
// PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════════════════
const PSTRIDE=9;
let pool=new Float32Array(0),poolN=0;
let matCols=null;
let skylineReady=false,skylineCount=0;
const MAX_SKY=120;
const skyX=new Float32Array(MAX_SKY),skyW=new Float32Array(MAX_SKY),skyHt=new Float32Array(MAX_SKY);

function buildParticles(){
  const t=currentTheme;poolN=0;matCols=null;
  const make=n=>{pool=new Float32Array(n*PSTRIDE);poolN=n;};
  const p=i=>i*PSTRIDE;
  switch(t.bgType){
    case 'aurora':{make(80);const cols=t.bgColors||['#6ee7b7'];for(let i=0;i<80;i++){const o=p(i);pool[o]=rnd(W);pool[o+1]=rnd(H);pool[o+2]=rndpm(.28);pool[o+3]=rndpm(.28);pool[o+4]=rnd(2)+.5;pool[o+5]=rnd(.55)+.2;pool[o+7]=i%cols.length;}break;}
    case 'midnight':case 'strangerthings':case 'interstellar':{const n=t.bgType==='interstellar'?280:200;make(n);for(let i=0;i<n;i++){const o=p(i);pool[o]=rnd(W);pool[o+1]=rnd(H);pool[o+4]=rnd(t.bgType==='interstellar'?1.2:1.5)+.2;pool[o+5]=rnd(.8)+.15;pool[o+7]=rnd(Math.PI*2);pool[o+8]=rnd(.018)+.004;}break;}
    case 'candy':{make(22);for(let i=0;i<22;i++){const o=p(i);pool[o]=rnd(W);pool[o+1]=H+60;pool[o+2]=rndpm(.3);pool[o+3]=-(rnd(.3)+.1);pool[o+4]=rnd(36)+10;pool[o+5]=rnd(.1)+.03;pool[o+7]=rnd(Math.PI*2);}break;}
    case 'ocean':case 'dark':{make(5);for(let i=0;i<5;i++){const o=p(i);pool[o+1]=H*(.26+i*.13);pool[o+7]=16+i*13;pool[o+8]=.004+i*.002;pool[o+2]=.0025+i*.001;pool[o+3]=i*.7;pool[o+5]=t.bgType==='dark'?.032:.065;}break;}
    case 'supernatural':{make(50);for(let i=0;i<50;i++){const o=p(i);pool[o]=rnd(W);pool[o+1]=rnd(H);pool[o+2]=rndpm(.25);pool[o+3]=-(rnd(.45)+.12);pool[o+4]=rnd(2)+.5;pool[o+5]=rnd(.8)+.2;pool[o+6]=rnd(1);pool[o+7]=rnd(.0025)+.0008;}break;}
    case 'mentalist':{make(12);for(let i=0;i<12;i++){const o=p(i);pool[o]=rnd(W);pool[o+1]=rnd(H);pool[o+2]=rndpm(.18);pool[o+3]=rndpm(.18);pool[o+4]=rnd(3)+1;pool[o+5]=rnd(.3)+.07;pool[o+7]=rnd(Math.PI*2);pool[o+8]=rndpm(.008);}break;}
    case 'sopranos':{make(14);for(let i=0;i<14;i++){const o=p(i);pool[o]=rnd(W*.5)+W*.25;pool[o+1]=H;pool[o+2]=rndpm(.1);pool[o+3]=-(rnd(.35)+.08);pool[o+4]=rnd(16)+5;pool[o+5]=rnd(.06)+.02;pool[o+7]=rnd(.1)+.04;}break;}
    case 'breakingbad':{make(22);for(let i=0;i<22;i++){const o=p(i);pool[o]=rnd(W);pool[o+1]=rnd(H);pool[o+2]=rndpm(.22);pool[o+3]=rndpm(.22);pool[o+4]=rnd(22)+7;pool[o+5]=rnd(.15)+.04;pool[o+7]=rnd(Math.PI*2);pool[o+8]=rndpm(.007);}break;}
    case 'dune':{make(60);for(let i=0;i<60;i++){const o=p(i);pool[o]=rnd(W);pool[o+1]=rnd(H);pool[o+2]=rndpm(.12);pool[o+3]=rnd(.16)+.04;pool[o+4]=rnd(1.5)+.3;pool[o+5]=rnd(.5)+.15;pool[o+6]=rnd(1);}break;}
    case 'bladerunner':{make(90);for(let i=0;i<90;i++){const o=p(i);pool[o]=rnd(W);pool[o+1]=rnd(H*.6);pool[o+2]=rndpm(.4)-.1;pool[o+3]=rnd(.9)+.3;pool[o+4]=rnd(.8)+.2;pool[o+5]=rnd(.45)+.1;}buildSkyline();break;}
    case 'inception':{make(4);for(let i=0;i<4;i++){const o=p(i);pool[o]=W/2;pool[o+1]=H/2;pool[o+4]=80+i*90;pool[o+5]=.045-i*.008;pool[o+7]=i*.8;pool[o+8]=.004-i*.0007;}break;}
    case 'godfather':{make(8);for(let i=0;i<8;i++){const o=p(i);pool[o]=rnd(W*.5)+W*.25;pool[o+1]=rnd(H*.5)+H*.2;pool[o+2]=rndpm(.07);pool[o+3]=-(rnd(.1)+.04);pool[o+4]=rnd(20)+8;pool[o+5]=rnd(.05)+.02;pool[o+7]=rnd(.04)+.01;}break;}
    case 'redbull':case 'ferrari':case 'mercedes':case 'mclaren':case 'astonmartin':{make(60);for(let i=0;i<60;i++){const o=p(i);pool[o]=rnd(W);pool[o+1]=rnd(H);pool[o+2]=rnd(3)+1.5;pool[o+3]=rndpm(.15);pool[o+4]=rnd(.8)+.3;pool[o+5]=rnd(.55)+.15;pool[o+7]=Math.random();}break;}
    case 'matrix':{buildMatrixRain();break;}
    case 'literary':{make(30);for(let i=0;i<30;i++){const o=p(i);pool[o]=rnd(W);pool[o+1]=rnd(H);pool[o+2]=rndpm(.06);pool[o+3]=-(rnd(.08)+.02);pool[o+4]=rnd(1)+.3;pool[o+5]=rnd(.4)+.1;pool[o+6]=rnd(1);}break;}
    default:break;
  }
}

function buildMatrixRain(){const cols=Math.floor(W/15);matCols=new Float32Array(cols*2);for(let i=0;i<cols;i++){matCols[i*2]=rnd(H);matCols[i*2+1]=rnd(3)+1.5;}}
function buildSkyline(){skylineCount=0;let x=0;while(x<W&&skylineCount<MAX_SKY){const si=skylineCount++;const sw=rnd(45)+12;skyX[si]=x;skyW[si]=sw;skyHt[si]=rnd(H*.38)+H*.07;x+=sw+rnd(4)+1;}skylineReady=true;}

const MAT_CHARS='日ｦｲｸｺｻｼｽｾｿﾀﾂﾃﾄﾅﾆﾇﾈﾊﾋﾌﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾙﾚﾛﾜ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ═══════════════════════════════════════════════════════════════════════
// BACKGROUND RENDERER (same as v6 + literary)
// ═══════════════════════════════════════════════════════════════════════
let tick=0,lastTs=0;

function drawBg(dt){
  const c=bgCtx,t=currentTheme;tick+=dt;
  c.clearRect(0,0,W,H);
  const bg=t.baseBg;
  const gr=c.createRadialGradient(W*.5,H*.4,0,W*.5,H*.55,Math.max(W,H)*.9);
  gr.addColorStop(0,bg[0]);gr.addColorStop(.5,bg[1]||bg[0]);gr.addColorStop(1,bg[2]||bg[0]);
  c.fillStyle=gr;c.fillRect(0,0,W,H);
  const bt=t.bgType;
  if(bt==='aurora'){const cols=t.bgColors||['#6ee7b7'];for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2];pool[o+1]+=pool[o+3];if(pool[o]<-60)pool[o]=W+60;if(pool[o]>W+60)pool[o]=-60;if(pool[o+1]<-60)pool[o+1]=H+60;if(pool[o+1]>H+60)pool[o+1]=-60;const px=pool[o],py=pool[o+1],pr=pool[o+4],pa=pool[o+5];const col=cols[pool[o+7]|0];const g=c.createRadialGradient(px,py,0,px,py,pr*50);g.addColorStop(0,col+'88');g.addColorStop(1,col+'00');c.beginPath();c.arc(px,py,pr*50,0,Math.PI*2);c.fillStyle=g;c.globalAlpha=pa*.3;c.fill();c.beginPath();c.arc(px,py,pr,0,Math.PI*2);c.fillStyle=col;c.globalAlpha=pa;c.fill();}c.globalAlpha=1;}
  else if(bt==='sunrise'){const s=tick*.08,s2=tick*.14;const sg=c.createLinearGradient(0,0,W*Math.abs(Math.sin(s)),H);sg.addColorStop(0,'#1a0900');sg.addColorStop(.35+.08*Math.sin(s2),'#8b1a00');sg.addColorStop(.72,'#3d0060');sg.addColorStop(1,'#0a0020');c.fillStyle=sg;c.fillRect(0,0,W,H);const sg2=c.createRadialGradient(W*.5,H*.66,0,W*.5,H*.66,W*.52);sg2.addColorStop(0,'rgba(255,130,28,.28)');sg2.addColorStop(.5,'rgba(255,55,75,.09)');sg2.addColorStop(1,'transparent');c.fillStyle=sg2;c.fillRect(0,0,W,H);}
  else if(bt==='forest'){for(let i=0;i<3;i++){const bx=W*(.2+i*.3)+Math.sin(tick*.28+i)*25,by=H*(.3+i*.2)+Math.cos(tick*.2+i)*18;const rg=c.createRadialGradient(bx,by,0,bx,by,180+i*70);rg.addColorStop(0,t.accent+'15');rg.addColorStop(1,'transparent');c.fillStyle=rg;c.fillRect(0,0,W,H);}}
  else if(bt==='ocean'||bt==='dark'){if(bt==='dark'){const dg=c.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,W*.52);dg.addColorStop(0,'rgba(0,38,95,.055)');dg.addColorStop(1,'transparent');c.fillStyle=dg;c.fillRect(0,0,W,H);c.save();c.translate(W*.5,H*.5);for(let i=0;i<3;i++){const r=(72+i*66)+Math.sin(tick*.35+i)*6;c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.strokeStyle=t.accent;c.globalAlpha=.032-i*.007;c.lineWidth=.8;c.stroke();}c.globalAlpha=1;c.restore();drawSymbol(c,bt);}for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o+3]+=pool[o+2];c.beginPath();c.moveTo(0,pool[o+1]);for(let x=0;x<=W;x+=8)c.lineTo(x,pool[o+1]+Math.sin(x*pool[o+8]+pool[o+3])*pool[o+7]);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fillStyle=t.accent;c.globalAlpha=pool[o+5];c.fill();}c.globalAlpha=1;}
  else if(bt==='midnight'||bt==='strangerthings'||bt==='interstellar'){for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o+7]+=pool[o+8];const a=pool[o+5]*(0.45+0.55*Math.sin(pool[o+7]));c.beginPath();c.arc(pool[o],pool[o+1],pool[o+4],0,Math.PI*2);c.fillStyle='#ffffff';c.globalAlpha=a;c.fill();}c.globalAlpha=1;if(bt==='strangerthings'){const pg=c.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,W*.4);pg.addColorStop(0,t.accent+'12');pg.addColorStop(1,'transparent');c.fillStyle=pg;c.globalAlpha=.5+.5*Math.sin(tick*.7);c.fillRect(0,0,W,H);c.globalAlpha=1;drawSymbol(c,bt);}if(bt==='interstellar'){const bh=c.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,W*.28);bh.addColorStop(0,'rgba(0,0,0,.9)');bh.addColorStop(.35,'rgba(0,30,80,.3)');bh.addColorStop(.65,'rgba(0,60,140,.1)');bh.addColorStop(1,'transparent');c.fillStyle=bh;c.fillRect(0,0,W,H);c.save();c.translate(W*.5,H*.5);c.beginPath();c.ellipse(0,0,W*.22,W*.055,0,0,Math.PI*2);c.strokeStyle='rgba(80,160,255,.12)';c.lineWidth=16;c.stroke();c.restore();drawSymbol(c,bt);}}
  else if(bt==='candy'){for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2]+Math.sin(tick+pool[o+7])*.2;pool[o+1]+=pool[o+3];if(pool[o+1]<-120){pool[o+1]=H+50;pool[o]=rnd(W);}c.beginPath();c.arc(pool[o],pool[o+1],pool[o+4],0,Math.PI*2);c.strokeStyle=t.accent;c.globalAlpha=pool[o+5]*3;c.lineWidth=1.5;c.stroke();c.fillStyle=t.baseBg[0];c.globalAlpha=pool[o+5];c.fill();}c.globalAlpha=1;}
  else if(bt==='nordic'){c.globalAlpha=.022;for(let x=0;x<W;x+=40)for(let y=0;y<H;y+=40){c.fillStyle='#64748b';c.fillRect(x,y,1,1);}c.globalAlpha=1;}
  else if(bt==='lemon'){c.globalAlpha=.18;for(let x=0;x<W;x+=28)for(let y=0;y<H;y+=28){c.beginPath();c.arc(x,y,1.3,0,Math.PI*2);c.fillStyle=t.accent;c.fill();}c.globalAlpha=1;}
  else if(bt==='literary'){const gg=c.createRadialGradient(W*.5,H*.4,0,W*.5,H*.6,W*.7);gg.addColorStop(0,'rgba(160,110,25,.07)');gg.addColorStop(1,'transparent');c.fillStyle=gg;c.fillRect(0,0,W,H);for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2];pool[o+1]+=pool[o+3];pool[o+6]-=.0008;if(pool[o+6]<=0||pool[o+1]<0){pool[o]=rnd(W);pool[o+1]=H;pool[o+6]=rnd(.6)+.3;}c.beginPath();c.arc(pool[o],pool[o+1],pool[o+4],0,Math.PI*2);c.fillStyle='rgba(200,168,112,1)';c.globalAlpha=pool[o+5]*pool[o+6]*.5;c.fill();}c.globalAlpha=1;}
  else if(bt==='supernatural'){const fg=c.createRadialGradient(W*.5,H*1.05,0,W*.5,H*.78,W*.62);fg.addColorStop(0,'rgba(220,75,0,.26)');fg.addColorStop(1,'transparent');c.fillStyle=fg;c.fillRect(0,0,W,H);drawSymbol(c,bt);for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o+1]+=pool[o+3];pool[o]+=pool[o+2]+Math.sin(tick*1.8+pool[o+5])*.35;pool[o+6]-=pool[o+7];if(pool[o+6]<=0||pool[o+1]<0){pool[o]=rnd(W);pool[o+1]=H+6;pool[o+6]=1;pool[o+5]=rnd(.8)+.2;}const ec=c.createRadialGradient(pool[o],pool[o+1],0,pool[o],pool[o+1],pool[o+4]*4);ec.addColorStop(0,'rgba(255,175,25,.9)');ec.addColorStop(1,'rgba(200,45,0,0)');c.beginPath();c.arc(pool[o],pool[o+1],pool[o+4]*4,0,Math.PI*2);c.fillStyle=ec;c.globalAlpha=pool[o+6]*pool[o+5]*.45;c.fill();c.beginPath();c.arc(pool[o],pool[o+1],pool[o+4]*.5,0,Math.PI*2);c.fillStyle='#fffae0';c.globalAlpha=pool[o+6];c.fill();}c.globalAlpha=1;}
  else if(bt==='mentalist'){const rg=c.createRadialGradient(W*.5,H*.3,0,W*.5,H*.3,W*.5);rg.addColorStop(0,'rgba(180,8,0,.12)');rg.addColorStop(1,'transparent');c.fillStyle=rg;c.fillRect(0,0,W,H);drawSymbol(c,bt);for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2];pool[o+1]+=pool[o+3];pool[o+7]+=pool[o+8];if(pool[o]<-50)pool[o]=W+50;if(pool[o]>W+50)pool[o]=-50;if(pool[o+1]<-50)pool[o+1]=H+50;if(pool[o+1]>H+50)pool[o+1]=-50;c.save();c.translate(pool[o],pool[o+1]);c.rotate(pool[o+7]);c.beginPath();c.arc(0,0,pool[o+4]*6,0,Math.PI*2);c.strokeStyle=t.accent;c.globalAlpha=pool[o+5];c.lineWidth=1;c.stroke();c.globalAlpha=1;c.restore();}}
  else if(bt==='sopranos'){for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2]+Math.sin(tick*.4+pool[o+5])*.15;pool[o+1]+=pool[o+3];pool[o+4]+=pool[o+7];if(pool[o+1]<-120||pool[o+4]>105){pool[o+1]=H+15;pool[o+4]=rnd(15)+5;pool[o]=rnd(W*.5)+W*.25;pool[o+3]=-(rnd(.32)+.07);}c.beginPath();c.arc(pool[o],pool[o+1],pool[o+4],0,Math.PI*2);c.fillStyle='rgba(175,152,92,1)';c.globalAlpha=pool[o+5]*(1-pool[o+4]/105);c.fill();}c.globalAlpha=1;}
  else if(bt==='breakingbad'){const cg=c.createRadialGradient(W*.5,H*.28,0,W*.5,H*.5,W*.62);cg.addColorStop(0,'rgba(95,190,0,.09)');cg.addColorStop(1,'transparent');c.fillStyle=cg;c.fillRect(0,0,W,H);c.fillStyle='#0b1400';c.fillRect(0,H*.72,W,H*.28);drawSymbol(c,bt);for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2];pool[o+1]+=pool[o+3];pool[o+7]+=pool[o+8];if(pool[o]<-50)pool[o]=W+50;if(pool[o]>W+50)pool[o]=-50;if(pool[o+1]<-50)pool[o+1]=H+50;if(pool[o+1]>H+50)pool[o+1]=-50;drawHex(c,pool[o],pool[o+1],pool[o+4],pool[o+7],pool[o+5],t.accent);}}
  else if(bt==='matrix'){if(!matCols)buildMatrixRain();c.fillStyle='rgba(0,8,0,.18)';c.fillRect(0,0,W,H);c.font='13px monospace';const cols=matCols.length/2;for(let i=0;i<cols;i++){matCols[i*2]+=matCols[i*2+1]*dt*60;if(matCols[i*2]>H+20)matCols[i*2]=-20;const x=i*15;for(let j=0;j<22;j++){const y=matCols[i*2]-j*15;if(y<-15||y>H+15)continue;const fa=j===0?0.95:Math.max(0,0.6-j*.026);c.fillStyle=j===0?`rgba(180,255,180,${fa})`:`rgba(0,${175-j*5},0,${fa})`;c.fillText(MAT_CHARS[(j+Math.floor(tick*3*60))%MAT_CHARS.length],x,y);}}drawSymbol(c,bt);}
  else if(bt==='dune'){const dg=c.createLinearGradient(0,0,0,H);dg.addColorStop(0,'#0e0800');dg.addColorStop(.5,'#1e1200');dg.addColorStop(.75,'#2a1800');dg.addColorStop(1,'#0e0800');c.fillStyle=dg;c.fillRect(0,0,W,H);for(let i=0;i<4;i++){const base=H*(.5+i*.1)+Math.sin(tick*.08+i)*10;c.beginPath();c.moveTo(0,base);for(let x=0;x<=W;x+=6)c.lineTo(x,base+Math.sin(x*.008+tick*.05+i)*28+Math.sin(x*.02-i)*12);c.lineTo(W,H);c.lineTo(0,H);c.closePath();const sg=c.createLinearGradient(0,base,0,base+55);sg.addColorStop(0,`rgba(180,120,20,${.11-i*.022})`);sg.addColorStop(1,'transparent');c.fillStyle=sg;c.fill();}for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2];pool[o+1]+=pool[o+3];pool[o+6]-=.001;if(pool[o+6]<=0||pool[o+1]>H+10){pool[o]=rnd(W);pool[o+1]=rnd(H*.5);pool[o+6]=rnd(.8)+.4;}c.beginPath();c.arc(pool[o],pool[o+1],pool[o+4],0,Math.PI*2);c.fillStyle='rgba(220,170,80,1)';c.globalAlpha=pool[o+5]*pool[o+6]*.55;c.fill();}c.globalAlpha=1;drawSymbol(c,bt);}
  else if(bt==='bladerunner'){if(!skylineReady)buildSkyline();const skyG=c.createLinearGradient(0,0,0,H*.75);skyG.addColorStop(0,'#060300');skyG.addColorStop(.6,'#120600');skyG.addColorStop(1,'#0a0400');c.fillStyle=skyG;c.fillRect(0,0,W,H*.75);[[W*.3,H*.35,'rgba(240,80,20,'],[W*.65,H*.28,'rgba(200,40,10,']].forEach(([nx,ny,col])=>{const ng=c.createRadialGradient(nx,ny,0,nx,ny,W*.38);ng.addColorStop(0,`${col}.12)`);ng.addColorStop(1,'transparent');c.fillStyle=ng;c.fillRect(0,0,W,H);});c.fillStyle='#040200';c.fillRect(0,H*.72,W,H*.28);c.fillStyle='#040200';for(let si=0;si<skylineCount;si++)c.fillRect(skyX[si],H*.72-skyHt[si],skyW[si],skyHt[si]);for(let si=0;si<skylineCount;si++){for(let wy=H*.72-skyHt[si]+4;wy<H*.72-3;wy+=8)for(let wx=skyX[si]+3;wx<skyX[si]+skyW[si]-3;wx+=6){const hash=(si*997+Math.floor(wy)*31+Math.floor(wx)*7)%100;if(hash<30){const lit=((hash+Math.floor(tick*.1*60))%10)>3;if(lit){c.fillStyle=hash<15?'rgba(220,170,80,.5)':'rgba(255,140,60,.4)';c.fillRect(wx,wy,2,3);}}}}for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2];pool[o+1]+=pool[o+3];if(pool[o+1]>H){pool[o+1]=rnd(H*.3);pool[o]=rnd(W);}c.beginPath();c.moveTo(pool[o],pool[o+1]);c.lineTo(pool[o]+pool[o+2]*3.5,pool[o+1]+11);c.strokeStyle='rgba(180,200,255,1)';c.globalAlpha=pool[o+5]*.38;c.lineWidth=.5;c.stroke();}c.globalAlpha=1;drawSymbol(c,bt);}
  else if(bt==='inception'){c.save();c.translate(W*.5,H*.5);c.rotate(Math.sin(tick*.06)*.035);c.globalAlpha=.022;for(let x=-W;x<W;x+=60){c.beginPath();c.moveTo(x,-H);c.lineTo(x,H);c.strokeStyle='#9090dd';c.lineWidth=.5;c.stroke();}for(let y=-H;y<H;y+=60){c.beginPath();c.moveTo(-W,y);c.lineTo(W,y);c.strokeStyle='#9090dd';c.lineWidth=.5;c.stroke();}c.globalAlpha=1;c.restore();for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o+7]+=pool[o+8];const r=pool[o+4]+Math.sin(pool[o+7])*10;c.beginPath();c.arc(pool[o],pool[o+1],r,0,Math.PI*2);c.strokeStyle=t.accent;c.globalAlpha=pool[o+5]*(0.6+0.4*Math.sin(pool[o+7]*2));c.lineWidth=.8;c.stroke();}c.globalAlpha=1;drawSymbol(c,bt);}
  else if(bt==='godfather'){const gg=c.createRadialGradient(W*.3,H*.3,0,W*.3,H*.3,W*.5);gg.addColorStop(0,'rgba(70,52,8,.08)');gg.addColorStop(1,'transparent');c.fillStyle=gg;c.fillRect(0,0,W,H);for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2];pool[o+1]+=pool[o+3];pool[o+4]+=pool[o+7];if(pool[o+1]<-80||pool[o+4]>85){pool[o+1]=H*(.2+rnd(.6));pool[o+4]=rnd(20)+7;pool[o]=rnd(W*.4)+W*.3;}c.beginPath();c.arc(pool[o],pool[o+1],pool[o+4],0,Math.PI*2);c.fillStyle='rgba(130,105,18,1)';c.globalAlpha=pool[o+5]*(1-pool[o+4]/85);c.fill();}c.globalAlpha=1;drawSymbol(c,bt);}
  else if(bt==='redbull'){c.save();c.globalAlpha=.045;for(let x=0;x<W;x+=18){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.strokeStyle='#1e41ff';c.lineWidth=.5;c.stroke();}for(let y=0;y<H;y+=18){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.strokeStyle='#1e41ff';c.lineWidth=.5;c.stroke();}c.globalAlpha=1;c.restore();const rg=c.createRadialGradient(W*.5,H,0,W*.5,H,W*.65);rg.addColorStop(0,'rgba(232,0,45,.22)');rg.addColorStop(.5,'rgba(30,65,255,.08)');rg.addColorStop(1,'transparent');c.fillStyle=rg;c.fillRect(0,0,W,H);drawF1Symbol(c,W,H,tick,'redbull');for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2]*2.5;pool[o+1]+=pool[o+3]*.5;if(pool[o]>W+20){pool[o]=-20;pool[o+1]=rnd(H);}c.beginPath();c.moveTo(pool[o],pool[o+1]);c.lineTo(pool[o]-pool[o+4]*28,pool[o+1]);const sg=c.createLinearGradient(pool[o]-pool[o+4]*28,0,pool[o],0);sg.addColorStop(0,'transparent');sg.addColorStop(1,pool[o+7]>.5?'rgba(232,0,45,1)':'rgba(30,65,255,1)');c.strokeStyle=sg;c.globalAlpha=pool[o+5]*.6;c.lineWidth=pool[o+4]*.5;c.stroke();}c.globalAlpha=1;}
  else if(bt==='ferrari'){const fg=c.createRadialGradient(W*.5,H*.3,0,W*.5,H*.5,W*.75);fg.addColorStop(0,'rgba(220,20,0,.18)');fg.addColorStop(.5,'rgba(140,0,0,.08)');fg.addColorStop(1,'transparent');c.fillStyle=fg;c.fillRect(0,0,W,H);drawF1Symbol(c,W,H,tick,'ferrari');for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2]*2.2;pool[o+1]+=pool[o+3]*.4;if(pool[o]>W+20){pool[o]=-20;pool[o+1]=rnd(H);}const ec=c.createLinearGradient(pool[o]-pool[o+4]*22,0,pool[o],0);ec.addColorStop(0,'transparent');ec.addColorStop(1,'rgba(255,40,0,1)');c.beginPath();c.moveTo(pool[o],pool[o+1]);c.lineTo(pool[o]-pool[o+4]*22,pool[o+1]);c.strokeStyle=ec;c.globalAlpha=pool[o+5]*.55;c.lineWidth=pool[o+4]*.5;c.stroke();}c.globalAlpha=1;}
  else if(bt==='mercedes'){const mg=c.createRadialGradient(W*.5,H*.4,0,W*.5,H*.55,W*.7);mg.addColorStop(0,'rgba(0,210,190,.12)');mg.addColorStop(.5,'rgba(0,100,90,.05)');mg.addColorStop(1,'transparent');c.fillStyle=mg;c.fillRect(0,0,W,H);drawF1Symbol(c,W,H,tick,'mercedes');for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2]*2.0;pool[o+1]+=pool[o+3]*.3;if(pool[o]>W+20){pool[o]=-20;pool[o+1]=rnd(H);}const mc=c.createLinearGradient(pool[o]-pool[o+4]*24,0,pool[o],0);mc.addColorStop(0,'transparent');mc.addColorStop(1,'rgba(0,210,190,1)');c.beginPath();c.moveTo(pool[o],pool[o+1]);c.lineTo(pool[o]-pool[o+4]*24,pool[o+1]);c.strokeStyle=mc;c.globalAlpha=pool[o+5]*.5;c.lineWidth=pool[o+4]*.5;c.stroke();}c.globalAlpha=1;}
  else if(bt==='mclaren'){const og=c.createRadialGradient(W*.5,H*.5,0,W*.5,H*.6,W*.7);og.addColorStop(0,'rgba(255,128,0,.16)');og.addColorStop(.5,'rgba(180,80,0,.06)');og.addColorStop(1,'transparent');c.fillStyle=og;c.fillRect(0,0,W,H);drawF1Symbol(c,W,H,tick,'mclaren');for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2]*2.8;pool[o+1]+=pool[o+3]*.4;if(pool[o]>W+20){pool[o]=-20;pool[o+1]=rnd(H);}const oc=c.createLinearGradient(pool[o]-pool[o+4]*30,0,pool[o],0);oc.addColorStop(0,'transparent');oc.addColorStop(1,'rgba(255,128,0,1)');c.beginPath();c.moveTo(pool[o],pool[o+1]);c.lineTo(pool[o]-pool[o+4]*30,pool[o+1]);c.strokeStyle=oc;c.globalAlpha=pool[o+5]*.6;c.lineWidth=pool[o+4]*.5;c.stroke();}c.globalAlpha=1;}
  else if(bt==='astonmartin'){const ag=c.createRadialGradient(W*.5,H*.4,0,W*.5,H*.55,W*.7);ag.addColorStop(0,'rgba(0,111,98,.14)');ag.addColorStop(.5,'rgba(0,60,54,.06)');ag.addColorStop(1,'transparent');c.fillStyle=ag;c.fillRect(0,0,W,H);drawF1Symbol(c,W,H,tick,'astonmartin');for(let i=0;i<poolN;i++){const o=i*PSTRIDE;pool[o]+=pool[o+2]*1.8;pool[o+1]+=pool[o+3]*.3;if(pool[o]>W+20){pool[o]=-20;pool[o+1]=rnd(H);}const ac=c.createLinearGradient(pool[o]-pool[o+4]*22,0,pool[o],0);ac.addColorStop(0,'transparent');ac.addColorStop(1,'rgba(0,111,98,1)');c.beginPath();c.moveTo(pool[o],pool[o+1]);c.lineTo(pool[o]-pool[o+4]*22,pool[o+1]);c.strokeStyle=ac;c.globalAlpha=pool[o+5]*.5;c.lineWidth=pool[o+4]*.5;c.stroke();}c.globalAlpha=1;}
}

function drawHex(c,x,y,s,rot,a,color){c.save();c.translate(x,y);c.rotate(rot);c.beginPath();for(let i=0;i<6;i++){const ang=(i/6)*Math.PI*2;i?c.lineTo(Math.cos(ang)*s,Math.sin(ang)*s):c.moveTo(Math.cos(ang)*s,Math.sin(ang)*s);}c.closePath();c.strokeStyle=color;c.globalAlpha=a;c.lineWidth=1;c.stroke();c.globalAlpha=1;c.restore();}

// ── Symbols (condensed — same as v6) ──────────────────────────────────
function drawSymbol(c,btype){const fn=SYMBOLS[btype];if(fn)fn(c,W,H,tick);}
const SYMBOLS={
  supernatural(c,W,H,t){const cx=W*.5,cy=H*.58,R=Math.min(W,H)*.16;const breath=.042+.014*Math.sin(t*.55),emGlow=.5+.5*Math.sin(t*.7);c.save();c.translate(cx,cy);const halo=c.createRadialGradient(0,0,R*.7,0,0,R*1.5);halo.addColorStop(0,`rgba(200,60,0,${breath*.22})`);halo.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=halo;c.beginPath();c.arc(0,0,R*1.5,0,Math.PI*2);c.fill();c.strokeStyle='rgba(180,40,0,1)';c.lineWidth=1.4;c.globalAlpha=breath*1.1;c.beginPath();c.arc(0,0,R,0,Math.PI*2);c.stroke();const starPts=[];for(let i=0;i<5;i++){const a=(i*2/5-.5)*Math.PI*2;starPts.push([Math.cos(a)*R,Math.sin(a)*R]);}c.beginPath();c.globalAlpha=breath;c.strokeStyle='rgba(200,45,0,1)';c.lineWidth=1.1;const order=[0,2,4,1,3,0];order.forEach((pi,i)=>i===0?c.moveTo(starPts[pi][0],starPts[pi][1]):c.lineTo(starPts[pi][0],starPts[pi][1]));c.stroke();c.beginPath();c.arc(0,0,R*.045,0,Math.PI*2);c.fillStyle='rgba(255,100,20,1)';c.globalAlpha=breath*2.2*emGlow;c.fill();c.globalAlpha=1;c.restore();},
  mentalist(c,W,H,t){const cx=W*.5,cy=H*.52,R=Math.min(W,H)*.13;const drip=.5+.5*Math.sin(t*.38),breath=.07+.022*Math.sin(t*.5);c.save();c.translate(cx,cy);const bg=c.createRadialGradient(0,0,0,0,0,R*1.6);bg.addColorStop(0,`rgba(120,0,0,${breath*.55})`);bg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=bg;c.beginPath();c.arc(0,0,R*1.6,0,Math.PI*2);c.fill();c.strokeStyle='rgba(160,8,8,1)';c.lineWidth=2.8;c.globalAlpha=breath*1.15;c.lineCap='round';c.beginPath();for(let i=0;i<=60;i++){const a=(i/60)*Math.PI*2;const w=1+.032*Math.sin(i*3.7+t*.08);const px=Math.cos(a)*R*w,py=Math.sin(a)*R*w;i===0?c.moveTo(px,py):c.lineTo(px,py);}c.closePath();c.stroke();c.beginPath();c.arc(-R*.32,-R*.22,R*.1,0,Math.PI*2);c.fillStyle='rgba(150,5,5,1)';c.globalAlpha=breath*1.1;c.fill();c.beginPath();c.arc(R*.3,-R*.2,R*.12,0,Math.PI*2);c.fillStyle='rgba(150,5,5,1)';c.globalAlpha=breath*1.1;c.fill();c.beginPath();c.moveTo(-R*.44,R*.1);c.bezierCurveTo(-R*.44,R*.52,R*.44,R*.52,R*.44,R*.1);c.strokeStyle='rgba(160,8,8,1)';c.lineWidth=2.6;c.globalAlpha=breath*1.15;c.stroke();c.globalAlpha=1;c.restore();},
  dark(c,W,H,t){const cx=W*.5,cy=H*.56,R=Math.min(W,H)*.14;const spinSlow=t*.014,breath=.038+.012*Math.sin(t*.42);c.save();c.translate(cx,cy);c.rotate(spinSlow);c.strokeStyle='rgba(68,136,204,1)';c.lineWidth=1.5;for(let i=0;i<3;i++){const baseA=(i/3)*Math.PI*2-Math.PI/2;const ox=Math.cos(baseA)*R*.5,oy=Math.sin(baseA)*R*.5;const startA=baseA+Math.PI*.42+Math.PI/2,endA=baseA-Math.PI*.42+Math.PI/2+Math.PI*2;c.globalAlpha=breath*(i===0?1.4:i===1?1.15:1.0);c.beginPath();c.arc(ox,oy,R,startA,endA);c.stroke();}c.beginPath();c.arc(0,0,R*.07,0,Math.PI*2);c.fillStyle='rgba(100,175,255,1)';c.globalAlpha=breath*2.8;c.fill();c.globalAlpha=1;c.restore();},
  breakingbad(c,W,H,t){const cx=W*.5,cy=H*.56,R=Math.min(W,H)*.1,breath=.05+.016*Math.sin(t*.55);c.save();c.translate(cx,cy);const cellW=R*1.1,cellH=R*1.3,gap=R*.12;[{sym:'Br',num:'35',wt:'79.9',name:'BROMINE',x:-cellW-gap/2},{sym:'Ba',num:'56',wt:'137.3',name:'BARIUM',x:gap/2}].forEach(({sym,num,wt,name,x})=>{const hi=sym==='Br'?'#7ec800':'#b8f040';c.save();c.translate(x+cellW/2,0);c.strokeStyle=hi;c.lineWidth=1.1;c.globalAlpha=breath;c.strokeRect(-cellW/2,-cellH/2,cellW,cellH);c.font=`${R*.22}px 'Bebas Neue',sans-serif`;c.fillStyle=hi;c.textAlign='left';c.textBaseline='top';c.globalAlpha=breath*.85;c.fillText(num,-cellW/2+R*.07,-cellH/2+R*.05);c.textAlign='right';c.fillText(wt,cellW/2-R*.05,-cellH/2+R*.05);c.font=`bold ${R*.72}px 'Bebas Neue',sans-serif`;c.textAlign='center';c.textBaseline='middle';c.globalAlpha=breath*1.1;c.fillText(sym,0,0);c.restore();});c.globalAlpha=1;c.restore();},
  strangerthings(c,W,H,t){const cx=W*.5,cy=H*.55,R=Math.min(W,H)*.13;const openAmt=.45+.45*Math.sin(t*.38),breath=.045+.013*Math.sin(t*.65);c.save();c.translate(cx,cy);for(let i=0;i<5;i++){const pa=(i/5)*Math.PI*2-Math.PI/2,ext=openAmt*R*.58,pw=R*(.36+openAmt*.08);c.save();c.rotate(pa);c.beginPath();c.moveTo(0,R*.12);c.bezierCurveTo(-pw*.7,R*.18+ext*.25,-pw*.55,R*.15+ext*.8,0,R*.18+ext);c.bezierCurveTo(pw*.55,R*.15+ext*.8,pw*.7,R*.18+ext*.25,0,R*.12);c.closePath();const pg=c.createLinearGradient(0,R*.12,0,R*.18+ext);pg.addColorStop(0,`rgba(60,0,100,${breath*1.4})`);pg.addColorStop(1,`rgba(80,5,130,${breath*.5})`);c.fillStyle=pg;c.fill();c.restore();}const mawR=R*(.12+.06*openAmt);c.beginPath();c.arc(0,0,mawR,0,Math.PI*2);c.fillStyle='rgba(5,0,12,1)';c.globalAlpha=.85;c.fill();c.globalAlpha=1;c.restore();},
  interstellar(c,W,H,t){const cx=W*.5,cy=H*.54,R=Math.min(W,H)*.15;const diskRot=t*.038,breath=.032+.01*Math.sin(t*.55),tilt=.22;c.save();c.translate(cx,cy);for(let layer=3;layer>=0;layer--){const lr=R*(1+layer*.18);c.beginPath();c.ellipse(0,0,lr,lr*tilt,diskRot+layer*.15,0,Math.PI*2);c.strokeStyle='rgba(120,190,255,1)';c.globalAlpha=breath*[.12,.085,.055,.03][layer]*20;c.lineWidth=layer===0?3:layer===1?1.8:1;c.stroke();}c.beginPath();c.arc(0,0,R*.52,0,Math.PI*2);c.fillStyle='rgba(0,0,0,1)';c.globalAlpha=.97;c.fill();c.globalAlpha=1;c.restore();},
  dune(c,W,H,t){const cx=W*.5,cy=H*.55,R=Math.min(W,H)*.1;const breath=.04+.012*Math.sin(t*.5),spiceBlue=.4+.6*Math.abs(Math.sin(t*.18));c.save();c.translate(cx,cy);[-R*.5,R*.5].forEach(eyeX=>{c.save();c.translate(eyeX,0);c.beginPath();c.ellipse(0,0,R*.38,R*.24,0,0,Math.PI*2);c.fillStyle=`rgba(${180+spiceBlue*40|0},${160+spiceBlue*60|0},${80+spiceBlue*160|0},1)`;c.globalAlpha=breath*1.1;c.fill();c.beginPath();c.arc(0,0,R*.08,0,Math.PI*2);c.fillStyle='rgba(0,0,0,1)';c.globalAlpha=breath*.9;c.fill();c.restore();});c.globalAlpha=1;c.restore();},
  matrix(c,W,H,t){const cx=W*.5,cy=H*.64,R=Math.min(W,H)*.044;const float=Math.sin(t*.5)*R*.18,breath=.06+.018*Math.sin(t*.6);c.save();c.translate(cx,cy+float);c.font=`bold ${Math.max(9,R*1.1)}px monospace`;c.fillStyle='rgba(0,230,0,1)';c.textAlign='center';c.textBaseline='bottom';c.globalAlpha=breath*1.2;c.fillText('CHOOSE',0,-R*1.6);[[-.28,'rgba(190,15,15,1)',-2.1],[.28,'rgba(20,75,210,1)',2.1]].forEach(([rot,col,bx])=>{c.save();c.rotate(rot);c.beginPath();c.ellipse(bx,0,R*1.1,R*.44,0,0,Math.PI*2);c.fillStyle=col;c.globalAlpha=breath*1.1;c.fill();c.restore();});c.globalAlpha=1;c.restore();},
  bladerunner(c,W,H,t){const cx=W*.5,cy=H*.38,R=Math.min(W,H)*.1;const blinkCycle=(t*.14)%Math.PI,openness=Math.max(.05,Math.abs(Math.sin(blinkCycle))),irisRot=t*.055,breath=.042+.012*Math.sin(t*.5);c.save();c.translate(cx,cy);const eyeW=R*1.9,eyeH=R*openness*.7+R*.03;c.beginPath();c.ellipse(0,0,eyeW,eyeH,0,0,Math.PI*2);c.fillStyle='rgba(30,12,0,1)';c.globalAlpha=.85;c.fill();c.strokeStyle='rgba(180,120,50,1)';c.globalAlpha=breath*.9;c.lineWidth=1;c.stroke();c.globalAlpha=1;c.restore();},
  inception(c,W,H,t){const cx=W*.5,cy=H*.57,R=Math.min(W,H)*.1;const wobble=Math.sin(t*.11)*.07,breath=.042+.012*Math.sin(t*.65);c.save();c.translate(cx,cy);c.rotate(wobble);const topW=R*.52,botW=R*.18,th=R*1.3;const bodyG=c.createLinearGradient(-topW,0,topW,0);bodyG.addColorStop(0,`rgba(100,100,180,.12)`);bodyG.addColorStop(.5,`rgba(140,140,220,${breath*1.1})`);bodyG.addColorStop(1,`rgba(100,100,180,.08)`);c.beginPath();c.moveTo(-topW,-th*.45);c.lineTo(topW,-th*.45);c.lineTo(botW,th*.55);c.lineTo(-botW,th*.55);c.closePath();c.fillStyle=bodyG;c.globalAlpha=.82;c.fill();c.strokeStyle='rgba(160,160,230,1)';c.globalAlpha=breath;c.lineWidth=.9;c.stroke();c.globalAlpha=1;c.restore();},
  godfather(c,W,H,t){const cx=W*.42,cy=H*.6,R=Math.min(W,H)*.1,bloom=.55+.4*Math.sin(t*.18),breath=.032+.01*Math.sin(t*.4);c.save();c.translate(cx,cy);const totalPetals=14;for(let i=totalPetals-1;i>=0;i--){const frac=i/totalPetals,a=frac*Math.PI*2*2.5+t*.035;const pr=R*(.04+frac*.62*bloom),ps=R*(.1+frac*.28);const px=Math.cos(a)*pr,py=Math.sin(a)*pr*.72;c.save();c.translate(px,py);c.rotate(a+.9);c.beginPath();c.ellipse(0,0,ps*.75,ps*.52,0,0,Math.PI*2);c.fillStyle=`rgba(${80+frac*70|0},${3+frac*6|0},8,1)`;c.globalAlpha=breath*(0.55+frac*.35);c.fill();c.restore();}c.globalAlpha=1;c.restore();}
};

// ── F1 Symbols ────────────────────────────────────────────────────────
function drawF1Symbol(c,W,H,t,teamId){const fns={redbull:drawF1_redbull,ferrari:drawF1_ferrari,mercedes:drawF1_mercedes,mclaren:drawF1_mclaren,astonmartin:drawF1_astonmartin};const fn=fns[teamId];if(fn)fn(c,W,H,t);}

function drawF1_redbull(c,W,H,t){const cx=W*.5,cy=H*.52,R=Math.min(W,H)*.12;const breath=.04+.012*Math.sin(t*.6);c.save();c.translate(cx,cy);const pw=R*.7,ph=R*.85;c.strokeStyle='rgba(232,0,45,1)';c.lineWidth=1.5;c.globalAlpha=breath*1.1;c.strokeRect(-pw/2,-ph/2,pw,ph);c.font=`bold ${R*.88}px 'Orbitron',monospace`;c.textAlign='center';c.textBaseline='middle';c.fillStyle='rgba(232,0,45,1)';c.globalAlpha=breath;c.fillText('1',0,0);c.font=`${Math.max(6,R*.18)}px 'Orbitron',monospace`;c.fillStyle='rgba(255,220,220,1)';c.globalAlpha=breath*.7;c.fillText('VER',0,ph*.5+R*.18);c.globalAlpha=1;c.restore();}
function drawF1_ferrari(c,W,H,t){const cx=W*.5,cy=H*.54,R=Math.min(W,H)*.13;const breath=.042+.012*Math.sin(t*.5);c.save();c.translate(cx,cy);const bg=c.createRadialGradient(0,0,0,0,0,R*1.7);bg.addColorStop(0,`rgba(255,40,0,${breath*.28})`);bg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=bg;c.beginPath();c.arc(0,0,R*1.7,0,Math.PI*2);c.fill();const msg='FORZA FERRARI';c.font=`${Math.max(6,R*.16)}px 'Cinzel',serif`;c.fillStyle='rgba(255,237,0,1)';c.textAlign='center';c.textBaseline='middle';for(let i=0;i<msg.length;i++){const ca=-Math.PI/2-.5+(i/msg.length)*Math.PI;c.save();c.translate(Math.cos(ca)*R*1.35,Math.sin(ca)*R*1.35);c.rotate(ca+Math.PI/2);c.globalAlpha=breath*1.1;c.fillText(msg[i],0,0);c.restore();}c.globalAlpha=1;c.restore();}
function drawF1_mercedes(c,W,H,t){const cx=W*.5,cy=H*.53,R=Math.min(W,H)*.13;const breath=.038+.01*Math.sin(t*.5),spin=t*.02;c.save();c.translate(cx,cy);c.save();c.rotate(spin);c.strokeStyle='rgba(0,210,190,1)';c.lineWidth=1.4;c.globalAlpha=breath*1.1;c.beginPath();c.arc(0,0,R*.85,0,Math.PI*2);c.stroke();for(let i=0;i<3;i++){const a=(i/3)*Math.PI*2-Math.PI/2;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*R*.85,Math.sin(a)*R*.85);c.stroke();}c.restore();c.globalAlpha=1;c.restore();}
function drawF1_mclaren(c,W,H,t){const cx=W*.5,cy=H*.53,R=Math.min(W,H)*.13;const breath=.042+.012*Math.sin(t*.55);c.save();c.translate(cx,cy);c.globalAlpha=breath*.9;c.strokeStyle='rgba(255,128,0,1)';c.lineWidth=2;c.beginPath();c.moveTo(-R*.9,R*.25);c.bezierCurveTo(-R*.6,-R*.35,R*.0,-R*.7,R*.9,R*.25);c.stroke();c.font=`bold ${R*.9}px 'Bebas Neue',cursive`;c.textAlign='center';c.textBaseline='middle';c.fillStyle='rgba(255,128,0,1)';c.globalAlpha=breath;c.fillText('4',0,0);c.globalAlpha=1;c.restore();}
function drawF1_astonmartin(c,W,H,t){const cx=W*.5,cy=H*.53,R=Math.min(W,H)*.13;const breath=.038+.01*Math.sin(t*.5);c.save();c.translate(cx,cy);c.globalAlpha=breath;c.strokeStyle='rgba(206,220,0,1)';c.lineWidth=1.1;for(let i=0;i<5;i++){const yw=-R*.12+i*R*.06,x1=-R*.9+i*R*.05,x2=-R*.22;c.beginPath();c.moveTo(x1,yw);c.quadraticCurveTo((x1+x2)/2,-R*.3,x2,-R*.05);c.globalAlpha=breath*(.9-i*.08);c.stroke();}for(let i=0;i<5;i++){const yw=-R*.12+i*R*.06,x1=R*.9-i*R*.05,x2=R*.22;c.beginPath();c.moveTo(x1,yw);c.quadraticCurveTo((x1+x2)/2,-R*.3,x2,-R*.05);c.globalAlpha=breath*(.9-i*.08);c.stroke();}c.globalAlpha=1;c.restore();}

// ═══════════════════════════════════════════════════════════════════════
// TIME SYNC
// ═══════════════════════════════════════════════════════════════════════
let clockOffset=0,synced=false,lastSyncAt=0,syncAttempts=0;
const CF_ENDPOINTS=['https://cloudflare.com/cdn-cgi/trace','https://1.1.1.1/cdn-cgi/trace','https://one.one.one.one/cdn-cgi/trace'];
const FALLBACK_ENDPOINT='https://worldtimeapi.org/api/ip';

async function probeEndpoint(url,timeoutMs){try{const t0=performance.now();const res=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(timeoutMs)});const rtt=performance.now()-t0;const ds=res.headers.get('date');if(!ds)return null;res.text().catch(()=>{});return{serverMs:new Date(ds).getTime(),rtt};}catch{return null;}}
async function multiProbe(url,probes,timeout){const results=[];for(let i=0;i<probes;i++){const r=await probeEndpoint(url,timeout);if(r){const localAtMidpoint=Date.now()-r.rtt/2;results.push({offset:r.serverMs-localAtMidpoint,rtt:r.rtt});}if(i<probes-1)await new Promise(res=>setTimeout(res,80));}if(!results.length)return null;results.sort((a,b)=>a.rtt-b.rtt);return results[0];}

async function syncTime(){syncAttempts++;updateSyncUI('syncing');const cfResults=await Promise.all(CF_ENDPOINTS.map(url=>multiProbe(url,3,2500)));let best=null;for(const r of cfResults){if(r&&(!best||r.rtt<best.rtt))best=r;}
if(!best){try{const t0=performance.now();const res=await fetch(FALLBACK_ENDPOINT,{cache:'no-store',signal:AbortSignal.timeout(5000)});const rtt=performance.now()-t0;const d=await res.json();best={offset:new Date(d.datetime).getTime()-(Date.now()-rtt/2),rtt};}catch{}}
if(!best){updateSyncUI('failed');clearTimeout(syncTimer);syncTimer=setTimeout(syncTime,synced?SYNC_INTERVAL_MS:60000);return;}
clockOffset=best.offset;synced=true;lastSyncAt=performance.now();updateSyncUI('ok',best.rtt);clearTimeout(syncTimer);syncTimer=setTimeout(syncTime,SYNC_INTERVAL_MS);}

function updateSyncUI(state,rtt){const dot=DOM.syncDot,label=DOM.syncLabel;if(!dot||!label)return;if(state==='syncing'){dot.style.background='#f59e0b';label.textContent='Syncing…';}else if(state==='ok'){dot.style.background=currentTheme?currentTheme.accent:'#6ee7b7';const ms=Math.abs(Math.round(clockOffset));const rttStr=rtt!=null?` · ${Math.round(rtt)}ms RTT`:'';label.textContent=`Synced · ±${ms}ms${rttStr}`;}else{dot.style.background='#ef4444';label.textContent='Local clock';}}

const SYNC_INTERVAL_MS=15*60*1000;
let syncTimer;

// ═══════════════════════════════════════════════════════════════════════
// SESSION TIMER
// ═══════════════════════════════════════════════════════════════════════
let sessionRunning=false,sessionStart=0,sessionElapsed=0;

document.getElementById('btnStart').addEventListener('click',()=>{
  if(!sessionRunning){
    sessionRunning=true;
    sessionStart=performance.now()-sessionElapsed;
    document.getElementById('btnStart').textContent='Pause';
    DOM.focusInputWrap.classList.add('visible');
    if(SC.pomodoro.active)SC.pomodoro.onStart();
  }else{
    sessionRunning=false;
    sessionElapsed=performance.now()-sessionStart;
    document.getElementById('btnStart').textContent='Resume';
    SC.focusLog.recordPause();
  }
});

document.getElementById('btnReset').addEventListener('click',()=>{
  SC.focusLog.recordSession();
  sessionRunning=false;sessionStart=sessionElapsed=0;
  document.getElementById('btnStart').textContent='Start';
  document.getElementById('sessionTimer').textContent='00:00:00';
  DOM.focusInputWrap.classList.remove('visible');
  DOM.focusInput.value='';
  if(SC.pomodoro.active)SC.pomodoro.reset();
});

function fmtSession(ms){const s=ms/1000|0,h=s/3600|0,m=(s%3600)/60|0,sc=s%60;return p2(h)+':'+p2(m)+':'+p2(sc);}

// ═══════════════════════════════════════════════════════════════════════
// POMODORO MODULE
// ═══════════════════════════════════════════════════════════════════════
SC.pomodoro=(()=>{
  let active=false,mode='work',elapsed=0,pomStart=0,pomCount=0;
  let workMins=25,breakMins=5,longBreakMins=15,longBreakAfter=4;
  const CIRC=339.3;

  function load(){const s=localStorage.getItem('sc_pom');if(s){const d=JSON.parse(s);workMins=d.w||25;breakMins=d.b||5;longBreakMins=d.lb||15;longBreakAfter=d.la||4;}}
  function save(){localStorage.setItem('sc_pom',JSON.stringify({w:workMins,b:breakMins,lb:longBreakMins,la:longBreakAfter}));}
  load();

  function totalMs(){return(mode==='work'?workMins:mode==='break'?breakMins:longBreakMins)*60000;}

  function setActive(v){
    active=v;
    const ring=document.getElementById('pomRingSvg');
    const pill=document.getElementById('pomModePill');
    const label=document.getElementById('sessionLabel');
    if(v){ring.style.display='block';ring.setAttribute('width','80');ring.setAttribute('height','80');ring.style.position='absolute';ring.style.top='50%';ring.style.left='50%';ring.style.transform='translate(-50%,-50%)';ring.style.pointerEvents='none';pill.classList.add('visible');label.textContent='Pomodoro';}
    else{ring.style.display='none';pill.classList.remove('visible');label.textContent='Session Timer';}
  }

  function toggle(){setActive(!active);if(!active){reset();}updateSettingsUI();}

  function onStart(){pomStart=performance.now()-elapsed;}

  function reset(){elapsed=0;mode='work';pomStart=0;updateRing(0,0);}

  function tick(now){
    if(!active||!sessionRunning)return;
    elapsed=now-pomStart+(elapsed>0&&!sessionRunning?elapsed:0);
    const tot=totalMs();
    const rem=Math.max(0,tot-elapsed);
    updateRing(rem,tot);
    if(rem<=0){nextPhase();}
  }

  function pomTimerTick(perf){
    if(!active||!sessionRunning)return;
    const now=performance.now();
    const sesElapsed=now-sessionStart;
    const phaseTot=totalMs();
    const phaseElapsed=sesElapsed%phaseTot;
    const rem=Math.max(0,phaseTot-phaseElapsed);
    updateRing(rem,phaseTot);
    const ms=rem;
    const s=ms/1000|0,m=(s/60)|0,sc=s%60;
    document.getElementById('sessionTimer').textContent='00:'+p2(m)+':'+p2(sc);
    if(rem<=0&&sessionRunning)nextPhase();
  }

  function nextPhase(){
    SC.sound.playChime();
    if(mode==='work'){
      pomCount++;
      const today=new Date().toDateString();
      const stored=JSON.parse(localStorage.getItem('sc_pom_count')||'{}');
      stored[today]=(stored[today]||0)+1;
      localStorage.setItem('sc_pom_count',JSON.stringify(stored));
      mode=(pomCount%longBreakAfter===0)?'longBreak':'break';
    }else{mode='work';}
    sessionStart=performance.now();
    const pill=document.getElementById('pomModePill');
    pill.textContent=mode==='work'?'🍅 Work':(mode==='break'?'☕ Break':'💤 Long Break');
    updateRing(totalMs(),totalMs());
  }

  function updateRing(rem,tot){
    const arc=document.getElementById('pomRingArc');
    if(!arc)return;
    const pct=tot>0?rem/tot:0;
    arc.style.strokeDashoffset=CIRC*(1-pct);
    arc.style.stroke=mode==='work'?'var(--clr-accent)':(mode==='break'?'#38bdf8':'#a78bfa');
  }

  function updateSettingsUI(){
    const countEl=document.getElementById('pomCountToday');
    if(countEl){const today=new Date().toDateString();const stored=JSON.parse(localStorage.getItem('sc_pom_count')||'{}');countEl.textContent=stored[today]||0;}
    ['pomWorkBtns','pomBreakBtns','pomLongBtns'].forEach((id,i)=>{
      const el=document.getElementById(id);
      if(!el)return;
      el.innerHTML='';
      const opts=i===0?[15,20,25,30,45,60]:i===1?[5,10,15]:[3,4,5,6];
      const cur=i===0?workMins/1:i===1?breakMins/1:longBreakAfter;
      opts.forEach(v=>{
        const b=document.createElement('button');
        b.className='btn'+(cur===v?' active-btn':'');
        b.textContent=i<2?`${v}m`:`${v}`;
        b.onclick=()=>{
          if(i===0){workMins=v;}else if(i===1){breakMins=v;}else{longBreakAfter=v;}
          save();updateSettingsUI();
        };
        el.appendChild(b);
      });
    });
  }

  document.getElementById('btnPomToggle').addEventListener('click',()=>{
    toggle();
    SC.modals.open('pomOverlay');
    updateSettingsUI();
  });

  return{get active(){return active;},toggle,onStart,reset,tick:pomTimerTick,updateSettingsUI};
})();

// ═══════════════════════════════════════════════════════════════════════
// WEATHER MODULE — Open-Meteo (free, no API key)
// ═══════════════════════════════════════════════════════════════════════
SC.weather=(()=>{
  const WMO={0:'☀',1:'🌤',2:'⛅',3:'☁',45:'🌫',48:'🌫',51:'🌦',53:'🌦',55:'🌧',61:'🌧',63:'🌧',65:'🌧',71:'🌨',73:'🌨',75:'🌨',80:'🌦',81:'🌧',82:'🌧',95:'⛈',96:'⛈',99:'⛈'};
  let fetched=false;

  async function fetch_weather(){
    if(fetched)return;
    if(!navigator.geolocation){showFallback();return;}
    navigator.geolocation.getCurrentPosition(async pos=>{
      try{
        const{latitude:lat,longitude:lon}=pos.coords;
        const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&temperature_unit=celsius&timezone=auto`;
        const res=await fetch(url,{signal:AbortSignal.timeout(8000)});
        const data=await res.json();
        const temp=Math.round(data.current.temperature_2m);
        const code=data.current.weathercode;
        const icon=WMO[code]||'🌡';
        document.getElementById('weatherIcon').textContent=icon;
        document.getElementById('weatherText').textContent=`${temp}°C`;
        document.getElementById('weatherPill').classList.add('loaded');
        fetched=true;
      }catch{showFallback();}
    },showFallback,{timeout:8000,maximumAge:600000});
  }

  function showFallback(){
    document.getElementById('weatherIcon').textContent='🌡';
    document.getElementById('weatherText').textContent='—';
    document.getElementById('weatherPill').classList.add('loaded');
  }

  return{init:fetch_weather};
})();

// ═══════════════════════════════════════════════════════════════════════
// FOCUS LOG MODULE
// ═══════════════════════════════════════════════════════════════════════
SC.focusLog=(()=>{
  const KEY='sc_focus_log';
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch{return [];}}
  function save(d){localStorage.setItem(KEY,JSON.stringify(d));}

  function recordSession(){
    if(!sessionElapsed&&!sessionRunning)return;
    const task=DOM.focusInput.value.trim()||'Untitled session';
    const dur=sessionRunning?(performance.now()-sessionStart):sessionElapsed;
    if(dur<5000)return;
    const entries=load();
    entries.unshift({time:Date.now(),task,dur:Math.round(dur),date:new Date().toDateString()});
    if(entries.length>200)entries.pop();
    save(entries);
  }

  function recordPause(){/* no-op for now */}

  function renderLog(){
    const el=document.getElementById('logEntries');
    const entries=load();
    if(!entries.length){el.innerHTML='<div class="log-empty">No sessions recorded yet. Start the timer to begin logging.</div>';return;}
    const today=new Date().toDateString();
    const groups={};
    entries.forEach(e=>{const d=e.date||new Date(e.time).toDateString();(groups[d]=groups[d]||[]).push(e);});
    el.innerHTML='';
    Object.entries(groups).forEach(([date,items])=>{
      const hdr=document.createElement('div');
      hdr.className='sc-modal h3';hdr.style.cssText='font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;font-weight:700;opacity:.4;color:var(--clr-text);margin:12px 0 6px';
      hdr.textContent=date===today?'Today':date;el.appendChild(hdr);
      items.forEach(e=>{
        const row=document.createElement('div');row.className='log-entry';
        const d=new Date(e.time);
        row.innerHTML=`<span class="log-time">${p2(d.getHours())}:${p2(d.getMinutes())}</span><span class="log-task">${e.task}</span><span class="log-dur">${fmtSession(e.dur)}</span>`;
        el.appendChild(row);
      });
    });
  }

  function exportCSV(){
    const entries=load();
    if(!entries.length)return;
    const rows=['Time,Task,Duration,Date'];
    entries.forEach(e=>{const d=new Date(e.time);rows.push(`"${d.toLocaleString()}","${e.task.replace(/"/g,'""')}","${fmtSession(e.dur)}","${e.date||''}"`);});
    const blob=new Blob([rows.join('\n')],{type:'text/csv'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`session-log-${Date.now()}.csv`;a.click();
  }

  function clear(){if(!confirm('Clear all session log entries?'))return;localStorage.removeItem(KEY);renderLog();}

  document.getElementById('btnLog').addEventListener('click',()=>{renderLog();SC.modals.open('logOverlay');});

  return{recordSession,recordPause,exportCSV,clear};
})();

// ═══════════════════════════════════════════════════════════════════════
// AMBIENT SOUND MODULE — Web Audio API synthesis, no files
// ═══════════════════════════════════════════════════════════════════════
SC.sound=(()=>{
  let ctx=null,masterGain=null,currentNode=null,currentId=null,fadeTimer=null,volume=0.4,fadeMinutes=0;
  const SOUNDS=[
    {id:'rain',name:'Rain',icon:'🌧'},
    {id:'brown',name:'Brown Noise',icon:'📻'},
    {id:'forest',name:'Forest',icon:'🌲'},
    {id:'cafe',name:'Café',icon:'☕'},
    {id:'ocean',name:'Ocean',icon:'🌊'},
    {id:'fire',name:'Fireplace',icon:'🔥'}
  ];

  function ensureCtx(){
    if(!ctx){ctx=new(window.AudioContext||window.webkitAudioContext)();masterGain=ctx.createGain();masterGain.gain.value=volume;masterGain.connect(ctx.destination);}
    if(ctx.state==='suspended')ctx.resume();
  }

  function makeRain(){
    const bufSize=ctx.sampleRate*2;const buf=ctx.createBuffer(1,bufSize,ctx.sampleRate);const d=buf.getChannelData(0);
    let lastOut=0;for(let i=0;i<bufSize;i++){const white=(Math.random()*2-1);lastOut=.99*lastOut+.01*white;d[i]=lastOut*15;}
    const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;
    const filt=ctx.createBiquadFilter();filt.type='bandpass';filt.frequency.value=800;filt.Q.value=0.5;
    src.connect(filt);filt.connect(masterGain);src.start();
    return{stop:()=>{try{src.stop();}catch{}}};
  }

  function makeBrownNoise(){
    const bufSize=ctx.sampleRate*2;const buf=ctx.createBuffer(1,bufSize,ctx.sampleRate);const d=buf.getChannelData(0);
    let lastOut=0;for(let i=0;i<bufSize;i++){const white=Math.random()*2-1;lastOut=(lastOut+.02*white)/1.02;d[i]=lastOut*3.5;}
    const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;src.connect(masterGain);src.start();
    return{stop:()=>{try{src.stop();}catch{}}};
  }

  function makeForest(){
    const nodes=[];
    // base birds + wind
    [400,600,800,1200,1600].forEach((freq,i)=>{
      const osc=ctx.createOscillator();const g=ctx.createGain();
      osc.type='sine';osc.frequency.value=freq;
      const lfo=ctx.createOscillator();lfo.type='sine';lfo.frequency.value=0.2+i*.08;
      const lfoGain=ctx.createGain();lfoGain.gain.value=freq*.08;
      lfo.connect(lfoGain);lfoGain.connect(osc.frequency);lfo.start();
      g.gain.value=0.012;osc.connect(g);g.connect(masterGain);osc.start();
      nodes.push(osc,lfo);
    });
    const buf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=buf.getChannelData(0);
    let last=0;for(let i=0;i<d.length;i++){last=.995*last+.005*(Math.random()*2-1);d[i]=last*2;}
    const wind=ctx.createBufferSource();wind.buffer=buf;wind.loop=true;
    const filt=ctx.createBiquadFilter();filt.type='lowpass';filt.frequency.value=500;
    wind.connect(filt);filt.connect(masterGain);wind.start();nodes.push(wind);
    return{stop:()=>{nodes.forEach(n=>{try{n.stop();}catch{}});}};
  }

  function makeCafe(){
    // Simulated chatter: layered bandpass noise
    const nodes=[];
    for(let i=0;i<5;i++){
      const buf=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate);const d=buf.getChannelData(0);
      for(let j=0;j<d.length;j++)d[j]=Math.random()*2-1;
      const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;src.loopStart=i*.3;
      const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=400+i*200;f.Q.value=3;
      const g=ctx.createGain();g.gain.value=.018;
      src.connect(f);f.connect(g);g.connect(masterGain);src.start(0,i*.5);nodes.push(src);
    }
    return{stop:()=>{nodes.forEach(n=>{try{n.stop();}catch{}});}};
  }

  function makeOcean(){
    const bufSize=ctx.sampleRate*4;const buf=ctx.createBuffer(1,bufSize,ctx.sampleRate);const d=buf.getChannelData(0);
    let last=0;const period=ctx.sampleRate*4;
    for(let i=0;i<bufSize;i++){last=.999*last+.001*(Math.random()*2-1);const wave=Math.sin(i/period*Math.PI*2)*.5+.5;d[i]=last*8*wave;}
    const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;
    const filt=ctx.createBiquadFilter();filt.type='lowpass';filt.frequency.value=600;
    src.connect(filt);filt.connect(masterGain);src.start();
    return{stop:()=>{try{src.stop();}catch{}}};
  }

  function makeFire(){
    const nodes=[];
    const buf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=buf.getChannelData(0);
    let last=0;for(let i=0;i<d.length;i++){last=.99*last+.01*(Math.random()*2-1);d[i]=last*12;}
    const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;
    const f1=ctx.createBiquadFilter();f1.type='lowpass';f1.frequency.value=200;
    const f2=ctx.createBiquadFilter();f2.type='peaking';f2.frequency.value=100;f2.gain.value=8;
    src.connect(f1);f1.connect(f2);f2.connect(masterGain);src.start();nodes.push(src);
    // crackle
    const crackle=ctx.createBuffer(1,ctx.sampleRate*1,ctx.sampleRate);const cd=crackle.getChannelData(0);
    for(let i=0;i<cd.length;i++){const r=Math.random();cd[i]=r>0.998?(Math.random()*2-1)*4:0;}
    const cs=ctx.createBufferSource();cs.buffer=crackle;cs.loop=true;
    const cg=ctx.createGain();cg.gain.value=.8;cs.connect(cg);cg.connect(masterGain);cs.start();nodes.push(cs);
    return{stop:()=>{nodes.forEach(n=>{try{n.stop();}catch{}});}};
  }

  const MAKERS={rain:makeRain,brown:makeBrownNoise,forest:makeForest,cafe:makeCafe,ocean:makeOcean,fire:makeFire};

  function play(id){
    stop();ensureCtx();
    currentNode=MAKERS[id]();currentId=id;
    if(fadeTimer)clearTimeout(fadeTimer);
    if(fadeMinutes>0)fadeTimer=setTimeout(()=>fadeOut(),fadeMinutes*60000);
    renderSoundCards();
  }

  function stop(){if(currentNode){currentNode.stop();currentNode=null;currentId=null;}renderSoundCards();}
  function toggle(id){if(currentId===id)stop();else play(id);}
  function setVolume(v){volume=v;if(masterGain)masterGain.gain.value=v;document.getElementById('volLabel').textContent=Math.round(v*100)+'%';}
  function setFade(v){fadeMinutes=parseInt(v);document.getElementById('fadeLabel').textContent=v==='0'?'Off':`${v}m`;}

  function fadeOut(){if(!masterGain)return;const g=masterGain.gain;const start=g.value;let t=0;const step=setInterval(()=>{t+=0.05;g.value=Math.max(0,start*(1-t));if(t>=1){stop();clearInterval(step);}},100);}

  function playChime(){
    ensureCtx();
    const osc=ctx.createOscillator();const g=ctx.createGain();
    osc.type='sine';osc.frequency.value=880;g.gain.value=0.3;
    osc.connect(g);g.connect(ctx.destination);
    osc.start();g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+1.2);
    setTimeout(()=>{try{osc.stop();}catch{}},1300);
    // second note
    setTimeout(()=>{
      const o2=ctx.createOscillator();const g2=ctx.createGain();
      o2.type='sine';o2.frequency.value=1100;g2.gain.value=0.2;
      o2.connect(g2);g2.connect(ctx.destination);
      o2.start();g2.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+1);
      setTimeout(()=>{try{o2.stop();}catch{}},1100);
    },250);
  }

  function renderSoundCards(){
    const grid=document.getElementById('soundGrid');
    if(!grid)return;
    grid.innerHTML='';
    SOUNDS.forEach(s=>{
      const card=document.createElement('div');card.className='sound-card'+(currentId===s.id?' playing':'');
      card.innerHTML=`<span class="sound-icon">${s.icon}</span><div class="sound-name">${s.name}</div>`;
      card.onclick=()=>toggle(s.id);
      grid.appendChild(card);
    });
  }

  function buildUI(){renderSoundCards();}

  return{play,stop,toggle,setVolume,setFade,playChime,buildUI,get currentId(){return currentId;}};
})();

// ═══════════════════════════════════════════════════════════════════════
// CUSTOM THEME BUILDER
// ═══════════════════════════════════════════════════════════════════════
SC.themeBuilder=(()=>{
  const KEY='sc_custom_themes';
  const FIELDS=[
    {key:'text',label:'Text color'},
    {key:'accent',label:'Accent (main)'},
    {key:'accent2',label:'Accent 2'},
    {key:'btnFg',label:'Button text'},
    {key:'panel',label:'Panel BG'},
    {key:'baseBg0',label:'Background'}
  ];

  let draft={text:'#e0f2fe',accent:'#6ee7b7',accent2:'#818cf8',btnFg:'#6ee7b7',panel:'rgba(4,3,18,.7)',baseBg0:'#06030f'};

  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch{return[];}}
  function save_all(d){localStorage.setItem(KEY,JSON.stringify(d));}

  function buildColorRows(){
    const container=document.getElementById('colorRows');
    if(!container)return;
    container.innerHTML='';
    FIELDS.forEach(f=>{
      const row=document.createElement('div');row.className='color-row';
      const rawVal=draft[f.key];
      const hexVal=rawVal.startsWith('rgba')||rawVal.startsWith('rgb')?rgbaToHex(rawVal):rawVal;
      row.innerHTML=`<span class="color-label">${f.label}</span><div class="color-picker-wrap"><input type="color" value="${hexVal}" data-key="${f.key}"></div><span class="color-hex" id="hex_${f.key}">${hexVal}</span>`;
      container.appendChild(row);
    });
    container.querySelectorAll('input[type=color]').forEach(inp=>{
      inp.addEventListener('input',e=>{
        draft[e.target.dataset.key]=e.target.value;
        document.getElementById('hex_'+e.target.dataset.key).textContent=e.target.value;
      });
    });
    renderSavedSwatches();
  }

  function rgbaToHex(rgba){const m=rgba.match(/[\d.]+/g);if(!m)return'#ffffff';return'#'+[m[0],m[1],m[2]].map(v=>parseInt(v).toString(16).padStart(2,'0')).join('');}

  function preview(){
    const t=currentTheme;
    const root=document.documentElement;
    root.style.setProperty('--clr-text',draft.text);
    root.style.setProperty('--clr-accent',draft.accent);
    root.style.setProperty('--clr-accent2',draft.accent2);
    root.style.setProperty('--clr-btn-fg',draft.btnFg);
    root.style.setProperty('--clr-panel',draft.panel);
  }

  function save(){
    const saved=load();
    const id='custom_'+Date.now();
    saved.push({id,name:'Custom '+saved.length,draft:{...draft}});
    if(saved.length>10)saved.shift();
    save_all(saved);
    renderSavedSwatches();
    alert('Custom theme saved!');
  }

  function reset(){applyTheme(currentTheme,true);}

  function applyCustom(item){
    draft={...item.draft};
    preview();buildColorRows();
  }

  function renderSavedSwatches(){
    const row=document.getElementById('savedThemeRow');
    if(!row)return;
    const saved=load();
    row.innerHTML='';
    if(!saved.length){row.innerHTML='<span style="font-size:.65rem;opacity:.3;color:var(--clr-text)">No saved themes yet</span>';return;}
    saved.forEach(item=>{
      const sw=document.createElement('div');sw.className='saved-swatch';
      sw.style.background=item.draft.accent;sw.title=item.name;
      sw.onclick=()=>applyCustom(item);
      row.appendChild(sw);
    });
  }

  function openBuilder(){buildColorRows();SC.modals.open('themeBuilderOverlay');}

  return{preview,save,reset,openBuilder,buildColorRows};
})();

// ═══════════════════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════════════════
SC.modals={
  open(id){document.getElementById(id).classList.add('open');},
  close(id){document.getElementById(id).classList.remove('open');}
};
// Close on overlay click
document.querySelectorAll('.sc-overlay').forEach(el=>{
  el.addEventListener('click',e=>{if(e.target===el)el.classList.remove('open');});
});

// ═══════════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════════════
SC.keyboard=(()=>{
  const shortcuts=[
    {key:'Space',desc:'Start / Pause session timer',action:()=>document.getElementById('btnStart').click()},
    {key:'R',desc:'Reset timer',action:()=>document.getElementById('btnReset').click()},
    {key:'T',desc:'Cycle to next theme',action:()=>{const idx=THEMES.indexOf(currentTheme);applyTheme(THEMES[(idx+1)%THEMES.length]);}},
    {key:'F',desc:'Toggle fullscreen / kiosk mode',action:()=>SC.display.toggleKiosk()},
    {key:'P',desc:'Toggle Pomodoro mode',action:()=>document.getElementById('btnPomToggle').click()},
    {key:'M',desc:'Open ambient sound mixer',action:()=>{SC.sound.buildUI();SC.modals.open('soundOverlay');}},
    {key:'L',desc:'Open session focus log',action:()=>document.getElementById('btnLog').click()},
    {key:'K',desc:'Toggle theme panel',action:()=>document.getElementById('themePanel').classList.toggle('collapsed')},
    {key:'G',desc:'Open custom theme builder',action:()=>SC.themeBuilder.openBuilder()},
    {key:'?',desc:'Show keyboard shortcuts',action:()=>SC.modals.open('kbOverlay')},
    {key:'Escape',desc:'Close any open panel',action:()=>{document.querySelectorAll('.sc-overlay.open').forEach(el=>el.classList.remove('open'));}}
  ];

  function buildUI(){
    const grid=document.getElementById('kbGrid');
    if(!grid)return;
    grid.innerHTML='';
    shortcuts.forEach(s=>{
      const k=document.createElement('kbd');k.textContent=s.key;
      const d=document.createElement('span');d.className='kb-desc';d.textContent=s.desc;
      grid.appendChild(k);grid.appendChild(d);
    });
  }

  document.addEventListener('keydown',e=>{
    const tag=document.activeElement.tagName;
    if(tag==='INPUT'||tag==='TEXTAREA'){if(e.key==='Escape')document.activeElement.blur();return;}
    const hasOpen=document.querySelector('.sc-overlay.open');
    if(hasOpen&&e.key!=='Escape')return;
    for(const s of shortcuts){
      const sk=s.key.toLowerCase();
      const ek=e.code==='Space'?'space':e.key.toLowerCase();
      if(sk===ek||(sk==='space'&&e.code==='Space')){e.preventDefault();s.action();return;}
    }
  });

  buildUI();
  return{shortcuts};
})();

// ═══════════════════════════════════════════════════════════════════════
// DISPLAY MODE (kiosk / presentation)
// ═══════════════════════════════════════════════════════════════════════
SC.display=(()=>{
  let kioskOn=false,presentOn=false;

  function toggleKiosk(){
    kioskOn=!kioskOn;
    document.body.classList.toggle('kiosk',kioskOn);
    if(kioskOn&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});
    else if(!kioskOn&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});
    const btn=document.getElementById('btnKiosk');
    if(btn)btn.classList.toggle('on',kioskOn);
  }

  function togglePresent(){
    presentOn=!presentOn;
    document.body.classList.toggle('present',presentOn);
    const btn=document.getElementById('btnPresent');
    if(btn)btn.classList.toggle('on',presentOn);
  }

  return{toggleKiosk,togglePresent,get kioskOn(){return kioskOn;}};
})();

// ═══════════════════════════════════════════════════════════════════════
// THEME APPLICATION
// ═══════════════════════════════════════════════════════════════════════
let currentTheme=THEMES[0];
const root=document.documentElement;

function setCSSVar(name,val){root.style.setProperty(name,val);}

function applyTheme(theme,instant){
  const doApply=()=>{
    currentTheme=theme;buildParticles();
    setCSSVar('--clr-text',theme.text);setCSSVar('--clr-accent',theme.accent);setCSSVar('--clr-accent2',theme.accent2);
    setCSSVar('--clr-track',theme.track);setCSSVar('--clr-btn-bg',theme.btnBg);setCSSVar('--clr-btn-fg',theme.btnFg);
    setCSSVar('--clr-pill',theme.pill);setCSSVar('--clr-panel',theme.panel);setCSSVar('--font-main',theme.font);
    setCSSVar('--glow',theme.glow==='none'?'none':`0 0 45px ${theme.accent}44,0 0 100px ${theme.accent}18`);
    setCSSVar('--btn-radius',theme.isMedia?'3px':'99px');
    setCSSVar('--lb-h',(theme.isMedia&&theme.lb)?'3.8vh':'0px');
    document.getElementById('overlay').style.background=theme.overlay==='none'?'':theme.overlay;
    document.getElementById('vignette').style.background=theme.vignette==='none'?'':theme.vignette;
    document.getElementById('scanlines').style.opacity=theme.scanlines?'1':'0';
    const grainEl=document.getElementById('grain');grainEl.style.opacity=theme.grain?'0.25':'0';
    if(theme.grain)grainEl.style.backgroundImage=`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`;
    const hdr=document.getElementById('hdrBloom');
    if(theme.hdr){hdr.style.background=`radial-gradient(ellipse at 50% 50%,${theme.accent}09 0%,transparent 65%)`;hdr.style.opacity='1';}else hdr.style.opacity='0';
    const badge=document.getElementById('showBadge');
    if(theme.isMedia&&theme.tagline){badge.textContent=theme.tagline;badge.classList.add('visible');}else badge.classList.remove('visible');
    // Literary clock special font
    if(theme.id==='literary'){DOM.quoteText.style.fontFamily="'Lora',serif";DOM.quoteText.style.fontSize='clamp(.75rem,1.4vw,.95rem)';DOM.litMeta.style.display='block';}
    else{DOM.quoteText.style.fontFamily='';DOM.quoteText.style.fontSize='';DOM.litMeta.style.display='none';}
    const qs=theme.id==='literary'?[]:theme.quotes||NAT_QUOTES;
    if(theme.id!=='literary'){DOM.quoteText.style.opacity='0';setTimeout(()=>{DOM.quoteText.textContent='"'+(qs[0]||'')+'\"';DOM.quoteText.style.opacity='.38';},420);}
    updateSyncUI(synced?'ok':'failed');
    document.querySelectorAll('.nat-btn,.media-card').forEach(b=>{b.classList.toggle('active',b.dataset.id===theme.id);});
    lastQIdx=-1;
    // Save last used
    localStorage.setItem('sc_last_theme',theme.id);
  };
  if(instant||!theme.isMedia){doApply();return;}
  runTransition(theme.transition||'defaultFade',doApply);
}

// ═══════════════════════════════════════════════════════════════════════
// RENDER LOOP
// ═══════════════════════════════════════════════════════════════════════
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const GREETS=[[0,5,'🌙 Good Night'],[5,12,'☀️ Good Morning'],[12,17,'🌤️ Good Afternoon'],[17,21,'🌆 Good Evening'],[21,24,'🌙 Good Night']];

const DOM={
  timeDis:document.getElementById('timeDis'),
  ampmDis:document.getElementById('ampmDis'),
  secMs:document.getElementById('secMs'),
  dateDis:document.getElementById('dateDis'),
  dayPct:document.getElementById('dayPct'),
  pFill:document.getElementById('progressFill'),
  sTmr:document.getElementById('sessionTimer'),
  utcPill:document.getElementById('utcPill'),
  greeting:document.getElementById('greeting'),
  quoteText:document.getElementById('quoteText'),
  litMeta:document.getElementById('litMeta'),
  syncDot:document.getElementById('syncDot'),
  syncLabel:document.getElementById('syncLabel'),
  focusInput:document.getElementById('focusInput'),
  focusInputWrap:document.getElementById('focusInputWrap')
};

let lastSec=-1,lastQIdx=-1;

function getLitQuote(h,m){
  const key=p2(h)+':'+p2(Math.floor(m/5)*5);
  return LIT_CLOCK[key]||null;
}

function renderFrame(ts){
  requestAnimationFrame(renderFrame);
  const dt=Math.min((ts-lastTs)/1000,.05);lastTs=ts;
  drawBg(dt);

  const now=new Date(Date.now()+clockOffset);
  const ms=now.getMilliseconds(),sec=now.getSeconds(),min=now.getMinutes(),hr=now.getHours();
  const hr12=hr%12||12,ampm=hr>=12?'PM':'AM';

  DOM.timeDis.textContent=p2(hr12)+':'+p2(min)+':'+p2(sec);
  DOM.ampmDis.textContent=ampm;
  DOM.secMs.textContent='.'+p3(ms);

  const dp=((hr*3600+min*60+sec)*1000+ms)/864e5*100;
  DOM.pFill.style.width=dp.toFixed(4)+'%';

  if(sessionRunning){
    if(SC.pomodoro.active)SC.pomodoro.tick(performance.now());
    else DOM.sTmr.textContent=fmtSession(performance.now()-sessionStart);
  }

  if(sec!==lastSec){
    lastSec=sec;
    const uh=now.getUTCHours(),um=now.getUTCMinutes(),us=now.getUTCSeconds();
    DOM.utcPill.textContent='UTC '+p2(uh)+':'+p2(um)+':'+p2(us);
    DOM.dateDis.textContent=DAYS[now.getDay()]+', '+MONTHS[now.getMonth()]+' '+now.getDate()+', '+now.getFullYear();
    const g=GREETS.find(x=>hr>=x[0]&&hr<x[1]);
    if(g)DOM.greeting.textContent=g[2];
    DOM.dayPct.textContent=dp.toFixed(1)+'%';

    if(currentTheme.id==='literary'){
      const litQ=getLitQuote(hr,min);
      const key=p2(hr)+':'+p2(Math.floor(min/5)*5);
      if(key!==lastQIdx){
        lastQIdx=key;
        if(litQ){
          DOM.quoteText.style.opacity='0';
          setTimeout(()=>{
            DOM.quoteText.textContent='"'+litQ.quote+'"';
            DOM.litMeta.textContent=litQ.source;
            DOM.quoteText.style.opacity='.55';
          },400);
        }
      }
    }else{
      const qs=currentTheme.quotes||NAT_QUOTES;
      const qi=((hr*60+min)/5|0)%qs.length;
      if(qi!==lastQIdx){lastQIdx=qi;DOM.quoteText.style.opacity='0';setTimeout(()=>{DOM.quoteText.textContent='"'+qs[qi]+'"';DOM.quoteText.style.opacity='.38';},400);}
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// TRANSITIONS (all from v6)
// ═══════════════════════════════════════════════════════════════════════
let transitioning=false;

function runTransition(type,cb){if(transitioning){cb();return;}transitioning=true;tCanvas.style.display='block';const fn=TRANSITIONS[type]||TRANSITIONS.defaultFade;fn(cb);}
function finishTrans(done){let f=1;const step=()=>{f-=.02;tCtx.clearRect(0,0,tCanvas.width,tCanvas.height);if(f>0){tCtx.fillStyle=`rgba(0,0,0,${f})`;tCtx.fillRect(0,0,tCanvas.width,tCanvas.height);requestAnimationFrame(step);}else{tCanvas.style.display='none';transitioning=false;if(done)done();}};requestAnimationFrame(step);}

const TRANSITIONS={
  f1_launch(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let elapsed=0,lastT=null,called=false;const LP=[0.2,0.35,0.5,0.65,0.8];const LR=Math.min(W,H)*.042;const totalDur=3500;const go=(ts)=>{if(!lastT)lastT=ts;elapsed+=ts-lastT;lastT=ts;const p=elapsed/totalDur;c.clearRect(0,0,W,H);c.fillStyle=`rgba(0,0,0,${Math.min(.96,p*2.2)})`;c.fillRect(0,0,W,H);if(p>0.05){const tA=Math.min(.35,(p-.05)*1.5);c.fillStyle=`rgba(28,28,30,${tA})`;c.fillRect(0,H*.62,W,H*.38);}LP.forEach((lx,i)=>{const lightX=W*lx,lightY=H*.34;const lightOnAt=0.15+(i/(LP.length-1))*0.4;const isOn=p>=lightOnAt&&p<0.72+i*.055;if(p>0.05){c.beginPath();c.arc(lightX,lightY,LR*1.2,0,Math.PI*2);c.fillStyle='rgba(12,12,15,0.92)';c.fill();}if(p>=lightOnAt){const onP=Math.min(1,(p-lightOnAt)/.08);if(isOn){const inner=c.createRadialGradient(lightX,lightY,0,lightX,lightY,LR);inner.addColorStop(0,`rgba(255,160,100,${.98*onP})`);inner.addColorStop(1,`rgba(80,0,0,${.3*onP})`);c.fillStyle=inner;c.beginPath();c.arc(lightX,lightY,LR,0,Math.PI*2);c.fill();c.beginPath();c.arc(lightX,lightY,LR*.28,0,Math.PI*2);c.fillStyle=`rgba(255,240,220,${.95*onP})`;c.fill();}}});if(p>0.72){const loA=Math.min(1,(p-.72)/.07);const loFade=Math.min(1,(.97-p)/.09);if(loA*loFade>0.05){c.font=`bold ${Math.min(W*.07,56)}px 'Orbitron',monospace`;c.textAlign='center';c.textBaseline='middle';c.fillStyle=`rgba(255,255,255,${loA*loFade})`;c.fillText('LIGHTS OUT',W*.5,H*.55);c.font=`${Math.min(W*.028,22)}px 'Orbitron',monospace`;c.fillStyle=`rgba(220,80,0,${loA*loFade*.9})`;c.fillText('AND AWAY WE GO!',W*.5,H*.55+Math.min(W*.09,72));}}c.globalAlpha=1;if(!called&&p>=.74){called=true;cb();}if(p<1.0)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  f1_burnout(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let elapsed=0,lastT=null,called=false;const totalDur=3400;const smokeP=Array.from({length:48},(_,i)=>({x:W*(.28+Math.random()*.44),y:H*(.68+Math.random()*.12),r:Math.random()*22+12,maxR:Math.random()*160+90,vx:(Math.random()-.5)*.9,vy:-(Math.random()*.7+.25),alpha:Math.random()*.18+.08,grey:Math.floor(Math.random()*40+130),delay:Math.random()*.28}));const go=(ts)=>{if(!lastT)lastT=ts;elapsed+=ts-lastT;lastT=ts;const p=Math.min(1,elapsed/totalDur);c.clearRect(0,0,W,H);c.fillStyle=`rgba(0,0,0,${Math.min(.92,p*1.1)})`;c.fillRect(0,0,W,H);if(p>0.04){const smokeProgress=(p-.04)/.96;smokeP.forEach(s=>{if(smokeProgress<s.delay)return;const localP=Math.min(1,(smokeProgress-s.delay)/(1-s.delay));const cx2=s.x+s.vx*localP*180,cy2=s.y+s.vy*localP*220;s.r=Math.min(s.maxR,s.r+(s.maxR-s.r)*.008);const lA=s.alpha*Math.min(1,localP*4)*Math.max(0,1-localP*.5);const sg=c.createRadialGradient(cx2,cy2,0,cx2,cy2,s.r);sg.addColorStop(0,`rgba(${s.grey},${s.grey-8},${s.grey-12},${lA*1.1})`);sg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=sg;c.beginPath();c.arc(cx2,cy2,s.r,0,Math.PI*2);c.fill();});}c.globalAlpha=1;if(!called&&p>=.52){called=true;cb();}if(p<1.0)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  fire(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const go=()=>{p+=.01;c.clearRect(0,0,W,H);c.fillStyle=`rgba(0,0,0,${Math.min(.88,p*1.4)})`;c.fillRect(0,0,W,H);for(let x=0;x<W;x+=3){const h=(Math.sin(x*.017+p*3.5)*.5+.5)*(Math.sin(x*.034-p*2.5)*.5+.5)*Math.min(1,p*1.8)*H*.9;const gf=c.createLinearGradient(0,H,0,H-h);gf.addColorStop(0,'rgba(255,120,0,.95)');gf.addColorStop(.3,'rgba(220,50,0,.8)');gf.addColorStop(1,'rgba(80,0,0,0)');c.fillStyle=gf;c.fillRect(x,H-h,3,h);}if(!called&&p>=.54){called=true;cb();}if(p<1.1)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  redblood(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const dr=Array.from({length:28},(_,i)=>({x:(i/28)*W+Math.sin(i*2.5)*20,spd:.5+rnd(.5),w:rnd(4)+2}));const go=()=>{p+=.009;c.clearRect(0,0,W,H);c.fillStyle=`rgba(0,0,0,${Math.min(.92,p*1.5)})`;c.fillRect(0,0,W,H);dr.forEach(d=>{const drip=Math.min(H,p*d.spd*H*2.2);const gr=c.createLinearGradient(0,0,0,drip);gr.addColorStop(0,'rgba(160,0,0,.95)');gr.addColorStop(1,'rgba(80,0,0,.25)');c.fillStyle=gr;c.fillRect(d.x,0,d.w,drip);});if(!called&&p>=.5){called=true;cb();}if(p<1.1)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  smoke(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const ws=Array.from({length:18},()=>({x:rnd(W),y:rnd(H),r:rnd(60)+20,vx:rndpm(.3),vy:-(rnd(.4)+.1)}));const go=()=>{p+=.008;c.clearRect(0,0,W,H);c.fillStyle=`rgba(5,4,0,${Math.min(.96,p*1.35)})`;c.fillRect(0,0,W,H);ws.forEach(w=>{w.x+=w.vx;w.y+=w.vy;w.r+=.45;const wg=c.createRadialGradient(w.x,w.y,0,w.x,w.y,w.r);wg.addColorStop(0,`rgba(80,65,30,${Math.max(0,.07-p*.04)})`);wg.addColorStop(1,'transparent');c.fillStyle=wg;c.fillRect(0,0,W,H);});if(!called&&p>=.54){called=true;cb();}if(p<1.15)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  timeloop(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const go=()=>{p+=.009;c.fillStyle='rgba(0,0,6,.1)';c.fillRect(0,0,W,H);c.save();c.translate(W*.5,H*.5);const maxR=Math.sqrt(W*W+H*H)*.55;for(let r=maxR*(1-Math.min(1,p*1.8));r>4;r-=2.5){const a=r*.065+p*6;c.beginPath();c.arc(Math.cos(a)*r*.008,Math.sin(a)*r*.008,r,0,Math.PI*2);c.strokeStyle=`hsla(${220+r*.1},70%,60%,.016)`;c.lineWidth=1.2;c.stroke();}c.restore();if(!called&&p>=.52){called=true;cb();}if(p<1.15)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  chemical(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const bs=Array.from({length:20},()=>({x:W*.5+rndpm(100),y:H*.5+rndpm(80),r:0,maxR:rnd(28)+8,spd:rnd(.02)+.01}));const go=()=>{p+=.01;c.clearRect(0,0,W,H);const R=p*Math.sqrt(W*W+H*H)*.58;const cg=c.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,R);cg.addColorStop(0,'rgba(0,0,0,.97)');cg.addColorStop(.88,`rgba(${55*p|0},${175*p|0},0,.5)`);cg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=cg;c.fillRect(0,0,W,H);bs.forEach(b=>{b.r=Math.min(b.maxR,b.r+b.spd*R*.06);const bx=b.x+Math.cos(p*3+b.r)*R*.4,by=b.y+Math.sin(p*2+b.r)*R*.35;c.beginPath();c.arc(bx,by,b.r,0,Math.PI*2);c.strokeStyle=`rgba(60,220,0,${Math.min(.7,p*1.5)})`;c.lineWidth=1.5;c.stroke();});if(!called&&p>=.52){called=true;cb();}if(p<1.1)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  updown(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const go=()=>{p+=.01;c.clearRect(0,0,W,H);const slide=easeIO(Math.min(1,p*1.6))*H*.5;c.fillStyle=`rgba(5,0,15,${Math.min(.97,p*1.5)})`;c.fillRect(0,0,W,H*.5+slide);c.fillRect(0,H-(H*.5+slide),W,H*.5+slide);if(!called&&p>=.52){called=true;cb();}if(p<1.1)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  warp(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const stars=Array.from({length:200},()=>({a:rnd(Math.PI*2),d:rnd(Math.sqrt(W*W+H*H)*.5)}));const go=()=>{p+=.009;c.fillStyle=`rgba(0,3,10,${.1+p*.08})`;c.fillRect(0,0,W,H);c.save();c.translate(W*.5,H*.5);stars.forEach(s=>{const sp=easeIO(Math.min(1,p*1.5));const len=sp*42+2;const d=s.d*(1-sp*.6);c.beginPath();c.moveTo(Math.cos(s.a)*(d-len),Math.sin(s.a)*(d-len));c.lineTo(Math.cos(s.a)*d,Math.sin(s.a)*d);c.strokeStyle=`rgba(150,210,255,${Math.min(1,p*2)*.8})`;c.lineWidth=Math.max(.5,sp*2);c.stroke();});c.restore();if(!called&&p>=.52){called=true;cb();}if(p<1.1)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  sandstorm(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const gr=Array.from({length:300},()=>({x:rnd(W),y:rnd(H),vx:3+rnd(5),vy:rndpm(.7),a:rnd(.4)+.1}));const go=()=>{p+=.009;c.fillStyle=`rgba(20,12,0,${Math.min(.94,p*1.35)})`;c.fillRect(0,0,W,H);gr.forEach(g=>{g.x+=g.vx*(1+p*2);g.y+=g.vy;if(g.x>W+5){g.x=-5;g.y=rnd(H);}c.beginPath();c.arc(g.x,g.y,.8,0,Math.PI*2);c.fillStyle='rgba(200,155,60,1)';c.globalAlpha=g.a*Math.min(1,p*2);c.fill();c.globalAlpha=1;});if(!called&&p>=.52){called=true;cb();}if(p<1.1)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  matrixrain(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const cols2=W/14|0;const drops=Array.from({length:cols2},()=>({y:rnd(H*.5),spd:3+rnd(5)}));const go=()=>{p+=.008;c.fillStyle=`rgba(0,${16*p|0},0,${Math.min(.95,p*1.4)})`;c.fillRect(0,0,W,H);c.font='13px monospace';drops.forEach((d,i)=>{d.y+=d.spd;const x=i*14;for(let j=0;j<22;j++){const y=d.y-j*14;if(y<-14||y>H+14)continue;const fa=j===0?.95:Math.max(0,.6-j*.026);c.fillStyle=j===0?`rgba(180,255,180,${fa})`:`rgba(0,${178-j*6},0,${fa*Math.min(1,p*2)})`;c.fillText(MAT_CHARS[Math.random()*MAT_CHARS.length|0],x,y);}if(d.y>H+200)d.y=0;});if(!called&&p>=.54){called=true;cb();}if(p<1.1)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  neon_rain(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const drops=Array.from({length:110},()=>({x:rnd(W),y:rnd(H*.3),vy:3+rnd(4),len:20+rnd(48),hue:rnd(1)<.6?25:200}));const go=()=>{p+=.009;c.fillStyle=`rgba(4,2,0,${Math.min(.96,p*1.35)})`;c.fillRect(0,0,W,H);drops.forEach(d=>{d.y+=d.vy;if(d.y>H+60){d.y=-60;d.x=rnd(W);}const dg=c.createLinearGradient(d.x,d.y-d.len,d.x,d.y);dg.addColorStop(0,'transparent');dg.addColorStop(1,`hsla(${d.hue},90%,60%,${.42*Math.min(1,p*2)})`);c.strokeStyle=dg;c.beginPath();c.moveTo(d.x,d.y-d.len);c.lineTo(d.x,d.y);c.lineWidth=.8;c.stroke();});if(!called&&p>=.52){called=true;cb();}if(p<1.1)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  dream(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const go=()=>{p+=.008;c.fillStyle=`rgba(3,3,6,${Math.min(.95,p*1.35)})`;c.fillRect(0,0,W,H);c.save();c.translate(W*.5,H*.5);for(let i=0;i<6;i++){const a=i/6*Math.PI*2+p*(.05+i*.007);const r=W*.3*Math.sin(p*Math.PI*.85)*Math.max(.1,1-i*.12);c.save();c.rotate(a);c.fillStyle=`rgba(70,70,180,${(.038-i*.005)*Math.min(1,p*2)})`;c.fillRect(-W*.5,-r*.1,W,r*.2);c.restore();}c.restore();if(!called&&p>=.52){called=true;cb();}if(p<1.1)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  rose(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const petals=Array.from({length:22},()=>({x:W*.5+rndpm(W*.4),y:-(rnd(H*.3)),r:rnd(14)+6,vy:1.5+rnd(2),vx:rndpm(.45),rot:rnd(Math.PI*2),rotV:rndpm(.018)}));const go=()=>{p+=.008;c.fillStyle=`rgba(1,1,0,${Math.min(.96,p*1.35)})`;c.fillRect(0,0,W,H);petals.forEach(pt=>{pt.y+=pt.vy;pt.x+=pt.vx;pt.rot+=pt.rotV;c.save();c.translate(pt.x,pt.y);c.rotate(pt.rot);c.beginPath();c.ellipse(0,0,pt.r*.6,pt.r,0,0,Math.PI*2);c.fillStyle=`rgba(128,10,10,${.58*Math.min(1,p*2)})`;c.fill();c.restore();});if(!called&&p>=.52){called=true;cb();}if(p<1.1)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);},
  defaultFade(cb){const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;const go=()=>{p+=.015;c.fillStyle=`rgba(0,0,0,${Math.min(1,p*1.5)})`;c.fillRect(0,0,W,H);if(!called&&p>=.5){called=true;cb();}if(p<1)requestAnimationFrame(go);else finishTrans();};requestAnimationFrame(go);}
};

// ═══════════════════════════════════════════════════════════════════════
// PANEL BUILD
// ═══════════════════════════════════════════════════════════════════════
function buildPanel(){
  // ── BUG FIX: Clear BOTH containers before rebuilding to prevent
  // duplicate rows and stacked event listeners on repeated calls ──
  const panelRows=document.getElementById('themePanelRows');
  panelRows.innerHTML='';
  const featBar=document.getElementById('featBar');
  featBar.innerHTML=''; // BUG FIX: was never cleared → duplicate buttons on re-call

  const makeRow=(label,items,makeItem)=>{
    const row=document.createElement('div');row.className='theme-row';
    const lbl=document.createElement('span');lbl.className='row-label';lbl.textContent=label;
    row.appendChild(lbl);items.forEach(t=>row.appendChild(makeItem(t)));return row;
  };
  const makeDivider=()=>{const d=document.createElement('div');d.className='row-divider';return d;};

  // Natural themes → round swatch circles (exclude literary which gets its own card slot)
  const makeNatBtn=t=>{
    const btn=document.createElement('button');
    btn.className='nat-btn';btn.dataset.id=t.id;btn.title=t.name;
    btn.style.background=t.swatch||t.accent;
    btn.addEventListener('click',()=>applyTheme(t));
    return btn;
  };

  const makeCard=t=>{
    const card=document.createElement('button');card.className='media-card';card.dataset.id=t.id;
    card.addEventListener('click',()=>applyTheme(t));
    const logo=document.createElement('div');logo.className='media-logo';
    logo.innerHTML=LOGOS[t.id]||`<svg viewBox="0 0 32 22"><rect width="32" height="22" fill="${t.baseBg[0]}"/><text x="16" y="14" text-anchor="middle" fill="${t.accent}" font-size="8" font-weight="700">${t.name.slice(0,2).toUpperCase()}</text></svg>`;
    const txt=document.createElement('div');txt.style.cssText='display:flex;flex-direction:column';
    const nm=document.createElement('div');nm.className='media-name';nm.textContent=t.name;
    const sb=document.createElement('div');sb.className='media-sub';sb.style.color=t.accent;sb.textContent=t.sub||'';
    txt.append(nm,sb);card.append(logo,txt);return card;
  };

  // Split nat themes: pure nat swatches vs literary card
  const pureNat=THEMES_BY_CAT.nat.filter(t=>t.id!=='literary');
  const litTheme=THEMES_BY_CAT.nat.find(t=>t.id==='literary');

  panelRows.appendChild(makeRow('Themes',pureNat,makeNatBtn));
  panelRows.appendChild(makeDivider());

  // Literary gets its own card row
  if(litTheme){
    const litRow=document.createElement('div');litRow.className='theme-row';
    const lbl=document.createElement('span');lbl.className='row-label';lbl.textContent='Literary';
    litRow.appendChild(lbl);litRow.appendChild(makeCard(litTheme));
    panelRows.appendChild(litRow);
    panelRows.appendChild(makeDivider());
  }

  panelRows.appendChild(makeRow('F1 Teams',THEMES_BY_CAT.f1,makeCard));
  panelRows.appendChild(makeDivider());
  panelRows.appendChild(makeRow('TV Shows',THEMES_BY_CAT.tv,makeCard));
  panelRows.appendChild(makeDivider());
  panelRows.appendChild(makeRow('Movies',THEMES_BY_CAT.movie,makeCard));

  // Feature bar — IDs are unique so querySelector won't double-register
  const feats=[
    {id:'btnSound',label:'🎵 Sound',action:()=>{SC.sound.buildUI();SC.modals.open('soundOverlay');}},
    {id:'btnKiosk',label:'⛶ Kiosk',action:()=>SC.display.toggleKiosk()},
    {id:'btnPresent',label:'📺 Present',action:()=>SC.display.togglePresent()},
    {id:'btnThemeBuilder',label:'🎨 Custom',action:()=>SC.themeBuilder.openBuilder()},
    {id:'btnKb',label:'⌨ Keys',action:()=>SC.modals.open('kbOverlay')}
  ];
  feats.forEach(f=>{
    const b=document.createElement('button');b.className='feat-btn';b.id=f.id;b.textContent=f.label;
    b.addEventListener('click',f.action);featBar.appendChild(b);
  });

  // BUG FIX: Use onclick (idempotent) instead of addEventListener (stacks on re-call).
  // This ensures no matter how many times buildPanel runs, toggle works correctly.
  const toggle=document.getElementById('panelToggle');
  toggle.onclick=()=>document.getElementById('themePanel').classList.toggle('collapsed');
}

// ═══════════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════════
function init(){
  resize();
  buildPanel();
  // Restore last theme
  const lastId=localStorage.getItem('sc_last_theme');
  const startTheme=(lastId&&THEME_BY_ID[lastId])||THEMES[0];
  applyTheme(startTheme,true);
  requestAnimationFrame(ts=>{lastTs=ts;renderFrame(ts);});
  syncTime();
  SC.weather.init();
}

init();
