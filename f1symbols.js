// ═══════════════════════════════════════════════════════════════════════
// F1 TEAM SYMBOLS
// ═══════════════════════════════════════════════════════════════════════
/**
 * @param {CanvasRenderingContext2D} c
 * @param {number} W @param {number} H @param {number} t @param {string} teamId
 */
function drawF1Symbol(c, W, H, t, teamId) {
  const fns = {
    redbull:     drawF1_redbull,
    ferrari:     drawF1_ferrari,
    mercedes:    drawF1_mercedes,
    mclaren:     drawF1_mclaren,
    astonmartin: drawF1_astonmartin
  };
  const fn = fns[teamId];
  if (fn) fn(c, W, H, t);
}

function drawF1_redbull(c,W,H,t) {
  const cx=W*.5,cy=H*.52,R=Math.min(W,H)*.12;
  const breath=.04+.012*Math.sin(t*.6),pulse=.5+.5*Math.sin(t*.8);
  c.save(); c.translate(cx,cy);
  const bg=c.createRadialGradient(0,0,0,0,0,R*1.6);
  bg.addColorStop(0,`rgba(232,0,45,${breath*.3})`); bg.addColorStop(.5,`rgba(30,65,255,${breath*.1})`); bg.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=bg; c.beginPath(); c.arc(0,0,R*1.6,0,Math.PI*2); c.fill();
  const pw=R*.7,ph=R*.85;
  c.strokeStyle='rgba(232,0,45,1)'; c.lineWidth=1.5; c.globalAlpha=breath*1.1;
  c.strokeRect(-pw/2,-ph/2,pw,ph);
  c.font=`bold ${R*.88}px 'Orbitron',monospace`; c.textAlign='center'; c.textBaseline='middle';
  c.fillStyle='rgba(232,0,45,1)'; c.globalAlpha=breath*(0.85+0.15*Math.sin(t*.5));
  c.fillText('1',0,0);
  c.font=`${Math.max(6,R*.18)}px 'Orbitron',monospace`; c.fillStyle='rgba(255,220,220,1)';
  c.globalAlpha=breath*.7; c.fillText('VER',0,ph*.5+R*.18);
  c.strokeStyle='rgba(232,0,45,1)'; c.lineWidth=1.2; c.globalAlpha=breath*.75;
  c.beginPath(); c.moveTo(-R*.38,-ph/2-R*.05); c.quadraticCurveTo(-R*.6,-ph/2-R*.4,-R*.28,-ph/2-R*.32); c.stroke();
  c.beginPath(); c.moveTo(R*.38,-ph/2-R*.05); c.quadraticCurveTo(R*.6,-ph/2-R*.4,R*.28,-ph/2-R*.32); c.stroke();
  c.beginPath(); c.arc(pw*.6,0,R*.12,0,Math.PI*2);
  c.fillStyle='rgba(30,65,255,1)'; c.globalAlpha=breath*pulse*1.5; c.fill();
  c.globalAlpha=1; c.restore();
}

function drawF1_ferrari(c,W,H,t) {
  const cx=W*.5,cy=H*.54,R=Math.min(W,H)*.13;
  const breath=.042+.012*Math.sin(t*.5);
  c.save(); c.translate(cx,cy);
  const bg=c.createRadialGradient(0,0,0,0,0,R*1.7);
  bg.addColorStop(0,`rgba(255,40,0,${breath*.28})`); bg.addColorStop(.5,`rgba(255,200,0,${breath*.06})`); bg.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=bg; c.beginPath(); c.arc(0,0,R*1.7,0,Math.PI*2); c.fill();
  c.globalAlpha=breath*.9;
  c.strokeStyle='rgba(255,237,0,1)'; c.lineWidth=1.3;
  c.beginPath();
  c.moveTo(0,-R*.9); c.lineTo(R*.55,-R*.55); c.lineTo(R*.55,R*.35);
  c.quadraticCurveTo(0,R*1.0,-R*.55,R*.35); c.lineTo(-R*.55,-R*.55); c.closePath(); c.stroke();
  c.save(); c.translate(0,-R*.1); c.scale(R*.009,R*.009);
  c.fillStyle='rgba(255,237,0,1)'; c.globalAlpha=breath*(0.85+0.15*Math.sin(t*.4));
  c.beginPath();
  c.moveTo(0,-30); c.bezierCurveTo(10,-38,22,-32,18,-22);
  c.bezierCurveTo(28,-15,22,0,12,6); c.bezierCurveTo(18,12,16,22,10,28);
  c.lineTo(6,28); c.bezierCurveTo(10,18,8,10,0,8);
  c.bezierCurveTo(-8,10,-10,18,-6,28); c.lineTo(-10,28);
  c.bezierCurveTo(-16,22,-18,12,-12,6); c.bezierCurveTo(-22,0,-28,-15,-18,-22);
  c.bezierCurveTo(-22,-32,-10,-38,0,-30); c.closePath(); c.fill();
  c.restore();
  const msg='FORZA FERRARI';
  c.font=`${Math.max(6,R*.16)}px 'Cinzel',serif`; c.fillStyle='rgba(255,237,0,1)'; c.textAlign='center'; c.textBaseline='middle';
  for(let i=0;i<msg.length;i++){
    const ca=-Math.PI/2-.5+(i/msg.length)*Math.PI;
    c.save(); c.translate(Math.cos(ca)*R*1.35,Math.sin(ca)*R*1.35); c.rotate(ca+Math.PI/2);
    c.globalAlpha=breath*1.1; c.fillText(msg[i],0,0); c.restore();
  }
  c.globalAlpha=1; c.restore();
}

function drawF1_mercedes(c,W,H,t) {
  const cx=W*.5,cy=H*.53,R=Math.min(W,H)*.13;
  const breath=.038+.01*Math.sin(t*.5),spin=t*.02;
  c.save(); c.translate(cx,cy);
  const bg=c.createRadialGradient(0,0,0,0,0,R*1.5);
  bg.addColorStop(0,`rgba(0,210,190,${breath*.25})`); bg.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=bg; c.beginPath(); c.arc(0,0,R*1.5,0,Math.PI*2); c.fill();
  c.save(); c.rotate(spin);
  c.strokeStyle='rgba(0,210,190,1)'; c.lineWidth=1.4; c.globalAlpha=breath*1.1;
  c.beginPath(); c.arc(0,0,R*.85,0,Math.PI*2); c.stroke();
  for(let i=0;i<3;i++){
    const a=(i/3)*Math.PI*2-Math.PI/2;
    c.beginPath(); c.moveTo(0,0); c.lineTo(Math.cos(a)*R*.85,Math.sin(a)*R*.85); c.stroke();
  }
  c.beginPath(); c.arc(0,0,R*.38,0,Math.PI*2); c.globalAlpha=breath*.5; c.stroke();
  c.restore();
  const msg='AMG PETRONAS F1';
  c.font=`${Math.max(6,R*.155)}px 'Josefin Sans',sans-serif`;
  c.fillStyle='rgba(0,210,190,1)'; c.textAlign='center'; c.textBaseline='middle';
  for(let i=0;i<msg.length;i++){
    const ca=-Math.PI/2+(i/msg.length)*Math.PI*2;
    c.save(); c.translate(Math.cos(ca)*R*1.3,Math.sin(ca)*R*1.3); c.rotate(ca+Math.PI/2);
    c.globalAlpha=breath*1.1; c.fillText(msg[i],0,0); c.restore();
  }
  c.font=`${Math.max(9,R*.35)}px 'Josefin Sans',sans-serif`; c.textAlign='center'; c.textBaseline='middle';
  c.fillStyle='rgba(200,255,250,1)'; c.globalAlpha=breath*.6;
  c.fillText('44',-R*.3,0); c.fillText('63',R*.3,0);
  c.globalAlpha=1; c.restore();
}

function drawF1_mclaren(c,W,H,t) {
  const cx=W*.5,cy=H*.53,R=Math.min(W,H)*.13;
  const breath=.042+.012*Math.sin(t*.55);
  c.save(); c.translate(cx,cy);
  const bg=c.createRadialGradient(0,0,0,0,0,R*1.6);
  bg.addColorStop(0,`rgba(255,128,0,${breath*.28})`); bg.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=bg; c.beginPath(); c.arc(0,0,R*1.6,0,Math.PI*2); c.fill();
  c.globalAlpha=breath*.9;
  c.strokeStyle='rgba(255,128,0,1)'; c.lineWidth=2;
  c.beginPath(); c.moveTo(-R*.9,R*.25); c.bezierCurveTo(-R*.6,-R*.35,R*.0,-R*.7,R*.9,R*.25); c.stroke();
  c.beginPath(); c.moveTo(-R*.75,R*.42); c.bezierCurveTo(-R*.4,-R*.12,R*.2,-R*.45,R*.75,R*.42); c.stroke();
  c.font=`bold ${R*.9}px 'Bebas Neue',cursive`; c.textAlign='center'; c.textBaseline='middle';
  c.fillStyle='rgba(255,128,0,1)'; c.globalAlpha=breath*(0.8+0.2*Math.sin(t*.4));
  c.fillText('4',0,0);
  c.font=`${Math.max(6,R*.18)}px 'Bebas Neue',cursive`; c.fillStyle='rgba(255,220,160,1)';
  c.globalAlpha=breath*.65; c.fillText('NOR',0,R*.55);
  const msg='PAPAYA RULES';
  c.font=`${Math.max(5,R*.14)}px 'Bebas Neue',cursive`; c.fillStyle='rgba(255,150,50,1)';
  c.textAlign='center'; c.textBaseline='middle';
  for(let i=0;i<msg.length;i++){
    const ca=-Math.PI/2+(i/msg.length)*Math.PI*2;
    c.save(); c.translate(Math.cos(ca)*R*1.32,Math.sin(ca)*R*1.32); c.rotate(ca+Math.PI/2);
    c.globalAlpha=breath*.85; c.fillText(msg[i],0,0); c.restore();
  }
  c.globalAlpha=1; c.restore();
}

function drawF1_astonmartin(c,W,H,t) {
  const cx=W*.5,cy=H*.53,R=Math.min(W,H)*.13;
  const breath=.038+.01*Math.sin(t*.5);
  c.save(); c.translate(cx,cy);
  const bg=c.createRadialGradient(0,0,0,0,0,R*1.5);
  bg.addColorStop(0,`rgba(0,111,98,${breath*.25})`); bg.addColorStop(.5,`rgba(206,220,0,${breath*.06})`); bg.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=bg; c.beginPath(); c.arc(0,0,R*1.5,0,Math.PI*2); c.fill();
  c.globalAlpha=breath;
  c.strokeStyle='rgba(206,220,0,1)'; c.lineWidth=1.1;
  for(let i=0;i<5;i++){
    const yw=-R*.12+i*R*.06,x1=-R*.9+i*R*.05,x2=-R*.22;
    c.beginPath(); c.moveTo(x1,yw); c.quadraticCurveTo((x1+x2)/2,-R*.3,x2,-R*.05);
    c.globalAlpha=breath*(.9-i*.08); c.stroke();
  }
  for(let i=0;i<5;i++){
    const yw=-R*.12+i*R*.06,x1=R*.9-i*R*.05,x2=R*.22;
    c.beginPath(); c.moveTo(x1,yw); c.quadraticCurveTo((x1+x2)/2,-R*.3,x2,-R*.05);
    c.globalAlpha=breath*(.9-i*.08); c.stroke();
  }
  c.strokeStyle='rgba(206,220,0,1)'; c.lineWidth=1; c.globalAlpha=breath*.9;
  c.strokeRect(-R*.2,-R*.32,R*.4,R*.45);
  c.font=`bold ${R*.28}px 'Playfair Display',serif`; c.textAlign='center'; c.textBaseline='middle';
  c.fillStyle='rgba(206,220,0,1)'; c.globalAlpha=breath*.85; c.fillText('AM',0,-R*.12);
  c.font=`${Math.max(9,R*.32)}px 'Playfair Display',serif`; c.textAlign='center';
  c.fillStyle='rgba(0,111,98,1)'; c.globalAlpha=breath*.55;
  c.fillText('14',-R*.35,R*.42); c.fillText('18',R*.35,R*.42);
  c.globalAlpha=1; c.restore();
}

