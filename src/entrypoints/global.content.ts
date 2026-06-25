import hotkeys from "hotkeys-js"
import { GLOBAL_SHORTCUTS } from "@/features/global/constants"
import { goToHome, openHomeInNewTab } from "@/lib/navigation/home"
import { featureConfig } from "@/lib/storage/feature-config"

export default defineContentScript({
	matches: ["*://*/*"],
	async main() {
		const config = await featureConfig.getValue()

		// Exit early if feature is disabled
		if (!config.global) return

		// Switch scope based on focused element so 'all'-scoped shortcuts
		// fire even when focus is inside inputs, textareas, or selects
		hotkeys.filter = (event) => {
			const tag = (event.target as HTMLElement).tagName
			hotkeys.setScope(
				/^(INPUT|TEXTAREA|SELECT)$/.test(tag) ? "input" : "other",
			)
			return true
		}

		// Global shortcut to go to home page (Ctrl+Shift+H / Cmd+Shift+H)
		hotkeys(GLOBAL_SHORTCUTS.GO_TO_HOME, "all", (event) => {
			event.preventDefault()
			goToHome().catch(console.error)
		})

		hotkeys(GLOBAL_SHORTCUTS.OPEN_HOME_NEW_TAB, "all", (event) => {
			event.preventDefault()
			openHomeInNewTab().catch(console.error)
		})

		hotkeys(GLOBAL_SHORTCUTS.OPEN_CURRENT_NEW_TAB, "all", (event) => {
			event.preventDefault()
			window.open(window.location.href, "_blank")
		})
	},
})
