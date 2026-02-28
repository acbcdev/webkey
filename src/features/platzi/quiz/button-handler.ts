/**
 * Platzi quiz button finding and clicking utilities
 */

import { $ } from "@/lib/dom/query"
import { type ButtonConfig, PLATZI_QUIZ_BUTTONS } from "./constants"

/**
 * Find and click the first available button from the configuration
 * Uses priority-based search - returns on first match
 *
 * @param config - Array of button configurations to try in order
 * @returns Button label if clicked, null if no button found
 */
export function findAndClickButton(
	config: ButtonConfig[] = PLATZI_QUIZ_BUTTONS,
): string | null {
	for (const buttonConfig of config) {
		const button = $<HTMLElement>(buttonConfig.selector)

		if (!button) continue

		try {
			button.click()
			console.log(`Platzi: Clicked ${buttonConfig.label}`)
			return buttonConfig.label
		} catch (error) {
			console.error(`Platzi: Failed to click ${buttonConfig.label}:`, error)
		}
	}

	console.warn("Platzi: No clickable button found")
	return null
}
