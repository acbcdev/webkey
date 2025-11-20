/**
 * Gmail account switching functionality
 */

import { $ } from "@/lib/dom/query";
import { GMAIL_CONFIG, GMAIL_SELECTORS } from "./constants";

/**
 * Switch to a specific Gmail account by index via URL modification
 * @param index - Account index (0-based)
 */
export function switchToAccount(index: number): void {
	window.location.href = GMAIL_CONFIG.URLS.ACCOUNT_INBOX(index);
}

/**
 * Navigate to inbox for the current account
 * Falls back to URL navigation if button is not found
 */
export function goToInbox(): void {
	const inboxButton = $<HTMLElement>(GMAIL_SELECTORS.INBOX_BUTTON);

	if (inboxButton) {
		const inboxLink = $<HTMLElement>(GMAIL_SELECTORS.INBOX_LINK, inboxButton);
		if (inboxLink) {
			inboxLink.click();
			console.log("Gmail: Clicked inbox button");
			return;
		}
	}

	// Fallback: navigate via URL if button not found
	const currentUrl = window.location.href;
	const accountMatch = currentUrl.match(GMAIL_CONFIG.ACCOUNT_INDEX_REGEX);
	const currentAccount = accountMatch ? accountMatch[1] : "0";
	window.location.href = GMAIL_CONFIG.URLS.ACCOUNT_INBOX(
		parseInt(currentAccount, 10),
	);
}
