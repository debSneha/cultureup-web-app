import { test, expect } from '@playwright/test';

const E2E_USERNAME = "teste2euser"
const E2E_PASSWORD = "teste2euser"
const E2E_CONTACT = "0422222220"
// const datetime=Date.now();

test.describe('Onboarding Process', () => {

    test.describe.configure({ mode: 'serial' });
  
    test.beforeEach(async ({ page }) => {
        await page.goto('#/login');
        await page.getByText('Register now').click();
        await expect(page).toHaveURL('#/register');
        await expect(page.getByRole('img', { name: 'Cultured Up All Logo' })).toBeVisible();

    });

    test("fill all details of user, skip name in emergency contact, interest and register - should throw error", async ({page}) => {
        //fill in all the details on the register page
        await page.getByPlaceholder('john@doe.com').fill(E2E_USERNAME+Date.now()+"@gmail.com");
        await page.getByPlaceholder('john doe').fill(E2E_USERNAME+Date.now());
        await page.getByPlaceholder('0412346789').fill(E2E_CONTACT);
        await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_PASSWORD);
        await page.getByPlaceholder('Make sure it matches!').fill(E2E_PASSWORD);
        await page.getByRole('checkbox').click();

        //click on register
        await page.getByRole('button', { name: 'Register' }).click();

        //navigate to the econtact page
        await expect(page).toHaveURL('#/onboarding');

        // Fill in the emergency contact details without the name
        const numberInput = "0412345678";
        await page.getByPlaceholder('0412346789').fill(numberInput);
        await page.getByRole('button', { name: "Next" }).click()
        await expect(page.getByText("Get Started")).toBeVisible();
        await expect(page).toHaveURL('#/onboarding');
                
        //Select interest
        await page.getByTestId("react-select-3-input").click();
        await expect(page.getByTestId("react-select-3-listbox")).toBeVisible();
        await page.getByTestId("react-select-3-option-0").click();
        await page.getByRole('button', { name: "Get Started" }).click()

        //Check that an error is thrown and the user is not allowed to be registered
        await expect(page.getByText('All required fields are not filled up.')).toBeVisible(); 
    });

    test("fill all details of user, skip number in emergency contact, interest and register - should throw error", async ({page}) => {
        //fill in all the details on the register page
        await page.getByPlaceholder('john@doe.com').fill(E2E_USERNAME+Date.now()+"@gmail.com");
        await page.getByPlaceholder('john doe').fill(E2E_USERNAME+Date.now());
        await page.getByPlaceholder('0412346789').fill(E2E_CONTACT);
        await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_PASSWORD);
        await page.getByPlaceholder('Make sure it matches!').fill(E2E_PASSWORD);
        await page.getByRole('checkbox').click();

        //click on register
        await page.getByRole('button', { name: 'Register' }).click();

        //navigate to the econtact page
        await expect(page).toHaveURL('#/onboarding');

        // Fill in the emergency contact details without the number
        const nameInput = "Test Emergency Contact UserName1";
        await page.getByPlaceholder('Jane Doe').fill(nameInput);
        await page.getByRole('button', { name: "Next" }).click()
        await expect(page.getByText("Get Started")).toBeVisible();
        await expect(page).toHaveURL('#/onboarding');
                
        //Select interest
        await page.getByTestId("react-select-3-input").click();
        await expect(page.getByTestId("react-select-3-listbox")).toBeVisible();
        await page.getByTestId("react-select-3-option-0").click();
        await page.getByRole('button', { name: "Get Started" }).click()

        //Check that an error is thrown and the user is not allowed to be registered
        await expect(page.getByText('All required fields are not filled up.')).toBeVisible(); 
    });

    test("fill all details of user, wrong number in emergency contact, interest and register - should throw error", async ({page}) => {
        //fill in all the details on the register page
        await page.getByPlaceholder('john@doe.com').fill(E2E_USERNAME+Date.now()+"@gmail.com");
        await page.getByPlaceholder('john doe').fill(E2E_USERNAME+Date.now());
        await page.getByPlaceholder('0412346789').fill(E2E_CONTACT);
        await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_PASSWORD);
        await page.getByPlaceholder('Make sure it matches!').fill(E2E_PASSWORD);
        await page.getByRole('checkbox').click();

        //click on register
        await page.getByRole('button', { name: 'Register' }).click();

        //navigate to the econtact page
        await expect(page).toHaveURL('#/onboarding');

        // Fill in the emergency contact details with wrong number
        const nameInput = "Test Emergency Contact UserName1";
        await page.getByPlaceholder('Jane Doe').fill(nameInput);
        const numberInput = "041234567";
        await page.getByPlaceholder('0412346789').fill(numberInput);
        await page.getByRole('button', { name: "Next" }).click()
        await expect(page.getByText("Get Started")).toBeVisible();
        await expect(page).toHaveURL('#/onboarding');
                
        //Select interest
        await page.getByTestId("react-select-3-input").click();
        await expect(page.getByTestId("react-select-3-listbox")).toBeVisible();
        await page.getByTestId("react-select-3-option-0").click();
        await page.getByRole('button', { name: "Get Started" }).click()

        //Check that an error is thrown and the user is not allowed to be registered
        await expect(page.getByText('Contact number not in format')).toBeVisible(); 
    });

    test("register user without onboarding, check if user logs in again the user is navigated to econtact page", async ({page}) => {
        //fill in all the details on the register page
        await page.getByPlaceholder('john@doe.com').fill(E2E_USERNAME+Date.now()+"@gmail.com");
        const user_email = await page.getByPlaceholder('john@doe.com').inputValue();
        await page.getByPlaceholder('john doe').fill(E2E_USERNAME+Date.now());
        await page.getByPlaceholder('0412346789').fill(E2E_CONTACT);
        await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_PASSWORD);
        await page.getByPlaceholder('Make sure it matches!').fill(E2E_PASSWORD);
        await page.getByRole('checkbox').click();

        //click on register
        await page.getByRole('button', { name: 'Register' }).click();

        //navigate to the econtact page
        await expect(page).toHaveURL('#/onboarding');

        //click on logout link
        await page.goto('#/signout');

        //check that it navigates to the login page
        await expect(page).toHaveURL('#/login');

        //Login using same user credentials
        await page.getByPlaceholder('john@doe.com').fill(user_email);
        await page.getByPlaceholder('Minimum 6 characters.').fill(E2E_PASSWORD);
        // await page.getByRole('checkbox').click();
        await page.getByRole('button', { name: 'Login' }).click();
    
        //Check toast to see if user is logged in
        await expect(page.getByText("You're logged in!")).toBeVisible();
        await expect(page.getByText("A loved one's number")).toBeVisible();
        
        //ensure that the user can log in but is navigated to e-contact page
        await expect(page).toHaveURL('#/onboarding');

    });
    
});  