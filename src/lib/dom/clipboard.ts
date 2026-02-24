/**
 * Clipboard utilities for copying text
 */

export async function copyText(text: string): Promise<void> {
	try {
		await navigator.clipboard.writeText(text.trim())
	} catch (error) {
		console.error("Failed to copy to clipboard:", error)
		throw error
	}
}
