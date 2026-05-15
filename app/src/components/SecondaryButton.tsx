/**
 * SecondaryButton — 토스 weak variant 의 별칭. PrimaryButton 으로 위임 가능하지만
 * 기존 호출처 호환성을 위해 별도 컴포넌트 유지.
 */

import type { ReactNode, MouseEventHandler } from 'react';
import PrimaryButton from './PrimaryButton';

type Props = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  fullWidth?: boolean;
  size?: 'md' | 'lg' | 'xl';
  disabled?: boolean;
  as?: 'button' | 'a';
  href?: string;
};

export default function SecondaryButton(props: Props) {
  return <PrimaryButton {...props} variant="weak" />;
}
