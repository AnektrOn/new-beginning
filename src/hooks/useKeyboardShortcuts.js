import { useEffect } from 'react';

/**
 * useKeyboardShortcuts Hook
 * Provides keyboard shortcut functionality
 * 
 * @param {Object} shortcuts - Object mapping key combinations to callbacks
 * @param {Array} deps - Dependencies array
 * 
 * @example
 * useKeyboardShortcuts({
 *   'cmd+k': () => setCommandPaletteOpen(true),
 *   'cmd+/': () => showHelp(),
 *   'escape': () => closeModal()
 * });
 */
export const useKeyboardShortcuts = (shortcuts, deps = []) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const metaKey = event.metaKey || event.ctrlKey;
      const shiftKey = event.shiftKey;
      const altKey = event.altKey;

      // Build key combination string
      const parts = [];
      if (metaKey) parts.push('cmd');
      if (shiftKey) parts.push('shift');
      if (altKey) parts.push('alt');
      parts.push(key);

      const combination = parts.join('+');

      // Check for exact match
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination](event);
        return;
      }

      // Check for meta+key combination
      if (metaKey && shortcuts[`cmd+${key}`]) {
        event.preventDefault();
        shortcuts[`cmd+${key}`](event);
        return;
      }

      // Check for single key
      if (shortcuts[key]) {
        // Only prevent default if it's not a typing key
        if (!['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].includes(key) || event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
          // Allow typing in inputs
          return;
        }
        event.preventDefault();
        shortcuts[key](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, ...deps]);
};

export default useKeyboardShortcuts;

