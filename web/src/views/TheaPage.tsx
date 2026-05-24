'use client';

import { useMemo, useState, type ElementType } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Drama,
  Heart,
  Home,
  Laugh,
  MapPin,
  MessageCircle,
  Moon,
  Music2,
  Search,
  Sparkles,
  Theater,
  Users,
} from 'lucide-react';
import { curation, type Companion, type CurationEntry, type Mood, type Pace } from '../thea/curation';

type EnrichedPlay = {
  id: string;
  title: string;
  venue: string;
  area: string;
  pitch: string;
  tags: string[];
  moods: CurationEntry['moods'];
  companions: CurationEntry['companions'];
  pace: CurationEntry['pace'];
  price: string;
  period: string;
  poster: string | null;
  isLive: boolean;
  isCurated: boolean;
};

const moods: Array<{ id: Mood; label: string; icon: ElementType }> = [
  { id: 'light', label: '가볍게 웃고 싶어요', icon: Laugh },
  { id: 'deep', label: '긴 여운이 좋아요', icon: Moon },
  { id: 'romance', label: '관계 이야기가 좋아요', icon: Heart },
  { id: 'music', label: '음악이 있으면 좋아요', icon: Music2 },
  { id: 'experimental', label: '낯선 형식도 좋아요', icon: Sparkles },
];

const companions: Array<{ id: Companion; label: string; icon: ElementType }> = [
  { id: 'alone', label: '혼자', icon: Drama },
  { id: 'date', label: '데이트', icon: Heart },
  { id: 'friends', label: '친구와', icon: Users },
  { id: 'family', label: '가족과', icon: Home },
];

const paceOptions: Array<{ id: Pace; label: string }> = [
  { id: 'calm', label: '차분히' },
  { id: 'balanced', label: '적당히' },
  { id: 'dynamic', label: '빠르게' },
];

function buildFallbackPlays(): EnrichedPlay[] {
  return curation.map((entry) => ({
    id: entry.id,
    title: entry.title,
    venue: entry.defaultVenue,
    area: entry.defaultArea,
    pitch: entry.pitch,
    tags: entry.tags,
    moods: entry.moods,
    companions: entry.companions,
    pace: entry.pace,
    price: entry.priceHint,
    period: '이번 주 공연 없음',
    poster: null,
    isLive: false,
    isCurated: true,
  }));
}

function scorePlay(play: EnrichedPlay, mood: Mood, companion: Companion, pace: Pace) {
  let score = 0;
  if (play.moods.includes(mood)) score += 4;
  if (play.companions.includes(companion)) score += 3;
  if (play.pace === pace) score += 2;
  else if (play.pace === 'balanced') score += 1;
  if (play.isLive) score += 1;
  if (play.isCurated) score += 2;
  return score;
}

export default function TheaPage() {
  return (
    <div className="thea-page">
      <Helmet>
        <title>thea - 취향 기반 연극 추천</title>
        <meta
          name="description"
          content="관람 취향을 입력하면 지금 보기 좋은 연극을 추천하는 acttub의 연극 큐레이션 서비스입니다."
        />
        <meta property="og:title" content="thea - 취향 기반 연극 추천" />
        <meta
          property="og:description"
          content="관람 취향을 입력하면 지금 보기 좋은 연극을 추천하는 acttub의 연극 큐레이션 서비스입니다."
        />
      </Helmet>

      <SiteHeader />
      <main className="thea-main">
        <section className="thea-hero">
          <div className="thea-hero__image" />
          <div className="thea-hero__inner">
            <div className="thea-hero__copy">
              <div className="thea-kicker">
                <Sparkles />
                acttub theater recommendation
              </div>
              <h1>
                취향을 말하면
                <br />
                오늘 볼 연극을 골라드려요.
              </h1>
              <p>
                분위기, 동행, 전개 속도를 바탕으로 지금 관람하기 좋은 연극을 빠르게 추려주는
                acttub의 하위 프로젝트입니다.
              </p>
              <div className="thea-hero__actions">
                <a className="thea-button thea-button--primary thea-button--lg" href="#recommend">
                  취향 입력하기
                  <ArrowRight />
                </a>
                <a className="thea-button thea-button--outline thea-button--lg" href="#picks">
                  <MessageCircle />
                  추천 예시 보기
                </a>
              </div>
            </div>
          </div>
        </section>

        <RecommendationTool plays={buildFallbackPlays()} source="fallback" />
      </main>
      <footer className="thea-footer">acttub · thea</footer>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="thea-header">
      <div className="thea-header__inner">
        <a href="/" className="thea-brand">
          <span>
            act<span>tub</span>
          </span>
          <small>thea</small>
        </a>

        <div className="thea-header__actions">
          <a className="thea-button thea-button--ghost thea-button--sm thea-header__recommend" href="#recommend">
            <Sparkles />
            추천 받기
          </a>
          <a className="thea-button thea-button--primary thea-button--sm" href="#picks">
            <Theater />
            오늘의 연극
          </a>
        </div>
      </div>
    </header>
  );
}

function RecommendationTool({
  plays,
  source,
}: {
  plays: EnrichedPlay[];
  source: 'kopis' | 'fallback';
}) {
  const [mood, setMood] = useState<Mood>('deep');
  const [companion, setCompanion] = useState<Companion>('date');
  const [pace, setPace] = useState<Pace>('balanced');

  const recommendations = useMemo(
    () =>
      [...plays]
        .sort((a, b) => {
          const diff = scorePlay(b, mood, companion, pace) - scorePlay(a, mood, companion, pace);
          if (diff !== 0) return diff;
          return a.title.localeCompare(b.title, 'ko');
        })
        .slice(0, 3),
    [plays, mood, companion, pace],
  );

  return (
    <section id="recommend" className="thea-recommend">
      <div className="thea-panel">
        <div className="thea-section-label">
          <Search />
          취향 입력
        </div>
        <h2>오늘 보고 싶은 무대의 느낌을 골라주세요.</h2>

        <div className="thea-choice-stack">
          <ChoiceGroup title="분위기" items={moods} value={mood} onChange={(nextMood) => setMood(nextMood)} />
          <ChoiceGroup title="동행" items={companions} value={companion} onChange={(nextCompanion) => setCompanion(nextCompanion)} />

          <div>
            <div id="pace-label" className="thea-choice-title">
              전개 속도
            </div>
            <div role="radiogroup" aria-labelledby="pace-label" className="thea-pace-group">
              {paceOptions.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={pace === id}
                  onClick={() => setPace(id)}
                  className={pace === id ? 'is-selected' : ''}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="thea-source-note">
          {source === 'kopis'
            ? '공연 정보는 KOPIS(공연예술통합전산망) 데이터를 매일 갱신해 반영합니다.'
            : '현재 KOPIS 실시간 데이터 연결 전입니다. 큐레이션 작품을 우선 보여드리고 있어요.'}
        </p>
      </div>

      <div id="picks" className="thea-picks">
        {recommendations.map((play, index) => (
          <a key={play.id} href={`/thea/plays/${play.id}`} className="thea-pick-card">
            <article>
              <div className="thea-pick-card__top">
                <div>
                  <div className="thea-rank">
                    추천 {index + 1}
                    {play.isLive && <span>공연중</span>}
                  </div>
                  <h3>
                    {play.title}
                    <ArrowUpRight />
                  </h3>
                </div>
                <div className="thea-price">{play.price}</div>
              </div>
              <p>{play.pitch}</p>
              <div className="thea-tags">
                {play.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="thea-meta">
                <span>
                  <MapPin />
                  {play.area ? `${play.area} · ` : ''}
                  {play.venue}
                </span>
                <span>
                  <CalendarDays />
                  {play.period}
                </span>
              </div>
            </article>
          </a>
        ))}
      </div>
    </section>
  );
}

function ChoiceGroup<T extends string>({
  title,
  items,
  value,
  onChange,
}: {
  title: string;
  items: Array<{ id: T; label: string; icon: ElementType }>;
  value: T;
  onChange: (value: T) => void;
}) {
  const labelId = `thea-choice-group-${title}`;

  return (
    <div>
      <div id={labelId} className="thea-choice-title">
        {title}
      </div>
      <div role="radiogroup" aria-labelledby={labelId} className="thea-choice-group">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = value === item.id;

          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(item.id)}
              className={selected ? 'is-selected' : ''}
            >
              <Icon />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
