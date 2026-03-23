import type { SoundDef, SoundNode } from './types';

export const SOUNDS: SoundDef[] = [
  { id: 'rain',   name: 'Rain',        icon: '🌧', desc: 'Gentle rainfall on a window'   },
  { id: 'brown',  name: 'Brown Noise', icon: '📻', desc: 'Deep, soothing rumble'           },
  { id: 'forest', name: 'Forest',      icon: '🌲', desc: 'Wind, leaves, distant birds'     },
  { id: 'cafe',   name: 'Café',        icon: '☕', desc: 'Warm murmur of a coffee shop'   },
  { id: 'ocean',  name: 'Ocean',       icon: '🌊', desc: 'Waves rolling onto shore'        },
  { id: 'fire',   name: 'Fireplace',   icon: '🔥', desc: 'Crackling wood fire'             },
];

export interface BinauralPreset {
  id: string; name: string; icon: string;
  desc: string; carrier: number; beat: number;
}
export const BINAURAL_PRESETS: BinauralPreset[] = [
  { id: 'gamma', name: 'Deep Focus',  icon: '🧠', desc: 'Gamma 40Hz · Peak concentration', carrier: 200, beat: 40 },
  { id: 'beta',  name: 'Alert',       icon: '⚡', desc: 'Beta 18Hz · Active thinking',      carrier: 200, beat: 18 },
  { id: 'alpha', name: 'Calm Focus',  icon: '🌊', desc: 'Alpha 10Hz · Relaxed awareness',   carrier: 200, beat: 10 },
  { id: 'theta', name: 'Flow State',  icon: '✨', desc: 'Theta 6Hz · Creative flow',        carrier: 200, beat: 6  },
  { id: 'delta', name: 'Rest',        icon: '🌙', desc: 'Delta 2Hz · Deep rest & recovery', carrier: 200, beat: 2  },
];

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let analyserData: Uint8Array<ArrayBuffer> | null = null;

const trackNodes: Record<string, { nodes: AudioNode[]; gain: GainNode }> = {};
const trackVols: Record<string, number> = {};
SOUNDS.forEach(s => { trackVols[s.id] = 0.8; });

let binauralNodes: { left: OscillatorNode; right: OscillatorNode; merger: ChannelMergerNode; gain: GainNode } | null = null;
export let binauralPresetId: string | null = null;

let masterVol   = 0.7;
let fadeMinutes = 0;
let fadeTimer   = 0;
let onTrackChange: (() => void) | null = null;
export function setTrackChangeHandler(fn: () => void) { onTrackChange = fn; }

function ensureCtx() {
  if (!ctx) {
    ctx = new AudioContext();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.85;
    analyserData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    masterGain = ctx.createGain();
    masterGain.gain.value = masterVol;
    analyser.connect(masterGain);
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
}

export function getAudioLevel(): number {
  if (!analyser || !analyserData) return 0;
  analyser.getByteFrequencyData(analyserData);
  let sum = 0;
  for (let i = 0; i < analyserData.length; i++) sum += analyserData[i]!;
  return sum / (analyserData.length * 255);
}

export function getBassLevel(): number {
  if (!analyser || !analyserData) return 0;
  analyser.getByteFrequencyData(analyserData);
  let sum = 0;
  const bins = Math.min(8, analyserData.length);
  for (let i = 0; i < bins; i++) sum += analyserData[i]!;
  return sum / (bins * 255);
}

// ── Noise buffer factory ──────────────────────────────────────────────
function makeNoiseBuf(seconds: number, channels: 1 | 2, fn: (ch: Float32Array, c: number) => void): AudioBufferSourceNode {
  const sr  = ctx!.sampleRate;
  const buf = ctx!.createBuffer(channels, sr * seconds, sr);
  for (let c = 0; c < channels; c++) fn(buf.getChannelData(c), c);
  const src = ctx!.createBufferSource();
  src.buffer = buf; src.loop = true;
  return src;
}

// ── RAIN — broadband white noise + gentle highpass + soft lowpass ─────
// Real rain is essentially white noise shaped between ~500Hz–10kHz.
// Two slight detuned layers give it depth without phasing artefacts.
function makeRain(): { out: AudioNode; nodes: AudioNode[] } {
  const sr  = ctx!.sampleRate;
  const src = makeNoiseBuf(4, 1, d => {
    // White noise — simple, correct
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.35;
  });

  // Highpass at 300Hz to cut rumble, lowpass at 8kHz to cut harshness
  const hp = ctx!.createBiquadFilter(); hp.type = 'highpass';  hp.frequency.value = 300;  hp.Q.value = 0.7;
  const lp = ctx!.createBiquadFilter(); lp.type = 'lowpass';   lp.frequency.value = 8000; lp.Q.value = 0.5;
  // Shelf to gently boost the 1–4kHz "patter" range
  const sh = ctx!.createBiquadFilter(); sh.type = 'peaking';   sh.frequency.value = 2000; sh.gain.value = 4; sh.Q.value = 1.2;

  src.connect(hp); hp.connect(lp); lp.connect(sh);

  // Second slightly different layer for stereo richness
  const src2 = makeNoiseBuf(4, 1, d => {
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.2;
  });
  const hp2 = ctx!.createBiquadFilter(); hp2.type = 'highpass'; hp2.frequency.value = 600; hp2.Q.value = 0.7;
  const lp2 = ctx!.createBiquadFilter(); lp2.type = 'lowpass';  lp2.frequency.value = 5000; lp2.Q.value = 0.5;
  src2.connect(hp2); hp2.connect(lp2);

  // Mix both layers
  const mix = ctx!.createGain(); mix.gain.value = 0.65;
  sh.connect(mix); lp2.connect(mix);

  return { out: mix, nodes: [src, src2] };
}

// ── BROWN NOISE — correct integration filter, safe amplitude ─────────
// Brown noise = integrate white noise. Each sample = prev + (white * k).
// The integration naturally rolls off at 6dB/oct above DC.
function makeBrown(): { out: AudioNode; nodes: AudioNode[] } {
  const src = makeNoiseBuf(8, 1, d => {
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      // Integration with leak to prevent DC drift
      last = (last + (Math.random() * 2 - 1) * 0.02) * 0.998;
      d[i] = last * 3.0; // 3.0 is safe — no clipping
    }
  });

  // Gentle lowpass to soften extreme highs
  const lp = ctx!.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1200; lp.Q.value = 0.5;
  // Slight bass boost for warmth
  const bass = ctx!.createBiquadFilter(); bass.type = 'lowshelf'; bass.frequency.value = 120; bass.gain.value = 3;

  src.connect(lp); lp.connect(bass);
  const out = ctx!.createGain(); out.gain.value = 0.9;
  bass.connect(out);
  return { out, nodes: [src] };
}

// ── FOREST — wind + rustle + stochastic bird chirps ──────────────────
// Wind = lowpass pink noise. Leaves = mid-range filtered noise with
// slow amplitude modulation. Birds = short sine bursts with random timing.
function makeForest(): { out: AudioNode; nodes: AudioNode[] } {
  const sr = ctx!.sampleRate;

  // Wind base: pink-ish noise (approximate pink via IIR)
  const wind = makeNoiseBuf(8, 1, d => {
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < d.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886*b0 + white*0.0555179; b1 = 0.99332*b1 + white*0.0750759;
      b2 = 0.96900*b2 + white*0.1538520; b3 = 0.86650*b3 + white*0.3104856;
      b4 = 0.55000*b4 + white*0.5329522; b5 = -0.7616*b5 - white*0.0168980;
      d[i] = (b0+b1+b2+b3+b4+b5+b6+white*0.5362) * 0.04;
      b6 = white * 0.115926;
    }
  });
  const windLp = ctx!.createBiquadFilter(); windLp.type = 'lowpass'; windLp.frequency.value = 800; windLp.Q.value = 0.6;
  wind.connect(windLp);

  // Leaf rustle: bandpass filtered noise with slow LFO on gain
  const rustle = makeNoiseBuf(4, 1, d => {
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.25;
  });
  const rustleBp = ctx!.createBiquadFilter(); rustleBp.type = 'bandpass'; rustleBp.frequency.value = 3500; rustleBp.Q.value = 2;
  const rustleGain = ctx!.createGain(); rustleGain.gain.value = 0.18;

  // Slow LFO on rustle amplitude (wind gust effect)
  const lfo = ctx!.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.15;
  const lfoGain = ctx!.createGain(); lfoGain.gain.value = 0.12;
  lfo.connect(lfoGain); lfoGain.connect(rustleGain.gain);

  rustle.connect(rustleBp); rustleBp.connect(rustleGain);

  // Mix
  const mix = ctx!.createGain(); mix.gain.value = 0.85;
  windLp.connect(mix); rustleGain.connect(mix);

  // Stochastic bird chirps — scheduled with random timing
  const nodes: AudioNode[] = [wind, rustle, lfo];
  const chirpGain = ctx!.createGain(); chirpGain.gain.value = 0.22;
  chirpGain.connect(analyser!);

  // Schedule recurring chirp bursts using recursive setTimeout
  let chirpActive = true;
  const scheduleChirp = () => {
    if (!chirpActive || !ctx) return;
    const delay = 3000 + Math.random() * 9000; // 3–12 seconds between birds
    setTimeout(() => {
      if (!chirpActive || !ctx || ctx.state === 'closed') return;
      // 2–5 chirp notes per bird
      const count = 2 + Math.floor(Math.random() * 4);
      const baseFreq = 2000 + Math.random() * 3000; // 2–5kHz
      for (let n = 0; n < count; n++) {
        const t = ctx.currentTime + n * (0.08 + Math.random() * 0.06);
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(baseFreq * (1 + n * 0.1), t);
        o.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, t + 0.04);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.6, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        o.connect(g); g.connect(chirpGain);
        o.start(t); o.stop(t + 0.07);
      }
      scheduleChirp();
    }, delay);
  };
  scheduleChirp();

  // Expose stop hook via a dummy AudioNode with custom cleanup
  const stopProxy = ctx!.createGain(); stopProxy.gain.value = 0;
  (stopProxy as any)._customStop = () => { chirpActive = false; };
  nodes.push(stopProxy);

  return { out: mix, nodes };
}

// ── CAFÉ — low rumble murmur + occasional distinct voices ─────────────
// Real café: broadband low-mid "chatter hum" + cutlery transients +
// background music undertone. Key: most energy is below 1kHz.
function makeCafe(): { out: AudioNode; nodes: AudioNode[] } {
  // Primary chatter: pink noise shaped to vocal range (200Hz–3kHz)
  const chatter = makeNoiseBuf(8, 1, d => {
    let b0=0,b1=0,b2=0,b3=0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886*b0 + w*0.0555; b1 = 0.99332*b1 + w*0.0751;
      b2 = 0.96900*b2 + w*0.1539; b3 = 0.86650*b3 + w*0.3105;
      d[i] = (b0+b1+b2+b3) * 0.09;
    }
  });
  const bp1 = ctx!.createBiquadFilter(); bp1.type = 'bandpass'; bp1.frequency.value = 600;  bp1.Q.value = 0.8;
  const bp2 = ctx!.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = 1800; bp2.Q.value = 1.2;

  chatter.connect(bp1); chatter.connect(bp2);

  // Low rumble: coffee machine, fridge hum
  const rumble = makeNoiseBuf(6, 1, d => {
    let l = 0;
    for (let i = 0; i < d.length; i++) { l = l * 0.997 + (Math.random() * 2 - 1) * 0.003; d[i] = l * 2.5; }
  });
  const rumbleLp = ctx!.createBiquadFilter(); rumbleLp.type = 'lowpass'; rumbleLp.frequency.value = 150; rumbleLp.Q.value = 0.8;
  rumble.connect(rumbleLp);

  // Slow amplitude variation — conversations ebb and flow
  const lfo = ctx!.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.08;
  const lfoG = ctx!.createGain(); lfoG.gain.value = 0.15; lfo.connect(lfoG);

  const chatG1 = ctx!.createGain(); chatG1.gain.value = 0.45; lfoG.connect(chatG1.gain);
  const chatG2 = ctx!.createGain(); chatG2.gain.value = 0.25;

  bp1.connect(chatG1); bp2.connect(chatG2);

  const rumbleG = ctx!.createGain(); rumbleG.gain.value = 0.35;
  rumbleLp.connect(rumbleG);

  const mix = ctx!.createGain(); mix.gain.value = 0.9;
  chatG1.connect(mix); chatG2.connect(mix); rumbleG.connect(mix);

  return { out: mix, nodes: [chatter, rumble, lfo] };
}

// ── OCEAN — multi-layer wave synthesis ───────────────────────────────
// Real ocean: 3 wave "rolls" at different periods (5s, 8s, 13s) layered,
// each with bandpass-filtered noise amplitude-modulated by a slow sine.
// Key: periods must be incommensurate (not simple ratios) to avoid robot effect.
function makeOcean(): { out: AudioNode; nodes: AudioNode[] } {
  const sr = ctx!.sampleRate;
  const nodes: AudioNode[] = [];
  const mix = ctx!.createGain(); mix.gain.value = 1.0;

  // Three wave layers, incommensurate periods
  const waveDefs = [
    { period: 5.7, freq: 400,  q: 1.2, amp: 0.55 },
    { period: 8.3, freq: 650,  q: 0.9, amp: 0.40 },
    { period: 13.1,freq: 300,  q: 1.5, amp: 0.30 },
  ];

  waveDefs.forEach(w => {
    // Noise source — different seed per layer via length
    const noise = makeNoiseBuf(Math.ceil(w.period * 2), 1, d => {
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
    });
    const bp = ctx!.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = w.freq; bp.Q.value = w.q;
    const ampG = ctx!.createGain(); ampG.gain.value = w.amp * 0.4;

    // Amplitude LFO — the wave "swell"
    const lfo = ctx!.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 1 / w.period;
    const lfoG = ctx!.createGain(); lfoG.gain.value = w.amp * 0.38;
    // Offset so wave starts from near-zero, rises, falls (not symmetric)
    lfo.connect(lfoG); lfoG.connect(ampG.gain);

    noise.connect(bp); bp.connect(ampG); ampG.connect(mix);
    nodes.push(noise, lfo);
  });

  // Low-frequency undertow
  const base = makeNoiseBuf(10, 1, d => {
    let l = 0;
    for (let i = 0; i < d.length; i++) { l = l * 0.9995 + (Math.random() * 2 - 1) * 0.0005; d[i] = l * 1.8; }
  });
  const baseLp = ctx!.createBiquadFilter(); baseLp.type = 'lowpass'; baseLp.frequency.value = 200; baseLp.Q.value = 0.7;
  const baseG = ctx!.createGain(); baseG.gain.value = 0.25;
  base.connect(baseLp); baseLp.connect(baseG); baseG.connect(mix);
  nodes.push(base);

  // Overall gentle lowpass — water has no harshness above 5kHz
  const finalLp = ctx!.createBiquadFilter(); finalLp.type = 'lowpass'; finalLp.frequency.value = 5000; finalLp.Q.value = 0.5;
  mix.connect(finalLp);

  const out = ctx!.createGain(); out.gain.value = 0.8;
  finalLp.connect(out);

  return { out, nodes };
}

// ── FIRE — layered crackle, pop, and bass hiss ────────────────────────
// Real fire: low-frequency rumble/hiss + random sharp crackle impulses
// at human-plausible rates (~1–4 per second), + occasional "pop" transient.
function makeFire(): { out: AudioNode; nodes: AudioNode[] } {
  const sr = ctx!.sampleRate;

  // Bass hiss: brown-ish noise shaped to 80–600Hz "roar"
  const hiss = makeNoiseBuf(4, 1, d => {
    let l = 0;
    for (let i = 0; i < d.length; i++) { l = l * 0.997 + (Math.random() * 2 - 1) * 0.003; d[i] = l * 2.2; }
  });
  const hissLp = ctx!.createBiquadFilter(); hissLp.type = 'lowpass';  hissLp.frequency.value = 600;  hissLp.Q.value = 0.8;
  const hissHp = ctx!.createBiquadFilter(); hissHp.type = 'highpass'; hissHp.frequency.value = 80;   hissHp.Q.value = 0.5;
  hiss.connect(hissHp); hissHp.connect(hissLp);

  // Mid hiss: white noise shaped to 600Hz–4kHz sizzle
  const sizzle = makeNoiseBuf(3, 1, d => {
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.15;
  });
  const sizzleBp = ctx!.createBiquadFilter(); sizzleBp.type = 'bandpass'; sizzleBp.frequency.value = 1800; sizzleBp.Q.value = 0.9;
  sizzle.connect(sizzleBp);

  const hissG   = ctx!.createGain(); hissG.gain.value   = 0.55; hissLp.connect(hissG);
  const sizzleG = ctx!.createGain(); sizzleG.gain.value = 0.25; sizzleBp.connect(sizzleG);

  const mix = ctx!.createGain(); mix.gain.value = 1.0;
  hissG.connect(mix); sizzleG.connect(mix);

  // Stochastic crackle bursts using AudioContext scheduling
  const crackleGain = ctx!.createGain(); crackleGain.gain.value = 0.7;
  crackleGain.connect(analyser!);

  let crackleActive = true;
  const scheduleCrackle = () => {
    if (!crackleActive || !ctx || ctx.state === 'closed') return;
    // 0.2–0.9 seconds between crackles (realistic wood fire)
    const delay = 200 + Math.random() * 700;
    setTimeout(() => {
      if (!crackleActive || !ctx || ctx.state === 'closed') return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      // Crackle = short burst of bandpass noise approximated by detuned sines
      o.type = 'sawtooth';
      o.frequency.value = 80 + Math.random() * 180;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.4 + Math.random() * 0.3, t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.025 + Math.random() * 0.04);
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500;
      o.connect(hp); hp.connect(g); g.connect(crackleGain);
      o.start(t); o.stop(t + 0.07);

      // Occasional "pop" — louder, lower frequency
      if (Math.random() < 0.15) {
        const pt = ctx.currentTime + 0.01;
        const po = ctx.createOscillator(); const pg = ctx.createGain();
        po.type = 'sine'; po.frequency.value = 60 + Math.random() * 80;
        pg.gain.setValueAtTime(0, pt);
        pg.gain.linearRampToValueAtTime(0.6, pt + 0.005);
        pg.gain.exponentialRampToValueAtTime(0.001, pt + 0.12);
        po.connect(pg); pg.connect(crackleGain);
        po.start(pt); po.stop(pt + 0.15);
      }

      scheduleCrackle();
    }, delay);
  };
  scheduleCrackle();

  const stopProxy = ctx!.createGain(); stopProxy.gain.value = 0;
  (stopProxy as any)._customStop = () => { crackleActive = false; };

  return { out: mix, nodes: [hiss, sizzle, stopProxy] };
}

// ── MAKERS dispatch ───────────────────────────────────────────────────
const MAKERS: Record<string, () => { out: AudioNode; nodes: AudioNode[] }> = {
  rain:   makeRain,
  brown:  makeBrown,
  forest: makeForest,
  cafe:   makeCafe,
  ocean:  makeOcean,
  fire:   makeFire,
};

// ── Public API ────────────────────────────────────────────────────────
export function playTrack(id: string) {
  if (trackNodes[id]) return;
  ensureCtx();
  const made = MAKERS[id]?.();
  if (!made) return;
  const g = ctx!.createGain(); g.gain.value = trackVols[id] ?? 0.8;
  made.out.connect(g); g.connect(analyser!);
  made.nodes.forEach(n => {
    if ((n as any)._customStop) return; // skip custom stop proxies
    if ('start' in n && typeof (n as AudioScheduledSourceNode).start === 'function' && !(n as any)._started) {
      try { (n as AudioScheduledSourceNode).start(); (n as any)._started = true; } catch {}
    }
  });
  trackNodes[id] = { nodes: made.nodes, gain: g };
  if (spatialEnabled) attachPanner(id, g);
  onTrackChange?.();
  if (fadeMinutes > 0) { clearTimeout(fadeTimer); fadeTimer = window.setTimeout(fadeAll, fadeMinutes * 60_000); }
}

export function stopTrack(id: string) {
  if (!trackNodes[id]) return;
  const t = trackNodes[id];
  detachPanner(id, t.gain);
  t.nodes.forEach(n => {
    // Call custom cleanup hook if present (chirp/crackle schedulers)
    if ((n as any)._customStop) { (n as any)._customStop(); return; }
    try { (n as AudioScheduledSourceNode).stop(); } catch {}
    try { n.disconnect(); } catch {}
  });
  try { t.gain.disconnect(); } catch {}
  delete trackNodes[id];
  onTrackChange?.();
}

export function toggleTrack(id: string) { trackNodes[id] ? stopTrack(id) : playTrack(id); }
export function isPlaying(id: string)   { return !!trackNodes[id]; }
export function setTrackVolume(id: string, v: number) { trackVols[id] = v; if (trackNodes[id]) trackNodes[id].gain.gain.value = v; }
export function getTrackVolume(id: string) { return trackVols[id] ?? 0.8; }
export function setMasterVolume(v: number) { masterVol = v; if (masterGain) masterGain.gain.value = v; }
export function getMasterVolume() { return masterVol; }
export function setFade(v: number) { fadeMinutes = v; }

// ── Spatial 3D Audio ──────────────────────────────────────────────────
let spatialEnabled = localStorage.getItem('sc_spatial') === '1';
const spatialPanners: Record<string, PannerNode> = {};
const spatialLFOs:    Record<string, number>     = {};

export function isSpatialEnabled() { return spatialEnabled; }

export function setSpatial(v: boolean) {
  spatialEnabled = v;
  localStorage.setItem('sc_spatial', v ? '1' : '0');
  Object.keys(trackNodes).forEach(id => {
    const n = trackNodes[id];
    if (!n) return;
    v ? attachPanner(id, n.gain) : detachPanner(id, n.gain);
  });
}

function attachPanner(id: string, gainNode: GainNode) {
  if (spatialPanners[id] || !ctx) return;
  const panner = ctx.createPanner();
  panner.panningModel = 'equalpower';
  panner.setPosition(0, 0, -1);
  try { gainNode.disconnect(analyser!); } catch {}
  gainNode.connect(panner);
  panner.connect(analyser!);
  spatialPanners[id] = panner;
  spatialLFOs[id]    = Math.random() * Math.PI * 2;
}

function detachPanner(id: string, gainNode: GainNode) {
  const p = spatialPanners[id];
  if (!p) return;
  try { gainNode.disconnect(p); p.disconnect(); } catch {}
  gainNode.connect(analyser!);
  delete spatialPanners[id];
}

export function tickSpatial(now: number) {
  if (!spatialEnabled) return;
  const speeds: Record<string, number> = { rain: 0.06, brown: 0.03, forest: 0.08, cafe: 0.14, ocean: 0.05, fire: 0.04 };
  Object.keys(spatialPanners).forEach(id => {
    const panner = spatialPanners[id];
    if (!panner) return;
    const phase = now * (speeds[id] ?? 0.07) + (spatialLFOs[id] ?? 0);
    panner.setPosition(Math.sin(phase) * 3, 0, -1);
  });
}

// ── Binaural Beats ────────────────────────────────────────────────────
export function playBinaural(presetId: string) {
  stopBinaural();
  ensureCtx();
  const preset = BINAURAL_PRESETS.find(p => p.id === presetId);
  if (!preset) return;

  const merger = ctx!.createChannelMerger(2);
  const gain   = ctx!.createGain(); gain.gain.value = 0.15;
  const left   = ctx!.createOscillator();
  const right  = ctx!.createOscillator();
  left.type = right.type = 'sine';
  left.frequency.value  = preset.carrier;
  right.frequency.value = preset.carrier + preset.beat;

  const lg = ctx!.createGain(); lg.gain.value = 1;
  const rg = ctx!.createGain(); rg.gain.value = 1;
  left.connect(lg);  lg.connect(merger, 0, 0);
  right.connect(rg); rg.connect(merger, 0, 1);
  merger.connect(gain);
  gain.connect(masterGain!);

  left.start(); right.start();
  binauralNodes    = { left, right, merger, gain };
  binauralPresetId = presetId;
  onTrackChange?.();
}

export function stopBinaural() {
  if (!binauralNodes) return;
  try { binauralNodes.left.stop();  } catch {}
  try { binauralNodes.right.stop(); } catch {}
  try { binauralNodes.gain.disconnect(); binauralNodes.merger.disconnect(); } catch {}
  binauralNodes    = null;
  binauralPresetId = null;
  onTrackChange?.();
}

export function toggleBinaural(presetId: string) {
  binauralPresetId === presetId ? stopBinaural() : playBinaural(presetId);
}

// ── Adaptive audio ────────────────────────────────────────────────────
let adaptiveDuckTimer = 0;
export function adaptOnWorkStart() {
  if (!masterGain) return;
  const orig = masterGain.gain.value;
  masterGain.gain.value = orig * 0.78;
  clearTimeout(adaptiveDuckTimer);
  adaptiveDuckTimer = window.setTimeout(() => { if (masterGain) masterGain.gain.value = orig; }, 8000);
}
export function adaptOnWorkNearEnd() {
  if (trackNodes['fire']) {
    const cur = trackNodes['fire'].gain.gain.value;
    trackNodes['fire'].gain.gain.value = Math.min(1, cur * 1.18);
  }
}
export function adaptOnBreak() {
  clearTimeout(adaptiveDuckTimer);
  if (masterGain) masterGain.gain.value = masterVol;
  if (trackNodes['fire']) trackNodes['fire'].gain.gain.value = trackVols['fire'] ?? 0.8;
}

export function autoStartCommonRoom() {
  if (!SOUNDS.some(s => isPlaying(s.id))) { playTrack('rain'); playTrack('fire'); }
}

function fadeAll() {
  if (!masterGain) return;
  const start = masterGain.gain.value; let t = 0;
  const step = setInterval(() => {
    t += 0.05; masterGain!.gain.value = Math.max(0, start * (1 - t));
    if (t >= 1) { SOUNDS.forEach(s => stopTrack(s.id)); clearInterval(step); }
  }, 100);
}

export function playChime() {
  ensureCtx();
  const ac = ctx!;
  ([[523.25, 0], [659.25, 180], [783.99, 340]] as [number, number][]).forEach(([freq, delay]) => {
    setTimeout(() => {
      const osc = ac.createOscillator(); const g = ac.createGain();
      osc.type = 'sine'; osc.frequency.value = freq; g.gain.value = 0.22;
      osc.connect(g); g.connect(ac.destination); osc.start();
      g.gain.setValueAtTime(0.22, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1.8);
      setTimeout(() => { try { osc.stop(); } catch {} }, 2000);
    }, delay);
  });
}

// Legacy compat
export const currentId: string | null = null;
export function stop()               { SOUNDS.forEach(s => stopTrack(s.id)); }
export function play(id: string)     { playTrack(id); }
export function toggle(id: string)   { toggleTrack(id); }
export function setVolume(v: number) { setMasterVolume(v); }
