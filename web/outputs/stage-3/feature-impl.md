# Feature Implementation — 연기 스타일 MBTI

> Stage 3.9 산출물 — 핵심 로직 모듈 구현
> 작성일: 2026-05-14

## 1. 생성된 모듈

| 파일 | 책임 |
|---|---|
| `src/lib/scoring.ts` | 답안 → 4축 점수 → 4글자 TypeCode |
| `src/lib/storage.ts` | localStorage `myTypeCode` 영속화 |
| `src/lib/kakao.ts` | Kakao SDK 초기화 + sendDefault 래퍼 |
| `src/lib/share.ts` | 이미지 캡처(html-to-image) + URL 복사 |

각 모듈은 **순수 함수** 위주로 작성되어 UI에서 직접 호출만 하면 됨 (Step 3.10).

## 2. scoring.ts — 점수 계산

### tie-break 규칙

| 축 | 동점 시 우세 |
|---|---|
| M ↔ T (philosophy) | **T** (테크닉/분석 기본값) |
| I ↔ P (operation) | **P** (설계 기본값) |
| N ↔ A (preparation) | **A** (분석 기본값) |
| B ↔ S (expression) | **S** (내면 기본값) |

> 동점은 "균형형"인 사용자가 분석·설계 쪽으로 떨어지도록 정한 보수적 기본값. β 테스트 후 분포 쏠리면 조정 검토.

### API
```ts
tally(choices: Choice[]): AxisScore       // 4축 누적 점수
resolveCode(score: AxisScore): TypeCode   // 동점 처리 포함 최종 코드
computeType(choices: Choice[]): TypeCode  // 편의 함수
```

### 동작 예
```
choices = [I, P, N, A, B, S] (6개, 각 극 1번씩)
tally  → { M:0, T:0, I:1, P:1, N:1, A:1, B:1, S:1 }
resolve → 'TPAS' (모든 축 동점 → tie-break 기본값으로 모두 떨어짐)
```

## 3. storage.ts — localStorage 영속화

### 키
- `myTypeCode` : `TypeCode | null`

### API
```ts
getMyTypeCode(): TypeCode | null   // 잘못된 값은 isTypeCode 가드로 null 반환
setMyTypeCode(code: TypeCode): void
clearMyTypeCode(): void
```

### 안전 처리
- `window.localStorage` 부재 (SSR/빌드) → null 반환, no-op
- private mode `setItem` throw → try-catch로 무시
- 잘못된 값(예: 외부에서 임의로 변조) → `isTypeCode` 가드로 null

## 4. kakao.ts — 카카오 공유

### 외부 의존
- `index.html` 의 외부 스크립트로 `window.Kakao` 글로벌 등록
- `.env.local`의 `VITE_KAKAO_APP_KEY` 필요 (Step 3.12에서 안내)

### API
```ts
ensureKakaoReady(): boolean                              // 멱등 초기화
shareToKakao(type: TypeContent, siteUrl: string): void   // 피드 카드 공유
```

### 미초기화 시 동작
- 앱 키 없거나 SDK 미로드 시 `console.warn` 후 no-op
- UI 측에서 키 부재 시 카톡 공유 버튼 disabled 처리 가능

### 페이로드 (idea-brief / design-spec 일치)
```
title:       [MINB] 비 오는 날 뛰쳐나가는 햄릿형
description: 감정에 잠겼다 가버리는, 그러나 무대 위에선 누구보다 진짜다.
imageUrl:    {siteUrl}/og/MINB.png
link:        {siteUrl}/result/MINB
button:      "나도 풀어보기" → {siteUrl}/
```

## 5. share.ts — 이미지 / URL 공유

### saveCaptureAsImage
- `html-to-image` 의 `toPng()` 사용
- `pixelRatio: 2` (모바일 망점 대응)
- `backgroundColor: #FAFAF8` (캡처 영역 외 흰 영역도 페이지 톤으로)
- 다운로드는 hidden `<a download>` 트리거

### copyResultUrl
- 우선: `navigator.clipboard.writeText()` (현대 브라우저)
- 폴백: `document.execCommand('copy')` + hidden textarea (구형 iOS)

### getSiteUrl
- 빌드 환경: `VITE_SITE_URL` 환경 변수 사용 (예: `https://acti.example.com`)
- 개발 환경: `window.location.origin`

## 6. UI 통합 미리보기 (Step 3.10에서 적용)

```tsx
// QuizPage.tsx
import { computeType } from '../lib/scoring';
import { setMyTypeCode } from '../lib/storage';

const code = computeType(answers);
setMyTypeCode(code);
navigate(`/result/${code}`, { replace: true });
```

```tsx
// ResultPage.tsx
import { getMyTypeCode } from '../lib/storage';
import { saveCaptureAsImage, copyResultUrl, getSiteUrl } from '../lib/share';
import { shareToKakao } from '../lib/kakao';

const isRecipient = getMyTypeCode() !== urlCode;
// ...
onSaveImage = () => saveCaptureAsImage(captureRef.current!, `acti-${code}.png`);
onCopyUrl   = () => copyResultUrl(code);
onKakao     = () => shareToKakao(type, getSiteUrl());
```

## 7. 검증

| 항목 | 결과 |
|---|---|
| `pnpm build` | ✅ 통과 (TS 0 error) |
| 번들 크기 (gzip) | 77.04 KB (lib/*는 tree-shake — 사용처 없음) |
| html-to-image / kakao 타입 | 모두 OK |

→ 실제 라이브러리 사용은 Step 3.10 UI 구현 시점. 번들에 합류하면 약간 증가 예상.

## 8. 명시적으로 안 한 것

- **테스트 작성** — Step 3.11에서 scoring/storage 단위 테스트
- **에러 토스트 / 사용자 피드백** — Step 3.10 UI 구현 시 Toast 컴포넌트와 함께
- **OG 이미지 사전 생성** — Phase 2 후반 (콘텐츠 완성 후)
- **카카오 앱 키 발급** — Phase 1 후반 배포 직전 (개발자센터)

## 🎯 Step 3.10 (UI Implementation)로 넘기는 것

8개 공통 컴포넌트 + 5개 페이지를 design-spec-web.md 기준으로 실제 구현:

**컴포넌트 (`src/components/`)**
1. Badge, ChoiceCard, PrimaryButton, SecondaryButton, ProgressBar, CaptureCard, TypeCard, ShareActionButton, Toast

**페이지 (`src/pages/`)**
1. LandingPage — 도메인 시그널 + 코드 미리보기 + 시작 CTA
2. QuizPage — ProgressBar + 시나리오 + ChoiceCard×4 + 자동 진행 + scoring 연결
3. ResultPage — 본인/수신자 모드 분기 + CaptureCard + 천적/베프 + 공유 + 다시 풀기
4. NotFoundPage — `[???]` Badge + 위트 메시지 + CTA 2개

이번 Step에서 첫 end-to-end 흐름이 완성되어, 브라우저에서 직접 풀어볼 수 있게 됨.
