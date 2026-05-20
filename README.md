# acttub-comm

`acttub.com/community` — 연기·연극 커뮤니티 (포럼·투표).

## Stack

- Next.js 16 + TypeScript + Tailwind CSS v4
- Firebase / Firestore (Admin SDK on server)
- Clerk auth
- pnpm

## Local

```bash
pnpm install
pnpm dev
```

http://localhost:3000/community

## Env

`.env.example` 참고. 필요한 키:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Firebase Admin: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- Firebase Client: `NEXT_PUBLIC_FIREBASE_*`

## Firestore Rules

`firestore.rules` 는 클라이언트 직접 쓰기를 차단합니다. 모든 쓰기는 서버 API 라우트(Admin SDK) 경유로 통일. 규칙 수정 후 Firebase CLI 로 deploy.

## Subpath Deploy

`basePath: "/community"` (`next.config.ts` 하드코딩). 메인 acttub 도메인에서 `/community/:path*` 를 이 프로젝트로 rewrite.
