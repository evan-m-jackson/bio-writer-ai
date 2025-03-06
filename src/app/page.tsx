import { cookies } from "next/headers";
import Profile from "../components/profile/Profile";
import { decrypt } from "./lib/session";
import { FieldOfLaw, User } from "@/types";
import axios from "axios";
import { range } from "lodash";

export default async function Page() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const url = process.env.URL ? process.env.URL : "http://localhost:3000";
  const id = convertToNumber(session?.id);
  const firstName = convertToString(session?.firstName);
  const lastName = convertToString(session?.lastName);
  const email = convertToString(session?.email);
  const fieldOfLawOptions = await axios.get(`${url}/api/law-fields`);
  const selectedOptions = await axios.get(`${url}/api/law-field-selections`, {
    params: { userId: id },
  });
  console.log(selectedOptions.data);
  const achievements = await axios.get(`${url}/api/achievements`, {
    params: { userId: id },
  });
  const user: User = {
    id,
    firstName,
    lastName,
    email,
  };

  return (
    <Profile
      user={user}
      fieldOfLawOptions={fieldOfLawOptions.data.fieldsOfLaw}
      fieldOfLawData={selectedOptions.data.fieldOfLawData}
      yearsInFieldOfLawData={selectedOptions.data.yearsInFieldOfLawData}
      achievemntsData={achievements.data}
      bioText=""
    />
  );
}

function convertToString(value: unknown) {
  if (typeof value == "string") {
    return value;
  } else {
    return "";
  }
}

function convertToNumber(value: unknown) {
  if (typeof value == "number") {
    return value;
  } else {
    return 0;
  }
}
