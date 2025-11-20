/**
 * Manages quiz option navigation state and highlighting via arrow keys
 * Handles up/down navigation, clicking selected option, and cancellation
 */

import { $$ } from "@/lib/dom/query";
import { VISUAL } from "@/lib/ui/colors";
import {
	clearMarkState as clearMarkStateUI,
	clearOutline,
	highlightElement,
	markAsConfident,
	markAsDiscarded,
	markAsMaybe,
} from "@/lib/ui/visual-feedback";
import { PLATZI_QUIZ_SELECTORS } from "./constants";
import {
	getMarkStateColor,
	getNextMarkState,
	MarkStateManager,
} from "./mark-state";

/**
 * Manages quiz navigation state
 */
export class QuizNavigator {
	private selectedIndex: number = -1;
	private markStateManager: MarkStateManager = new MarkStateManager();

	private isValidSelection(length: number): boolean {
		return this.selectedIndex >= 0 && this.selectedIndex < length;
	}

	navigate(direction: 1 | -1): void {
		const optionButtons = $$<HTMLButtonElement>(
			PLATZI_QUIZ_SELECTORS.QUIZ_OPTIONS,
		);

		if (optionButtons.length === 0) return;

		if (this.selectedIndex === -1) {
			this.selectedIndex = direction === 1 ? 0 : optionButtons.length - 1;
		} else {
			this.selectedIndex =
				(this.selectedIndex + direction + optionButtons.length) %
				optionButtons.length;
		}

		this.updateHighlight(optionButtons);
		console.log(`Platzi: Navigated to option ${this.selectedIndex}`);
	}

	next(): void {
		this.navigate(1);
	}

	previous(): void {
		this.navigate(-1);
	}

	clickCurrent(): boolean {
		const optionButtons = $$<HTMLButtonElement>(
			PLATZI_QUIZ_SELECTORS.QUIZ_OPTIONS,
		);

		if (this.isValidSelection(optionButtons.length)) {
			optionButtons[this.selectedIndex].click();
			console.log(`Platzi: Clicked option ${this.selectedIndex}`);
			this.cancel();
			return true;
		}

		return false;
	}

	hasSelection(): boolean {
		return this.selectedIndex >= 0;
	}

	cancel(): void {
		this.selectedIndex = -1;
		const optionButtons = $$<HTMLButtonElement>(
			PLATZI_QUIZ_SELECTORS.QUIZ_OPTIONS,
		);
		optionButtons.forEach((btn) => {
			clearOutline(btn);
		});
		console.log("Platzi: Cancelled option selection");
	}

	cycleMark(direction: "forward" | "backward"): void {
		const optionButtons = $$<HTMLButtonElement>(
			PLATZI_QUIZ_SELECTORS.QUIZ_OPTIONS,
		);

		if (!this.isValidSelection(optionButtons.length)) return;

		const button = optionButtons[this.selectedIndex];
		const currentState = this.markStateManager.getMarkState(this.selectedIndex);
		const nextState = getNextMarkState(currentState, direction);

		// Apply the new state
		if (nextState === null) {
			this.markStateManager.removeMarkState(this.selectedIndex);
			clearMarkStateUI(
				button,
				PLATZI_QUIZ_SELECTORS.OPTION_LETTER_ELEMENT,
				PLATZI_QUIZ_SELECTORS.OPTION_TEXT_ELEMENT,
			);
			console.log(`Platzi: Unmarked option ${this.selectedIndex}`);
		} else {
			this.markStateManager.setMarkState(this.selectedIndex, nextState);

			// Apply appropriate styling based on state
			switch (nextState) {
				case "discarded":
					markAsDiscarded(
						button,
						PLATZI_QUIZ_SELECTORS.OPTION_LETTER_ELEMENT,
						PLATZI_QUIZ_SELECTORS.OPTION_TEXT_ELEMENT,
					);
					break;
				case "maybe":
					markAsMaybe(
						button,
						PLATZI_QUIZ_SELECTORS.OPTION_LETTER_ELEMENT,
						PLATZI_QUIZ_SELECTORS.OPTION_TEXT_ELEMENT,
					);
					break;
				case "confident":
					markAsConfident(
						button,
						PLATZI_QUIZ_SELECTORS.OPTION_LETTER_ELEMENT,
						PLATZI_QUIZ_SELECTORS.OPTION_TEXT_ELEMENT,
					);
					break;
			}

			console.log(
				`Platzi: Marked option ${this.selectedIndex} as ${nextState}`,
			);
		}

		this.updateHighlight(optionButtons);
	}

	cycleForward(): void {
		this.cycleMark("forward");
	}

	cycleBackward(): void {
		this.cycleMark("backward");
	}

	clearAllMarkStates(): void {
		const optionButtons = $$<HTMLButtonElement>(
			PLATZI_QUIZ_SELECTORS.QUIZ_OPTIONS,
		);

		this.markStateManager.getMarkedIndices().forEach((index) => {
			const btn = optionButtons[index];
			if (btn) {
				clearMarkStateUI(
					btn,
					PLATZI_QUIZ_SELECTORS.OPTION_LETTER_ELEMENT,
					PLATZI_QUIZ_SELECTORS.OPTION_TEXT_ELEMENT,
				);
			}
		});

		this.markStateManager.clearAllMarkStates();
		console.log("Platzi: Cleared all marked states");
	}

	private updateHighlight(optionButtons: NodeListOf<HTMLButtonElement>): void {
		if (this.selectedIndex >= 0 && this.selectedIndex < optionButtons.length) {
			const selectedButton = optionButtons[this.selectedIndex];

			// Map mark state to outline color
			const markState = this.markStateManager.getMarkState(this.selectedIndex);
			const color = markState
				? getMarkStateColor(markState)
				: VISUAL.FEEDBACK_COLOR;

			highlightElement(selectedButton, optionButtons, color);
			selectedButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}
	}
}
