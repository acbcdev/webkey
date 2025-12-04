/**
 * ChatGPT-specific constants
 */

import { isMac } from "@/lib/platform/detection"

export const CHATGPT_SELECTORS = {
	// Using data-testid - most stable selector (test attributes rarely change)
	COPY_BUTTON: 'button[data-testid="copy-turn-action-button"]',
} as const

export const CHATGPT_SHORTCUTS = {
	COPY_LAST_RESPONSE: "alt+c",
} as const
