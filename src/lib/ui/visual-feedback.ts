/**
 * Shared visual feedback utilities for user interactions
 * Used across multiple modules (clipboard, etc.)
 * For quiz-specific visual styling, see features/platzi/quiz/mark-states.ts
 */

import { VISUAL } from "./colors"

/**
 * Flash element background with color animation
 * @param element - Element to flash
 * @param color - Color to flash (defaults to success green)
 * @param duration - Duration in milliseconds (defaults to 300ms)
 */
export async function flashBackground(
	element: HTMLElement,
	color: string = VISUAL.FEEDBACK_COLOR,
	duration: number = VISUAL.TRANSITION_DURATION,
): Promise<void> {
	const originalBackground = element.style.backgroundColor
	element.style.backgroundColor = color
	element.style.transition = `background-color ${duration}ms`

	return new Promise((resolve) => {
		setTimeout(() => {
			element.style.backgroundColor = originalBackground
			resolve()
		}, duration)
	})
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
	offset: number = VISUAL.OUTLINE_OFFSET,
): void {
	element.style.outline = `${width}px solid ${color}`
	element.style.outlineOffset = `${offset}px`
}
