export type SurveyOption = {
  value: string;
  label: string;
};

export type SurveyQuestion = {
  id: string;
  label: string;
  required: true;
  options: SurveyOption[];
};

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'actor-status',
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
    id: 'acting-duration',
    label: '연기 활동 기간',
    required: true,
    options: [
      { value: 'under-1-year', label: '1년 미만' },
      { value: '1-to-3-years', label: '1-3년' },
      { value: '3-to-7-years', label: '3-7년' },
      { value: 'over-7-years', label: '7년 이상' },
    ],
  },
];
