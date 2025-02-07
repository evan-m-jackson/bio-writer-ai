import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/app/lib/session";

export async function POST(request: NextRequest) {
  try {
    await deleteSession();
    return new NextResponse("Success!", { status: 200 });
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 400 });
  }
}
