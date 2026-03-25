// ── Modal helpers ─────────────────────────────────────────────────────
// Shared across all UI modules.

export const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T | null;

export const openModal  = (id: string) => $(id)?.classList.add('open');
export const closeModal = (id: string) => $(id)?.classList.remove('open');

// Expose to HTML onclick attributes and legacy SC.modals references
export function initModalClickOutside() {
  document.querySelectorAll('.sc-overlay').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target === el) (el as HTMLElement).classList.remove('open');
    });
  });
  (window as any).SC = {
    ...((window as any).SC ?? {}),
    modals: { open: openModal, close: closeModal },
  };
}
