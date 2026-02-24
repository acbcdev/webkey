import hotkeys from "hotkeys-js"
import {
	copyContent,
	copyHeading,
	PLATZI_CURSOS_SELECTORS,
	PLATZI_CURSOS_SHORTCUTS,
} from "@/features/platzi/content-copy"
import { copyText } from "@/lib/dom/clipboard"
import { featureConfig } from "@/lib/storage/feature-config"
import { toast } from "@/lib/ui/visual-feedback"

export default defineContentScript({
	matches: ["*://*.platzi.com/cursos/*"],
	async main() {
		console.log("Platzi: Cursos content script loaded")

		const config = await featureConfig.getValue()

		// Exit early if feature is disabled
		if (!config.platziCursos) return

		// Double-click event listener for content class
		const handleDblClick = (event: Event) => {
			if (!(event.target instanceof HTMLElement)) return

			const target = event.target

			// Check if the clicked element or its parent has class containing "Articlass__content"
			const contentElement = target.closest(PLATZI_CURSOS_SELECTORS.CONTENT)

			if (contentElement instanceof HTMLElement) {
				copyText(contentElement.innerText || contentElement.textContent || "").then(() => toast("Content copied!"))
			}
		}

		document.addEventListener("dblclick", handleDblClick)

		// Press 'h' to copy the first h1 element
		hotkeys(PLATZI_CURSOS_SHORTCUTS.COPY_HEADING, () => {
			copyHeading()
		})

		// Press 'r' to copy the resume content
		hotkeys(PLATZI_CURSOS_SHORTCUTS.COPY_CONTENT, () => {
			copyContent()
		})

		// Cleanup listener on unload to prevent memory leaks
		window.addEventListener("unload", () => {
			document.removeEventListener("dblclick", handleDblClick)
		})
	},
})
