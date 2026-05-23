# UI Implementation — 연기 스타일 MBTI

> Stage 3.10 산출물 — 8개 컴포넌트 + 4개 페이지 실제 구현
> 작성일: 2026-05-15

## 1. 생성된 파일

### 컴포넌트 (`src/components/`)

| TSX | CSS | 명세 |
|---|---|---|
| Badge.tsx | Badge.css | C1 |
| ChoiceCard.tsx | ChoiceCard.css | C2 |
| PrimaryButton.tsx | PrimaryButton.css | C3 |
| SecondaryButton.tsx | SecondaryButton.css | C4 |
| ProgressBar.tsx | ProgressBar.css | C5 |
| CaptureCard.tsx | CaptureCard.css | C6 |
| TypeCard.tsx | TypeCard.css | C7 (interactive + static 변형) |
| ShareActionButton.tsx | ShareActionButton.css | C8 (idle/loading/success 3상태) |
| Toast.tsx | Toast.css | 보조 (1.7s auto-dismiss) |

### 페이지 (`src/pages/`)

| TSX | CSS | 화면 |
|---|---|---|
| LandingPage.tsx | LandingPage.css | S1 |
| QuizPage.tsx | QuizPage.css | S2 (자동 진행 + 점수 계산 연결) |
| ResultPage.tsx | ResultPage.css | S3 + S3' 통합 (localStorage 모드 판별) |
| NotFoundPage.tsx | NotFoundPage.css | S4 |

## 2. End-to-End 흐름 (완성)

```
/ (Landing)
  ↓ 시작하기 클릭
/quiz
  ├─ 6문항 (Phase 1 임시) 풀이
  ├─ 선택 시 250~300ms 시각 피드백 후 자동 다음
  ├─ 이전 화살표로 답 수정 가능
  └─ 마지막 답 → computeType() → setMyTypeCode() → /result/{code} replace
/result/:code
  ├─ 화이트리스트 검증 (16유형 외 → NotFoundPage 렌더)
  ├─ localStorage 코드 == URL 코드 → 본인 모드 (셀럽레이션 ON)
  ├─                != → 수신자 모드 ("나도 풀어보기" CTA 강조)
  ├─ CaptureCard (data-type 동적 컬러 0~15)
  ├─ 천적/베프 TypeCard → /result/{rival} (사슬 연장)
  ├─ 공유 3액션: 이미지 / URL / 카톡
  ├─ Helmet으로 OG 태그 동적 주입
  └─ 다시 풀기 → clearMyTypeCode() + /quiz replace
/* 외 → NotFoundPage
```

## 3. 핵심 구현 디테일

### 3.1 QuizPage 상태 관리
- `answers: (Choice | null)[]` — 문항당 1슬롯, null 가능 (뒤로가기 후 새 선택 전)
- 선택 즉시 `setTimeout(handler, 250)` 으로 자동 다음 (시각 피드백 보장)
- 마지막 문항은 300ms 후 결과 페이지로 라우팅 (셀럽레이션 마진)
- `key={question.id}` 로 본문 영역 재마운트 → 슬라이드 인 애니메이션 트리거

### 3.2 ResultPage 모드 판별
```ts
const myCode = useMemo(() => getMyTypeCode(), []);
const isRecipient = !myCode || myCode !== code;
const isCelebrate = !isRecipient && myCode === code;
```
- 본인 모드: 셀럽레이션 stagger 애니메이션 ON
- 수신자 모드: 안내 텍스트 + "나도 풀어보기" CTA + 셀럽레이션 OFF

### 3.3 16유형 동적 컬러
```tsx
<CaptureCard typeIndex={type.index} ... />
// 내부: <section data-type={String(typeIndex).padStart(2, '0')}>
// globals.css의 [data-type="00"] ~ [data-type="15"] 셀렉터가
// --bg-capture / --text-on-type 자동 주입
```

### 3.4 OG 태그 (react-helmet-async)
- 결과 페이지에서 동적 주입 (title / description / og:* / twitter:*)
- 클라이언트 측 주입이라 카톡 봇은 아직 못 읽음 — Phase 2 후반 사전 정적 생성 필요 (Step 3.12)

### 3.5 화이트리스트 가드
```tsx
if (!rawCode || !isTypeCode(rawCode)) {
  return <NotFoundPage />;
}
```
- `/result/XXXX` (16유형 외) → 자동으로 S4 렌더, URL 변경 없음
- React Router 라우트 외(`*`)도 동일 처리

## 4. 번들 크기 — 트리 셰이킹 수정

### 4.1 문제 발견
첫 빌드: **892 KB / gzip 245 KB** (목표 100KB의 2.4배)

원인: `import * as Lucide from 'lucide-react'` 가 라이브러리 전체를 번들에 포함시킴 (동적 `Lucide[iconName]` 조회 때문에 트리 셰이킹 불가).

### 4.2 수정
- `Choice.iconName: string` → `Choice.icon: LucideIcon` (컴포넌트 직접 저장)
- `questions.ts` 에서 사용 아이콘 명시 import (~20개)
- `QuizPage` 의 `resolveIcon()` 함수 제거 — props에서 `c.icon` 직접 사용

### 4.3 결과
| 항목 | 수정 전 | 수정 후 |
|---|---|---|
| JS 원본 | 892.95 KB | 287.56 KB |
| JS gzip | **244.68 KB** | **94.77 KB** ✅ |
| CSS gzip | 4.27 KB | 4.27 KB |
| 빌드 시간 | 14.5s | 2.7s |

목표(≤100KB gzip) 통과.

## 5. 빌드 결과 (현재 상태)

```
✓ 1785 modules transformed.
dist/index.html                    1.06 kB │ gzip:  0.61 kB
dist/assets/index-{hash}.css      19.31 kB │ gzip:  4.27 kB
dist/assets/index-{hash}.js      287.56 kB │ gzip: 94.77 kB
✓ built in 2.70s
```

TS strict 모드 0 에러. ESLint 미실행 (Step 3.11에서).

## 6. 로컬 동작 확인 절차

```powershell
cd C:\dev\ACTI\app
pnpm dev
# → http://localhost:5173
```

### 시나리오
1. `/` 랜딩 — 도메인 시그널 + 코드 미리보기 + 시작 CTA
2. `/quiz` — 6문항 풀이 (선택 즉시 자동 다음, 이전 가능)
3. 마지막 답 → 자동으로 `/result/{계산된 코드}` 로 이동
4. CaptureCard 셀럽레이션 (네이밍 → 캐치프레이즈 → 묘사 4줄 stagger)
5. 공유 액션 3개 동작 확인 (이미지 저장 / 링크 복사 / 카톡)
   - 카톡은 `VITE_KAKAO_APP_KEY` 미설정 시 console.warn (정상)
6. 천적/베프 카드 클릭 → 다른 유형 결과지로 이동, 뒤로가기로 복귀
7. 시크릿 창에서 결과 URL 직접 진입 → S3' 수신자 모드 ("나도 풀어보기" 강조)
8. `/result/XXXX` 등 잘못된 코드 → S4 404 페이지

## 7. 알려진 제약 / 후속 처리

| # | 항목 | 처리 단계 |
|---|---|---|
| 1 | 콘텐츠 16유형 중 6개만 폴리싱, 나머지 10개는 폴백 표시 | Phase 2 콘텐츠 작업 |
| 2 | 문항 6개 (12~14개 목표) | Phase 2 |
| 3 | Kakao 앱 키 미설정 → 카톡 공유 비활성 | Phase 1 후반 배포 직전 |
| 4 | OG 이미지 16개 미생성 → 미리보기 깨짐 | Phase 2 후반 |
| 5 | OG 태그 클라이언트 주입만 됨 → 카톡 봇 미인식 | Step 3.12 사전 정적 생성 |
| 6 | Vercel SPA rewrites 미설정 | Step 3.12 |
| 7 | favicon.svg 기본값 | Phase 2 후반 |
| 8 | reduce-motion 대응 globals.css에 있음 ✅ | — |

## 8. 정합성 체크리스트

- [x] 모든 컴포넌트가 design-spec-web.md / component-spec-web.md Props 일치
- [x] 모든 페이지가 design-spec-web.md 마크업 트리 일치
- [x] 토큰 외 HEX·px 하드코딩 없음
- [x] 이모지 0개 (모든 시각 요소 Lucide 아이콘)
- [x] reduce-motion 대응 globals.css 글로벌
- [x] 모바일 first 480px 컨테이너 일관
- [x] 터치 타겟 ≥ 44px (ChoiceCard ~64px, CTA 56px, Share 80px)
- [x] 키보드 조작 (focus-visible) + aria-label / aria-pressed / role="progressbar"

## 🎯 Step 3.11 (Testing)로 넘기는 것

핵심 비즈니스 로직과 콘텐츠 invariant 자동 검증:

1. **Vitest 셋업** (vite.config.ts에 test 옵션 또는 vitest.config.ts)
2. `lib/scoring.ts` 단위 테스트
   - 명시적 케이스 (모든 M, 모든 T 등)
   - tie-break 규칙 검증
3. `lib/storage.ts` 단위 테스트 (localStorage mock)
4. **콘텐츠 invariant**
   - `POLISHED` 키 ⊂ `TYPE_CODES`
   - 모든 폴리싱 유형의 rival/bff가 유효한 TypeCode
   - 모든 문항의 choices 길이 = 4
   - 4축 모두 8극이 문항·선택지에서 최소 1회 등장
