// ── Sound UI ──────────────────────────────────────────────────────────
import * as Sound from '../sound';
import * as APIs  from '../apis';
import { $, openModal } from './modals';

// ── Sound Presets ─────────────────────────────────────────────────────
interface SoundPreset { name: string; tracks: Record<string, number>; master: number; }
const PRESETS_KEY = 'sc_sound_presets';

export function getSoundPresets(): SoundPreset[] {
  try { return JSON.parse(localStorage.getItem(PRESETS_KEY) || '[]'); } catch { return []; }
}

export function saveSoundPreset(name: string) {
  const presets = getSoundPresets();
  const tracks: Record<string, number> = {};
  Sound.SOUNDS.forEach(s => { tracks[s.id] = Sound.getTrackVolume(s.id); });
  const preset: SoundPreset = { name, tracks, master: Sound.getMasterVolume() };
  const idx = presets.findIndex(p => p.name === name);
  if (idx >= 0) presets[idx] = preset; else presets.push(preset);
  if (presets.length > 5) presets.shift();
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

export function loadSoundPreset(preset: SoundPreset) {
  Sound.setMasterVolume(preset.master);
  Sound.SOUNDS.forEach(s => {
    const vol = preset.tracks[s.id];
    if (vol !== undefined) Sound.setTrackVolume(s.id, vol);
  });
  buildSoundUI();
}

// ── Track row builder ─────────────────────────────────────────────────
function makeSoundTrack(
  id: string, icon: string, name: string, desc: string,
  active: boolean, vol: number, isBinaural = false,
): HTMLDivElement {
  const track = document.createElement('div');
  track.className = ['sound-track', isBinaural ? 'binaural-track' : '', active ? 'active' : ''].filter(Boolean).join(' ');

  const iconEl = document.createElement('div'); iconEl.className = 'sound-track-icon';
  iconEl.textContent = icon;

  const info = document.createElement('div'); info.className = 'sound-track-info';
  const nm = document.createElement('div'); nm.className = 'sound-track-name'; nm.textContent = name;
  const ds = document.createElement('div'); ds.className = 'sound-track-desc'; ds.textContent = desc;
  info.append(nm, ds);

  const toggle = document.createElement('button');
  toggle.className = 'track-toggle' + (active ? ' on' : '');
  toggle.dataset.id = id;
  toggle.title = active ? 'Stop' : 'Play';

  if (!isBinaural) {
    const volWrap = document.createElement('div'); volWrap.className = 'sound-track-vol';
    const slider = document.createElement('input') as HTMLInputElement;
    slider.type = 'range'; slider.className = 'track-vol-slider';
    slider.min = '0'; slider.max = '200'; slider.value = String(vol);
    slider.dataset.id = id;
    const pct = document.createElement('span'); pct.className = 'sound-vol-pct';
    pct.id = 'tvp_' + id; pct.textContent = vol + '%';
    slider.addEventListener('input', e => {
      const p = +(e.target as HTMLInputElement).value;
      Sound.setTrackVolume(id, p / 100);
      pct.textContent = p + '%';
      pct.style.color = p > 100 ? 'var(--clr-accent)' : '';
    });
    volWrap.append(slider, pct);
    track.append(iconEl, info, volWrap, toggle);
    toggle.addEventListener('click', () => Sound.toggleTrack(id));
  } else {
    track.append(iconEl, info, toggle);
    toggle.addEventListener('click', () => Sound.toggleBinaural(id));
  }

  return track;
}

export function buildSoundUI() {
  const container = $('soundGrid'); container.innerHTML = '';

  Sound.SOUNDS.forEach(s => {
    const vol = Math.round(Sound.getTrackVolume(s.id) * 100);
    container.appendChild(makeSoundTrack(s.id, s.icon, s.name, s.desc ?? '', Sound.isPlaying(s.id), vol));
  });

  // Binaural section
  const binHeader = document.createElement('div'); binHeader.className = 'sound-section-header';
  const binTitle = document.createElement('span'); binTitle.className = 'sound-section-title'; binTitle.textContent = '🧠 Binaural Beats';
  const binNote  = document.createElement('span'); binNote.className  = 'sound-section-note';  binNote.textContent  = 'Requires headphones';
  binHeader.append(binTitle, binNote);
  container.appendChild(binHeader);

  Sound.BINAURAL_PRESETS.forEach(p => {
    container.appendChild(makeSoundTrack(p.id, p.icon, p.name, p.desc, Sound.binauralPresetId === p.id, 100, true));
  });

  // Presets section
  const presetsSection = document.createElement('div'); presetsSection.className = 'sound-presets';
  const saveChip = document.createElement('button');
  saveChip.className = 'preset-chip save-btn'; saveChip.textContent = '+ Save Mix';
  saveChip.addEventListener('click', () => {
    const name = prompt('Name this preset (e.g. "Late Night"):');
    if (!name?.trim()) return;
    saveSoundPreset(name.trim());
    buildSoundUI();
    showSoundToast(`Saved "${name.trim()}" mix`);
  });
  presetsSection.appendChild(saveChip);

  getSoundPresets().forEach(p => {
    const chip = document.createElement('button');
    chip.className = 'preset-chip'; chip.textContent = p.name;
    chip.title = 'Click to load, right-click to delete';
    chip.addEventListener('click', () => { loadSoundPreset(p); showSoundToast(`Loaded "${p.name}"`); });
    chip.addEventListener('contextmenu', e => {
      e.preventDefault();
      const updated = getSoundPresets().filter(pr => pr.name !== p.name);
      localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
      buildSoundUI();
    });
    presetsSection.appendChild(chip);
  });
  container.appendChild(presetsSection);
}

// Toast callback — set by main.ts
let _toast: (msg: string) => void = () => {};
export function setSoundToast(fn: (msg: string) => void) { _toast = fn; }
function showSoundToast(msg: string) { _toast(msg); }

export function initSoundUI(toast: (msg: string) => void) {
  setSoundToast(toast);

  // Master volume slider
  const volSlider = $<HTMLInputElement>('volSlider');
  const volLabel  = $('volLabel');
  if (volSlider) {
    volSlider.value = String(Math.round(Sound.getMasterVolume() * 100));
    volSlider.style.setProperty('--boost-pct', '50%');
    volSlider.addEventListener('input', e => {
      const pct = +(e.target as HTMLInputElement).value;
      Sound.setMasterVolume(pct / 100);
      if (volLabel) {
        volLabel.textContent = pct + '%';
        (volLabel as HTMLElement).style.color = pct > 100 ? 'var(--clr-accent)' : '';
        (volLabel as HTMLElement).title = pct > 100 ? 'Boosted — compressor prevents clipping' : '';
      }
    });
  }
  if (volLabel) volLabel.textContent = Math.round(Sound.getMasterVolume() * 100) + '%';

  // Fade slider
  const fadeSlider = $<HTMLInputElement>('fadeSlider');
  if (fadeSlider) {
    fadeSlider.addEventListener('input', e => {
      const v = +(e.target as HTMLInputElement).value;
      Sound.setFade(v);
      const fl = $('fadeLabel');
      if (fl) fl.textContent = v === 0 ? 'Off' : `${v}m`;
    });
  }

  // MediaSession integration
  Sound.setTrackChangeHandler(() => {
    buildSoundUI();
    const playing = Sound.SOUNDS.filter(s => Sound.isPlaying(s.id)).map(s => s.name);
    if (playing.length > 0) {
      APIs.setupMediaSession(
        playing.join(' + '),
        () => playing.forEach(n => { const s = Sound.SOUNDS.find(x => x.name === n); if (s) Sound.playTrack(s.id); }),
        () => Sound.SOUNDS.forEach(s => { if (Sound.isPlaying(s.id)) Sound.stopTrack(s.id); }),
        () => Sound.SOUNDS.forEach(s => Sound.stopTrack(s.id)),
      );
      APIs.updateMediaState('playing');
    } else {
      APIs.clearMediaSession();
    }
  });
}

export function openSoundPanel() {
  buildSoundUI();
  openModal('soundOverlay');
}
