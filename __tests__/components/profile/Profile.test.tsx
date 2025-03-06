import "@testing-library/jest-dom";
import Profile from "@/components/profile/Profile";
import { render, screen } from "@testing-library/react";
import React, { act } from "react";
import { User } from "@/types";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const user: User = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "jdoe@example.com",
};
const fieldOfLawOptions: string[] = [
  "Corporate",
  "Criminal",
  "Employment",
  "Family",
  "Tax",
];
const blankFieldOfLawData: string[] = ["", "", "", "", ""];
const blankYearsInFieldOfLawData: string[] = ["", "", "", "", ""];

jest.mock("axios");

describe("Profile", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = OLD_ENV;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("renders correct text", async () => {
    render(
      <Profile
        user={user}
        fieldOfLawOptions={fieldOfLawOptions}
        fieldOfLawData={blankFieldOfLawData}
        yearsInFieldOfLawData={blankYearsInFieldOfLawData}
        achievemntsData=""
        bioText=""
      />,
    );

    const heading = screen.getByText("Signed in as: John");
    const firstLawField = screen.getByText("Field of Law #1");
    const secondLawField = screen.getByText("Field of Law #2");
    const thirdLawField = screen.getByText("Field of Law #3");
    const fourthLawField = screen.getByText("Field of Law #4");
    const fifthLawField = screen.getByText("Field of Law #5");
    const additionalAchievementsTextBox = screen.getByText(
      "Additional Achievements",
    );
    const saveProfileButton = screen.getByText("Save Profile");
    const generateBioButton = screen.getByText("Generate Bio");

    expect(heading).toBeInTheDocument();
    expect(firstLawField).toBeInTheDocument();
    expect(secondLawField).toBeInTheDocument();
    expect(thirdLawField).toBeInTheDocument();
    expect(fourthLawField).toBeInTheDocument();
    expect(fifthLawField).toBeInTheDocument();
    expect(additionalAchievementsTextBox).toBeInTheDocument();
    expect(saveProfileButton).toBeInTheDocument();
    expect(generateBioButton).toBeInTheDocument();
  });

  it("renders correct number of select boxes", () => {
    render(
      <Profile
        user={user}
        fieldOfLawOptions={fieldOfLawOptions}
        fieldOfLawData={blankFieldOfLawData}
        yearsInFieldOfLawData={blankYearsInFieldOfLawData}
        achievemntsData=""
        bioText=""
      />,
    );

    const fieldOfLawSelectBoxes = screen.getAllByLabelText("Field of Law");
    const yearSelectBoxes = screen.getAllByLabelText("Years");

    expect(fieldOfLawSelectBoxes.length).toBe(5);
    expect(yearSelectBoxes.length).toBe(5);
  });

  it("renders options in select boxes", () => {
    render(
      <Profile
        user={user}
        fieldOfLawOptions={fieldOfLawOptions}
        fieldOfLawData={blankFieldOfLawData}
        yearsInFieldOfLawData={blankYearsInFieldOfLawData}
        achievemntsData=""
        bioText=""
      />,
    );

    fieldOfLawOptions.forEach((option) => {
      const options = screen.getAllByText(option);
      expect(options.length).toBe(5);
    });

    for (let i = 1; i <= 80; i++) {
      const nums = screen.getAllByText(i);
      expect(nums.length).toBe(5);
    }
  });

  it("sends the valid request to the db when Save Profile button is clicked", async () => {
    const mockedAxiosPost = jest.spyOn(axios, "post");
    render(
      <Profile
        user={user}
        fieldOfLawOptions={fieldOfLawOptions}
        fieldOfLawData={blankFieldOfLawData}
        yearsInFieldOfLawData={blankYearsInFieldOfLawData}
        achievemntsData=""
        bioText=""
      />,
    );

    const fieldOfLawSelectBoxes = screen.getAllByLabelText("Field of Law");
    const yearSelectBoxes = screen.getAllByLabelText("Years");
    const additionalAchievementsTextBox = screen.getByLabelText(
      "Additional Achievements",
    );
    const saveProfileButton = screen.getByRole("button", {
      name: /save profile/i,
    });
    const url = "/api/law-field-selections";

    await act(async () => {
      // 3 years of Corporate Law Experience
      await userEvent.selectOptions(fieldOfLawSelectBoxes[0], "Corporate");
      await userEvent.selectOptions(yearSelectBoxes[0], "3");
      // 2 years of Criminal Law Experience
      await userEvent.selectOptions(fieldOfLawSelectBoxes[1], "Criminal");
      await userEvent.selectOptions(yearSelectBoxes[1], "2");
      // 2 years of Employment Law Experience
      await userEvent.selectOptions(fieldOfLawSelectBoxes[2], "Employment");
      await userEvent.selectOptions(yearSelectBoxes[2], "2");
      // 1 year of Family Law Experience
      await userEvent.selectOptions(fieldOfLawSelectBoxes[3], "Family");
      await userEvent.selectOptions(yearSelectBoxes[3], "1");
      // 3 years of Tax Law Experience
      await userEvent.selectOptions(fieldOfLawSelectBoxes[4], "Tax");
      await userEvent.selectOptions(yearSelectBoxes[4], "3");
      // Additional Information entered
      await userEvent.type(
        additionalAchievementsTextBox,
        "Received an award for rapping",
      );
      await userEvent.click(saveProfileButton);
    });

    expect(mockedAxiosPost).toHaveBeenCalledWith(
      url,
      {
        fieldOfLawSelections: [
          "Corporate",
          "Criminal",
          "Employment",
          "Family",
          "Tax",
        ],
        yearsInFieldOfLawSelections: ["3", "2", "2", "1", "3"],
        achievements: "Received an award for rapping",
        userId: user.id,
      },
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  });

  it("populates field of law selection boxes when they have already been entered", async () => {
    const fieldOfLawData: string[] = ["Corporate", "Employment", "Tax", "", ""];
    const yearsInFieldOfLawData: string[] = ["4", "2", "1", "", ""];
    const achievements = "I won the Nobel Peace Prize and the Heisman";
    render(
      <Profile
        user={user}
        fieldOfLawOptions={fieldOfLawOptions}
        fieldOfLawData={fieldOfLawData}
        yearsInFieldOfLawData={yearsInFieldOfLawData}
        achievemntsData={achievements}
        bioText=""
      />,
    );

    const fieldOfLawSelectBoxes = screen.getAllByLabelText("Field of Law");
    const yearSelectBoxes = screen.getAllByLabelText("Years");
    const additionalAchievementsTextBox = screen.getByLabelText(
      "Additional Achievements",
    );

    expect(fieldOfLawSelectBoxes[0]).toHaveValue("Corporate");
    expect(yearSelectBoxes[0]).toHaveValue("4");
    expect(fieldOfLawSelectBoxes[1]).toHaveValue("Employment");
    expect(yearSelectBoxes[1]).toHaveValue("2");
    expect(fieldOfLawSelectBoxes[2]).toHaveValue("Tax");
    expect(yearSelectBoxes[2]).toHaveValue("1");
    expect(fieldOfLawSelectBoxes[3]).toHaveValue("");
    expect(yearSelectBoxes[3]).toHaveValue("");
    expect(fieldOfLawSelectBoxes[4]).toHaveValue("");
    expect(yearSelectBoxes[4]).toHaveValue("");
    expect(additionalAchievementsTextBox).toHaveValue(
      "I won the Nobel Peace Prize and the Heisman",
    );
  });

  it("sends the correct request to OpenAI with the relevant profile data when Generate Bio is clicked and shows successful bio creation message", async () => {
    process.env.OPENAI_API_KEY = "OPENAI_API_KEY";
    const mockResponse = {
      data: "John is the best!",
      status: 200,
    };
    const mockedAxiosPost = jest
      .spyOn(axios, "post")
      .mockResolvedValue(mockResponse);
    const fieldOfLawData: string[] = ["Corporate", "Employment", "Tax", "", ""];
    const yearsInFieldOfLawData: string[] = ["4", "2", "1", "", ""];
    const achievements = "I won the Nobel Peace Prize and the Heisman";
    render(
      <Profile
        user={user}
        fieldOfLawOptions={fieldOfLawOptions}
        fieldOfLawData={fieldOfLawData}
        yearsInFieldOfLawData={yearsInFieldOfLawData}
        achievemntsData={achievements}
        bioText=""
      />,
    );

    const generateBioButton = screen.getByRole("button", {
      name: /generate bio/i,
    });
    const url = "/api/write-bio";
    const prompt =
      "Write an employee bio for John, who is a lawyer. John has been practicing Corporate Law for 4 years, Employment Law for 2 years and Tax Law for 1 year. John also has the following achievements: I won the Nobel Peace Prize and the Heisman";
    const bioStatusMessage = "Your bio has been successfully created! It can be viewed here"
  
    expect(screen.queryByText(bioStatusMessage)).not.toBeInTheDocument();
    
    await act(async () => {
      await userEvent.click(generateBioButton);
    });

    expect(mockedAxiosPost).toHaveBeenCalledWith(url, prompt);
    expect(screen.getByText(bioStatusMessage)).toBeInTheDocument();
  });
});
