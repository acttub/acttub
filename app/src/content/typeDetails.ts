/**
 * 16유형 상세 콘텐츠 — 메일 전용 확장본 (현재는 플레이스홀더).
 *
 * 이 모듈은 결과 메일 본문에만 쓰이며, 결과 페이지 UI에는 표시되지 않는다.
 * 실제 콘텐츠는 후속 작업에서 16유형 × 4섹션으로 채워질 예정.
 */

import type { TypeCode } from './schema';

export type TypeDetails = {
  /** 깊이 있는 캐릭터 분석 (3~5 문단) */
  longAnalysis: string[];
  /** 추천 작품/장르 (제목 + 한 줄 설명) */
  recommendedWorks: Array<{ title: string; note: string }>;
  /** 권장 훈련/워크숍 */
  trainingTips: string[];
  /** 협업/관계 팁 (rival·bff와의 케미 등) */
  collaborationTips: string;
};

const PLACEHOLDER: TypeDetails = {
  longAnalysis: [
    '상세 분석 콘텐츠는 현재 준비 중입니다. 곧 이 자리에 유형별 깊이 있는 해설을 채워서 다시 보내드릴게요.',
    '지금은 결과 페이지에서 본 4축 진단과 베프/천적 유형 정보까지만 받아보실 수 있어요. 메일 구독 명단에 추가되었기 때문에, 콘텐츠가 완성되면 자동으로 업데이트 메일이 한 번 더 갈 예정입니다.',
  ],
  recommendedWorks: [
    { title: '추천 작품 큐레이션 준비 중', note: '각 유형의 결에 맞는 영상·연극·시나리오 큐레이션이 곧 업데이트됩니다.' },
  ],
  trainingTips: [
    '유형별 권장 훈련/워크숍 가이드 준비 중 (메소드 vs 테크닉, 즉흥 vs 설계 등 축에 따라 큐레이팅 예정).',
  ],
  collaborationTips:
    '베프 유형과 천적 유형 각각과의 협업 팁이 곧 업데이트됩니다. 결과 페이지의 "너의 관계" 섹션을 먼저 참고해주세요.',
};

export function getTypeDetails(_code: TypeCode): TypeDetails {
  // TODO: 16유형 × 상세 콘텐츠가 완성되면 Record<TypeCode, TypeDetails> 로 교체
  return PLACEHOLDER;
}
