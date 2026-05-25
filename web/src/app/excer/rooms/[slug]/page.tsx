import { notFound } from 'next/navigation';

import { EXCER_FIXTURE_ROOMS } from '../../../../excer/rooms';
import ExcerPage from '../../../../views/ExcerPage';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return EXCER_FIXTURE_ROOMS.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const room = EXCER_FIXTURE_ROOMS.find((entry) => entry.slug === slug);

  if (!room) {
    return {
      title: 'excer - 연습실',
    };
  }

  return {
    title: `${room.name} - excer`,
    description: `${room.region} ${room.sizePyeong}평 연기 연습실. 시간당 ${room.priceHour.toLocaleString('ko-KR')}원.`,
    openGraph: {
      title: `${room.name} - excer`,
      description: `${room.region} ${room.sizePyeong}평 연기 연습실.`,
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const room = EXCER_FIXTURE_ROOMS.find((entry) => entry.slug === slug);

  if (!room) {
    notFound();
  }

  return <ExcerPage searchParams={(await searchParams) ?? {}} />;
}
