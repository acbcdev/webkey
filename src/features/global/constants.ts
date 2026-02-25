/**
 * Global constants - shortcuts that work across all websites
 */
import { isMac } from "@/lib/platform/detection"

export const GLOBAL_SHORTCUTS = {
	GO_TO_HOME: isMac() ? "command+shift+h" : "ctrl+shift+h",
	OPEN_HOME_NEW_TAB: isMac() ? "command+option+t" : "ctrl+alt+t",
	OPEN_CURRENT_NEW_TAB: isMac() ? "command+option+shift+t" : "ctrl+alt+shift+t",
} as const
