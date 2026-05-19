import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/upload(.*)",
  "/me(.*)",
  "/playlists/new(.*)",
  "/api/upload(.*)",
  "/api/videos(.*)",
  "/api/playlists(.*)",
  "/api/bookmarks(.*)",
  "/api/share(.*)",
  "/api/comments(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
  },
  {
    signInUrl: "/archive/sign-in",
    signUpUrl: "/archive/sign-up",
  },
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)",
    "/",
  ],
};
