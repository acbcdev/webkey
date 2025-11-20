import hotkeys from "hotkeys-js";
import { PLATZI_SHORTCUTS } from "@/features/platzi/constants";
import { toggleSearchFocus } from "@/features/platzi/search";
import { isMac } from "@/lib/platform/detection";

export default defineContentScript({
	matches: ["*://platzi.com/*"],
	main() {
		console.log("Platzi: Main content script loaded");

		// Detect if on Mac and use appropriate shortcut
		const focusShortcut = isMac()
			? PLATZI_SHORTCUTS.FOCUS_SEARCH_MAC
			: PLATZI_SHORTCUTS.FOCUS_SEARCH_OTHER;

		// Focus search input with platform-specific shortcut
		hotkeys(focusShortcut, (event) => {
			event.preventDefault();
			toggleSearchFocus();
		});
	},
});
