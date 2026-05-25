import { notFound } from 'next/navigation';

import { curation } from '../../../../thea/curation';
import TheaPage from '../../../../views/TheaPage';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return curation.map((play) => ({ id: play.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const play = curation.find((entry) => entry.id === id);

  if (!play) {
    return {
      title: 'thea - 추천 연극',
    };
  }

  return {
    title: `${play.title} - thea`,
    description: play.pitch,
    openGraph: {
      title: `${play.title} - thea`,
      description: play.pitch,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const play = curation.find((entry) => entry.id === id);

  if (!play) {
    notFound();
  }

  return <TheaPage />;
}
