/**
 * Selects the first element that matches the specified CSS selector.
 * @template T The type of element to select, defaults to Element.
 * @param query - The CSS selector string.
 * @param context - The document or element to search within. Defaults to the global document.
 * @returns The first matching element of type T, or null if no match is found.
 */
export function $<T extends HTMLElement>(
  query: string,
  context: Document | HTMLElement = document
): T | null {
  return context.querySelector(query) as T | null;
}

/**
 * Selects all elements that match the specified CSS selector.
 * @template T The type of elements to select, defaults to Element.
 * @param query - The CSS selector string.
 * @param context - The document or element to search within. Defaults to the global document.
 * @returns A NodeList of all matching elements of type T.
 */
export function $$<T extends HTMLElement>(
  query: string,
  context: Document | HTMLElement = document
): NodeListOf<T> {
  return context.querySelectorAll(query) as NodeListOf<T>;
}
