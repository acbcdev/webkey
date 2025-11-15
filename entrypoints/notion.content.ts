import hotkeys from "hotkeys-js";
import { SELECTORS, SHORTCUTS } from "@/lib/constants";
import { $$ } from "@/lib/query";

export default defineContentScript({
  matches: ["*://*.notion.so/*"],
  main() {
    // Press 'n' to click the add new item button
    hotkeys(SHORTCUTS.NOTION.ADD_NEW_ITEM, () => {
      const list = $$<HTMLElement>(SELECTORS.NOTION.ADD_NEW_ITEM);
      if (list.length > 0) {
        const lastButton = list[list.length - 1];
        if (lastButton) {
          lastButton.click();
        }
      }
    });
  },
});
