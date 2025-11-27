import hotkeys from "hotkeys-js"
import { PLATZI_SHORTCUTS } from "@/features/platzi/constants"
import { toggleSearchFocus } from "@/features/platzi/search"
import { isMac } from "@/lib/platform/detection"
import { featureConfig } from "@/lib/storage/feature-config"

export default defineContentScript({
	matches: ["*://platzi.com/*"],
	async main() {
		console.log("Platzi: Main content script loaded")

		const config = await featureConfig.getValue()

		// Exit early if feature is disabled
		if (!config.platzi) return

		// Detect if on Mac and use appropriate shortcut
		const focusShortcut = isMac()
			? PLATZI_SHORTCUTS.FOCUS_SEARCH_MAC
			: PLATZI_SHORTCUTS.FOCUS_SEARCH_OTHER

		// Focus search input with platform-specific shortcut
		hotkeys(focusShortcut, (event) => {
			event.preventDefault()
			toggleSearchFocus()
		})
	},
})
