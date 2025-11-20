/**
 * Quiz-specific visual styling for option marks and highlighting
 * Handles mark state styling (discarded/maybe/confident) and option highlighting
 */

import {
	check as checkIcon,
	question as questionIcon,
	x as xIcon,
} from "@/features/platzi/icons";
import { $ } from "@/lib/dom/query";
import { VISUAL } from "@/lib/ui/colors";

/**
 * Get the SVG icon for a mark state
 */
function getIconForState(state: "discarded" | "maybe" | "confident"): string {
	const iconMap: Record<"discarded" | "maybe" | "confident", string> = {
		discarded: xIcon,
		maybe: questionIcon,
		confident: checkIcon,
	};
	return iconMap[state];
}

/**
 * Apply mark state to element with custom styling
 * @param element - Element to mark
 * @param state - State type ("discarded", "maybe", or "confident")
 * @param color - Color for the mark
 * @param decoration - Text decoration style ("line-through" or "underline")
 */
function applyMarkState(
	element: HTMLElement,
	state: "discarded" | "maybe" | "confident",
	color: string,
	decoration: "line-through" | "underline",
	optionLetterSelector: string,
	optionTextSelector: string,
): void {
	element.style.border = `1px solid ${color}`;
	element.setAttribute("data-mark-state", state);
	const letter = $(optionLetterSelector, element);
	const text = $(optionTextSelector, element);
	if (text) {
		text.style.textDecoration = decoration;
		text.style.textDecorationColor = color;
	}
	if (letter) {
		letter.style.backgroundColor = color;
		letter.style.borderRadius = "0";
		element.style.overflow = "hidden";
		letter.style.position = "relative";

		// Remove ALL existing icons from previous states
		const existingIcons = letter.querySelectorAll(".mark-state-icon");

		existingIcons.forEach((icon) => {
			icon.remove();
		});

		// Hide the letter text with opacity (the actual letter like A, B, C, D)
		const letterText = letter.querySelector("span");
		if (letterText) {
			letterText.style.opacity = "0";
			letterText.style.transition = "opacity 300ms ease-in-out";
		}

		// Inject SVG icon into letter box
		const iconSvg = getIconForState(state);
		const iconWrapper = document.createElement("div");
		iconWrapper.className = "mark-state-icon";
		iconWrapper.innerHTML = iconSvg;
		iconWrapper.style.cssText = `
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			opacity: 0;
			transition: opacity 300ms ease-in-out;
			color: white;
			pointer-events: none;
		`;

		// Apply color to SVG strokes
		const svg = iconWrapper.querySelector("svg");
		if (svg) {
			svg.style.stroke = "white";
			svg.style.width = "18px";
			svg.style.height = "18px";
		}

		// Append new icon
		letter.appendChild(iconWrapper);

		// Trigger animation
		requestAnimationFrame(() => {
			iconWrapper.style.opacity = "1";
		});
	}
}

/**
 * Mark element as discarded (wrong answer)
 * @param element - Element to mark as discarded
 */
export function markAsDiscarded(
	element: HTMLElement,
	optionLetterSelector: string,
	optionTextSelector: string,
): void {
	applyMarkState(
		element,
		"discarded",
		VISUAL.DISCARDED_COLOR,
		"line-through",
		optionLetterSelector,
		optionTextSelector,
	);
}

/**
 * Mark element as maybe (uncertain answer)
 * @param element - Element to mark as maybe
 */
export function markAsMaybe(
	element: HTMLElement,
	optionLetterSelector: string,
	optionTextSelector: string,
): void {
	applyMarkState(
		element,
		"maybe",
		VISUAL.MAYBE_COLOR,
		"underline",
		optionLetterSelector,
		optionTextSelector,
	);
}

/**
 * Mark element as confident (sure it's correct)
 * @param element - Element to mark as confident
 */
export function markAsConfident(
	element: HTMLElement,
	optionLetterSelector: string,
	optionTextSelector: string,
): void {
	applyMarkState(
		element,
		"confident",
		VISUAL.CONFIDENT_COLOR,
		"underline",
		optionLetterSelector,
		optionTextSelector,
	);
}

/**
 * Clear mark state from element (return to idle)
 * @param element - Element to clear mark state from
 */
export function clearMarkState(
	element: HTMLElement,
	optionLetterSelector: string,
	optionTextSelector: string,
): void {
	element.style.border = "";
	element.style.textDecoration = "";
	element.removeAttribute("data-mark-state");
	const letter = $(optionLetterSelector, element);
	const text = $(optionTextSelector, element);
	if (letter) {
		letter.style.backgroundColor = "";
		letter.style.position = "";
		// Remove ALL injected icons
		const icons = letter.querySelectorAll(".mark-state-icon");
		icons.forEach((icon) => {
			icon.remove();
		});
		// Restore letter text opacity
		const letterText = letter.querySelector("span");
		if (letterText) {
			letterText.style.opacity = "";
			letterText.style.transition = "";
		}
	}
	if (text) text.style.textDecoration = "";
}

/**
 * Clear outline from element
 */
export function clearOutline(element: HTMLElement): void {
	element.style.outline = "";
	element.style.outlineOffset = "";
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
	color: string = VISUAL.FEEDBACK_COLOR,
): void {
	// Clear all previous highlights
	allElements.forEach((el) => {
		clearOutline(el);
	});

	// Highlight the selected element
	if (selectedElement) {
		selectedElement.style.outline = `3px solid ${color}`;
		selectedElement.style.outlineOffset = "2px";
	}
}
