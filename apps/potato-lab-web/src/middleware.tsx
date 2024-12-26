import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getUserCookies } from "./server/cookies-actions";

const publicRoute = ["/sign-in", "/sign-up", "/forgot-password"];

const isPublicRoute = (url: string) => {
  return !!publicRoute.find((route) => url.startsWith(route));
};

export async function middleware(request: NextRequest) {
  const { data } = await getUserCookies();

  const _isPublicRoute = isPublicRoute(request.nextUrl.pathname);

  if (_isPublicRoute && data?.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!_isPublicRoute && !data?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    },

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    },

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }]
    }
  ]
};
