import hotkeys from "hotkeys-js";
import {
  clickLastControlBarButton,
  findAndClickButton,
} from "@/lib/button-finder";
import { SELECTORS, SHORTCUTS, VISUAL } from "@/lib/constants";
import { $, $$ } from "@/lib/query";
import {
  clearMarkState,
  clearOutline,
  highlightElement,
  markAsConfident,
  markAsDiscarded,
  markAsMaybe,
} from "@/lib/visual-feedback";

/**
 * Manages quiz option navigation state and highlighting via arrow keys
 * Handles up/down navigation, clicking selected option, and cancellation
 */
type MarkState = "discarded" | "maybe" | "confident";

class QuizNavigator {
  private selectedIndex: number = -1;
  private markedStates: Map<number, MarkState> = new Map();

  private isValidSelection(length: number): boolean {
    return this.selectedIndex >= 0 && this.selectedIndex < length;
  }

  navigate(direction: 1 | -1): void {
    const optionButtons = $$<HTMLButtonElement>(
      SELECTORS.PLATZI_QUIZ.QUIZ_OPTIONS
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

  cycleMark(direction: "forward" | "backward"): void {
    const optionButtons = $$<HTMLButtonElement>(
      SELECTORS.PLATZI_QUIZ.QUIZ_OPTIONS
    );

    if (!this.isValidSelection(optionButtons.length)) return;

    const button = optionButtons[this.selectedIndex];
    const currentState = this.markedStates.get(this.selectedIndex);

    // Define cycle order for each direction
    const forwardCycle: (MarkState | null)[] = [null, "maybe", "confident", "discarded"];
    const backwardCycle: (MarkState | null)[] = [null, "discarded", "confident", "maybe"];

    const cycle = direction === "forward" ? forwardCycle : backwardCycle;
    const currentIndex = cycle.indexOf(currentState ?? null);
    const nextIndex = (currentIndex + 1) % cycle.length;
    const nextState = cycle[nextIndex];

    // Apply the new state
    if (nextState === null) {
      this.markedStates.delete(this.selectedIndex);
      clearMarkState(button);
      console.log(`Platzi: Unmarked option ${this.selectedIndex}`);
    } else {
      this.markedStates.set(this.selectedIndex, nextState);

      // Apply appropriate styling based on state
      switch (nextState) {
        case "discarded":
          markAsDiscarded(button);
          break;
        case "maybe":
          markAsMaybe(button);
          break;
        case "confident":
          markAsConfident(button);
          break;
      }

      console.log(`Platzi: Marked option ${this.selectedIndex} as ${nextState}`);
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

      // Map mark state to outline color
      const markState = this.markedStates.get(this.selectedIndex);
      const colorMap: Record<MarkState, string> = {
        discarded: VISUAL.DISCARDED_COLOR,
        maybe: VISUAL.MAYBE_COLOR,
        confident: VISUAL.CONFIDENT_COLOR,
      };
      const color = markState ? colorMap[markState] : VISUAL.FEEDBACK_COLOR;

      highlightElement(selectedButton, optionButtons, color);
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

    // Press Left arrow to cycle backward through mark states
    hotkeys(SHORTCUTS.PLATZI_QUIZ.MARK_DISCARDED, () => {
      navigator.cycleBackward();
    });

    // Press Right arrow to cycle forward through mark states
    hotkeys(SHORTCUTS.PLATZI_QUIZ.MARK_MAYBE, () => {
      navigator.cycleForward();
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
