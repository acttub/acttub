import {
  type FeedbackFocus,
  type FeedbackNextStep,
  type FeedbackOverall,
  type FeedbackStrength,
  type OverallBand,
} from '../coach/evaluation';

// SOMA-60 단일 초점 카드 — 위→아래 정서 설계:
// 의도 확인 → 강점(안심) → 딱 하나(핵심) → 다음 한 걸음.
// 내부 라벨(axis/tier/axes enum)은 노출하지 않고, 배우 언어 문장만 보여준다.
// /coach 와 /test(빠른 테스트)가 같은 결과 카드를 공유한다.

// 다축 전경(rev.7) — 단일 초점 위에 4축 상태를 한눈에. 코치가 다 본 뒤 1노트를 주듯,
// 배우에게 "전체적으로 어디가 좋고 어디가 아쉬운지" 먼저 돌려준다(처방 카드가 시각 주인공은 유지).
const BAND_WORD: Record<OverallBand, string> = { good: '좋음', mid: '보통', weak: '아쉬움' };
const BAND_TONE: Record<OverallBand, string> = {
  good: 'text-success',
  mid: 'text-muted',
  weak: 'text-danger',
};

export function OverallBlock({ overall }: { overall?: FeedbackOverall }) {
  const bands = overall?.axisBands ?? [];

  if (bands.length === 0) {
    if (!overall?.text) return null;
    return (
      <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span aria-hidden="true">🎬</span>
          <h3 className="text-sm font-black text-ink">전체적으로 보면</h3>
        </div>
        <p className="mt-3 text-sm leading-6 text-foreground">{overall.text}</p>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">🎬</span>
        <h3 className="text-sm font-black text-ink">전체적으로 보면</h3>
      </div>
      <ul className="mt-3 grid gap-2">
        {bands.map((band) => (
          <li key={band.axis} className="grid grid-cols-[5.5rem_auto_1fr] items-baseline gap-x-2 text-sm leading-6">
            <span className="font-bold text-ink">{band.label}</span>
            <span className={`text-xs font-bold ${BAND_TONE[band.band]}`}>{BAND_WORD[band.band]}</span>
            <span className="text-muted">{band.text}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function StrengthBlock({ strength }: { strength: FeedbackStrength }) {
  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">👏</span>
        <h3 className="text-sm font-black text-ink">잘된 순간</h3>
        <span className="ml-auto rounded-full bg-surface-muted px-2 py-0.5 text-xs font-bold text-ink">
          {strength.timecode}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-foreground">{strength.signal}</p>
      {strength.why ? (
        <p className="mt-1 text-sm leading-6 text-primary-deep">{strength.why}</p>
      ) : null}
    </article>
  );
}

export function FocusBlock({ focus }: { focus: FeedbackFocus }) {
  const rows: { label: string; value: string; emphasis?: boolean }[] = [
    { label: '어디서', value: focus.observedSignal },
    { label: '왜', value: focus.rootCause },
    { label: '이렇게 보였어요', value: focus.intentGap },
    { label: '이렇게 해봐요', value: focus.prescription, emphasis: true },
  ];

  return (
    <article className="rounded-xl border border-primary/40 bg-primary-soft/40 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">🎯</span>
        <h3 className="text-sm font-black text-ink">이번에 딱 하나</h3>
        {focus.timecode ? (
          <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-bold text-primary-deep">
            {focus.timecode}
          </span>
        ) : null}
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6">
        {rows
          .filter((row) => row.value)
          .map((row) => (
            <div key={row.label} className="grid grid-cols-[6rem_1fr] gap-2">
              <dt className={`font-bold ${row.emphasis ? 'text-primary-deep' : 'text-muted'}`}>
                {row.label}
              </dt>
              <dd className={row.emphasis ? 'font-semibold text-ink' : 'text-foreground'}>{row.value}</dd>
            </div>
          ))}
      </dl>
    </article>
  );
}

export function NextStepBlock({ nextStep, onRetake }: { nextStep: FeedbackNextStep; onRetake: () => void }) {
  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span aria-hidden="true">▶</span>
        <h3 className="text-sm font-black text-ink">다음 한 걸음</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-foreground">{nextStep.text}</p>
      <button
        type="button"
        onClick={onRetake}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-deep"
      >
        재촬영하고 비교받기
      </button>
    </article>
  );
}
