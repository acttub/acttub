/**
 * CharacterAvatar — ChatGPT 디자인 PNG 캐릭터 (v4).
 *
 * - public/characters/{code}.png 를 표시
 * - 시그니처 컬러 배경 ring 유지 (선택)
 * - face/accessory prop 은 호환성 유지 (이제 PNG 안에 통합됨)
 */

import type { FaceVariant, TypeCode, TypeIndex } from '../content/schema';
import { TYPE_CODES } from '../content/schema';
import './CharacterAvatar.css';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type Props = {
  typeIndex: TypeIndex;
  /** 캐릭터 코드 — PNG 파일명 결정. 호환성 위해 선택. typeIndex 로 추론. */
  code?: TypeCode;
  /** legacy: accessory/face 는 PNG 에 통합되었으나 prop 호환성 유지. */
  accessory?: string;
  face?: FaceVariant;
  size?: Size;
  label?: string;
  /** 시그니처 컬러 배경 ring 표시 (기본 false — PNG 위주) */
  withRing?: boolean;
};

const SIZE_PX: Record<Size, number> = { xs: 44, sm: 60, md: 88, lg: 144, xl: 200 };

export default function CharacterAvatar({
  typeIndex,
  code,
  size = 'md',
  label,
  withRing = false,
}: Props) {
  const px = SIZE_PX[size];
  const resolvedCode = code ?? TYPE_CODES[typeIndex];
  const src = `${import.meta.env.BASE_URL}characters/${resolvedCode}.png`;

  return (
    <div
      className={`avatar avatar--${size} ${withRing ? 'avatar--ring' : ''}`}
      data-type={String(typeIndex).padStart(2, '0')}
      style={{ width: px, height: px }}
      aria-label={label ?? `${resolvedCode} 캐릭터`}
    >
      <img
        src={src}
        alt=""
        className="avatar__img"
        loading="lazy"
        draggable={false}
      />
    </div>
  );
}
