import "@testing-library/jest-dom";
import Navbar from "@/components/navbar";
import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => {
    return ({
      __esModule: true,
      useRouter: () => ({
        push: jest.fn()
      })
    })
  });

describe("Navbar", () => {
  it("renders correct headings", () => {
    render(<Navbar />);

    const signOutButton = screen.getByRole('button');
    expect(signOutButton).toHaveTextContent('Sign Out');
  });
});
