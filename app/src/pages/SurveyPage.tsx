/**
 * SurveyPage — 결과 보기 전 게이트 설문.
 *
 * 와이저드 패턴: 한 화면 = 한 항목. 라디오는 선택 시 자동 진행(240ms).
 * 체크박스/텍스트는 "다음" 버튼으로 수동 진행. 섹션 헤더는 1.1초 후
 * 자동 다음. 마지막 항목 완료 시 Google Form 으로 응답 전송 후
 * /result/:code 로 이동.
 */

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

import PrimaryButton from '../components/PrimaryButton';
import ProgressBar from '../components/ProgressBar';
import {
  SURVEY_ITEMS,
  isVisible,
  type SurveyAnswers,
  type SurveyItem,
} from '../content/survey';
import { getMyTypeCode } from '../lib/storage';
import { submitSurveyResponse } from '../lib/surveySubmit';
import './SurveyPage.css';

const AUTO_ADVANCE_MS = 240;
const SECTION_HOLD_MS = 1100;

function questionAnswered(item: SurveyItem, answers: SurveyAnswers): boolean {
  if (item.kind === 'section') return true;
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
    if (!resultCode) navigate('/quiz', { replace: true });
  }, [navigate, resultCode]);

  const item = SURVEY_ITEMS[index] as SurveyItem | undefined;

  const findNext = (from: number) => {
    for (let i = from + 1; i < SURVEY_ITEMS.length; i++) {
      if (isVisible(SURVEY_ITEMS[i], answers)) return i;
    }
    return SURVEY_ITEMS.length;
  };

  const findPrev = (from: number) => {
    for (let i = from - 1; i >= 0; i--) {
      if (isVisible(SURVEY_ITEMS[i], answers)) return i;
    }
    return -1;
  };

  const moveNext = async () => {
    const next = findNext(index);
    if (next >= SURVEY_ITEMS.length) {
      if (!resultCode) return;
      setSubmitting(true);
      try {
        await submitSurveyResponse(answers);
      } catch {
        // 응답 전송 실패는 사용자 흐름을 막지 않음
      }
      navigate(`/result/${resultCode}`, { replace: true });
      return;
    }
    setIndex(next);
  };

  const moveBack = () => {
    const prev = findPrev(index);
    if (prev >= 0) setIndex(prev);
  };

  // 섹션 헤더: 잠시 보여주고 자동 진행
  useEffect(() => {
    if (!item || item.kind !== 'section') return;
    const t = setTimeout(() => {
      void moveNext();
    }, SECTION_HOLD_MS);
    return () => clearTimeout(t);
    // moveNext는 클로저 — index/answers 만 의존
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const totalVisible = useMemo(
    () =>
      SURVEY_ITEMS.filter((it) => it.kind !== 'section' && isVisible(it, answers)).length,
    [answers]
  );

  const currentVisibleIndex = useMemo(() => {
    if (!item) return 0;
    const upto = item.kind === 'section' ? index : index + 1;
    return SURVEY_ITEMS.slice(0, upto).filter(
      (it) => it.kind !== 'section' && isVisible(it, answers)
    ).length;
  }, [index, item, answers]);

  if (!resultCode || !item) return null;

  const canBack = findPrev(index) >= 0;
  const header = (
    <ProgressBar
      current={Math.max(1, currentVisibleIndex)}
      total={Math.max(1, totalVisible)}
      onBack={canBack ? moveBack : undefined}
    />
  );

  if (item.kind === 'section') {
    return (
      <main className="page page-enter page-survey">
        {header}
        <div className="page-survey__container">
          <section className="page-survey__section" key={item.id}>
            <p className="page-survey__eyebrow">다음 섹션</p>
            <h2 className="page-survey__section-title">{item.title}</h2>
          </section>
        </div>
      </main>
    );
  }

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
        {header}
        <div className="page-survey__container">
          <section className="page-survey__body" key={item.id}>
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
    const ready = questionAnswered(item, { ...answers, [item.id]: current });
    return (
      <main className="page page-enter page-survey">
        {header}
        <div className="page-survey__container">
          <section className="page-survey__body" key={item.id}>
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

  // text
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
      {header}
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
