/**
 * Toast — 일시 안내 (예: "링크가 복사됐어요").
 */

import { Check } from 'lucide-react';

type Props = {
  message: string;
};

export default function Toast({ message }: Props) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <Check size={16} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
