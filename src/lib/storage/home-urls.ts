import { storage } from "@wxt-dev/storage"

/**
 * Storage utilities for managing custom home URL mappings
 */

export interface HomeUrlMapping {
	domain: string
	url: string
}

/**
 * Storage key for custom home URLs
 */
const STORAGE_KEY = "local:customHomeUrls"

export const customHomeUrls = storage.defineItem<Record<string, string>>(
	STORAGE_KEY,
	{
		defaultValue: {},
	},
)

/**
 * Get all custom home URL mappings
 */
export async function getCustomHomeUrls(): Promise<Record<string, string>> {
	return await customHomeUrls.getValue()
}

/**
 * Get custom home URL for a specific domain
 */
export async function getCustomHomeUrl(domain: string): Promise<string | null> {
	const urls = await getCustomHomeUrls()
	return urls[domain] || null
}

/**
 * Set custom home URL for a domain
 */
export async function setCustomHomeUrl(
	domain: string,
	url: string,
): Promise<void> {
	const urls = await getCustomHomeUrls()
	urls[domain] = url
	await customHomeUrls.setValue(urls)
}

/**
 * Remove custom home URL for a domain
 */
export async function removeCustomHomeUrl(domain: string): Promise<void> {
	const urls = await getCustomHomeUrls()
	delete urls[domain]
	await customHomeUrls.setValue(urls)
}

/**
 * Get all mappings as an array for UI display
 */
export async function getHomeUrlMappings(): Promise<HomeUrlMapping[]> {
	const urls = await getCustomHomeUrls()
	return Object.entries(urls).map(([domain, url]) => ({ domain, url }))
}
