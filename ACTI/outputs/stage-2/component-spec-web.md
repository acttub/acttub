# Component Spec (Web) — 연기 스타일 MBTI

> Stage 2.5 산출물 — 공통 UI 컴포넌트 명세 (Web, Mobile First)
> 작성일: 2026-05-14
> 의존성: design-tokens.md (Step 2.4), wireframes-web.md (Step 2.3)

## 컴포넌트 명세 원칙

1. **토큰만 참조** — HEX·px 직접 하드코딩 금지. CSS Variable 또는 Tailwind 토큰 참조.
2. **Props 최소** — variant·size·state로 통합. 케이스별 새 컴포넌트 생성 금지.
3. **상태 4종 기본** — `default` / `hover` / `active(selected)` / `disabled`
4. **접근성 필수** — `aria-*`, `role`, 키보드 조작
5. **모바일 first** — hover 효과는 보조, primary 인터랙션은 tap·focus

## 명세 포맷

각 컴포넌트마다 다음 표 + 코드 스니펫:
- 목적
- Props
- 상태 / 변종
- 사용 토큰
- 사용처 화면
- 접근성 체크리스트
- 마크업 스케치 (HTML/JSX 의사 코드)

---

## C1 — `Badge` (유형 코드 배지 `[MINB]`)

### 목적
4글자 유형 코드를 모노스페이스로 강조 표시. 캡처 영역의 정체성 라벨.

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `code` | `string` | 필수 | 4글자 코드 (예: "MINB") |
| `variant` | `'default' \| 'muted' \| 'unknown'` | `'default'` | 기본 / 약한 / 404용 (`[???]`) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | sm=랜딩 미리보기, md=일반, lg=캡처 영역 메인 |

### 상태 / 변종
| 변종 | 배경 | 텍스트 | 비고 |
|---|---|---|---|
| `default` | `--badge-bg` (#FFF) | `--text-default` | 일반 |
| `muted` | `--bg-subtle` | `--text-muted` | 비활성/약한 강조 |
| `unknown` | `--bg-subtle` | `--text-helper` | 404 페이지 `[???]` |

### 사용 토큰
`--badge-bg`, `--badge-text`, `--badge-border`, `--badge-padding-x/y`, `--badge-radius`, `--badge-font`, `--badge-size`, `--badge-weight`

### 사용처
- S1 (랜딩 미리보기 카드 안) — `size=sm`
- S3, S3' (캡처 영역) — `size=lg`
- S3 (천적/베프 카드 안) — `size=md`
- S4 (404) — `variant=unknown`, `size=lg`

### 접근성
- [ ] `aria-label`로 코드 풀어쓰기 (예: "유형 코드 MINB")
- [ ] 색상에 의존하지 않음 (텍스트 자체로 정보 전달)

### 마크업 스케치
```html
<span class="badge badge--{variant} badge--{size}"
      aria-label="유형 코드 {code}">
  [{code}]
</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  background: var(--badge-bg);
  color: var(--badge-text);
  border: 1px solid var(--badge-border);
  padding: var(--badge-padding-y) var(--badge-padding-x);
  border-radius: var(--badge-radius);
  font-family: var(--badge-font);
  font-weight: var(--badge-weight);
}
.badge--sm { font-size: var(--text-sm); }
.badge--md { font-size: var(--badge-size); }
.badge--lg { font-size: var(--text-xl); padding: var(--space-3) var(--space-4); }
```

---

## C2 — `ChoiceCard` (선택지 카드, S2)

### 목적
시나리오 4지선다의 각 선택지. 아이콘 + 카피 1줄, 탭 시 자동 다음 진행.

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `LucideIcon` | 필수 | 4축 극을 표현하는 아이콘 (예: Zap, Ruler, Eye, Microscope) |
| `label` | `string` | 필수 | 선택지 카피 (1~2줄) |
| `selected` | `boolean` | `false` | 이전에 선택한 답 (뒤로가기로 복귀 시) |
| `onClick` | `() => void` | 필수 | 선택 핸들러 |
| `disabled` | `boolean` | `false` | 비활성 (제출 중 등) |

### 상태
| 상태 | 변화 |
|---|---|
| `default` | 흰 배경, 옅은 그림자 |
| `hover` (데스크톱) | translate Y -2px + 그림자 강화 |
| `selected` | primary-100 배경 + primary-500 테두리 + 체크 마크 |
| `pressed` (모바일 tap) | translate Y +1px + scale 0.98 (150ms) |
| `disabled` | opacity 0.5, pointer-events none |

### 사용 토큰
`--choice-bg`, `--choice-bg-hover`, `--choice-bg-selected`, `--choice-border`, `--choice-border-selected`, `--choice-padding`, `--choice-radius`, `--choice-shadow`, `--choice-shadow-hover`, `--choice-gap`

### 사용처
- S2 (문항 페이지) — 4개씩 세로 배치

### 접근성
- [ ] `role="button"` + 키보드 Enter/Space 지원
- [ ] `aria-pressed={selected}`
- [ ] 포커스 가능 (tabindex 0)
- [ ] 터치 타겟 ≥ 44px (실제 ~80px)

### 마크업 스케치
```jsx
<button
  role="button"
  aria-pressed={selected}
  disabled={disabled}
  onClick={onClick}
  className={`choice ${selected ? 'choice--selected' : ''}`}
>
  <Icon size={24} className="choice__icon" aria-hidden="true" />
  <span className="choice__label">{label}</span>
  {selected && <Check size={20} className="choice__check" />}
</button>
```

```css
.choice {
  display: flex;
  align-items: center;
  gap: var(--choice-gap);
  width: 100%;
  background: var(--choice-bg);
  color: var(--text-default);
  border: 2px solid var(--choice-border);
  padding: var(--choice-padding);
  border-radius: var(--choice-radius);
  box-shadow: var(--choice-shadow);
  text-align: left;
  cursor: pointer;
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out),
    background var(--duration-fast) var(--ease-out);
  min-height: 64px;
}

@media (hover: hover) {
  .choice:hover {
    transform: translateY(-2px);
    box-shadow: var(--choice-shadow-hover);
    background: var(--choice-bg-hover);
  }
}

.choice:active {
  transform: translateY(1px) scale(0.98);
}

.choice--selected {
  background: var(--choice-bg-selected);
  border-color: var(--choice-border-selected);
}

.choice__icon { flex-shrink: 0; color: var(--text-secondary); }
.choice__label { flex: 1; font-size: var(--text-base); line-height: var(--lh-base); }
.choice__check { color: var(--primary-500); }
```

---

## C3 — `PrimaryButton` (CTA)

### 목적
가장 강한 시각 액션. 랜딩 시작·404 처음으로·수신자 모드 "나도 풀어보기".

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | 필수 | 버튼 카피 (선택적 화살표 아이콘 포함 가능) |
| `as` | `'button' \| 'a'` | `'button'` | 라우팅 시 anchor로 |
| `href` | `string?` | — | `as='a'` 시 |
| `onClick` | `() => void?` | — | |
| `fullWidth` | `boolean` | `true` | 풀폭 여부 |
| `size` | `'md' \| 'lg'` | `'lg'` | md=결과지 secondary, lg=랜딩 CTA |
| `disabled` | `boolean` | `false` | |

### 상태
| 상태 | 변화 |
|---|---|
| `default` | primary 컬러 배경, 흰 텍스트 |
| `hover` | primary-700 (어두운) |
| `active` | translate Y +1px |
| `focus-visible` | 포커스 링 (--shadow-focus) |
| `disabled` | opacity 0.5 |

### 사용 토큰
`--cta-bg`, `--cta-bg-hover`, `--cta-text`, `--cta-padding-x/y`, `--cta-radius`, `--cta-size`, `--cta-weight`, `--cta-min-height`, `--shadow-focus`

### 사용처
- S1 (시작하기) — `size=lg`, `fullWidth`
- S3' (나도 풀어보기) — `size=lg`, `fullWidth`
- S4 (처음으로) — `size=lg`, `fullWidth`

### 접근성
- [ ] 포커스 가시성 `--shadow-focus`
- [ ] anchor 변형은 `<a>` 직접 사용 (스크린리더 안내)
- [ ] disabled 시 `aria-disabled="true"`

### 마크업 스케치
```jsx
<button
  className={`cta cta--${size} ${fullWidth ? 'cta--full' : ''}`}
  disabled={disabled}
  onClick={onClick}
>
  {children}
  <ArrowRight size={20} aria-hidden="true" />
</button>
```

```css
.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: var(--cta-bg);
  color: var(--cta-text);
  font-size: var(--cta-size);
  font-weight: var(--cta-weight);
  padding: var(--cta-padding-y) var(--cta-padding-x);
  border-radius: var(--cta-radius);
  border: none;
  cursor: pointer;
  min-height: var(--cta-min-height);
  transition: background var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}

.cta--full { width: 100%; }
.cta--md { min-height: 48px; font-size: var(--text-base); }

@media (hover: hover) {
  .cta:hover { background: var(--cta-bg-hover); }
}
.cta:active { transform: translateY(1px); }
.cta:disabled { opacity: 0.5; cursor: not-allowed; }
```

---

## C4 — `SecondaryButton`

### 목적
약한 시각 액션. "다시 풀기", S4의 "바로 풀어보기".

### Props
`PrimaryButton`과 동일.

### 사용 토큰
`--action-secondary-bg`, `--action-secondary-bg-hover`, `--action-secondary-text`, `--border-default`

### 사용처
- S3, S3' (다시 풀기) — `size=md`
- S4 (바로 풀어보기) — `size=md`

### 마크업 차이
```css
.secondary {
  background: var(--action-secondary-bg);
  color: var(--action-secondary-text);
  border: 1px solid var(--border-default);
  /* 나머지 .cta와 동일한 padding/radius/min-height */
}
@media (hover: hover) {
  .secondary:hover { background: var(--action-secondary-bg-hover); }
}
```

---

## C5 — `ProgressBar` (진행률, S2 상단)

### 목적
문항 풀이 진행률 가시화. sticky 상단 고정.

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `current` | `number` | 필수 | 현재 문항 번호 (1부터) |
| `total` | `number` | 필수 | 전체 문항 수 |
| `onBack` | `() => void?` | — | 이전 버튼 핸들러 (null이면 비표시) |

### 상태
| 상태 | 변화 |
|---|---|
| `progress` 변화 | 진행바가 250ms ease-out으로 부드럽게 확장 |
| 1번 문항 | 이전 버튼 비활성/비표시 |

### 사용 토큰
`--progress-track`, `--progress-fill`, `--progress-height`, `--progress-radius`, `--progress-counter-size`, `--progress-counter-color`

### 사용처
- S2 (문항 페이지 상단 sticky)

### 접근성
- [ ] `role="progressbar"` + `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- [ ] 카운터 텍스트도 함께 표시 (시각적 + 스크린리더 보완)
- [ ] 이전 버튼 `aria-label="이전 문항"`

### 마크업 스케치
```jsx
<div className="progress-bar">
  <button
    className="progress-bar__back"
    onClick={onBack}
    disabled={!onBack}
    aria-label="이전 문항"
  >
    <ChevronLeft size={20} />
  </button>
  <div
    className="progress-bar__track"
    role="progressbar"
    aria-valuenow={current}
    aria-valuemin={1}
    aria-valuemax={total}
  >
    <div
      className="progress-bar__fill"
      style={{ width: `${(current / total) * 100}%` }}
    />
  </div>
  <span className="progress-bar__counter">{current} / {total}</span>
</div>
```

```css
.progress-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--container-gutter);
  background: var(--bg-page);
  backdrop-filter: blur(8px);
}

.progress-bar__back {
  background: transparent;
  border: none;
  padding: var(--space-2);
  color: var(--text-secondary);
  cursor: pointer;
}
.progress-bar__back:disabled { opacity: 0.3; cursor: default; }

.progress-bar__track {
  flex: 1;
  height: var(--progress-height);
  background: var(--progress-track);
  border-radius: var(--progress-radius);
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: var(--progress-fill);
  border-radius: var(--progress-radius);
  transition: width var(--duration-base) var(--ease-out);
}

.progress-bar__counter {
  font-size: var(--progress-counter-size);
  color: var(--progress-counter-color);
  font-variant-numeric: tabular-nums;
}
```

---

## C6 — `CaptureCard` (결과지 캡처 영역)

### 목적
결과 페이지 캡처 영역의 컨테이너. html2canvas 친화. 유형별 동적 컬러.

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `typeIndex` | `0~15` | 필수 | 16유형 인덱스 (data-type 속성으로 적용) |
| `code` | `string` | 필수 | 4글자 코드 |
| `name` | `string` | 필수 | 위트 네이밍 |
| `tagline` | `string` | 필수 | 한 줄 캐치프레이즈 |
| `traits` | `string[]` | 필수 | 캐릭터 묘사 (3~4개 불릿) |
| `domRef` | `Ref<HTMLDivElement>?` | — | html2canvas가 캡처할 DOM 참조 |

### 상태
- 정적 (인터랙션 없음)
- 16개 `[data-type]` 속성으로 배경/액센트 컬러 동적 적용

### 사용 토큰
`--bg-capture`, `--text-on-type`, `--capture-padding`, `--capture-radius`, `--capture-shadow`, `--capture-name-size`, `--capture-name-weight`, `--capture-tagline-size`, `--capture-description-size`, `--capture-watermark-size`

### 사용처
- S3 (결과 페이지) — 캡처 영역
- S3' (결과 페이지 수신자 모드) — 동일

### 접근성
- [ ] 정보 위계: 코드 → 네이밍 → 캐치프레이즈 → 묘사 순서로 DOM 배치
- [ ] `<h1>` = 위트 네이밍 (페이지 최상위 제목)

### 마크업 스케치
```jsx
<section
  className="capture"
  data-type={String(typeIndex).padStart(2, '0')}
  ref={domRef}
  aria-label="결과 카드"
>
  <Badge code={code} size="lg" />
  <h1 className="capture__name">{name}</h1>
  <hr className="capture__divider" />
  <p className="capture__tagline">"{tagline}"</p>
  <ul className="capture__traits">
    {traits.map((t, i) => <li key={i}>{t}</li>)}
  </ul>
  <span className="capture__watermark">연기 스타일 MBTI</span>
</section>
```

```css
.capture {
  position: relative;
  background: var(--bg-capture);
  color: var(--text-on-type);
  padding: var(--capture-padding);
  border-radius: var(--capture-radius);
  box-shadow: var(--capture-shadow);
  /* html2canvas 친화: 그라데이션·복잡 효과 없음, 단일 색 */
}

.capture__name {
  margin: var(--space-6) 0 var(--space-4);
  font-size: var(--capture-name-size);
  font-weight: var(--capture-name-weight);
  line-height: 1.2;
  color: var(--text-default); /* 명암비 안전 */
}

.capture__divider {
  border: none;
  border-top: 1px solid var(--text-on-type);
  opacity: 0.25;
  margin: var(--space-5) 0;
}

.capture__tagline {
  font-size: var(--capture-tagline-size);
  font-style: italic;
  margin: 0 0 var(--space-5);
  color: var(--text-default);
}

.capture__traits {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.capture__traits li {
  font-size: var(--capture-description-size);
  line-height: var(--lh-base);
  color: var(--text-default);
}
.capture__traits li::before {
  content: '· ';
  font-weight: bold;
  margin-right: var(--space-1);
}

.capture__watermark {
  position: absolute;
  right: var(--space-4);
  bottom: var(--space-3);
  font-size: var(--capture-watermark-size);
  color: var(--text-default);
  opacity: 0.55;
}
```

---

## C7 — `TypeCard` (천적/베프 카드)

### 목적
스크롤 영역에서 천적/베프 유형으로 점프하는 클릭 가능 카드.

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `relation` | `'rival' \| 'bff'` | 필수 | 천적 / 베프 |
| `code` | `string` | 필수 | 대상 유형 코드 |
| `name` | `string` | 필수 | 위트 네이밍 |
| `typeIndex` | `0~15` | 필수 | 액센트 컬러용 |

### 상태
| 상태 | 변화 |
|---|---|
| `default` | 흰 카드, 옅은 그림자 |
| `hover` (데스크톱) | 그림자 강화 + translate Y -1px |
| `pressed` | scale 0.99 |

### 사용 토큰
`--typecard-bg`, `--typecard-bg-hover`, `--typecard-border`, `--typecard-padding`, `--typecard-radius`, `--typecard-shadow`, `--typecard-shadow-hover`, `--typecard-arrow-color`

### 사용처
- S3, S3' (결과 페이지 스크롤 영역) — 천적 1개 + 베프 1개

### 접근성
- [ ] `<a href={`/result/${code}`}>` (라우팅)
- [ ] `aria-label`: "천적 {code} {name} 결과 보기"
- [ ] 천적/베프 아이콘은 `aria-hidden` (텍스트로 정보 제공)

### 마크업 스케치
```jsx
<a
  href={`/result/${code}`}
  className="type-card"
  aria-label={`${relation === 'rival' ? '천적' : '베프'} ${code} ${name} 결과 보기`}
>
  <div className="type-card__icon" aria-hidden="true">
    {relation === 'rival' ? <Swords size={20} /> : <Heart size={20} />}
  </div>
  <div className="type-card__body">
    <Badge code={code} size="md" />
    <p className="type-card__name">{name}</p>
  </div>
  <ChevronRight size={20} className="type-card__arrow" aria-hidden="true" />
</a>
```

```css
.type-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--typecard-bg);
  border: 1px solid var(--typecard-border);
  padding: var(--typecard-padding);
  border-radius: var(--typecard-radius);
  box-shadow: var(--typecard-shadow);
  color: var(--text-default);
  text-decoration: none;
  transition: box-shadow var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out);
  min-height: 72px;
}

@media (hover: hover) {
  .type-card:hover {
    box-shadow: var(--typecard-shadow-hover);
    background: var(--typecard-bg-hover);
    transform: translateY(-1px);
  }
}
.type-card:active { transform: scale(0.99); }

.type-card__icon { flex-shrink: 0; color: var(--text-secondary); }
.type-card__body { flex: 1; display: flex; flex-direction: column; gap: var(--space-1); }
.type-card__name { margin: 0; font-size: var(--text-sm); color: var(--text-secondary); }
.type-card__arrow { color: var(--typecard-arrow-color); }
```

---

## C8 — `ShareActionButton` (공유 액션)

### 목적
이미지 저장 / 링크 복사 / 카톡 공유 3개 액션. 수평 동일 크기 배치.

### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'image' \| 'link' \| 'kakao'` | 필수 | 액션 종류 |
| `onAction` | `() => Promise<void> \| void` | 필수 | 핸들러 |
| `disabled` | `boolean` | `false` | (이미지 캡처 중 등) |

### 상태
| 상태 | 변화 |
|---|---|
| `default` | 흰 배경 카드 |
| `hover` | 옅은 회색 |
| `loading` | 아이콘 자리에 스피너 + disabled |
| `success` | 0.5초간 체크 마크 표시 ("복사됨!") |

### 사용 토큰
`--share-bg`, `--share-bg-hover`, `--share-border`, `--share-padding`, `--share-radius`, `--share-icon-size`, `--share-label-size`, `--share-min-height`

### 사용처
- S3, S3' (결과 페이지 스크롤 영역) — 3개 그리드

### 접근성
- [ ] `aria-label` = "{type} 공유"
- [ ] 성공 시 `aria-live="polite"`로 "복사됨" 안내

### 마크업 스케치
```jsx
<button
  className="share"
  onClick={onAction}
  disabled={disabled || loading}
  aria-label={`${labelMap[type]} 공유`}
>
  {loading ? <Spinner size={24} /> : <Icon size={24} />}
  <span className="share__label">{labelMap[type]}</span>
</button>
```

```css
.share-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.share {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  background: var(--share-bg);
  border: 1px solid var(--share-border);
  padding: var(--share-padding);
  border-radius: var(--share-radius);
  min-height: var(--share-min-height);
  cursor: pointer;
  color: var(--text-default);
  transition: background var(--duration-fast) var(--ease-out);
}

@media (hover: hover) {
  .share:hover { background: var(--share-bg-hover); }
}
.share:disabled { opacity: 0.5; cursor: not-allowed; }

.share__label {
  font-size: var(--share-label-size);
  color: var(--text-secondary);
}
```

---

## 컴포넌트 사용처 매트릭스

| 컴포넌트 | S1 | S2 | S3 | S3' | S4 |
|---|---|---|---|---|---|
| C1 Badge | ✓ (sm) |   | ✓ (lg) | ✓ (lg) | ✓ (unknown lg) |
| C2 ChoiceCard |   | ✓ (×4) |   |   |   |
| C3 PrimaryButton | ✓ |   |   | ✓ (수신자 CTA) | ✓ |
| C4 SecondaryButton |   |   | ✓ (다시 풀기) | ✓ | ✓ |
| C5 ProgressBar |   | ✓ |   |   |   |
| C6 CaptureCard |   |   | ✓ | ✓ |   |
| C7 TypeCard | ✓ (미리보기 변형) |   | ✓ (×2 천적/베프) | ✓ |   |
| C8 ShareActionButton |   |   | ✓ (×3) | ✓ |   |

→ S1의 코드 카드 미리보기는 C7의 **비클릭 변형(`as="div"`)** 으로 재활용 가능.

---

## 미니 컴포넌트 (별도 명세 생략, CaptureCard 내부)

- **Watermark**: `<span className="capture__watermark">` — CaptureCard 자식 요소
- **Divider**: `<hr>` 토큰 기반 — CaptureCard 내부 + 페이지 섹션 구분에 재사용 가능

---

## 컴포넌트 라이브러리 구현 권장 스택

| 항목 | 권장 |
|---|---|
| UI 빌드 | React / Solid / Svelte (Vite 기반 SPA) |
| 스타일링 | CSS Variables + 평범한 CSS / Tailwind v4 (CSS Vars 친화) |
| 아이콘 | Lucide React (이모지 금지 원칙) |
| 이미지 캡처 | html2canvas / html-to-image / dom-to-image-more |
| 라우팅 | React Router / TanStack Router |
| 카카오 공유 | Kakao JS SDK v2 |

> 프레임워크 선택은 Phase 1 골격 작업 시 확정. 컴포넌트 명세는 프레임워크 무관 (CSS + 의사 JSX).

---

## 🎯 Step 2.6로 넘기는 것

8개 컴포넌트를 조합해서 5개 화면(S1·S2·S3·S3'·S4) 각각의 **최종 디자인 명세서**를 작성:

- 화면 단위 마크업 트리
- 토큰 적용된 정확한 스타일 (px·HEX 명시)
- 인터랙션 / 상태 전이
- 핸드오프용 체크리스트 (개발자가 바로 구현 가능한 수준)
- OG 이미지 / 카카오 카드 디자인 명세
