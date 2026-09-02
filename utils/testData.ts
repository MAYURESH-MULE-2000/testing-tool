/**
 * Central place for test data so credentials and inputs are not
 * duplicated across spec files.
 *
 * These are the public demo accounts published on https://www.saucedemo.com -
 * they are not real secrets.
 */

export const USERS = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  invalidPassword: {
    username: 'standard_user',
    password: 'wrong_password',
  },
} as const;

export const LOGIN_ERRORS = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  invalidCredentials:
    'Epic sadface: Username and password do not match any user in this service',
} as const;

/** Checkout form data used by the checkout flow tests. */
export const CHECKOUT_INFO = {
  firstName: 'Mayuresh',
  lastName: 'Tester',
  postalCode: '411001',
} as const;

/** Product names used across the cart / checkout tests. */
export const PRODUCTS = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTshirt: 'Sauce Labs Bolt T-Shirt',
} as const;

/** Total number of products SauceDemo shows on the inventory page. */
export const EXPECTED_PRODUCT_COUNT = 6;
