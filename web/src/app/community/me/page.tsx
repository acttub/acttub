import CommunityPage from '../../../views/CommunityPage';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: '내 활동 - acttub 게시판',
  description: 'acttub 게시판 내 활동',
};

export default async function Page({ searchParams }: PageProps) {
  return <CommunityPage view="me" searchParams={(await searchParams) ?? {}} />;
}
