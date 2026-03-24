import { SvelteComponent } from 'svelte';
export interface CommandPaletteProps {
  onAction?: (keyword: string) => void;
  onRandomTheme?: () => void;
}
export default class CommandPalette extends SvelteComponent<CommandPaletteProps> {}
