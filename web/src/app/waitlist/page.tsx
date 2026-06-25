import WaitlistPage from '../../views/WaitlistPage';

export const metadata = {
  title: '테스트 오픈 알림 받기 · acttub',
  description:
    'Acttub는 AI가 질문을 던지며 인물의 목적, 감정, 관계, 서브텍스트를 함께 정리해가는 연기 준비 도구입니다. 이메일을 남기면 테스트 오픈 시 가장 먼저 안내드려요.',
};

export default function Page() {
  return <WaitlistPage />;
}
