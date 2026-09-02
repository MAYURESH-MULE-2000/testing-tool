import { Locator, Page } from '@playwright/test';
import { parsePrice } from '../utils/helpers';

/**
 * Page Object covering the three checkout screens:
 *   step one    -> customer information form
 *   step two    -> order summary / overview
 *   complete    -> order confirmation
 *
 * They are grouped in a single class because they are one continuous
 * user flow and share the same navigation controls.
 */
export class CheckoutPage {
  readonly page: Page;

  // Step one - "Your Information"
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step two - "Overview"
  readonly summaryItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  // Complete - "Checkout: Complete!"
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;
  readonly backHomeButton: Locator;

  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.summaryItems = page.locator('.cart_item');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');

    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');

    this.pageTitle = page.locator('.title');
  }

  /** Fills the customer information form and moves to the order summary. */
  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /** Item subtotal shown on the overview screen, e.g. "Item total: $29.99" -> 29.99. */
  async getSubtotal(): Promise<number> {
    const text = (await this.subtotalLabel.innerText()).split('$')[1];
    return parsePrice(text);
  }

  /** Tax amount shown on the overview screen. */
  async getTax(): Promise<number> {
    const text = (await this.taxLabel.innerText()).split('$')[1];
    return parsePrice(text);
  }

  /** Grand total shown on the overview screen. */
  async getTotal(): Promise<number> {
    const text = (await this.totalLabel.innerText()).split('$')[1];
    return parsePrice(text);
  }

  /** Number of products listed on the order summary. */
  async getSummaryItemCount(): Promise<number> {
    return this.summaryItems.count();
  }

  /** Submits the order. */
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  /** Confirmation headline shown after a successful order. */
  async getConfirmationMessage(): Promise<string> {
    return (await this.confirmationHeader.innerText()).trim();
  }
}
