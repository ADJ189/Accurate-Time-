// ═══════════════════════════════════════════════════════════════════════
// BACKGROUND RENDERER
// ═══════════════════════════════════════════════════════════════════════
let tick   = 0;
let lastTs = 0;

/** @param {number} dt delta seconds */
function drawBg(dt) {
  const c = bgCtx, t = currentTheme;
  tick += dt;
  c.clearRect(0, 0, W, H);

  // Base radial gradient from theme's baseBg
  const bg = t.baseBg;
  const gr = c.createRadialGradient(W*.5, H*.4, 0, W*.5, H*.55, Math.max(W,H)*.9);
  gr.addColorStop(0, bg[0]);
  gr.addColorStop(.5, bg[1] || bg[0]);
  gr.addColorStop(1,  bg[2] || bg[0]);
  c.fillStyle = gr;
  c.fillRect(0, 0, W, H);

  const bt = t.bgType;

  if (bt === 'aurora') {
    const cols = t.bgColors || ['#6ee7b7'];
    for (let i = 0; i < poolN; i++) {
      const o = i*PSTRIDE;
      pool[o]   += pool[o+2]; pool[o+1] += pool[o+3];
      if (pool[o]  <-60) pool[o] = W+60;
      if (pool[o]  >W+60) pool[o] = -60;
      if (pool[o+1]<-60) pool[o+1] = H+60;
      if (pool[o+1]>H+60) pool[o+1] = -60;
      const px=pool[o], py=pool[o+1], pr=pool[o+4], pa=pool[o+5];
      const col = cols[pool[o+7]|0];
      const g = c.createRadialGradient(px,py,0, px,py, pr*50);
      g.addColorStop(0, col+'88'); g.addColorStop(1, col+'00');
      c.beginPath(); c.arc(px,py,pr*50,0,Math.PI*2);
      c.fillStyle=g; c.globalAlpha=pa*.3; c.fill();
      c.beginPath(); c.arc(px,py,pr,0,Math.PI*2);
      c.fillStyle=col; c.globalAlpha=pa; c.fill();
    }
    c.globalAlpha=1;
  }

  else if (bt === 'sunrise') {
    const s=tick*.08, s2=tick*.14;
    const sg=c.createLinearGradient(0,0,W*Math.abs(Math.sin(s)),H);
    sg.addColorStop(0,'#1a0900');
    sg.addColorStop(.35+.08*Math.sin(s2),'#8b1a00');
    sg.addColorStop(.72,'#3d0060');
    sg.addColorStop(1,'#0a0020');
    c.fillStyle=sg; c.fillRect(0,0,W,H);
    const sg2=c.createRadialGradient(W*.5,H*.66,0,W*.5,H*.66,W*.52);
    sg2.addColorStop(0,'rgba(255,130,28,.28)');
    sg2.addColorStop(.5,'rgba(255,55,75,.09)');
    sg2.addColorStop(1,'transparent');
    c.fillStyle=sg2; c.fillRect(0,0,W,H);
  }

  else if (bt === 'forest') {
    for (let i=0;i<3;i++) {
      const bx=W*(.2+i*.3)+Math.sin(tick*.28+i)*25;
      const by=H*(.3+i*.2)+Math.cos(tick*.2+i)*18;
      const rg=c.createRadialGradient(bx,by,0,bx,by,180+i*70);
      rg.addColorStop(0,t.accent+'15'); rg.addColorStop(1,'transparent');
      c.fillStyle=rg; c.fillRect(0,0,W,H);
    }
  }

  else if (bt === 'ocean' || bt === 'dark') {
    if (bt === 'dark') {
      const dg=c.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,W*.52);
      dg.addColorStop(0,'rgba(0,38,95,.055)'); dg.addColorStop(1,'transparent');
      c.fillStyle=dg; c.fillRect(0,0,W,H);
      c.save(); c.translate(W*.5,H*.5);
      for (let i=0;i<3;i++) {
        const r=(72+i*66)+Math.sin(tick*.35+i)*6;
        c.beginPath(); c.arc(0,0,r,0,Math.PI*2);
        c.strokeStyle=t.accent; c.globalAlpha=.032-i*.007; c.lineWidth=.8; c.stroke();
      }
      c.globalAlpha=1; c.restore();
      drawSymbol(c, bt);
    }
    for (let i=0;i<poolN;i++) {
      const o=i*PSTRIDE;
      pool[o+3]+=pool[o+2];
      c.beginPath(); c.moveTo(0,pool[o+1]);
      for (let x=0;x<=W;x+=8)
        c.lineTo(x, pool[o+1]+Math.sin(x*pool[o+8]+pool[o+3])*pool[o+7]);
      c.lineTo(W,H); c.lineTo(0,H); c.closePath();
      c.fillStyle=t.accent; c.globalAlpha=pool[o+5]; c.fill();
    }
    c.globalAlpha=1;
  }

  else if (bt==='midnight'||bt==='strangerthings'||bt==='interstellar') {
    for (let i=0;i<poolN;i++) {
      const o=i*PSTRIDE;
      pool[o+7]+=pool[o+8];
      const a=pool[o+5]*(0.45+0.55*Math.sin(pool[o+7]));
      c.beginPath(); c.arc(pool[o],pool[o+1],pool[o+4],0,Math.PI*2);
      c.fillStyle='#ffffff'; c.globalAlpha=a; c.fill();
    }
    c.globalAlpha=1;
    if (bt==='strangerthings') {
      const pg=c.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,W*.4);
      pg.addColorStop(0,t.accent+'12'); pg.addColorStop(.5,t.accent2+'07'); pg.addColorStop(1,'transparent');
      c.fillStyle=pg; c.globalAlpha=.5+.5*Math.sin(tick*.7); c.fillRect(0,0,W,H); c.globalAlpha=1;
      drawSymbol(c, bt);
    }
    if (bt==='interstellar') {
      const bh=c.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,W*.28);
      bh.addColorStop(0,'rgba(0,0,0,.9)'); bh.addColorStop(.35,'rgba(0,30,80,.3)');
      bh.addColorStop(.65,'rgba(0,60,140,.1)'); bh.addColorStop(1,'transparent');
      c.fillStyle=bh; c.fillRect(0,0,W,H);
      c.save(); c.translate(W*.5,H*.5);
      c.beginPath(); c.ellipse(0,0,W*.22,W*.055,0,0,Math.PI*2);
      c.strokeStyle='rgba(80,160,255,.12)'; c.lineWidth=16; c.stroke();
      c.restore();
      drawSymbol(c, bt);
    }
  }

  else if (bt === 'candy') {
    for (let i=0;i<poolN;i++) {
      const o=i*PSTRIDE;
      pool[o]  +=pool[o+2]+Math.sin(tick+pool[o+7])*.2;
      pool[o+1]+=pool[o+3];
      if (pool[o+1]<-120) { pool[o+1]=H+50; pool[o]=rnd(W); }
      c.beginPath(); c.arc(pool[o],pool[o+1],pool[o+4],0,Math.PI*2);
      c.strokeStyle=t.accent; c.globalAlpha=pool[o+5]*3; c.lineWidth=1.5; c.stroke();
      c.fillStyle=t.baseBg[0]; c.globalAlpha=pool[o+5]; c.fill();
    }
    c.globalAlpha=1;
  }

  else if (bt === 'nordic') {
    c.globalAlpha=.022;
    for (let x=0;x<W;x+=40) for (let y=0;y<H;y+=40) { c.fillStyle='#64748b'; c.fillRect(x,y,1,1); }
    c.globalAlpha=1;
  }

  else if (bt === 'lemon') {
    c.globalAlpha=.18;
    for (let x=0;x<W;x+=28) for (let y=0;y<H;y+=28) {
      c.beginPath(); c.arc(x,y,1.3,0,Math.PI*2); c.fillStyle=t.accent; c.fill();
    }
    c.globalAlpha=1;
  }

  else if (bt === 'supernatural') {
    const fg=c.createRadialGradient(W*.5,H*1.05,0,W*.5,H*.78,W*.62);
    fg.addColorStop(0,'rgba(220,75,0,.26)'); fg.addColorStop(1,'transparent');
    c.fillStyle=fg; c.fillRect(0,0,W,H);
    drawSymbol(c, bt);
    for (let i=0;i<poolN;i++) {
      const o=i*PSTRIDE;
      pool[o+1]+=pool[o+3]; pool[o]+=pool[o+2]+Math.sin(tick*1.8+pool[o+5])*.35;
      pool[o+6]-=pool[o+7];
      if (pool[o+6]<=0||pool[o+1]<0) { pool[o]=rnd(W);pool[o+1]=H+6;pool[o+6]=1;pool[o+5]=rnd(.8)+.2; }
      const ec=c.createRadialGradient(pool[o],pool[o+1],0,pool[o],pool[o+1],pool[o+4]*4);
      ec.addColorStop(0,'rgba(255,175,25,.9)'); ec.addColorStop(1,'rgba(200,45,0,0)');
      c.beginPath(); c.arc(pool[o],pool[o+1],pool[o+4]*4,0,Math.PI*2);
      c.fillStyle=ec; c.globalAlpha=pool[o+6]*pool[o+5]*.45; c.fill();
      c.beginPath(); c.arc(pool[o],pool[o+1],pool[o+4]*.5,0,Math.PI*2);
      c.fillStyle='#fffae0'; c.globalAlpha=pool[o+6]; c.fill();
    }
    c.globalAlpha=1;
  }

  else if (bt === 'mentalist') {
    const rg=c.createRadialGradient(W*.5,H*.3,0,W*.5,H*.3,W*.5);
    rg.addColorStop(0,'rgba(180,8,0,.12)'); rg.addColorStop(1,'transparent');
    c.fillStyle=rg; c.fillRect(0,0,W,H);
    drawSymbol(c, bt);
    for (let i=0;i<poolN;i++) {
      const o=i*PSTRIDE;
      pool[o]+=pool[o+2]; pool[o+1]+=pool[o+3]; pool[o+7]+=pool[o+8];
      if(pool[o]<-50)pool[o]=W+50; if(pool[o]>W+50)pool[o]=-50;
      if(pool[o+1]<-50)pool[o+1]=H+50; if(pool[o+1]>H+50)pool[o+1]=-50;
      c.save(); c.translate(pool[o],pool[o+1]); c.rotate(pool[o+7]);
      c.beginPath(); c.arc(0,0,pool[o+4]*6,0,Math.PI*2);
      c.strokeStyle=t.accent; c.globalAlpha=pool[o+5]; c.lineWidth=1; c.stroke();
      c.globalAlpha=1; c.restore();
    }
  }

  else if (bt === 'sopranos') {
    for (let i=0;i<poolN;i++) {
      const o=i*PSTRIDE;
      pool[o]+=pool[o+2]+Math.sin(tick*.4+pool[o+5])*.15;
      pool[o+1]+=pool[o+3]; pool[o+4]+=pool[o+7];
      if (pool[o+1]<-120||pool[o+4]>105) {
        pool[o+1]=H+15; pool[o+4]=rnd(15)+5;
        pool[o]=rnd(W*.5)+W*.25; pool[o+3]=-(rnd(.32)+.07);
      }
      c.beginPath(); c.arc(pool[o],pool[o+1],pool[o+4],0,Math.PI*2);
      c.fillStyle='rgba(175,152,92,1)'; c.globalAlpha=pool[o+5]*(1-pool[o+4]/105); c.fill();
    }
    c.globalAlpha=1;
  }

  else if (bt === 'breakingbad') {
    const cg=c.createRadialGradient(W*.5,H*.28,0,W*.5,H*.5,W*.62);
    cg.addColorStop(0,'rgba(95,190,0,.09)'); cg.addColorStop(1,'transparent');
    c.fillStyle=cg; c.fillRect(0,0,W,H);
    c.fillStyle='#0b1400'; c.fillRect(0,H*.72,W,H*.28);
    drawSymbol(c, bt);
    for (let i=0;i<poolN;i++) {
      const o=i*PSTRIDE;
      pool[o]+=pool[o+2]; pool[o+1]+=pool[o+3]; pool[o+7]+=pool[o+8];
      if(pool[o]<-50)pool[o]=W+50; if(pool[o]>W+50)pool[o]=-50;
      if(pool[o+1]<-50)pool[o+1]=H+50; if(pool[o+1]>H+50)pool[o+1]=-50;
      drawHex(c,pool[o],pool[o+1],pool[o+4],pool[o+7],pool[o+5],t.accent);
    }
  }

  else if (bt === 'matrix') {
    if (!matCols) buildMatrixRain();
    c.fillStyle='rgba(0,8,0,.18)'; c.fillRect(0,0,W,H);
    c.font='13px monospace';
    const cols = matCols.length/2;
    for (let i=0;i<cols;i++) {
      matCols[i*2]+=matCols[i*2+1]*dt*60;
      if (matCols[i*2]>H+20) matCols[i*2]=-20;
      const x=i*15;
      for (let j=0;j<22;j++) {
        const y=matCols[i*2]-j*15;
        if (y<-15||y>H+15) continue;
        const fa=j===0?0.95:Math.max(0,0.6-j*.026);
        c.fillStyle=j===0?`rgba(180,255,180,${fa})`:`rgba(0,${175-j*5},0,${fa})`;
        c.fillText(MAT_CHARS[(j+Math.floor(tick*3*60))%MAT_CHARS.length], x, y);
      }
    }
    drawSymbol(c, bt);
  }

  else if (bt === 'dune') {
    const dg=c.createLinearGradient(0,0,0,H);
    dg.addColorStop(0,'#0e0800'); dg.addColorStop(.5,'#1e1200');
    dg.addColorStop(.75,'#2a1800'); dg.addColorStop(1,'#0e0800');
    c.fillStyle=dg; c.fillRect(0,0,W,H);
    for (let i=0;i<4;i++) {
      const base=H*(.5+i*.1)+Math.sin(tick*.08+i)*10;
      c.beginPath(); c.moveTo(0,base);
      for (let x=0;x<=W;x+=6) c.lineTo(x,base+Math.sin(x*.008+tick*.05+i)*28+Math.sin(x*.02-i)*12);
      c.lineTo(W,H); c.lineTo(0,H); c.closePath();
      const sg=c.createLinearGradient(0,base,0,base+55);
      sg.addColorStop(0,`rgba(180,120,20,${.11-i*.022})`); sg.addColorStop(1,'transparent');
      c.fillStyle=sg; c.fill();
    }
    for (let i=0;i<poolN;i++) {
      const o=i*PSTRIDE;
      pool[o]+=pool[o+2]; pool[o+1]+=pool[o+3]; pool[o+6]-=.001;
      if (pool[o+6]<=0||pool[o+1]>H+10) { pool[o]=rnd(W);pool[o+1]=rnd(H*.5);pool[o+6]=rnd(.8)+.4; }
      c.beginPath(); c.arc(pool[o],pool[o+1],pool[o+4],0,Math.PI*2);
      c.fillStyle='rgba(220,170,80,1)'; c.globalAlpha=pool[o+5]*pool[o+6]*.55; c.fill();
    }
    c.globalAlpha=1;
    drawSymbol(c, bt);
  }

  else if (bt === 'bladerunner') {
    if (!skylineReady) buildSkyline();
    const skyG=c.createLinearGradient(0,0,0,H*.75);
    skyG.addColorStop(0,'#060300'); skyG.addColorStop(.6,'#120600'); skyG.addColorStop(1,'#0a0400');
    c.fillStyle=skyG; c.fillRect(0,0,W,H*.75);
    [[W*.3,H*.35,'rgba(240,80,20,'],[W*.65,H*.28,'rgba(200,40,10,']].forEach(([nx,ny,col])=>{
      const ng=c.createRadialGradient(nx,ny,0,nx,ny,W*.38);
      ng.addColorStop(0,`${col}.12)`); ng.addColorStop(1,'transparent');
      c.fillStyle=ng; c.fillRect(0,0,W,H);
    });
    c.fillStyle='#040200'; c.fillRect(0,H*.72,W,H*.28);
    c.fillStyle='#040200';
    for (let si=0;si<skylineCount;si++) c.fillRect(skyX[si],H*.72-skyHt[si],skyW[si],skyHt[si]);
    for (let si=0;si<skylineCount;si++) {
      for (let wy=H*.72-skyHt[si]+4;wy<H*.72-3;wy+=8) {
        for (let wx=skyX[si]+3;wx<skyX[si]+skyW[si]-3;wx+=6) {
          const hash=(si*997+Math.floor(wy)*31+Math.floor(wx)*7)%100;
          if (hash<30) {
            const lit=((hash+Math.floor(tick*.1*60))%10)>3;
            if (lit) { c.fillStyle=hash<15?'rgba(220,170,80,.5)':'rgba(255,140,60,.4)'; c.fillRect(wx,wy,2,3); }
          }
        }
      }
    }
    for (let i=0;i<poolN;i++) {
      const o=i*PSTRIDE;
      pool[o]+=pool[o+2]; pool[o+1]+=pool[o+3];
      if (pool[o+1]>H) { pool[o+1]=rnd(H*.3); pool[o]=rnd(W); }
      c.beginPath(); c.moveTo(pool[o],pool[o+1]); c.lineTo(pool[o]+pool[o+2]*3.5,pool[o+1]+11);
      c.strokeStyle='rgba(180,200,255,1)'; c.globalAlpha=pool[o+5]*.38; c.lineWidth=.5; c.stroke();
    }
    c.globalAlpha=1;
    drawSymbol(c, bt);
  }

  else if (bt === 'inception') {
    c.save(); c.translate(W*.5,H*.5); c.rotate(Math.sin(tick*.06)*.035);
    c.globalAlpha=.022;
    for (let x=-W;x<W;x+=60) { c.beginPath();c.moveTo(x,-H);c.lineTo(x,H);c.strokeStyle='#9090dd';c.lineWidth=.5;c.stroke(); }
    for (let y=-H;y<H;y+=60) { c.beginPath();c.moveTo(-W,y);c.lineTo(W,y);c.strokeStyle='#9090dd';c.lineWidth=.5;c.stroke(); }
    c.globalAlpha=1; c.restore();
    for (let i=0;i<poolN;i++) {
      const o=i*PSTRIDE;
      pool[o+7]+=pool[o+8];
      const r=pool[o+4]+Math.sin(pool[o+7])*10;
      c.beginPath(); c.arc(pool[o],pool[o+1],r,0,Math.PI*2);
      c.strokeStyle=t.accent; c.globalAlpha=pool[o+5]*(0.6+0.4*Math.sin(pool[o+7]*2)); c.lineWidth=.8; c.stroke();
    }
    c.globalAlpha=1;
    drawSymbol(c, bt);
  }

  else if (bt === 'godfather') {
    const gg=c.createRadialGradient(W*.3,H*.3,0,W*.3,H*.3,W*.5);
    gg.addColorStop(0,'rgba(70,52,8,.08)'); gg.addColorStop(1,'transparent');
    c.fillStyle=gg; c.fillRect(0,0,W,H);
    for (let i=0;i<poolN;i++) {
      const o=i*PSTRIDE;
      pool[o]+=pool[o+2]; pool[o+1]+=pool[o+3]; pool[o+4]+=pool[o+7];
      if (pool[o+1]<-80||pool[o+4]>85) {
        pool[o+1]=H*(.2+rnd(.6)); pool[o+4]=rnd(20)+7; pool[o]=rnd(W*.4)+W*.3;
      }
      c.beginPath(); c.arc(pool[o],pool[o+1],pool[o+4],0,Math.PI*2);
      c.fillStyle='rgba(130,105,18,1)'; c.globalAlpha=pool[o+5]*(1-pool[o+4]/85); c.fill();
    }
    c.globalAlpha=1;
    drawSymbol(c, bt);
  }

  // F1 themes
  else if (bt === 'redbull') {
    c.save(); c.globalAlpha=.045;
    for(let x=0;x<W;x+=18){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.strokeStyle='#1e41ff';c.lineWidth=.5;c.stroke();}
    for(let y=0;y<H;y+=18){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.strokeStyle='#1e41ff';c.lineWidth=.5;c.stroke();}
    c.globalAlpha=1; c.restore();
    const rg=c.createRadialGradient(W*.5,H,0,W*.5,H,W*.65);
    rg.addColorStop(0,'rgba(232,0,45,.22)'); rg.addColorStop(.5,'rgba(30,65,255,.08)'); rg.addColorStop(1,'transparent');
    c.fillStyle=rg; c.fillRect(0,0,W,H);
    drawF1Symbol(c,W,H,tick,'redbull');
    for(let i=0;i<poolN;i++){
      const o=i*PSTRIDE;
      pool[o]+=pool[o+2]*2.5; pool[o+1]+=pool[o+3]*.5;
      if(pool[o]>W+20){pool[o]=-20;pool[o+1]=rnd(H);}
      c.beginPath();c.moveTo(pool[o],pool[o+1]);c.lineTo(pool[o]-pool[o+4]*28,pool[o+1]);
      const sg=c.createLinearGradient(pool[o]-pool[o+4]*28,0,pool[o],0);
      sg.addColorStop(0,'transparent');sg.addColorStop(1,pool[o+7]>.5?'rgba(232,0,45,1)':'rgba(30,65,255,1)');
      c.strokeStyle=sg;c.globalAlpha=pool[o+5]*.6;c.lineWidth=pool[o+4]*.5;c.stroke();
    }
    c.globalAlpha=1;
  }

  else if (bt === 'ferrari') {
    const fg=c.createRadialGradient(W*.5,H*.3,0,W*.5,H*.5,W*.75);
    fg.addColorStop(0,'rgba(220,20,0,.18)'); fg.addColorStop(.5,'rgba(140,0,0,.08)'); fg.addColorStop(1,'transparent');
    c.fillStyle=fg; c.fillRect(0,0,W,H);
    const poG=c.createLinearGradient(0,H*-.94,0,H);
    poG.addColorStop(0,'rgba(255,237,0,.18)'); poG.addColorStop(1,'rgba(255,200,0,.04)');
    c.fillStyle=poG; c.fillRect(0,H*.94,W,H*.06);
    drawF1Symbol(c,W,H,tick,'ferrari');
    for(let i=0;i<poolN;i++){
      const o=i*PSTRIDE;
      pool[o]+=pool[o+2]*2.2; pool[o+1]+=pool[o+3]*.4;
      if(pool[o]>W+20){pool[o]=-20;pool[o+1]=rnd(H);}
      const ec=c.createLinearGradient(pool[o]-pool[o+4]*22,0,pool[o],0);
      ec.addColorStop(0,'transparent');ec.addColorStop(1,'rgba(255,40,0,1)');
      c.beginPath();c.moveTo(pool[o],pool[o+1]);c.lineTo(pool[o]-pool[o+4]*22,pool[o+1]);
      c.strokeStyle=ec;c.globalAlpha=pool[o+5]*.55;c.lineWidth=pool[o+4]*.5;c.stroke();
    }
    c.globalAlpha=1;
  }

  else if (bt === 'mercedes') {
    const mg=c.createRadialGradient(W*.5,H*.4,0,W*.5,H*.55,W*.7);
    mg.addColorStop(0,'rgba(0,210,190,.12)'); mg.addColorStop(.5,'rgba(0,100,90,.05)'); mg.addColorStop(1,'transparent');
    c.fillStyle=mg; c.fillRect(0,0,W,H);
    c.save(); c.globalAlpha=.03;
    for(let x=0;x<W;x+=22){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.strokeStyle='#c0c0c0';c.lineWidth=.8;c.stroke();}
    c.globalAlpha=1; c.restore();
    drawF1Symbol(c,W,H,tick,'mercedes');
    for(let i=0;i<poolN;i++){
      const o=i*PSTRIDE;
      pool[o]+=pool[o+2]*2.0; pool[o+1]+=pool[o+3]*.3;
      if(pool[o]>W+20){pool[o]=-20;pool[o+1]=rnd(H);}
      const mc=c.createLinearGradient(pool[o]-pool[o+4]*24,0,pool[o],0);
      mc.addColorStop(0,'transparent');mc.addColorStop(1,'rgba(0,210,190,1)');
      c.beginPath();c.moveTo(pool[o],pool[o+1]);c.lineTo(pool[o]-pool[o+4]*24,pool[o+1]);
      c.strokeStyle=mc;c.globalAlpha=pool[o+5]*.5;c.lineWidth=pool[o+4]*.5;c.stroke();
    }
    c.globalAlpha=1;
  }

  else if (bt === 'mclaren') {
    const og=c.createRadialGradient(W*.5,H*.5,0,W*.5,H*.6,W*.7);
    og.addColorStop(0,'rgba(255,128,0,.16)'); og.addColorStop(.5,'rgba(180,80,0,.06)'); og.addColorStop(1,'transparent');
    c.fillStyle=og; c.fillRect(0,0,W,H);
    drawF1Symbol(c,W,H,tick,'mclaren');
    for(let i=0;i<poolN;i++){
      const o=i*PSTRIDE;
      pool[o]+=pool[o+2]*2.8; pool[o+1]+=pool[o+3]*.4;
      if(pool[o]>W+20){pool[o]=-20;pool[o+1]=rnd(H);}
      const oc=c.createLinearGradient(pool[o]-pool[o+4]*30,0,pool[o],0);
      oc.addColorStop(0,'transparent');oc.addColorStop(1,'rgba(255,128,0,1)');
      c.beginPath();c.moveTo(pool[o],pool[o+1]);c.lineTo(pool[o]-pool[o+4]*30,pool[o+1]);
      c.strokeStyle=oc;c.globalAlpha=pool[o+5]*.6;c.lineWidth=pool[o+4]*.5;c.stroke();
    }
    c.globalAlpha=1;
  }

  else if (bt === 'astonmartin') {
    const ag=c.createRadialGradient(W*.5,H*.4,0,W*.5,H*.55,W*.7);
    ag.addColorStop(0,'rgba(0,111,98,.14)'); ag.addColorStop(.5,'rgba(0,60,54,.06)'); ag.addColorStop(1,'transparent');
    c.fillStyle=ag; c.fillRect(0,0,W,H);
    const limeg=c.createRadialGradient(W*.5,H,0,W*.5,H,W*.5);
    limeg.addColorStop(0,'rgba(206,220,0,.06)'); limeg.addColorStop(1,'transparent');
    c.fillStyle=limeg; c.fillRect(0,0,W,H);
    drawF1Symbol(c,W,H,tick,'astonmartin');
    for(let i=0;i<poolN;i++){
      const o=i*PSTRIDE;
      pool[o]+=pool[o+2]*1.8; pool[o+1]+=pool[o+3]*.3;
      if(pool[o]>W+20){pool[o]=-20;pool[o+1]=rnd(H);}
      const ac=c.createLinearGradient(pool[o]-pool[o+4]*22,0,pool[o],0);
      ac.addColorStop(0,'transparent');ac.addColorStop(1,'rgba(0,111,98,1)');
      c.beginPath();c.moveTo(pool[o],pool[o+1]);c.lineTo(pool[o]-pool[o+4]*22,pool[o+1]);
      c.strokeStyle=ac;c.globalAlpha=pool[o+5]*.5;c.lineWidth=pool[o+4]*.5;c.stroke();
    }
    c.globalAlpha=1;
  }
}

/** @param {CanvasRenderingContext2D} c @param {number} x @param {number} y @param {number} s @param {number} rot @param {number} a @param {string} color */
function drawHex(c, x, y, s, rot, a, color) {
  c.save(); c.translate(x,y); c.rotate(rot);
  c.beginPath();
  for (let i=0;i<6;i++) {
    const ang=(i/6)*Math.PI*2;
    i ? c.lineTo(Math.cos(ang)*s, Math.sin(ang)*s) : c.moveTo(Math.cos(ang)*s, Math.sin(ang)*s);
  }
  c.closePath(); c.strokeStyle=color; c.globalAlpha=a; c.lineWidth=1; c.stroke(); c.globalAlpha=1; c.restore();
}
