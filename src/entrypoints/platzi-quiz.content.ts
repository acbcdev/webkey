import hotkeys from "hotkeys-js"
import {
	clickLastControlBarButton,
	findAndClickButton,
} from "@/features/platzi/quiz/button-handler"
import {
	PLATZI_QUIZ_SELECTORS,
	PLATZI_QUIZ_SHORTCUTS,
} from "@/features/platzi/quiz/constants"
import { QuizNavigator } from "@/features/platzi/quiz/QuizNavigator"
import { $, $$ } from "@/lib/dom/query"

export default defineContentScript({
	matches: [
		"*://*.platzi.com/clases/examen/*",
		"*://*.platzi.com/clases/quiz/*",
	],
	main() {
		console.log("Platzi: Quiz content script loaded")
		const navigator = new QuizNavigator()

		// Arrow key navigation for quiz options
		hotkeys(PLATZI_QUIZ_SHORTCUTS.NEXT_OPTION, () => {
			navigator.next()
		})

		hotkeys(PLATZI_QUIZ_SHORTCUTS.PREVIOUS_OPTION, () => {
			navigator.previous()
		})

		// Enter key to click the highlighted option or control buttons
		hotkeys(PLATZI_QUIZ_SHORTCUTS.SELECT_OPTION, (event) => {
			event.preventDefault()
			// Clear all mark states when submitting answer
			navigator.clearAllMarkStates()

			// If an option is highlighted via arrow keys, click it
			if (navigator.clickCurrent()) {
				return
			}

			// Try clicking control buttons - check ControlBar first, then other buttons
			const clicked = clickLastControlBarButton() || !!findAndClickButton()
			if (!clicked) {
				console.warn("Platzi: No button found to click")
			}
		})

		// Press ESC to cancel option selection
		hotkeys(PLATZI_QUIZ_SHORTCUTS.CANCEL_SELECTION, () => {
			navigator.cancel()
		})

		// Press Left arrow to cycle backward through mark states
		hotkeys(PLATZI_QUIZ_SHORTCUTS.MARK_DISCARDED, () => {
			navigator.cycleBackward()
		})

		// Press Right arrow to cycle forward through mark states
		hotkeys(PLATZI_QUIZ_SHORTCUTS.MARK_MAYBE, () => {
			navigator.cycleForward()
		})

		// Press 'a', 'b', 'c', 'd', or 'e' to select quiz options by letter (direct selection)
		hotkeys(PLATZI_QUIZ_SHORTCUTS.SELECT_BY_LETTER, (event) => {
			const optionButtons = $$<HTMLButtonElement>(
				PLATZI_QUIZ_SELECTORS.QUIZ_OPTIONS,
			)

			if (optionButtons.length === 0) return

			// Find the button with the matching letter and click it directly
			for (const button of optionButtons) {
				const letterSpan = $(PLATZI_QUIZ_SELECTORS.OPTION_LETTER, button)

				if (letterSpan && letterSpan.textContent?.toLowerCase() === event.key) {
					button.click()
					console.log(`Platzi: Selected option ${event.key.toUpperCase()}`)
					navigator.cancel() // Clear any previous arrow key selection
					break
				}
			}
		})

		// Press 1-5 to select quiz options by position (direct selection)
		hotkeys(PLATZI_QUIZ_SHORTCUTS.SELECT_BY_NUMBER, (event) => {
			const optionButtons = $$<HTMLButtonElement>(
				PLATZI_QUIZ_SELECTORS.QUIZ_OPTIONS,
			)

			if (optionButtons.length === 0) return

			const index = Number(event.key) - 1

			if (index >= 0 && index < optionButtons.length) {
				optionButtons[index].click()
				console.log(
					`Platzi: Selected option ${event.key} (${String.fromCharCode(
						65 + index,
					)})`,
				)
				navigator.cancel() // Clear any previous arrow key selection
			}
		})
	},
})
