# Design Handoff — excer

> Stage 2.5 산출물. Stage 2 의 모든 결정을 엔지니어링 진입 직전 한 장으로 통합.
>
> 버전: v1 (MVP) · 작성일: 2026-05-20

---

## 1. 핸드오프 체크리스트

| 항목 | 상태 | 위치 |
| --- | --- | --- |
| 디자인 토큰 (색/라디우스/타이포) | ✅ | `design-system.md` §2~5 |
| 컴포넌트 인벤토리 (shadcn + 커스텀) | ✅ | `design-system.md` §8 |
| 라우트/URL/상태 설계 | ✅ | `information-architecture.md` |
| 분석 이벤트 명세 | ✅ | `information-architecture.md` §8 |
| 모든 화면 와이어 (mobile + desktop) | ✅ | `wireframes.md` |
| 모든 핵심 상태 (loading/empty/error) | ✅ | `wireframes.md` |
| 컴포넌트별 hi-fi 시각 사양 | ✅ | `visual-spec.md` |
| 접근성 사양 | ✅ | `visual-spec.md` §15 |
| 성능 가이드 | ✅ | `visual-spec.md` §16 |
| 다크 모드 | ⏸️ MVP 1차 보류 | design-system.md D1 |
| 실제 고해상도 mockup (이미지/Figma) | ⏸️ 다음 단계 옵션 | — |

---

## 2. 기초 셋업 — 첫 스프린트 (Day 0~1)

### 2.1 프로젝트 스캐폴딩
```bash
cd C:\dev\acttub\excer
pnpm create next-app@latest . --typescript --tailwind --app --src-dir
```

### 2.2 arch 에서 복사할 파일
- `arch/components.json` → 그대로
- `arch/src/app/globals.css` → 그대로
- `arch/src/lib/utils.ts` → 그대로 (cn 유틸)
- `arch/postcss.config.mjs`, `eslint.config.mjs` → 동일 설정
- `arch/src/components/ui/{button,card,input,label,badge,dialog,tabs,skeleton,sonner,avatar,textarea}.tsx` → 그대로

### 2.3 추가 shadcn 컴포넌트 설치
```bash
pnpm dlx shadcn@latest add sheet drawer slider toggle-group carousel popover separator
```

### 2.4 추가 패키지
| 패키지 | 용도 |
| --- | --- |
| `@clerk/nextjs` | 인증 (acttub 공유 인스턴스, env 만 다름) |
| `drizzle-orm`, `postgres` | DB |
| `drizzle-kit` (devDep) | 마이그레이션 |
| `@vercel/blob` | 사진 저장 |
| `vaul` | Drawer 기반 |
| `embla-carousel-react` | Carousel 기반 |
| `lucide-react` | 아이콘 |
| `nanoid` | slug 생성 |
| `zod` | URL 쿼리 파싱·검증 |
| `react-hook-form`, `@hookform/resolvers` | 관리자 폼 |
| `sonner` | 토스트 |

### 2.5 카카오맵
- 카카오 디벨로퍼스 앱 등록 → JS 키 발급
- env: `NEXT_PUBLIC_KAKAO_MAP_KEY`
- 로드: `<Script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=...&autoload=false&libraries=services,clusterer" strategy="lazyOnload" />`

### 2.6 basePath
`next.config.ts`:
```ts
export default {
  basePath: '/excer',
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
}
```

---

## 3. 컴포넌트 빌드 순서 (의존성 기반)

### Phase A — 기초 (Day 1~2)
1. **shadcn 기본 컴포넌트 설치** (위 2.3 참조)
2. **`AppHeader`** — 모바일/데스크톱 분기
3. **`SearchBar`** — input + "내 주변" IconButton
4. **`EmptyState`** — 4개 인스턴스 공용 베이스
5. **`LastVerifiedBadge`** — 임계치 3단계 변형
6. **`AttributeTable`** — 정적

### Phase B — 카드/리스트 (Day 3)
7. **`RoomCard`** — 썸네일·이름·칩·가격·진입 화살표
8. **`SortControl`** — ToggleGroup 변형
9. **`RoomList`** — 데스크톱 사이드 패널
10. **`BottomSheet`** — Drawer 기반, 스냅 3단

### Phase C — 지도 (Day 4~5)
11. **`MapView`** — 카카오맵 SDK 래퍼, useEffect 로 초기화·정리
12. **`RoomPin`** — SVG 마커
13. **클러스터** — `MarkerClusterer` 라이브러리 활용 (카카오 제공)
14. **줌·현위치 컨트롤**
15. **카드 ↔ 핀 양방향 활성** (data-active)

### Phase D — 필터 (Day 6~7)
16. **`FilterPanel`** — 모바일 Drawer + 데스크톱 Popover 분기
17. **가격 Slider + 입력**
18. **URL 쿼리 ↔ 필터 상태 동기화** (`useSearchParams` 훅 wrapping)
19. **`useFilteredRooms`** 훅 — 서버에서 받은 데이터 클라이언트 필터

### Phase E — 상세 페이지 (Day 8~9)
20. **`/rooms/[slug]/page.tsx`** — SSR + ISR
21. **`RoomPhotoCarousel`** + 라이트박스
22. **`ExternalLinkCTA`** — sticky 처리 (모바일 fixed bottom / 데스크톱 sticky)
23. **JSON-LD `LocalBusiness`** + 메타데이터

### Phase F — 운영/마무리 (Day 10~12)
24. **404 페이지** + sitemap.ts + robots.ts
25. **OG 이미지** (`/excer/og/home.png`, 동적 OG 라우트)
26. **분석 이벤트 부착** (Vercel Analytics + 커스텀)
27. **Skeleton 로딩 상태** 화면별 적용
28. **카카오맵 다크/라이트 스타일 점검**

### Phase G — 데이터 트랙 (병행)
29. **Drizzle 스키마** (rooms 테이블) — `prd.md` §7 데이터 모델
30. **Drizzle Studio** 로 시드 50개 입력 (운영자 직접)
31. **카카오 로컬 API 검색 헬퍼** (운영자 도우미용, 자동 동기화 X)

---

## 4. 데이터 모델 → UI 매핑

| DB 필드 | UI 노출 위치 | 가공 |
| --- | --- | --- |
| `name` | 카드 제목, 상세 h1, OG title | — |
| `region` | 카드 보조, 상세 부제, OG description | — |
| `subway[]` | 검색 매칭, 필터 외 노출 X | — |
| `lat/lng` | 지도 핀 위치, JSON-LD geo | — |
| `price_hour` | 카드/상세 가격 | `₩{toLocale}` |
| `price_note` | "협의" 등 | 가격 자리에 칩 |
| `hours` | 상세 운영시간, 운영시간 외 보조 | "현재 운영 중" 계산 |
| `phone` | 전화 CTA `tel:` href | — |
| `booking_url` | 외부 예약 CTA href | 없으면 CTA 숨김 |
| `photos[]` | 캐러셀, 카드 썸네일 (첫 장) | next/image |
| `mirror` (bool) | 카드 칩 + 속성 표 | 칩: "🪞 거울" / 표: ✅·❌ |
| `soundproof` (enum) | 카드 칩 + 속성 표 + 필터 | 칩: "방음 강" / 표: 아이콘+등급 |
| `size_pyeong` (int) | 카드 칩 + 속성 표 + 필터 | 칩: "{N}평" |
| `lighting` (enum) | 속성 표만 (필터는 SHOULD) | — |
| `scriptstand` (bool) | 속성 표만 | — |
| `microphone` (bool) | 속성 표만 | — |
| `verified_at` (timestamp) | 카드·상세 LastVerifiedBadge | days diff 계산 |
| `active` (bool) | false 면 응답 제외 | API/쿼리에서 필터 |

---

## 5. URL 쿼리 스키마 (zod)

```ts
const SearchParams = z.object({
  q: z.string().trim().optional(),
  center: z.string().regex(/^-?\d+\.\d+,-?\d+\.\d+$/).optional(),
  zoom: z.coerce.number().int().min(8).max(20).optional(),
  mirror: z.enum(['1', '0']).optional(),
  soundproof: z.enum(['strong', 'medium', 'weak']).optional(),
  size: z.enum(['s', 'm', 'l']).optional(),
  price_max: z.coerce.number().int().min(0).optional(),
  sort: z.enum(['near', 'price']).default('near').optional(),
});
```

- 잘못된 값은 무시 (기본값 사용), 에러 던지지 않음
- 서버 컴포넌트에서 파싱, 클라이언트에서도 동일 zod 재사용

---

## 6. 자산 (assets) 필요 목록

### 6.1 코드 외부 자산
| 자산 | 형식 | 크기 | 메모 |
| --- | --- | --- | --- |
| 로고 (excer 워드마크 + 코랄 점) | SVG | inline | acttub 형제 로고 톤 |
| OG 이미지 (홈) | PNG | 1200×630 | 정적 |
| OG 이미지 (상세) | PNG/JPG | 1200×630 | 동적 라우트 (room photo 1장 위에 가격/이름 오버레이) |
| 핀 마커 | SVG | 18/24px | RoomPin 컴포넌트 |
| 클러스터 마커 | SVG/HTML | 36~44px | 카카오 Clusterer styles |
| Favicon | ICO + PNG | 32/192/512 | acttub 패밀리 |

### 6.2 커스텀 아이콘 (lucide 외)
6개 권장 (design-system §13 D2):
- 거울 (Mirror) — 거울 형태 + 작은 반사
- 평수 (Square) — 가운데 숫자 자리
- 대본대 (Music Stand) — 보면대 라인
- 마이크 — lucide 있지만 acttub 톤에 맞게 outlined 단순화 가능
- 조명 (Spotlight) — 무대 조명 콘
- 방음 (Wave/Volume) — 음파 강약

→ **Phase A 시작 전에 디자이너가 SVG 6개 납품**

---

## 7. 환경 변수

```
NEXT_PUBLIC_KAKAO_MAP_KEY=...
NEXT_PUBLIC_BASE_PATH=excer  (선택)
DATABASE_URL=...              (Neon)
BLOB_READ_WRITE_TOKEN=...     (Vercel Blob)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

> `vercel env pull` 로 로컬 동기화. acttub 조직의 다른 앱과 Clerk 키는 공유, DB·Blob 은 excer 전용.

---

## 8. "디자인 완료" 정의

다음을 만족하면 디자인은 핸드오프 끝, 엔지니어링이 단독으로 진행 가능:
- [x] 모든 MUST 화면의 모바일/데스크톱 와이어가 있다
- [x] 모든 핵심 상태(loading/empty/error)가 정의됐다
- [x] 모든 커스텀 컴포넌트의 색·크기·라디우스가 명시됐다
- [x] URL/상태/네비 패턴이 결정됐다
- [x] 접근성 사양이 부착됐다
- [x] 성능 가이드가 부착됐다
- [x] 자산 필요 목록이 명확하다
- [ ] **SVG 6개 커스텀 아이콘 납품** — 별도 트랙 (디자이너 작업)
- [ ] **로고·OG 이미지 납품** — 별도 트랙

> 위 2개는 코드 진입과 병렬로 진행 가능 — placeholder lucide 로 시작해도 됨.

---

## 9. PRD ↔ Stage 2 결정 사항 답변 (PRD §12)

| PRD Q | 답 | 근거 |
| --- | --- | --- |
| Q1 가격 필터 UI | **Slider + 양 끝 입력 box** | visual-spec §3.3, D2 |
| Q2 데스크톱 카드 밀도 | 썸네일 96×72, 카드 padding `p-3`, 카드 간 `gap-2` | visual-spec §4 |
| Q3 사진 저장 | **Vercel Blob 직 업로드** + URL 외부 참조도 허용 | handoff §6 |
| Q4 분석 이벤트 | 8개 정의 완료 | IA §8 |
| Q5 어드민 본격 진입 | POI 100개 도달 또는 운영자 2명 가입 시 | PRD §6 그대로 |
| Q6 신선도 배지 임계치 | **30 / 60 / 60+** | visual-spec §7.4, VS5 |

---

## 10. 열린 결정 (디자인이 못 정한 것 — 운영/엔지니어링 결정)

| 코드 | 항목 | 결정 주체 |
| --- | --- | --- |
| O1 | 카카오맵 라이선스 정확한 ToS 검토 (자체 DB 저장 한계) | 운영 |
| O2 | 시드 50개의 사진 출처/허가 워크플로우 | 운영 |
| O3 | 분석 이벤트 저장소 (Vercel Analytics vs GA4 vs 둘 다) | 엔지니어링 |
| O4 | ISR revalidate 주기 (1h vs on-demand only) | 엔지니어링 |
| O5 | 시드 입력 도구 — Drizzle Studio vs 간이 CSV 임포트 스크립트 | 엔지니어링 |
| O6 | 운영자 1명일 때 admin 라우트 노출 여부 | 운영 |

---

## 11. 다음 단계 후보

지금부터 갈 수 있는 길:

| 트랙 | 다음 액션 |
| --- | --- |
| 🛠 엔지니어링 | Phase A 시작 — `pnpm create next-app` + arch 설정 복사 |
| 🎨 시각 디자인 | 커스텀 SVG 아이콘 6개 + 로고 + OG 템플릿 |
| 📦 데이터 운영 | 카카오 디벨로퍼스 키 발급 + 시드 50개 큐레이션 시작 |
| 🧭 형제 앱 연동 | acttub 메인 도메인의 rewrite 추가 (`acttub.com/excer/*` → 새 Vercel 프로젝트) |

---

## 12. 부록 — Stage 0/1/2 산출물 인덱스
| 단계 | 파일 |
| --- | --- |
| 0.1 | `outputs/stage-0/raw-idea.md` |
| 0.2 | `outputs/stage-0/problem-statement.md` |
| 0.3 | `outputs/stage-0/solution-outline.md` |
| 0.4 | `outputs/stage-0/validation-report.md` |
| 0.5 | `outputs/stage-0/idea-brief.md` |
| 1.1 | `outputs/stage-1/feature-priority.md` |
| 1.2 | `outputs/stage-1/user-stories.md` |
| 1.3 | `outputs/stage-1/user-flow.md` |
| 1.4 | `outputs/stage-1/screen-structure.md` |
| 1.5 | `outputs/stage-1/prd.md` |
| 2.1 | `outputs/stage-2/design-system.md` |
| 2.2 | `outputs/stage-2/information-architecture.md` |
| 2.3 | `outputs/stage-2/wireframes.md` |
| 2.4 | `outputs/stage-2/visual-spec.md` |
| 2.5 | **`outputs/stage-2/design-handoff.md`** (이 문서) |

---

## 13. 변경 이력
| 날짜 | 버전 | 변경 |
| --- | --- | --- |
| 2026-05-20 | v1 | 최초 작성. Stage 2 통합. |
