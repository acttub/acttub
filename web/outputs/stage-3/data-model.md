# Data Model — 연기 스타일 MBTI (정적 콘텐츠 스키마)

> Stage 3.6 산출물 — 정적 콘텐츠 스키마 (DB 대체)
> 작성일: 2026-05-14

## 1. 이 단계의 변형 사유

본 프로젝트는 PRD 9.4 기준으로 **DB 없음 / 서버 없음 / 정적 SPA**. 일반 /develop의 "Data Modeling"은 DB 스키마를 의미하지만, 여기서는 **빌드 시점 고정 정적 콘텐츠의 TypeScript 스키마**로 변형해 진행한다.

→ Step 3.4 DB Setup, 3.5 ORM Setup, 3.7 API Design, 3.8 Auth는 본 프로젝트에서 스킵.

## 2. 생성된 파일

| 파일 | 내용 |
|---|---|
| `src/content/schema.ts` | 타입 정의 (`Axis`, `TypeCode`, `Question`, `Choice`, `TypeContent`) + 화이트리스트/가드 |
| `src/content/questions.ts` | Phase 1 임시 문항 6개 (Phase 2에서 12~14개로 확장) |
| `src/content/types.ts` | Phase 1 폴리싱된 6유형 + 폴백 함수 (Phase 2에서 16개 완성) |

## 3. 핵심 타입 정의

### 3.1 4축 / 8극

```ts
export type Axis =
  | 'M' | 'T'   // 접근 철학: 메소드 ↔ 테크닉
  | 'I' | 'P'   // 현장 운영: 즉흥 ↔ 설계
  | 'N' | 'A'   // 준비 사고법: 직관 ↔ 분석
  | 'B' | 'S'; // 표현 통로: 신체 ↔ 내면
```

### 3.2 유형 코드 (16개 화이트리스트 + 런타임 가드)

```ts
export const TYPE_CODES = [
  'MINB', 'MIAS', 'MPNB', 'MPAS',
  'TINB', 'TIAS', 'TPNB', 'TPAS',
  'MINS', 'MIAB', 'MPNS', 'MPAB',
  'TINS', 'TIAB', 'TPNS', 'TPAB',
] as const;

export type TypeCode = (typeof TYPE_CODES)[number];
export type TypeIndex = 0|1|2|...|15;

export function isTypeCode(value: unknown): value is TypeCode { ... }
```

- 컴파일 타임: `TypeCode`는 16개 리터럴 union — 잘못된 코드 사용 시 TS 에러
- 런타임: `isTypeCode()` 가드로 URL 파라미터 검증 (S4 404 분기)

### 3.3 Question / Choice

```ts
export type Choice = {
  label: string;     // 선택지 카피
  axis: Axis;        // 4축 중 한 극에 대응
  iconName: string;  // Lucide 아이콘 이름
};

export type Question = {
  id: number;
  scenario: string;
  question: string;
  choices: [Choice, Choice, Choice, Choice];  // 정확히 4개 (튜플 타입)
};
```

- `choices` 가 튜플(4-요소)이라 3개·5개 작성 시 TS 에러
- `axis` 가 `Axis` union이라 잘못된 극(예: 'X') 작성 시 TS 에러

### 3.4 TypeContent

```ts
export type TypeContent = {
  code: TypeCode;
  index: TypeIndex;
  name: string;        // 위트 네이밍
  tagline: string;     // 캐치프레이즈
  traits: string[];    // 캐릭터 묘사 3~4줄
  roles: string[];     // 어울리는 역할/장르 3~4개
  rival: TypeCode;     // 천적 (자기 자신 가능 — 폴백용)
  bff: TypeCode;       // 베프
};
```

- `rival`/`bff`도 `TypeCode` 타입 — 잘못된 코드 매핑 방지

## 4. 임시 데이터 현황

### 문항 (questions.ts)
- 6개 작성됨 (Phase 1 골격 검증용)
- 4축 모두 커버: philosophy (Q1·Q6), operation (Q3), preparation (Q4), expression (Q5), 복합 (Q2)
- Phase 2에서 12~14개로 확장 + 위트 톤 폴리싱

### 16유형 (types.ts)
- 폴리싱 완료 6개: **MINB, MIAS, TPAS, TPAB, MINS, TINB**
  → 한 유형 결과 페이지 → 천적/베프 사슬 시연이 막히지 않는 최소 집합
- 나머지 10개는 `fallbackType()` 함수로 폴백 ("콘텐츠 준비 중" 표시)
- Phase 2에서 16개 모두 폴리싱

### `getType(code)` 동작
- 폴리싱 데이터 있으면 그대로 반환
- 없으면 폴백 (코드+"준비 중" 표시 + 자기 자신을 천적/베프로)

## 5. 정합성 검증

```powershell
pnpm exec tsc -b
# → 에러 0 (콘텐츠 + 스키마 + 페이지 컴파일 통과)
```

타입 안전성 항목:
- [x] 16개 코드 화이트리스트 (잘못된 코드 컴파일 에러)
- [x] choices 튜플 길이 4 (3개·5개 컴파일 에러)
- [x] axis 8극 union (잘못된 극 컴파일 에러)
- [x] rival/bff 도 TypeCode (자유 문자열 금지)
- [x] 런타임 가드 `isTypeCode()` 로 URL 파라미터 검증

## 6. localStorage 스키마 (UI 상태)

서버 DB는 없지만 클라이언트 영속 상태가 1개 있음:

| 키 | 타입 | 의미 |
|---|---|---|
| `myTypeCode` | `TypeCode \| null` | 본인 결과 코드. 다시 풀기 시 갱신 |

→ `src/lib/storage.ts` 에서 래퍼 작성 (Step 3.9).

## 7. 콘텐츠 작성 워크플로우 (Phase 2)

PRD 13.1 의 "AI 초안 → 본인 폴리싱" 정책 그대로:

1. AI에 톤 가이드 + 4축 매핑 + 예시 3유형 입력
2. 16유형 초안 받음
3. 본인이 한 유형씩 폴리싱 (위트 톤 일관성 5점 척도 자체 평가)
4. `src/content/types.ts` 의 `POLISHED` 객체에 추가
5. 통과 못한 유형은 폴백으로 표시되어 UI는 깨지지 않음

문항도 동일:
1. AI에 4축 + 도메인 키워드(리허설/캐스팅/대본 등) 입력
2. 시나리오 12~14개 초안
3. 본인 폴리싱
4. `QUESTIONS` 배열에 추가

## 8. 추후 검증 자동화 (Step 3.11 후보)

Vitest로 다음 invariant 자동 검증 가능:

- [ ] `QUESTIONS.length` 는 8~16 사이
- [ ] 모든 문항의 4 choices가 4개의 서로 다른 axis를 가짐 (또는 의도된 분포)
- [ ] 모든 폴리싱된 TypeContent의 `rival`/`bff` 가 유효한 TypeCode
- [ ] `POLISHED` 키가 `TYPE_CODES` 부분집합
- [ ] 각 4축에 대해 8극 모두 최소 1개 이상의 문항·선택지에서 등장

→ Step 3.11에서 위 테스트 추가.

## 🎯 Step 3.9 (Core Features)로 넘기는 것

콘텐츠와 스키마가 준비됐으므로 핵심 비즈니스 로직 구현:

1. `src/lib/scoring.ts`
   - 답안 배열 → 4축 점수 → 4글자 TypeCode 변환
   - tie-break 규칙 명시 (동점 시 어느 극으로?)
2. `src/lib/storage.ts`
   - localStorage `myTypeCode` 읽기/쓰기/지우기
3. `src/lib/share.ts`
   - 이미지 캡처 (html-to-image)
   - URL 복사 (clipboard)
4. `src/lib/kakao.ts`
   - SDK 초기화 + sendDefault 래퍼

위 4개 모듈은 UI(Step 3.10)에서 호출됨.
