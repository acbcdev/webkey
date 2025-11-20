/**
 * Platzi course content copying functionality
 */

import { copyElementText } from "@/lib/dom/clipboard"
import { $ } from "@/lib/dom/query"

export const PLATZI_CURSOS_SELECTORS = {
	CONTENT: '[class*="Articlass__content"]',
	HEADING_H1: "h1",
} as const

export const PLATZI_CURSOS_SHORTCUTS = {
	COPY_HEADING: "h",
	COPY_CONTENT: "r",
} as const

/**
 * Copy course content heading (h1)
 */
export function copyHeading(): void {
	const h1Element = $<HTMLElement>(PLATZI_CURSOS_SELECTORS.HEADING_H1)
	if (h1Element) {
		copyElementText(h1Element)
	}
}

/**
 * Copy course content section
 */
export function copyContent(): void {
	const contentElement = $<HTMLElement>(PLATZI_CURSOS_SELECTORS.CONTENT)
	if (contentElement) {
		copyElementText(contentElement)
	}
}
