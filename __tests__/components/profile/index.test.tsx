import "@testing-library/jest-dom";
import Profile from "@/components/profile";
import { render, screen } from "@testing-library/react";
import React from "react";
import { User } from "@/types";


describe("Profile", () => {
  it("renders correct heading", async () => {
    const user: User = {id: 1, firstName: "John", lastName: "Doe", email: "jdoe@example.com"}
    render(<Profile user={user} />);

    const heading = screen.getByText("Signed in as: John");

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Signed in as:");
  });
});
