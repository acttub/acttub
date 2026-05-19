# acttub — 연기 영상 아카이브

연기 영상을 직접 올리고, 태그·플레이리스트로 정리하고, 다시 찾아보는 공개 아카이브.

## 기술 스택

- **Next.js 16** (App Router, Server Components, Turbopack)
- **TypeScript** + **Tailwind CSS v4** + **shadcn/ui** (New York / neutral)
- **Drizzle ORM** + **Postgres** (Neon 권장, Vercel Marketplace 에서 설치)
- **Vercel Blob** — 영상/썸네일 직접 업로드
- **Clerk** — 인증, 자동 회원가입
- **sonner** — 토스트, **lucide-react** — 아이콘

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 (.env.local)

```bash
cp .env.example .env.local
```

| 키 | 어디서 받나요 |
| --- | --- |
| `DATABASE_URL` | Vercel → Storage → Add Database → Neon (또는 로컬 Postgres) |
| `BLOB_READ_WRITE_TOKEN` | Vercel → Storage → Add Database → Blob |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | clerk.com → New application |

### 3. DB 마이그레이션

```bash
pnpm db:generate    # 스키마 → SQL 생성 (drizzle/ 폴더)
pnpm db:migrate     # DB에 적용
```

> Tip: `videos.title` 의 trigram 인덱스를 쓰려면 Postgres 에서 `CREATE EXTENSION IF NOT EXISTS pg_trgm;` 한 번 실행해야 해요. 빠르게 시작하려면 마이그레이션 SQL 에서 해당 인덱스 줄을 잠깐 빼도 됩니다.

### 4. 개발 서버

```bash
pnpm dev
```

http://localhost:3000

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 (Turbopack) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Drizzle 마이그레이션 SQL 생성 |
| `pnpm db:migrate` | 마이그레이션 적용 |
| `pnpm db:studio` | Drizzle Studio (DB GUI) |

## 폴더 구조

```
src/
  app/
    api/            # REST API (upload, videos, comments, bookmarks, share, playlists)
    upload/         # 업로드 페이지
    videos/[id]/    # 영상 상세
    playlists/      # 플레이리스트 생성/뷰
    search/         # 검색
    u/[username]/   # 프로필
    me/             # 내 아카이브 (영상/북마크/플레이리스트)
    s/[token]/      # 공유 링크 랜딩
    page.tsx        # 홈 피드
    layout.tsx      # 루트 레이아웃 (Clerk + 헤더 + Toaster)
  components/
    ui/             # shadcn UI primitives
    site-header.tsx
    video-card.tsx
    video-player.tsx
    video-actions.tsx
    comment-section.tsx
    upload-form.tsx
    playlist-form.tsx
  lib/
    db/             # Drizzle 스키마 + 클라이언트
    auth.ts         # Clerk → DB 유저 동기화
    share.ts        # slug/token 생성
    utils.ts        # cn, formatBytes, formatDuration
  middleware.ts     # Clerk 라우트 보호
```

## 배포 (Vercel)

```bash
npm i -g vercel
vercel link
vercel env pull .env.local
vercel              # preview
vercel --prod       # production
```

Marketplace 에서 Neon Postgres + Vercel Blob + Clerk 를 추가하면 환경변수가 자동으로 프로젝트에 주입됩니다.

## 다음 계획

- 모더레이션 / 신고
- 이메일 알림 (새 댓글, 새 팔로워)
- 시리즈 (작품 단위로 영상 묶기)
- 자막 / 챕터
- Vercel AI Gateway 로 자동 태그 추천
