// ═══════════════════════════════════════════════════════════════════════
// ICONIC SYMBOLS — one function per bgType
// ═══════════════════════════════════════════════════════════════════════
/** @param {CanvasRenderingContext2D} c @param {string} btype */
function drawSymbol(c, btype) {
  const fn = SYMBOLS[btype];
  if (fn) fn(c, W, H, tick);
}

/** @type {Record<string, (c:CanvasRenderingContext2D, W:number, H:number, t:number)=>void>} */
const SYMBOLS = {
  supernatural(c,W,H,t) {
    const cx=W*.5,cy=H*.58,R=Math.min(W,H)*.16;
    const breath=.042+.014*Math.sin(t*.55),emGlow=.5+.5*Math.sin(t*.7);
    c.save(); c.translate(cx,cy);
    const halo=c.createRadialGradient(0,0,R*.7,0,0,R*1.5);
    halo.addColorStop(0,`rgba(200,60,0,${breath*.22})`); halo.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=halo; c.beginPath(); c.arc(0,0,R*1.5,0,Math.PI*2); c.fill();
    c.strokeStyle='rgba(180,40,0,1)'; c.lineWidth=1.4;
    c.globalAlpha=breath*1.1; c.beginPath(); c.arc(0,0,R,0,Math.PI*2); c.stroke();
    c.globalAlpha=breath*.75; c.lineWidth=.7; c.beginPath(); c.arc(0,0,R*.88,0,Math.PI*2); c.stroke();
    const starPts=[];
    for (let i=0;i<5;i++){const a=(i*2/5-.5)*Math.PI*2;starPts.push([Math.cos(a)*R,Math.sin(a)*R]);}
    c.beginPath(); c.globalAlpha=breath; c.strokeStyle='rgba(200,45,0,1)'; c.lineWidth=1.1;
    const order=[0,2,4,1,3,0];
    order.forEach((pi,i)=>i===0?c.moveTo(starPts[pi][0],starPts[pi][1]):c.lineTo(starPts[pi][0],starPts[pi][1]));
    c.stroke();
    c.globalAlpha=breath*.55; c.lineWidth=.6; c.beginPath(); c.arc(0,0,R*.6,0,Math.PI*2); c.stroke();
    c.beginPath(); c.arc(0,0,R*.045,0,Math.PI*2);
    c.fillStyle='rgba(255,100,20,1)'; c.globalAlpha=breath*2.2*emGlow; c.fill();
    c.globalAlpha=1; c.restore();
  },

  mentalist(c,W,H,t) {
    const cx=W*.5,cy=H*.52,R=Math.min(W,H)*.13;
    const drip=.5+.5*Math.sin(t*.38),breath=.07+.022*Math.sin(t*.5);
    c.save(); c.translate(cx,cy);
    const bg=c.createRadialGradient(0,0,0,0,0,R*1.6);
    bg.addColorStop(0,`rgba(120,0,0,${breath*.55})`); bg.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=bg; c.beginPath(); c.arc(0,0,R*1.6,0,Math.PI*2); c.fill();
    c.strokeStyle='rgba(160,8,8,1)'; c.lineWidth=2.8; c.globalAlpha=breath*1.15; c.lineCap='round';
    c.beginPath();
    for (let i=0;i<=60;i++) {
      const a=(i/60)*Math.PI*2;
      const w=1+.032*Math.sin(i*3.7+t*.08)+.018*Math.cos(i*5.1);
      const px=Math.cos(a)*R*w,py=Math.sin(a)*R*w;
      i===0?c.moveTo(px,py):c.lineTo(px,py);
    }
    c.closePath(); c.stroke();
    c.beginPath(); c.arc(-R*.32,-R*.22,R*.1,0,Math.PI*2); c.fillStyle='rgba(150,5,5,1)'; c.globalAlpha=breath*1.1; c.fill();
    c.beginPath(); c.arc(R*.3,-R*.2,R*.12,0,Math.PI*2); c.fillStyle='rgba(150,5,5,1)'; c.globalAlpha=breath*1.1; c.fill();
    c.beginPath(); c.moveTo(-R*.44,R*.1); c.bezierCurveTo(-R*.44,R*.52,R*.44,R*.52,R*.44,R*.1);
    c.strokeStyle='rgba(160,8,8,1)'; c.lineWidth=2.6; c.globalAlpha=breath*1.15; c.lineCap='round'; c.stroke();
    const dripPos=[-R*.3,R*.02,R*.28];
    dripPos.forEach((dx,i)=>{
      const dLen=R*(.28+.14*Math.sin(t*.3+i*1.1))*drip;
      c.globalAlpha=breath*.85; c.strokeStyle='rgba(130,5,5,1)'; c.lineWidth=2; c.lineCap='round';
      c.beginPath(); c.moveTo(dx,R); c.quadraticCurveTo(dx+R*.04,R+dLen*.55,dx+R*.01*(i-1),R+dLen); c.stroke();
      c.beginPath(); c.ellipse(dx+R*.01*(i-1),R+dLen,R*.045,R*.07,0,0,Math.PI*2);
      c.fillStyle='rgba(110,4,4,1)'; c.globalAlpha=breath*.7*drip; c.fill();
    });
    c.globalAlpha=1; c.restore();
  },

  dark(c,W,H,t) {
    const cx=W*.5,cy=H*.56,R=Math.min(W,H)*.14;
    const spinSlow=t*.014,breath=.038+.012*Math.sin(t*.42);
    c.save(); c.translate(cx,cy); c.rotate(spinSlow);
    const bg=c.createRadialGradient(0,0,0,0,0,R*1.4);
    bg.addColorStop(0,`rgba(30,70,160,${breath*.65})`); bg.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=bg; c.beginPath(); c.arc(0,0,R*1.4,0,Math.PI*2); c.fill();
    c.strokeStyle='rgba(68,136,204,1)'; c.lineWidth=1.5; c.lineCap='round';
    for (let i=0;i<3;i++) {
      const baseA=(i/3)*Math.PI*2-Math.PI/2;
      const ox=Math.cos(baseA)*R*.5,oy=Math.sin(baseA)*R*.5;
      const startA=baseA+Math.PI*.42+Math.PI/2,endA=baseA-Math.PI*.42+Math.PI/2+Math.PI*2;
      c.globalAlpha=breath*(i===0?1.4:i===1?1.15:1.0);
      c.beginPath(); c.arc(ox,oy,R,startA,endA); c.stroke();
    }
    c.globalAlpha=breath*.55; c.lineWidth=.8; c.beginPath(); c.arc(0,0,R*1.08,0,Math.PI*2); c.stroke();
    c.beginPath(); c.arc(0,0,R*.07,0,Math.PI*2);
    c.fillStyle='rgba(100,175,255,1)'; c.globalAlpha=breath*2.8*(0.6+0.4*Math.sin(t*.8)); c.fill();
    for (let i=0;i<3;i++) {
      const na=(i/3)*Math.PI*2-Math.PI/2;
      c.beginPath(); c.arc(Math.cos(na)*R*.78,Math.sin(na)*R*.78,R*.05,0,Math.PI*2);
      c.fillStyle='rgba(88,160,220,1)'; c.globalAlpha=breath*2; c.fill();
    }
    c.save(); c.rotate(-spinSlow);
    c.font=`${Math.max(8,R*.2)}px 'Josefin Sans',sans-serif`;
    c.textAlign='center'; c.textBaseline='middle'; c.fillStyle='rgba(100,170,220,1)';
    ['1953','1986','2019'].forEach((yr,i)=>{
      const ya=(i/3)*Math.PI*2-Math.PI/2+Math.PI;
      c.globalAlpha=breath*1.5; c.fillText(yr,Math.cos(ya)*R*1.35,Math.sin(ya)*R*1.35);
    });
    const msg='SIC MUNDUS CREATUS EST';
    c.font=`${Math.max(6,R*.155)}px 'Josefin Sans',sans-serif`;
    c.fillStyle='rgba(68,130,200,1)';
    for (let i=0;i<msg.length;i++) {
      const ca=-Math.PI/2+(i/msg.length)*Math.PI*2;
      c.save(); c.translate(Math.cos(ca)*R*1.55,Math.sin(ca)*R*1.55); c.rotate(ca+Math.PI/2);
      c.globalAlpha=breath*1.2; c.fillText(msg[i],0,0); c.restore();
    }
    c.restore(); c.globalAlpha=1; c.restore();
  },

  breakingbad(c,W,H,t) {
    const cx=W*.5,cy=H*.56,R=Math.min(W,H)*.1,breath=.05+.016*Math.sin(t*.55);
    c.save(); c.translate(cx,cy);
    const cellW=R*1.1,cellH=R*1.3,gap=R*.12;
    [{sym:'Br',num:'35',wt:'79.9',name:'BROMINE',x:-cellW-gap/2},{sym:'Ba',num:'56',wt:'137.3',name:'BARIUM',x:gap/2}].forEach(({sym,num,wt,name,x})=>{
      const hi=sym==='Br'?'#7ec800':'#b8f040';
      c.save(); c.translate(x+cellW/2,0);
      c.strokeStyle=hi; c.lineWidth=1.1; c.globalAlpha=breath; c.strokeRect(-cellW/2,-cellH/2,cellW,cellH);
      c.font=`${R*.22}px 'Bebas Neue',sans-serif`; c.fillStyle=hi; c.textAlign='left'; c.textBaseline='top';
      c.globalAlpha=breath*.85; c.fillText(num,-cellW/2+R*.07,-cellH/2+R*.05);
      c.textAlign='right'; c.fillText(wt,cellW/2-R*.05,-cellH/2+R*.05);
      c.font=`bold ${R*.72}px 'Bebas Neue',sans-serif`; c.textAlign='center'; c.textBaseline='middle';
      c.globalAlpha=breath*1.1*(0.85+0.15*Math.sin(t*.45)); c.fillText(sym,0,0);
      c.font=`${R*.17}px 'Bebas Neue',sans-serif`; c.textBaseline='bottom'; c.globalAlpha=breath*.65;
      c.fillText(name,0,cellH/2-R*.06); c.restore();
    });
    const totalW=(cellW*2+gap);
    for (let i=0;i<6;i++) {
      const orbitA=(i/6)*Math.PI*2+t*(i%2===0?.04:-.03);
      const orbitR=totalW*.52+R*.1;
      const sx=Math.cos(orbitA)*orbitR,sy=Math.sin(orbitA)*orbitR*.5;
      const sz=R*(.055+.022*Math.sin(t*.5+i));
      c.save(); c.translate(sx,sy); c.rotate(orbitA+t*.15);
      c.beginPath(); c.moveTo(0,-sz*2); c.lineTo(sz*.8,-sz*.2); c.lineTo(sz*.5,sz*1.2);
      c.lineTo(-sz*.5,sz*1.2); c.lineTo(-sz*.8,-sz*.2); c.closePath();
      c.fillStyle='rgba(60,140,255,1)'; c.globalAlpha=(breath*.55+.025*Math.sin(t*.8+i)); c.fill();
      c.strokeStyle='rgba(140,200,255,1)'; c.lineWidth=.5; c.globalAlpha=breath*.4; c.stroke();
      c.restore();
    }
    c.globalAlpha=1; c.restore();
  },

  strangerthings(c,W,H,t) {
    const cx=W*.5,cy=H*.55,R=Math.min(W,H)*.13;
    const openAmt=.45+.45*Math.sin(t*.38),breath=.045+.013*Math.sin(t*.65);
    c.save(); c.translate(cx,cy);
    const glow=c.createRadialGradient(0,0,R*.2,0,0,R*1.55);
    glow.addColorStop(0,`rgba(150,20,200,${breath*.4})`);
    glow.addColorStop(.5,`rgba(100,0,160,${breath*.15})`); glow.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=glow; c.beginPath(); c.arc(0,0,R*1.55,0,Math.PI*2); c.fill();
    for (let i=0;i<5;i++) {
      const pa=(i/5)*Math.PI*2-Math.PI/2,ext=openAmt*R*.58,pw=R*(.36+openAmt*.08);
      c.save(); c.rotate(pa); c.beginPath(); c.moveTo(0,R*.12);
      c.bezierCurveTo(-pw*.7,R*.18+ext*.25,-pw*.55,R*.15+ext*.8,0,R*.18+ext);
      c.bezierCurveTo(pw*.55,R*.15+ext*.8,pw*.7,R*.18+ext*.25,0,R*.12);
      c.closePath();
      const pg=c.createLinearGradient(0,R*.12,0,R*.18+ext);
      pg.addColorStop(0,`rgba(60,0,100,${breath*1.4})`);
      pg.addColorStop(.5,`rgba(140,20,200,${breath})`);
      pg.addColorStop(1,`rgba(80,5,130,${breath*.5})`);
      c.fillStyle=pg; c.fill();
      c.beginPath(); c.moveTo(0,R*.14); c.quadraticCurveTo(0,R*.14+ext*.5,0,R*.17+ext);
      c.strokeStyle='rgba(200,60,255,1)'; c.globalAlpha=breath*.7; c.lineWidth=.7; c.stroke();
      c.restore();
    }
    const mawR=R*(.12+.06*openAmt);
    c.beginPath(); c.arc(0,0,mawR,0,Math.PI*2); c.fillStyle='rgba(5,0,12,1)'; c.globalAlpha=.85; c.fill();
    const tg=c.createRadialGradient(0,0,0,0,0,mawR*.6);
    tg.addColorStop(0,`rgba(220,80,255,${breath*openAmt*.7})`); tg.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=tg; c.beginPath(); c.arc(0,0,mawR*.6,0,Math.PI*2); c.fill();
    c.globalAlpha=1; c.restore();
  },

  interstellar(c,W,H,t) {
    const cx=W*.5,cy=H*.54,R=Math.min(W,H)*.15;
    const diskRot=t*.038,breath=.032+.01*Math.sin(t*.55),tilt=.22;
    c.save(); c.translate(cx,cy);
    for (let layer=3;layer>=0;layer--) {
      const lr=R*(1+layer*.18);
      c.beginPath(); c.ellipse(0,0,lr,lr*tilt,diskRot+layer*.15,0,Math.PI*2);
      c.strokeStyle='rgba(120,190,255,1)'; c.globalAlpha=breath*[.12,.085,.055,.03][layer]*20;
      c.lineWidth=layer===0?3:layer===1?1.8:1; c.stroke();
    }
    c.save(); c.beginPath(); c.ellipse(0,0,R*1.02,R*tilt,diskRot,-.8,.8);
    c.strokeStyle='rgba(210,235,255,1)'; c.globalAlpha=breath*2.8; c.lineWidth=4; c.stroke(); c.restore();
    c.beginPath(); c.arc(0,0,R*.52,0,Math.PI*2); c.fillStyle='rgba(0,0,0,1)'; c.globalAlpha=.97; c.fill();
    c.beginPath(); c.arc(0,0,R*.55,0,Math.PI*2); c.strokeStyle='rgba(140,200,255,1)'; c.globalAlpha=breath*1.8; c.lineWidth=1.4; c.stroke();
    c.save(); c.rotate(-diskRot*2);
    c.font=`${Math.max(8,R*.22)}px 'Josefin Sans',sans-serif`;
    c.fillStyle='rgba(120,180,255,1)'; c.textAlign='center'; c.textBaseline='middle';
    c.globalAlpha=breath*1.8*(0.5+0.5*Math.sin(t*.35)); c.fillText('STAY',0,R*1.58);
    c.restore(); c.globalAlpha=1; c.restore();
  },

  dune(c,W,H,t) {
    const cx=W*.5,cy=H*.55,R=Math.min(W,H)*.1;
    const breath=.04+.012*Math.sin(t*.5),spiceBlue=.4+.6*Math.abs(Math.sin(t*.18));
    c.save(); c.translate(cx,cy);
    c.strokeStyle='rgba(200,150,30,1)'; c.lineCap='round';
    for (let i=0;i<4;i++) {
      const r=R*(1.05+i*.22);
      c.beginPath(); c.arc(0,0,r,-Math.PI+i*.1+t*.01,Math.PI-i*.08+t*.01);
      c.globalAlpha=breath*(.6-i*.12); c.lineWidth=.8; c.stroke();
    }
    [-R*.5,R*.5].forEach((eyeX)=>{
      c.save(); c.translate(eyeX,0);
      c.beginPath(); c.ellipse(0,0,R*.38,R*.24,0,0,Math.PI*2);
      c.fillStyle=`rgba(${180+spiceBlue*40|0},${160+spiceBlue*60|0},${80+spiceBlue*160|0},1)`;
      c.globalAlpha=breath*1.1; c.fill();
      const irisBlue=30+spiceBlue*200|0;
      c.beginPath(); c.arc(0,0,R*.2,0,Math.PI*2);
      const iG=c.createRadialGradient(0,0,0,0,0,R*.2);
      iG.addColorStop(0,`rgba(0,20,${irisBlue},1)`);
      iG.addColorStop(.6,`rgba(0,${irisBlue*.4|0},${irisBlue},1)`);
      iG.addColorStop(1,`rgba(0,${irisBlue*.2|0},${irisBlue*.7|0},1)`);
      c.fillStyle=iG; c.globalAlpha=breath*1.2; c.fill();
      c.beginPath(); c.arc(0,0,R*.08,0,Math.PI*2); c.fillStyle='rgba(0,0,0,1)'; c.globalAlpha=breath*.9; c.fill();
      c.restore();
    });
    const msg='· THE SPICE MUST FLOW ·';
    c.font=`${Math.max(6,R*.19)}px 'Cinzel',serif`; c.fillStyle='rgba(210,160,30,1)'; c.textAlign='center'; c.textBaseline='middle';
    for (let i=0;i<msg.length;i++) {
      const ca=-Math.PI/2+(i/msg.length)*Math.PI*2;
      c.save(); c.translate(Math.cos(ca)*R*1.62,Math.sin(ca)*R*1.62); c.rotate(ca+Math.PI/2);
      c.globalAlpha=breath*1.3; c.fillText(msg[i],0,0); c.restore();
    }
    c.globalAlpha=1; c.restore();
  },

  matrix(c,W,H,t) {
    const cx=W*.5,cy=H*.64,R=Math.min(W,H)*.044;
    const float=Math.sin(t*.5)*R*.18,breath=.06+.018*Math.sin(t*.6);
    c.save(); c.translate(cx,cy+float);
    c.font=`bold ${Math.max(9,R*1.1)}px monospace`;
    c.fillStyle='rgba(0,230,0,1)'; c.textAlign='center'; c.textBaseline='bottom';
    c.globalAlpha=breath*1.2*(0.6+0.4*Math.sin(t*.4)); c.fillText('CHOOSE',0,-R*1.6);
    [[-.28,'rgba(190,15,15,1)',-2.1],[.28,'rgba(20,75,210,1)',2.1]].forEach(([rot,col,bx])=>{
      c.save(); c.rotate(rot);
      c.beginPath(); c.ellipse(bx,0,R*1.1,R*.44,0,0,Math.PI*2);
      c.fillStyle=col; c.globalAlpha=breath*1.1; c.fill();
      c.restore();
    });
    c.globalAlpha=1; c.restore();
  },

  bladerunner(c,W,H,t) {
    const cx=W*.5,cy=H*.38,R=Math.min(W,H)*.1;
    const blinkCycle=(t*.14)%Math.PI;
    const openness=Math.max(.05,Math.abs(Math.sin(blinkCycle)));
    const irisRot=t*.055,breath=.042+.012*Math.sin(t*.5);
    c.save(); c.translate(cx,cy);
    const eyeGlow=c.createRadialGradient(0,0,0,0,0,R*1.6);
    eyeGlow.addColorStop(0,`rgba(220,100,15,${breath*.25})`); eyeGlow.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=eyeGlow; c.beginPath(); c.arc(0,0,R*1.6,0,Math.PI*2); c.fill();
    const eyeW=R*1.9,eyeH=R*openness*.7+R*.03;
    c.beginPath(); c.ellipse(0,0,eyeW,eyeH,0,0,Math.PI*2);
    c.fillStyle='rgba(30,12,0,1)'; c.globalAlpha=.85; c.fill();
    c.strokeStyle='rgba(180,120,50,1)'; c.globalAlpha=breath*.9; c.lineWidth=1; c.stroke();
    c.save(); c.beginPath(); c.ellipse(0,0,eyeW,eyeH,0,0,Math.PI*2); c.clip();
    if (openness>.08) {
      const irisR=Math.min(eyeH*.92,R*.45);
      const iG=c.createRadialGradient(0,0,0,0,0,irisR);
      iG.addColorStop(0,'rgba(35,12,0,1)'); iG.addColorStop(.35,'rgba(130,75,10,1)');
      iG.addColorStop(.7,'rgba(180,105,20,1)'); iG.addColorStop(1,'rgba(160,95,15,1)');
      c.beginPath(); c.arc(0,0,irisR,0,Math.PI*2); c.fillStyle=iG; c.globalAlpha=.82; c.fill();
      c.save(); c.rotate(irisRot);
      for (let i=0;i<18;i++) {
        const fa=(i/18)*Math.PI*2;
        c.beginPath(); c.moveTo(Math.cos(fa)*irisR*.22,Math.sin(fa)*irisR*.22);
        c.lineTo(Math.cos(fa)*irisR*.94,Math.sin(fa)*irisR*.94);
        c.strokeStyle='rgba(190,120,25,1)'; c.globalAlpha=breath*.35; c.lineWidth=.5; c.stroke();
      }
      c.restore();
      c.beginPath(); c.arc(0,0,irisR*.32,0,Math.PI*2); c.fillStyle='rgba(0,0,0,1)'; c.globalAlpha=.95; c.fill();
    }
    c.restore();
    c.font=`${Math.max(7,R*.2)}px 'Teko',sans-serif`;
    c.fillStyle='rgba(220,120,40,1)'; c.textAlign='center'; c.textBaseline='top';
    c.globalAlpha=breath*.8; c.fillText('MORE HUMAN THAN HUMAN',0,R*.8);
    c.globalAlpha=1; c.restore();
  },

  inception(c,W,H,t) {
    const cx=W*.5,cy=H*.57,R=Math.min(W,H)*.1;
    const spin=t*.62,wobble=Math.sin(t*.11)*.07,breath=.042+.012*Math.sin(t*.65);
    c.save(); c.translate(cx,cy); c.rotate(wobble);
    const topW=R*.52,botW=R*.18,th=R*1.3;
    const shimmerR=120+40*Math.cos(spin)|0,shimmerB=160+40*Math.sin(spin*.7)|0;
    const bodyG=c.createLinearGradient(-topW,0,topW,0);
    bodyG.addColorStop(0,`rgba(${shimmerR},${shimmerR*.7|0},${shimmerB},.12)`);
    bodyG.addColorStop(.4,`rgba(${shimmerR+20},${shimmerR*.8|0},${shimmerB+15},${breath*1.1})`);
    bodyG.addColorStop(1,`rgba(${shimmerR},${shimmerR*.65|0},${shimmerB},.08)`);
    c.beginPath();
    c.moveTo(-topW,-th*.45); c.lineTo(topW,-th*.45); c.lineTo(botW,th*.55); c.lineTo(-botW,th*.55); c.closePath();
    c.fillStyle=bodyG; c.globalAlpha=.82; c.fill();
    c.strokeStyle='rgba(160,160,230,1)'; c.globalAlpha=breath; c.lineWidth=.9; c.stroke();
    c.font=`${Math.max(7,R*.21)}px 'Playfair Display',serif`;
    c.fillStyle='rgba(160,160,240,1)'; c.textAlign='center'; c.textBaseline='top';
    c.globalAlpha=breath*1.3*(0.5+0.5*Math.sin(t*.3)); c.fillText('STILL SPINNING…',0,R*1.48);
    c.globalAlpha=1; c.restore();
  },

  godfather(c,W,H,t) {
    const cx=W*.42,cy=H*.6,R=Math.min(W,H)*.1,bloom=.55+.4*Math.sin(t*.18),breath=.032+.01*Math.sin(t*.4);
    c.save(); c.translate(cx,cy);
    c.beginPath(); c.moveTo(0,R*.2); c.quadraticCurveTo(-R*.15,R*1.4,R*.08,R*2.8);
    c.strokeStyle='rgba(30,65,15,1)'; c.globalAlpha=breath*1.1; c.lineWidth=1.8; c.lineCap='round'; c.stroke();
    const totalPetals=14;
    for (let i=totalPetals-1;i>=0;i--) {
      const frac=i/totalPetals,a=frac*Math.PI*2*2.5+t*.035;
      const pr=R*(.04+frac*.62*bloom),ps=R*(.1+frac*.28);
      const px=Math.cos(a)*pr,py=Math.sin(a)*pr*.72;
      c.save(); c.translate(px,py); c.rotate(a+.9);
      c.beginPath(); c.ellipse(0,0,ps*.75,ps*.52,0,0,Math.PI*2);
      c.fillStyle=`rgba(${80+frac*70|0},${3+frac*6|0},8,1)`;
      c.globalAlpha=breath*(0.55+frac*.35); c.fill(); c.restore();
    }
    c.beginPath(); c.arc(0,0,R*.1,0,Math.PI*2); c.fillStyle='rgba(30,3,3,1)'; c.globalAlpha=breath*1.2; c.fill();
    c.globalAlpha=1; c.restore();
    c.save(); c.translate(W*.64,H*.6);
    c.font=`italic ${Math.max(10,R*.62)}px 'IM Fell English',serif`;
    c.fillStyle='rgba(175,140,55,1)'; c.textAlign='center'; c.textBaseline='middle';
    c.globalAlpha=breath*1.1; c.fillText('Family',0,0);
    c.font=`${Math.max(7,R*.22)}px 'IM Fell English',serif`; c.globalAlpha=breath*.62;
    c.fillText('above all else',0,R*.5); c.restore();
  }
};

