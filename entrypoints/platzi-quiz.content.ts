import hotkeys from "hotkeys-js";
import {
  clickLastControlBarButton,
  findAndClickButton,
} from "@/lib/button-finder";
import { SELECTORS, SHORTCUTS } from "@/lib/constants";
import { $, $$ } from "@/lib/query";
import {
  clearMarkState,
  clearOutline,
  highlightElement,
  markAsDiscarded,
  markAsMaybe,
} from "@/lib/visual-feedback";

/**
 * Manages quiz option navigation state and highlighting via arrow keys
 * Handles up/down navigation, clicking selected option, and cancellation
 */
class QuizNavigator {
  private selectedIndex: number = -1;
  private markedStates: Map<number, "discarded" | "maybe"> = new Map();

  private isValidSelection(length: number): boolean {
    return this.selectedIndex >= 0 && this.selectedIndex < length;
  }

  next(): void {
    const optionButtons = $$<HTMLButtonElement>(
      SELECTORS.PLATZI_QUIZ.QUIZ_OPTIONS
    );

    if (optionButtons.length === 0) return;

    if (this.selectedIndex === -1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex = (this.selectedIndex + 1) % optionButtons.length;
    }

    this.updateHighlight(optionButtons);
    console.log(`Platzi: Navigated to option ${this.selectedIndex}`);
  }

  previous(): void {
    const optionButtons = $$<HTMLButtonElement>(
      SELECTORS.PLATZI_QUIZ.QUIZ_OPTIONS
    );

    if (optionButtons.length === 0) return;

    if (this.selectedIndex === -1) {
      this.selectedIndex = optionButtons.length - 1;
    } else {
      this.selectedIndex =
        (this.selectedIndex - 1 + optionButtons.length) % optionButtons.length;
    }

    this.updateHighlight(optionButtons);
    console.log(`Platzi: Navigated to option ${this.selectedIndex}`);
  }

  clickCurrent(): boolean {
    const optionButtons = $$<HTMLButtonElement>(
      SELECTORS.PLATZI_QUIZ.QUIZ_OPTIONS
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
      SELECTORS.PLATZI_QUIZ.QUIZ_OPTIONS
    );
    optionButtons.forEach((btn) => {
      clearOutline(btn);
    });
    console.log("Platzi: Cancelled option selection");
  }

  toggleDiscarded(): void {
    const optionButtons = $$<HTMLButtonElement>(
      SELECTORS.PLATZI_QUIZ.QUIZ_OPTIONS
    );

    if (!this.isValidSelection(optionButtons.length)) return;

    const button = optionButtons[this.selectedIndex];
    const currentState = this.markedStates.get(this.selectedIndex);

    if (currentState !== "discarded") {
      // Mark as discarded
      this.markedStates.set(this.selectedIndex, "discarded");
      markAsDiscarded(button);
      console.log(`Platzi: Marked option ${this.selectedIndex} as discarded`);
    } else {
      // Remove discarded mark
      this.markedStates.delete(this.selectedIndex);
      clearMarkState(button);
      console.log(
        `Platzi: Unmarked option ${this.selectedIndex} as discarded`
      );
    }

    this.updateHighlight(optionButtons);
  }

  toggleMaybe(): void {
    const optionButtons = $$<HTMLButtonElement>(
      SELECTORS.PLATZI_QUIZ.QUIZ_OPTIONS
    );

    if (!this.isValidSelection(optionButtons.length)) return;

    const button = optionButtons[this.selectedIndex];
    const currentState = this.markedStates.get(this.selectedIndex);

    if (currentState !== "maybe") {
      // Mark as maybe
      this.markedStates.set(this.selectedIndex, "maybe");
      markAsMaybe(button);
      console.log(`Platzi: Marked option ${this.selectedIndex} as maybe`);
    } else {
      // Remove maybe mark
      this.markedStates.delete(this.selectedIndex);
      clearMarkState(button);
      console.log(`Platzi: Unmarked option ${this.selectedIndex} as maybe`);
    }

    this.updateHighlight(optionButtons);
  }

  clearAllMarkStates(): void {
    const optionButtons = $$<HTMLButtonElement>(
      SELECTORS.PLATZI_QUIZ.QUIZ_OPTIONS
    );

    optionButtons.forEach((btn, index) => {
      if (this.markedStates.has(index)) {
        clearMarkState(btn);
      }
    });

    this.markedStates.clear();
    console.log("Platzi: Cleared all marked states");
  }

  private updateHighlight(optionButtons: NodeListOf<HTMLButtonElement>): void {
    if (this.selectedIndex >= 0 && this.selectedIndex < optionButtons.length) {
      const selectedButton = optionButtons[this.selectedIndex];
      highlightElement(selectedButton, optionButtons);
      selectedButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
}

export default defineContentScript({
  matches: [
    "*://*.platzi.com/clases/examen/*",
    "*://*.platzi.com/clases/quiz/*",
  ],
  main() {
    console.log("Platzi: Quiz content script loaded");
    const navigator = new QuizNavigator();

    // Arrow key navigation for quiz options
    hotkeys(SHORTCUTS.PLATZI_QUIZ.NEXT_OPTION, () => {
      navigator.next();
    });

    hotkeys(SHORTCUTS.PLATZI_QUIZ.PREVIOUS_OPTION, () => {
      navigator.previous();
    });

    // Enter key to click the highlighted option or control buttons
    hotkeys(SHORTCUTS.PLATZI_QUIZ.SELECT_OPTION, () => {
      // Clear all mark states when submitting answer
      navigator.clearAllMarkStates();

      // If an option is highlighted via arrow keys, click it
      if (navigator.clickCurrent()) {
        return;
      }

      // Try clicking control buttons - check ControlBar first, then other buttons
      const clicked = clickLastControlBarButton() || !!findAndClickButton();
      if (!clicked) {
        console.warn("Platzi: No button found to click");
      }
    });

    // Press ESC to cancel option selection
    hotkeys(SHORTCUTS.PLATZI_QUIZ.CANCEL_SELECTION, () => {
      navigator.cancel();
    });

    // Press Left arrow to mark/unmark option as discarded
    hotkeys(SHORTCUTS.PLATZI_QUIZ.MARK_DISCARDED, () => {
      navigator.toggleDiscarded();
    });

    // Press Right arrow to mark/unmark option as maybe
    hotkeys(SHORTCUTS.PLATZI_QUIZ.MARK_MAYBE, () => {
      navigator.toggleMaybe();
    });

    // Press 'a', 'b', 'c', 'd', or 'e' to select quiz options by letter (direct selection)
    hotkeys(SHORTCUTS.PLATZI_QUIZ.SELECT_BY_LETTER, (event) => {
      const optionButtons = $$<HTMLButtonElement>(
        SELECTORS.PLATZI_QUIZ.QUIZ_OPTIONS
      );

      if (optionButtons.length === 0) return;

      // Find the button with the matching letter and click it directly
      for (const button of optionButtons) {
        const letterSpan = $(SELECTORS.PLATZI_QUIZ.OPTION_LETTER, button);

        if (letterSpan && letterSpan.textContent?.toLowerCase() === event.key) {
          button.click();
          console.log(`Platzi: Selected option ${event.key.toUpperCase()}`);
          navigator.cancel(); // Clear any previous arrow key selection
          break;
        }
      }
    });

    // Press 1-5 to select quiz options by position (direct selection)
    hotkeys(SHORTCUTS.PLATZI_QUIZ.SELECT_BY_NUMBER, (event) => {
      const optionButtons = $$<HTMLButtonElement>(
        SELECTORS.PLATZI_QUIZ.QUIZ_OPTIONS
      );

      if (optionButtons.length === 0) return;

      const index = Number(event.key) - 1;

      if (index >= 0 && index < optionButtons.length) {
        optionButtons[index].click();
        console.log(
          `Platzi: Selected option ${event.key} (${String.fromCharCode(
            65 + index
          )})`
        );
        navigator.cancel(); // Clear any previous arrow key selection
      }
    });
  },
});
