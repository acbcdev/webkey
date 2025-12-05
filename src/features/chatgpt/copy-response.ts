/**
 * ChatGPT copy response functionality
 */

import { $$ } from "@/lib/dom/query"
import { VISUAL } from "@/lib/ui/colors"
import { flashBackground } from "@/lib/ui/visual-feedback"
import { CHATGPT_SELECTORS } from "./constants"

/**
 * Click the last ChatGPT copy button (most recent response)
 * Provides visual feedback on success
 * @returns true if button was clicked, false otherwise
 */
export function copyLastResponse(): boolean {
	const copyButtons = $$<HTMLButtonElement>(CHATGPT_SELECTORS.COPY_BUTTON)

	if (copyButtons.length === 0) {
		console.warn("ChatGPT: No copy buttons found on page")
		return false
	}

	const lastButton = copyButtons[copyButtons.length - 1]

	try {
		lastButton.click()

		// Visual feedback: flash button background green
		flashBackground(lastButton, VISUAL.FEEDBACK_COLOR, 300)

		console.log("ChatGPT: Clicked last copy button (most recent response)")
		return true
	} catch (error) {
		console.error("ChatGPT: Failed to click copy button:", error)
		return false
	}
}
