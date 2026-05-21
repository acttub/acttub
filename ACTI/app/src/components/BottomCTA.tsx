/**
 * BottomCTA — Toss TDS BottomCTA 패턴.
 *
 * - 화면 하단 sticky + safe-area 대응
 * - 부드러운 위쪽 그라데이션 (스크롤 콘텐츠와 부드럽게 이어짐)
 * - 자식은 보통 PrimaryButton 1개. 위쪽에 보조 텍스트/링크 옵션.
 */

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** 상단 보조 영역 (예: "1분 30초만 풀면 끝" 같은 카피 또는 보조 버튼) */
  top?: ReactNode;
  /** 배경 컬러 모드: 'page' (옅은 배경 그라데이션) / 'surface' (흰 카드 위에서 사용) */
  surface?: 'page' | 'surface';
};

export default function BottomCTA({ children, top, surface = 'page' }: Props) {
  return (
    <div className={`bottom-cta ${surface === 'surface' ? 'bottom-cta--surface' : ''}`}>
      {top && <div className="bottom-cta__top">{top}</div>}
      {children}
    </div>
  );
}
