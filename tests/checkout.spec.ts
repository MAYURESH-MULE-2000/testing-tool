import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CHECKOUT_INFO, PRODUCTS, USERS } from '../utils/testData';

test.describe('Checkout flow', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openAndLogin(USERS.standard.username, USERS.standard.password);

    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Every checkout test starts from a cart that already has one product.
    await productsPage.addProductToCart(PRODUCTS.backpack);
    await productsPage.openCart();
    await cartPage.proceedToCheckout();
  });

  test('should complete an order end to end and show the confirmation message', async ({ page }) => {
    await checkoutPage.fillCustomerInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode,
    );

    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Overview');
    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.confirmationText).toBeVisible();
    // The cart badge is cleared once the order has been placed.
    await expect(productsPage.cartBadge).toHaveCount(0);
  });

  test('should show the selected product and a correct total on the order summary', async () => {
    await checkoutPage.fillCustomerInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode,
    );

    await expect(checkoutPage.summaryItems).toHaveCount(1);

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    // Total must equal subtotal + tax. Rounded to 2 decimals to avoid
    // floating point noise such as 32.389999999999995.
    expect(Number((subtotal + tax).toFixed(2))).toBe(total);
  });

  test('should not continue when the checkout form is submitted empty', async () => {
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
    await expect(checkoutPage.pageTitle).toHaveText('Checkout: Your Information');
  });

  test('should require a postal code before continuing', async () => {
    await checkoutPage.firstNameInput.fill(CHECKOUT_INFO.firstName);
    await checkoutPage.lastNameInput.fill(CHECKOUT_INFO.lastName);
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
  });
});
