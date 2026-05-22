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

// Background-compatible versions (no window/document access)

async function getActiveTab(): Promise<browser.tabs.Tab | null> {
	const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
	return tab ?? null
}

async function resolveHomeUrlForTab(tabUrl: string): Promise<string> {
	const { hostname, origin } = new URL(tabUrl)
	const customUrl = await getCustomHomeUrl(hostname)
	return customUrl ?? origin
}

export async function goToHomeBackground(): Promise<void> {
	const tab = await getActiveTab()
	if (!tab?.url || !tab.id) return
	const url = await resolveHomeUrlForTab(tab.url)
	await browser.tabs.update(tab.id, { url })
}

export async function openHomeInNewTabBackground(): Promise<void> {
	const tab = await getActiveTab()
	if (!tab?.url) return
	const url = await resolveHomeUrlForTab(tab.url)
	await browser.tabs.create({ url })
}

export async function openCurrentInNewTabBackground(): Promise<void> {
	const tab = await getActiveTab()
	if (!tab?.url) return
	await browser.tabs.create({ url: tab.url })
}
