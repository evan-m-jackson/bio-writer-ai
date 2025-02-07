import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Signup from "../../src/app/signup/page";
import axios, { AxiosError, AxiosHeaders } from "axios";
import React, { act } from "react";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Signup", () => {
  it("renders Create Profile heading", () => {
    render(<Signup />);

    const heading = screen.getByRole("heading");

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Create Profile");
  });

  test.each([
    "First Name",
    "Last Name",
    "Email",
    "Password",
    "Confirm Password",
  ])("renders correct inputs", (labelText) => {
    render(<Signup />);

    const label = screen.getByLabelText(labelText);
    expect(label).toBeInTheDocument();
  });

  it("renders Create button", () => {
    render(<Signup />);

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent("Create");
  });

  it("renders correct sign in link", () => {
    render(<Signup />);

    const signIn = screen.getByText("Already have an account? Sign In");

    expect(signIn).toBeInTheDocument();
  });

  it("does not throw an error when all inputs are valid", async () => {
    render(<Signup />);
    mockedAxios.post.mockResolvedValue({
      status: 200,
    });
    const firstName = screen.getByLabelText("First Name");
    const lastName = screen.getByLabelText("Last Name");
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");
    const button = screen.getByRole("button");

    await act(async () => {
      await userEvent.type(firstName, "Player");
      await userEvent.type(lastName, "One");
      await userEvent.type(email, "playerone@example.com");
      await userEvent.type(password, "password");
      await userEvent.type(confirmPassword, "password");
      await userEvent.click(button);
    });

    const errorMessage = screen.queryByText("All fields must be populated.");

    expect(errorMessage).not.toBeInTheDocument();

    // All inputs should be cleared out upon a successful submit
    expect(firstName).toHaveValue("");
    expect(lastName).toHaveValue("");
    expect(email).toHaveValue("");
    expect(password).toHaveValue("");
    expect(confirmPassword).toHaveValue("");
  });

  it("throws an error when inputs are left blank", async () => {
    render(<Signup />);
    const firstName = screen.getByLabelText("First Name");
    const button = screen.getByRole("button");

    await act(async () => {
      await userEvent.type(firstName, "Player");
      await userEvent.click(button);
    });

    const errorMessage = screen.getByText("All fields must be populated.");
    expect(errorMessage).toBeInTheDocument();
  });

  it("throws an error when confirm password is different from password", async () => {
    render(<Signup />);

    const firstName = screen.getByLabelText("First Name");
    const lastName = screen.getByLabelText("Last Name");
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");
    const button = screen.getByRole("button");

    await act(async () => {
      await userEvent.type(firstName, "Player");
      await userEvent.type(lastName, "One");
      await userEvent.type(email, "playerone@example.com");
      await userEvent.type(password, "password");
      await userEvent.type(confirmPassword, "wrongpassword");
      await userEvent.click(button);
    });

    const errorMessage = screen.getByText("Passwords must match.");
    expect(errorMessage).toBeInTheDocument();
  });

  it("throws an error if the password is shorter than 8 characters", async () => {
    render(<Signup />);

    const firstName = screen.getByLabelText("First Name");
    const lastName = screen.getByLabelText("Last Name");
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");
    const button = screen.getByRole("button");

    await act(async () => {
      await userEvent.type(firstName, "Player");
      await userEvent.type(lastName, "One");
      await userEvent.type(email, "playerone@example.com");
      await userEvent.type(password, "word");
      await userEvent.type(confirmPassword, "word");
      await userEvent.click(button);
    });

    const errorMessage = screen.getByText(
      "Password must be between 8-16 characters.",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("throws an error if the password is longer than 8 characters", async () => {
    render(<Signup />);

    const firstName = screen.getByLabelText("First Name");
    const lastName = screen.getByLabelText("Last Name");
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");
    const button = screen.getByRole("button");

    await act(async () => {
      await userEvent.type(firstName, "Player");
      await userEvent.type(lastName, "One");
      await userEvent.type(email, "playerone@example.com");
      await userEvent.type(password, "thisisnotmypassword");
      await userEvent.type(confirmPassword, "thisisnotmypassword");
      await userEvent.click(button);
    });

    const errorMessage = screen.getByText(
      "Password must be between 8-16 characters.",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("throws an error if a new user uses an existing email address", async () => {
    render(<Signup />);
    const axiosError = new AxiosError();
    axiosError.response = {
      status: 400,
      statusText: "Bad Request",
      data: 'Error: duplicate key value violates unique constraint "users_email_key"',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
      request: {},
    };
    mockedAxios.post.mockRejectedValue(axiosError);

    const firstName = screen.getByLabelText("First Name");
    const lastName = screen.getByLabelText("Last Name");
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");
    const button = screen.getByRole("button");

    await act(async () => {
      await userEvent.type(firstName, "Player");
      await userEvent.type(lastName, "One");
      await userEvent.type(email, "thisemailalreadyexists@example.com");
      await userEvent.type(password, "password");
      await userEvent.type(confirmPassword, "password");
      await userEvent.click(button);
    });

    const errorMessage = screen.getByText(
      "A profile with this email address already exists.",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("throws an error if the database throws an error during sign up", async () => {
    render(<Signup />);

    const axiosError = new AxiosError();
    axiosError.response = {
      status: 400,
      statusText: "Bad Request",
      data: "The database is not working",
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
      request: {},
    };
    mockedAxios.post.mockRejectedValue(axiosError);

    const firstName = screen.getByLabelText("First Name");
    const lastName = screen.getByLabelText("Last Name");
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");
    const button = screen.getByRole("button");

    await act(async () => {
      await userEvent.type(firstName, "Player");
      await userEvent.type(lastName, "One");
      await userEvent.type(email, "thisemailalreadyexists@example.com");
      await userEvent.type(password, "password");
      await userEvent.type(confirmPassword, "password");
      await userEvent.click(button);
    });

    const errorMessage = await screen.findByText(
      "There is a system error. Please try again soon",
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
