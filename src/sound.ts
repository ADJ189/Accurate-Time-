import type { SoundDef, SoundNode } from './types';

export const SOUNDS: SoundDef[] = [
  { id: 'rain',   name: 'Rain',        icon: '🌧', desc: 'Gentle rainfall'   },
  { id: 'brown',  name: 'Brown Noise', icon: '📻', desc: 'Deep rumble'       },
  { id: 'forest', name: 'Forest',      icon: '🌲', desc: 'Birds & breeze'    },
  { id: 'cafe',   name: 'Café',        icon: '☕', desc: 'Ambient chatter'   },
  { id: 'ocean',  name: 'Ocean',       icon: '🌊', desc: 'Rolling waves'     },
  { id: 'fire',   name: 'Fireplace',   icon: '🔥', desc: 'Crackling flames'  },
];

export interface BinauralPreset {
  id: string; name: string; icon: string;
  desc: string; carrier: number; beat: number;
}
export const BINAURAL_PRESETS: BinauralPreset[] = [
  { id: 'gamma',  name: 'Deep Focus',  icon: '🧠', desc: 'Gamma 40Hz · Peak concentration',    carrier: 200, beat: 40 },
  { id: 'beta',   name: 'Alert',       icon: '⚡', desc: 'Beta 18Hz · Active thinking',         carrier: 200, beat: 18 },
  { id: 'alpha',  name: 'Calm Focus',  icon: '🌊', desc: 'Alpha 10Hz · Relaxed awareness',      carrier: 200, beat: 10 },
  { id: 'theta',  name: 'Flow State',  icon: '✨', desc: 'Theta 6Hz · Creative flow',           carrier: 200, beat: 6  },
  { id: 'delta',  name: 'Rest',        icon: '🌙', desc: 'Delta 2Hz · Deep rest & recovery',    carrier: 200, beat: 2  },
];

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let analyserData: Uint8Array<ArrayBuffer> | null = null;

// Per-track state
const trackNodes: Record<string, { nodes: AudioNode[]; gain: GainNode }> = {};
const trackVols: Record<string, number> = {};
SOUNDS.forEach(s => { trackVols[s.id] = 0.8; });

// Binaural state
let binauralNodes: { left: OscillatorNode; right: OscillatorNode; merger: ChannelMergerNode; gain: GainNode } | null = null;
export let binauralPresetId: string | null = null;

let masterVol  = 0.7;
let fadeMinutes = 0;
let fadeTimer  = 0;

let onTrackChange: (() => void) | null = null;
export function setTrackChangeHandler(fn: () => void) { onTrackChange = fn; }

function ensureCtx() {
  if (!ctx) {
    ctx = new AudioContext();

    // Insert analyser between tracks and master
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    analyserData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));

    masterGain = ctx.createGain();
    masterGain.gain.value = masterVol;

    // Chain: individual gains → analyser → masterGain → destination
    analyser.connect(masterGain);
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
}

// ── Analyser export (for audio-reactive canvas) ────────────────────────
export function getAudioLevel(): number {
  if (!analyser || !analyserData) return 0;
  analyser.getByteFrequencyData(analyserData);
  let sum = 0;
  for (let i = 0; i < analyserData.length; i++) sum += analyserData[i];
  return sum / (analyserData.length * 255); // 0..1
}

export function getBassLevel(): number {
  if (!analyser || !analyserData) return 0;
  analyser.getByteFrequencyData(analyserData);
  // Bass = first ~8 bins (0–200Hz approx)
  let sum = 0;
  const bins = Math.min(8, analyserData.length);
  for (let i = 0; i < bins; i++) sum += analyserData[i];
  return sum / (bins * 255);
}

const makeNoiseBuf = (size: number, fn: (d: Float32Array) => void): AudioBufferSourceNode => {
  const buf = ctx!.createBuffer(1, size, ctx!.sampleRate);
  fn(buf.getChannelData(0));
  const src = ctx!.createBufferSource();
  src.buffer = buf; src.loop = true;
  return src;
};

// ── Sound makers ──────────────────────────────────────────────────────
const MAKERS: Record<string, () => { out: AudioNode; nodes: AudioNode[] }> = {
  rain() {
    const src = makeNoiseBuf(ctx!.sampleRate * 2, d => {
      let l = 0;
      for (let i = 0; i < d.length; i++) { l = .99 * l + .01 * (Math.random() * 2 - 1); d[i] = l * 15; }
    });
    const f = ctx!.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 800; f.Q.value = .5;
    src.connect(f);
    return { out: f, nodes: [src] };
  },
  brown() {
    const src = makeNoiseBuf(ctx!.sampleRate * 4, d => {
      let l = 0;
      for (let i = 0; i < d.length; i++) { l = (l + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; }
    });
    return { out: src, nodes: [src] };
  },
  forest() {
    const src = makeNoiseBuf(ctx!.sampleRate * 2, d => {
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * .04;
    });
    const f = ctx!.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1500; f.Q.value = 2;
    const g = ctx!.createGain(); g.gain.value = .3;
    src.connect(f); f.connect(g);
    // Oscillators feed into a merger gain, not directly to analyser
    const oscGain = ctx!.createGain(); oscGain.gain.value = 1;
    const oscs: OscillatorNode[] = [];
    [880, 1320, 1760, 2200].forEach((fr, i) => {
      const o = ctx!.createOscillator(); const og = ctx!.createGain();
      o.type = 'sine'; o.frequency.value = fr; og.gain.value = .015 / (i + 1);
      o.connect(og); og.connect(oscGain);
      oscs.push(o); // do NOT start here — playTrack starts all nodes
    });
    // Merge noise + oscillators into single output
    const out = ctx!.createGain(); out.gain.value = 1;
    g.connect(out); oscGain.connect(out);
    return { out, nodes: [src, ...oscs] };
  },
  cafe() {
    const merger = ctx!.createGain(); merger.gain.value = 1;
    const nodes: AudioNode[] = [];
    for (let i = 0; i < 6; i++) {
      const src = makeNoiseBuf(ctx!.sampleRate * 2, d => { for (let j = 0; j < d.length; j++) d[j] = Math.random() * 2 - 1; });
      const f = ctx!.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 400 + i * 120; f.Q.value = 1.5;
      const g = ctx!.createGain(); g.gain.value = .012 / (i + 1);
      src.connect(f); f.connect(g); g.connect(merger);
      // Do NOT call src.start() here — playTrack will start all nodes uniformly
      nodes.push(src);
    }
    return { out: merger, nodes };
  },
  ocean() {
    const sr = ctx!.sampleRate;
    const src = makeNoiseBuf(sr * 4, d => {
      let l = 0; const per = sr * 4;
      for (let i = 0; i < d.length; i++) { l = .999 * l + .001 * (Math.random() * 2 - 1); d[i] = l * 8 * (Math.sin(i / per * Math.PI * 2) * .5 + .5); }
    });
    const f = ctx!.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600;
    src.connect(f);
    return { out: f, nodes: [src] };
  },
  fire() {
    const r = makeNoiseBuf(ctx!.sampleRate * 2, d => {
      let l = 0;
      for (let i = 0; i < d.length; i++) { l = .99 * l + .01 * (Math.random() * 2 - 1); d[i] = l * 12; }
    });
    const f1 = ctx!.createBiquadFilter(); f1.type = 'lowpass'; f1.frequency.value = 200;
    const f2 = ctx!.createBiquadFilter(); f2.type = 'peaking'; f2.frequency.value = 100; f2.gain.value = 8;
    r.connect(f1); f1.connect(f2);
    const cr = makeNoiseBuf(ctx!.sampleRate, d => {
      for (let i = 0; i < d.length; i++) { const x = Math.random(); d[i] = x > .998 ? (Math.random() * 2 - 1) * 4 : 0; }
    });
    const cg = ctx!.createGain(); cg.gain.value = .8; cr.connect(cg);
    const mg = ctx!.createGain(); mg.gain.value = 1;
    f2.connect(mg); cg.connect(mg);
    return { out: mg, nodes: [r, cr] };
  },
};

// ── Public API ────────────────────────────────────────────────────────
export function playTrack(id: string) {
  if (trackNodes[id]) return;
  ensureCtx();
  const made = MAKERS[id]();
  const g = ctx!.createGain(); g.gain.value = trackVols[id] ?? .8;
  // Route through analyser
  made.out.connect(g); g.connect(analyser!);
  made.nodes.forEach(n => {
    if ('start' in n && typeof (n as AudioScheduledSourceNode).start === 'function' && !(n as any)._started) {
      (n as AudioScheduledSourceNode).start(); (n as any)._started = true;
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
  t.nodes.forEach(n => { try { (n as AudioScheduledSourceNode).stop(); } catch {} try { n.disconnect(); } catch {} });
  try { t.gain.disconnect(); } catch {}
  delete trackNodes[id];
  onTrackChange?.();
}

export function toggleTrack(id: string) { trackNodes[id] ? stopTrack(id) : playTrack(id); }
export function isPlaying(id: string) { return !!trackNodes[id]; }

export function setTrackVolume(id: string, v: number) {
  trackVols[id] = v;
  if (trackNodes[id]) trackNodes[id].gain.gain.value = v;
}
export function getTrackVolume(id: string) { return trackVols[id] ?? .8; }
export function setMasterVolume(v: number) { masterVol = v; if (masterGain) masterGain.gain.value = v; }
export function getMasterVolume() { return masterVol; }
export function setFade(v: number) { fadeMinutes = v; }

// ── Spatial 3D Audio ──────────────────────────────────────────────────
let spatialEnabled = localStorage.getItem('sc_spatial') === '1';
const spatialPanners: Record<string, PannerNode> = {};
const spatialLFOs: Record<string, number> = {}; // per-track phase offset

export function isSpatialEnabled() { return spatialEnabled; }

export function setSpatial(v: boolean) {
  spatialEnabled = v;
  localStorage.setItem('sc_spatial', v ? '1' : '0');
  // Rebuild active tracks to apply/remove spatial routing
  const active = Object.keys(trackNodes);
  active.forEach(id => {
    const nodes = trackNodes[id];
    if (!nodes) return;
    if (v) {
      attachPanner(id, nodes.gain);
    } else {
      detachPanner(id, nodes.gain);
    }
  });
}

function attachPanner(id: string, gainNode: GainNode) {
  if (spatialPanners[id] || !ctx) return;
  const panner = ctx.createPanner();
  panner.panningModel = 'equalpower'; // cheaper, no HRTF overhead
  panner.setPosition(0, 0, -1);
  // Reroute: gainNode → panner → analyser
  try { gainNode.disconnect(analyser!); } catch {}
  gainNode.connect(panner);
  panner.connect(analyser!);
  spatialPanners[id] = panner;
  spatialLFOs[id] = Math.random() * Math.PI * 2; // random phase
}

function detachPanner(id: string, gainNode: GainNode) {
  const p = spatialPanners[id];
  if (!p) return;
  try { gainNode.disconnect(p); p.disconnect(); } catch {}
  gainNode.connect(analyser!);
  delete spatialPanners[id];
}

// Called from main render loop ~every frame to animate panner positions
export function tickSpatial(now: number) {
  if (!spatialEnabled) return;
  Object.keys(spatialPanners).forEach(id => {
    const panner = spatialPanners[id];
    if (!panner) return;
    // Different speeds per track for natural feel
    const speeds: Record<string, number> = {
      rain: 0.06, brown: 0.03, forest: 0.08, cafe: 0.14, ocean: 0.05, fire: 0.04,
    };
    const speed = speeds[id] ?? 0.07;
    const phase = now * speed + (spatialLFOs[id] ?? 0);
    // Pan x oscillates -3..+3 (metres in 3D space), y/z fixed
    panner.setPosition(Math.sin(phase) * 3, 0, -1);
  });
}

// ── Binaural Beats ────────────────────────────────────────────────────
export function playBinaural(presetId: string) {
  stopBinaural();
  ensureCtx();
  const preset = BINAURAL_PRESETS.find(p => p.id === presetId);
  if (!preset) return;

  // Two oscillators, hard-panned L/R
  const merger = ctx!.createChannelMerger(2);
  const gain = ctx!.createGain();
  gain.gain.value = 0.18; // binaural should be subtle

  const left  = ctx!.createOscillator();
  const right = ctx!.createOscillator();
  left.type  = right.type  = 'sine';
  left.frequency.value  = preset.carrier;
  right.frequency.value = preset.carrier + preset.beat;

  // Pan left → channel 0, right → channel 1
  const leftGain  = ctx!.createGain(); leftGain.gain.value  = 1;
  const rightGain = ctx!.createGain(); rightGain.gain.value = 1;

  left.connect(leftGain);   leftGain.connect(merger, 0, 0);
  right.connect(rightGain); rightGain.connect(merger, 0, 1);

  merger.connect(gain);
  gain.connect(masterGain!); // bypass analyser so it doesn't skew levels

  left.start(); right.start();
  binauralNodes = { left, right, merger, gain };
  binauralPresetId = presetId;
  onTrackChange?.();
}

export function stopBinaural() {
  if (!binauralNodes) return;
  try { binauralNodes.left.stop();  } catch {}
  try { binauralNodes.right.stop(); } catch {}
  try { binauralNodes.gain.disconnect(); binauralNodes.merger.disconnect(); } catch {}
  binauralNodes = null;
  binauralPresetId = null;
  onTrackChange?.();
}

export function toggleBinaural(presetId: string) {
  binauralPresetId === presetId ? stopBinaural() : playBinaural(presetId);
}

// ── Adaptive ambient audio ────────────────────────────────────────────
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
  const anyPlaying = SOUNDS.some(s => isPlaying(s.id));
  if (!anyPlaying) { playTrack('rain'); playTrack('fire'); }
}

function fadeAll() {
  if (!masterGain) return;
  const start = masterGain.gain.value; let t = 0;
  const step = setInterval(() => {
    t += .05; masterGain!.gain.value = Math.max(0, start * (1 - t));
    if (t >= 1) { SOUNDS.forEach(s => stopTrack(s.id)); clearInterval(step); }
  }, 100);
}

export function playChime() {
  ensureCtx();
  const ac = ctx!;
  ([[880, 0], [1100, 250]] as [number, number][]).forEach(([freq, delay]) => setTimeout(() => {
    const osc = ac.createOscillator(); const g = ac.createGain();
    osc.type = 'sine'; osc.frequency.value = freq; g.gain.value = 0.28;
    osc.connect(g); g.connect(ac.destination); osc.start();
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1.2);
    setTimeout(() => { try { osc.stop(); } catch {} }, 1300);
  }, delay));
}

// Legacy compat
export const currentId: string | null = null;
export function stop() { SOUNDS.forEach(s => stopTrack(s.id)); }
export function play(id: string) { playTrack(id); }
export function toggle(id: string) { toggleTrack(id); }
export function setVolume(v: number) { setMasterVolume(v); }
