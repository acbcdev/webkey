import hotkeys from "hotkeys-js"
import { CHATGPT_SHORTCUTS } from "@/features/chatgpt/constants"
import { copyLastResponse } from "@/features/chatgpt/copy-response"
import { featureConfig } from "@/lib/storage/feature-config"

export default defineContentScript({
	matches: ["*://chatgpt.com/*", "*://chat.openai.com/*"],
	async main() {
		console.log("ChatGPT: Main content script loaded")

		const config = await featureConfig.getValue()

		// Exit early if feature is disabled
		if (!config.chatgpt) return

		// Configure hotkeys to work in all contexts including input fields
		hotkeys.filter = () => true

		// Alt+C to copy last response - works globally including in inputs
		hotkeys(CHATGPT_SHORTCUTS.COPY_LAST_RESPONSE, (event) => {
			event.preventDefault()
			copyLastResponse()
		})
	},
})
