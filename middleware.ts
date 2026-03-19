import { NextRequest, NextResponse } from "next/server";

const locales = ["ar", "en"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin-secret-9f3k") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (hasLocale) return NextResponse.next();

  const locale = request.cookies.get("locale")?.value || process.env.DEFAULT_LOCALE || "ar";
  const safeLocale = locales.includes(locale) ? locale : "ar";
  const url = request.nextUrl.clone();
  url.pathname = `/${safeLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
