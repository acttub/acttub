import ArchivePage from '../../../views/ArchivePage';

export const metadata = {
  title: 'archive 업로드 - acttub',
  description: 'acttub archive에 연기 영상을 업로드합니다.',
};

export default function Page() {
  return <ArchivePage view="upload" />;
}
