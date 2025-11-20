/**
 * Clipboard utilities for copying text with optional visual feedback
 */

import { flashBackground, flashOutline } from "../ui/visual-feedback"

export interface CopyOptions {
	feedback?: boolean
	feedbackType?: "background" | "outline"
	feedbackColor?: string
	feedbackDuration?: number
}

/**
 * Copy text to clipboard with optional visual feedback
 */
export async function copyText(
	text: string,
	// options: CopyOptions = { feedback: true, feedbackType: "background" }
): Promise<void> {
	try {
		await navigator.clipboard.writeText(text.trim())
	} catch (error) {
		console.error("Failed to copy to clipboard:", error)
		throw error
	}
}

/**
 * Copy element's text content to clipboard with visual feedback
 */
export async function copyElementText(
	element: HTMLElement,
	options: CopyOptions = { feedback: true, feedbackType: "background" },
): Promise<void> {
	const textToCopy = element.innerText || element.textContent

	if (!textToCopy) {
		console.warn("No text content found in element")
		return
	}

	try {
		await copyText(textToCopy)
		if (!options.feedback) return
		// Apply visual feedback if requested
		if (options.feedbackType === "outline") {
			flashOutline(element, options.feedbackColor, options.feedbackDuration)
		} else {
			await flashBackground(
				element,
				options.feedbackColor,
				options.feedbackDuration,
			)
		}
	} catch (error) {
		console.error("Failed to copy element text:", error)
		throw error
	}
}
