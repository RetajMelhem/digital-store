import { NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/constants";
import { verifyAdminSessionToken } from "@/lib/auth";

export function assertAdminRequest(request: NextRequest) {
  const cookieToken = request.cookies.get(ADMIN_COOKIE)?.value;
  return verifyAdminSessionToken(cookieToken);
}
