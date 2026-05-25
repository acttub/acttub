import ArchivePage from '../../../../views/ArchivePage';

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;

  return {
    title: `${username} archive - acttub`,
    description: `${username}의 acttub archive 공개 프로필`,
  };
}

export default function Page() {
  return <ArchivePage />;
}
