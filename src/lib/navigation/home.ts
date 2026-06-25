/**
 * Navigation utilities for moving around websites
 */

import { getCustomHomeUrl } from "@/lib/storage/home-urls"

async function resolveHomeUrl(): Promise<string> {
	const customUrl = await getCustomHomeUrl(window.location.hostname)
	return customUrl || window.location.origin
}

export async function goToHome(): Promise<void> {
	try {
		const url = await resolveHomeUrl()
		const a = document.createElement("a")
		a.href = url
		a.click()
	} catch (error) {
		console.error("Failed to navigate to home:", error)
		window.location.href = window.location.origin
	}
}

export async function openHomeInNewTab(): Promise<void> {
	try {
		window.open(await resolveHomeUrl(), "_blank")
	} catch (error) {
		console.error("Failed to open home in new tab:", error)
		window.open(window.location.origin, "_blank")
	}
}
