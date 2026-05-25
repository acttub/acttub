# Design Spec (Web) — 연기 스타일 MBTI

> Stage 2.6 산출물 — 최종 디자인 핸드오프 문서 (Web, Mobile First)
> 작성일: 2026-05-14
> 의존성: design-tokens.md (2.4), component-spec-web.md (2.5), wireframes-web.md (2.3)

## 핸드오프 원칙

1. **이 문서 + 토큰 + 컴포넌트 = 개발 시작 가능** — 별도 Figma 없이도 구현 가능
2. **모든 px·HEX는 토큰 참조** — 하드코딩 시 라인에 ⚠️ 주석
3. **인터랙션은 듀레이션·이징까지 명시** — 애니메이션 디테일은 2.7에서 보강
4. **모바일 first 우선 명세** — 데스크톱은 보조 가이드

## 글로벌 사양

| 항목 | 값 |
|---|---|
| 컨테이너 최대 폭 | 480px (`--container-max`) |
| 좌우 gutter | 16px (`--space-4` = `--container-gutter`) |
| 세이프 영역 | `env(safe-area-inset-*)` 적용 (iOS 노치) |
| 폰트 | Pretendard Variable 우선, 시스템 폰트 폴백 |
| 본문 사이즈 | 16px / 라인 1.625 |
| 페이지 배경 | `var(--bg-page)` (#FAFAF8) |
| 다크 모드 | v1 미지원 (Could) |

---

## S1 — 랜딩 페이지 `/`

### 마크업 트리
```jsx
<main className="page page-landing">
  <div className="container">
    <header className="page-landing__header">
      <p className="page-landing__brand">연기 스타일 MBTI</p>
    </header>

    <section className="page-landing__hero">
      <h1 className="page-landing__title">
        연영과 / 배우 너만의<br />
        연기 인간 진단
      </h1>

      <div className="page-landing__preview">
        <TypeCard
          variant="preview"
          code="MINB"
          name="비 오는 날 뛰쳐나가는 햄릿형"
          typeIndex={0}
          interactive={false}
        />
      </div>

      <p className="page-landing__meta">12~14문항 · 약 2~3분</p>

      <PrimaryButton size="lg" fullWidth onClick={startQuiz}>
        시작하기
      </PrimaryButton>
    </section>

    <footer className="page-landing__footer">
      <a href="#">만든이</a>
      <span>·</span>
      <a href="#">피드백</a>
    </footer>
  </div>
</main>
```

### 스타일

```css
.page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.page-landing__header {
  padding: var(--space-6) 0 var(--space-4);
  text-align: center;
}
.page-landing__brand {
  font-size: var(--text-sm);
  color: var(--text-muted);
  letter-spacing: 0.05em;
  margin: 0;
}

.page-landing__hero {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-6);
  padding: var(--space-8) 0 var(--space-12);
  flex: 1;
  justify-content: center;
}

.page-landing__title {
  font-size: var(--text-3xl);
  line-height: 1.25;
  font-weight: var(--font-extrabold);
  color: var(--text-default);
  margin: 0;
  text-align: center;
  letter-spacing: -0.01em;
}

.page-landing__preview {
  display: flex;
  justify-content: center;
  padding: var(--space-4) 0;
}

.page-landing__meta {
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-align: center;
  margin: 0;
}

.page-landing__footer {
  padding: var(--space-6) 0;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--text-helper);
}
.page-landing__footer a { color: var(--text-muted); text-decoration: none; }
```

### 첫 뷰포트 검증 (375×640)
- 헤더 (~52px) + 상하 패딩 (~32+32=64px) + 타이틀 2줄 (~90px) + 미리보기 카드 (~96px) + 메타 (~20px) + CTA (~56px) = **약 374px** → 안전하게 들어옴

### 인터랙션
| 트리거 | 동작 | 듀레이션 |
|---|---|---|
| 페이지 로드 | hero 영역 fade-in + 살짝 위로 translate (8px) | 400ms ease-out |
| CTA hover (데스크톱) | primary-700으로 색 전환 | 150ms ease-out |
| CTA tap | 살짝 눌림(translate Y 1px) | 100ms |
| CTA 클릭 | 라우팅 `/quiz` |  |

### 핸드오프 체크리스트
- [ ] 도메인 시그널이 가장 큰 시각 비중
- [ ] CTA가 첫 뷰포트 안 (375×640)
- [ ] 위트 톤 미리보기 카드 1개만 노출
- [ ] 푸터는 첫 뷰포트 밖
- [ ] 가로 스크롤 발생 안 함 (360px 폭)

---

## S2 — 문항 페이지 `/quiz`

### 마크업 트리
```jsx
<main className="page page-quiz">
  <ProgressBar
    current={currentIndex + 1}
    total={questions.length}
    onBack={currentIndex > 0 ? handleBack : undefined}
  />

  <div className="container">
    <section className="page-quiz__body">
      <p className="page-quiz__scenario">{question.scenario}</p>
      <h2 className="page-quiz__question">{question.question}</h2>

      <div className="page-quiz__choices">
        {question.choices.map((c, i) => (
          <ChoiceCard
            key={i}
            icon={c.icon}
            label={c.label}
            selected={answers[currentIndex] === i}
            onClick={() => handleSelect(i)}
          />
        ))}
      </div>
    </section>
  </div>
</main>
```

### 스타일
```css
.page-quiz {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.page-quiz__body {
  padding: var(--space-8) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.page-quiz__scenario {
  font-size: var(--text-base);
  line-height: var(--lh-base);
  color: var(--text-secondary);
  margin: 0;
}

.page-quiz__question {
  font-size: var(--text-xl);
  line-height: var(--lh-xl);
  font-weight: var(--font-bold);
  color: var(--text-default);
  margin: 0;
  letter-spacing: -0.01em;
}

.page-quiz__choices {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
```

### 진행 상태별 변화
| 상태 | 변화 |
|---|---|
| 1번 문항 | 이전 버튼 opacity 0.3 + 클릭 비활성 |
| 답 있는 문항 (뒤로가기 복귀) | 해당 ChoiceCard `selected=true` (primary-100 + 체크) |
| 마지막 문항 | (시각 변화 없음, 선택 시 결과 라우팅) |
| 풀이 완료 | 결과 페이지로 `replace` (뒤로가기로 다시 안 옴) |

### 인터랙션
| 트리거 | 동작 | 듀레이션 |
|---|---|---|
| 페이지 진입 | 문항 fade-in + 살짝 위로 | 250ms ease-out |
| ChoiceCard hover (데스크톱) | translate Y -2px + 그림자 강화 | 150ms |
| ChoiceCard tap | 강조 (primary-100 배경 + 테두리) → 300ms 후 자동 다음 | 300ms |
| ProgressBar | 진행률 width 변화 | 250ms ease-out |
| ← 탭 | 이전 문항 (선택지에 기존 답 강조) | 즉시 |
| 마지막 답 선택 | 강조 → 결과 페이지 라우팅 (fade-out) | 300ms |

### 핸드오프 체크리스트
- [ ] 문항 + 선택지 4개가 모바일 1뷰포트(640px) 안 (스크롤 거의 없음)
- [ ] 선택지 카드 터치 영역 ≥ 44px (실제 ~64px)
- [ ] 자동 진행 300ms 지연 (시각 피드백 인지 시간)
- [ ] 이전 답 보존 (배열 상태 유지)
- [ ] 진행바 sticky, 스크롤 시에도 가시

---

## S3 — 결과 페이지 (본인) `/result/{코드}`

### 마크업 트리
```jsx
<main className="page page-result">
  <div className="container">
    <header className="page-result__header">
      <button onClick={handleBack} aria-label="뒤로 가기">
        <ChevronLeft size={24} />
      </button>
    </header>

    <CaptureCard
      typeIndex={type.index}
      code={type.code}
      name={type.name}
      tagline={type.tagline}
      traits={type.traits}
      domRef={captureRef}
    />

    <section className="page-result__roles">
      <h3 className="page-result__section-title">어울리는 역할 / 장르</h3>
      <ul className="page-result__role-list">
        {type.roles.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </section>

    <section className="page-result__relations">
      <div>
        <h3 className="page-result__section-title">너의 천적</h3>
        <TypeCard
          relation="rival"
          code={type.rival.code}
          name={type.rival.name}
          typeIndex={type.rival.index}
        />
      </div>
      <div>
        <h3 className="page-result__section-title">너의 베프</h3>
        <TypeCard
          relation="bff"
          code={type.bff.code}
          name={type.bff.name}
          typeIndex={type.bff.index}
        />
      </div>
    </section>

    <section className="page-result__share">
      <div className="share-group">
        <ShareActionButton type="image" onAction={handleSaveImage} />
        <ShareActionButton type="link" onAction={handleCopyLink} />
        <ShareActionButton type="kakao" onAction={handleKakaoShare} />
      </div>
      <SecondaryButton size="md" fullWidth onClick={handleRetry}>
        <RotateCcw size={18} /> 다시 풀기
      </SecondaryButton>
    </section>
  </div>
</main>
```

### 스타일
```css
.page-result {
  padding-bottom: var(--space-12);
}

.page-result__header {
  display: flex;
  align-items: center;
  padding: var(--space-3) 0;
}
.page-result__header button {
  background: transparent;
  border: none;
  padding: var(--space-2);
  color: var(--text-secondary);
  cursor: pointer;
}

.page-result__roles,
.page-result__relations,
.page-result__share {
  margin-top: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.page-result__section-title {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--text-default);
  margin: 0 0 var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.page-result__role-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.page-result__role-list li {
  font-size: var(--text-base);
  line-height: var(--lh-base);
  color: var(--text-secondary);
  padding-left: var(--space-3);
  position: relative;
}
.page-result__role-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-500);
}

.page-result__relations {
  gap: var(--space-5);
}
```

### 16유형별 동적 컬러
```jsx
// CaptureCard 안에서 data-type 속성 적용
<section data-type={String(typeIndex).padStart(2, '0')}>
```
→ globals.css의 `[data-type="00"] ~ [data-type="15"]` 셀렉터가 `--bg-capture` + `--text-on-type` 주입.

### 인터랙션
| 트리거 | 동작 | 듀레이션 |
|---|---|---|
| 페이지 진입 | CaptureCard fade-in + scale 0.96→1 (셀럽레이션) | 500ms ease-out-back |
| 캡처 영역 | 정적 (인터랙션 없음, html2canvas 친화) | — |
| 이미지 저장 탭 | 스피너 → 캡처 → 다운로드 → 0.5s 체크 마크 | ~1.5s |
| 링크 복사 탭 | 클립보드 복사 → 0.5s "복사됨!" 토스트 | 500ms |
| 카톡 공유 탭 | Kakao SDK 호출 | 즉시 |
| 천적/베프 카드 탭 | `/result/{code}` 라우팅 + 페이지 전환 fade | 250ms |
| 다시 풀기 탭 | 답 초기화 → `/quiz` `replace` 라우팅 | 즉시 |

### 핸드오프 체크리스트
- [ ] CaptureCard가 모바일 1뷰포트(~640px) 안 (위트 네이밍 + 코드 + 캐치프레이즈 + 묘사 4줄 + 워터마크)
- [ ] 캡처 영역 시각 경계 (`--shadow-3`)
- [ ] 공유 버튼 3개 동일 크기 (grid 3등분)
- [ ] 다시 풀기는 secondary 시각
- [ ] 천적/베프 카드 클릭 시 정확한 라우팅
- [ ] 뒤로 가기로 원래 결과지에 정확히 복귀
- [ ] OG 태그 16유형별 동적 (Next.js static export 시 16페이지 사전 생성)

---

## S3' — 결과 페이지 (공유 수신자 모드) `/result/{코드}`

### S3와 차이만 명시

```jsx
<main className="page page-result">
  <div className="container">
    {/* 헤더 — S3와 동일 */}
    <header className="page-result__header">
      <button onClick={handleBack} aria-label="뒤로 가기">
        <ChevronLeft size={24} />
      </button>
    </header>

    {/* ★ 수신자 안내 (선택, S3에 없음) */}
    {isRecipient && (
      <p className="page-result__visitor-note">
        친구가 풀어본 결과예요 :)
      </p>
    )}

    {/* CaptureCard — S3와 동일 */}
    <CaptureCard {...} />

    {/* ★ 수신자 전용 CTA (캡처 영역 바로 아래) */}
    {isRecipient && (
      <section className="page-result__visitor-cta">
        <PrimaryButton size="lg" fullWidth onClick={handleStart}>
          나도 풀어보기
        </PrimaryButton>
        <p className="page-result__visitor-cta-meta">2~3분이면 끝</p>
      </section>
    )}

    {/* 나머지 (역할/장르, 천적/베프, 공유, 다시 풀기) — S3와 동일 */}
  </div>
</main>
```

### 모드 판별 로직
```ts
const localCode = localStorage.getItem('myTypeCode');
const isRecipient = !localCode || localCode !== urlCode;
```
- localStorage에 본인 코드 없거나 ≠ URL 코드 → 수신자 모드 활성
- 본인이 한 번이라도 풀었고 = URL 코드 → 일반 S3 (안내·CTA 미노출)

### 스타일 (추가분만)
```css
.page-result__visitor-note {
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-align: center;
  margin: 0 0 var(--space-4);
}

.page-result__visitor-cta {
  margin-top: var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
.page-result__visitor-cta-meta {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin: 0;
}
```

### 시각 위계 (S3' 추가)
1. **CaptureCard** (친구 결과)
2. **"나도 풀어보기" PrimaryButton** ← 캡처 영역 바로 아래, 가장 강한 강조
3. 어울리는 역할/장르
4. 천적/베프
5. 공유 액션
6. 다시 풀기

### 핸드오프 체크리스트
- [ ] localStorage 판별 로직 정확 동작
- [ ] "나도 풀어보기" CTA가 캡처 영역 바로 아래·첫 스크롤 안
- [ ] 본인 풀이 기록 있으면 자동으로 S3 모드 (안내·CTA 미노출)

---

## S4 — 404 / 잘못된 코드 페이지

### 마크업 트리
```jsx
<main className="page page-404">
  <div className="container page-404__container">
    <Badge code="???" variant="unknown" size="lg" />
    <h1 className="page-404__title">
      이 유형은<br />
      아직 없는<br />
      캐릭터예요
    </h1>
    <p className="page-404__hint">
      (오타거나 만들지 못한 조합일지도)
    </p>
    <div className="page-404__actions">
      <PrimaryButton size="lg" fullWidth as="a" href="/">
        처음으로
      </PrimaryButton>
      <SecondaryButton size="md" fullWidth as="a" href="/quiz">
        바로 풀어보기
      </SecondaryButton>
    </div>
  </div>
</main>
```

### 스타일
```css
.page-404 {
  display: flex;
  min-height: 100dvh;
  align-items: center;
}

.page-404__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-12) var(--container-gutter);
}

.page-404__title {
  font-size: var(--text-3xl);
  line-height: 1.25;
  font-weight: var(--font-extrabold);
  text-align: center;
  margin: 0;
  letter-spacing: -0.01em;
}

.page-404__hint {
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-align: center;
  margin: 0;
}

.page-404__actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-4);
}
```

### 핸드오프 체크리스트
- [ ] 코드 화이트리스트(16개) 밖이면 이 페이지 렌더
- [ ] 위트 톤 유지 (무미건조 "404 Not Found" 금지)
- [ ] CTA 2개 (처음으로 = primary, 바로 풀어보기 = secondary)

---

## OG 이미지 / 카카오 공유 카드 명세

### OG 이미지 (16유형별 사전 생성)

| 항목 | 값 |
|---|---|
| 크기 | 1200 × 630px (Open Graph 표준) |
| 카카오톡 공유 카드 | 800 × 800px (정사각형 권장) |
| 인스타 스토리 공유 | 1080 × 1920px (9:16) — Phase 3 옵션 |
| 생성 방식 | 빌드 시점에 16개 사전 생성 (서버 렌더 또는 정적 HTML→png) |

### OG 이미지 레이아웃
```
┌────────────────────────────────────┐
│  배경: 유형 시그니처 컬러 (--type-N) │
│                                     │
│       [MINB]                        │  ← 코드 배지 (좌상단)
│                                     │
│                                     │
│         비 오는 날                   │  ← 위트 네이밍 (중앙, 큼)
│         뛰쳐나가는                   │
│         햄릿형                       │
│                                     │
│                                     │
│  "감정에 잠겼다 가버리는..."         │  ← 캐치프레이즈 (작게)
│                                     │
│         연기 스타일 MBTI             │  ← 워터마크 (하단)
└────────────────────────────────────┘
```

### 메타 태그 (HTML head)
```html
<meta property="og:title" content="[MINB] 비 오는 날 뛰쳐나가는 햄릿형" />
<meta property="og:description" content="감정에 잠겼다 가버리는, 그러나 무대 위에선 누구보다 진짜다." />
<meta property="og:image" content="https://{도메인}/og/MINB.png" />
<meta property="og:url" content="https://{도메인}/result/MINB" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

### 카카오 공유 SDK 호출
```ts
Kakao.Share.sendDefault({
  objectType: 'feed',
  content: {
    title: `[${code}] ${name}`,
    description: tagline,
    imageUrl: `${origin}/og/${code}.png`,
    link: {
      mobileWebUrl: `${origin}/result/${code}`,
      webUrl: `${origin}/result/${code}`,
    },
  },
  buttons: [{
    title: '나도 풀어보기',
    link: {
      mobileWebUrl: `${origin}/`,
      webUrl: `${origin}/`,
    },
  }],
});
```

---

## 글로벌 핸드오프 체크리스트

### 디자인 일관성
- [ ] 모든 화면이 480px 컨테이너 유지
- [ ] 좌우 gutter 16px 통일
- [ ] 폰트는 Pretendard Variable 우선
- [ ] 이모지 0개 — 모든 시각 요소는 Lucide 아이콘
- [ ] 색상은 globals.css 토큰만 사용 (HEX 하드코딩 없음)

### 접근성
- [ ] 모든 인터랙티브 요소 키보드 조작 가능
- [ ] 포커스 가시성 `--shadow-focus`
- [ ] 명암비 AA 통과 (검증은 design-tokens.md § 4)
- [ ] 터치 타겟 ≥ 44×44px
- [ ] `prefers-reduced-motion` 대응

### 성능
- [ ] 첫 의미있는 콘텐츠 ≤ 2초
- [ ] 16개 OG 이미지 사전 생성 (런타임 렌더 금지)
- [ ] 폰트 preload + font-display: swap
- [ ] 16유형 콘텐츠는 정적 JSON 빌드 포함

### SEO / 공유
- [ ] 16개 결과 페이지 모두 정적 HTML로 사전 렌더
- [ ] OG/Twitter 카드 메타 16개 사전 생성
- [ ] 카카오 SDK 정상 로드

### 호환성 (실기 검증)
- [ ] iOS Safari (최신 2버전)
- [ ] 안드로이드 Chrome (최신 2버전)
- [ ] 데스크톱 Chrome (보조)
- [ ] html2canvas 이미지 저장 위 환경 모두 동작

---

## 🎯 Step 2.7로 넘기는 것

각 화면·컴포넌트의 **인터랙션·애니메이션 디테일**을 별도 문서로:

- 페이지 전환 (enter/exit)
- 마이크로인터랙션 (hover, tap, focus)
- 셀럽레이션 (결과 페이지 진입 시)
- 스피너 / 로딩 / 성공 피드백
- 모션 토큰(`--duration-*`, `--ease-*`) 활용 패턴
- `prefers-reduced-motion` 대응 매트릭스
