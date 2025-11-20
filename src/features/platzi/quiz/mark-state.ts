/**
 * Platzi quiz mark state management
 */

import { VISUAL } from "@/lib/ui/colors"

export type MarkState = "discarded" | "maybe" | "confident"

/**
 * Manage mark states for quiz options
 */
export class MarkStateManager {
	private markedStates: Map<number, MarkState> = new Map()

	/**
	 * Set a mark state for an option
	 */
	setMarkState(index: number, state: MarkState): void {
		this.markedStates.set(index, state)
	}

	/**
	 * Get the mark state for an option
	 */
	getMarkState(index: number): MarkState | undefined {
		return this.markedStates.get(index)
	}

	/**
	 * Remove a mark state
	 */
	removeMarkState(index: number): void {
		this.markedStates.delete(index)
	}

	/**
	 * Clear all mark states
	 */
	clearAllMarkStates(): void {
		this.markedStates.clear()
	}

	/**
	 * Check if any states exist
	 */
	hasMarkStates(): boolean {
		return this.markedStates.size > 0
	}

	/**
	 * Get all marked indices
	 */
	getMarkedIndices(): number[] {
		return Array.from(this.markedStates.keys())
	}
}

/**
 * Get the color for a mark state
 */
export function getMarkStateColor(state: MarkState): string {
	const colorMap: Record<MarkState, string> = {
		discarded: VISUAL.DISCARDED_COLOR,
		maybe: VISUAL.MAYBE_COLOR,
		confident: VISUAL.CONFIDENT_COLOR,
	}
	return colorMap[state]
}

/**
 * Get the cycle order for mark states
 */
export function getMarkStateCycle(
	direction: "forward" | "backward",
): (MarkState | null)[] {
	const forwardCycle: (MarkState | null)[] = [
		null,
		"maybe",
		"confident",
		"discarded",
	]
	const backwardCycle: (MarkState | null)[] = [
		null,
		"discarded",
		"confident",
		"maybe",
	]
	return direction === "forward" ? forwardCycle : backwardCycle
}

/**
 * Get the next mark state in the cycle
 */
export function getNextMarkState(
	currentState: MarkState | undefined,
	direction: "forward" | "backward",
): MarkState | null {
	const cycle = getMarkStateCycle(direction)
	const currentIndex = cycle.indexOf(currentState ?? null)
	const nextIndex = (currentIndex + 1) % cycle.length
	return cycle[nextIndex]
}
