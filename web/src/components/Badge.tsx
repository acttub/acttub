/**
 * Badge — 유형 코드 배지 [MINB].
 * Small result badge used across ACTI cards.
 */


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
