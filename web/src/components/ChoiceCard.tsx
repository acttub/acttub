/**
 * ChoiceCard — 시나리오 4지선다 (v3: 토스 ListRow 톤).
 */

import { Check, type LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  label: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
};

export default function ChoiceCard({
  icon: Icon,
  label,
  selected = false,
  onClick,
  disabled = false,
}: Props) {
  return (
    <button
      type="button"
      className={`choice ${selected ? 'choice--selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      <span className="choice__icon-wrap" aria-hidden="true">
        <Icon size={22} strokeWidth={2.1} />
      </span>
      <span className="choice__label">{label}</span>
      {selected ? (
        <span className="choice__check" aria-hidden="true">
          <Check size={18} strokeWidth={3} />
        </span>
      ) : null}
    </button>
  );
}
