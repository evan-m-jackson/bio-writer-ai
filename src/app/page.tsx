import { cookies } from "next/headers";
import Profile from "../components/profile";
import { decrypt } from "./lib/session";
import { User } from "@/types";

export default async function Page() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  const id = convertToNumber(session?.id);
  const firstName = convertToString(session?.firstName);
  const lastName = convertToString(session?.lastName);
  const email = convertToString(session?.email);
  const user: User = {
    id,
    firstName,
    lastName,
    email,
  };

  return <Profile user={user} />;
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
