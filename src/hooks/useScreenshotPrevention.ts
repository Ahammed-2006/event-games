import { useEffect, useState } from 'react';

/**
 * Prevents common screenshot/screen-capture methods in the browser.
 * Returns `{ warned }` — true briefly when a capture attempt is detected.
 *
 * Note: Full prevention is impossible at the OS level, but this blocks:
 *  - Right-click context menu
 *  - Ctrl+P / Ctrl+S (print / save)
 *  - PrintScreen / F12 DevTools (warns)
 *  - Drag-select on images
 *  - Tab-switch blur (hides content during screen-share)
 */
export function useScreenshotPrevention(enabled = true) {
  const [warned, setWarned] = useState(false);
  const [hidden, setHidden] = useState(false);

  const triggerWarn = () => {
    setWarned(true);
    setTimeout(() => setWarned(false), 3000);
  };

  useEffect(() => {
    if (!enabled) return;

    // --- Disable right-click ---
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerWarn();
    };

    // --- Block keyboard shortcuts ---
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // PrintScreen
      if (key === 'printscreen' || key === 'print') {
        e.preventDefault();
        triggerWarn();
        return;
      }
      // Ctrl+P (print) | Ctrl+S (save) | Ctrl+Shift+I (devtools)
      // Ctrl+U (view source) | F12 (devtools)
      if (e.ctrlKey && (key === 'p' || key === 's' || key === 'u')) {
        e.preventDefault();
        triggerWarn();
        return;
      }
      if (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
        e.preventDefault();
        triggerWarn();
        return;
      }
      if (key === 'f12') {
        e.preventDefault();
        triggerWarn();
        return;
      }
      // Ctrl+Shift+S (screen snip on some browsers)
      if (e.ctrlKey && e.shiftKey && key === 's') {
        e.preventDefault();
        triggerWarn();
        return;
      }
    };

    // --- Tab / window visibility (screen-share detection heuristic) ---
    const handleVisibility = () => {
      if (document.hidden) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    };

    // --- Block drag on images ---
    const blockDrag = (e: DragEvent) => e.preventDefault();

    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockKeys);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('dragstart', blockDrag);

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('dragstart', blockDrag);
    };
  }, [enabled]);

  return { warned, hidden };
}
