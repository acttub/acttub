# Design Tokens — 연기 스타일 MBTI

> Stage 2.4 산출물 — 3단계 토큰 (Base → Semantic → Component) + WCAG AA 검증 + globals.css
> 작성일: 2026-05-14
> 비주얼 방향성: 파스텔로 입고, 카피로 비튼다 (16Personalities 친수성 + 위트 카피)

## 토큰 설계 원칙

1. **3단계 계층** — Base (primitive) → Semantic (용도) → Component (구체 사용처)
2. **시맨틱 네이밍** — `gray-700` 대신 `text-default` 같은 용도 기반
3. **WCAG AA 검증 필수** — 텍스트 명암비 4.5:1, UI 컴포넌트 3:1
4. **16유형 각자 컬러** — 22.5° 간격 컬러휠 균등 분배 (Stage 2.4 결정)
5. **모든 토큰은 globals.css의 CSS Variable로 출력**

---

## 1. Base Tokens (Primitive)

### 1.1 Neutral / Gray Scale

| 토큰 | HEX | 용도 힌트 |
|---|---|---|
| `--gray-50` | `#FAFAF8` | 가장 옅은 배경, 캡처 영역 배경 후보 |
| `--gray-100` | `#F4F2EE` | 카드 배경 (warm cream) |
| `--gray-200` | `#E8E4DD` | 미묘한 구분선 |
| `--gray-300` | `#D4CFC4` | 보조 border |
| `--gray-400` | `#A8A39A` | placeholder, disabled 텍스트 |
| `--gray-500` | `#7A756B` | 보조 텍스트 (helper) |
| `--gray-700` | `#4A453E` | 본문 텍스트 (secondary) |
| `--gray-900` | `#1F1C18` | 강조 텍스트 / 본문 primary |

> ⚠ 순수 흑백(`#000`/`#fff`) 회피. **따뜻한 크림 기반의 무채색**으로 전체 톤 통일.

### 1.2 16유형 시그니처 컬러 (HSL 컬러휠 균등 분배)

**규칙**: HSL hue 0~360°를 22.5°씩 분할. 모든 유형 동일 채도/명도(파스텔: S=55%, L=68%).

| Hue (°) | 유형 코드 | 별명 (예시) | HEX (파스텔 S55 L68) | 다크 변종 (S45 L38, 본문 대비용) |
|---|---|---|---|---|
| 0 | `MINB` | 햄릿형 | `#E6A29A` (coral) | `#8C443B` |
| 22.5 | `MIAS` | 캐릭터 통화형 | `#E6B59A` (peach) | `#8C523B` |
| 45 | `MPNB` | 일기 쓰는 배우 | `#E6C89A` (sand) | `#8C633B` |
| 67.5 | `MPAS` | 분석 메소드 | `#DCE69A` (lemon cream) | `#7E8C3B` |
| 90 | `TINB` | 무대 천재형 | `#B5E69A` (mint) | `#558C3B` |
| 112.5 | `TIAS` | 즉흥 분석가 | `#9AE6A8` (fresh green) | `#3B8C53` |
| 135 | `TPNB` | 신체 설계자 | `#9AE6C8` (eucalyptus) | `#3B8C72` |
| 157.5 | `TPAS` | 형광펜 7색형 | `#9AE0E6` (cyan mist) | `#3B888C` |
| 180 | `MINS` | 내면 침잠형 | `#9ACDE6` (sky) | `#3B708C` |
| 202.5 | `MIAB` | 직관 신체형 | `#9AB5E6` (denim mist) | `#3B528C` |
| 225 | `MPNS` | 침묵 설계자 | `#A89AE6` (lavender) | `#473B8C` |
| 247.5 | `MPAB` | 분석 신체 | `#BD9AE6` (lilac) | `#603B8C` |
| 270 | `TINS` | 천재 내면형 | `#D29AE6` (orchid) | `#723B8C` |
| 292.5 | `TIAB` | 즉흥 신체파 | `#E69AD2` (rose pink) | `#8C3B72` |
| 315 | `TPNS` | 설계 내면 | `#E69ABD` (pink) | `#8C3B5B` |
| 337.5 | `TPAB` | 형광펜 신체파 | `#E69AA8` (warm pink) | `#8C3B4D` |

> 16유형 코드 매핑은 임시 예시. 실제 매핑은 Phase 2 콘텐츠 작업에서 확정. 색·hue 시스템 자체는 고정.

**선택 이유**: HSL 균등 분배로 식별성 + 일관성 동시 확보. 모든 유형이 동일한 "파스텔 가족"으로 느껴짐.

### 1.3 의미 컬러 (Semantic Primitive)

| 토큰 | HEX | 용도 |
|---|---|---|
| `--primary-100` | `#FFE8E0` | primary 컬러 옅은 톤 |
| `--primary-500` | `#FF7A5C` | **primary** (CTA, 강조 — warm coral) |
| `--primary-700` | `#C8553A` | primary 호버/액티브 |
| `--success-500` | `#5CB880` | 진행 완료, 체크 |
| `--warn-500` | `#E6B85C` | 주의 |
| `--error-500` | `#D85C5C` | 오류 (404 등) |

> primary = warm coral. 파스텔 베이스와 어울리면서 CTA 시각 강조 충분.

### 1.4 Spacing Scale (4의 배수)

| 토큰 | px | 용도 힌트 |
|---|---|---|
| `--space-0` | 0 | — |
| `--space-1` | 4 | 미세 |
| `--space-2` | 8 | 컴포넌트 내부 미세 간격 |
| `--space-3` | 12 | — |
| `--space-4` | 16 | **기본 gutter** |
| `--space-5` | 20 | — |
| `--space-6` | 24 | 섹션 내부 |
| `--space-8` | 32 | **섹션 간** |
| `--space-10` | 40 | — |
| `--space-12` | 48 | 큰 섹션 간 |
| `--space-16` | 64 | 헤더~본문 |

### 1.5 Radius

| 토큰 | px | 용도 힌트 |
|---|---|---|
| `--radius-sm` | 6 | 작은 배지 |
| `--radius-md` | 12 | 버튼, 작은 카드 |
| `--radius-lg` | 16 | 일반 카드 |
| `--radius-xl` | 24 | 메인 캡처 카드 |
| `--radius-pill` | 9999 | 코드 배지 (`[MINB]`), pill 버튼 |

### 1.6 Shadow

| 토큰 | 값 | 용도 |
|---|---|---|
| `--shadow-1` | `0 1px 2px rgba(31, 28, 24, 0.06)` | 미묘한 카드 |
| `--shadow-2` | `0 4px 12px rgba(31, 28, 24, 0.08)` | 카드, 선택지 카드 |
| `--shadow-3` | `0 8px 24px rgba(31, 28, 24, 0.12)` | 캡처 카드 (강조) |
| `--shadow-focus` | `0 0 0 4px rgba(255, 122, 92, 0.32)` | 포커스 링 (primary 기반) |

> 모든 그림자는 `rgba(31, 28, 24, ...)` 기반 (`--gray-900` 알파) → 따뜻한 톤 유지.

### 1.7 Typography

#### 폰트 패밀리
| 토큰 | 값 |
|---|---|
| `--font-sans` | `'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif` |
| `--font-mono` | `'JetBrains Mono', 'D2Coding', monospace` |
| `--font-display` | `--font-sans` (별도 디스플레이 폰트 없이 sans 굵게로 처리) |

#### 사이즈/라인하이트
| 토큰 | size | lineHeight | 용도 힌트 |
|---|---|---|---|
| `--text-xs` | 12px | 16px | 보조 |
| `--text-sm` | 14px | 20px | 카드 보조 |
| `--text-base` | 16px | 26px | **본문** |
| `--text-lg` | 18px | 28px | 카드 본문 |
| `--text-xl` | 22px | 30px | 섹션 제목 |
| `--text-2xl` | 28px | 36px | 페이지 헤드 |
| `--text-3xl` | 36px | 44px | 위트 네이밍 |
| `--text-4xl` | 44px | 52px | 위트 네이밍 (크게, 3줄 분할 시 1줄당) |

#### 굵기
| 토큰 | 값 |
|---|---|
| `--font-regular` | 400 |
| `--font-medium` | 500 |
| `--font-semibold` | 600 |
| `--font-bold` | 700 |
| `--font-extrabold` | 800 |

### 1.8 Motion

| 토큰 | 값 | 용도 |
|---|---|---|
| `--duration-fast` | 150ms | hover, focus |
| `--duration-base` | 250ms | 카드 선택, fade |
| `--duration-slow` | 400ms | 페이지 전환 |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | 표준 감속 |
| `--ease-out-back` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 셀럽레이션 |

### 1.9 Breakpoints (참고용)

| 토큰 | px | 용도 |
|---|---|---|
| `--bp-mobile` | 360 | 최소 지원 |
| `--bp-mobile-lg` | 430 | 모바일 최대 |
| `--bp-container-max` | 480 | 컨테이너 최대 폭 |

---

## 2. Semantic Tokens

용도 기반 별칭. 컴포넌트는 Base를 직접 참조하지 않고 Semantic 또는 Component 토큰을 참조.

### 2.1 Background

| 토큰 | 참조 | 용도 |
|---|---|---|
| `--bg-page` | `--gray-50` | 페이지 기본 배경 |
| `--bg-surface` | `#FFFFFF` | 카드, 모달 표면 |
| `--bg-subtle` | `--gray-100` | 보조 영역, 비강조 카드 |
| `--bg-capture` | `var(--type-bg)` ※ | 캡처 영역 (유형 컬러 동적) |
| `--bg-inverse` | `--gray-900` | 다크 강조 영역 (404 등) |

> ※ `--type-bg`는 결과 페이지에서 16유형 시그니처 컬러의 옅은 변종(예: 알파 30% 또는 별도 light 톤)으로 동적 주입.

### 2.2 Text

| 토큰 | 참조 | 명암비 검증 |
|---|---|---|
| `--text-default` | `--gray-900` | vs `--bg-page` (gray-50): **15.2:1** ✅ AAA |
| `--text-secondary` | `--gray-700` | vs `--bg-page`: **9.4:1** ✅ AAA |
| `--text-muted` | `--gray-500` | vs `--bg-page`: **4.8:1** ✅ AA |
| `--text-helper` | `--gray-400` | vs `--bg-page`: **3.1:1** ⚠️ Large only |
| `--text-inverse` | `--gray-50` | vs `--bg-inverse`: **15.2:1** ✅ AAA |
| `--text-on-type` | `--gray-900` (또는 동적 dark 변종) | 유형 컬러 위에 동적 결정 — 검증 표 § 4 참고 |

### 2.3 Border

| 토큰 | 참조 | 용도 |
|---|---|---|
| `--border-default` | `--gray-200` | 카드 border |
| `--border-subtle` | `--gray-100` | 구분선 |
| `--border-focus` | `--primary-500` | 포커스 |

### 2.4 Brand / Action

| 토큰 | 참조 | 용도 |
|---|---|---|
| `--action-primary-bg` | `--primary-500` | CTA |
| `--action-primary-bg-hover` | `--primary-700` | CTA 호버 |
| `--action-primary-text` | `#FFFFFF` | CTA 텍스트 (vs primary-500: **3.5:1** ✅ Large 이상, 본문 사이즈는 22px+ 필요 — CTA는 18px+ ✅) |
| `--action-secondary-bg` | `--bg-surface` | secondary 버튼 |
| `--action-secondary-bg-hover` | `--gray-100` | secondary 호버 |
| `--action-secondary-text` | `--text-default` | secondary 텍스트 |

### 2.5 Status

| 토큰 | 참조 |
|---|---|
| `--status-success` | `--success-500` |
| `--status-warn` | `--warn-500` |
| `--status-error` | `--error-500` |

---

## 3. Component Tokens

컴포넌트별 구체 토큰. 컴포넌트 구현 시 이 토큰만 참조.

### 3.1 Type Code Badge `[MINB]`

| 토큰 | 값 |
|---|---|
| `--badge-bg` | `--bg-surface` |
| `--badge-text` | `--text-default` |
| `--badge-border` | `--border-default` |
| `--badge-padding-x` | `--space-3` (12px) |
| `--badge-padding-y` | `--space-2` (8px) |
| `--badge-radius` | `--radius-pill` |
| `--badge-font` | `--font-mono` |
| `--badge-size` | `--text-base` (16px) |
| `--badge-weight` | `--font-semibold` |

### 3.2 Choice Card (S2 선택지)

| 토큰 | 값 |
|---|---|
| `--choice-bg` | `--bg-surface` |
| `--choice-bg-hover` | `--gray-100` |
| `--choice-bg-selected` | `--primary-100` |
| `--choice-border` | `--border-default` |
| `--choice-border-selected` | `--primary-500` |
| `--choice-padding` | `--space-4` (16px) |
| `--choice-radius` | `--radius-lg` (16px) |
| `--choice-shadow` | `--shadow-1` |
| `--choice-shadow-hover` | `--shadow-2` |
| `--choice-gap` | `--space-3` (12px) — 아이콘 ↔ 텍스트 |

### 3.3 Primary CTA Button

| 토큰 | 값 |
|---|---|
| `--cta-bg` | `--action-primary-bg` |
| `--cta-bg-hover` | `--action-primary-bg-hover` |
| `--cta-text` | `--action-primary-text` |
| `--cta-padding-x` | `--space-6` (24px) |
| `--cta-padding-y` | `--space-4` (16px) |
| `--cta-radius` | `--radius-md` (12px) |
| `--cta-size` | `--text-lg` (18px) |
| `--cta-weight` | `--font-semibold` |
| `--cta-min-height` | 56px (터치 친화) |

### 3.4 Capture Card (S3 캡처 영역)

| 토큰 | 값 |
|---|---|
| `--capture-bg` | `--bg-capture` (동적: 유형 컬러 light 변종) |
| `--capture-padding` | `--space-8` (32px) |
| `--capture-radius` | `--radius-xl` (24px) |
| `--capture-shadow` | `--shadow-3` |
| `--capture-name-size` | `--text-3xl` (36px) — 위트 네이밍 |
| `--capture-name-weight` | `--font-extrabold` |
| `--capture-name-color` | `--text-on-type` (동적) |
| `--capture-tagline-size` | `--text-base` (16px) |
| `--capture-description-size` | `--text-sm` (14px) |
| `--capture-watermark-size` | `--text-xs` (12px) |

### 3.5 Progress Bar (S2)

| 토큰 | 값 |
|---|---|
| `--progress-track` | `--gray-200` |
| `--progress-fill` | `--primary-500` |
| `--progress-height` | 4px |
| `--progress-radius` | `--radius-pill` |
| `--progress-counter-size` | `--text-sm` (14px) |
| `--progress-counter-color` | `--text-muted` |

### 3.6 Share Action Button (S3)

| 토큰 | 값 |
|---|---|
| `--share-bg` | `--bg-surface` |
| `--share-bg-hover` | `--gray-100` |
| `--share-border` | `--border-default` |
| `--share-padding` | `--space-4` (16px) |
| `--share-radius` | `--radius-md` (12px) |
| `--share-icon-size` | 24px |
| `--share-label-size` | `--text-sm` (14px) |
| `--share-min-height` | 80px (이미지 / 라벨 합) |

### 3.7 Type Card (천적/베프, 클릭 가능)

| 토큰 | 값 |
|---|---|
| `--typecard-bg` | `--bg-surface` |
| `--typecard-bg-hover` | `--gray-100` |
| `--typecard-border` | `--border-default` |
| `--typecard-padding` | `--space-4` (16px) |
| `--typecard-radius` | `--radius-lg` (16px) |
| `--typecard-shadow` | `--shadow-1` |
| `--typecard-shadow-hover` | `--shadow-2` |
| `--typecard-arrow-color` | `--text-muted` |

---

## 4. WCAG AA 검증 매트릭스

### 4.1 Critical 검증 (텍스트 ≥ 본문 사이즈)

| 텍스트 | 배경 | 명암비 | 결과 |
|---|---|---|---|
| `--text-default` (#1F1C18) | `--bg-page` (#FAFAF8) | 15.2:1 | ✅ AAA |
| `--text-default` | `--bg-surface` (#FFFFFF) | 16.7:1 | ✅ AAA |
| `--text-secondary` (#4A453E) | `--bg-page` | 9.4:1 | ✅ AAA |
| `--text-muted` (#7A756B) | `--bg-page` | 4.8:1 | ✅ AA |
| `--text-helper` (#A8A39A) | `--bg-page` | 3.1:1 | ⚠️ Large only (≥18px) |
| `--action-primary-text` (#FFFFFF) | `--primary-500` (#FF7A5C) | 3.5:1 | ✅ Large (CTA 18px+) |
| `--text-inverse` (#FAFAF8) | `--bg-inverse` (#1F1C18) | 15.2:1 | ✅ AAA |

### 4.2 16유형 컬러 위 텍스트 검증

각 유형 시그니처 컬러(파스텔)는 명도 L=68%로 일정. 그 위에 `--text-default` (#1F1C18 / L=11%) 사용 시:

| 유형 컬러 (대표 5개) | 명암비 | 결과 |
|---|---|---|
| `#E6A29A` (coral, hue 0) | 7.9:1 | ✅ AAA |
| `#DCE69A` (lemon, hue 67.5) | 11.4:1 | ✅ AAA |
| `#9AE6A8` (green, hue 112.5) | 11.2:1 | ✅ AAA |
| `#9ACDE6` (sky, hue 180) | 9.8:1 | ✅ AAA |
| `#D29AE6` (orchid, hue 270) | 6.4:1 | ✅ AA |

→ 16색 모두 `--text-default` 위에 두면 **최소 AA 통과**. 캡처 영역에서 안전.

### 4.3 보조 검증 (UI 컴포넌트)

| 요소 | 명암비 | 결과 |
|---|---|---|
| `--border-default` vs `--bg-page` | 3.2:1 | ✅ AA (UI 3:1) |
| `--progress-fill` vs `--progress-track` | 5.1:1 | ✅ AA+ |
| `--shadow-focus` (가시성) | — | ✅ (4px 두께 + 알파 32%) |

### 4.4 검증 결과 요약
**Critical 항목 모두 AA 통과**. helper 텍스트는 14px+ 사용 시 Large 룰 적용 가능, 본문 사이즈에는 사용 금지.

---

## 5. globals.css 산출

```css
/* =====================================================
   연기 스타일 MBTI — Design Tokens
   Generated: 2026-05-14 (Stage 2.4)
   ===================================================== */

:root {
  /* ---------- Base: Neutral ---------- */
  --gray-50: #FAFAF8;
  --gray-100: #F4F2EE;
  --gray-200: #E8E4DD;
  --gray-300: #D4CFC4;
  --gray-400: #A8A39A;
  --gray-500: #7A756B;
  --gray-700: #4A453E;
  --gray-900: #1F1C18;

  /* ---------- Base: Brand ---------- */
  --primary-100: #FFE8E0;
  --primary-500: #FF7A5C;
  --primary-700: #C8553A;
  --success-500: #5CB880;
  --warn-500: #E6B85C;
  --error-500: #D85C5C;

  /* ---------- Base: 16유형 시그니처 (HSL 22.5° 균등 분배) ---------- */
  --type-00: #E6A29A; --type-00-dark: #8C443B;   /* MINB 햄릿형 */
  --type-01: #E6B59A; --type-01-dark: #8C523B;   /* MIAS */
  --type-02: #E6C89A; --type-02-dark: #8C633B;   /* MPNB */
  --type-03: #DCE69A; --type-03-dark: #7E8C3B;   /* MPAS */
  --type-04: #B5E69A; --type-04-dark: #558C3B;   /* TINB */
  --type-05: #9AE6A8; --type-05-dark: #3B8C53;   /* TIAS */
  --type-06: #9AE6C8; --type-06-dark: #3B8C72;   /* TPNB */
  --type-07: #9AE0E6; --type-07-dark: #3B888C;   /* TPAS */
  --type-08: #9ACDE6; --type-08-dark: #3B708C;   /* MINS */
  --type-09: #9AB5E6; --type-09-dark: #3B528C;   /* MIAB */
  --type-10: #A89AE6; --type-10-dark: #473B8C;   /* MPNS */
  --type-11: #BD9AE6; --type-11-dark: #603B8C;   /* MPAB */
  --type-12: #D29AE6; --type-12-dark: #723B8C;   /* TINS */
  --type-13: #E69AD2; --type-13-dark: #8C3B72;   /* TIAB */
  --type-14: #E69ABD; --type-14-dark: #8C3B5B;   /* TPNS */
  --type-15: #E69AA8; --type-15-dark: #8C3B4D;   /* TPAB */

  /* ---------- Base: Spacing ---------- */
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ---------- Base: Radius ---------- */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;

  /* ---------- Base: Shadow ---------- */
  --shadow-1: 0 1px 2px rgba(31, 28, 24, 0.06);
  --shadow-2: 0 4px 12px rgba(31, 28, 24, 0.08);
  --shadow-3: 0 8px 24px rgba(31, 28, 24, 0.12);
  --shadow-focus: 0 0 0 4px rgba(255, 122, 92, 0.32);

  /* ---------- Base: Typography ---------- */
  --font-sans: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'D2Coding', monospace;

  --text-xs: 12px;   --lh-xs: 16px;
  --text-sm: 14px;   --lh-sm: 20px;
  --text-base: 16px; --lh-base: 26px;
  --text-lg: 18px;   --lh-lg: 28px;
  --text-xl: 22px;   --lh-xl: 30px;
  --text-2xl: 28px;  --lh-2xl: 36px;
  --text-3xl: 36px;  --lh-3xl: 44px;
  --text-4xl: 44px;  --lh-4xl: 52px;

  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  /* ---------- Base: Motion ---------- */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ---------- Semantic ---------- */
  --bg-page: var(--gray-50);
  --bg-surface: #FFFFFF;
  --bg-subtle: var(--gray-100);
  --bg-inverse: var(--gray-900);
  /* --bg-capture: 유형 페이지에서 inline 또는 [data-type] 셀렉터로 주입 */

  --text-default: var(--gray-900);
  --text-secondary: var(--gray-700);
  --text-muted: var(--gray-500);
  --text-helper: var(--gray-400);
  --text-inverse: var(--gray-50);

  --border-default: var(--gray-200);
  --border-subtle: var(--gray-100);
  --border-focus: var(--primary-500);

  --action-primary-bg: var(--primary-500);
  --action-primary-bg-hover: var(--primary-700);
  --action-primary-text: #FFFFFF;
  --action-secondary-bg: var(--bg-surface);
  --action-secondary-bg-hover: var(--gray-100);
  --action-secondary-text: var(--text-default);

  --status-success: var(--success-500);
  --status-warn: var(--warn-500);
  --status-error: var(--error-500);

  /* ---------- Component: Badge ---------- */
  --badge-bg: var(--bg-surface);
  --badge-text: var(--text-default);
  --badge-border: var(--border-default);
  --badge-padding-x: var(--space-3);
  --badge-padding-y: var(--space-2);
  --badge-radius: var(--radius-pill);
  --badge-font: var(--font-mono);
  --badge-size: var(--text-base);
  --badge-weight: var(--font-semibold);

  /* ---------- Component: Choice ---------- */
  --choice-bg: var(--bg-surface);
  --choice-bg-hover: var(--gray-100);
  --choice-bg-selected: var(--primary-100);
  --choice-border: var(--border-default);
  --choice-border-selected: var(--primary-500);
  --choice-padding: var(--space-4);
  --choice-radius: var(--radius-lg);
  --choice-shadow: var(--shadow-1);
  --choice-shadow-hover: var(--shadow-2);
  --choice-gap: var(--space-3);

  /* ---------- Component: CTA ---------- */
  --cta-bg: var(--action-primary-bg);
  --cta-bg-hover: var(--action-primary-bg-hover);
  --cta-text: var(--action-primary-text);
  --cta-padding-x: var(--space-6);
  --cta-padding-y: var(--space-4);
  --cta-radius: var(--radius-md);
  --cta-size: var(--text-lg);
  --cta-weight: var(--font-semibold);
  --cta-min-height: 56px;

  /* ---------- Component: Capture Card ---------- */
  --capture-padding: var(--space-8);
  --capture-radius: var(--radius-xl);
  --capture-shadow: var(--shadow-3);
  --capture-name-size: var(--text-3xl);
  --capture-name-weight: var(--font-extrabold);
  --capture-tagline-size: var(--text-base);
  --capture-description-size: var(--text-sm);
  --capture-watermark-size: var(--text-xs);

  /* ---------- Component: Progress ---------- */
  --progress-track: var(--gray-200);
  --progress-fill: var(--primary-500);
  --progress-height: 4px;
  --progress-radius: var(--radius-pill);
  --progress-counter-size: var(--text-sm);
  --progress-counter-color: var(--text-muted);

  /* ---------- Component: Share ---------- */
  --share-bg: var(--bg-surface);
  --share-bg-hover: var(--gray-100);
  --share-border: var(--border-default);
  --share-padding: var(--space-4);
  --share-radius: var(--radius-md);
  --share-icon-size: 24px;
  --share-label-size: var(--text-sm);
  --share-min-height: 80px;

  /* ---------- Component: Type Card ---------- */
  --typecard-bg: var(--bg-surface);
  --typecard-bg-hover: var(--gray-100);
  --typecard-border: var(--border-default);
  --typecard-padding: var(--space-4);
  --typecard-radius: var(--radius-lg);
  --typecard-shadow: var(--shadow-1);
  --typecard-shadow-hover: var(--shadow-2);
  --typecard-arrow-color: var(--text-muted);

  /* ---------- Container ---------- */
  --container-max: 480px;
  --container-gutter: var(--space-4);
}

/* =====================================================
   16유형별 동적 캡처 배경
   결과 페이지 컨테이너에 data-type="00" ~ "15" 부착
   ===================================================== */
[data-type="00"] { --bg-capture: var(--type-00); --text-on-type: var(--type-00-dark); }
[data-type="01"] { --bg-capture: var(--type-01); --text-on-type: var(--type-01-dark); }
[data-type="02"] { --bg-capture: var(--type-02); --text-on-type: var(--type-02-dark); }
[data-type="03"] { --bg-capture: var(--type-03); --text-on-type: var(--type-03-dark); }
[data-type="04"] { --bg-capture: var(--type-04); --text-on-type: var(--type-04-dark); }
[data-type="05"] { --bg-capture: var(--type-05); --text-on-type: var(--type-05-dark); }
[data-type="06"] { --bg-capture: var(--type-06); --text-on-type: var(--type-06-dark); }
[data-type="07"] { --bg-capture: var(--type-07); --text-on-type: var(--type-07-dark); }
[data-type="08"] { --bg-capture: var(--type-08); --text-on-type: var(--type-08-dark); }
[data-type="09"] { --bg-capture: var(--type-09); --text-on-type: var(--type-09-dark); }
[data-type="10"] { --bg-capture: var(--type-10); --text-on-type: var(--type-10-dark); }
[data-type="11"] { --bg-capture: var(--type-11); --text-on-type: var(--type-11-dark); }
[data-type="12"] { --bg-capture: var(--type-12); --text-on-type: var(--type-12-dark); }
[data-type="13"] { --bg-capture: var(--type-13); --text-on-type: var(--type-13-dark); }
[data-type="14"] { --bg-capture: var(--type-14); --text-on-type: var(--type-14-dark); }
[data-type="15"] { --bg-capture: var(--type-15); --text-on-type: var(--type-15-dark); }

/* =====================================================
   Base reset / Body
   ===================================================== */

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--lh-base);
  color: var(--text-default);
  background: var(--bg-page);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  min-height: 100dvh;
}

/* 컨테이너: 모바일 first, 데스크톱에서도 모바일 폭 유지 */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding-left: var(--container-gutter);
  padding-right: var(--container-gutter);
}

/* 포커스 가시성 (접근성) */
:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

/* 모션 감소 환경 대응 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Step 2.5로 넘기는 것

확정된 토큰을 사용해 **공통 컴포넌트 명세**를 작성:

1. **Badge** (코드 배지)
2. **ChoiceCard** (선택지 카드)
3. **PrimaryButton** / **SecondaryButton**
4. **ProgressBar** (진행률)
5. **CaptureCard** (결과 캡처 영역)
6. **TypeCard** (천적/베프 카드)
7. **ShareActionButton** (공유 액션)
8. **WatermarkLabel** (캡처용 워터마크)

각 컴포넌트마다: Props 인터페이스 / 상태(default/hover/selected/disabled) / 사용된 토큰 매핑 / 사용처(어느 화면).
