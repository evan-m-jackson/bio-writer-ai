"use client";
import React from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleClick = () => {
    axios.post("/api/signout");
    router.push("/signin");
  };

  return (
    <>
      <div className="h-20">
        <div className="flex flex-row">
          <ul>
            <li className="inline-block p-3">
              <Link href={"/"}>
                <p>About Us</p>
              </Link>
            </li>
            <li className="inline-block p-3">
              <Link href={"/"}>
                <p>News & Events</p>
              </Link>
            </li>
            <li className="inline-block p-3">
              <Link href={"/"}>
                <p>Swag Shop</p>
              </Link>
            </li>
          </ul>
          <div className="absolute top-0 right-0 p-3">
            <button onClick={handleClick}>Sign Out</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
