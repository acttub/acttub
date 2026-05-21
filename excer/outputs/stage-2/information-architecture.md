# Information Architecture — excer

> Stage 2.2 산출물. 라우트·URL·상태·네비·SEO.

---

## 1. 사이트맵

```
acttub.com/excer                        ← 홈 (지도 + 발견)
  │
  ├─ /excer/rooms/[slug]                ← 연습실 상세
  │
  ├─ /excer/admin                       ← 운영자 관리 (선택, Clerk role=admin)
  │     ├─ /excer/admin/rooms           ← 목록
  │     ├─ /excer/admin/rooms/new       ← 신규 등록
  │     └─ /excer/admin/rooms/[id]/edit ← 수정
  │
  └─ /excer/not-found                   ← 404
```

> Next 16 App Router 기준. `basePath: '/excer'` 가 next.config.ts 에 하드코딩 — arch/comm 패턴.

---

## 2. URL 설계

### 2.1 홈 — 모든 발견 상태가 URL 에 산다

```
/excer/?q={검색어}&center={lat,lng}&zoom={z}
       &mirror={1|0}
       &soundproof={strong|medium|weak}
       &size={s|m|l}            (s=10평이하 / m=10~20 / l=20+)
       &price_max={원}
       &sort={near|price}
```

#### 예시
```
/excer/?q=혜화&zoom=14&mirror=1&soundproof=strong&price_max=15000&sort=price
```

#### 규칙
- **모든 필터·검색·정렬·지도 위치는 쿼리 파라미터로** — 공유 링크 = 같은 상태 복원
- 빈 값/기본값은 URL 에서 생략 (URL 짧게 유지)
- 클라이언트 라우터는 `replaceState` 사용 (필터 조작 시 히스토리 폭주 방지). 단, **검색 입력 확정**과 **핀/카드 클릭**은 `pushState` 로 뒤로가기 의미 부여.

### 2.2 상세

```
/excer/rooms/[slug]
```

- slug = `{지역}-{이름}-{nanoid6}` 형태 예: `hyehwa-acting-studio-a1b2c3`
- 별도 쿼리 없음 — 정적 페이지처럼 취급
- **referrer 가 홈일 때만 뒤로가기에 "방금 본 곳" 강조** (브라우저 history 의존)

### 2.3 관리자

```
/excer/admin/rooms?q=&page=&filter=
```

- 페이지네이션은 쿼리로
- 폼은 server actions

---

## 3. 상태 관리 원칙

| 상태 종류 | 어디에 산다 | 이유 |
| --- | --- | --- |
| 검색/필터/정렬 | **URL 쿼리** | 공유 가능, 새로고침 생존, SSR 가능 |
| 지도 중심·줌 | URL 쿼리 (디바운스) | 동일 상태 재현 |
| 선택된 핀 | URL 해시 또는 사이드 패널 ID 쿼리 | 라우터 부담 최소 |
| 사진 캐러셀 인덱스 | 컴포넌트 로컬 | 라우터 부담 의미 없음 |
| 사용자 위치 | 브라우저 메모리 | persistence 안 함 (개인정보) |
| Clerk 세션 | Clerk 처리 | 우리 코드 X |

**클라이언트 라이브러리**: URL 쿼리 직접 조작 + Next 의 `useSearchParams`. 별도 zustand/jotai 도입 안 함 (오버킬).

---

## 4. 네비게이션 패턴

### 4.1 모바일 (< 1024px)
- **상단**: 고정 헤더 — 로고, 필터 아이콘
- **메인**: 지도 풀스크린, 하단에 드래그 가능 시트로 리스트
- **상세 진입 시**: 풀스크린 페이지 전환, 좌상단 뒤로가기 아이콘
- 하단 탭 네비게이션 **없음** — 화면이 2개라 필요 없음

### 4.2 데스크톱 (≥ 1024px)
- **상단**: 동일 헤더 + 검색바를 가운데로 끌어올림
- **메인**: 좌측 지도(65%) + 우측 리스트(35%)
- **상세 진입 시**: 같은 페이지 전환 (모달 아님)
- 브레드크럼: `홈 / 연습실 이름`

### 4.3 acttub 생태계 진입/이탈
- **헤더 우측에 "acttub" 텍스트 로고** → `acttub.com/` 로 이동 (외부 링크)
- 다른 형제 앱(arch/comm/thea) 으로의 메뉴는 **MVP 에선 없음** — 사용자 인지 부담. acttub 메인 도메인에서만 분기.

---

## 5. 메타데이터 & SEO (NFR-05)

### 5.1 홈
```
title: "excer — 배우를 위한 연습실 지도 | acttub"
description: "서울 안 배우가 거울·방음·평수·시간당 가격으로 연습실을 찾고 비교할 수 있는 지도."
openGraph: og:type=website, og:image=/excer/og/home.png
```

### 5.2 상세 (`/rooms/[slug]`)
```
title: "{room.name} | excer"
description: "{room.region} · {room.size_pyeong}평 · ₩{room.price_hour}/h · 거울 {O|X}"
openGraph: og:type=article, og:image=room.photos[0]
```

- **SSR/SSG** 로 메타 노출 (네이버·구글 외부 검색 유입 가능성)
- JSON-LD 구조화 데이터: `LocalBusiness` 타입 + `geo` (lat/lng) — 지도 검색 노출에 유리할 수 있음

### 5.3 sitemap.xml
- 모든 active room 의 `/rooms/[slug]` 자동 생성 (Next 의 `sitemap.ts`)
- 우선순위: 홈 1.0, 상세 0.7
- `lastmod`: `verified_at` 사용

### 5.4 robots.txt
- 전 페이지 allow
- `/excer/admin/*` disallow

---

## 6. 라우팅 시 인증·권한 매트릭스

| 라우트 | 비로그인 | 로그인 (일반) | admin |
| --- | --- | --- | --- |
| `/excer/` | ✅ | ✅ | ✅ |
| `/excer/rooms/[slug]` | ✅ | ✅ | ✅ |
| `/excer/admin/**` | 🚫 → Clerk 로그인 | 🚫 → 403 | ✅ |

- Clerk `proxy.ts` (Next 16 미들웨어) 에서 `/admin/*` 만 보호
- 일반 사용자가 admin 진입 시도하면 `/excer/?error=forbidden` 으로 리다이렉트 + Sonner 토스트

---

## 7. 404 와 에러 처리

| 케이스 | 처리 |
| --- | --- |
| `/rooms/[slug]` 존재 안 함 | Next `notFound()` → 커스텀 404 페이지 |
| 잘못된 쿼리 (예: `zoom=abc`) | 무시하고 기본값 사용 (서버에서 zod parse) |
| 카카오맵 SDK 로드 실패 | 인라인 에러 + "다시 시도" + 리스트 fallback |
| 위치 권한 거부 | 서울 시청 좌표로 fallback (B1) |

---

## 8. 분석 이벤트 (PRD Q4 답 — 최소 셋트)

GA4 또는 Vercel Analytics + 커스텀 이벤트:

| 이벤트명 | 트리거 | 속성 |
| --- | --- | --- |
| `excer_view_home` | 홈 진입 | referrer, query 존재 여부 |
| `excer_search` | 검색 확정 | q, 결과 수 |
| `excer_filter_apply` | 필터 변경 (디바운스) | 적용된 필터 키들 |
| `excer_pin_click` | 지도 핀 클릭 | room_slug |
| `excer_card_click` | 리스트 카드 클릭 | room_slug, position |
| `excer_view_room` | 상세 진입 | room_slug, source(pin/card/direct) |
| `excer_cta_call` | 전화 CTA 클릭 | room_slug |
| `excer_cta_book` | 외부 예약 CTA 클릭 | room_slug, target_domain |

---

## 9. 페이지 간 흐름 (라우터 관점)

```
              /excer/?q=혜화&filter=...
              │
   ┌──────────┴──────────┐
   ▼                     ▼
[/rooms/abc]    [/rooms/xyz]
   │                     │
   ▼                     ▼
외부(tel: / 예약)    외부(tel: / 예약)

   뒤로가기 → 같은 쿼리 상태의 홈으로 복귀
```

뒤로가기가 같은 필터 상태로 돌아오는 것이 UX 핵심 — 모든 발견 상태가 URL 에 있는 이유.

---

## 10. 결정 사항 요약
- **URL 이 단일 진실의 원천** (필터/검색/정렬/지도위치)
- 모바일은 풀스크린 전환, 데스크톱은 좌우 패널
- 하단 탭 네비 없음 (화면 2개)
- 형제 앱 메뉴 없음 (acttub 메인 도메인에서만 분기)
- admin 만 인증 보호, 나머지 비로그인 가능
- SSR/SSG + sitemap + JSON-LD 로 검색 노출 준비
