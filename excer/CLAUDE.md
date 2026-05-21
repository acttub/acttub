# excer — 연습실 찾기

acttub 생태계 4번째 앱. 배우/연극인 대상.

## 빠른 사실
- **도메인**: `acttub.com/excer` (서브경로 rewrite — basePath `/excer` 가 `next.config.ts` 에 하드코딩)
- **스택**: Next 16 + Tailwind v4 + shadcn (new-york) + Drizzle/Neon + Clerk + 카카오맵 SDK + Vercel Blob
- **패키지 매니저**: **pnpm** (arch/comm 와 통일 — thea 와 다름)
- **인증**: acttub Clerk 인스턴스 공유. 조회는 비로그인.
- **디자인 토큰**: arch 의 `globals.css` 100% 그대로. 임의 수정 금지.

## 핵심 디렉터리
```
src/
├─ app/                  Next App Router
│   ├─ layout.tsx        루트 레이아웃 (Pretendard 글로벌, Sonner)
│   ├─ page.tsx          홈 (지도 + 발견)
│   ├─ rooms/[slug]/     상세 페이지 (TODO)
│   ├─ admin/            관리자 (선택 — MVP 1차 보류 가능)
│   └─ not-found.tsx     404
├─ components/
│   ├─ ui/               shadcn 표준 (수정 신중하게)
│   └─ excer/            excer 만의 컴포넌트 (RoomCard, MapView, …)
├─ lib/
│   ├─ utils.ts          cn / formatPrice / daysSince
│   ├─ db/               Drizzle 스키마·클라이언트
│   └─ url/              URL 쿼리 파싱 (zod)
└─ hooks/                useFilteredRooms 등
```

## 기획 산출물
모든 의사결정의 출처:
- `outputs/stage-0/idea-brief.md` — 무엇을·왜
- `outputs/stage-1/prd.md` — 기능 명세, 우선순위, 데이터 모델
- `outputs/stage-2/design-handoff.md` — 디자인 결정·컴포넌트 매핑·빌드 순서

새 결정이 충돌하면 위 문서를 업데이트하고 그 변경을 commit message 에 적을 것.

## AI 작업 시 자주 헷갈리는 지점
1. **basePath 항상 적용** — 로컬 `localhost:3000/` 아니라 `localhost:3000/excer/`.
2. **arch UI primitives 와 일치 유지** — `src/components/ui/*.tsx` 는 arch 와 동일. 임의 수정 시 톤 깨짐.
3. **카카오맵 SDK 는 `<Script strategy="lazyOnload" />` 로 로드** — 첫 페인트 보호.
4. **데이터 신선도 임계치 30/60/60+** — `LastVerifiedBadge` 컴포넌트가 이 임계치를 따름.
5. **스크래핑 금지** — 카카오 로컬 API 는 호출용으로만 사용, 외부 사이트 스크래핑은 ToS 위반.
6. **`.omc/` 커밋 금지** — `.gitignore` 에 명시되어 있음.

## 환경 변수
`.env.local.example` 참조. acttub 의 Vercel 프로젝트에서 `vercel env pull` 로 동기화 가능.

## 명령
- `pnpm dev` — 개발 서버
- `pnpm build` — 프로덕션 빌드
- `pnpm db:studio` — Drizzle Studio (시드 입력용)
- `pnpm db:generate` / `pnpm db:migrate` — 스키마 변경

## 출시 가드레일
- 시드 POI **50개 이상** 확보 전 출시 금지 (PRD M7).
- 스크래핑 금지 (Validation report).
- 마지막 확인일 노출 (S1) 도 출시 직후 1~2주 안에 반드시.
