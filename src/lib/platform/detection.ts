/**
 * Platform detection utilities for cross-platform compatibility
 */

/**
 * Detect if running on macOS
 * @returns true if the platform is macOS or iOS
 */
export function isMac(): boolean {
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

/**
 * Detect if running on Windows
 * @returns true if the platform is Windows
 */
export function isWindows(): boolean {
  return /Windows|Win32/.test(navigator.userAgent);
}

/**
 * Detect if running on Linux
 * @returns true if the platform is Linux
 */
export function isLinux(): boolean {
  return /Linux|X11/.test(navigator.userAgent);
}
