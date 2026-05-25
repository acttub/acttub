# Build Config — 연기 스타일 MBTI

> Stage 3.12 산출물 — 배포 준비
> 작성일: 2026-05-15

## 1. 생성된 배포 파일

| 파일 | 역할 |
|---|---|
| `app/vercel.json` | Vercel SPA rewrites + assets/og 캐시 헤더 |
| `app/public/_redirects` | Netlify SPA rewrites 폴백 |
| `app/.env.example` | 환경 변수 템플릿 (Kakao 키, 사이트 URL) |
| `app/.gitignore` | secrets 제외 강화 + dist + coverage |
| `app/README.md` | 로컬 실행 / 배포 / 콘텐츠 폴리싱 가이드 |
| `package.json` 스크립트 | `test`, `test:watch` 추가됨 |

## 2. Vercel rewrites (`vercel.json`)

```json
{
  "framework": "vite",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    { "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/og/(.*)",     "headers": [{ "key": "Cache-Control", "value": "public, max-age=86400" }] }
  ]
}
```

- 모든 경로 → `/index.html` (react-router-dom SPA 동작 보장)
- assets는 1년 immutable 캐시 (Vite hash 파일명)
- og 이미지는 1일 캐시 (Phase 2에서 교체될 수 있음)

## 3. Netlify (또는 정적 서버 폴백)

`public/_redirects` 한 줄:
```
/*  /index.html  200
```

→ 빌드 시 `dist/_redirects` 로 그대로 복사됨. 다른 정적 호스팅(Cloudflare Pages, GitHub Pages 등)에서도 비슷한 폴백 필요.

## 4. 환경 변수

`.env.example`:
```env
VITE_KAKAO_APP_KEY=
VITE_SITE_URL=
```

| 변수 | 미설정 시 동작 | 어디서? |
|---|---|---|
| `VITE_KAKAO_APP_KEY` | 카톡 공유 버튼 → console.warn, no-op | https://developers.kakao.com → 앱 등록 → JavaScript 키 |
| `VITE_SITE_URL` | `window.location.origin` 사용 (개발에선 OK, 배포에선 절대 URL 권장) | Vercel 배포 도메인 |

→ Vercel 대시보드의 **Settings → Environment Variables**에 두 키 입력.

## 5. 최종 빌드 검증

```bash
pnpm build
```

```
✓ 1785 modules transformed.
dist/index.html                    1.06 kB │ gzip:  0.61 kB
dist/assets/index-{hash}.css      19.31 kB │ gzip:  4.27 kB
dist/assets/index-{hash}.js      287.56 kB │ gzip: 94.77 kB
```

| 항목 | 결과 | 목표 |
|---|---|---|
| JS gzip | 94.77 KB | ≤ 100 KB ✅ |
| CSS gzip | 4.27 KB | — ✅ |
| index.html | 0.61 KB | — ✅ |
| 빌드 시간 (cold cache) | ~100s | — |
| 빌드 시간 (warm) | 2.7s | — |
| TS 에러 | 0 | 0 ✅ |
| 테스트 | 31/31 통과 | 모두 통과 ✅ |

## 6. 로컬 미리보기 (모바일 실기 검증용)

```bash
pnpm preview
# → http://localhost:4173
```

같은 LAN의 모바일에서 접속하려면:
```bash
pnpm preview --host
# → http://{내LAN IP}:4173 로 모바일에서 접속
```

**실기 검증 체크 항목** (iOS Safari / Android Chrome):
- [ ] 360px 폭에서 가로 스크롤 없음
- [ ] 시작 CTA 터치 영역 OK
- [ ] 6문항 자동 진행
- [ ] 결과 페이지 캡처 영역 1뷰포트 안
- [ ] 이미지 저장 정상 동작 (갤러리 저장 확인)
- [ ] 링크 복사 → Toast 노출
- [ ] 카톡 공유 (앱 키 설정 후) — 미리보기 카드
- [ ] 천적/베프 카드 → 다른 유형 결과지
- [ ] 시크릿 창 결과 URL → S3' 수신자 모드

## 7. 알려진 Phase 2 후속 작업

| # | 작업 | 우선순위 |
|---|---|---|
| 1 | 시나리오 12~14문항 폴리싱 | 🔴 |
| 2 | 16유형 콘텐츠 폴리싱 | 🔴 |
| 3 | OG 이미지 16개 사전 생성 | 🟠 |
| 4 | 결과 페이지 16개 사전 정적 HTML 생성 (`vite-plugin-prerender` 또는 수작업 후처리) | 🟠 (카톡 봇 OG 인식용) |
| 5 | Kakao 앱 키 발급 + .env.local 설정 | 🟠 |
| 6 | favicon 교체 | 🟡 |
| 7 | 도메인 연결 (acti.example.com 또는 acti.kr 등) | 🟡 |

## 8. 트러블슈팅 노트

### "pnpm build가 1분 넘게 걸려요"
- cold cache 시 정상 (rolldown 새로 transform). warm cache 시 2~3초.
- Vercel은 캐시 자동 사용 — 첫 빌드 외에는 빠름.

### "카톡 공유가 작동 안 해요"
1. `.env.local` 의 `VITE_KAKAO_APP_KEY` 확인
2. 개발자센터 도메인 등록 확인 (Vercel 배포 도메인 추가)
3. console에 `Kakao SDK not ready` 가 뜨면 SDK 미로드 — `index.html` 의 외부 스크립트 차단 확인

### "결과 URL 직접 접속 시 404"
- Vercel/Netlify SPA rewrites 미적용 → `vercel.json` / `_redirects` 배포 확인

### "이미지 저장이 iOS Safari에서 안 됨"
- html-to-image가 외부 CDN 폰트 캡처 시 CORS로 실패할 수 있음
- 대응: 캡처 영역 폰트를 시스템 폰트로 fallback 또는 폰트 self-host

## 🎯 Step 3.13로 넘기는 것

Docker는 본 프로젝트(정적 SPA + Vercel/Netlify 배포)에 **불필요**.

- 정적 dist/ 만으로 Vercel/Netlify 무료 호스팅 가능
- 컨테이너화는 백엔드/DB가 있을 때 의미가 큼
- v1에선 Docker 스킵 권장

→ Stage 3 사실상 완료. Step 3.13은 선택 사항으로 처리.
