import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Signin from "../../src/app/signin/page";
import axios from "axios";
import React, { act } from "react";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock("next/navigation", () => {
  return ({
    __esModule: true,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    }),
    useSearchParams: () => ({
      get: () => {}
    })
  })
});


describe("Signin", () => {
  it("renders Sign In heading", () => {
    render(<Signin />);

    const heading = screen.getByRole("heading");

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Sign In");
  });

  test.each(["Email", "Password"])("renders correct inputs", (labelText) => {
    render(<Signin />);

    const label = screen.getByLabelText(labelText);
    expect(label).toBeInTheDocument();
  });

  it("renders correct button", () => {
    render(<Signin />);

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent("Sign In");
  });

  it("renders correct link texts", () => {
    render(<Signin />);

    const forgotPassword = screen.getByText("Forgot password?");
    const signUp = screen.getByText("New here? Sign Up");

    expect(forgotPassword).toBeInTheDocument();
    expect(signUp).toBeInTheDocument();
  });

  it("throws an error when username does not exist", async () => {
    render(<Signin />);

    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: [],
    });

    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const signinButton = screen.getAllByRole("button")[0];

    await act(async () => {
      await userEvent.type(email, "playerone@example.com");
      await userEvent.type(password, "password");
      await userEvent.click(signinButton);
    });

    const errorMessage = screen.getByText("User does not exist.");

    expect(errorMessage).toBeInTheDocument();
  });

  it("throws an error when password is incorrect", async () => {
    render(<Signin />);

    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: [
        {
          user_id: 1,
          first_name: "Player",
          last_name: "One",
          email: "playerone@example.com",
          password: "password",
        },
      ],
    });

    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const signinButton = screen.getAllByRole("button")[0];

    await act(async () => {
      await userEvent.type(email, "playerone@example.com");
      await userEvent.type(password, "wrong_password");
      await userEvent.click(signinButton);
    });

    const errorMessage = screen.getByText("Password is incorrect.");

    expect(errorMessage).toBeInTheDocument();
  });

  it("throws an error if a field is blank", async () => {
    render(<Signin />);

    const email = screen.getByLabelText("Email");
    const signinButton = screen.getAllByRole("button")[0];

    await act(async () => {
      await userEvent.type(email, "playerone@example.com");
      await userEvent.click(signinButton);
    });

    const errorMessage = screen.getByText("Both fields must be populated.");
    expect(errorMessage).toBeInTheDocument();
  });

  it("does not throw an error when username and password are correct", async () => {
    render(<Signin />);

    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: 
      {
        user_id: 1,
        first_name: "Player",
        last_name: "One",
        email: "playerone@example.com",
        password: "password",
      },
    });

    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const signinButton = screen.getAllByRole("button")[0];

    await act(async () => {
      await userEvent.type(email, "playerone@example.com");
      await userEvent.type(password, "password");
      await userEvent.click(signinButton);
    });

    const errorMessage = screen.queryByText("Password is incorrect.");
    expect(errorMessage).not.toBeInTheDocument();
  });
});
