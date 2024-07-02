import { test, expect } from '@playwright/test';

const E2E_EMAIL = "test@gmail.com"
const E2E_PASSWORD = "test@1234"

test.describe.skip('Reset Password Page', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto('#/login');
    await expect(page.getByRole('img', { name: 'Cultured Up All Logo' })).toBeVisible();
    await page.getByText('Forgot Password?').click();
    await expect(page).toHaveURL('#/reset-password');
  });

  test('should render forget password page', async ({ page }) => {
    await expect(page.getByText('Forgot your password?')).toBeVisible();
    await expect(page.getByText('Don\'t fret! We\'ll send you reset instructions.')).toBeVisible();
    await expect(page.getByText("Email")).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
    await expect(page.getByText('Reset done? Back to Login')).toBeVisible();
    await expect(page.getByRole('img', { name: 'all hands in' })).toBeVisible();
  });

  test('should go back to login page', async ({ page }) => {
    await page.getByText('Back to Login').click();
    await expect(page).toHaveURL('#/login');
  });

  test('should show success message after submitting valid registered email', async ({ page }) => {
    // enter valid email
    await page.getByPlaceholder('john@doe.com').fill('admin@gmail.com'); 
    //click on submit
    await page.getByRole('button', { name: 'Send' }).click();
    //check the toast
    await expect(page.getByText('Instructions sent to your inbox!')).toBeVisible(); 
  });

  test('should show error message after submitting invalid email', async ({ page }) => {
    // enter invalid email
    await page.getByPlaceholder('john@doe.com').fill('1234'); 
    //click on submit
    await page.getByRole('button', { name: 'Send' }).click();
    //check the toast
    await expect(page.getByText('Please check your email')).toBeVisible(); 
  });

  test('should show error message after submitting a valid unregistered email', async ({ page }) => {
    // enter unregistered email
    await page.getByPlaceholder('john@doe.com').fill('testuser@gmail.com'); 
    //click on submit
    await page.getByRole('button', { name: 'Send' }).click();
    //check the toast
    await expect(page.getByText('User not found. Please register with us.')).toBeVisible(); 
  });

});