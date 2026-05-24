import TheaPage from '../../../views/TheaPage';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'thea - 취향 기반 연극 추천',
  description: '관람 취향을 입력하면 지금 보기 좋은 연극을 추천하는 acttub의 연극 큐레이션 서비스입니다.',
  openGraph: {
    title: 'thea - 취향 기반 연극 추천',
    description: '관람 취향을 입력하면 지금 보기 좋은 연극을 추천하는 acttub의 연극 큐레이션 서비스입니다.',
  },
};

export default function Page() {
  return <TheaPage />;
}
