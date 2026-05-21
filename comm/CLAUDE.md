# CLAUDE.md — comm

## Project

`comm` 은 `acttub.com/community` 로 서빙되는 커뮤니티(포럼/투표) 앱.

- 로컬 경로: `C:\dev\acttub\comm`
- Git: 아직 없음 (로컬만)
- basePath: `/community` (`next.config.ts` 하드코딩)
- 패키지 매니저: **pnpm**

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS v4, radix-ui primitives, shadcn 컨벤션
- Firebase / Firestore (Admin SDK 서버, Client SDK 는 읽기 전용)
- Clerk (인증)
- react-hook-form + zod, sonner, nanoid

## Important Files

- `src/proxy.ts` — Clerk 미들웨어 (Next 16 의 `middleware.ts` 리네임)
- `src/app/api/posts/` — 게시글 CRUD + 투표
- `src/app/api/comments/` — 댓글 CRUD + 투표
- `src/app/api/webhooks/clerk/` — Clerk 유저 생성/업데이트 동기화
- `src/lib/firebase/admin.ts` — Admin SDK (서버 쓰기)
- `src/lib/firebase/client.ts` — Client SDK (읽기)
- `src/lib/firebase/schema.ts` — Firestore 컬렉션 타입
- `src/lib/posts.ts`, `src/lib/comments.ts` — 데이터 액세스 레이어
- `firestore.rules` — 보안 규칙 (쓰기는 Admin 전용)

## Commands

```bash
pnpm install
pnpm dev               # http://localhost:3000/community
pnpm build
pnpm lint
```

## Conventions

- **쓰기는 모두 API 라우트 (Admin SDK) 경유**. Client SDK 로 직접 Firestore 쓰지 말 것 — `firestore.rules` 가 막아둠.
- **투표는 클라이언트가 못 봄**: `post_votes`, `comment_votes` 컬렉션은 client read 차단. 본인 vote 상태는 서버에서 join 해서 내려옴.
- 미들웨어 변경은 `src/middleware.ts` 가 아니라 **`src/proxy.ts`** 에 (Next 16).
- 보호 라우트: `/new`, `/p/*/edit`, `/api/posts`, `/api/comments`.

## Known Notes / Don'ts

- 사인인/사인업 URL: `/community/sign-in`, `/community/sign-up` (`src/proxy.ts` 지정). Clerk dashboard 도 같은 경로로 맞춰야 함.
- `firestore.rules` 수정 시 Firebase CLI 로 deploy 필요.
- basePath 가 `/community` 라 로컬 접근도 `localhost:3000/community`. 루트 `/` 는 404.

## Recommended Next Work

- Git 저장소 초기화 + `github.com/acttub/comm` 푸시
- 신고 / 모더레이션
- 알림 (댓글 답글)
- arch 영상에 comm 댓글 임베드 (cross-app)
