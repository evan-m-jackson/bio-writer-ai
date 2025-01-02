import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Signup from '../../src/app/signup/page'
import { first } from 'lodash'
 

describe('Signup', () => {
  it('renders Create Profile heading', () => {
    render(<Signup />);
 
    const heading = screen.getByRole('heading');
 
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Create Profile")
  })

  test.each(["First Name", "Last Name", "Email", "Password", "Confirm Password"])('renders correct inputs', (labelText) => {
    render(<Signup />);
 
    const label = screen.getByLabelText(labelText)
    expect(label).toBeInTheDocument();
  })

  it('renders Create button', () => {
    render(<Signup />);

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent("Create");
  })

  it('does not throw an error when all inputs are valid', async () => {
    render(<Signup />);
    const firstName = screen.getByLabelText("First Name");
    await userEvent.type(firstName, "Player")

    const lastName = screen.getByLabelText("Last Name");
    await userEvent.type(lastName, "One")

    const email = screen.getByLabelText("Email");
    await userEvent.type(email, "playerone@example.com")

    const password = screen.getByLabelText("Password");
    await userEvent.type(password, "password")

    const confirmPassword = screen.getByLabelText("Confirm Password");
    await userEvent.type(confirmPassword, "password")

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const errorMessage = screen.queryByText("Error: All fields must be populated.")

    expect(errorMessage).not.toBeInTheDocument();

    // All inputs should be cleared out upon a successful submit
    expect(firstName).toHaveValue("");
    expect(lastName).toHaveValue("");
    expect(email).toHaveValue("");
    expect(password).toHaveValue("");
    expect(confirmPassword).toHaveValue("");
  })

  it('throws an error when inputs are left blank', async() => {
    render(<Signup/>);
    const firstName = screen.getByLabelText("First Name");
    userEvent.type(firstName, "Player")

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const errorMessage = screen.getByText("Error: All fields must be populated.")

    expect(errorMessage).toBeInTheDocument();
  })

  it('throws an error when confirm password is different from password', async () => {
    render(<Signup />);
    const firstName = screen.getByLabelText("First Name");
    await userEvent.type(firstName, "Player")

    const lastName = screen.getByLabelText("Last Name");
    await userEvent.type(lastName, "One")

    const email = screen.getByLabelText("Email");
    await userEvent.type(email, "playerone@example.com")

    const password = screen.getByLabelText("Password");
    await userEvent.type(password, "password")

    const confirmPassword = screen.getByLabelText("Confirm Password");
    await userEvent.type(confirmPassword, "wrongpassword")

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const errorMessage = screen.getByText("Error: Passwords must match.")

    expect(errorMessage).toBeInTheDocument();
  })

  it('throws an error if the password is shorter than 8 characters', async () => {
    render(<Signup />);
    const firstName = screen.getByLabelText("First Name");
    await userEvent.type(firstName, "Player")

    const lastName = screen.getByLabelText("Last Name");
    await userEvent.type(lastName, "One")

    const email = screen.getByLabelText("Email");
    await userEvent.type(email, "playerone@example.com")

    const password = screen.getByLabelText("Password");
    await userEvent.type(password, "pass")

    const confirmPassword = screen.getByLabelText("Confirm Password");
    await userEvent.type(confirmPassword, "pass")

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const errorMessage = screen.getByText("Error: Password must be between 8-16 characters.")

    expect(errorMessage).toBeInTheDocument();
  })

  it('throws an error if the password is longer than 8 characters', async () => {
    render(<Signup />);
    const firstName = screen.getByLabelText("First Name");
    await userEvent.type(firstName, "Player")

    const lastName = screen.getByLabelText("Last Name");
    await userEvent.type(lastName, "One")

    const email = screen.getByLabelText("Email");
    await userEvent.type(email, "playerone@example.com")

    const password = screen.getByLabelText("Password");
    await userEvent.type(password, "thisisnotmypassword")

    const confirmPassword = screen.getByLabelText("Confirm Password");
    await userEvent.type(confirmPassword, "thisisnotmypassword")

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const errorMessage = screen.getByText("Error: Password must be between 8-16 characters.")

    expect(errorMessage).toBeInTheDocument();
  })
})