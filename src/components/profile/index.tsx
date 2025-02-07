import { User } from "@/types";

export interface ProfileProps {
  user: User;
}

export default function Profile({ user }: ProfileProps) {
  console.log(user.firstName);
  return (
    <div>
      <h1>Signed in as: {user.firstName}</h1>
    </div>
  );
}
