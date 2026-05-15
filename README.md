# ACTI — 연기 스타일 MBTI

연영과/배우를 위한 4축 16유형 위트 진단. 12~14문항, 2~3분.

> **한 줄 정의**: 단톡방·SNS에서 깔깔거릴 수 있는 연기 정체성 놀이거리.

## 구성

이 레포는 **워크플로우 문서 산출물**과 **실제 앱 코드**를 함께 보관합니다.

```
ACTI/
├── outputs/        # Stage 0 ~ Stage 3 워크플로우 산출물
│   ├── stage-0/    # 아이디어 고도화 (raw idea → idea brief)
│   ├── stage-1/    # 제품 기획 (PRD)
│   ├── stage-2/    # 디자인 (토큰·컴포넌트·프로토타입)
│   └── stage-3/    # 개발 (브릿지·구현·테스트·빌드)
└── app/            # 실제 동작하는 Vite + React + TS 앱
```

## 빠르게 돌려보기

```bash
cd app
pnpm install
pnpm dev
# → http://localhost:5173
```

세부 셋업·배포·콘텐츠 폴리싱 가이드는 [`app/README.md`](app/README.md) 참고.

## 워크플로우 산출물 인덱스

| Stage | 핵심 산출물 |
|---|---|
| 0 | [`outputs/stage-0/idea-brief.md`](outputs/stage-0/idea-brief.md) |
| 1 | [`outputs/stage-1/prd.md`](outputs/stage-1/prd.md) |
| 2 | [`outputs/stage-2/design-spec-web.md`](outputs/stage-2/design-spec-web.md), [`outputs/stage-2/prototype-web.html`](outputs/stage-2/prototype-web.html) |
| 3 | [`outputs/stage-3/ui-impl.md`](outputs/stage-3/ui-impl.md), [`outputs/stage-3/test-report.md`](outputs/stage-3/test-report.md) |

## 스택

Vite 8 + React 19 + TypeScript 6 + react-router-dom 7 / lucide-react / html-to-image / react-helmet-async / Kakao JS SDK v2.

정적 SPA. DB·서버·인증 없음. Vercel/Netlify 무료 호스팅.

## 현재 상태 (v0.1)

- [x] 14문항 시나리오 + 16유형 콘텐츠 풀세트 (1차 폴리싱)
- [x] 8개 공통 컴포넌트 + 4 페이지 (S1 랜딩 / S2 풀이 / S3 결과 / S4 404)
- [x] 점수 계산 / localStorage / 공유 / 카카오 SDK 래퍼
- [x] 34 단위 테스트 통과
- [x] 번들 ≤ 100 KB gzip
- [ ] 본인 톤 폴리싱 (5점 척도 자체 평가)
- [ ] OG 이미지 16개 사전 생성
- [ ] Kakao 앱 키 발급 + 도메인 연결
- [ ] β 테스트 (학과 친구 10명, 유형 분포 검증)

## 라이선스

(미정)
