// ═══════════════════════════════════════════════════════════════════════
// TRANSITIONS — cinematic
// ═══════════════════════════════════════════════════════════════════════
let transitioning = false;

/** @param {string} type @param {()=>void} cb */
function runTransition(type, cb) {
  if (transitioning) { cb(); return; }
  transitioning = true;
  tCanvas.style.display = 'block';
  const fn = TRANSITIONS[type] || TRANSITIONS.defaultFade;
  fn(cb);
}

/** @param {(()=>void)|null} [done] */
function finishTrans(done) {
  let f = 1;
  const step = () => {
    f -= .02;
    tCtx.clearRect(0, 0, tCanvas.width, tCanvas.height);
    if (f > 0) {
      tCtx.fillStyle = `rgba(0,0,0,${f})`;
      tCtx.fillRect(0, 0, tCanvas.width, tCanvas.height);
      requestAnimationFrame(step);
    } else {
      tCanvas.style.display = 'none';
      transitioning = false;
      if (done) done();
    }
  };
  requestAnimationFrame(step);
}

/** @type {Record<string, (cb:()=>void)=>void>} */
const TRANSITIONS = {

  f1_launch(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;
    let elapsed=0,lastT=null,called=false;
    const LP=[0.2,0.35,0.5,0.65,0.8];
    const LR=Math.min(W,H)*.042;
    const totalDur=3500;
    const go=(ts)=>{
      if(!lastT)lastT=ts;
      elapsed+=ts-lastT; lastT=ts;
      const p=elapsed/totalDur;
      c.clearRect(0,0,W,H);
      c.fillStyle=`rgba(0,0,0,${Math.min(.96,p*2.2)})`; c.fillRect(0,0,W,H);
      if(p>0.08){
        const tA=Math.min(.35,(p-.08)*1.5);
        c.fillStyle=`rgba(28,28,30,${tA})`; c.fillRect(0,H*.62,W,H*.38);
        c.strokeStyle=`rgba(255,255,255,${tA*.4})`; c.lineWidth=2; c.setLineDash([W*.06,W*.04]);
        c.beginPath();c.moveTo(0,H*.72);c.lineTo(W,H*.72);c.stroke();
        c.setLineDash([]);
      }
      if(p>0.05){
        const gA=Math.min(.7,(p-.05)*3);
        c.fillStyle=`rgba(18,18,20,${gA})`; c.fillRect(0,H*.34-LR*1.8,W,LR*.55);
        [0.08,0.92].forEach(lx=>{
          c.fillStyle=`rgba(22,22,24,${gA})`;
          c.fillRect(W*lx-LR*.35,H*.34-LR*1.8,LR*.7,H*.34);
        });
      }
      LP.forEach((lx,i)=>{
        const lightX=W*lx,lightY=H*.34;
        const lightOnAt=0.15+(i/(LP.length-1))*0.4;
        const isOn=p>=lightOnAt&&p<0.72+i*.055;
        if(p>0.05){
          c.beginPath();c.arc(lightX,lightY,LR*1.2,0,Math.PI*2);
          c.fillStyle='rgba(12,12,15,0.92)';c.fill();
          c.strokeStyle='rgba(60,60,65,0.8)';c.lineWidth=1;c.stroke();
        }
        if(p>=lightOnAt){
          const onP=Math.min(1,(p-lightOnAt)/.08);
          if(isOn){
            const bloom=c.createRadialGradient(lightX,lightY,0,lightX,lightY,LR*3.5);
            bloom.addColorStop(0,`rgba(255,20,0,${.45*onP})`);
            bloom.addColorStop(.4,`rgba(200,0,0,${.18*onP})`);
            bloom.addColorStop(1,'rgba(0,0,0,0)');
            c.fillStyle=bloom;c.beginPath();c.arc(lightX,lightY,LR*3.5,0,Math.PI*2);c.fill();
            const inner=c.createRadialGradient(lightX,lightY,0,lightX,lightY,LR);
            inner.addColorStop(0,`rgba(255,160,100,${.98*onP})`);
            inner.addColorStop(.35,`rgba(255,30,0,${.95*onP})`);
            inner.addColorStop(.7,`rgba(180,0,0,${.8*onP})`);
            inner.addColorStop(1,`rgba(80,0,0,${.3*onP})`);
            c.fillStyle=inner;c.beginPath();c.arc(lightX,lightY,LR,0,Math.PI*2);c.fill();
            c.beginPath();c.arc(lightX,lightY,LR*.28,0,Math.PI*2);
            c.fillStyle=`rgba(255,240,220,${.95*onP})`;c.fill();
          }else{
            const extF=Math.max(0,1-(p-(0.72+i*.055))/.06);
            if(extF>0){
              const dying=c.createRadialGradient(lightX,lightY,0,lightX,lightY,LR*2);
              dying.addColorStop(0,`rgba(80,0,0,${.15*extF})`);dying.addColorStop(1,'rgba(0,0,0,0)');
              c.fillStyle=dying;c.beginPath();c.arc(lightX,lightY,LR*2,0,Math.PI*2);c.fill();
            }
            c.beginPath();c.arc(lightX,lightY,LR*.8,0,Math.PI*2);c.fillStyle='rgba(8,8,8,0.96)';c.fill();
          }
        }
      });
      if(p>0.72){
        const loA=Math.min(1,(p-.72)/.07);
        const loFade=Math.min(1,(.97-p)/.09);
        const loAlpha=loA*loFade;
        if(p<0.76){
          const flashA=Math.sin((p-.72)/.04*Math.PI)*.55;
          c.fillStyle=`rgba(255,255,240,${flashA})`;c.fillRect(0,0,W,H);
        }
        if(loAlpha>0.05){
          c.font=`bold ${Math.min(W*.07,56)}px 'Orbitron',monospace`;
          c.textAlign='center';c.textBaseline='middle';
          c.fillStyle=`rgba(0,0,0,${loAlpha*.5})`;c.fillText('LIGHTS OUT',W*.5+3,H*.55+3);
          c.fillStyle=`rgba(255,255,255,${loAlpha})`;c.fillText('LIGHTS OUT',W*.5,H*.55);
          c.font=`${Math.min(W*.028,22)}px 'Orbitron',monospace`;
          c.fillStyle=`rgba(220,80,0,${loAlpha*.9})`;c.fillText('AND AWAY WE GO!',W*.5,H*.55+Math.min(W*.09,72));
        }
      }
      c.globalAlpha=1;
      if(!called&&p>=.74){called=true;cb();}
      if(p<1.0)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  f1_burnout(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;
    let elapsed=0,lastT=null,called=false;
    const totalDur=3400;
    const smokeP=Array.from({length:48},(_,i)=>({
      x:W*(.28+Math.random()*.44),y:H*(.68+Math.random()*.12),
      r:Math.random()*22+12,maxR:Math.random()*160+90,
      vx:(Math.random()-.5)*.9,vy:-(Math.random()*.7+.25),
      alpha:Math.random()*.18+.08,grey:Math.floor(Math.random()*40+130),
      delay:Math.random()*.28
    }));
    const sparks=Array.from({length:35},()=>({
      x:W*(.38+Math.random()*.24),y:H*(.75+Math.random()*.06),
      vx:(Math.random()-.5)*8,vy:-(Math.random()*6+2),
      life:1.0,decay:Math.random()*.018+.010,r:Math.random()*2+.8,hot:Math.random()>.4
    }));
    const go=(ts)=>{
      if(!lastT)lastT=ts;
      elapsed+=ts-lastT; lastT=ts;
      const p=Math.min(1,elapsed/totalDur);
      c.clearRect(0,0,W,H);
      c.fillStyle=`rgba(0,0,0,${Math.min(.92,p*1.1)})`; c.fillRect(0,0,W,H);
      if(p>0.05){
        const tA=Math.min(.55,(p-.05)*2);
        c.fillStyle=`rgba(22,20,18,${tA})`; c.fillRect(0,H*.65,W,H*.35);
        c.strokeStyle=`rgba(240,240,240,${tA*.3})`; c.lineWidth=3; c.setLineDash([W*.05,W*.04]);
        c.beginPath();c.moveTo(0,H*.75);c.lineTo(W,H*.75);c.stroke();c.setLineDash([]);
      }
      if(p>0.06&&p<0.65){
        const sA=Math.sin(Math.PI*(p-.06)/.59)*.9;
        sparks.forEach(s=>{
          s.x+=s.vx*.5;s.y+=s.vy*.5;s.vy+=.18;s.life-=s.decay;
          if(s.life<=0||s.y>H){s.x=W*(.38+Math.random()*.24);s.y=H*.77;s.vx=(Math.random()-.5)*8;s.vy=-(Math.random()*6+2);s.life=1;}
          const col=s.hot?`rgba(255,${160+Math.random()*80|0},20,${s.life*sA*.9})`:`rgba(${180+Math.random()*60|0},${80+Math.random()*40|0},0,${s.life*sA*.7})`;
          c.beginPath();c.arc(s.x,s.y,s.r,0,Math.PI*2);c.fillStyle=col;c.fill();
        });
      }
      if(p>0.04){
        const smokeProgress=(p-.04)/.96;
        smokeP.forEach(s=>{
          if(smokeProgress<s.delay)return;
          const localP=Math.min(1,(smokeProgress-s.delay)/(1-s.delay));
          s.r=Math.min(s.maxR,s.r+(s.maxR-s.r)*.008);
          const cx2=s.x+s.vx*localP*180,cy2=s.y+s.vy*localP*220;
          for(let layer=3;layer>=0;layer--){
            const lr=s.r*(0.5+layer*.22);
            const lA=s.alpha*(1-layer*.18)*Math.min(1,localP*4)*Math.max(0,1-localP*.5);
            const grey=Math.min(255,s.grey+layer*18);
            const sg=c.createRadialGradient(cx2,cy2,0,cx2,cy2,lr);
            sg.addColorStop(0,`rgba(${grey},${grey-8},${grey-12},${lA*1.1})`);
            sg.addColorStop(.45,`rgba(${grey-15},${grey-22},${grey-28},${lA*.7})`);
            sg.addColorStop(.75,`rgba(${grey-30},${grey-38},${grey-44},${lA*.3})`);
            sg.addColorStop(1,'rgba(0,0,0,0)');
            c.fillStyle=sg;c.beginPath();c.arc(cx2,cy2,lr,0,Math.PI*2);c.fill();
          }
        });
      }
      if(p>0.05&&p<0.7){
        const fireA=Math.sin(Math.PI*(p-.05)/.65)*.4;
        const flicker=.8+.2*Math.sin(elapsed*.025);
        const fg=c.createRadialGradient(W*.5,H*.76,0,W*.5,H*.76,W*.22);
        fg.addColorStop(0,`rgba(255,200,30,${fireA*.55*flicker})`);
        fg.addColorStop(.35,`rgba(255,80,0,${fireA*.35*flicker})`);
        fg.addColorStop(.7,`rgba(180,20,0,${fireA*.12})`);
        fg.addColorStop(1,'rgba(0,0,0,0)');
        c.fillStyle=fg;c.fillRect(0,0,W,H);
      }
      c.globalAlpha=1;
      if(!called&&p>=.52){called=true;cb();}
      if(p<1.0)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  fire(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const go=()=>{
      p+=.01;c.clearRect(0,0,W,H);
      c.fillStyle=`rgba(0,0,0,${Math.min(.88,p*1.4)})`; c.fillRect(0,0,W,H);
      for(let x=0;x<W;x+=3){
        const h=(Math.sin(x*.017+p*3.5)*.5+.5)*(Math.sin(x*.034-p*2.5)*.5+.5)*Math.min(1,p*1.8)*H*.9;
        const gf=c.createLinearGradient(0,H,0,H-h);
        gf.addColorStop(0,'rgba(255,120,0,.95)');gf.addColorStop(.3,'rgba(220,50,0,.8)');
        gf.addColorStop(.7,'rgba(140,8,0,.35)');gf.addColorStop(1,'rgba(80,0,0,0)');
        c.fillStyle=gf;c.fillRect(x,H-h,3,h);
      }
      if(!called&&p>=.54){called=true;cb();}
      if(p<1.1)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  redblood(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const dr=Array.from({length:28},(_,i)=>({x:(i/28)*W+Math.sin(i*2.5)*20,spd:.5+rnd(.5),w:rnd(4)+2}));
    const go=()=>{
      p+=.009;c.clearRect(0,0,W,H);
      c.fillStyle=`rgba(0,0,0,${Math.min(.92,p*1.5)})`; c.fillRect(0,0,W,H);
      dr.forEach(d=>{
        const drip=Math.min(H,p*d.spd*H*2.2);
        const gr=c.createLinearGradient(0,0,0,drip);
        gr.addColorStop(0,'rgba(160,0,0,.95)');gr.addColorStop(.6,'rgba(120,0,0,.8)');gr.addColorStop(1,'rgba(80,0,0,.25)');
        c.fillStyle=gr;c.fillRect(d.x,0,d.w,drip);
        c.beginPath();c.ellipse(d.x+d.w/2,drip,d.w*1.6,d.w*1.8,0,0,Math.PI*2);
        c.fillStyle='rgba(140,0,0,.9)';c.fill();
      });
      if(!called&&p>=.5){called=true;cb();}
      if(p<1.1)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  smoke(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const ws=Array.from({length:18},()=>({x:rnd(W),y:rnd(H),r:rnd(60)+20,vx:rndpm(.3),vy:-(rnd(.4)+.1)}));
    const go=()=>{
      p+=.008;c.clearRect(0,0,W,H);
      c.fillStyle=`rgba(5,4,0,${Math.min(.96,p*1.35)})`; c.fillRect(0,0,W,H);
      ws.forEach(w=>{
        w.x+=w.vx;w.y+=w.vy;w.r+=.45;
        const wg=c.createRadialGradient(w.x,w.y,0,w.x,w.y,w.r);
        wg.addColorStop(0,`rgba(80,65,30,${Math.max(0,.07-p*.04)})`);wg.addColorStop(1,'transparent');
        c.fillStyle=wg;c.fillRect(0,0,W,H);
      });
      if(!called&&p>=.54){called=true;cb();}
      if(p<1.15)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  timeloop(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const go=()=>{
      p+=.009;c.fillStyle='rgba(0,0,6,.1)';c.fillRect(0,0,W,H);
      c.save();c.translate(W*.5,H*.5);
      const maxR=Math.sqrt(W*W+H*H)*.55;
      for(let r=maxR*(1-Math.min(1,p*1.8));r>4;r-=2.5){
        const a=r*.065+p*6;
        c.beginPath();c.arc(Math.cos(a)*r*.008,Math.sin(a)*r*.008,r,0,Math.PI*2);
        c.strokeStyle=`hsla(${220+r*.1},70%,60%,.016)`;c.lineWidth=1.2;c.stroke();
      }
      const wr=Math.max(0,(p-.1))*W*.45;
      const wg=c.createRadialGradient(0,0,0,0,0,wr);
      wg.addColorStop(0,'rgba(0,0,0,.98)');wg.addColorStop(.5,`rgba(30,80,200,${Math.min(.6,p*.8)})`);wg.addColorStop(1,'rgba(0,0,0,0)');
      c.fillStyle=wg;c.beginPath();c.arc(0,0,wr,0,Math.PI*2);c.fill();
      c.restore();
      if(!called&&p>=.52){called=true;cb();}
      if(p<1.15)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  chemical(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const bs=Array.from({length:20},()=>({x:W*.5+rndpm(100),y:H*.5+rndpm(80),r:0,maxR:rnd(28)+8,spd:rnd(.02)+.01}));
    const go=()=>{
      p+=.01;c.clearRect(0,0,W,H);
      const R=p*Math.sqrt(W*W+H*H)*.58;
      const cg=c.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,R);
      cg.addColorStop(0,'rgba(0,0,0,.97)');cg.addColorStop(.75,`rgba(0,${35*p|0},0,.88)`);
      cg.addColorStop(.88,`rgba(${55*p|0},${175*p|0},0,.5)`);cg.addColorStop(1,'rgba(0,0,0,0)');
      c.fillStyle=cg;c.fillRect(0,0,W,H);
      bs.forEach(b=>{
        b.r=Math.min(b.maxR,b.r+b.spd*R*.06);
        const bx=b.x+Math.cos(p*3+b.r)*R*.4,by=b.y+Math.sin(p*2+b.r)*R*.35;
        c.beginPath();c.arc(bx,by,b.r,0,Math.PI*2);
        c.strokeStyle=`rgba(60,220,0,${Math.min(.7,p*1.5)})`;c.lineWidth=1.5;c.stroke();
      });
      if(!called&&p>=.52){called=true;cb();}
      if(p<1.1)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  updown(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const go=()=>{
      p+=.01;c.clearRect(0,0,W,H);
      const slide=easeIO(Math.min(1,p*1.6))*H*.5;
      c.fillStyle=`rgba(5,0,15,${Math.min(.97,p*1.5)})`;
      c.fillRect(0,0,W,H*.5+slide);c.fillRect(0,H-(H*.5+slide),W,H*.5+slide);
      if(p>.15&&p<.7){
        const gapH=Math.max(0,(1-(p-.15)/.55)*28);
        const lg=c.createLinearGradient(0,H*.5-gapH,0,H*.5+gapH);
        lg.addColorStop(0,'rgba(5,0,15,0)');lg.addColorStop(.45,`rgba(180,50,255,${.55*(p-.15)/.55})`);
        lg.addColorStop(.55,`rgba(220,100,255,${.75*(p-.15)/.55})`);lg.addColorStop(1,'rgba(5,0,15,0)');
        c.fillStyle=lg;c.fillRect(0,H*.5-gapH,W,gapH*2);
      }
      if(!called&&p>=.52){called=true;cb();}
      if(p<1.1)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  warp(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const stars=Array.from({length:200},()=>({a:rnd(Math.PI*2),d:rnd(Math.sqrt(W*W+H*H)*.5)}));
    const go=()=>{
      p+=.009;c.fillStyle=`rgba(0,3,10,${.1+p*.08})`;c.fillRect(0,0,W,H);
      c.save();c.translate(W*.5,H*.5);
      stars.forEach(s=>{
        const sp=easeIO(Math.min(1,p*1.5));const len=sp*42+2;const d=s.d*(1-sp*.6);
        c.beginPath();c.moveTo(Math.cos(s.a)*(d-len),Math.sin(s.a)*(d-len));c.lineTo(Math.cos(s.a)*d,Math.sin(s.a)*d);
        c.strokeStyle=`rgba(150,210,255,${Math.min(1,p*2)*.8})`;c.lineWidth=Math.max(.5,sp*2);c.stroke();
      });
      const vg=c.createRadialGradient(0,0,0,0,0,W*.14+p*W*.07);
      vg.addColorStop(0,'rgba(0,0,0,.98)');vg.addColorStop(.7,`rgba(0,30,80,${p*.5})`);vg.addColorStop(1,'transparent');
      c.fillStyle=vg;c.beginPath();c.arc(0,0,W*.26,0,Math.PI*2);c.fill();c.restore();
      if(!called&&p>=.52){called=true;cb();}
      if(p<1.1)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  sandstorm(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const gr=Array.from({length:300},()=>({x:rnd(W),y:rnd(H),vx:3+rnd(5),vy:rndpm(.7),a:rnd(.4)+.1}));
    const go=()=>{
      p+=.009;c.fillStyle=`rgba(20,12,0,${Math.min(.94,p*1.35)})`;c.fillRect(0,0,W,H);
      for(let i=0;i<3;i++){
        const hg=c.createLinearGradient(-W*.5+p*W*3*(i+1)*.15,0,W*.5+p*W*3*(i+1)*.15,H);
        hg.addColorStop(0,'rgba(160,100,20,0)');hg.addColorStop(.4,`rgba(160,100,20,${(.11-i*.03)*Math.min(1,p*2)})`);hg.addColorStop(1,'rgba(160,100,20,0)');
        c.fillStyle=hg;c.fillRect(0,0,W,H);
      }
      gr.forEach(g=>{
        g.x+=g.vx*(1+p*2);g.y+=g.vy;
        if(g.x>W+5){g.x=-5;g.y=rnd(H);}
        c.beginPath();c.arc(g.x,g.y,.8,0,Math.PI*2);
        c.fillStyle='rgba(200,155,60,1)';c.globalAlpha=g.a*Math.min(1,p*2);c.fill();c.globalAlpha=1;
      });
      if(!called&&p>=.52){called=true;cb();}
      if(p<1.1)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  matrixrain(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const cols2=W/14|0;
    const drops=Array.from({length:cols2},()=>({y:rnd(H*.5),spd:3+rnd(5)}));
    const go=()=>{
      p+=.008;c.fillStyle=`rgba(0,${16*p|0},0,${Math.min(.95,p*1.4)})`;c.fillRect(0,0,W,H);
      c.font='13px monospace';
      drops.forEach((d,i)=>{
        d.y+=d.spd;const x=i*14;
        for(let j=0;j<22;j++){
          const y=d.y-j*14;if(y<-14||y>H+14)continue;
          const fa=j===0?.95:Math.max(0,.6-j*.026);
          c.fillStyle=j===0?`rgba(180,255,180,${fa})`:`rgba(0,${178-j*6},0,${fa*Math.min(1,p*2)})`;
          c.fillText(MAT_CHARS[Math.random()*MAT_CHARS.length|0],x,y);
        }
        if(d.y>H+200)d.y=0;
      });
      if(!called&&p>=.54){called=true;cb();}
      if(p<1.1)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  neon_rain(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const drops=Array.from({length:110},()=>({x:rnd(W),y:rnd(H*.3),vy:3+rnd(4),len:20+rnd(48),hue:rnd(1)<.6?25:200}));
    const go=()=>{
      p+=.009;c.fillStyle=`rgba(4,2,0,${Math.min(.96,p*1.35)})`;c.fillRect(0,0,W,H);
      drops.forEach(d=>{
        d.y+=d.vy;if(d.y>H+60){d.y=-60;d.x=rnd(W);}
        const dg=c.createLinearGradient(d.x,d.y-d.len,d.x,d.y);
        dg.addColorStop(0,'transparent');dg.addColorStop(1,`hsla(${d.hue},90%,60%,${.42*Math.min(1,p*2)})`);
        c.strokeStyle=dg;c.beginPath();c.moveTo(d.x,d.y-d.len);c.lineTo(d.x,d.y);c.lineWidth=.8;c.stroke();
      });
      if(!called&&p>=.52){called=true;cb();}
      if(p<1.1)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  dream(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const go=()=>{
      p+=.008;c.fillStyle=`rgba(3,3,6,${Math.min(.95,p*1.35)})`;c.fillRect(0,0,W,H);
      c.save();c.translate(W*.5,H*.5);
      for(let i=0;i<6;i++){
        const a=i/6*Math.PI*2+p*(.05+i*.007);
        const r=W*.3*Math.sin(p*Math.PI*.85)*Math.max(.1,1-i*.12);
        c.save();c.rotate(a);c.fillStyle=`rgba(70,70,180,${(.038-i*.005)*Math.min(1,p*2)})`;
        c.fillRect(-W*.5,-r*.1,W,r*.2);c.restore();
      }
      c.restore();
      if(!called&&p>=.52){called=true;cb();}
      if(p<1.1)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  rose(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const petals=Array.from({length:22},()=>({x:W*.5+rndpm(W*.4),y:-(rnd(H*.3)),r:rnd(14)+6,vy:1.5+rnd(2),vx:rndpm(.45),rot:rnd(Math.PI*2),rotV:rndpm(.018)}));
    const go=()=>{
      p+=.008;c.fillStyle=`rgba(1,1,0,${Math.min(.96,p*1.35)})`;c.fillRect(0,0,W,H);
      petals.forEach(pt=>{
        pt.y+=pt.vy;pt.x+=pt.vx;pt.rot+=pt.rotV;
        c.save();c.translate(pt.x,pt.y);c.rotate(pt.rot);
        c.beginPath();c.ellipse(0,0,pt.r*.6,pt.r,0,0,Math.PI*2);
        c.fillStyle=`rgba(128,10,10,${.58*Math.min(1,p*2)})`;c.fill();c.restore();
      });
      if(!called&&p>=.52){called=true;cb();}
      if(p<1.1)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  },

  defaultFade(cb) {
    const c=tCtx,W=tCanvas.width,H=tCanvas.height;let p=0,called=false;
    const go=()=>{
      p+=.015;c.fillStyle=`rgba(0,0,0,${Math.min(1,p*1.5)})`;c.fillRect(0,0,W,H);
      if(!called&&p>=.5){called=true;cb();}
      if(p<1)requestAnimationFrame(go);else finishTrans();
    };
    requestAnimationFrame(go);
  }
};

