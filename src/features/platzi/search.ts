/**
 * Platzi main site search functionality
 */

import { $ } from "@/lib/dom/query"
import { PLATZI_SELECTORS } from "./constants"

/**
 * Toggle search input focus and select text if present
 */
export function toggleSearchFocus(): void {
	const searchInput = $<HTMLInputElement>(PLATZI_SELECTORS.SEARCH_INPUT)

	if (searchInput) {
		// Blur if already focused, focus otherwise
		if (document.activeElement === searchInput) {
			searchInput.blur()
			console.log("Platzi: Blurred search input")
		} else {
			searchInput.focus()
			// Select all text if there's any
			if (searchInput.value) {
				searchInput.select()
			}
			console.log("Platzi: Focused search input")
		}
	}
}
