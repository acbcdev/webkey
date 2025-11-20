import hotkeys from "hotkeys-js"
import {
	copyContent,
	copyHeading,
	PLATZI_CURSOS_SELECTORS,
	PLATZI_CURSOS_SHORTCUTS,
} from "@/features/platzi/content-copy"
import { copyElementText } from "@/lib/dom/clipboard"

export default defineContentScript({
	matches: ["*://*.platzi.com/cursos/*"],
	main() {
		console.log("Platzi: Cursos content script loaded")

		// Double-click event listener for content class
		document.addEventListener("dblclick", (event) => {
			const target = event.target as HTMLElement

			// Check if the clicked element or its parent has class containing "Articlass__content"
			const contentElement = target.closest(
				PLATZI_CURSOS_SELECTORS.CONTENT,
			) as HTMLElement

			if (contentElement) {
				copyElementText(contentElement)
			}
		})

		// Press 'h' to copy the first h1 element
		hotkeys(PLATZI_CURSOS_SHORTCUTS.COPY_HEADING, () => {
			copyHeading()
		})

		// Press 'r' to copy the resume content
		hotkeys(PLATZI_CURSOS_SHORTCUTS.COPY_CONTENT, () => {
			copyContent()
		})
	},
})
