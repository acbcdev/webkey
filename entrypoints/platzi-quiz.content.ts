import hotkeys from "hotkeys-js";
import { $, $$ } from "@/lib/query";

export default defineContentScript({
  matches: [
    "*://*.platzi.com/clases/examen/*",
    "*://*.platzi.com/clases/quiz/*",
  ],
  main() {
    // Track currently selected quiz option index
    console.log("Platzi: Quiz content script loaded quiz");
    let selectedOptionIndex = -1;

    // Helper function to highlight selected quiz option
    function highlightOption(index: number) {
      const optionButtons = $$<HTMLButtonElement>(
        'button[data-testid="QuestionOption-content"]'
      );

      // Remove previous highlights
      optionButtons.forEach((btn) => {
        btn.style.outline = "";
        btn.style.outlineOffset = "";
      });

      // Highlight the selected option
      if (index >= 0 && index < optionButtons.length) {
        const selectedButton = optionButtons[index];
        selectedButton.style.outline = "3px solid #4CAF50";
        selectedButton.style.outlineOffset = "2px";
        selectedButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }

    // Helper function to click control buttons in sequence
    function clickControlButton() {
      // Try to get the last button in ControlBar (most efficient)
      const controlBar = $<HTMLElement>(".ControlBar-content");
      if (controlBar) {
        const buttons = $$<HTMLButtonElement>("button:not([disabled])");
        if (buttons.length > 0) {
          const lastButton = buttons[buttons.length - 1];
          lastButton.click();
          console.log("Platzi: Clicked last enabled ControlBar button");
          return;
        }
      }

      const startButton = $<HTMLButtonElement>(
        'button[data-trans="StartExam.cta.takeTest"]'
      );
      if (startButton) {
        startButton.click();
        console.log("Platzi: Clicked Start button");
        return;
      }

      const presentarButton = $<HTMLButtonElement>(
        'button[maintext="StartQuiz.cta.takeTest"]'
      );
      if (presentarButton) {
        presentarButton.click();
        console.log("Platzi: Clicked Presentar quiz button");
        return;
      }

      const finishButton = $<HTMLButtonElement>(
        'button[testid="ControlBar-button-finish"]'
      );
      if (finishButton) {
        finishButton.click();
        console.log("Platzi: Clicked Finish button");
        return;
      }

      const continueButton = $<HTMLAnchorElement>(
        'a[data-testid="ResultsOverview-btns-cta"]'
      );
      if (continueButton) {
        continueButton.click();
        console.log(
          "Platzi: Clicked Continuar aprendiendo (Continue learning) button"
        );
        return;
      }
    }

    // Arrow key navigation for quiz options
    hotkeys("down", () => {
      const optionButtons = $$<HTMLButtonElement>(
        'button[data-testid="QuestionOption-content"]'
      );

      if (optionButtons.length === 0) return;

      if (selectedOptionIndex === -1) {
        selectedOptionIndex = 0;
      } else {
        selectedOptionIndex = (selectedOptionIndex + 1) % optionButtons.length;
      }

      highlightOption(selectedOptionIndex);
      console.log(`Platzi: Navigated to option ${selectedOptionIndex}`);
    });

    hotkeys("up", () => {
      const optionButtons = $$<HTMLButtonElement>(
        'button[data-testid="QuestionOption-content"]'
      );

      if (optionButtons.length === 0) return;

      if (selectedOptionIndex === -1) {
        selectedOptionIndex = optionButtons.length - 1;
      } else {
        selectedOptionIndex =
          (selectedOptionIndex - 1 + optionButtons.length) %
          optionButtons.length;
      }

      highlightOption(selectedOptionIndex);
      console.log(`Platzi: Navigated to option ${selectedOptionIndex}`);
    });

    // Enter key to click the highlighted option or control buttons
    hotkeys("enter", () => {
      const optionButtons = $$<HTMLButtonElement>(
        'button[data-testid="QuestionOption-content"]'
      );

      // If an option is highlighted, click it
      if (
        selectedOptionIndex >= 0 &&
        selectedOptionIndex < optionButtons.length
      ) {
        optionButtons[selectedOptionIndex].click();
        console.log(`Platzi: Clicked option ${selectedOptionIndex}`);
        // Reset selection after clicking
        selectedOptionIndex = -1;
        highlightOption(-1);
        return;
      }

      // Try clicking control buttons in order
      clickControlButton();
    });

    // Press ESC to cancel option selection
    hotkeys("esc", () => {
      selectedOptionIndex = -1;
      highlightOption(-1);
      console.log("Platzi: Cancelled option selection");
    });

    // Press 'a', 'b', 'c', 'd', or 'e' to select quiz options by letter
    hotkeys("a,b,c,d,e", (event) => {
      const optionButtons = $$<HTMLButtonElement>(
        'button[data-testid="QuestionOption-content"]'
      );

      if (optionButtons.length === 0) return;

      // Find the button with the matching letter
      for (const button of optionButtons) {
        const letterSpan = $(".QuestionOption-letter-span", button);

        if (letterSpan && letterSpan.textContent?.toLowerCase() === event.key) {
          button.click();
          console.log(`Platzi: Selected option ${event.key.toUpperCase()}`);
          // Reset selection after clicking
          selectedOptionIndex = -1;
          highlightOption(-1);
          break;
        }
      }
    });

    // Press 1-5 to select quiz options by position
    hotkeys("1,2,3,4,5", (event) => {
      const optionButtons = $$<HTMLButtonElement>(
        'button[data-testid="QuestionOption-content"]'
      );

      if (optionButtons.length === 0) return;

      // Convert key to 0-based index (1→0, 2→1, etc)
      const index = Number(event.key) - 1;

      if (index >= 0 && index < optionButtons.length) {
        optionButtons[index].click();
        console.log(
          `Platzi: Selected option ${event.key} (${String.fromCharCode(
            65 + index
          )})`
        );
        // Reset selection after clicking
        selectedOptionIndex = -1;
        highlightOption(-1);
      }
    });
  },
});
