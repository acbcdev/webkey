import hotkeys from "hotkeys-js";
import { NOTION_SHORTCUTS } from "@/features/notion/constants";
import { addNewGalleryItem } from "@/features/notion/gallery";

export default defineContentScript({
  matches: ["*://*.notion.so/*"],
  main() {
    // Press 'n' to click the add new item button
    hotkeys(NOTION_SHORTCUTS.ADD_NEW_ITEM, () => {
      addNewGalleryItem();
    });
  },
});
