import { expect, test } from '@playwright/test';

/**
 * API tests using Playwright's built-in `request` fixture.
 *
 * SauceDemo does not expose a public API, so these tests run against
 * reqres.in - a free hosted REST API for practice.
 *
 * baseURL and the required `x-api-key` header are set by the "api" project
 * in playwright.config.ts, so the tests only deal with paths and payloads.
 */
test.describe('reqres.in API', () => {
  test('GET /api/users should return a paginated list of users', async ({ request }) => {
    const response = await request.get('/api/users?page=2');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    // Pagination metadata
    expect(body).toHaveProperty('page', 2);
    expect(body).toHaveProperty('per_page');
    expect(body).toHaveProperty('total');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    // Structure of a single user record
    const firstUser = body.data[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('first_name');
    expect(firstUser).toHaveProperty('last_name');
    expect(firstUser.email).toContain('@');
  });

  test('GET /api/users/2 should return a single user', async ({ request }) => {
    const response = await request.get('/api/users/2');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data).toMatchObject({ id: 2 });
    expect(typeof body.data.email).toBe('string');
    expect(body).toHaveProperty('support');
  });

  test('GET /api/users/23 should return 404 for a user that does not exist', async ({ request }) => {
    const response = await request.get('/api/users/23');

    // Negative case - the API must not return 200 for a missing resource.
    expect(response.status()).toBe(404);
  });

  test('POST /api/users should create a user and return 201 with the sent data', async ({ request }) => {
    const newUser = { name: 'mayuresh', job: 'qa engineer' };

    const response = await request.post('/api/users', { data: newUser });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(newUser.name);
    expect(body.job).toBe(newUser.job);
    // reqres generates these server side, so we assert they exist rather than their value.
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');
  });

  test('POST /api/login should return 400 when the password is missing', async ({ request }) => {
    const response = await request.post('/api/login', {
      data: { email: 'eve.holt@reqres.in' },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty('error', 'Missing password');
  });
});
