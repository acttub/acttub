# Design System — excer

> Stage 2.1 산출물. 토큰·팔레트·타이포·컴포넌트 인벤토리.
>
> **원칙**: arch 의 globals.css 와 100% 동일 토큰. shadcn "new-york" 스타일, lucide 아이콘, Pretendard.

---

## 1. 출처
- 기반: `C:\dev\acttub\arch\src\app\globals.css`
- shadcn 설정: `components.json` (style: new-york, baseColor: neutral, cssVariables: true)
- 폰트: Pretendard Variable (CDN)

복사할 때 디자인 토큰 절대 임의 수정 금지 — 생태계 통일감이 차별점이다.

---

## 2. 색상 토큰

### 2.1 라이트 (기본)
| 토큰 | HEX | 용도 |
| --- | --- | --- |
| `--background` | `#fafbfc` | 페이지 배경 |
| `--foreground` | `#191f28` | 본문 텍스트 |
| `--card` | `#ffffff` | 카드/패널 배경 |
| `--card-foreground` | `#191f28` | 카드 위 텍스트 |
| `--popover` | `#ffffff` | 팝오버 배경 |
| `--popover-foreground` | `#191f28` | 팝오버 텍스트 |
| `--primary` | **`#ff7a5c`** | **코랄 시그니처 — CTA, 활성 상태** |
| `--primary-foreground` | `#ffffff` | primary 위 텍스트 |
| `--secondary` | `#f2f4f6` | 보조 버튼/배경 |
| `--secondary-foreground` | `#333d4b` | secondary 위 텍스트 |
| `--muted` | `#f2f4f6` | 비활성 배경 |
| `--muted-foreground` | `#6b7684` | 보조 텍스트 |
| `--accent` | `#ffe8e0` | 옅은 코랄 강조 |
| `--accent-foreground` | `#c8553a` | accent 위 텍스트 |
| `--destructive` | `#e55353` | 에러/위험 |
| `--destructive-foreground` | `#ffffff` | — |
| `--border` | `#e5e8eb` | 모든 경계선 |
| `--input` | `#e5e8eb` | 입력 경계 |
| `--ring` | `#ffb39e` | 포커스 링 (옅은 코랄) |

### 2.2 다크 (선택 — MVP 후속)
- arch 의 다크 변수가 정의되어 있지 않음. **MVP 1차에선 라이트 전용 출시**.
- `prefers-color-scheme` 감지하되 토큰 정의 전까지는 라이트로 강제.
- 후속에서 별도 토큰 세트 정의 (지도와 충돌 주의 — 카카오맵의 다크 스타일 가능 여부 확인 필요).

### 2.3 의미 사용 가이드
- **Coral primary (`#ff7a5c`)** — "전화하기" / "예약 페이지로 이동" / 활성 필터 칩 / 핀 강조
- **Accent (`#ffe8e0`)** — 마지막 확인 30일+ 노란-주황 경고가 아니라, "권장" / "추천" 같은 부드러운 강조에. 위험은 destructive 사용.
- **Destructive** — 위험 액션·삭제·치명적 에러 토스트
- **Muted** — 비활성/플레이스홀더/skeleton

---

## 3. 라디우스

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--radius` | `0.875rem` (14px) | 베이스 |
| `--radius-sm` | `0.5rem` (8px) | 작은 배지·칩 |
| `--radius-md` | `0.625rem` (10px) | 버튼·입력 |
| `--radius-lg` | `0.875rem` (14px) | 카드 |
| `--radius-xl` | `1.125rem` (18px) | 큰 패널·바텀시트 상단 |
| `--radius-2xl` | `1.625rem` (26px) | — |
| `--radius-3xl` | `2.125rem` (34px) | 사진 캐러셀 등 |

> arch 의 라디우스 스케일을 그대로 따름. **둥근 모서리가 acttub 전체 톤의 한 축**이라 임의로 작게 만들지 말 것.

---

## 4. 타이포그래피

### 4.1 폰트 패밀리
```
"Pretendard Variable", Pretendard,
-apple-system, BlinkMacSystemFont, system-ui,
"Apple SD Gothic Neo", "Noto Sans KR", sans-serif
```
CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css`

### 4.2 스케일 (Tailwind v4 기본)
| 토큰 | rem | px | 용도 |
| --- | --- | --- | --- |
| `text-xs` | 0.75 | 12 | 보조 라벨, 메타 |
| `text-sm` | 0.875 | 14 | 카드 부가 정보, 필터 칩 |
| `text-base` | 1.0 | 16 | 본문 |
| `text-lg` | 1.125 | 18 | 카드 제목 |
| `text-xl` | 1.25 | 20 | 섹션 제목 |
| `text-2xl` | 1.5 | 24 | 상세 페이지 이름 |
| `text-3xl` | 1.875 | 30 | 가격 강조 (상세) |

### 4.3 굵기
- 본문: `font-normal` (400)
- 라벨/카드 제목: `font-medium` (500)
- 강조 (이름/가격): `font-semibold` (600)
- 큰 숫자 강조: `font-bold` (700) — 가격 노출에만 절제 있게

### 4.4 행간·자간
- 본문 line-height: 기본 1.5
- 큰 텍스트(text-2xl+): 1.25
- 자간: 한국어이므로 `tracking-tight` 절제 사용 — 보통은 기본값

---

## 5. 간격

Tailwind v4 기본 스페이싱 그대로:
- 컴포넌트 내부 패딩: `p-3` (12px) ~ `p-4` (16px)
- 카드 간격: `gap-3` ~ `gap-4`
- 섹션 간격: `gap-6` ~ `gap-8`
- 모바일 페이지 여백: `px-4` (16px)
- 데스크톱 페이지 여백: `px-6` ~ `px-8`

터치 타깃: 모든 인터랙티브 요소 **최소 44×44px** (NFR-02)

---

## 6. 그림자
arch 가 그림자 토큰을 별도 정의하지 않으므로 Tailwind 기본 사용:
- 카드: `shadow-sm` (기본 평탄, 호버 시 `shadow-md`)
- 모달/팝오버: `shadow-lg`
- 바텀 시트: `shadow-2xl`

> Toss 스타일 — **그림자는 절제**. 경계선과 배경 대비로 위계를 먼저 잡고, 그림자는 떠 있는 요소(시트·모달)에만.

---

## 7. 아이콘
- 라이브러리: `lucide-react` (arch 와 동일)
- 크기: 16 (인라인) / 20 (버튼 안) / 24 (헤더)
- 스트로크: 1.5 ~ 2 (lucide 기본)

excer 에서 자주 쓸 아이콘:
| 용도 | 아이콘 |
| --- | --- |
| 검색 | `Search` |
| 내 주변 (위치) | `Navigation` 또는 `MapPin` |
| 필터 | `SlidersHorizontal` |
| 정렬 | `ArrowUpDown` |
| 전화 | `Phone` |
| 외부 링크 | `ExternalLink` |
| 거울 | `Square` (대용) — custom SVG 검토 |
| 방음 | `Volume2` 또는 `VolumeX` |
| 평수 | `Maximize2` |
| 조명 | `Sun` |
| 마이크 | `Mic` |
| 시간 | `Clock` |
| 위치 | `MapPin` |
| 뒤로 | `ChevronLeft` |
| 마지막 확인일 | `ShieldCheck` (확인됨) / `AlertCircle` (오래됨) |

---

## 8. 컴포넌트 인벤토리

### 8.1 arch 에 이미 있어서 복사하면 되는 것
- ✅ `Button` (variants: default/secondary/destructive/outline/ghost/link)
- ✅ `Card` (Header / Title / Description / Content / Footer)
- ✅ `Input`
- ✅ `Label`
- ✅ `Badge` (variants: default/secondary/destructive/outline)
- ✅ `Dialog` (모달)
- ✅ `Tabs`
- ✅ `Skeleton` (로딩)
- ✅ `Sonner` (토스트)
- ✅ `Avatar`
- ✅ `Textarea`

### 8.2 추가로 shadcn 에서 가져올 것
- ⏳ `Sheet` — 모바일 바텀 시트 (필터 패널, 리스트)
- ⏳ `Drawer` — 모바일 친화 시트 (Sheet 대안. Vaul 기반)
- ⏳ `Slider` — 가격 범위 필터
- ⏳ `ToggleGroup` — 정렬 토글, 필터 칩 그룹
- ⏳ `Carousel` — 사진 캐러셀 (Embla 기반)
- ⏳ `Popover` — 필터/정렬 데스크톱 드롭다운
- ⏳ `Separator` — 카드 안 구분선

### 8.3 excer 만의 커스텀 컴포넌트
- `<MapView />` — 카카오맵 SDK 래퍼. POI 핀, 클러스터, 위치 이동 노출
- `<RoomCard />` — 리스트/하단시트의 카드 (썸네일·이름·속성 칩·가격)
- `<RoomPin />` — 지도 위 코랄 핀 마커 (SVG)
- `<AttributeTable />` — 상세의 6항목 표
- `<LastVerifiedBadge />` — "○○일 전 확인" 배지 (30일+ 면 색 변경)
- `<SearchBar />` — 동/역/내 주변 통합 입력
- `<FilterPanel />` — 모바일은 Sheet, 데스크톱은 Popover 로 wrap
- `<SortControl />` — ToggleGroup 기반
- `<RoomPhotoCarousel />` — Carousel 위에 닷·스와이프
- `<ExternalLinkCTA />` — 전화/예약 CTA (sticky 처리)
- `<EmptyState />` — 필터 0건·검색 결과 없음·404 공용

---

## 9. 상태 표현

### 9.1 인터랙티브 상태
- **default** — 위 토큰 그대로
- **hover** — `bg-{색}/90` 또는 `bg-{색}/95`
- **active/pressed** — `bg-{색}/85`
- **focus** — `ring-2 ring-ring ring-offset-2 ring-offset-background`
- **disabled** — `opacity-50 cursor-not-allowed`

### 9.2 데이터 상태
| 상태 | 표현 |
| --- | --- |
| 로딩 | `Skeleton` (카드/속성표/상세) |
| 빈 결과 | `EmptyState` (아이콘 + 메시지 + 제안 액션) |
| 에러 | `Sonner` 토스트 + 인라인 "다시 시도" |
| 데이터 오래됨 (30일+) | `LastVerifiedBadge` 노란 변형 (`accent`) |
| 운영시간 외 | 상세에서 보조 텍스트 회색 (`muted-foreground`) |

---

## 10. 모션
- 기본 트랜지션: `transition-all duration-150 ease-out`
- 시트 열림: `duration-300 ease-out` (slide-up)
- 모달: `duration-200` (fade-in + scale)
- 카드 hover: `transition-transform duration-200` + `hover:-translate-y-0.5`
- 지도 핀 강조: `scale-110` + `ring-2 ring-ring`
- **사용자 prefers-reduced-motion 존중**: `motion-reduce:transition-none`

---

## 11. 반응형 브레이크포인트
Tailwind v4 기본:
| 명 | 값 | excer 의미 |
| --- | --- | --- |
| sm | 640px | 가로 모바일 |
| md | 768px | 작은 태블릿 |
| lg | 1024px | **메이저 분기 — 좌측 지도 + 우측 패널 시작** |
| xl | 1280px | 데스크톱 본격 |
| 2xl | 1536px | 큰 모니터 |

핵심 분기점은 **1024px 하나**. 그 미만은 모바일 패턴(지도 + 하단시트), 이상은 데스크톱 패턴(지도 + 사이드 패널).

---

## 12. acttub 형제 앱 통일감 체크리스트
- [x] Pretendard Variable 동일 CDN
- [x] 색상 토큰 100% 일치
- [x] 라디우스 스케일 동일
- [x] shadcn "new-york" 스타일, neutral baseColor
- [x] lucide 아이콘
- [x] 그림자 절제, 경계선 + 배경 대비 우선
- [x] 둥근 카드 + 정돈된 여백 ("Toss 스타일" 베이스)

---

## 13. 다음 단계로 넘기는 결정 사항
- **D1**: 다크 모드는 MVP 1차 보류 — 라이트만.
- **D2**: 거울·평수 등 일부 아이콘은 lucide 표준에 1:1 매칭이 약함. **시각 사양(2.4)에서 custom SVG 6개 정의** 필요.
- **D3**: 핀 마커는 Coral primary 가 강함 — 100개+ 표시될 때 시각 피로 우려. 클러스터 임계치 결정은 2.4 에서.
- **D4**: 가격 필터 UI 는 **Slider + 입력 박스 보완** 권장. 칩만으론 가격 자유도 부족. (PRD Q1 답)
