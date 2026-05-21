# 연기 스타일 MBTI

연영과/배우를 위한 4축 16유형 위트 진단. 12~14문항, 2~3분.

## 스택

Vite 8 + React 19 + TypeScript 6 + react-router-dom 7 / lucide-react / html-to-image / react-helmet-async / Kakao JS SDK v2

> - 디자인 시스템: `outputs/stage-2/design-tokens.md`
> - 컴포넌트 명세: `outputs/stage-2/component-spec-web.md`
> - 데이터 모델: `outputs/stage-3/data-model.md`

## 로컬 실행

```bash
pnpm install
pnpm dev
# → http://localhost:5173
```

### 환경 변수

`.env.local` 작성 (`.env.example` 참고):

```env
VITE_KAKAO_APP_KEY=...   # https://developers.kakao.com 에서 발급
VITE_SITE_URL=https://acti.example.com
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # (선택) GA4 Measurement ID
```

키가 비어 있어도 앱은 동작합니다. 카톡 공유만 비활성됩니다.
GA Measurement ID가 비어 있으면 Google Analytics 스크립트도 로드하지 않습니다.

> **PIPA 동의 안내**: 현재 GA 활성화 시 동의 배너 없이 즉시 트래킹됩니다. 일반 사용자 대상 정식 런칭 전에는 동의 UI 또는 GA `consent mode` 도입을 고려하세요.

## 빌드 & 배포

```bash
pnpm build      # → dist/
pnpm preview    # 로컬에서 dist/ 미리보기 (모바일 실기 검증용)
```

### Vercel 배포

`vercel.json` 동봉. GitHub 연동만 하면 됩니다.

- Build Command: `pnpm build` (vercel.json 명시)
- Output: `dist`
- SPA Rewrites: 모든 경로 → `/index.html` (라우터용)
- 환경 변수: Vercel 대시보드에서 `VITE_KAKAO_APP_KEY`, `VITE_SITE_URL` 설정

### Netlify 배포

`public/_redirects` 동봉. 동일하게 자동 처리됩니다.

## 테스트

```bash
pnpm test          # 단발 실행
pnpm test:watch    # 와치 모드
```

- 점수 계산 / localStorage / 콘텐츠 invariant 31개 테스트
- `outputs/stage-3/test-report.md` 참고

## 디렉토리 구조

```
src/
  components/     # Badge, ChoiceCard, PrimaryButton, SecondaryButton,
                  # ProgressBar, CaptureCard, TypeCard, ShareActionButton, Toast
  pages/          # LandingPage, QuizPage, ResultPage, NotFoundPage
  content/        # questions, types, schema (정적 콘텐츠)
  lib/            # scoring, storage, share, kakao
  styles/
    globals.css   # 디자인 토큰 + 베이스 리셋
```

## 콘텐츠 폴리싱 (Phase 2)

현재 v0.1은 **임시 콘텐츠**입니다:

- 시나리오 문항 6개 (목표 12~14)
- 16유형 중 6개만 폴리싱 (나머지는 폴백 표시)

폴리싱 워크플로우:

1. AI 도구로 톤 가이드 + 4축 + 도메인 키워드 입력해 초안
2. 본인 폴리싱 (위트 일관성 5점 척도 자체 평가)
3. `src/content/questions.ts` 의 `QUESTIONS` 배열에 추가
4. `src/content/types.ts` 의 `POLISHED` 객체에 추가
5. `pnpm test` 로 invariant 통과 확인

## 16유형 OG 이미지 (Phase 2 후반)

`public/og/{CODE}.png` 16개 필요 (카톡/페북 공유 미리보기).

권장 크기: 1200×630 (OG 표준) 또는 800×800 (카톡 친화).

현재 미생성 상태. 카톡 공유 시 이미지 없이 텍스트만 노출됨.

## 알려진 제약 (v0.1)

- [ ] 콘텐츠 16유형 중 10개 폴백 — Phase 2
- [ ] OG 이미지 16개 미생성 — Phase 2
- [ ] OG 태그 클라이언트 측 주입 → 카톡 봇 미인식 (사전 정적 생성 필요)
- [ ] Kakao 앱 키 미설정 시 카톡 공유 비활성
- [ ] favicon 기본값

## 라이선스

(미정)
