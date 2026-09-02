import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { LOGIN_ERRORS, USERS } from '../utils/testData';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should log in successfully with valid standard user credentials', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await loginPage.login(USERS.standard.username, USERS.standard.password);

    // Landing on /inventory.html with the products list visible proves the login worked.
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(productsPage.pageTitle).toHaveText('Products');
    await expect(productsPage.productItems.first()).toBeVisible();
  });

  test('should show an error message for a locked out user', async () => {
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(LOGIN_ERRORS.lockedOut);
  });

  test('should show an error message for an invalid password', async ({ page }) => {
    await loginPage.login(USERS.invalidPassword.username, USERS.invalidPassword.password);

    await expect(loginPage.errorMessage).toHaveText(LOGIN_ERRORS.invalidCredentials);
    // The user must stay on the login page when authentication fails.
    await expect(page).not.toHaveURL(/.*inventory.html/);
  });

  test('should show an error message when credentials are empty', async () => {
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
  });
});
