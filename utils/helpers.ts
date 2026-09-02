/**
 * Small helper functions shared by the tests.
 * Kept intentionally minimal - anything page specific belongs in a Page Object.
 */

/** Converts a SauceDemo price string such as "$29.99" into the number 29.99. */
export function parsePrice(price: string): number {
  return Number(price.replace('$', '').trim());
}

/**
 * SauceDemo builds its add/remove button ids from the product name,
 * e.g. "Sauce Labs Bike Light" -> "sauce-labs-bike-light".
 * Turning the name into that slug keeps tests readable (they pass a real
 * product name) while the Page Object handles the selector detail.
 */
export function toProductSlug(productName: string): string {
  return productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
