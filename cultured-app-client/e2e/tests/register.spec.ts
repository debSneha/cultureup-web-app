import { test, expect } from '@playwright/test';

const E2E_WRONG_EMAIL= "test"
const E2E_EMAIL = "testuser@gmail.com"
const E2E_USERNAME = "testuser"
const E2E_PASSWORD = "test@1234"
const E2E_SMALL_PASSWORD = "abc"
const datetime=Date.now();

test.describe('Register Page', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto('#/login');
    await page.getByText('Register now').click();
    await expect(page).toHaveURL('#/register');
    await expect(page.getByRole('img', { name: 'Cultured Up All Logo' })).toBeVisible();
  });

  test('should render register page', async ({ page }) => {
    await expect(page.getByText('Welcome!')).toBeVisible();
    await expect(page.getByText('Enter your details to get started.')).toBeVisible();
    await expect(page.getByText("Email")).toBeVisible();
    await expect(page.getByText("Username")).toBeVisible();
    await expect(page.getByText('Password', { exact: true })).toBeVisible();
    await expect(page.getByText('Confirm Password')).toBeVisible();
    await expect(page.getByText('I agree to the terms of service')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    await expect(page.getByText('Already have an account? Login')).toBeVisible();
    await expect(page.getByRole('img', { name: 'all hands in' })).toBeVisible();
  });

  test('should redirect to login page', async ({ page }) => {
    await page.getByText('Login').click();
    await expect(page).toHaveURL('#/login');
  });

 test('should throw error on entering wrong email', async ({ page }) => {
    await page.getByPlaceholder('john@doe.com').fill(E2E_WRONG_EMAIL);
    await page.getByPlaceholder('john doe').fill(E2E_USERNAME);
    await page.getByPlaceholder("0412346789").fill("0412346789");
    await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_PASSWORD);
    await page.getByPlaceholder('Make sure it matches!').fill(E2E_PASSWORD);
    await page.getByRole('checkbox').click();
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('Please check your email')).toBeVisible();
  });

  test('should throw error on entering unmatched passwords', async ({ page }) => {
    await page.getByPlaceholder('john@doe.com').fill(E2E_EMAIL);
    await page.getByPlaceholder('john doe').fill(E2E_USERNAME);
    await page.getByPlaceholder("0412346789").fill("0412346789");
    await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_PASSWORD);
    await page.getByPlaceholder('Make sure it matches!').fill(E2E_PASSWORD + " ");
    await page.getByRole('checkbox').click();
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('Make sure your password match up!')).toBeVisible();
  });

  test('should throw error on entering passwords that is less than 6 characters', async ({ page }) => {
    await page.getByPlaceholder('john@doe.com').fill(E2E_EMAIL);
    await page.getByPlaceholder('john doe').fill(E2E_USERNAME);
    await page.getByPlaceholder("0412346789").fill("0412346789");
    await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_SMALL_PASSWORD);
    await page.getByPlaceholder('Make sure it matches!').fill(E2E_SMALL_PASSWORD);
    await page.getByRole('checkbox').click();
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('Your password should at least be 6 characters long')).toBeVisible();
  });

  test('should register with proper credentials', async ({ page }) => {

    await page.getByPlaceholder('john@doe.com').fill(E2E_USERNAME+datetime+"@gmail.com");
    await page.getByPlaceholder('john doe').fill(E2E_USERNAME+datetime);
    await page.getByPlaceholder("0412346789").fill("0412346789");
    await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_PASSWORD+datetime);
    await page.getByPlaceholder('Make sure it matches!').fill(E2E_PASSWORD+datetime);
    await page.getByRole('checkbox').click();
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page).toHaveURL('#/onboarding');

  });
});
