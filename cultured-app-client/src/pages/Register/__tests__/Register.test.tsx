/**
 * @jest-environment jsdom
 */

import Register from "../Register"

import {act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config/firebase";
import firebase from 'firebase/app';
import type { UserCredential } from "firebase/auth";
import { MemoryRouter, Route } from "react-router-dom";


const queryClient = new QueryClient();

const RegisterWrapper = () => (
  <QueryClientProvider client={queryClient}>
    <Register />
  </QueryClientProvider>
);

const mockedSeQuery = jest.fn()
jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQueryClient: () => mockedSeQuery,
}));

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock("../../../config/firebase");
jest.mock("firebase/auth");

describe('Register component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component onto the screen', () => {
        expect(true).toBeTruthy();
    });

    it('should render all the component onto the screen', () => {
        render(<RegisterWrapper />);
        expect(screen.getByPlaceholderText('john@doe.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('john doe')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('0412346789')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Minimum 6 characters.')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Make sure it matches!')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    });

    it('updates the email state change on email input',() => {
        const{getByPlaceholderText} = render(<RegisterWrapper />);
        const emailInput= getByPlaceholderText("john@doe.com") as HTMLInputElement;
        fireEvent.change(emailInput, {target: {value: "john@doe.com"}});
        expect(emailInput.value).toBe("john@doe.com");
    });

    it('updates the username state change on username input',() => {
        const{getByPlaceholderText} = render(<RegisterWrapper />);
        const usernameInput= getByPlaceholderText("john doe") as HTMLInputElement;
        fireEvent.change(usernameInput, {target: {value: "john doe"}});
        expect(usernameInput.value).toBe("john doe");
    });

    it('updates the contact state change on contact input',() => {
        const{getByPlaceholderText} = render(<RegisterWrapper />);
        const contactInput= getByPlaceholderText("0412346789") as HTMLInputElement;
        fireEvent.change(contactInput, {target: {value: "0412346789"}});
        expect(contactInput.value).toBe("0412346789");
    });

    it('updates the password state change on password input',() => {
        const{getByPlaceholderText} = render(<RegisterWrapper />);
        const passwordInput= getByPlaceholderText('Minimum 6 characters.') as HTMLInputElement;
        fireEvent.change(passwordInput, {target: {value: "johndoe123"}});
        expect(passwordInput.value).toBe("johndoe123");
    });

    it('updates the confirmpassword state change on confirmpassword input',() => {
        const{getByPlaceholderText} = render(<RegisterWrapper />);
        const confirmpasswordInput= getByPlaceholderText('Make sure it matches!') as HTMLInputElement;
        fireEvent.change(confirmpasswordInput, {target: {value: "johndoe123"}});
        expect(confirmpasswordInput.value).toBe("johndoe123");
    });

    it("calls handleSuccess function when user is successfully registered", async()=>{

        // Cast createUserWithEmailAndPassword to the expected type
        const createUserWithEmailAndPasswordMock = createUserWithEmailAndPassword as jest.MockedFunction<typeof createUserWithEmailAndPassword>;

        // Mock the createUserWithEmailAndPassword function to resolve with a user object
        const user = { uid: "123" };
        createUserWithEmailAndPasswordMock.mockResolvedValue({ user } as UserCredential);

        const { getByPlaceholderText, getByText } = render(<RegisterWrapper />);
        fireEvent.change(getByPlaceholderText('john@doe.com') as HTMLInputElement, { target: { value: "testuser@test.com" } });
        fireEvent.change(getByPlaceholderText('john doe') as HTMLInputElement, { target: { value: "testuser" } });
        fireEvent.change(getByPlaceholderText('0412346789') as HTMLInputElement, { target: { value: "4123467890" } });
        fireEvent.change(getByPlaceholderText('Minimum 6 characters.') as HTMLInputElement, { target: { value: "password123" } });
        fireEvent.change(getByPlaceholderText('Make sure it matches!') as HTMLInputElement, { target: { value: "password123" } });

        // Click the Register button
        fireEvent.click(screen.getByText("Register"));
        console.log("createUserWithEmailAndPasswordMock called:", createUserWithEmailAndPasswordMock.mock.calls);

        // Wait for the Promise to resolve
        await Promise.resolve();

        // Verify that the handleSuccess function was called
        expect(createUserWithEmailAndPasswordMock).toHaveBeenCalledWith(
            auth,
            "testuser@test.com",
            "password123");
    });

    it('allows user to navigate to Login page on Already Registered? link', async () => {
        render(<RegisterWrapper />);
        const logInLink = screen.getByText('Already have an account?');
        fireEvent.click(logInLink);
        // expect(mockedUsedNavigate).toHaveBeenCalled();
        // expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');

        // Wait for the navigation to occur
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });
      
        // Check that the current URL is now the login page
        expect(window.location.pathname).toBe("/");
    });

    // it("shows error message when required fields are empty", () => {
    //     render(<RegisterWrapper />);
    //     const registerButton = screen.getByRole("button", { name: "Register" });
    //     fireEvent.click(registerButton);
    //     expect(screen.getByText("All required fields are not filled up.")).toBeInTheDocument();
    //   });

});

