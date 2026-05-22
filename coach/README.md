# coach

Gemini 기반 연기 연습 영상 피드백 MVP입니다. 저장 기능 없이 업로드 또는 브라우저 녹화 영상의 선택 구간을 분석하고, 부족한 부분/의도에 부합한 부분/연습 방식 추천을 보여줍니다.

## Local Development

루트에서 실행합니다.

```bash
corepack pnpm local:coach
```

앱은 `http://localhost:3004`에서 열립니다.

## Environment

실제 Gemini 분석 요청에는 환경변수가 필요합니다.

```bash
GEMINI_API_KEY=your_gemini_api_key
```

로컬에서는 `coach/.env.local`에 넣고, Vercel에서는 `acttub-coach` 프로젝트의 Environment Variables에 추가합니다. 키가 없어도 앱 빌드는 통과하지만 분석 요청은 오류를 반환합니다.

## Deployment

새 Vercel 프로젝트를 만들 때 설정합니다.

```txt
Project Name: acttub-coach
Root Directory: coach
Framework Preset: Next.js
Build Command: corepack pnpm build
Output Directory: 비워두기
```
