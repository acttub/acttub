/**
 * PrimaryButton — Toss TDS 의 fill/weak variant 패턴.
 *
 * - variant: 'fill' (강조, 코랄) / 'weak' (보조, 회색)
 * - size: 'md' (48) / 'lg' (56) / 'xl' (60)
 * - display: 'block' (풀폭) / 'inline'
 */

import type { ReactNode, MouseEventHandler } from 'react';
import './PrimaryButton.css';

type Variant = 'fill' | 'weak';
type Size = 'md' | 'lg' | 'xl';

type Props = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  fullWidth?: boolean;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  as?: 'button' | 'a';
  href?: string;
};

export default function PrimaryButton({
  children,
  onClick,
  fullWidth = true,
  variant = 'fill',
  size = 'xl',
  disabled = false,
  as = 'button',
  href,
}: Props) {
  const cls = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
  ].filter(Boolean).join(' ');

  if (as === 'a' && href) {
    return (
      <a className={cls} href={href} onClick={onClick as MouseEventHandler<HTMLAnchorElement>}>
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={cls}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
      aria-disabled={disabled || undefined}
    >
      {children}
    </button>
  );
}
