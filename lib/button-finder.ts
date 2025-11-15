/**
 * Button finding and clicking utilities for Platzi quiz
 * Provides configuration-driven button selection and clicking
 */

import { SELECTORS } from "./constants";
import { $, $$ } from "./query";

export interface ButtonConfig {
  selector: string;
  label: string;
}

/**
 * Platzi quiz button configurations in priority order
 * First matching button will be clicked
 */
export const PLATZI_QUIZ_BUTTONS: ButtonConfig[] = [
  {
    selector: SELECTORS.PLATZI_QUIZ.CONTROL_BAR,
    label: "ControlBar Button",
  },
  {
    selector: SELECTORS.PLATZI_QUIZ.START_EXAM_BUTTON,
    label: "Start Exam",
  },
  {
    selector: SELECTORS.PLATZI_QUIZ.START_QUIZ_BUTTON,
    label: "Start Quiz",
  },
  {
    selector: SELECTORS.PLATZI_QUIZ.FINISH_BUTTON,
    label: "Finish",
  },
  {
    selector: SELECTORS.PLATZI_QUIZ.CONTINUE_BUTTON,
    label: "Continue Learning",
  },
];

/**
 * Find and click the first available button from the configuration
 * Uses priority-based search - returns on first match
 *
 * @param config - Array of button configurations to try in order
 * @returns Button label if clicked, null if no button found
 */
export function findAndClickButton(
  config: ButtonConfig[] = PLATZI_QUIZ_BUTTONS
): string | null {
  for (const buttonConfig of config) {
    const button = $<HTMLElement>(buttonConfig.selector);

    if (!button) continue;

    try {
      button.click();
      console.log(`Platzi: Clicked ${buttonConfig.label}`);
      return buttonConfig.label;
    } catch (error) {
      console.error(`Platzi: Failed to click ${buttonConfig.label}:`, error);
    }
  }

  console.warn("Platzi: No clickable button found");
  return null;
}

/**
 * Special handler for ControlBar which requires finding the last enabled button
 * @returns true if a button was clicked, false otherwise
 */
export function clickLastControlBarButton(): boolean {
  const controlBar = $<HTMLElement>(SELECTORS.PLATZI_QUIZ.CONTROL_BAR);

  if (!controlBar) return false;

  // Find all enabled buttons within the control bar
  const buttons = $$<HTMLButtonElement>(
    SELECTORS.PLATZI_QUIZ.CONTROL_BUTTONS,
    controlBar
  );

  if (buttons.length > 0) {
    const lastButton = buttons[buttons.length - 1];

    try {
      lastButton.click();
      console.log("Platzi: Clicked last enabled ControlBar button");
      return true;
    } catch (error) {
      console.error("Platzi: Failed to click ControlBar button:", error);
      return false;
    }
  }
  return false;
}
