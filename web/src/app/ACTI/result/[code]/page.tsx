import ResultPage from '../../../../views/ResultPage';
import { isTypeCode } from '../../../../content/schema';
import { getType } from '../../../../content/types';

export const dynamic = 'force-dynamic';

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

export default function Page() {
  return <ResultPage />;
}
