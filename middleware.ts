import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Your JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function middleware(req: NextRequest) {
  // 1. Get the token from cookies
  const token = req.cookies.get("token")?.value;

  // 2. Check if the token exists
  if (!token) {
    // Redirect to login if token is missing
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Verify the token
  try {
    jwt.verify(token, JWT_SECRET); // This will now have proper TypeScript types
    return NextResponse.next(); // Allow request to proceed
  } catch (err) {
    // Redirect to login if token is invalid
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard_test/:path*", "/profile/:path*"], // Apply middleware to protected routes
};
