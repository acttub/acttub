import ExcerPage from '../../views/ExcerPage';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'excer - 연습실 찾기',
  description: '연기 연습실을 지도와 조건 필터로 빠르게 찾는 acttub의 연습실 탐색 서비스입니다.',
};

export default async function Page({ searchParams }: PageProps) {
  return <ExcerPage searchParams={(await searchParams) ?? {}} />;
}
