/**
 * ShareActionButton — 토스 ListRow Action 톤 (v3: 깔끔한 회색 칩).
 */

import { useState } from 'react';
import { Check, Loader2, type LucideIcon } from 'lucide-react';

type ShareType = 'image' | 'link' | 'kakao' | 'instagram';

type Props = {
  type: ShareType;
  icon: LucideIcon;
  label: string;
  onAction: () => Promise<void> | void;
  disabled?: boolean;
};

export default function ShareActionButton({ type, icon: Icon, label, onAction, disabled }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleClick = async () => {
    if (state !== 'idle' || disabled) return;
    setState('loading');
    try {
      await onAction();
      setState('success');
      setTimeout(() => setState('idle'), 1200);
    } catch (e) {
      console.error('Share action failed', e);
      setState('idle');
    }
  };

  return (
    <button
      type="button"
      className={`share share--${type}`}
      onClick={handleClick}
      disabled={disabled || state !== 'idle'}
      aria-label={label}
    >
      <span className="share__icon" aria-hidden="true">
        {state === 'loading' && <Loader2 size={20} className="share__spin" />}
        {state === 'success' && <Check size={20} strokeWidth={3} />}
        {state === 'idle' && <Icon size={20} />}
      </span>
      <span className="share__label">{label}</span>
    </button>
  );
}
