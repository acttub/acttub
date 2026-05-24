import CommunityPage from '../../../views/CommunityPage';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: '새 글 - acttub 게시판',
  description: 'acttub 게시판에 새 글을 작성합니다.',
};

export default async function Page({ searchParams }: PageProps) {
  return <CommunityPage view="new" searchParams={(await searchParams) ?? {}} />;
}
