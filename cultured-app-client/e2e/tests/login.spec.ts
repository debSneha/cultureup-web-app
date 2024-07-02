import { test, expect, Page } from '@playwright/test';

const E2E_USERNAME = "teste2euser"
const E2E_PASSWORD = "teste2euser"
const E2E_WRONG_EMAIL= "test"
const E2E_WRONG_PASSWORD= "test@1234"
const E2E_CONTACT = "0422222221"
const datetime=Date.now();

const registerUser = async (page: Page) => {
  await page.goto('#/register');

  //fill in all the details on the register page
  await page.getByPlaceholder('john@doe.com').fill(E2E_USERNAME+datetime+"@gmail.com");
  await page.getByPlaceholder('john doe').fill(E2E_USERNAME+datetime);
  await page.getByPlaceholder('0412346789').fill(E2E_CONTACT);
  await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_PASSWORD);
  await page.getByPlaceholder('Make sure it matches!').fill(E2E_PASSWORD);
  // await page.getByRole('checkbox').click();
  //click on register
  await page.getByRole('button', { name: 'Register' }).click();
}

test.describe('Login Page', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto('#/login');
    await expect(page.getByRole('img', { name: 'Cultured Up All Logo' })).toBeVisible();
  });

  test.beforeAll(async({browser}) => {
    let page: Page = await browser.newPage();
    await registerUser(page);
  })

  test('should render login page', async ({ page }) => {
    await expect(page.getByText('Hi Again!')).toBeVisible();
    await expect(page.getByText('Enter your details to continue.')).toBeVisible();
    await expect(page.getByText("Email")).toBeVisible();
    await expect(page.getByText('Password', { exact: true })).toBeVisible();
    //  await expect(page.getByText('Remember me')).toBeVisible();
    await expect(page.getByText('Forgot Password?')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByText('Don\'t have an account? Register now')).toBeVisible();
    await expect(page.getByRole('img', { name: 'all hands in' })).toBeVisible();
  });

  test('should login with correct credentials', async ({ page }) => {
    await page.getByPlaceholder('john@doe.com').fill(E2E_USERNAME+datetime+"@gmail.com");
    await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    //Check toast to see if user is logged in
    await expect(page.getByText("You're logged in!")).toBeVisible();
  });

  test('should throw error on entering wrong email', async ({ page }) => {
    await page.getByPlaceholder('john@doe.com').fill(E2E_WRONG_EMAIL);
    await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Please check your email')).toBeVisible();
  });

    test('should throw error on entering wrong password', async ({ page }) => {
    await page.getByPlaceholder('john@doe.com').fill(E2E_USERNAME+datetime+"@gmail.com");

    await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_WRONG_PASSWORD);

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Incorrect username or password')).toBeVisible();
  });

  test('should throw error on missing email', async ({ page }) => {
    //Enter password but skip email
    await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('All required fields are not filled up.')).toBeVisible();
  });

  test('should throw error on missing password', async ({ page }) => {
    //Enter email but skip password
    await page.getByPlaceholder('john@doe.com').fill(E2E_USERNAME+datetime+"@gmail.com");
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('All required fields are not filled up.')).toBeVisible();
  });

  test('should navigate to forgot password page', async({ page }) => {
    await expect(page.getByText("Forgot Password?")).toBeVisible();
    await page.getByText('Forgot Password?').click();

    await expect(page).toHaveURL('#/reset-password');
  });

  test('should navigate to register page', async({ page }) => {
    await expect(page.getByText("Register now")).toBeVisible();
    await page.getByText('Register now').click();

    await expect(page).toHaveURL('#/register');
  });

});