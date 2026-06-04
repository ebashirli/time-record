import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getSessionCookie } from "better-auth/cookies";
import { isTerminalRole } from "@/lib/auth-session";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (!sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.redirect(new URL("/sign-in", request.url));

  const role = session.user.role;
  const isScannerPath =
    pathname === "/scanner" || pathname.startsWith("/scanner/");

  const isImagePath = pathname.startsWith("/api/images/");

  if (isTerminalRole(role) && !isScannerPath && !isImagePath) {
    console.log({ "request.url": request.url });
    return NextResponse.redirect(new URL("/scanner", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next|_next/image|favicon.ico|sign-in|sign-up|api/auth).*)",
  ],
};

// import { NextResponse, type NextRequest } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // 1. Get the session cookie (Faster than a DB check at the edge/proxy level)
//   const sessionCookie = getSessionCookie(request);

//   // 2. Define your public "Auth" routes
//   const isAuthPage =
//     pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

//   console.log({ pathname, isAuthPage, sessionCookie });

//   // 3. Protection Logic: Redirect to sign-in if no session and not on auth page
//   if (!sessionCookie && !isAuthPage) {
//     const url = request.nextUrl.clone();
//     url.pathname = "/sign-in";
//     // Optional: add a redirect parameter to return here after login
//     url.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(url);
//   }

//   // 4. (Optional) Prevent logged-in users from seeing sign-in/sign-up pages
//   if (sessionCookie && isAuthPage) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   // Use a broad matcher to catch all routes except static assets and internal files
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
