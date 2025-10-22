import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname, locale } = request.nextUrl;
    const lngCookie = request.cookies.get('lng')?.value;

    // If the cookie exists and does not match the current locale in the URL
    if (lngCookie && locale !== lngCookie) {
      // Redirect to the same path but with the correct locale
      const url = request.nextUrl.clone();
      url.locale = lngCookie;
      return NextResponse.redirect(url);
    }
  
    // Otherwise, continue as normal
    return NextResponse.next();
  }
  
  export const config = {
    matcher: [
      '/:path*', // Match all routes, including root
    ],
  }; 