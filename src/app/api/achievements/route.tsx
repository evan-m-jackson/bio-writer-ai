import conn from "../../db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    const achievementsQuery = "SELECT * FROM achievements WHERE user_id = ($1)";
    const achievementsResult = await conn.query(achievementsQuery, [userId]);
    const achievements = achievementsResult.rows[0];
    var result = "";
    if (achievements) {
      result = achievements.achievements;
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 400 });
  }
}
