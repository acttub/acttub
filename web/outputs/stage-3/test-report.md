# Test Report — 연기 스타일 MBTI

> Stage 3.11 산출물 — Vitest 단위 테스트
> 작성일: 2026-05-15

## 1. 셋업

### 설치
```powershell
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/ui
```

| 패키지 | 버전 | 역할 |
|---|---|---|
| vitest | ^4.1.6 | 테스트 러너 |
| @testing-library/react | ^16.3.2 | React 컴포넌트 테스트 (현재 미사용, Phase 2 이후) |
| @testing-library/jest-dom | ^6.9.1 | 매처 확장 |
| jsdom | ^29.1.1 | 브라우저 환경 시뮬레이션 |
| @vitest/ui | ^4.1.6 | 브라우저 UI 옵션 (선택) |

### 설정 파일

`vite.config.ts`에 `test` 옵션 추가:
```ts
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: ['./src/test-setup.ts'],
  include: ['src/**/*.test.{ts,tsx}'],
}
```

`src/test-setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

### npm 스크립트
```json
"test":       "vitest run",
"test:watch": "vitest"
```

## 2. 테스트 파일

| 파일 | 테스트 수 | 범위 |
|---|---|---|
| `src/lib/scoring.test.ts` | 11 | 점수 누적 + tie-break 6규칙 + 결정성 + 16유형 매핑 |
| `src/lib/storage.test.ts` | 5 | localStorage round-trip + 잘못된 값 가드 |
| `src/content/content.test.ts` | 15 | 스키마/문항/유형 invariant |

## 3. 핵심 검증 항목

### 3.1 scoring
- 모든 축 우세 → 정확한 코드 (`MINB`, `TPAS`)
- 각 축 tie-break 6규칙 (M↔T → T, I↔P → P, N↔A → A, B↔S → S)
- 모든 축 동점 → `TPAS` (모든 tie-break 기본값)
- 결정성 (같은 입력 → 같은 출력)

### 3.2 storage
- 초기 null
- set → get round-trip
- clear 후 null
- 화이트리스트 밖 값 저장돼있으면 `null` (외부 변조 방어)
- 덮어쓰기 동작

### 3.3 content invariants
**Schema**
- `TYPE_CODES` 길이 = 16
- 모든 코드 정규식 `^[MT][IP][NA][BS]$` 매칭
- 중복 없음
- `isTypeCode` 화이트리스트 + 비문자열 가드

**Questions**
- 6~14 문항 범위
- 각 문항 정확히 4 선택지
- id 고유
- 모든 axis가 8극 union 내
- 시나리오·질문·라벨 비어있지 않음
- **8극이 전체 문항에 걸쳐 최소 1번씩 등장** (β 분포 균형 검증)

**Types**
- `getAllTypes()` = 16개
- 모든 rival/bff가 유효한 TypeCode
- index 0~15 범위
- traits/roles 비어있지 않음
- `getType(code).code === code` 라운드트립

## 4. 실행 결과

```
 RUN  v4.1.6 C:/dev/ACTI/app

 ✓ src/lib/scoring.test.ts (11 tests)
 ✓ src/lib/storage.test.ts (5 tests)
 ✓ src/content/content.test.ts (15 tests)

 Test Files  3 passed (3)
      Tests  31 passed (31)
   Duration  22.12s
```

**31/31 통과**, 실패 0, 스킵 0.

## 5. 의도적으로 안 한 것

| 항목 | 이유 |
|---|---|
| React 컴포넌트 렌더 테스트 | UI는 시각·인터랙션 중심 — 수동 검증이 더 효율적 (사이드 프로젝트 가치관) |
| E2E (Playwright/Cypress) | v1 범위 밖, 1인 사이드 작업 비용 ↑ |
| 시각 회귀 (Chromatic 등) | v1 범위 밖 |
| html-to-image 통합 테스트 | jsdom 한계 (실제 캡처는 수동 검증) |
| Kakao SDK 통합 테스트 | 외부 의존, mock 비용 ↑ — 수동 검증 |

## 6. 향후 추가 가능 (Phase 2)

- [ ] `getType('XXXX')` 호출 시 폴백 동작 정확성 (현재는 타입 시스템이 막음)
- [ ] 16유형 콘텐츠 폴리싱 후 "위트 톤 길이" 검증 (네이밍 ≤ 40자 등)
- [ ] OG 이미지 16개 정적 생성 후 파일 존재 검증
- [ ] 사슬 연장 시 무한 루프 없음 검증 (rival/bff이 자기 자신만 가리키는 경우)

## 7. 신뢰도 영역

| 영역 | 자동 테스트 | 비고 |
|---|---|---|
| 점수 계산 | ✅ 완전 | 16유형 모든 매핑 + tie-break 6종 |
| 영속화 | ✅ 완전 | 변조 방어 포함 |
| 콘텐츠 정합성 | ✅ 강함 | β 분포 검증까지 |
| UI 컴포넌트 | ⚠ 수동 | 브라우저 시연 + 빌드 통과만 |
| 공유 액션 | ⚠ 수동 | iOS Safari + Android Chrome 실기 |
| OG 카드 | ⚠ Phase 2 | 사전 생성 작업 후 |

## 🎯 Step 3.12 (Build Ready)로 넘기는 것

배포 준비:
1. **Vercel SPA rewrites** — `vercel.json` 또는 `_redirects` (모든 경로 → `index.html`)
2. **환경 변수 가이드** — `.env.local` 템플릿 (`VITE_KAKAO_APP_KEY`, `VITE_SITE_URL`)
3. **빌드 검증 명령** — `pnpm build` + `pnpm preview` 절차
4. **OG 사전 정적 생성 옵션** — 16유형 결과 페이지 빌드 시점 prerender (옵션 안내)
5. **README** — 로컬 실행 / 배포 / 콘텐츠 폴리싱 안내
6. **lint 통과 확인** — `pnpm lint`
