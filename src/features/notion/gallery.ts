/**
 * Notion gallery management functionality
 */

import { $$ } from "@/lib/dom/query"
import { NOTION_SELECTORS } from "./constants"

/**
 * Add a new item to the Notion gallery view
 * Clicks the last available add button
 */
export function addNewGalleryItem(): void {
	const items = $$<HTMLElement>(NOTION_SELECTORS.ADD_NEW_ITEM)
	if (items.length > 0) {
		const lastButton = items[items.length - 1]
		if (lastButton) {
			lastButton.click()
			console.log("Notion: Clicked add new item button")
		}
	}
}
