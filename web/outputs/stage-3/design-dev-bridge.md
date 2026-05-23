# Design-to-Dev Bridge — 연기 스타일 MBTI

> Stage 3.1 산출물 — 디자인 명세 → 코드 구조 매핑
> 작성일: 2026-05-14

## 1. 매핑 원칙

| 디자인 산출물 | 코드 산출물 | 매핑 방식 |
|---|---|---|
| `design-tokens.md` § 5 globals.css | `src/styles/globals.css` | 그대로 복붙 (토큰 = CSS Variables) |
| `component-spec-web.md` C1~C8 | `src/components/{Name}.tsx` | 컴포넌트 1:1, props는 명세 그대로 |
| `wireframes-web.md` S1~S4 | `src/pages/{Name}.tsx` | 페이지 1:1 |
| `design-spec-web.md` 마크업 트리 | 페이지 컴포넌트 JSX | 의사 코드 → 실제 JSX |
| `animation-spec.md` | CSS keyframes + transitions | CSS 우선, Framer Motion 안 씀 |
| 16유형 시그니처 컬러 | `[data-type="00"]` 셀렉터 | globals.css에 이미 정의됨 |

---

## 2. 디렉토리 구조

```
acti/
├── public/
│   ├── og/                    # 16유형 OG 이미지 (Phase 2 후반)
│   │   ├── MINB.png
│   │   └── ... (16개)
│   └── favicon.svg
├── src/
│   ├── components/            # 공통 컴포넌트 (C1~C8)
│   │   ├── Badge.tsx
│   │   ├── ChoiceCard.tsx
│   │   ├── PrimaryButton.tsx
│   │   ├── SecondaryButton.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── CaptureCard.tsx
│   │   ├── TypeCard.tsx
│   │   ├── ShareActionButton.tsx
│   │   └── Toast.tsx           # 보조
│   ├── pages/                  # 화면 (S1~S4)
│   │   ├── LandingPage.tsx
│   │   ├── QuizPage.tsx
│   │   ├── ResultPage.tsx     # S3 + S3' 통합 (모드 판별)
│   │   └── NotFoundPage.tsx
│   ├── content/                # 정적 콘텐츠 (DB 대체)
│   │   ├── questions.ts        # 12~14 시나리오 문항
│   │   ├── types.ts            # 16유형 콘텐츠
│   │   └── schema.ts           # TypeScript 타입 정의
│   ├── lib/                    # 핵심 로직
│   │   ├── scoring.ts          # 점수 계산 → 유형 코드
│   │   ├── share.ts            # 카톡/URL/이미지 공유
│   │   ├── storage.ts          # localStorage 래퍼
│   │   └── kakao.ts            # Kakao SDK 초기화
│   ├── styles/
│   │   └── globals.css         # design-tokens.md § 5
│   ├── App.tsx                 # 라우팅
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 3. 컴포넌트 ↔ 파일 매핑

| 컴포넌트 (명세) | 파일 | 주요 Props 매핑 |
|---|---|---|
| C1 Badge | `Badge.tsx` | `code, variant?, size?` |
| C2 ChoiceCard | `ChoiceCard.tsx` | `icon, label, selected, onClick, disabled?` |
| C3 PrimaryButton | `PrimaryButton.tsx` | `children, onClick?, fullWidth?, size?, disabled?, as?, href?` |
| C4 SecondaryButton | `SecondaryButton.tsx` | C3와 동일 |
| C5 ProgressBar | `ProgressBar.tsx` | `current, total, onBack?` |
| C6 CaptureCard | `CaptureCard.tsx` | `typeIndex, code, name, tagline, traits, domRef?` |
| C7 TypeCard | `TypeCard.tsx` | `relation?, code, name, typeIndex, interactive?` (preview용 변형) |
| C8 ShareActionButton | `ShareActionButton.tsx` | `type, onAction, disabled?, label?` |

→ 모든 props는 component-spec-web.md의 Props 표와 1:1 대응.

---

## 4. 페이지 ↔ 화면 매핑

| 화면 (스펙) | 페이지 | URL |
|---|---|---|
| S1 랜딩 | `LandingPage.tsx` | `/` |
| S2 문항 | `QuizPage.tsx` | `/quiz` |
| S3 결과 (본인) | `ResultPage.tsx` (mode='self') | `/result/:code` |
| S3' 결과 (수신자) | `ResultPage.tsx` (mode='recipient') | 동일 (localStorage 판별) |
| S4 404 | `NotFoundPage.tsx` | `*` |

→ S3와 S3'는 같은 파일, `mode` 내부 상태로 판별 (design-spec-web.md `isRecipient` 로직).

---

## 5. 상태 관리 매핑

PRD 9.4 기준 (서버 없음, 정적 SPA):

| 상태 | 위치 | 수명 |
|---|---|---|
| 진행 중인 답안 (배열) | React useState (App 또는 QuizPage 내부) | 세션 (페이지 이탈 시 소실 가능) |
| 본인 결과 코드 | `localStorage.setItem('myTypeCode', code)` | 영구 (다시 풀기로 갱신) |
| 공유 수신자 컨텍스트 | URL 파라미터 vs localStorage 비교 | 즉시 판별 |
| 16유형 콘텐츠 | `src/content/types.ts` (정적 import) | 빌드 시점 고정 |

→ 글로벌 상태 라이브러리(Redux/Zustand/Jotai) **불필요**. React useState/Context만으로 충분.

---

## 6. 라우팅 매핑

**라이브러리**: `react-router-dom` v6 (가장 익숙, 정적 SPA에 충분)

```ts
// App.tsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/quiz" element={<QuizPage />} />
  <Route path="/result/:code" element={<ResultPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

`/result/:code`의 `code`가 16유형 화이트리스트 밖이면 `<NotFoundPage>` 렌더 (ResultPage 내부에서 분기).

---

## 7. 애니메이션 매핑 (CSS 우선)

| 디자인 명세 (animation-spec.md) | 구현 방식 |
|---|---|
| 페이지 fade + translate | CSS class `.page-enter` (mount 시 적용) |
| ChoiceCard 선택 후 다음 진행 | setTimeout 300ms 후 라우팅 |
| ProgressBar width 변화 | CSS transition (이미 globals.css에 있음) |
| CaptureCard 셀럽레이션 stagger | CSS animation-delay |
| Toast | 자체 컴포넌트 + CSS animation |
| reduce-motion 대응 | globals.css `@media (prefers-reduced-motion)` |

→ Framer Motion 도입 안 함 (번들 +30KB 회피).

---

## 8. 이미지 캡처 / 공유 매핑

| 액션 | 라이브러리 / 방식 |
|---|---|
| 이미지 저장 | `html-to-image` (html2canvas 대안, 가볍고 신뢰성 ↑) |
| URL 복사 | `navigator.clipboard.writeText()` |
| 카카오 공유 | Kakao JS SDK v2 (`Kakao.Share.sendDefault`) |
| OG 태그 | 결과 페이지에서 `react-helmet-async` 동적 주입 |
| 인스타 스토리 (Could) | v1 범위 밖 |

→ Kakao SDK는 별도 외부 스크립트 로드 (index.html), 초기화는 `src/lib/kakao.ts`에서.

---

## 9. TypeScript 타입 매핑

```ts
// src/content/schema.ts
export type Axis = 'M' | 'T' | 'I' | 'P' | 'N' | 'A' | 'B' | 'S';
export type TypeCode = string; // 'MINB' 등 4글자

export type Question = {
  id: number;
  scenario: string;       // 1~3줄
  question: string;       // 짧은 질문
  choices: Choice[];      // 길이 4
};

export type Choice = {
  label: string;          // 선택지 카피
  axis: Axis;             // 어느 축의 어느 극인지
  iconName: string;       // Lucide 아이콘 이름
};

export type TypeContent = {
  code: TypeCode;
  index: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
  name: string;           // 위트 네이밍
  tagline: string;        // 한 줄 캐치프레이즈
  traits: string[];       // 캐릭터 묘사 3~4줄
  roles: string[];        // 어울리는 역할/장르 3~4개
  rival: TypeCode;        // 천적 유형 코드
  bff: TypeCode;          // 베프 유형 코드
};
```

→ 점수 계산 로직, 콘텐츠 정의, 결과 페이지 모두 이 타입을 공유.

---

## 10. 빌드 / 배포 매핑

| 항목 | 결정 |
|---|---|
| 빌드 | `vite build` → `dist/` |
| 배포 호스팅 | Vercel (Recommended) 또는 Netlify |
| 도메인 | 미정 (커스텀 도메인 옵션) |
| OG 이미지 정적 생성 | Phase 2 후반에 별도 작업 (Satori 또는 수작업) |
| 환경 변수 | `.env.local` (Kakao App Key) |

---

## 11. 핸드오프 체크리스트

- [x] design-tokens.md § 5 → globals.css 위치 결정
- [x] 컴포넌트 명세 → src/components/*.tsx 1:1
- [x] 화면 명세 → src/pages/*.tsx 1:1
- [x] 정적 콘텐츠 → src/content/*.ts (DB 대체)
- [x] 점수 계산 로직 → src/lib/scoring.ts
- [x] 공유 로직 → src/lib/share.ts + lib/kakao.ts
- [x] localStorage 키 → 'myTypeCode'
- [x] 16유형 OG 이미지 → public/og/{CODE}.png (Phase 2)
- [x] 카카오 SDK 외부 스크립트 → index.html
- [x] reduce-motion 대응 → globals.css 끝

---

## 🎯 Step 3.2로 넘기는 것

기술 스택을 구체적으로 확정:
- React 버전, Vite 버전
- 라우터, 카카오 SDK, html-to-image, react-helmet-async 등 정확 버전
- 폰트 로딩 (Pretendard) 방식
- 패키지 매니저 (npm vs pnpm)
- 타입스크립트 strict 옵션
