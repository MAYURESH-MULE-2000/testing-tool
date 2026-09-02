import { Locator, Page } from '@playwright/test';
import { parsePrice, toProductSlug } from '../utils/helpers';

/** Values accepted by the SauceDemo sort dropdown. */
export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * Page Object for the products / inventory page shown right after login.
 */
export class ProductsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.productItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.cartLink = page.locator('.shopping_cart_link');
    // The badge only exists in the DOM once the cart has at least one item.
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  /** True once the inventory list is rendered - used as a login assertion. */
  async isLoaded(): Promise<boolean> {
    return this.productItems.first().isVisible();
  }

  /** Number of products currently listed. */
  async getProductCount(): Promise<number> {
    return this.productItems.count();
  }

  /** All product names in the order they appear on the page. */
  async getProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  /** All product prices as numbers, in page order (e.g. [29.99, 9.99]). */
  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.productPrices.allTextContents();
    return priceTexts.map(parsePrice);
  }

  /** Selects an option in the "Sort products" dropdown. */
  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Adds a product to the cart by its display name.
   * The button id is derived from the product name (see toProductSlug).
   */
  async addProductToCart(productName: string): Promise<void> {
    await this.page.locator(`[data-test="add-to-cart-${toProductSlug(productName)}"]`).click();
  }

  /** Removes a product from the cart directly on the products page. */
  async removeProductFromCart(productName: string): Promise<void> {
    await this.page.locator(`[data-test="remove-${toProductSlug(productName)}"]`).click();
  }

  /** Cart badge count as a number; returns 0 when the badge is absent. */
  async getCartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) {
      return 0;
    }
    return Number(await this.cartBadge.innerText());
  }

  /** Opens the cart page via the header cart icon. */
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
