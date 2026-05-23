/**
 * TypeCard — 천적/베프 카드 (v2: 캐릭터 아바타 통합).
 */

import { Link } from 'react-router-dom';
import { ChevronRight, Swords, Heart, Sparkles } from 'lucide-react';
import Badge from './Badge';
import CharacterAvatar from './CharacterAvatar';
import type { FaceVariant, TypeCode, TypeIndex } from '../content/schema';

type Props = {
  relation?: 'rival' | 'bff' | 'preview';
  code: TypeCode | string;
  name: string;
  typeIndex?: TypeIndex;
  accessory?: string;
  face?: FaceVariant;
  interactive?: boolean;
};

const REL_LABEL = {
  rival: '천적',
  bff: '베프',
  preview: '미리보기',
} as const;

export default function TypeCard({
  relation = 'preview',
  code,
  name,
  typeIndex,
  accessory,
  face,
  interactive = true,
}: Props) {
  const RelationIcon =
    relation === 'rival' ? Swords :
    relation === 'bff'   ? Heart  :
    Sparkles;

  const ariaLabel = interactive
    ? `${REL_LABEL[relation]} ${code} ${name} 결과 보기`
    : `${REL_LABEL[relation]} ${code} ${name}`;

  const content = (
    <>
      {typeIndex !== undefined && accessory ? (
        <CharacterAvatar typeIndex={typeIndex} accessory={accessory} face={face} size="sm" />
      ) : (
        <div className="type-card__icon" aria-hidden="true">
          <RelationIcon size={20} />
        </div>
      )}
      <div className="type-card__body">
        <div className="type-card__head">
          <Badge code={code} size="sm" />
          <span className="type-card__relation" aria-hidden="true">
            <RelationIcon size={12} />
            {REL_LABEL[relation]}
          </span>
        </div>
        <p className="type-card__name">{name}</p>
      </div>
      {interactive && (
        <div className="type-card__arrow" aria-hidden="true">
          <ChevronRight size={20} />
        </div>
      )}
    </>
  );

  if (!interactive) {
    return <div className="type-card type-card--static" aria-label={ariaLabel}>{content}</div>;
  }

  return (
    <Link to={`/result/${code}`} className="type-card" aria-label={ariaLabel}>
      {content}
    </Link>
  );
}
