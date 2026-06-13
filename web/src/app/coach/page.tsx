import CoachPage from '../../views/CoachPage';

export const metadata = {
  title: 'acttub coach',
  description: '연기 영상을 기준으로 연습 피드백을 받는 acttub coach',
};

// acttub.com/coach 메인을 v2 파이프라인으로 전환(2026-06-13) — 화면 동일, 분석 API만 v2.
// 롤백: analyzeUrl prop 제거 시 v1(/api/coach/analyze)로 복귀.
export default function Page() {
  return <CoachPage analyzeUrl="/api/coach-second/analyze" />;
}
