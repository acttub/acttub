import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/new(.*)",
  "/p/(.*)/edit(.*)",
  "/api/posts(.*)",
  "/api/comments(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
  },
  {
    signInUrl: "/community/sign-in",
    signUpUrl: "/community/sign-up",
  },
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)",
    "/",
  ],
};
