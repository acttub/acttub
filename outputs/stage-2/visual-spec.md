# Visual Spec — excer

> Stage 2.4 산출물. 컴포넌트별 hi-fi 시각 사양 + shadcn 매핑 + Tailwind 클래스.
>
> 토큰은 `design-system.md` 참조. 이 문서는 **컴포넌트가 화면에서 정확히 어떻게 보이고 동작하는지**.

---

## 0. 작성 규칙
- 클래스는 **참고용**이며 구현 시 가독성을 위해 분리 가능
- 모든 인터랙티브 요소는 **focus-visible ring** 의무 — `focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background`
- 모든 상태 변경에 `transition-all duration-150 ease-out` 기본 적용
- 다크 모드 클래스는 **MVP 에서 작성하지 않음** (Stage 2.1 D1)

---

## 1. AppHeader

### 1.1 모바일
```
높이: 56px (h-14)
배경: bg-background/80 backdrop-blur
경계: border-b border-border
sticky top-0 z-40
```

레이아웃:
```
[로고]                                          [⚙ 필터]
px-4    flex items-center justify-between h-full
```

로고 typography:
- `text-base font-semibold tracking-tight`
- 색: `text-foreground` + 코랄 점 액센트 (`text-primary`)

필터 IconButton:
- 크기: 40×40 (`size-10`)
- 배경: 기본 투명, 활성/적용된 필터 있으면 `bg-accent text-accent-foreground`
- 적용된 필터 개수 → 우상단 `rounded-full bg-primary text-primary-foreground text-[10px] size-4`

### 1.2 데스크톱 (≥ lg)
```
높이: 64px (h-16)
좌측: 로고
가운데: SearchBar (max-w-2xl)
우측: [내 주변] [필터] [acttub 로고 텍스트 링크]
gap-3, px-6
```

---

## 2. SearchBar

### 모바일
```html
<div class="flex gap-2 px-4 py-2 sticky top-14 z-30 bg-background/80 backdrop-blur border-b border-border">
  <div class="flex-1 relative">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
    <input
      class="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-card text-sm
             placeholder:text-muted-foreground
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      placeholder="동·역 검색"
    />
  </div>
  <button
    class="h-10 px-3 rounded-md bg-secondary text-secondary-foreground text-sm
           hover:bg-secondary/80 flex items-center gap-1.5"
  >
    <Navigation class="size-4" />
    내 주변
  </button>
</div>
```

- 검색 입력 width: `flex-1`, 내 주변 버튼: `flex-none`
- placeholder 한국어 자간 자연스럽게 (기본)
- 입력 중에는 우측에 `[✕]` 클리어 버튼 표시 (`size-6 rounded-full bg-muted`)

### 데스크톱
- 검색 input 가운데 정렬, `max-w-xl`
- "내 주변" 버튼은 검색 input 우측 외부에 분리

---

## 3. FilterPanel

### 3.1 컨테이너
**모바일**: shadcn `<Drawer />` (Vaul) — 하단에서 슬라이드 업
**데스크톱**: shadcn `<Popover />` — 헤더 필터 버튼 앵커

공통 내부:
```
padding: p-5
gap: space-y-5
max-h: max-h-[80vh] overflow-y-auto
하단 액션: sticky bottom-0 bg-background border-t pt-4
```

### 3.2 필터 그룹 — 토글 칩 (거울/방음/평수)
shadcn `<ToggleGroup type="single" />`

```html
<div class="space-y-2">
  <label class="text-sm font-medium text-foreground">방음</label>
  <ToggleGroup class="grid grid-cols-3 gap-2">
    <ToggleItem value="strong">강</ToggleItem>
    <ToggleItem value="medium">중</ToggleItem>
    <ToggleItem value="weak">약</ToggleItem>
  </ToggleGroup>
</div>
```

ToggleItem 스타일:
- 기본: `h-10 rounded-md border border-input bg-card text-sm text-foreground hover:bg-secondary`
- 활성: `bg-primary text-primary-foreground border-transparent`
- focus: `ring-2 ring-ring ring-offset-2`

### 3.3 가격 Slider + 입력 (PRD Q1 답 — D2)
shadcn `<Slider />` 멀티 핸들

```
구간: 0 ~ 30,000 원 (5,000 단위로 마커)
색: 트랙 muted, 활성 트랙 primary, 핸들 primary + ring
```

하단에 두 개 number input:
```html
<div class="flex gap-2 items-center text-sm">
  <input type="number" class="..." placeholder="0" />
  ~
  <input type="number" class="..." placeholder="30000" />
  <span class="text-muted-foreground">원/시간</span>
</div>
```

### 3.4 하단 액션
```html
<div class="sticky bottom-0 bg-background border-t border-border pt-4 flex gap-3">
  <Button variant="ghost" class="flex-1">초기화</Button>
  <Button variant="default" class="flex-[2]">
    {count}곳 보기
  </Button>
</div>
```

- "초기화" → 모든 쿼리 파라미터 제거
- "{N}곳 보기" → Sheet/Popover 닫으면서 결과 갱신 (URL 반영)
- count 가 0 이면 버튼 disabled 대신 텍스트 "조건에 맞는 곳 없어요" 로 변경

---

## 4. RoomCard

### 4.1 컨테이너
```html
<a
  href="/rooms/{slug}"
  class="group flex gap-3 p-3 rounded-lg border border-border bg-card
         hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  data-room-id="..."
>
  ...
</a>
```

### 4.2 썸네일
```
크기: 80×60 (모바일) / 96×72 (데스크톱)
ratio: 4:3
rounded-md (10px) overflow-hidden bg-muted
```
- 없으면 placeholder: `bg-muted` + lucide `ImageOff` 아이콘 가운데 (muted-foreground)

### 4.3 본문
```html
<div class="flex-1 min-w-0">
  <h3 class="text-base font-semibold text-foreground truncate">혜화 ○○연습실</h3>
  <div class="flex flex-wrap gap-1.5 mt-1">
    <Badge variant="secondary">15평</Badge>
    <Badge variant="secondary">🪞 거울</Badge>
    <Badge variant="secondary">방음 강</Badge>
  </div>
  <div class="mt-2 flex items-baseline gap-1">
    <span class="text-base font-bold text-foreground">₩15,000</span>
    <span class="text-xs text-muted-foreground">/시간</span>
  </div>
</div>
```

- 칩 (Badge variant="secondary"): `bg-secondary text-secondary-foreground text-xs`
- 칩 최대 3개 노출, 초과 시 `+2` 칩으로 축약
- 가격 굵게 (semibold/bold) 강조

### 4.4 우측 진입 화살표
```html
<ChevronRight class="size-4 text-muted-foreground self-center shrink-0" />
```

### 4.5 활성 상태 (지도 핀과 양방향)
JS 로 `data-active="true"` 토글:
```css
[data-active="true"] {
  @apply ring-2 ring-ring ring-offset-2;
}
```

---

## 5. RoomPin (지도 마커)

### 5.1 기본 핀
SVG:
```
원형 18px, 채움 #ff7a5c (primary)
흰색 1.5px 테두리
그림자: drop-shadow(0 1px 2px rgba(0,0,0,0.2))
```

### 5.2 활성 핀
```
크기: 24px
ring: 4px solid #ffb39e (ring 색)
```

### 5.3 클러스터
```
원형 36~44px (멤버 수에 따라 살짝 큼)
배경 white
테두리 2px solid #ff7a5c
숫자: text-sm font-semibold text-primary
```

### 5.4 클러스터 임계치 (D3 답)
- 줌 ≥ 16: 개별 핀
- 줌 14~15: 100m 내 클러스터
- 줌 ≤ 13: 500m 내 클러스터

### 5.5 인터랙션
- 핀 클릭 → 카드/상세 동작 (모바일은 상세 직행, 데스크톱은 사이드 카드 강조 후 상세)
- 클러스터 클릭 → 줌 인 + 중심 이동

---

## 6. AttributeTable

```html
<dl class="grid grid-cols-[80px_1fr] divide-y divide-border rounded-lg border border-border overflow-hidden">
  <dt class="px-4 py-3 text-sm text-muted-foreground bg-muted/50">거울</dt>
  <dd class="px-4 py-3 text-sm font-medium text-foreground border-l border-border">
    <span class="inline-flex items-center gap-1.5">
      <Check class="size-4 text-primary" />
      있음
    </span>
  </dd>

  <dt class="px-4 py-3 text-sm text-muted-foreground bg-muted/50">방음</dt>
  <dd class="px-4 py-3 text-sm font-medium text-foreground border-l border-border">
    <Volume2 class="size-4 inline-block mr-1" />
    강
  </dd>
  ...
</dl>
```

값 표현:
- 있음: `Check` 아이콘 (primary) + "있음"
- 없음: `Minus` 아이콘 (muted-foreground) + "없음" + 텍스트도 `text-muted-foreground`
- 등급 (방음/조명): 아이콘 + 한글 등급 (강/중/약, 밝음/보통/어두움/없음)
- 평수: `{N}평` 텍스트만

---

## 7. LastVerifiedBadge

### 7.1 30일 이내 (정상)
```html
<Badge variant="outline" class="gap-1 text-xs">
  <ShieldCheck class="size-3" />
  {N}일 전 확인
</Badge>
```
- `border-border text-muted-foreground bg-card`

### 7.2 31~60일 (주의)
```html
<Badge class="gap-1 text-xs bg-accent text-accent-foreground border border-accent-foreground/20">
  <AlertCircle class="size-3" />
  {N}일 전 확인
</Badge>
```

### 7.3 61일 이상 (경고)
```html
<Badge variant="destructive" class="gap-1 text-xs opacity-90">
  <AlertCircle class="size-3" />
  {N}일 전 확인 — 가격 변동 가능
</Badge>
```

### 7.4 임계치 (PRD Q6 답)
- 정상: 0~30
- 주의: 31~60
- 경고: 61+

---

## 8. ExternalLinkCTA (전화/예약)

### 8.1 모바일 (sticky 하단)
```html
<div class="fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur
            border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
  <div class="flex gap-2 max-w-md mx-auto">
    <a href="tel:..." class="flex-[2] h-12 rounded-md bg-primary text-primary-foreground
                              text-sm font-semibold inline-flex items-center justify-center gap-2
                              active:bg-primary/85 transition">
      <Phone class="size-4" />
      전화하기
    </a>
    <a href="..." target="_blank" rel="noopener" class="flex-[3] h-12 rounded-md border border-primary
                                                          text-primary text-sm font-semibold inline-flex
                                                          items-center justify-center gap-2
                                                          hover:bg-accent/50 transition">
      <ExternalLink class="size-4" />
      예약 페이지로 이동
    </a>
  </div>
</div>
```

- safe-area-inset-bottom 으로 iOS 홈 인디케이터 대응
- 외부 예약 링크 없으면 전화 풀폭 (flex-1)

### 8.2 데스크톱 (상세 우측 패널 sticky)
```html
<aside class="lg:sticky lg:top-20 space-y-3">
  <Button asChild class="w-full h-12 text-base">
    <a href="tel:..."><Phone class="mr-2 size-4" /> 전화하기</a>
  </Button>
  <Button variant="outline" asChild class="w-full h-12 text-base border-primary text-primary">
    <a href="..." target="_blank" rel="noopener">
      <ExternalLink class="mr-2 size-4" /> 예약 페이지로 이동
    </a>
  </Button>
</aside>
```

---

## 9. BottomSheet (모바일 리스트 시트)

shadcn `<Drawer />` (Vaul) 기반. 스냅 포인트 3단 (D1).

```ts
<Drawer
  snapPoints={[0.3, 0.55, 0.9]}  // peek / half / full
  defaultOpen
  shouldScaleBackground={false}
>
  <DrawerContent class="bg-background rounded-t-2xl border-t border-border">
    <div class="mx-auto w-12 h-1.5 rounded-full bg-border my-3" />  {/* 드래그 핸들 */}
    <DrawerHeader class="flex items-center justify-between px-4 py-2">
      <span class="text-sm text-muted-foreground">{count}곳</span>
      <SortControl />
    </DrawerHeader>
    <div class="overflow-y-auto px-4 pb-4 space-y-2 flex-1">
      {rooms.map(r => <RoomCard ... />)}
    </div>
  </DrawerContent>
</Drawer>
```

- 시트 상단 라디우스 `rounded-t-2xl` (1.625rem)
- 핸들바: `bg-border` 12×1.5px, 위 12px margin

---

## 10. EmptyState

```html
<div class="flex flex-col items-center text-center px-6 py-12 max-w-sm mx-auto">
  <div class="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
    <Icon class="size-6 text-muted-foreground" />
  </div>
  <h3 class="text-base font-semibold text-foreground">{title}</h3>
  <p class="text-sm text-muted-foreground mt-1">{description}</p>
  <div class="mt-5 flex flex-col gap-2 w-full">
    {actions}
  </div>
</div>
```

EmptyState 인스턴스:
- **필터 0건** — 아이콘 `SearchX`, 제목 "조건에 맞는 연습실이 없어요", 액션은 가장 가까운 완화 제안 칩들
- **검색 결과 없음** — 아이콘 `MapOff`, 제목 "검색 결과가 없어요", 액션 "필터 초기화"
- **404** — 아이콘 `Mask` (또는 emoji 🎭), 제목 "찾을 수 없어요", 액션 "지도로 돌아가기"

---

## 11. SortControl

shadcn `<ToggleGroup type="single" />` 작은 변형:
```html
<ToggleGroup type="single" defaultValue="near" class="h-8 rounded-full bg-muted p-0.5">
  <ToggleItem value="near" class="h-7 px-3 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-full">
    거리순
  </ToggleItem>
  <ToggleItem value="price" class="h-7 px-3 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-full">
    가격순
  </ToggleItem>
</ToggleGroup>
```

iOS 세그먼티드 컨트롤 스타일.

---

## 12. RoomPhotoCarousel

### 12.1 기본 (상세 내 인라인)
```html
<Carousel class="rounded-2xl overflow-hidden bg-muted aspect-video">
  <CarouselContent>
    {photos.map(p => (
      <CarouselItem>
        <img src={p} class="w-full h-full object-cover" loading="lazy" />
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselDots />  {/* 모바일: 캐러셀 위에 absolute */}
  <CarouselPrevious />  {/* 데스크톱만 */}
  <CarouselNext />
</Carousel>
```

- 닷: 활성 `bg-primary`, 비활성 `bg-background/60`. 캐러셀 하단 12px 위.
- 클릭 시 라이트박스 Dialog 오픈

### 12.2 라이트박스
```
shadcn <Dialog />, 풀스크린 사용
배경: bg-black/90
이미지: object-contain max-h-[90vh]
닫기: 우상단 X (size-10 bg-background/20 rounded-full)
좌우: <ChevronLeft/> <ChevronRight/> size-12, 화살표 정렬은 화면 가장자리
```

---

## 13. MapView (카카오맵 래퍼)

### 13.1 컨테이너
- 모바일: `h-[60vh]` 또는 `flex-1` (시트와 함께 grid)
- 데스크톱: `lg:flex-1 lg:h-[calc(100vh-64px)]`

### 13.2 줌 컨트롤
```
위치: 우하단 (모바일) / 우하단 (데스크톱)
스타일: 흰 배경 카드, ⊕/⊖ IconButton 2개 세로
크기: 40×40 each, gap-px
shadow-md
```

### 13.3 현위치 버튼
```
위치: 우하단, 줌 컨트롤 위 16px
크기: 40×40 rounded-full bg-background shadow-md
아이콘: Navigation (size-4) text-primary
```

### 13.4 지도 컨트롤 sticky 안전 영역
- 모바일에선 하단 시트 위에 떠 있으면 안 됨 → 시트 peek 높이만큼 `bottom-[calc(30vh+16px)]`

---

## 14. 상태별 색 매트릭스 요약

| 상태 | 배경 | 텍스트 | 경계 | 비고 |
| --- | --- | --- | --- | --- |
| 카드 default | `bg-card` | `text-foreground` | `border-border` | — |
| 카드 hover | `bg-card` + shadow | — | — | -translate-y-0.5 |
| 카드 active | `bg-card` | — | `ring-ring` | data-active |
| 칩 default | `bg-secondary` | `text-secondary-foreground` | none | — |
| 칩 active | `bg-primary` | `text-primary-foreground` | none | 필터 활성 |
| 버튼 primary | `bg-primary` | `text-primary-foreground` | none | hover `/90` |
| 버튼 outline-primary | `bg-transparent` | `text-primary` | `border-primary` | hover `bg-accent/50` |
| 토스트 success | `bg-accent` | `text-accent-foreground` | — | — |
| 토스트 error | `bg-destructive` | `text-destructive-foreground` | — | — |

---

## 15. 접근성 체크 (NFR-04)

| 영역 | 사양 |
| --- | --- |
| 색 대비 | primary on white 대비 4.6:1 (AA 통과), muted-foreground 4.5:1 |
| 포커스 링 | 모든 인터랙티브 요소 `ring-2 ring-ring ring-offset-2` |
| 터치 타깃 | ≥ 44×44px (`h-11 min-w-11` 가이드) |
| ARIA | 지도 영역에 `role="application" aria-label="연습실 지도"` |
| 핀 마커 | 가상 노드로 키보드 탐색 가능 (Tab → 핀 → Enter) |
| 캐러셀 | `aria-roledescription="carousel"`, 좌우 화살표는 `aria-label` 필수 |
| 필터 변경 | 결과 수 변경을 `aria-live="polite"` 영역으로 안내 |
| 이미지 | alt 필수, placeholder 는 `alt=""` (장식) |

---

## 16. 성능 가이드

- 카카오맵 SDK: `<Script strategy="lazyOnload" />`, 첫 페인트 후 로딩
- 사진: `next/image` + Vercel Image Optimization
- 상세 페이지: SSR + ISR (revalidate: 1h) — `verified_at` 변경 시 revalidate
- 핀 데이터: 현재 뷰포트 안만 클라이언트로 보냄 (API 가 lat/lng bounds 받음)
- 카드 리스트: 가상 스크롤 X (MVP 50~200개 규모면 불필요)

---

## 17. 디자인 결정 사항 (이번 단계 확정)
- **VS1**: 가격 노출 형식은 `₩15,000` 통일 (천 단위 콤마, 원화 기호 앞)
- **VS2**: "협의" 가격은 별도 표기 `₩가격 협의` + 칩 색상 `bg-muted text-muted-foreground`
- **VS3**: 평수는 `15평` 텍스트만 — 일반 단위(㎡)는 노출 안 함
- **VS4**: 카드 칩은 최대 3개 노출. 초과 시 마지막 칩 `+N` (`bg-muted`)
- **VS5**: 마지막 확인일 임계치 30 / 60 / 60+ (정상/주의/경고)
- **VS6**: 외부 예약 링크가 없는 연습실은 "전화하기" 만 풀폭 노출
- **VS7**: 모바일 헤더는 backdrop-blur — 지도 위 떠있는 느낌
- **VS8**: 폰트 굵기는 4단계 (normal / medium / semibold / bold) 만 사용
