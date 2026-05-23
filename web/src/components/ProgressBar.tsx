/**
 * ProgressBar — 토스 톱 헤더 톤 (v3: 미니멀 + sticky).
 */

import { ChevronLeft } from 'lucide-react';

type Props = {
  current: number;
  total: number;
  onBack?: () => void;
};

export default function ProgressBar({ current, total, onBack }: Props) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100));
  return (
    <header className="topbar">
      <div className="topbar__row">
        <button
          type="button"
          className="topbar__back"
          onClick={onBack}
          disabled={!onBack}
          aria-label="이전 문항"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        <span className="topbar__counter">{current} / {total}</span>
        <span className="topbar__spacer" aria-hidden="true" />
      </div>
      <div
        className="topbar__track"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`${current} / ${total}`}
      >
        <div className="topbar__fill" style={{ width: `${pct}%` }} />
      </div>
    </header>
  );
}
