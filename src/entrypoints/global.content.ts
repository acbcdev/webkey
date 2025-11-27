import hotkeys from "hotkeys-js"
import { GLOBAL_SHORTCUTS } from "@/features/global/constants"
import { goToHome } from "@/lib/navigation/home"
import { featureConfig } from "@/lib/storage/feature-config"

export default defineContentScript({
	matches: ["*://*/*"],
	async main() {
		const config = await featureConfig.getValue()

		// Exit early if feature is disabled
		if (!config.global) return

		// Global shortcut to go to home page (Ctrl+Shift+H / Cmd+Shift+H)
		hotkeys(GLOBAL_SHORTCUTS.GO_TO_HOME, (event) => {
			event.preventDefault()
			goToHome().catch(console.error)
		})
	},
})
