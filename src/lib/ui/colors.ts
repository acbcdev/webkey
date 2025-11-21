/**
 * Shared color constants for visual feedback across all websites
 */

export const COLORS = {
	FEEDBACK_COLOR: "#4CAF50",
	ERROR_COLOR: "#f44336",
	WARNING_COLOR: "#ff9800",
	DISCARDED_COLOR: "#f44336",
	MAYBE_COLOR: "#2196F3",
	CONFIDENT_COLOR: "#4CAF50",
	SELECT_COLOR: "#87909D",
} as const

export const VISUAL = {
	...COLORS,
	OUTLINE_WIDTH: 3,
	OUTLINE_OFFSET: 2,
	TRANSITION_DURATION: 300,
} as const
