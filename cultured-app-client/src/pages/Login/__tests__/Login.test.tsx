/**
 * @jest-environment jsdom
 */

import AuthForm from "../Login";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { auth } from "../../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { log } from "console";
import { toast } from "react-toastify";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock("../../../config/firebase");
jest.mock("firebase/auth");

const mockGetUser = jest.fn();
jest.mock("../../../api/user", () => ({
  ...jest.requireActual("../../../api/user"),
  useGetUser: () => mockGetUser,
}));

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("AuthForm component", () => {
  //clear all mock functions
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component onto the screen", () => {
    expect(true).toBeTruthy();
  });

  it("should render all the component onto the screen", () => {
    render(<AuthForm />);
    expect(screen.getByPlaceholderText("john@doe.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Minimum 6 characters.")
    ).toBeInTheDocument();
    // expect(screen.getByText("Remember me")).toBeInTheDocument();
    expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register now")).toBeInTheDocument();
  });

  it("updates the email state change on email input", () => {
    const { getByPlaceholderText } = render(<AuthForm />);
    const emailInput = getByPlaceholderText("john@doe.com") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "john@doe.com" } });
    expect(emailInput.value).toBe("john@doe.com");
  });

  it("updates the password state change on password input", () => {
    const { getByPlaceholderText } = render(<AuthForm />);
    const passwordInput = getByPlaceholderText(
      "Minimum 6 characters."
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "johndoe123" } });
    expect(passwordInput.value).toBe("johndoe123");
  });

  it("should call signInWithEmailAndPassword when clicking the login button", async () => {
    //mock signInWithEmailAndPassword and supply some mock values to it as it returns a promise
    const mockSignInWithEmailAndPassword = jest.fn(() =>
      Promise.resolve({ user: { uid: "123" } })
    );

    // Replace the real implementation with the mock
    (signInWithEmailAndPassword as jest.Mock).mockImplementation(
      mockSignInWithEmailAndPassword
    );

    const { getByPlaceholderText, getByText } = render(<AuthForm />);
    const emailInput = getByPlaceholderText("john@doe.com") as HTMLInputElement;
    const passwordInput = getByPlaceholderText(
      "Minimum 6 characters."
    ) as HTMLInputElement;
    const loginButton = getByText("Login");

    act(() => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "test@example.com",
        "password"
      );
    });
  });

  it("allows user to navigate to register page on Register now link", () => {
    render(<AuthForm />);
    const registerLink = screen.getByText("Register now");
    fireEvent.click(registerLink);
    expect(mockedUsedNavigate).toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/register");
  });

  it("allows user to navigate to Forgot Password page on Forgot Password click", () => {
    render(<AuthForm />);
    const forgotPasswordLink = screen.getByText("Forgot Password?");
    fireEvent.click(forgotPasswordLink);
    expect(mockedUsedNavigate).toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/reset-password");
  });

  it("calls the handleSubmit function with email and password when the form is submitted", async () => {
    render(<AuthForm />);
    const emailInput = screen.getByPlaceholderText("john@doe.com");
    const passwordInput = screen.getByPlaceholderText("Minimum 6 characters.");
    const loginButton = screen.getByText("Login");

    fireEvent.change(emailInput, { target: { value: "john@doe.com" } });
    fireEvent.change(passwordInput, { target: { value: "johndoe123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        "john@doe.com",
        "johndoe123"
      );
    });
  });
});

export {};
