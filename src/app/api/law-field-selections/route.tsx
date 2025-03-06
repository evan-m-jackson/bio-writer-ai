import { range } from "lodash";
import conn from "../../db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const lawFieldSelectionsQuery =
      "INSERT INTO field_of_law_selections(user_id, selection_num, field_of_law, years) VALUES ($1, $2, $3, $4)";
    range(1, 6).forEach(async (num) => {
      const field = formData.get(`${num.toString()}[field]`);
      const years = formData.get(`${num.toString()}[years]`);
      if (field && years) {
        const lawFieldSelectionsValues = [
          formData.get("userId"),
          num,
          field,
          years,
        ];
        await conn.query(lawFieldSelectionsQuery, lawFieldSelectionsValues);
      }
    });
    const achievementQuery =
      "INSERT INTO achievements(user_id, achievements) VALUES ($1, $2)";
    const achievements = formData.get("achievements");

    if (achievements) {
      const achievementValues = [formData.get("userId"), achievements];
      await conn.query(achievementQuery, achievementValues);
    }
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
    const userId = searchParams.get("userId");
    const result: {
      [key: string]: { field: string; years: string } | string;
    } = {};
    const lawFieldSelectionsQuery =
      "SELECT * FROM fields_of_law_selections WHERE user_id = ($1)";
    const lawFieldSelectionsResult = await conn.query(lawFieldSelectionsQuery, [
      userId,
    ]);
    const lawFieldSelections = lawFieldSelectionsResult.rows;
    const fieldOfLawData: string[] = [];
    const yearsInFieldOfLawData: string[] = [];
    range(1, 6).forEach((num) => {
      const key = num.toString();
      const selection = lawFieldSelections.find(
        (lawField) => lawField.selection_num === num,
      );
      if (selection) {
        fieldOfLawData.push(selection.field_of_law);
        yearsInFieldOfLawData.push(selection.years);
      } else {
        fieldOfLawData.push("");
        yearsInFieldOfLawData.push("");
      }
    });

    return NextResponse.json({ fieldOfLawData, yearsInFieldOfLawData });
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 400 });
  }
}
