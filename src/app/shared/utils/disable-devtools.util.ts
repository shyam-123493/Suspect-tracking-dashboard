/**
 * Deters casual use of browser developer tools by blocking the common
 * entry points: right-click context menu, F12 and the inspect/console/
 * view-source keyboard shortcuts.
 *
 * Note: this is a deterrent only. Dev tools can still be opened via the
 * browser menu; client-side code can never fully prevent inspection.
 */
export function disableDevTools(): void {
  document.addEventListener('contextmenu', event => event.preventDefault());

  document.addEventListener('keydown', event => {
    const key = event.key.toUpperCase();

    const isF12 = key === 'F12';
    // Ctrl+Shift+I / J / C (Windows/Linux) and Cmd+Opt+I / J / C (macOS)
    const isInspectShortcut =
      ((event.ctrlKey && event.shiftKey) || (event.metaKey && event.altKey)) &&
      ['I', 'J', 'C'].includes(key);
    // Ctrl+U / Cmd+U (view source) and Ctrl+S / Cmd+S (save page)
    const isSourceShortcut =
      (event.ctrlKey || event.metaKey) && ['U', 'S'].includes(key);

    if (isF12 || isInspectShortcut || isSourceShortcut) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}
