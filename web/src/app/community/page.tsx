import CommunityPage from '../../views/CommunityPage';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'acttub 게시판',
  description: '배우들이 이야기 나누는 곳',
};

export default async function Page({ searchParams }: PageProps) {
  return <CommunityPage searchParams={(await searchParams) ?? {}} />;
}
