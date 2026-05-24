import ArchivePage from '../../../views/ArchivePage';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'archive 검색 - acttub',
  description: 'acttub archive 영상 검색',
};

export default async function Page({ searchParams }: PageProps) {
  return <ArchivePage view="search" searchParams={(await searchParams) ?? {}} />;
}
