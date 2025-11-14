import hotkeys from "hotkeys-js";
import { $$ } from "@/lib/query";

const ADD_NEW_ITEM_SELECTOR =
  ".notion-gallery-view .notion-selectable.notion-collection_view-block div div";

export default defineContentScript({
  matches: ["*://*.notion.so/*"],
  main() {
    // Press 'n' to click the add new item button
    hotkeys("n", () => {
      const list = $$<HTMLElement>(ADD_NEW_ITEM_SELECTOR);
      if (list.length > 0) {
        const lastButton = list[list.length - 1];
        if (lastButton) {
          lastButton.click();
        }
      }
    });
  },
});
