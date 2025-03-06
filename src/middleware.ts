import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/profile", "/"];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(
      new URL(`/signin?next=${path}`, request.nextUrl),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
