import {
  clerkMiddleware,
  createRouteMatcher,
  getAuth,
  clerkClient,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/forum(.*)",
  "/profile(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const client = clerkClient();
  if (isProtectedRoute(req) || isAdminRoute(req)) await auth.protect();
  // Admin route logic
  const { userId} = await auth()
  if (userId && isAdminRoute(req)){
    const user = (await (await client).users.getUser(userId!)).publicMetadata;
    console.log(JSON.stringify(user));
    if ((user?.role as string).toLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }else{
    return NextResponse.next();
  }
  
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next|sign-in|sign-up).*)", "/(api|trpc)(.*)"],
};
