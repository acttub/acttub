import ResultPage from '../../../../views/ResultPage';
import { TYPE_CODES, isTypeCode } from '../../../../content/schema';
import { getType } from '../../../../content/types';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ code: string }>;
};

export function generateStaticParams() {
  return TYPE_CODES.map((code) => ({ code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params;
  if (!isTypeCode(rawCode)) {
    return {
      title: 'ACTI',
    };
  }

  const type = getType(rawCode);
  const resultPath = `/ACTI/result/${rawCode}`;

  return {
    title: `${rawCode} ${type.name} — ACTI`,
    description: type.tagline,
    openGraph: {
      title: `${rawCode} ${type.name}`,
      description: type.tagline,
      images: [`/og/${rawCode}.png`],
      url: resultPath,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { code: rawCode } = await params;

  if (!isTypeCode(rawCode)) {
    notFound();
  }

  const type = getType(rawCode);
  const rival = getType(type.rival);
  const bff = getType(type.bff);

  return <ResultPage type={type} rival={rival} bff={bff} />;
}
