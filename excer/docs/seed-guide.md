# 시드 데이터 큐레이션 가이드

운영자가 Google Sheets 에서 연습실 데이터를 모은 뒤 CSV 로 일괄 import 하는 워크플로우.

---

## 1. Google Sheets 템플릿 만들기

새 Google Sheets 만들고 **첫 행에 다음 21개 컬럼 헤더** 정확히 그대로 붙여넣기:

```
slug	name	region	subway	lat	lng	price_hour	price_note	open_time	close_time	days	phone	booking_url	photos	mirror	soundproof	size_pyeong	lighting	scriptstand	microphone	active
```

> 💡 위 줄을 그대로 복사 → Sheets 의 A1 셀에 붙여넣기 하면 자동으로 21개 컬럼에 분배됩니다.

또는 이 레포의 `scripts/seed-rooms.example.csv` 를 다운받아 Google Sheets 에서 열기 → 그대로 운영용 시트로.

---

## 2. 각 컬럼 입력 규칙

| 컬럼 | 타입 | 예시 | 필수 | 비고 |
| --- | --- | --- | :-: | --- |
| `slug` | string | `hyehwa-coral-studio` | ✅ | 영문 kebab-case. 고유. URL 의 일부 |
| `name` | string | `혜화 코랄 스튜디오` | ✅ | 한국어 자유 |
| `region` | string | `종로구 동숭동` | ✅ | "구 동" 형태 권장 |
| `subway` | string | `혜화역;동대문역` | ⚪ | 여러 역은 `;` 로 구분 |
| `lat` | number | `37.5826` | ✅ | 카카오맵에서 우클릭 → 좌표 복사 |
| `lng` | number | `127.0019` | ✅ | 동일 |
| `price_hour` | int | `15000` | ✅ | 시간당 원 단위 |
| `price_note` | string | `협의 가능` | ⚪ | 가격이 변동되거나 협의일 때 |
| `open_time` | HH:MM | `09:00` | ✅ | 24시간제 |
| `close_time` | HH:MM | `24:00` | ✅ | 24:00 = 자정, 02:00 = 새벽 2시 |
| `days` | int list | `0,1,2,3,4,5,6` | ✅ | 0=일 ~ 6=토. 주중만이면 `1,2,3,4,5` |
| `phone` | string | `02-000-0001` | ✅ | 하이픈 포함 권장 |
| `booking_url` | URL | `https://...` | ⚪ | 외부 예약 페이지 |
| `photos` | URL list | `url1;url2` | ⚪ | 여러 사진은 `;` 로. 우선 비워두고 나중에 채워도 됨 |
| `mirror` | bool | `true` / `false` | ⚪ | 거울 있음 여부 |
| `soundproof` | enum | `strong`/`medium`/`weak` | ⚪ | 방음 등급, 기본 `medium` |
| `size_pyeong` | int | `15` | ✅ | 평수 |
| `lighting` | enum | `bright`/`normal`/`dim`/`none` | ⚪ | 조명, 기본 `normal` |
| `scriptstand` | bool | `true` / `false` | ⚪ | 대본대 |
| `microphone` | bool | `true` / `false` | ⚪ | 마이크 |
| `active` | bool | `true` / `false` | ⚪ | 비공개 처리하려면 `false`. 기본 `true` |

### slug 만들기 팁
- 영문만, 단어 사이는 하이픈, 공백 없음
- 예: `홍대 미러룸` → `hongdae-mirror-room`
- 같은 slug 가 이미 DB 에 있으면 그 행을 **업데이트** (충돌 X)

### 좌표 빨리 찾기
1. https://map.kakao.com 에서 연습실 검색
2. 핀 우클릭 → "좌표 복사" 또는 "거리뷰" 가 뜨는 곳
3. 또는 https://map.kakao.com/?map_type=TYPE_MAP 에서 한 번 클릭하면 URL 에 좌표 노출

---

## 3. CSV 내보내기

Google Sheets 메뉴:
- **파일 → 다운로드 → 쉼표로 구분된 값(.csv)**

이 레포에 저장:
```
scripts/seed-rooms.csv
```

> ⚠️ `seed-rooms.example.csv` 와 헷갈리지 마세요. example 은 샘플, **실제 운영 파일은 `seed-rooms.csv`** (gitignore 권장).

---

## 4. import 실행

먼저 `.env.local` 에 `DATABASE_URL` 이 설정되어 있어야 함.

```bash
pnpm seed:csv
# 또는 다른 경로:
pnpm seed:csv path/to/custom.csv
```

성공 시:
```
Reading scripts/seed-rooms.csv
Parsed 50 rows
  ✓ hyehwa-coral-studio
  ✓ daehakro-script-lab
  ...
Upserted: 50  |  Skipped: 0  |  Failed: 0
```

같은 CSV 를 다시 돌리면 — slug 가 같은 행은 **업데이트** 됩니다 (중복 생성 X). 그래서 안전하게 여러 번 돌릴 수 있어요.

---

## 5. 운영 사이클 (월 1회)

PRD 가드레일대로 매월 1회 확인 사이클:

1. Google Sheets 에서 가격·운영시간 변동 사항 점검 (해당 연습실에 전화 또는 인스타 확인)
2. 변경된 행만 수정 + 모든 활성 행의 `verified_at` 열... 은 CSV 에 없음.

**`verified_at` 갱신은 별도로:**

```bash
# CSV import 한 직후엔 자동으로 갱신됨 (updatedAt = now)
# 따로 "오늘 확인했음" 만 찍으려면 Drizzle Studio 에서 manual
pnpm db:studio
```

자세한 자동화는 추후 admin UI 트랙에서.

---

## 6. 출시 가드레일 재확인

- ✅ 시드 **50개 이상** 확보 전 출시 금지 (PRD M7)
- ✅ 모든 시드의 `mirror`, `soundproof`, `size_pyeong` 정규화 입력 완료 (차별점)
- ✅ 모든 시드의 가격 정확성 운영자 직접 확인
- ✅ 출시 시점 기준 80% 이상이 verified_at 30일 이내

---

## 7. 자주 묻는 에러

| 에러 | 원인 | 해결 |
| --- | --- | --- |
| `Row 3: missing lat` | 좌표 입력 누락 | 카카오맵에서 좌표 복사 |
| `duplicate key value violates unique constraint "rooms_slug_unique"` | 트랜잭션 충돌 (거의 안 남) | 다시 실행 — upsert 가 처리함 |
| `invalid input syntax for type integer` | `price_hour` 같은 숫자 컬럼에 글자 들어감 | Sheets 의 셀 서식 → 숫자 |
| `cannot resolve` 또는 import 실패 | `tsx` 미설치 | `pnpm install` 다시 |
