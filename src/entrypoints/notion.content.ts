import hotkeys from "hotkeys-js"
import { NOTION_SHORTCUTS } from "@/features/notion/constants"
import { addNewGalleryItem } from "@/features/notion/gallery"
import { featureConfig } from "@/lib/storage/feature-config"

export default defineContentScript({
	matches: ["*://*.notion.so/*"],
	async main() {
		const config = await featureConfig.getValue()

		// Exit early if feature is disabled
		if (!config.notion) return

		// Press 'n' to click the add new item button
		hotkeys(NOTION_SHORTCUTS.ADD_NEW_ITEM, () => {
			addNewGalleryItem()
		})
	},
})
