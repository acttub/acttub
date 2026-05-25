# Project Setup — 연기 스타일 MBTI

> Stage 3.3 산출물 — 프로젝트 초기화 기록
> 작성일: 2026-05-14

## 1. 실행 명령 기록

```powershell
# pnpm 글로벌 설치
npm install -g pnpm
# → pnpm 11.1.1 설치됨

# Vite + React + TS 스캐폴딩
cd C:\dev\ACTI
pnpm create vite@latest app --template react-ts
# → C:\dev\ACTI\app/ 생성

# 기본 의존성 설치
cd C:\dev\ACTI\app
pnpm install
# → React 19.2.6, Vite 8.0.12, TS 6.0.2 (메이저 점프 — Vite 8 / TS 6 / React 19)

# 추가 런타임 의존성
pnpm add react-router-dom lucide-react html-to-image react-helmet-async
```

## 2. 실제 설치된 핵심 버전

`package.json` (생성 직후 상태):

| 패키지 | 설치 버전 | 비고 |
|---|---|---|
| react | ^19.2.6 | tech-stack.md의 ^19.0 가정과 일치 |
| react-dom | ^19.2.6 | |
| react-router-dom | (방금 설치) | v7 |
| lucide-react | (방금 설치) | |
| html-to-image | (방금 설치) | |
| react-helmet-async | (방금 설치) | |
| vite | ^8.0.12 | tech-stack.md ^7 가정보다 신규 메이저 — 호환 OK |
| typescript | ~6.0.2 | tech-stack.md ^5.6 가정보다 신규 메이저 — 호환 OK |
| @vitejs/plugin-react | ^6.0.1 | |
| eslint | ^10.3.0 | |

> Vite 8 / TS 6 / ESLint 10은 최신 메이저. 기존 가이드(Vite 7 / TS 5.6)는 작성 당시 보수적 기준이었으나 실제 스캐폴더는 더 최신을 가져옴. 동일 동작.

## 3. 디렉토리 구조 (실제 생성)

```
C:\dev\ACTI\app\
├── eslint.config.js
├── index.html                     ← 폰트·Kakao SDK 추가됨
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── (favicon.svg 등 기본)
└── src/
    ├── App.tsx                    ← BrowserRouter + 4 Routes
    ├── main.tsx                   ← globals.css import
    ├── components/                ← (빈 디렉토리, Step 3.10에서 채움)
    ├── content/                   ← (빈 디렉토리, Step 3.6에서 채움)
    ├── lib/                       ← (빈 디렉토리, Step 3.9에서 채움)
    ├── pages/
    │   ├── LandingPage.tsx        ← TBD 셸
    │   ├── QuizPage.tsx           ← TBD 셸
    │   ├── ResultPage.tsx         ← TBD 셸 (useParams 코드 표시)
    │   └── NotFoundPage.tsx       ← TBD 셸 (Link to '/')
    └── styles/
        └── globals.css            ← design-tokens.md § 5 복붙
```

## 4. 핵심 파일 변경 사항

### `src/main.tsx`
- Vite 보일러플레이트에서 `import './index.css'` → `import './styles/globals.css'`로 교체

### `src/App.tsx`
- Vite 보일러플레이트 카운터 UI 완전 교체
- `HelmetProvider` > `BrowserRouter` > `Routes` 구조
- 4 라우트: `/`, `/quiz`, `/result/:code`, `*` (404)

### `index.html`
- `<html lang="en">` → `<html lang="ko">`
- `<title>` → "연기 스타일 MBTI"
- viewport에 `maximum-scale=1.0` 추가 (모바일 줌 방지)
- `<meta name="theme-color" content="#FAFAF8" />` 추가
- Pretendard Variable CDN preconnect + stylesheet
- Kakao JS SDK v2.7.4 외부 스크립트 로드

### `src/styles/globals.css`
- `outputs/stage-2/design-tokens.md` § 5의 globals.css **그대로 복붙**
- 추가: `#root` 플렉스 컬럼 / `.container` 헬퍼 / `.page-enter` 키프레임

### 제거된 보일러플레이트
- `src/App.css` (삭제)
- `src/index.css` (삭제)
- `src/assets/` (삭제, 디렉토리째)

## 5. 빌드 검증

```powershell
pnpm build
```

**결과**:
```
✓ 32 modules transformed.
dist/index.html                   1.06 kB │ gzip:  0.61 kB
dist/assets/index-{hash}.css      6.94 kB │ gzip:  1.99 kB
dist/assets/index-{hash}.js     239.83 kB │ gzip: 77.04 kB
✓ built in 1.44s
```

| 항목 | 결과 | 목표 (tech-stack.md § 16) |
|---|---|---|
| 빌드 성공 | ✅ | — |
| JS gzip | 77.04 KB | ≤ 100 KB ✅ |
| CSS gzip | 1.99 KB | (목표 없음) ✅ |
| 빌드 시간 | 1.44s | (목표 없음) ✅ |
| TS 에러 | 0 | 0 ✅ |

→ 77 KB는 React + Router + Helmet + 빈 페이지 4개 + 라우터 코드 시점. Phase 2 콘텐츠/컴포넌트 추가 후에도 100KB 안에 들어올 것으로 예상.

## 6. 알려진 이슈 / 후속 처리

| # | 내용 | 처리 단계 |
|---|---|---|
| 1 | Kakao SDK `integrity` 해시는 임시값 — 실제 CDN 해시로 교체 필요 | Step 3.9 (공유 구현 시) |
| 2 | `.env.local` 없음 — Kakao 앱 키 미설정 | Step 3.9 |
| 3 | `public/og/{CODE}.png` 16개 없음 | Phase 2 콘텐츠 작업 |
| 4 | `public/favicon.svg` 기본 Vite 로고 — 교체 필요 | Phase 2 후반 (콘텐츠 톤 맞춤) |
| 5 | Vercel `rewrites` 미설정 (SPA 라우팅) | Step 3.12 |

## 7. 로컬 개발 실행

```powershell
cd C:\dev\ACTI\app
pnpm dev
# → http://localhost:5173 접속
```

브라우저에서 다음 경로 확인 가능:
- `/` — S1 셸 ("S1 — Landing (TBD)")
- `/quiz` — S2 셸
- `/result/MINB` — S3 셸 (코드 표시 확인)
- `/result/XXXX` 또는 임의 경로 — S4 404 셸

## 🎯 Step 3.6 (Content Schema)로 넘기는 것

DB가 없는 정적 SPA이므로 `data-modeling.md` 대신 **정적 콘텐츠 스키마**를 정의:

1. `src/content/schema.ts` — TypeScript 타입 정의 (`Question`, `Choice`, `TypeContent`, `Axis`, `TypeCode`)
2. `src/content/questions.ts` — 시나리오 문항 12~14개 (Phase 2에서 폴리싱, v1 골격용으로 임시 더미 5~6개)
3. `src/content/types.ts` — 16유형 콘텐츠 (Phase 2에서 폴리싱, v1 골격용으로 임시 4~6개)
4. 타입 안정성: 모든 유형 코드는 16개 화이트리스트 안에서만 사용 가능하도록 union type

> Step 3.4 (DB Setup) / 3.5 (ORM) / 3.7 (API) / 3.8 (Auth) 는 본 프로젝트 특성상 스킵.
