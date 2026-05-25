import ArchivePage from '../../../../views/ArchivePage';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  return {
    title: `archive 영상 - ${id}`,
    description: 'acttub archive 영상 상세',
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ArchivePage view="video" videoId={id} />;
}
