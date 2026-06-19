/**
 * Platzi course content copying functionality
 */

import { copyText } from "@/lib/dom/clipboard"
import { $ } from "@/lib/dom/query"
import { toast } from "@/lib/ui/visual-feedback"

export const PLATZI_CURSOS_SELECTORS = {
	CONTENT: '[class*="Resources__summary"]',
	HEADING_H1: "h1",
} as const

export const PLATZI_CURSOS_SHORTCUTS = {
	COPY_HEADING: "h",
	COPY_CONTENT: "r",
} as const

/**
 * Copy course content heading (h1)
 */
export async function copyHeading(): Promise<void> {
	const h1Element = $<HTMLElement>(PLATZI_CURSOS_SELECTORS.HEADING_H1)
	if (h1Element) {
		await copyText(h1Element.innerText || h1Element.textContent || "")
		toast("Heading copied!")
	}
}

export async function copyContent(): Promise<void> {
	const contentElement = $<HTMLElement>(PLATZI_CURSOS_SELECTORS.CONTENT)
	if (contentElement) {
		await copyText(contentElement.innerText || contentElement.textContent || "")
		toast("Content copied!")
	}
}
