import conn from "../../db";
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/app/lib/session";
import { User } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const current_date = new Date().toUTCString();
    const formData = await request.formData();
    console.log(request.body);
    const query =
      "INSERT INTO users(first_name, last_name, email, password, created_at, modified_at) VALUES ($1, $2, $3, $4, $5, $5)";
    const values = [
      formData.get("firstName"),
      formData.get("lastName"),
      formData.get("email"),
      formData.get("password"),
      current_date,
    ];
    await conn.query(query, values);
    return new NextResponse("Success!", {
      status: 200,
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search_email = searchParams.get("email");
    const query = "SELECT * FROM users WHERE email = ($1)";
    const result = await conn.query(query, [search_email]);
    const user = result.rows[0];
    console.log(user)
    const id = user.user_id
    const firstName = user.first_name
    const lastName = user.last_name
    const email = user.email
    await createSession({id, firstName, lastName, email});

    return NextResponse.json(user);
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 400 });
  }
}
