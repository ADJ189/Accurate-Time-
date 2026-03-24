<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // ── All easter egg commands ───────────────────────────────────────────
  interface Command {
    id: string;
    label: string;
    icon: string;
    desc: string;
    keywords: string[];
    action: () => void;
  }

  // Injected from outside via props
  export let onAction: (keyword: string) => void = () => {};
  export let onRandomTheme: () => void = () => {};

  const COMMANDS: Command[] = [
    // Themes — TV
    { id: 'breakingbad',   label: 'Breaking Bad',        icon: '⚗️',  desc: 'You\'re goddamn right.',           keywords: ['heisenberg', 'breakingbad'],   action: () => onAction('heisenberg') },
    { id: 'supernatural',  label: 'Supernatural',        icon: '🔥',  desc: 'The Road So Far…',                 keywords: ['winchester', 'supernatural'],  action: () => onAction('winchester') },
    { id: 'mentalist',     label: 'The Mentalist',       icon: '🔴',  desc: 'He\'s been here.',                 keywords: ['redjohn', 'mentalist'],        action: () => onAction('redjohn') },
    { id: 'sopranos',      label: 'The Sopranos',        icon: '🥃',  desc: 'Bada bing.',                       keywords: ['bada bing', 'sopranos'],       action: () => onAction('bada bing') },
    { id: 'dark',          label: 'Dark',                icon: '⏳',  desc: 'Sic Mundus Creatus Est.',          keywords: ['winden', 'dark'],              action: () => onAction('winden') },
    { id: 'severance',     label: 'Severance',           icon: '🏢',  desc: 'We hope your time here is agreeable.', keywords: ['fncs', 'severance'],      action: () => onAction('fncs') },
    { id: 'mrrobot',       label: 'Mr. Robot',           icon: '💻',  desc: 'Hello, friend.',                   keywords: ['mrrobot', 'fsociety'],        action: () => onAction('mrrobot') },
    { id: 'strangerthings',label: 'Stranger Things',     icon: '🔦',  desc: 'Should I stay or should I go.',    keywords: ['strangerthings'],              action: () => onAction('strangerthings') },
    { id: 'thebear',       label: 'The Bear',            icon: '🍳',  desc: 'Yes, chef!',                       keywords: ['thebear'],                     action: () => onAction('thebear') },
    // Themes — Movies
    { id: 'matrix',        label: 'The Matrix',          icon: '💊',  desc: 'Wake up, Neo…',                    keywords: ['matrix'],                      action: () => onAction('matrix') },
    { id: 'inception',     label: 'Inception',           icon: '🌀',  desc: 'You\'re waiting for a train…',     keywords: ['inception'],                   action: () => onAction('inception') },
    { id: 'interstellar',  label: 'Interstellar',        icon: '🌌',  desc: 'Do not go gentle.',                keywords: ['interstellar'],                action: () => onAction('interstellar') },
    { id: 'oppenheimer',   label: 'Oppenheimer',         icon: '☢️',  desc: 'Now I am become Death.',           keywords: ['oppenheimer'],                 action: () => onAction('oppenheimer') },
    { id: 'dune',          label: 'Dune',                icon: '🏜️', desc: 'The spice must flow.',              keywords: ['spice', 'dune'],               action: () => onAction('spice') },
    { id: 'tenet',         label: 'Tenet',               icon: '⏪',  desc: 'Don\'t try to understand it.',     keywords: ['tenet', 'dont try'],           action: () => onAction('tenet') },
    { id: 'godfather',     label: 'The Godfather',       icon: '🌹',  desc: 'Leave the gun. Take the cannoli.', keywords: ['godfather'],                   action: () => onAction('godfather') },
    { id: 'cyberpunk',     label: 'Cyberpunk 2077',      icon: '🌆',  desc: 'Wake up, Samurai.',                keywords: ['nightcity', 'samurai'],        action: () => onAction('nightcity') },
    { id: 'hal9000',       label: '2001: HAL 9000',      icon: '🔴',  desc: 'I\'m sorry, Dave.',                keywords: ['hal', 'daisy'],                action: () => onAction('hal') },
    { id: 'dragonfire',    label: 'House of the Dragon', icon: '🐉',  desc: 'Dracarys.',                        keywords: ['dracarys', 'targaryen'],       action: () => onAction('dracarys') },
    { id: 'moonknight',    label: 'Moon Knight',         icon: '🌙',  desc: 'I am the Fist of Khonshu.',        keywords: ['moonknight', 'khonshu'],       action: () => onAction('moonknight') },
    // Anime
    { id: 'onepiece',      label: 'One Piece',           icon: '🏴‍☠️', desc: 'King of the Pirates!',           keywords: ['luffy', 'onepiece', 'gomu gomu'], action: () => onAction('luffy') },
    { id: 'attackontitan', label: 'Attack on Titan',     icon: '⚔️',  desc: 'Dedicate your heart!',             keywords: ['dedicate', 'eren'],            action: () => onAction('dedicate') },
    { id: 'deathnote',     label: 'Death Note',          icon: '📓',  desc: 'I am justice.',                    keywords: ['lightyagami', 'kira'],         action: () => onAction('lightyagami') },
    // Special effects
    { id: 'konami',        label: '8-BIT Mode',          icon: '👾',  desc: 'Pixelated font, CGA colours.',     keywords: ['8bit', 'konami'],              action: () => { onAction('_konami'); } },
    { id: 'daisy',         label: 'HAL sings Daisy',     icon: '🎵',  desc: 'HAL 9000\'s farewell song.',       keywords: ['daisy', 'hal song'],           action: () => onAction('daisy') },
    { id: 'random',        label: 'Random Theme',        icon: '🎲',  desc: 'Shuffle to a random theme.',       keywords: ['random', 'shuffle'],           action: () => onRandomTheme() },
    { id: 'potato',        label: 'Potato Chip',         icon: '🥔',  desc: 'Just as planned.',                 keywords: ['potato chip', 'potato'],       action: () => onAction('potato chip') },
  ];

  let open = false;
  let query = '';
  let selectedIdx = 0;
  let inputEl: HTMLInputElement;

  $: filtered = query.trim() === ''
    ? COMMANDS
    : COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.desc.toLowerCase().includes(query.toLowerCase()) ||
        c.keywords.some(k => k.includes(query.toLowerCase()))
      );

  $: selectedIdx = 0; // reset selection on query change — reactive

  function openPalette() {
    open = true;
    query = '';
    selectedIdx = 0;
    // Focus input next tick
    setTimeout(() => inputEl?.focus(), 30);
  }

  function closePalette() {
    open = false;
    query = '';
  }

  function runCommand(cmd: Command) {
    closePalette();
    cmd.action();
  }

  function onKeydown(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape')     { e.preventDefault(); closePalette(); return; }
    if (e.key === 'ArrowDown')  { e.preventDefault(); selectedIdx = Math.min(selectedIdx + 1, filtered.length - 1); return; }
    if (e.key === 'ArrowUp')    { e.preventDefault(); selectedIdx = Math.max(selectedIdx - 1, 0); return; }
    if (e.key === 'Enter' && filtered[selectedIdx]) {
      e.preventDefault();
      runCommand(filtered[selectedIdx]!);
    }
  }

  // Global Cmd+K / Ctrl+K listener
  function onGlobalKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      open ? closePalette() : openPalette();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', onGlobalKey);
  });
  onDestroy(() => {
    window.removeEventListener('keydown', onGlobalKey);
  });
</script>

{#if open}
  <!-- Backdrop -->
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="cp-backdrop" on:click={closePalette}></div>

  <div class="cp-panel" role="dialog" aria-label="Command palette" tabindex="-1" on:keydown={onKeydown}>
    <!-- Search input -->
    <div class="cp-search">
      <span class="cp-search-icon">⌕</span>
      <input
        bind:this={inputEl}
        bind:value={query}
        class="cp-input"
        placeholder="Search easter eggs & themes…"
        autocomplete="off"
        spellcheck="false"
      />
      <button class="cp-esc" on:click={closePalette}>Esc</button>
    </div>

    <!-- Results -->
    <div class="cp-results">
      {#if filtered.length === 0}
        <div class="cp-empty">No commands match "{query}"</div>
      {:else}
        {#each filtered as cmd, i}
          <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
          <div
            class="cp-item"
            class:cp-item--selected={i === selectedIdx}
            on:click={() => runCommand(cmd)}
            on:mouseenter={() => selectedIdx = i}
          >
            <span class="cp-item-icon">{cmd.icon}</span>
            <span class="cp-item-body">
              <span class="cp-item-label">{cmd.label}</span>
              <span class="cp-item-desc">{cmd.desc}</span>
            </span>
            <span class="cp-item-hint">
              {cmd.keywords[0]}
            </span>
          </div>
        {/each}
      {/if}
    </div>

    <!-- Footer -->
    <div class="cp-footer">
      <span>↑↓ navigate</span>
      <span>↵ run</span>
      <span>⌘K toggle</span>
    </div>
  </div>
{/if}

<style>
  .cp-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9800;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
    animation: cpFadeIn 0.12s ease;
  }

  .cp-panel {
    position: fixed;
    top: 18vh;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9900;
    width: min(580px, 92vw);
    background: rgba(8, 6, 22, 0.97);
    border: 1px solid var(--clr-accent, #6ee7b7);
    border-opacity: 0.25;
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
      0 32px 80px rgba(0, 0, 0, 0.7),
      0 0 0 1px rgba(255, 255, 255, 0.04),
      0 0 60px color-mix(in srgb, var(--clr-accent, #6ee7b7) 12%, transparent);
    animation: cpSlideIn 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
    font-family: var(--font-main, 'Inter', system-ui, sans-serif);
  }

  .cp-search {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  }

  .cp-search-icon {
    font-size: 1.1rem;
    opacity: 0.4;
    color: var(--clr-accent, #6ee7b7);
    flex-shrink: 0;
  }

  .cp-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--clr-text, #e0f2fe);
    font-size: 0.95rem;
    font-family: inherit;
    caret-color: var(--clr-accent, #6ee7b7);
  }

  .cp-input::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  .cp-esc {
    font-size: 0.65rem;
    padding: 2px 7px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    flex-shrink: 0;
    font-family: inherit;
  }

  .cp-results {
    max-height: 380px;
    overflow-y: auto;
    padding: 6px 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }

  .cp-empty {
    padding: 24px;
    text-align: center;
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.85rem;
  }

  .cp-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    cursor: pointer;
    transition: background 0.08s;
  }

  .cp-item--selected {
    background: rgba(255, 255, 255, 0.06);
  }

  .cp-item-icon {
    font-size: 1.1rem;
    width: 28px;
    text-align: center;
    flex-shrink: 0;
  }

  .cp-item-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .cp-item-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--clr-text, #e0f2fe);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cp-item-desc {
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.35);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cp-item-hint {
    font-size: 0.65rem;
    font-family: monospace;
    color: var(--clr-accent, #6ee7b7);
    opacity: 0.5;
    background: rgba(255, 255, 255, 0.04);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .cp-footer {
    display: flex;
    gap: 16px;
    padding: 8px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.25);
  }

  @keyframes cpFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes cpSlideIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-12px) scale(0.97); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0)     scale(1);    }
  }
</style>
