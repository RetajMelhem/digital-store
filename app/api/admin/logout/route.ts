import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/constants";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", { expires: new Date(0), path: "/" });
  return response;
}
