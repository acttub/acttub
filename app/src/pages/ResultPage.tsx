/**
 * S3 / S3' — 결과 페이지 (v3: 토스 카드 위계 + BottomCTA).
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ChevronLeft, RotateCcw, ArrowRight,
  ImageDown, Link2, MessageCircle,
} from 'lucide-react';

import CaptureCard from '../components/CaptureCard';
import TypeCard from '../components/TypeCard';
import AxisBreakdown from '../components/AxisBreakdown';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ShareActionButton from '../components/ShareActionButton';
import BottomCTA from '../components/BottomCTA';
import Toast from '../components/Toast';

import { isTypeCode } from '../content/schema';
import { getType } from '../content/types';
import { getMyTypeCode, clearMyTypeCode } from '../lib/storage';
import { saveCaptureAsImage, copyResultUrl, getSiteUrl } from '../lib/share';
import { shareToKakao } from '../lib/kakao';

import NotFoundPage from './NotFoundPage';
import './ResultPage.css';

export default function ResultPage() {
  const { code: rawCode } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const captureRef = useRef<HTMLElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!rawCode || !isTypeCode(rawCode)) {
    return <NotFoundPage />;
  }
  const code = rawCode;

  const myCode = useMemo(() => getMyTypeCode(), []);
  const isRecipient = !myCode || myCode !== code;
  const isCelebrate = !isRecipient && myCode === code;

  const type = getType(code);
  const rival = getType(type.rival);
  const bff = getType(type.bff);
  const siteUrl = getSiteUrl();

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 1800);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSaveImage = async () => {
    if (!captureRef.current) return;
    await saveCaptureAsImage(captureRef.current, `acti-${code}.png`);
    setToast('이미지가 저장됐어요');
  };

  const handleCopyLink = async () => {
    await copyResultUrl(code);
    setToast('링크가 복사됐어요');
  };

  const handleKakao = () => {
    shareToKakao(type, siteUrl);
  };

  const handleRetry = () => {
    clearMyTypeCode();
    navigate('/quiz', { replace: true });
  };

  return (
    <main className="page page-enter page-result">
      <Helmet>
        <title>[{code}] {type.name} — ACTI</title>
        <meta name="description" content={type.tagline} />
        <meta property="og:title" content={`[${code}] ${type.name}`} />
        <meta property="og:description" content={type.tagline} />
        <meta property="og:image" content={`${siteUrl}/og/${code}.png`} />
        <meta property="og:url" content={`${siteUrl}/result/${code}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <header className="page-result__topbar">
        <Link to="/" aria-label="처음으로" className="page-result__back">
          <ChevronLeft size={24} aria-hidden="true" />
        </Link>
        <span className="page-result__topbar-title">ACTI</span>
        <span aria-hidden="true" style={{ width: 40 }} />
      </header>

      <div className="page-result__container">
        {isRecipient && (
          <div className="page-result__visitor">
            <span>친구가 풀어본 결과예요</span>
          </div>
        )}

        <CaptureCard
          ref={captureRef}
          typeIndex={type.index}
          code={type.code}
          name={type.name}
          tagline={type.tagline}
          traits={type.traits}
          accessory={type.accessory}
          face={type.face}
          celebrate={isCelebrate}
        />

        <AxisBreakdown code={type.code} />

        <section className="page-result__section">
          <h3 className="page-result__section-title">어울리는 역할</h3>
          <ul className="page-result__role-list">
            {type.roles.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>

        <section className="page-result__section">
          <h3 className="page-result__section-title">너의 관계</h3>
          <div className="page-result__relations">
            <TypeCard
              relation="rival"
              code={rival.code}
              name={rival.name}
              typeIndex={rival.index}
              accessory={rival.accessory}
              face={rival.face}
            />
            <TypeCard
              relation="bff"
              code={bff.code}
              name={bff.name}
              typeIndex={bff.index}
              accessory={bff.accessory}
              face={bff.face}
            />
          </div>
        </section>

        <section className="page-result__share">
          <p className="page-result__share-title">단톡방에 던지기</p>
          <div className="share-group">
            <ShareActionButton type="image" icon={ImageDown} onAction={handleSaveImage} label="이미지" />
            <ShareActionButton type="link"  icon={Link2}     onAction={handleCopyLink}  label="링크" />
            <ShareActionButton type="kakao" icon={MessageCircle} onAction={handleKakao} label="카톡" />
          </div>
        </section>

        <SecondaryButton size="lg" fullWidth onClick={handleRetry}>
          <RotateCcw size={18} aria-hidden="true" /> 다시 풀어보기
        </SecondaryButton>

        <div className="page-result__bottom-pad" aria-hidden="true" />
      </div>

      {isRecipient && (
        <BottomCTA>
          <PrimaryButton size="xl" fullWidth onClick={() => navigate('/quiz')}>
            나도 풀어보기
            <ArrowRight size={20} aria-hidden="true" />
          </PrimaryButton>
        </BottomCTA>
      )}

      {toast && <Toast message={toast} />}
    </main>
  );
}
