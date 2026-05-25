# Tech Stack — 연기 스타일 MBTI

> Stage 3.2 산출물 — 기술 스택 확정
> 작성일: 2026-05-14

## ✅ 최종 스택

| 레이어 | 선택 | 버전 (안정 최신) |
|---|---|---|
| 빌드 도구 | **Vite** | ^7.0.0 |
| UI 라이브러리 | **React** | ^19.0.0 |
| 언어 | **TypeScript** | ^5.6.0 |
| 라우터 | **react-router-dom** | ^7.0.0 |
| 아이콘 | **lucide-react** | ^0.470.0 |
| 이미지 캡처 | **html-to-image** | ^1.11.13 |
| OG 메타 | **react-helmet-async** | ^2.0.5 |
| 카카오 공유 | **Kakao JS SDK v2** | 외부 스크립트 (CDN) |
| 폰트 | **Pretendard Variable** | CDN (jsdelivr) |
| 패키지 매니저 | **pnpm** | latest |
| 호스팅 | **Vercel** | (서버리스 정적) |
| 테스트 | **Vitest** + **@testing-library/react** | 최신 |
| 린팅 | **ESLint** (Vite 기본) + **Prettier** | 최신 |

---

## 1. 빌드 도구 — Vite

**선택 이유**:
- 정적 SPA에 가장 단순·빠름
- HMR이 가장 빠름
- React 공식 권장 (CRA deprecated)
- Vercel·Netlify 둘 다 zero-config 배포

**대안 검토 / 비채택**:
- Next.js: SSR/RSC 불필요, 정적 export 가능하지만 설정 무거움
- Remix: 라우팅 강력하지만 서버 의존
- CRA: deprecated, 빌드 느림

---

## 2. UI 라이브러리 — React 19

**선택 이유**:
- 사용자 익숙도(중급 이상)
- 가장 큰 생태계 (Kakao SDK 통합, html-to-image 등 검증된 패키지)
- React 19의 새 기능 활용 가능 (필요 시)

**대안 검토 / 비채택**:
- Svelte: 번들 작지만 사용자 익숙도 낮을 수 있음
- Solid: 빠르지만 생태계 작음

---

## 3. 언어 — TypeScript

**strict 옵션** 활성화 (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

→ 16유형 콘텐츠 정합성을 타입으로 보장 (실수 방지).

---

## 4. 라우터 — react-router-dom v7

**필요 라우트**:
- `/` Landing
- `/quiz` Quiz
- `/result/:code` Result (16유형 화이트리스트 검증 내부)
- `*` 404

**선택 이유**:
- v7부터 데이터 로딩·SSR 통합 (필요시 사용)
- 가장 익숙한 React 라우터
- 정적 빌드와 호환 (BrowserRouter)

**SPA 배포 시 주의**: Vercel rewrites 또는 Netlify `_redirects`로 모든 경로 → `index.html` 처리 필요 (Step 3.12에서 설정).

---

## 5. 아이콘 — lucide-react

**선택 이유**:
- design-tokens.md / SKILL.md 가이드 "이모지 금지 — 아이콘 라이브러리"
- 트리 셰이킹 우수 (번들에 사용 아이콘만 포함)
- 시각 톤이 본 프로젝트 친수성에 잘 맞음

**대안**:
- Heroicons: 두 가지 스타일만 (outline/solid). Lucide가 더 풍부
- Phosphor: 두꺼운 옵션 더 많음. 본 프로젝트엔 Lucide로 충분

---

## 6. 이미지 캡처 — html-to-image

**선택 이유**:
- html2canvas보다 가볍고 모던 (SVG 활용)
- iOS Safari 호환성 우수
- React 친화 API

**대안 검토**:
- html2canvas: 가장 유명하지만 iOS Safari에서 일부 폰트/그라데이션 깨짐 보고됨
- dom-to-image-more: 유지보수 약함

**캡처 대상**: `CaptureCard` 컴포넌트의 ref. PNG 1080×1350 (4:5) 또는 모바일 원본 비율로 저장.

---

## 7. OG 메타 — react-helmet-async

**역할**: 결과 페이지에서 16유형별 OG 태그 동적 주입.

**SPA 한계 보완**: 정적 빌드 시 클라이언트 측 OG 태그는 카톡·페북 봇이 못 읽음.
→ **빌드 시점에 16개 결과 페이지를 사전 정적 생성** 하는 후처리 스크립트 추가 (Phase 2 후반).
   - 옵션 A: `vite-plugin-prerender` 또는 `@prerenderer/rollup-plugin`
   - 옵션 B: 수동 스크립트로 16개 `result/{CODE}.html` 생성
→ Step 3.12 빌드 설정에서 확정.

---

## 8. 카카오 공유 — Kakao JS SDK v2

**로딩 방식**: `index.html`에 외부 스크립트 추가
```html
<script
  src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
  integrity="sha384-..."
  crossorigin="anonymous"
></script>
```

**초기화**: `src/lib/kakao.ts`에서 앱 키로 1회 초기화.
**앱 키**: `.env.local`의 `VITE_KAKAO_APP_KEY` (개발자센터에서 발급).

---

## 9. 폰트 — Pretendard Variable

**로딩 방식**: jsdelivr CDN preload + CSS @font-face (이미 globals.css 토큰에 정의됨).
```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css" />
```

**font-display: swap** 자동 적용 (Pretendard 패키지 기본).

---

## 10. 패키지 매니저 — pnpm

**선택 이유**:
- 디스크 효율 (sym-link 공유)
- 빠른 설치
- 모노레포 확장성 (필요 시)

**대안**:
- npm: 호환성 가장 넓지만 설치 느림
- yarn: 무난, 단 pnpm 대비 디스크 이점 약함

---

## 11. 테스트 — Vitest + Testing Library

**도입 범위 (Step 3.11)**:
- `scoring.ts` 단위 테스트 (점수 → 유형 매핑)
- `storage.ts` localStorage 래퍼 테스트
- 컴포넌트 렌더링 스모크 테스트 (선택)
- E2E는 v1 범위 밖 (Playwright 등 도입 안 함)

**선택 이유**:
- Vite와 통합 (별도 설정 거의 없음)
- Jest 호환 API
- ESM 친화

---

## 12. 린팅 / 포맷팅

- **ESLint**: Vite React TS 템플릿 기본 + `react-hooks` 규칙
- **Prettier**: 코드 포맷 (semi: true, singleQuote: true, printWidth: 100)
- **husky/lint-staged**: v1 범위 밖 (1인 사이드 프로젝트 → 수동 lint)

---

## 13. 환경 변수

`.env.local` (Vite 컨벤션: `VITE_` 접두사):
```env
VITE_KAKAO_APP_KEY=your_kakao_app_key
VITE_SITE_URL=https://acti.example.com    # OG 절대 URL용
```

`.gitignore`:
```
.env.local
.env.*.local
```

---

## 14. 호스팅 — Vercel

**선택 이유**:
- React/Vite zero-config
- 자동 HTTPS / CDN
- 미리보기 배포 (PR 브랜치별)
- 무료 플랜으로 사이드 프로젝트 충분

**대안**:
- Netlify: 동급, 선호 차이만
- Cloudflare Pages: 무료 빌드 분량 큼, 단 Vercel만큼 zero-config은 아님

---

## 15. package.json (예상)

```json
{
  "name": "acti",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "lucide-react": "^0.470.0",
    "html-to-image": "^1.11.13",
    "react-helmet-async": "^2.0.5"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.6.0",
    "vite": "^7.0.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jsdom": "^25.0.0",
    "eslint": "^9.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "prettier": "^3.0.0"
  }
}
```

> 정확한 버전은 Step 3.3에서 `pnpm create vite@latest` 실행 시 확정됨.

---

## 16. 번들 크기 목표

| 항목 | 목표 |
|---|---|
| 초기 JS (gzip) | ≤ 100KB |
| 폰트 (Pretendard subset) | ~80KB (외부 CDN) |
| 카카오 SDK | ~40KB (외부 CDN, 결과 페이지에서만 로드) |
| 첫 페인트 | ≤ 1.5s (모바일 4G 기준) |

**예상 의존성 크기**:
- React + ReactDOM: ~45KB gzip
- react-router-dom: ~15KB
- lucide-react (트리 셰이크): ~5~10KB (사용 아이콘 ~15개)
- html-to-image: ~12KB
- react-helmet-async: ~4KB
- **합계 ~85KB** → 목표 안

---

## 17. 디자인 토큰 적용 방식

`design-tokens.md` § 5 globals.css 를 `src/styles/globals.css`로 **그대로 복붙**.
`main.tsx`에서 import:
```ts
import './styles/globals.css';
```

→ Tailwind 도입 안 함 (디자인 시스템이 이미 CSS Variable로 잘 정의됨, 추가 빌드 단계 회피).

---

## 18. 결정 요약표

| 질문 | 답 |
|---|---|
| 빌드 도구? | Vite |
| UI? | React 19 + TS strict |
| CSS? | Vanilla CSS + CSS Variables (Tailwind 안 씀) |
| 라우터? | react-router-dom v7 |
| 상태 관리? | useState/Context만 (라이브러리 안 씀) |
| 이미지 캡처? | html-to-image |
| 공유? | Kakao SDK + Web Share API + 클립보드 |
| 폰트? | Pretendard Variable (CDN) |
| 패키지 매니저? | pnpm |
| 테스트? | Vitest (점수 로직 위주) |
| 호스팅? | Vercel |

---

## 🎯 Step 3.3로 넘기는 것

확정된 스택으로 실제 프로젝트 초기화:
1. `pnpm create vite@latest acti -- --template react-ts` 실행
2. 추가 의존성 설치
3. globals.css 복붙
4. 디렉토리 구조 생성 (`components/`, `pages/`, `content/`, `lib/`, `styles/`)
5. 라우팅 셋업 (App.tsx)
6. 기본 페이지 컴포넌트 4개 빈 셸 생성
7. 첫 `pnpm dev` 정상 동작 확인
