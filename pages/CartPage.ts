import { Locator, Page } from '@playwright/test';
import { toProductSlug } from '../utils/helpers';

/**
 * Page Object for the shopping cart page (/cart.html).
 */
export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  /** Number of line items currently in the cart. */
  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /** Names of the products listed in the cart. */
  async getItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  /** Removes one product from the cart by its display name. */
  async removeItem(productName: string): Promise<void> {
    await this.page.locator(`[data-test="remove-${toProductSlug(productName)}"]`).click();
  }

  /** Cart badge count as a number; 0 when the cart is empty (badge removed). */
  async getCartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) {
      return 0;
    }
    return Number(await this.cartBadge.innerText());
  }

  /** Starts the checkout flow. */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
