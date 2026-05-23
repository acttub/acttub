/**
 * S4 — 404 (v3: 토스 톤 + BottomCTA).
 */

import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Badge from '../components/Badge';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import BottomCTA from '../components/BottomCTA';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main className="page page-enter page-404">
      <div className="page-404__container">
        <Badge code="???" variant="unknown" size="lg" />
        <h1 className="page-404__title">
          이 유형은<br />
          아직 없는 캐릭터예요
        </h1>
        <p className="page-404__hint">(오타거나 만들지 못한 조합일지도)</p>
        <SecondaryButton fullWidth onClick={() => navigate('/ACTI/quiz')}>
          바로 풀어보기
        </SecondaryButton>
      </div>
      <BottomCTA>
        <PrimaryButton size="xl" fullWidth onClick={() => navigate('/ACTI')}>
          처음으로
          <ArrowRight size={20} aria-hidden="true" />
        </PrimaryButton>
      </BottomCTA>
    </main>
  );
}
