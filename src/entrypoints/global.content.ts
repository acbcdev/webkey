import hotkeys from "hotkeys-js"
import { GLOBAL_SHORTCUTS } from "@/features/global/constants"
import { goToHome } from "@/lib/navigation/home"

export default defineContentScript({
	matches: ["*://*/*"],
	main() {
		// Global shortcut to go to home page (Ctrl+Shift+H / Cmd+Shift+H)
		hotkeys(GLOBAL_SHORTCUTS.GO_TO_HOME, (event) => {
			event.preventDefault()
			goToHome().catch(console.error)
		})
	},
})
