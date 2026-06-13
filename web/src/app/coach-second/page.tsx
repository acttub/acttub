import CoachPage from '../../views/CoachPage';

export const metadata = {
  title: 'acttub coach 2',
  description: '요소 분해 v2 파이프라인으로 연습 피드백을 받는 acttub coach 2',
};

// v2 전량 정량화 파이프라인(coach-second). 화면은 /coach와 동일, 분석 API만 다르다.
export default function Page() {
  return <CoachPage analyzeUrl="/api/coach-second/analyze" badge="coach 2" />;
}
