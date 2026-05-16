/**
 * Badge — 유형 코드 배지 [MINB].
 * 명세: outputs/stage-2/component-spec-web.md C1
 */

import './Badge.css';

type Variant = 'default' | 'muted' | 'unknown';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  code: string;
  variant?: Variant;
  size?: Size;
};

export default function Badge({ code, variant = 'default', size = 'md' }: Props) {
  return (
    <span
      className={`badge badge--${variant} badge--${size}`}
      aria-label={`유형 코드 ${code}`}
    >
      {code}
    </span>
  );
}
