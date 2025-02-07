"use client";
import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const initialInputs = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [inputs, setInputs] = useState(initialInputs);
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [event.target.id]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hasBlankInput = Object.values(inputs).some((value) => value === "");
    if (hasBlankInput) {
      setError("All fields must be populated.");
    } else if (inputs.password != inputs.confirmPassword) {
      setError("Passwords must match.");
    } else if (inputs.password.length < 8 || inputs.password.length > 16) {
      setError("Password must be between 8-16 characters.");
    } else {
      axios
        .post("/api/signin", inputs, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          setError("");
          setInputs(initialInputs);
        })
        .catch((e) => {
          console.log(e.response);
          if (
            e.response.data.includes(
              "duplicate key value violates unique constraint",
            )
          ) {
            setError("A profile with this email address already exists.");
          } else {
            setError("There is a system error. Please try again soon");
          }
        });
    }
  };

  return (
    <div className="w-full max-w-md text-black dark:text-white">
      <form
        className=" bg-white dark:bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-4xl text-center mb-8">Create Profile</h1>
        <div className="relative z-0 my-3">
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={inputs.firstName}
            onChange={handleChange}
          />
          <label
            htmlFor="firstName"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            First Name
          </label>
        </div>
        <div className="relative z-0 my-3">
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={inputs.lastName}
            onChange={handleChange}
          />
          <label
            htmlFor="lastName"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Last Name
          </label>
        </div>
        <div className="relative z-0 my-3">
          <input
            type="email"
            id="email"
            name="email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={inputs.email}
            onChange={handleChange}
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Email
          </label>
        </div>
        <div className="relative z-0 my-3">
          <input
            type="password"
            id="password"
            name="password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={inputs.password}
            onChange={handleChange}
          />
          <label
            htmlFor="password"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Password
          </label>
        </div>
        <div className="relative z-0 my-3">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={inputs.confirmPassword}
            onChange={handleChange}
          />
          <label
            htmlFor="confirmPassword"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Confirm Password
          </label>
        </div>
        <div className="flex justify-center text-xs my-2">
          <p style={{ color: "red" }}>{error}</p>
        </div>
        <div className="flex justify-left text-xs my-2">
          <a href="/signin">Already have an account? Sign In</a>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
