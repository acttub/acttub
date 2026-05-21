# Animation Spec — 연기 스타일 MBTI

> Stage 2.7 산출물 — 애니메이션 / 마이크로인터랙션 명세
> 작성일: 2026-05-14
> 의존성: design-tokens.md (motion 토큰), component-spec-web.md, design-spec-web.md

## 모션 디자인 원칙

1. **빠르고 가볍게** — 250ms 이하 표준, 400ms 이상은 페이지 전환에만
2. **목적 있는 모션만** — 장식적 모션 금지, 모든 모션은 인지·피드백 목적
3. **셀럽레이션은 결과 페이지 1회뿐** — 단조롭지 않게, 그러나 과하지 않게
4. **모바일 first** — touch 피드백 우선, hover는 보조
5. **prefers-reduced-motion 대응 필수** — 모든 모션은 대체 정의

## 모션 토큰 (재인용)

```css
--duration-fast: 150ms;     /* hover, focus, tap 피드백 */
--duration-base: 250ms;     /* 카드 선택, fade */
--duration-slow: 400ms;     /* 페이지 전환, 셀럽레이션 */

--ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);         /* 표준 감속 */
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1); /* 셀럽레이션 */
```

---

## 1. 페이지 전환 (Page Transitions)

### 1.1 S1 → S2 (시작하기 클릭)

| 단계 | 애니메이션 | 듀레이션 | 이징 |
|---|---|---|---|
| 1. CTA tap | translate Y +1px | 100ms | linear |
| 2. S1 페이지 fade-out | opacity 1→0, translate Y 0→-8px | 250ms | ease-out |
| 3. 라우팅 |  | — | — |
| 4. S2 페이지 enter | opacity 0→1, translate Y 8px→0 | 250ms | ease-out |

```css
/* React Router 또는 Framer Motion 활용 */
.page-transition-enter { opacity: 0; transform: translateY(8px); }
.page-transition-enter-active {
  opacity: 1; transform: translateY(0);
  transition: opacity var(--duration-base) var(--ease-out),
              transform var(--duration-base) var(--ease-out);
}
.page-transition-exit-active {
  opacity: 0; transform: translateY(-8px);
  transition: opacity var(--duration-base) var(--ease-out),
              transform var(--duration-base) var(--ease-out);
}
```

### 1.2 S2 → S2 (문항 간 자동 진행)

| 단계 | 애니메이션 | 듀레이션 | 이징 |
|---|---|---|---|
| 1. Choice 선택 강조 | 카드 selected 상태 (배경/테두리 변화) | 200ms | ease-out |
| 2. 문항 영역 fade-out | opacity 1→0, translate X 0→-16px | 200ms | ease-out |
| 3. 다음 문항 enter | opacity 0→1, translate X 16px→0 | 250ms | ease-out |
| 4. ProgressBar fill 확장 | width 변화 | 250ms | ease-out |

**좌우 슬라이드 방향**: 다음으로 → 왼쪽으로 빠짐 / 오른쪽에서 들어옴. 뒤로 가기 → 반대 방향.

### 1.3 S2 → S3 (마지막 문항 선택 후)

| 단계 | 애니메이션 | 듀레이션 | 이징 |
|---|---|---|---|
| 1. Choice 선택 강조 | 카드 selected | 200ms | ease-out |
| 2. ProgressBar 100% fill | width 100% | 300ms | ease-out |
| 3. 전체 fade-out | opacity 1→0 | 300ms | ease-out |
| 4. (라우팅) |  | — | — |
| 5. S3 진입 셀럽레이션 | § 3.1 참고 | 500ms | ease-out-back |

### 1.4 S3 → S3 (천적/베프 카드 클릭, 사슬 연장)

| 단계 | 애니메이션 | 듀레이션 | 이징 |
|---|---|---|---|
| 1. 카드 tap | scale 0.99 | 100ms | linear |
| 2. 페이지 cross-fade | opacity 1→0 → 0→1 | 250ms + 250ms | ease-out |
| 3. CaptureCard 등장 | (셀럽레이션 생략 — 사슬 연장 시는 즉시) | 250ms | ease-out |

→ 첫 결과 페이지 진입(1.3)은 셀럽레이션. 사슬 연장(1.4)은 cross-fade만. (반복 시 피로 방지)

### 1.5 reduce-motion 대응

```css
@media (prefers-reduced-motion: reduce) {
  .page-transition-enter, .page-transition-exit-active {
    transition: opacity 0.01ms !important;
    transform: none !important;
  }
}
```
→ translate 제거, opacity transition만 ~0ms (즉시 노출). 정보 손실 없이 모션만 비활성.

---

## 2. 마이크로인터랙션 (컴포넌트)

### 2.1 ChoiceCard (선택지 카드)

| 트리거 | 애니메이션 | 듀레이션 | 이징 |
|---|---|---|---|
| hover (데스크톱) | `translateY(-2px)` + `shadow-1 → shadow-2` | 150ms | ease-out |
| tap pressed | `translateY(1px) scale(0.98)` | 100ms | linear |
| tap release | 원상 복귀 | 150ms | ease-out |
| selected 전이 | 배경 `bg-surface → primary-100`, 테두리 `default → primary-500` | 200ms | ease-out |
| 체크 아이콘 등장 | opacity 0→1, scale 0.6→1 | 200ms | ease-out-back |

```css
.choice {
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out),
              background var(--duration-base) var(--ease-out),
              border-color var(--duration-base) var(--ease-out);
}
.choice__check {
  animation: pop var(--duration-base) var(--ease-out-back);
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
}
```

### 2.2 PrimaryButton (CTA)

| 트리거 | 애니메이션 | 듀레이션 |
|---|---|---|
| hover | `bg: primary-500 → primary-700` | 150ms ease-out |
| tap pressed | `translateY(1px)` | 100ms linear |
| focus | `box-shadow: var(--shadow-focus)` | 즉시 |
| disabled | opacity 0.5 | 150ms |

### 2.3 SecondaryButton

PrimaryButton과 동일 패턴이되 hover 시 `bg-surface → gray-100`.

### 2.4 ProgressBar

| 트리거 | 애니메이션 | 듀레이션 |
|---|---|---|
| `current` 변화 | `width` 변화 | 250ms ease-out |
| 100% 도달 | (추가 효과 없음, 결과 페이지 라우팅이 셀럽레이션) | — |

```css
.progress-bar__fill {
  transition: width var(--duration-base) var(--ease-out);
}
```

### 2.5 TypeCard (천적/베프)

| 트리거 | 애니메이션 | 듀레이션 |
|---|---|---|
| hover (데스크톱) | `translateY(-1px)` + shadow-2 | 150ms |
| tap pressed | `scale(0.99)` | 100ms linear |
| 화살표 hover | `translateX(2px)` | 150ms |

```css
.type-card__arrow {
  transition: transform var(--duration-fast) var(--ease-out);
}
@media (hover: hover) {
  .type-card:hover .type-card__arrow {
    transform: translateX(2px);
  }
}
```

### 2.6 ShareActionButton

| 트리거 | 애니메이션 | 듀레이션 |
|---|---|---|
| hover | `bg-surface → gray-100` | 150ms |
| tap | scale 0.97 | 100ms linear |
| loading | 아이콘 위치에 스피너 회전 | 1s linear infinite |
| success | 아이콘 → 체크 마크, 라벨 → "복사됨!" (0.5s 후 원복) | 200ms ease-out |

```css
.spinner {
  width: 24px; height: 24px;
  border: 2px solid var(--gray-200);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 3. 셀럽레이션 (Celebration)

### 3.1 결과 페이지 첫 진입 (S2 → S3 only, 사슬 시 제외)

CaptureCard 등장 시퀀스:

| 시간 | 단계 | 변화 |
|---|---|---|
| 0ms | 페이지 도달 | CaptureCard opacity 0, scale 0.96 |
| 0~500ms | CaptureCard enter | opacity 0→1 + scale 0.96→1 (ease-out-back) |
| 200ms~ | 위트 네이밍 글자 위치 | translate Y 12px → 0 (ease-out) |
| 400ms~ | 캐치프레이즈 | opacity 0→1 (delay 후 fade) |
| 600ms~ | 캐릭터 묘사 4줄 | 각 줄 stagger 80ms (fade + translate Y 8px → 0) |
| 1000ms~ | 스크롤 영역 | 약하게 fade-in (작은 모션) |

```css
.capture-celebrate {
  opacity: 0;
  transform: scale(0.96);
  animation: capture-enter var(--duration-slow) var(--ease-out-back) forwards;
}
@keyframes capture-enter {
  to { opacity: 1; transform: scale(1); }
}

.capture__name {
  opacity: 0;
  transform: translateY(12px);
  animation: text-rise var(--duration-base) var(--ease-out) 200ms forwards;
}
.capture__tagline {
  opacity: 0;
  animation: fade-in var(--duration-base) var(--ease-out) 400ms forwards;
}
.capture__traits li {
  opacity: 0;
  transform: translateY(8px);
  animation: text-rise var(--duration-base) var(--ease-out) forwards;
}
.capture__traits li:nth-child(1) { animation-delay: 600ms; }
.capture__traits li:nth-child(2) { animation-delay: 680ms; }
.capture__traits li:nth-child(3) { animation-delay: 760ms; }
.capture__traits li:nth-child(4) { animation-delay: 840ms; }

@keyframes text-rise {
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in {
  to { opacity: 1; }
}
```

**셀럽레이션 트리거 조건**:
- 직전 페이지가 `/quiz` (referrer 또는 라우터 상태)
- localStorage에 본인 결과가 처음 저장됨
- 그 외 (사슬, 새로고침, 직접 URL): 셀럽레이션 생략, opacity 1로 즉시 표시

### 3.2 화면 단위 마이크로 셀럽레이션 (선택)

너무 화려하지 않게:
- Confetti·파티클 효과 → **사용 안 함** (이모지 금지·캡처 깔끔함 우선)
- 그라데이션 회전 → **사용 안 함** (html2canvas 호환)
- 살짝 들썩이는 코드 배지 → **선택**: 0~500ms 사이 코드 배지가 살짝 떠올랐다 안착 (translate Y 4px → 0 + bounce)

---

## 4. 로딩 / 진행 상태

### 4.1 페이지 로드 (Splash)

| 시점 | 동작 |
|---|---|
| HTML 파싱 중 | 빈 화면 또는 페이지 배경색 |
| First Paint | 페이지 배경 + 컨테이너 가시 (skeleton 없음) |
| 콘텐츠 도달 | fade-in (옅게) |

> 모바일 회선에서도 splash skeleton 불필요한 수준의 가벼움 (정적 SPA + Pretendard preload).

### 4.2 이미지 캡처 진행

```
[이미지 저장] 탭
   ↓
ShareActionButton 아이콘 → 스피너로 교체
   ↓
html2canvas 실행 (200~800ms)
   ↓
다운로드 트리거
   ↓
스피너 → ✓ 체크 마크 (0.5s)
   ↓
원래 아이콘 복귀
```

### 4.3 카카오 SDK 초기화 대기

페이지 로드 후 카카오 SDK는 비동기 초기화. 초기화 완료 전 카톡 공유 버튼은 disabled (opacity 0.5).

---

## 5. 피드백 모션 매트릭스

| 액션 | 시각 피드백 | 청각/햅틱 |
|---|---|---|
| 선택지 탭 | 카드 selected 강조 + 자동 다음 | 없음 |
| 이전 버튼 | 즉시 이전 문항 | 없음 |
| CTA 탭 | translate Y 1px | 없음 |
| 이미지 저장 성공 | 체크 마크 0.5s | 없음 |
| 링크 복사 성공 | 토스트 "복사됨!" 1.5s | 없음 |
| 카톡 공유 | SDK 호출 (외부) | (시스템 진동 가능, 우리는 제어 안 함) |
| 잘못된 코드 (404) | S4 페이지 fade-in | 없음 |
| 다시 풀기 | 즉시 S2로 (transition은 1.1 동일) | 없음 |

→ **사운드·햅틱 0** (모바일 웹의 제약 + 단톡방 멀티태스킹 환경 고려)

---

## 6. Toast / 피드백 컴포넌트 (스펙)

링크 복사 성공 시 노출:

```jsx
<div className="toast" role="status" aria-live="polite">
  <Check size={16} />
  <span>링크가 복사됐어요</span>
</div>
```

```css
.toast {
  position: fixed;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-inverse);
  color: var(--text-inverse);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-pill);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  box-shadow: var(--shadow-3);
  animation: toast-enter var(--duration-base) var(--ease-out-back) forwards,
             toast-exit var(--duration-base) var(--ease-out) 1.5s forwards;
}
@keyframes toast-enter {
  from { opacity: 0; transform: translate(-50%, 12px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}
@keyframes toast-exit {
  to { opacity: 0; transform: translate(-50%, 12px); }
}
```

→ 토스트는 1.5s 후 자동 사라짐 (총 표시 시간 ~2s).

---

## 7. reduce-motion 대응 매트릭스

| 모션 영역 | 일반 | `prefers-reduced-motion: reduce` |
|---|---|---|
| 페이지 전환 fade | opacity + translate | opacity만 (translate 제거) |
| ChoiceCard hover/tap | translate + shadow | 색상 변화만 |
| ProgressBar fill | width transition | 즉시 변경 (transition 0.01ms) |
| 셀럽레이션 | scale + stagger | opacity 1로 즉시 표시 (모션 없음) |
| 스피너 | rotate infinite | 정적 아이콘 또는 "로딩 중" 텍스트 |
| Toast | translate + fade | fade만 (translate 제거) |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .spinner { animation: none; }
  .capture-celebrate, .capture__name, .capture__tagline, .capture__traits li {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## 8. 구현 권장 스택

| 영역 | 권장 |
|---|---|
| 페이지 전환 | Framer Motion `AnimatePresence` 또는 CSS Transition Group |
| 마이크로인터랙션 | 순수 CSS (transition/keyframes) 우선 |
| 셀럽레이션 stagger | Framer Motion `staggerChildren` 또는 CSS animation-delay |
| 토스트 | sonner / react-hot-toast 또는 자체 컴포넌트 |
| reduce-motion | CSS `@media (prefers-reduced-motion)` |

> Framer Motion 도입 시 번들 +30KB. CSS만으로 80% 커버 가능하므로 **CSS 우선** 권장. 셀럽레이션 stagger만 Motion 또는 다단 CSS animation-delay로.

---

## 9. 듀레이션 가이드 요약

```
0~100ms:    tap 피드백 (즉각적)
150ms:      hover, focus 전환
200~250ms:  카드 선택, 페이지 fade
300~400ms:  페이지 라우팅, 큰 상태 변화
500ms~:     셀럽레이션 (전체 시퀀스 ~1s 안에 끝남)
```

> 500ms 초과 모션은 **결과 페이지 첫 진입의 셀럽레이션 1회만**. 그 외 영역에서 500ms 초과 시 재검토.

---

## 10. 핸드오프 체크리스트

- [ ] 모든 모션이 250ms 이하 (셀럽레이션 제외)
- [ ] 모든 모션에 `--ease-out` 또는 `--ease-out-back` 사용
- [ ] tap·hover·focus 3종 모두 컴포넌트마다 정의됨
- [ ] reduce-motion 대응 CSS 글로벌 정의 (globals.css 끝)
- [ ] 셀럽레이션은 첫 진입 1회만 (사슬·새로고침·직접 URL은 정적)
- [ ] 스피너·토스트 등 부수 컴포넌트 모션 정의됨
- [ ] 사운드/햅틱 0 (모바일 멀티태스킹 환경 존중)

---

## 🎯 Step 2.8로 넘기는 것

지금까지의 모든 산출물(plat/screen/refs/wireframes/tokens/components/spec/anim)을 종합해서 **Pencil MCP `.pen` 프로토타입 파일**로 시각화:

- 5개 화면(S1·S2·S3·S3'·S4) 각각의 시각 프로토타입
- 토큰 색상 그대로 적용
- 컴포넌트 인스턴스 배치
- 페이지 간 인터랙션 연결 (S1 → S2 → S3)
- 사용자에게 클릭으로 흐름 시연 가능한 결과물

> 단, 이 환경에 Pencil MCP가 활성화되어 있지 않다면 `.pen` 파일 생성 불가 — Step 2.8 시작 시 도구 가용성 먼저 확인.
