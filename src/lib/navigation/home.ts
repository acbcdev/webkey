/**
 * Navigation utilities for moving around websites
 */

import { getCustomHomeUrl } from "@/lib/storage/home-urls"

/**
 * Navigate to the home page of the current website
 * Checks for custom home URL first, falls back to domain root
 */
export async function goToHome(): Promise<void> {
	try {
		const currentDomain = window.location.hostname
		const customUrl = await getCustomHomeUrl(currentDomain)
		const a = document.createElement("a")
		a.href = customUrl || window.location.origin
		a.click()
		// if (customUrl) {
		// 	window.location.href = customUrl
		// } else {
		// 	window.location.href = window.location.origin
		// }
	} catch (error) {
		console.error("Failed to navigate to home:", error)
		// Fallback to domain root
		window.location.href = window.location.origin
	}
}
