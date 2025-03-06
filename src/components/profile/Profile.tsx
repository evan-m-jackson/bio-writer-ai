"use client";
import { User } from "@/types";
import axios from "axios";
import { range, toInteger } from "lodash";
import React, { useEffect, useState } from "react";
import ProfileOptions from "./ProfileOptions";

export interface ProfileProps {
  user: User;
  fieldOfLawOptions: string[];
  fieldOfLawData: string[];
  yearsInFieldOfLawData: string[];
  achievemntsData: string;
  bioText: string;
}

export default function Profile({
  user,
  fieldOfLawOptions,
  fieldOfLawData,
  yearsInFieldOfLawData,
  achievemntsData,
  bioText
}: ProfileProps) {
  const yearOptions = range(1, 81);
  const [fieldOfLawSelections, setFieldOfLawSelections] =
    useState(fieldOfLawData);
  const [yearsInFieldOfLawSelections, setYearsInFieldOfLawSelections] =
    useState(yearsInFieldOfLawData);
  const [achievements, setAchievements] = useState(
    achievemntsData.length == 0 ? "" : achievemntsData,
  );
  const [bio, setBio] = useState(bioText);
  const [bioIsGenerated, setBioIsGenerated] = useState(false);

  useEffect(() => {
    if (bio.length > 0) {
      setBioIsGenerated(true)
    }
  }, [bio])

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const fullId = event.target.id.split("-");
    const idFor = fullId[0];
    const idNum = fullId[1];
    const idx = toInteger(idNum) - 1;
    if (idFor == "field") {
      const newFieldOfLawSelections = [...fieldOfLawSelections];
      newFieldOfLawSelections[idx] = event.target.value;
      setFieldOfLawSelections(newFieldOfLawSelections);
    } else {
      const newYearsInFieldOfLawSelections = [...yearsInFieldOfLawSelections];
      newYearsInFieldOfLawSelections[idx] = event.target.value;
      setYearsInFieldOfLawSelections(newYearsInFieldOfLawSelections);
    }
  };

  const handleAchievementChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setAchievements(event.target.value);
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      fieldOfLawSelections: fieldOfLawSelections,
      yearsInFieldOfLawSelections: yearsInFieldOfLawSelections,
      achievements: achievements,
      userId: user.id,
    };
    console.log(data)
    axios.post(`/api/law-field-selections`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const handleBioGeneration = () => {
    const fieldsOfLawStrList: string[] = [];
    range(0, fieldOfLawSelections.length).forEach((idx) => {
      if (fieldOfLawSelections[idx].length > 0) {
        const strToAdd = `${fieldOfLawSelections[idx]} Law for ${yearsInFieldOfLawSelections[idx]} ${yearsInFieldOfLawSelections[idx] == "1" ? "year" : "years"}`;
        fieldsOfLawStrList.push(strToAdd);
      }
    });

    let fieldOfLawStr = "";
    fieldsOfLawStrList.forEach((fieldOfLaw, idx) => {
      fieldOfLawStr = fieldOfLawStr.concat(fieldOfLaw);

      if (idx == fieldsOfLawStrList.length - 1) {
        fieldOfLawStr = fieldOfLawStr.concat(".");
      } else if (idx == fieldsOfLawStrList.length - 2) {
        fieldOfLawStr = fieldOfLawStr.concat(" and ");
      } else {
        fieldOfLawStr = fieldOfLawStr.concat(", ");
      }
    });

    const prompt = `Write an employee bio for ${user.firstName}, who is a lawyer. ${user.firstName} has been practicing ${fieldOfLawStr} ${user.firstName} also has the following achievements: ${achievements}`;
    axios
      .post("/api/write-bio", prompt)
      .then((response) => {
        console.log(response.data);
        setBio(response.data)
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="w-full max-w-md text-black dark:text-white">
      <h1>Signed in as: {user.firstName}</h1>
      <form
        className=" bg-white dark:bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        {range(0, 5).map((num) => (
          <ProfileOptions
            fieldOfLawOptions={fieldOfLawOptions}
            yearOptions={yearOptions}
            handleSelectionChange={handleSelectionChange}
            indexNum={num + 1}
            fieldOfLaw={fieldOfLawSelections[num]}
            yearsInFieldOfLaw={yearsInFieldOfLawSelections[num]}
          />
        ))}
        <div>
          <label>
            Additional Achievements
            <textarea
              name="additional-achievements"
              rows={4}
              cols={40}
              className="text-gray-900"
              onChange={handleAchievementChange}
              value={achievements}
            />
          </label>
        </div>
        <button
          type="submit"
          className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          Save Profile
        </button>
        <button
          type="button"
          className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          onClick={handleBioGeneration}
        >
          Generate Bio
        </button>
        <div className="flex justify-center text-xs my-2">
            <p style={{ color: "green" }}>{bioIsGenerated ? "Your bio has been successfully created! It can be viewed here" : ""}</p>
        </div>
      </form>
    </div>
  );
}
