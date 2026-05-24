import CommunityPage from '../../../views/CommunityPage';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: '게시판 검색 - acttub',
  description: 'acttub 게시판 검색',
};

export default async function Page({ searchParams }: PageProps) {
  return <CommunityPage view="search" searchParams={(await searchParams) ?? {}} />;
}
