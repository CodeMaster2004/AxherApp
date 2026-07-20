import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routePermissions } from "./shared/config/routePermissions";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const matched = routePermissions.find(({ pattern }) =>
    pattern.test(pathname)
  );

  if (!matched) return NextResponse.next();

  const hasSession =
    req.cookies.get("refreshToken") ||
    req.cookies.get("accessToken");

  if (!hasSession) {
    url.pathname = "/login";
    url.searchParams.set("reason", "session-expired"); // Indica que la redirección se debe a una sesión expirada
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}