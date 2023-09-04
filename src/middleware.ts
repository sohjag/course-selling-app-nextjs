// src/middleware.ts
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import cookie from "cookie";
import CustomNextApiReq from "./lib/customNextApiReq";

const secret = process.env.SECRET_KEY || "";

export async function middleware(
  req: NextRequest,
  res: NextApiResponse,
  customReq: CustomNextApiReq
) {
  try {
    let token = req.cookies.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/api/auth/unauthorized", req.url));
    }

    jwt.verify(token.value, secret, (err, user) => {
      if (err) {
        return NextResponse.redirect(
          new URL("/api/auth/unauthorized", req.url)
        );
      }
      if (user) {
        try {
          customReq.role = (user as JwtPayload).role;
          customReq.user = (user as JwtPayload).username;
        } catch (e) {
          console.log(e);
        }

        return NextResponse.next();
      }
    });
  } catch (error) {
    console.error("Authentication middleware error:", error);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/hello", "/api/admin/:path*"],
};
