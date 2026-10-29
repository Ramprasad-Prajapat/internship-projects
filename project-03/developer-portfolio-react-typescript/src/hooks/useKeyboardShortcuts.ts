import { useEffect } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface ShortcutMap {
  [keyCombo: string]: KeyHandler;
}

/**
 * Custom hook for keyboard shortcut binding.
 * Example key combos: 'Escape', 'Control+k', 'Alt+t'
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const keys: string[] = [];
      if (event.ctrlKey) keys.push('Control');
      if (event.altKey) keys.push('Alt');
      if (event.shiftKey) keys.push('Shift');
      if (event.metaKey) keys.push('Meta');

      if (!['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) {
        keys.push(event.key.length === 1 ? event.key.toLowerCase() : event.key);
      }

      const combo = keys.join('+');
      if (shortcuts[combo]) {
        shortcuts[combo](event);
      } else if (shortcuts[event.key]) {
        shortcuts[event.key](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}
