import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { PRODUCTS, USERS } from '../utils/testData';

test.describe('Shopping cart', () => {
  let productsPage: ProductsPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openAndLogin(USERS.standard.username, USERS.standard.password);

    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    await expect(productsPage.pageTitle).toHaveText('Products');
  });

  test('should add a single product and show badge count 1', async () => {
    await productsPage.addProductToCart(PRODUCTS.backpack);

    await expect(productsPage.cartBadge).toHaveText('1');

    await productsPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(1);
    expect(await cartPage.getItemNames()).toEqual([PRODUCTS.backpack]);
  });

  test('should add multiple products and show the correct badge count', async () => {
    const selected = [PRODUCTS.backpack, PRODUCTS.bikeLight, PRODUCTS.boltTshirt];

    for (const product of selected) {
      await productsPage.addProductToCart(product);
    }

    await expect(productsPage.cartBadge).toHaveText(String(selected.length));

    await productsPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(selected.length);

    // Order in the cart is not guaranteed, so compare the sets of names.
    const namesInCart = await cartPage.getItemNames();
    expect(namesInCart.sort()).toEqual([...selected].sort());
  });

  test('should remove a product from the cart page and update the badge', async () => {
    await productsPage.addProductToCart(PRODUCTS.backpack);
    await productsPage.addProductToCart(PRODUCTS.bikeLight);
    await productsPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(2);

    await cartPage.removeItem(PRODUCTS.backpack);

    await expect(cartPage.cartItems).toHaveCount(1);
    expect(await cartPage.getItemNames()).toEqual([PRODUCTS.bikeLight]);
    await expect(cartPage.cartBadge).toHaveText('1');
  });

  test('should remove the badge entirely when the cart becomes empty', async () => {
    await productsPage.addProductToCart(PRODUCTS.backpack);
    await productsPage.openCart();

    await cartPage.removeItem(PRODUCTS.backpack);

    await expect(cartPage.cartItems).toHaveCount(0);
    // SauceDemo removes the badge element from the DOM instead of showing "0".
    await expect(cartPage.cartBadge).toHaveCount(0);
    expect(await cartPage.getCartCount()).toBe(0);
  });

  test('should remove a product directly from the products page', async () => {
    await productsPage.addProductToCart(PRODUCTS.backpack);
    await expect(productsPage.cartBadge).toHaveText('1');

    await productsPage.removeProductFromCart(PRODUCTS.backpack);

    await expect(productsPage.cartBadge).toHaveCount(0);
  });
});
