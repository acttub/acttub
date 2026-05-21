import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 페이지 라우트는 항상 로그인 필요 (글쓰기/수정 화면).
const isProtectedPage = createRouteMatcher([
  "/new(.*)",
  "/p/(.*)/edit(.*)",
]);

// API 라우트는 GET 만 공개 — 목록·조회는 비로그인 허용,
// POST/PATCH/DELETE 등 변경은 로그인 필요.
const isMutableApi = createRouteMatcher([
  "/api/posts(.*)",
  "/api/comments(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedPage(req)) {
      await auth.protect();
      return;
    }
    if (isMutableApi(req) && req.method !== "GET") {
      await auth.protect();
    }
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
