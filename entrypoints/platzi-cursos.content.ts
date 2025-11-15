import hotkeys from "hotkeys-js";
import { SELECTORS, SHORTCUTS } from "@/lib/constants";
import { copyElementText } from "@/lib/copy";
import { $ } from "@/lib/query";

export default defineContentScript({
  matches: ["*://*.platzi.com/cursos/*"],
  main() {
    console.log("Platzi: Cursos content script loaded");

    // Double-click event listener for content class
    document.addEventListener("dblclick", (event) => {
      const target = event.target as HTMLElement;

      // Check if the clicked element or its parent has class containing "Articlass__content"
      const contentElement = target.closest(
        SELECTORS.PLATZI_CURSOS.CONTENT
      ) as HTMLElement;

      if (contentElement) {
        copyElementText(contentElement);
      }
    });

    // Press 'h' to copy the first h1 element
    hotkeys(SHORTCUTS.PLATZI_CURSOS.COPY_HEADING, () => {
      const h1Element = $<HTMLElement>(SELECTORS.PLATZI_CURSOS.HEADING_H1);
      if (h1Element) {
        copyElementText(h1Element);
      }
    });

    // Press 'r' to copy the resume content
    hotkeys(SHORTCUTS.PLATZI_CURSOS.COPY_CONTENT, () => {
      const contentElement = $<HTMLElement>(SELECTORS.PLATZI_CURSOS.CONTENT);
      if (contentElement) {
        copyElementText(contentElement);
      }
    });
  },
});
