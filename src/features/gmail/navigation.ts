/**
 * Gmail email navigation functionality
 */

import { $ } from "@/lib/dom/query";
import { GMAIL_CONFIG, GMAIL_SELECTORS } from "./constants";

/**
 * Check if Gmail is in projector mode
 * Projector mode disables keyboard navigation
 */
export function isProjectorMode(): boolean {
	const hash = window.location.hash;
	const hashParams = new URLSearchParams(
		hash.split(GMAIL_CONFIG.HASH_SEPARATOR)[1] || "",
	);
	return hashParams.get(GMAIL_CONFIG.PROJECTOR_HASH_PARAM) === "1";
}

/**
 * Navigate to the newer (previous) email
 * Respects projector mode setting
 */
export function navigateToNewer(): void {
	if (isProjectorMode()) return;
	const newerButton = $<HTMLElement>(GMAIL_SELECTORS.NEWER_BUTTON);
	if (newerButton && newerButton.getAttribute("aria-disabled") !== "true") {
		newerButton.click();
	}
}

/**
 * Navigate to the older (next) email
 * Respects projector mode setting
 */
export function navigateToOlder(): void {
	if (isProjectorMode()) return;

	const olderButton = $<HTMLElement>(GMAIL_SELECTORS.OLDER_BUTTON);
	if (olderButton && olderButton.getAttribute("aria-disabled") !== "true") {
		olderButton.click();
	}
}

/**
 * Click the back/send button
 * Used to send emails or go back to the inbox
 */
export function clickBackSendButton(): void {
	const mailRow = $<HTMLElement>(GMAIL_SELECTORS.BACK_SEND_BUTTON);
	if (mailRow) {
		try {
			mailRow.click();
			console.log("Gmail: Clicked back/send button via Enter key");
		} catch (error) {
			console.error("Gmail: Failed to click back/send button:", error);
		}
	}
}
