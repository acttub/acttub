import CommunityPage from '../../../../views/CommunityPage';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  return {
    title: `게시글 ${id} - acttub`,
    description: 'acttub 게시판 글 상세',
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <CommunityPage view="post" postId={id} />;
}
