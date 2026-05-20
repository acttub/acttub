import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import PrimaryButton from '../components/PrimaryButton';
import { SURVEY_QUESTIONS } from '../content/survey';
import { getMyTypeCode } from '../lib/storage';

import './SurveyPage.css';

export default function SurveyPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const resultCode = useMemo(() => getMyTypeCode(), []);

  useEffect(() => {
    if (!resultCode) {
      navigate('/quiz', { replace: true });
    }
  }, [navigate, resultCode]);

  const isComplete = SURVEY_QUESTIONS.every((question) => answers[question.id]);

  const handleShowResult = () => {
    if (!resultCode || !isComplete) return;
    navigate(`/result/${resultCode}`, { replace: true });
  };

  if (!resultCode) return null;

  return (
    <main className="page page-enter page-survey">
      <div className="page-survey__container">
        <header className="page-survey__header">
          <p className="page-survey__eyebrow">결과 보기 전 마지막 단계</p>
          <h1 className="page-survey__title">짧은 설문에 답해 주세요</h1>
          <p className="page-survey__description">
            답변을 마치면 바로 ACTI 결과를 볼 수 있어요.
          </p>
        </header>

        <div className="page-survey__questions">
          {SURVEY_QUESTIONS.map((question) => (
            <fieldset className="page-survey__question" key={question.id}>
              <legend className="page-survey__legend">
                {question.label}
                {question.required && (
                  <span className="page-survey__required" aria-label="필수">
                    *
                  </span>
                )}
              </legend>
              <div className="page-survey__options">
                {question.options.map((option) => (
                  <label className="page-survey__option" key={option.value}>
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: option.value,
                        }))
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <PrimaryButton size="xl" fullWidth disabled={!isComplete} onClick={handleShowResult}>
          결과 보기
          <ArrowRight size={20} aria-hidden="true" />
        </PrimaryButton>
      </div>
    </main>
  );
}
