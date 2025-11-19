/**
 * Visual feedback utilities for user interactions
 * Provides different types of visual indicators (background flash, outline, border)
 */

import { VISUAL } from "./constants";

/**
 * Flash element background with color animation
 * @param element - Element to flash
 * @param color - Color to flash (defaults to success green)
 * @param duration - Duration in milliseconds (defaults to 300ms)
 */
export async function flashBackground(
  element: HTMLElement,
  color: string = VISUAL.FEEDBACK_COLOR,
  duration: number = VISUAL.TRANSITION_DURATION
): Promise<void> {
  const originalBackground = element.style.backgroundColor;
  element.style.backgroundColor = color;
  element.style.transition = `background-color ${duration}ms`;

  return new Promise((resolve) => {
    setTimeout(() => {
      element.style.backgroundColor = originalBackground;
      resolve();
    }, duration);
  });
}

/**
 * Flash element outline with color animation
 * @param element - Element to highlight
 * @param color - Outline color (defaults to success green)
 * @param width - Outline width in pixels (defaults to 3px)
 * @param offset - Outline offset in pixels (defaults to 2px)
 */
export function flashOutline(
  element: HTMLElement,
  color: string = VISUAL.FEEDBACK_COLOR,
  width: number = VISUAL.OUTLINE_WIDTH,
  offset: number = VISUAL.OUTLINE_OFFSET
): void {
  element.style.outline = `${width}px solid ${color}`;
  element.style.outlineOffset = `${offset}px`;
}

/**
 * Clear outline from element
 */
export function clearOutline(element: HTMLElement): void {
  element.style.outline = "";
  element.style.outlineOffset = "";
}

/**
 * Flash element border with color animation
 * @param element - Element to flash
 * @param color - Border color (defaults to success green)
 * @param width - Border width in pixels (defaults to 2px)
 * @param duration - Duration in milliseconds (defaults to 300ms)
 */
export async function flashBorder(
  element: HTMLElement,
  color: string = VISUAL.FEEDBACK_COLOR,
  width: number = 2,
  duration: number = VISUAL.TRANSITION_DURATION
): Promise<void> {
  const originalBorder = element.style.border;
  element.style.border = `${width}px solid ${color}`;
  element.style.transition = `border ${duration}ms`;

  return new Promise((resolve) => {
    setTimeout(() => {
      element.style.border = originalBorder;
      resolve();
    }, duration);
  });
}

/**
 * Highlight multiple elements and clear previous highlights
 * @param selectedElement - Element to highlight
 * @param allElements - All elements to manage highlighting for
 * @param color - Highlight color (defaults to success green)
 */
export function highlightElement(
  selectedElement: HTMLElement | null,
  allElements: NodeListOf<HTMLElement> | HTMLElement[],
  color: string = VISUAL.FEEDBACK_COLOR
): void {
  // Clear all previous highlights
  allElements.forEach((el) => {
    clearOutline(el);
  });

  // Highlight the selected element
  if (selectedElement) {
    flashOutline(selectedElement, color);
  }
}

/**
 * Mark element as discarded (wrong answer)
 * @param element - Element to mark as discarded
 */
export function markAsDiscarded(element: HTMLElement): void {
  element.style.border = `1px solid ${VISUAL.DISCARDED_COLOR}`;
  element.setAttribute("data-mark-state", "discarded");
}

/**
 * Mark element as maybe (uncertain answer)
 * @param element - Element to mark as maybe
 */
export function markAsMaybe(element: HTMLElement): void {
  element.style.border = `1px solid ${VISUAL.MAYBE_COLOR}`;
  element.setAttribute("data-mark-state", "maybe");
}

/**
 * Clear mark state from element (return to idle)
 * @param element - Element to clear mark state from
 */
export function clearMarkState(element: HTMLElement): void {
  element.style.border = "";
  element.style.textDecoration = "";
  element.removeAttribute("data-mark-state");
}
