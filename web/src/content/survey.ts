/**
 * 결과 보기 전 게이트 설문 — Google Form (id: 1B8AbCOplBCICb-lhG4t2yzc21OsTgZssUgP87vCt_pA)
 * 의 객관식·다중선택 문항만 추려서 와이저드로 노출.
 *
 * 사용자 결정으로 섹션 헤더와 서술형(텍스트) 문항은 페이지에 표시하지 않음.
 * entryId는 Google Form 응답 제출 시 필요한 `entry.{id}` 필드 번호.
 */

export type SurveyOption = {
  value: string;
  label: string;
  /** Google Form 제출 시 보낼 라벨. 미지정이면 `label` 그대로 사용. */
  submitLabel?: string;
};

export type SurveyShowIf = { id: string; equals: string };

export type SurveyItem =
  | { kind: 'section'; id: string; title: string }
  | {
      kind: 'radio';
      id: string;
      entryId: number;
      label: string;
      required: boolean;
      options: SurveyOption[];
      showIf?: SurveyShowIf;
    }
  | {
      kind: 'checkbox';
      id: string;
      entryId: number;
      label: string;
      required: boolean;
      maxSelect?: number;
      options: SurveyOption[];
      showIf?: SurveyShowIf;
    }
  | {
      kind: 'text';
      id: string;
      entryId: number;
      label: string;
      required: boolean;
      multiline?: boolean;
      placeholder?: string;
      showIf?: SurveyShowIf;
    };

export const SURVEY_ITEMS: SurveyItem[] = [
  {
    kind: 'radio',
    id: 'actor-status',
    entryId: 428621930,
    label: '본인을 가장 잘 설명하는 항목은?',
    required: true,
    options: [
      { value: 'active-actor', label: '현역 배우 (최근 6개월 내 오디션·촬영·공연 1회 이상)' },
      { value: 'learning-acting', label: '연기 학습 중 (학원·워크숍·스터디)' },
      { value: 'resting', label: '휴식 혹은 비활동' },
      { value: 'not-actor', label: '배우가 아님' },
    ],
  },
  {
    kind: 'radio',
    id: 'acting-duration',
    entryId: 1715551659,
    label: '연기 활동 기간',
    required: true,
    options: [
      { value: 'under-1-year', label: '1년 미만' },
      { value: '1-to-3-years', label: '1-3년' },
      { value: '3-to-7-years', label: '3-7년' },
      { value: 'over-7-years', label: '7년 이상' },
    ],
  },
  {
    kind: 'radio',
    id: 'feedback-frequency',
    entryId: 1817924167,
    label: '최근 6개월간 본인의 연기에 대해 다른 사람으로부터 피드백을 받은 적이 있나요?',
    required: true,
    options: [
      { value: 'weekly-or-more', label: '정기적으로 받음 (주 1회 이상)' },
      { value: 'monthly', label: '가끔 받음 (월 1회 이상)' },
      { value: 'rare', label: '거의 못 받음 (반년에 1-2회)' },
      { value: 'never', label: '전혀 받지 못함' },
    ],
  },
  {
    kind: 'checkbox',
    id: 'feedback-source',
    entryId: 836726915,
    label: '최근 받은 피드백은 누구로부터였나요?',
    required: true,
    options: [
      { value: 'teacher-coach', label: '연기 선생님·코치' },
      { value: 'director', label: '연출·감독' },
      { value: 'peer-actor', label: '동료 배우' },
      { value: 'senior-actor', label: '선배 배우' },
      { value: 'non-expert', label: '비전문가' },
      { value: 'audition-director', label: '오디션·디렉터' },
    ],
  },
  {
    kind: 'radio',
    id: 'feedback-timing',
    entryId: 602140706,
    label: '피드백은 연기를 보여준 시점부터 얼마 만에 받았나요?',
    required: true,
    options: [
      { value: 'immediate', label: '즉시 (10분 이내)' },
      { value: 'same-day', label: '당일 ~ 다음 날' },
      { value: 'within-week', label: '1주 이내' },
      { value: 'irregular', label: '비정기적' },
    ],
  },
  {
    kind: 'checkbox',
    id: 'feedback-types',
    entryId: 1868085474,
    label: '받고 싶은 피드백을 선택해주세요 (최대 3개)',
    required: true,
    maxSelect: 3,
    options: [
      { value: 'physical-technical', label: '신체·기술적 측면' },
      { value: 'emotional-expressive', label: '감정·표현적 측면' },
      { value: 'interpretation-analysis', label: '해석과 분석 측면' },
      { value: 'practice-method', label: '연습 방식 측면' },
      { value: 'character-fit', label: '캐릭터 적합성 측면' },
      { value: 'suited-character', label: '본인에게 잘 맞는 캐릭터성' },
    ],
  },
  {
    kind: 'radio',
    id: 'others-feedback',
    entryId: 1397425298,
    label: '다른 누군가의 피드백을 받을 수 있다면 받고 싶으신가요?',
    required: true,
    options: [
      { value: 'verified', label: '검증된 사람의 피드백을 받고 싶습니다' },
      { value: 'anyone', label: '누구든 상관 없습니다' },
      { value: 'none', label: '받고 싶지 않다' },
    ],
  },
  {
    kind: 'radio',
    id: 'future-updates',
    entryId: 1639858588,
    label: '추후 서비스에 관련된 정보를 받고 싶으신가요?',
    required: true,
    options: [
      {
        value: 'yes',
        label: '예',
        submitLabel: '추첨에 응모하고, 결과 리포트도 받고 싶습니다 (베타는 사양)',
      },
      {
        value: 'no',
        label: '아니오',
        submitLabel: '응모하지 않겠습니다',
      },
    ],
  },
  {
    kind: 'text',
    id: 'contact',
    entryId: 179241963,
    label: '연락처를 알려주세요 (전화번호 또는 이메일)',
    required: true,
    multiline: false,
    placeholder: '예: 010-0000-0000 또는 name@example.com',
    showIf: { id: 'future-updates', equals: 'yes' },
  },
];

/** 답변 1개의 값은 라디오/텍스트는 string, 체크박스는 string[] */
export type SurveyAnswerValue = string | string[];
export type SurveyAnswers = Record<string, SurveyAnswerValue>;

/** showIf 충족 여부 — undefined면 무조건 표시 */
export function isVisible(item: SurveyItem, answers: SurveyAnswers): boolean {
  if (item.kind === 'section') return true;
  if (!item.showIf) return true;
  const v = answers[item.showIf.id];
  return typeof v === 'string' && v === item.showIf.equals;
}
