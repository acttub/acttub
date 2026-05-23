/**
 * SurveyPage — 결과 보기 전 게이트 설문.
 *
 * 와이저드 패턴: 한 화면 = 한 항목. 라디오는 선택 시 자동 진행(240ms).
 * 체크박스/텍스트는 "다음" 버튼으로 수동 진행. 상단 진행률·섹션 헤더는
 * 노출하지 않음. 마지막 항목 완료 시 Google Form 으로 응답 전송 후
 * /result/:code 로 이동.
 */

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

import PrimaryButton from '../components/PrimaryButton';
import {
  SURVEY_ITEMS,
  isVisible,
  type SurveyAnswers,
  type SurveyItem,
} from '../content/survey';
import { getMyTypeCode } from '../lib/storage';
import { submitSurveyResponse } from '../lib/surveySubmit';

const AUTO_ADVANCE_MS = 240;

/** 섹션 헤더는 노출하지 않으므로 사용자에게 보일 항목만 모아둔다. */
type RenderableItem = Exclude<SurveyItem, { kind: 'section' }>;
const ITEMS: RenderableItem[] = SURVEY_ITEMS.filter(
  (it): it is RenderableItem => it.kind !== 'section'
);

function answerReady(item: RenderableItem, answers: SurveyAnswers): boolean {
  const v = answers[item.id];
  if (!item.required) return true;
  if (item.kind === 'radio') return typeof v === 'string' && v.length > 0;
  if (item.kind === 'checkbox') return Array.isArray(v) && v.length > 0;
  return typeof v === 'string' && v.trim().length > 0;
}

export default function SurveyPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const resultCode = useMemo(() => getMyTypeCode(), []);

  useEffect(() => {
    if (!resultCode) navigate('/ACTI/quiz', { replace: true });
  }, [navigate, resultCode]);

  const findNext = (from: number) => {
    for (let i = from + 1; i < ITEMS.length; i++) {
      if (isVisible(ITEMS[i], answers)) return i;
    }
    return ITEMS.length;
  };

  const moveNext = async () => {
    const next = findNext(index);
    if (next >= ITEMS.length) {
      if (!resultCode) return;
      setSubmitting(true);
      try {
        await submitSurveyResponse(answers);
      } catch {
        // 응답 전송 실패는 사용자 흐름을 막지 않음
      }
      navigate(`/ACTI/result/${resultCode}`, { replace: true });
      return;
    }
    setIndex(next);
  };

  const item = ITEMS[index];
  if (!resultCode || !item) return null;

  const intro =
    index === 0 ? (
      <p className="page-survey__intro">결과 확인을 위해 짧은 설문에 응답해주세요.</p>
    ) : null;

  if (item.kind === 'radio') {
    const selected = answers[item.id];
    const handlePick = (val: string) => {
      setAnswers((prev) => ({ ...prev, [item.id]: val }));
      setTimeout(() => {
        void moveNext();
      }, AUTO_ADVANCE_MS);
    };
    return (
      <main className="page page-enter page-survey">
        <div className="page-survey__container">
          <section className="page-survey__body" key={item.id}>
            {intro}
            <h2 className="page-survey__label">
              {item.label}
              {item.required && (
                <span className="page-survey__required" aria-label="필수">*</span>
              )}
            </h2>
            <div className="page-survey__choices">
              {item.options.map((opt) => {
                const isSel = selected === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    className={`survey-choice ${isSel ? 'survey-choice--selected' : ''}`}
                    onClick={() => handlePick(opt.value)}
                    aria-pressed={isSel}
                  >
                    <span className="survey-choice__label">{opt.label}</span>
                    {isSel && (
                      <span className="survey-choice__check" aria-hidden="true">
                        <Check size={18} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (item.kind === 'checkbox') {
    const current = (answers[item.id] as string[] | undefined) ?? [];
    const max = item.maxSelect;
    const togglePick = (val: string) => {
      const has = current.includes(val);
      let next: string[];
      if (has) {
        next = current.filter((v) => v !== val);
      } else {
        if (max && current.length >= max) return;
        next = [...current, val];
      }
      setAnswers((prev) => ({ ...prev, [item.id]: next }));
    };
    const ready = answerReady(item, { ...answers, [item.id]: current });
    return (
      <main className="page page-enter page-survey">
        <div className="page-survey__container">
          <section className="page-survey__body" key={item.id}>
            {intro}
            <h2 className="page-survey__label">
              {item.label}
              {item.required && (
                <span className="page-survey__required" aria-label="필수">*</span>
              )}
            </h2>
            {max && (
              <p className="page-survey__hint">
                최대 {max}개 · 선택 {current.length}
              </p>
            )}
            <div className="page-survey__choices">
              {item.options.map((opt) => {
                const isSel = current.includes(opt.value);
                const disabled = !isSel && !!max && current.length >= max;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    className={`survey-choice ${isSel ? 'survey-choice--selected' : ''}`}
                    onClick={() => togglePick(opt.value)}
                    aria-pressed={isSel}
                    disabled={disabled}
                  >
                    <span className="survey-choice__label">{opt.label}</span>
                    {isSel && (
                      <span className="survey-choice__check" aria-hidden="true">
                        <Check size={18} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <PrimaryButton
              size="xl"
              fullWidth
              disabled={!ready || submitting}
              onClick={() => void moveNext()}
            >
              다음
              <ArrowRight size={20} aria-hidden="true" />
            </PrimaryButton>
          </section>
        </div>
      </main>
    );
  }

  // text — 현재 데이터엔 없지만 향후 재도입 대비 방어 렌더링
  const stored = answers[item.id];
  const value = typeof stored === 'string' ? stored : '';
  const ready = !item.required || value.trim().length > 0;
  const setValue = (v: string) =>
    setAnswers((prev) => ({ ...prev, [item.id]: v }));
  const onChangeArea = (e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);
  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
  const handleNext = () => {
    setValue(value.trim());
    void moveNext();
  };

  return (
    <main className="page page-enter page-survey">
      <div className="page-survey__container">
        <section className="page-survey__body" key={item.id}>
          <h2 className="page-survey__label">
            {item.label}
            {item.required && (
              <span className="page-survey__required" aria-label="필수">*</span>
            )}
          </h2>
          {item.multiline ? (
            <textarea
              className="page-survey__input page-survey__input--area"
              value={value}
              onChange={onChangeArea}
              placeholder={item.placeholder}
              rows={5}
            />
          ) : (
            <input
              type="text"
              className="page-survey__input"
              value={value}
              onChange={onChangeInput}
              placeholder={item.placeholder}
            />
          )}
          <PrimaryButton
            size="xl"
            fullWidth
            disabled={!ready || submitting}
            onClick={handleNext}
          >
            다음
            <ArrowRight size={20} aria-hidden="true" />
          </PrimaryButton>
        </section>
      </div>
    </main>
  );
}
