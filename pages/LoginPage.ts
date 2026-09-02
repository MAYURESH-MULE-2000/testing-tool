import { Locator, Page } from '@playwright/test';

/**
 * Page Object for the SauceDemo login page (https://www.saucedemo.com).
 * Holds every selector for this page so the spec files stay selector-free.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    // SauceDemo exposes stable data-test attributes - preferred over CSS classes.
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /** Opens the login page. baseURL comes from playwright.config.ts. */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /** Fills the credentials and submits the login form. */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Convenience wrapper used by tests that only need to be logged in. */
  async openAndLogin(username: string, password: string): Promise<void> {
    await this.goto();
    await this.login(username, password);
  }

  /** Returns the visible error banner text (used for negative login tests). */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }
}
