import conn from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = "SELECT * FROM fields_of_law";
  const result = await conn.query(query);
  const fieldsOfLawRows = result.rows;
  const fieldsOfLaw: string[] = [];
  fieldsOfLawRows.forEach((row) => {
    fieldsOfLaw.push(row.field);
  });
  return NextResponse.json({ fieldsOfLaw });
}
