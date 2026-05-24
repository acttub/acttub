'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from '../lib/router';
import {
  ChevronRight,
  ImageOff,
  Map,
  Navigation,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  applyExcerFilters,
  parseExcerSearchParams,
  toExcerQueryString,
  type ExcerRoom,
  type ExcerSearchParams,
} from '../excer/excerFilters';
import { EXCER_FIXTURE_ROOMS } from '../excer/rooms';

const PRICE_MAX = 30000;
const PRICE_STEP = 1000;
const SOUNDPROOF_SHORT: Record<ExcerRoom['soundproof'], string> = {
  strong: '방음 강',
  medium: '방음 중',
  weak: '방음 약',
};

function formatPrice(won: number) {
  return `₩${won.toLocaleString('ko-KR')}`;
}

function countFilters(filters: ExcerSearchParams) {
  let count = 0;
  if (filters.mirror) count++;
  if (filters.soundproof) count++;
  if (filters.size) count++;
  if (typeof filters.price_max === 'number') count++;
  return count;
}

export default function ExcerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filters = useMemo(
    () => parseExcerSearchParams(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );
  const filterCount = countFilters(filters);
  const filteredRooms = useMemo(
    () => applyExcerFilters(EXCER_FIXTURE_ROOMS, filters),
    [filters],
  );

  function setFilters(next: ExcerSearchParams) {
    setSearchParams(toExcerQueryString(next), { replace: true });
  }

  function updateFilters(patch: Partial<ExcerSearchParams>) {
    const next = { ...filters, ...patch };
    (Object.keys(next) as (keyof ExcerSearchParams)[]).forEach((key) => {
      const value = next[key];
      if (value === undefined || value === null || value === '') delete next[key];
    });
    setFilters(next);
  }

  function resetFilters() {
    setFilters({});
  }

  return (
    <div className="excer-page">
      <header className="excer-header">
        <a href="/" className="excer-logo" aria-label="excer 홈으로">
          excer<span>.</span>
        </a>
        <div className="excer-header__actions">
          <button
            type="button"
            aria-label="필터 열기"
            className={`excer-filter-button ${filterCount > 0 ? 'is-active' : ''}`}
            onClick={() => setFilterOpen((open) => !open)}
          >
            <SlidersHorizontal />
            {filterCount > 0 ? <span>{filterCount}</span> : null}
          </button>
        </div>
      </header>

      <div className="excer-search">
        <div className="excer-search__inner">
          <label className="excer-search__input">
            <Search />
            <input
              type="search"
              value={filters.q ?? ''}
              onChange={(event) => updateFilters({ q: event.target.value || undefined })}
              placeholder="동·역 검색 (예: 혜화, 대학로역)"
              aria-label="동 또는 지하철역으로 검색"
            />
          </label>
          <button type="button" className="excer-location-button" aria-label="현재 위치로 이동">
            <Navigation />
            내 주변
          </button>
        </div>
      </div>

      {filterOpen ? (
        <FilterPanel
          filters={filters}
          count={filterCount}
          onUpdate={updateFilters}
          onReset={resetFilters}
          onClose={() => setFilterOpen(false)}
        />
      ) : null}

      <main className="excer-content">
        <section className="excer-map-area" aria-label="연습실 지도">
          <MapPlaceholder />
          {filteredRooms.map((room) => (
            <button
              key={room.slug}
              type="button"
              className={`excer-map-pin ${activeSlug === room.slug ? 'is-active' : ''}`}
              style={{
                left: `${Math.min(88, Math.max(12, ((room.lng - 126.9) / 0.17) * 100))}%`,
                top: `${Math.min(82, Math.max(14, ((37.61 - room.lat) / 0.13) * 100))}%`,
              }}
              onMouseEnter={() => setActiveSlug(room.slug)}
              onMouseLeave={() => setActiveSlug(null)}
              aria-label={`${room.name} 위치`}
            />
          ))}
          <div className="excer-map-note">NEXT_PUBLIC_KAKAO_MAP_KEY 가 설정되면 지도가 활성화돼요</div>
        </section>

        <aside className="excer-list-panel" aria-label="연습실 목록">
          {filteredRooms.length === 0 ? (
            <div className="excer-empty">
              <strong>{filterCount > 0 ? '조건에 맞는 연습실이 없어요' : '표시할 연습실이 없어요'}</strong>
              <p>{filterCount > 0 ? '필터를 풀어보세요.' : 'DATABASE_URL 을 설정하거나 fixture 가 비어있어요.'}</p>
              {filterCount > 0 ? (
                <button type="button" onClick={resetFilters}>
                  필터 초기화
                </button>
              ) : null}
            </div>
          ) : (
            <RoomList
              rooms={filteredRooms}
              sort={filters.sort ?? 'near'}
              onSortChange={(sort) => updateFilters({ sort })}
              onActiveChange={setActiveSlug}
            />
          )}
        </aside>
      </main>
    </div>
  );
}

function FilterPanel({
  filters,
  count,
  onUpdate,
  onReset,
  onClose,
}: {
  filters: ExcerSearchParams;
  count: number;
  onUpdate: (patch: Partial<ExcerSearchParams>) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const [priceMax, setPriceMax] = useState(filters.price_max ?? PRICE_MAX);
  const isPriceActive = (filters.price_max ?? PRICE_MAX) < PRICE_MAX;

  return (
    <div className="excer-filter-popover">
      <div className="excer-filter-popover__header">
        <span>필터</span>
        <button type="button" aria-label="닫기" onClick={onClose}>
          <X />
        </button>
      </div>
      <div className="excer-filter-popover__body">
        <FilterSection title="거울">
          <SegmentedGroup
            columns={2}
            value={filters.mirror ?? ''}
            options={[
              { value: '1', label: '있음' },
              { value: '0', label: '없음' },
            ]}
            onChange={(value) => onUpdate({ mirror: (value as '1' | '0') || undefined })}
          />
        </FilterSection>

        <FilterSection title="방음">
          <SegmentedGroup
            columns={3}
            value={filters.soundproof ?? ''}
            options={[
              { value: 'strong', label: '강' },
              { value: 'medium', label: '중' },
              { value: 'weak', label: '약' },
            ]}
            onChange={(value) =>
              onUpdate({ soundproof: (value as ExcerSearchParams['soundproof']) || undefined })
            }
          />
        </FilterSection>

        <FilterSection title="평수">
          <SegmentedGroup
            columns={3}
            value={filters.size ?? ''}
            options={[
              { value: 's', label: '10평↓' },
              { value: 'm', label: '10~20' },
              { value: 'l', label: '20평↑' },
            ]}
            onChange={(value) => onUpdate({ size: (value as ExcerSearchParams['size']) || undefined })}
          />
        </FilterSection>

        <div className="excer-filter-separator" />

        <FilterSection
          title="가격대"
          accessory={
            <span className={isPriceActive ? 'is-active' : ''}>~ {formatPrice(priceMax)} / 시간</span>
          }
        >
          <input
            className="excer-price-slider"
            type="range"
            min={0}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={priceMax}
            onChange={(event) => setPriceMax(Number(event.target.value))}
            onMouseUp={() => onUpdate({ price_max: priceMax < PRICE_MAX ? priceMax : undefined })}
            onTouchEnd={() => onUpdate({ price_max: priceMax < PRICE_MAX ? priceMax : undefined })}
            aria-label="가격대"
          />
        </FilterSection>

        <div className="excer-filter-actions">
          <button type="button" onClick={onReset} disabled={count === 0}>
            초기화
          </button>
          <button type="button">{count > 0 ? `${count}개 필터 적용` : '필터 없음'}</button>
        </div>
      </div>
    </div>
  );
}

function FilterSection({
  title,
  accessory,
  children,
}: {
  title: string;
  accessory?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="excer-filter-section">
      <div className="excer-filter-section__title">
        <span>{title}</span>
        {accessory}
      </div>
      {children}
    </section>
  );
}

function SegmentedGroup({
  columns,
  value,
  options,
  onChange,
}: {
  columns: number;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="excer-segmented" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={selected ? 'is-selected' : ''}
            onClick={() => onChange(selected ? '' : option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function MapPlaceholder() {
  return (
    <div className="excer-map-placeholder" role="img" aria-label="지도 미리보기 (개발 중)">
      <div className="excer-map-placeholder__grid" aria-hidden />
      <div className="excer-map-placeholder__center">
        <Map />
        <span>지도 영역</span>
      </div>
    </div>
  );
}

function RoomList({
  rooms,
  sort,
  onSortChange,
  onActiveChange,
}: {
  rooms: ExcerRoom[];
  sort: 'near' | 'price';
  onSortChange: (sort: 'near' | 'price') => void;
  onActiveChange: (slug: string | null) => void;
}) {
  const sortedRooms = [...rooms].sort((a, b) => {
    if (sort === 'price') return a.priceHour - b.priceHour;
    return 0;
  });

  return (
    <div className="excer-room-list">
      <div className="excer-room-list__bar">
        <span>{rooms.length}곳</span>
        <div className="excer-sort-control" aria-label="정렬 방식">
          <button type="button" className={sort === 'near' ? 'is-selected' : ''} onClick={() => onSortChange('near')}>
            거리순
          </button>
          <button type="button" className={sort === 'price' ? 'is-selected' : ''} onClick={() => onSortChange('price')}>
            가격순
          </button>
        </div>
      </div>
      <div className="excer-room-list__items">
        {sortedRooms.map((room) => (
          <RoomCard key={room.id} room={room} onHover={onActiveChange} />
        ))}
      </div>
    </div>
  );
}

function RoomCard({
  room,
  onHover,
}: {
  room: ExcerRoom;
  onHover: (slug: string | null) => void;
}) {
  const chips = [
    `${room.sizePyeong}평`,
    room.mirror ? '🪞 거울' : null,
    SOUNDPROOF_SHORT[room.soundproof],
  ].filter(Boolean) as string[];

  return (
    <a
      href={`/excer/rooms/${room.slug}`}
      data-room-id={room.id}
      onMouseEnter={() => onHover(room.slug)}
      onMouseLeave={() => onHover(null)}
      className="excer-room-card"
    >
      <div className="excer-room-card__photo">
        {room.photos.length > 0 ? <img src={room.photos[0]} alt="" loading="lazy" /> : <ImageOff aria-hidden />}
      </div>

      <div className="excer-room-card__body">
        <h3>{room.name}</h3>
        <p>{room.region}</p>
        <div className="excer-room-card__chips">
          {chips.slice(0, 3).map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
        <div className="excer-room-card__price">
          <strong>{formatPrice(room.priceHour)}</strong>
          <span>/시간</span>
        </div>
      </div>

      <ChevronRight className="excer-room-card__arrow" aria-hidden />
    </a>
  );
}
