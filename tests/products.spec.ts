import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { EXPECTED_PRODUCT_COUNT, USERS } from '../utils/testData';

test.describe('Product listing', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openAndLogin(USERS.standard.username, USERS.standard.password);
    productsPage = new ProductsPage(page);
    await expect(productsPage.pageTitle).toHaveText('Products');
  });

  test('should display all products with a name and a price', async () => {
    await expect(productsPage.productItems).toHaveCount(EXPECTED_PRODUCT_COUNT);

    const names = await productsPage.getProductNames();
    const prices = await productsPage.getProductPrices();

    // Every listed product must have a non-empty name and a positive price.
    expect(names.every((name) => name.trim().length > 0)).toBe(true);
    expect(prices.every((price) => price > 0)).toBe(true);
  });

  test('should sort products by price from low to high', async () => {
    await productsPage.sortBy('lohi');

    const prices = await productsPage.getProductPrices();
    // Compare the page order against a locally sorted copy of the same values.
    const expected = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(expected);
  });

  test('should sort products by price from high to low', async () => {
    await productsPage.sortBy('hilo');

    const prices = await productsPage.getProductPrices();
    const expected = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(expected);
  });

  test('should sort products by name from A to Z', async () => {
    await productsPage.sortBy('az');

    const names = await productsPage.getProductNames();
    const expected = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(expected);
  });

  test('should sort products by name from Z to A', async () => {
    await productsPage.sortBy('za');

    const names = await productsPage.getProductNames();
    const expected = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(expected);
  });
});
