import hotkeys from "hotkeys-js";
import { $ } from "@/lib/query";
import { SELECTORS, SHORTCUTS } from "@/lib/constants";

export default defineContentScript({
  matches: ["*://platzi.com/*"],
  main() {
    console.log("Platzi: Main content script loaded");

    // Detect if on Mac
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
    const focusShortcut = isMac
      ? SHORTCUTS.PLATZI.FOCUS_SEARCH_MAC
      : SHORTCUTS.PLATZI.FOCUS_SEARCH_OTHER;

    // Focus search input with platform-specific shortcut
    hotkeys(focusShortcut, (event) => {
      event.preventDefault();
      const searchInput = $<HTMLInputElement>(SELECTORS.PLATZI.SEARCH_INPUT);

      if (searchInput) {
        // Blur if already focused, focus otherwise
        if (document.activeElement === searchInput) {
          searchInput.blur();
          console.log("Platzi: Blurred search input");
        } else {
          searchInput.focus();
          // Select all text if there's any
          if (searchInput.value) {
            searchInput.select();
          }
          console.log("Platzi: Focused search input");
        }
      }
    });
  },
});
