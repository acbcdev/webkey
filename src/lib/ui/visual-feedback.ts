/**
 * Shared visual feedback utilities for user interactions
 * Used across multiple modules (clipboard, etc.)
 * For quiz-specific visual styling, see features/platzi/quiz/mark-states.ts
 */

import {
	type ToastPosition,
	type ToastSize,
	toastConfig,
} from "@/lib/storage/toast-config"
import { VISUAL } from "./colors"

const POSITION_STYLES: Record<ToastPosition, Partial<CSSStyleDeclaration>> = {
	"bottom-right": { bottom: "24px", right: "24px" },
	"bottom-left": { bottom: "24px", left: "24px" },
	"top-right": { top: "24px", right: "24px" },
	"top-left": { top: "24px", left: "24px" },
	"top-center": { top: "24px", left: "50%", transform: "translateX(-50%)" },
	"bottom-center": {
		bottom: "24px",
		left: "50%",
		transform: "translateX(-50%)",
	},
}

const SIZE_STYLES: Record<ToastSize, { padding: string; fontSize: string }> = {
	sm: { padding: "6px 12px", fontSize: "12px" },
	md: { padding: "10px 16px", fontSize: "14px" },
	lg: { padding: "14px 20px", fontSize: "16px" },
}

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
 * Show a temporary toast notification in the corner of the viewport
 * @param message - Text to display
 * @param duration - Duration in milliseconds before fading out (defaults to 1500ms)
 */
export function toast(message: string, duration: number = 1500): void {
	toastConfig.getValue().then((config) => {
		const el = document.createElement("div")
		el.textContent = message

		const positionStyle = POSITION_STYLES[config.position]
		const sizeStyle = SIZE_STYLES[config.size]

		Object.assign(el.style, {
			position: "fixed",
			...positionStyle,
			...sizeStyle,
			background: VISUAL.FEEDBACK_COLOR,
			color: "#fff",
			borderRadius: "8px",
			fontFamily: "system-ui, -apple-system, sans-serif",
			fontWeight: "600",
			zIndex: "2147483647",
			opacity: "1",
			transition: `opacity ${VISUAL.TRANSITION_DURATION}ms`,
			pointerEvents: "none",
		})

		document.body.appendChild(el)

		setTimeout(() => {
			el.style.opacity = "0"
			setTimeout(() => el.remove(), VISUAL.TRANSITION_DURATION)
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
