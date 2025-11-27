/**
 * Global constants - shortcuts that work across all websites
 */
import { isMac } from "@/lib/platform/detection";

export const GLOBAL_SHORTCUTS = {
  GO_TO_HOME: isMac() ? "command+shift+h" : "ctrl+shift+h",
} as const;
