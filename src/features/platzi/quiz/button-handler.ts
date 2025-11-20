/**
 * Platzi quiz button finding and clicking utilities
 */

import { $, $$ } from "@/lib/dom/query";
import {
	type ButtonConfig,
	PLATZI_QUIZ_BUTTONS,
	PLATZI_QUIZ_SELECTORS,
} from "./constants";

/**
 * Find and click the fir	st available button from the configuration
 * Uses priority-based search - returns on first match
 *
 * @param config - Array of button configurations to try in order
 * @returns Button label if clicked, null if no button found
 */
export function findAndClickButton(
	config: ButtonConfig[] = PLATZI_QUIZ_BUTTONS,
): string | null {
	for (const buttonConfig of config) {
		const button = $<HTMLElement>(buttonConfig.selector);

		if (!button) continue;

		try {
			button.click();
			console.log(`Platzi: Clicked ${buttonConfig.label}`);
			return buttonConfig.label;
		} catch (error) {
			console.error(`Platzi: Failed to click ${buttonConfig.label}:`, error);
		}
	}

	console.warn("Platzi: No clickable button found");
	return null;
}

/**
 * Special handler for ControlBar which requires finding the last enabled button
 * @returns true if a button was clicked, false otherwise
 */
export function clickLastControlBarButton(): boolean {
	const controlBar = $<HTMLElement>(PLATZI_QUIZ_SELECTORS.CONTROL_BAR);

	if (!controlBar) return false;

	// Find all enabled buttons within the control bar
	const buttons = $$<HTMLButtonElement>(
		PLATZI_QUIZ_SELECTORS.CONTROL_BUTTONS,
		controlBar,
	);

	if (buttons.length > 0) {
		const lastButton = buttons[buttons.length - 1];

		try {
			lastButton.click();
			console.log("Platzi: Clicked last enabled ControlBar button");
			return true;
		} catch (error) {
			console.error("Platzi: Failed to click ControlBar button:", error);
			return false;
		}
	}
	return false;
}
