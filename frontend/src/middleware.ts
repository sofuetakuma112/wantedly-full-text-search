import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (process.env.NODE_ENV === "production") {
    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      const [user, pwd] = atob(authValue).split(":");

      if (user === process.env.BASIC_USER_NAME && pwd === process.env.BASIC_USER_PASSWORD) {
        return NextResponse.next();
      }
    }
    url.pathname = "/api/auth";

    return NextResponse.rewrite(url);
  }
}
