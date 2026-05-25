import Link from 'next/link';
import {
  Bell,
  ChevronRight,
  Clapperboard,
  Eye,
  Heart,
  MessageCircle,
  Music2,
  Plus,
  Search,
  Sparkles,
  Ticket,
} from 'lucide-react';

const shortcuts = [
  {
    href: '/ACTI',
    label: 'ACTI 진단',
    ariaLabel: 'ACTI - 연기 스타일 진단',
    className: '',
    Icon: Sparkles,
  },
  {
    href: '/archive',
    label: 'archive',
    ariaLabel: 'archive - 연기 영상 아카이브',
    className: 'is-archive',
    Icon: Clapperboard,
  },
  {
    href: '/thea',
    label: 'thea',
    ariaLabel: 'thea - 연극 추천',
    className: 'is-thea',
    Icon: Ticket,
  },
  {
    href: '/excer',
    label: 'excer',
    ariaLabel: 'excer - 연기 연습실',
    className: 'is-excer',
    Icon: Music2,
  },
];

const hotPosts = [
  {
    id: 1024,
    title: '오디션 직전에 긴장 푸는 루틴 공유합니다',
    board: '자유게시판',
    time: '5분 전',
    likes: 42,
    comments: 18,
  },
  {
    id: 1019,
    title: '발성 연습 1년 해보고 느낀 것들 (장문)',
    board: '자유게시판',
    time: '32분 전',
    likes: 31,
    comments: 12,
  },
  {
    id: 1011,
    title: 'ACTI 결과 ENFP-A로 나왔는데 진짜 맞는 듯 ㅋㅋ',
    board: '자유게시판',
    time: '1시간 전',
    likes: 28,
    comments: 9,
  },
];

const freePosts = [
  {
    id: 1031,
    title: '대학로 소극장 추천 좀 받을 수 있을까요?',
    comments: 7,
    snippet: '이번 주말에 처음 가보려고 하는데 분위기 좋고 좌석 편한 곳 알려주세요.',
    time: '10분 전',
    views: 124,
  },
  {
    id: 1030,
    title: '독백 연습 어디서 하시나요',
    comments: 12,
    snippet: '집에선 가족 눈치 보이고, 연습실은 비싸고… 다들 어떻게 해결하시는지 궁금해서요.',
    time: '34분 전',
    views: 286,
  },
  {
    id: 1029,
    title: '감정 끌어올리는 거 매번 어렵네요',
    comments: 5,
    snippet: '대본 외우는 건 되는데, 막상 카메라 켜면 톤이 평탄해져요. 다들 어떻게 푸세요?',
    time: '1시간 전',
    views: 192,
  },
  {
    id: 1028,
    title: 'archive에 영상 올리면 비공개 진짜로 보장되나요?',
    comments: 3,
    snippet: '민감한 영상이라서요. 운영진이 볼 수도 있는 건지 궁금합니다.',
    time: '2시간 전',
    views: 98,
  },
  {
    id: 1027,
    title: '오디션 자유연기 1분 30초 추천 작품 있을까요',
    comments: 9,
    snippet: '너무 흔한 거 말고, 20대 초반 여자 캐릭터로 부담스럽지 않은 거면 좋겠어요.',
    time: '3시간 전',
    views: 421,
  },
  {
    id: 1026,
    title: '연기 학원 안 다니고 혼자 하는 분 계세요?',
    comments: 18,
    snippet: '독학으로 어디까지 갈 수 있을지 궁금해서요. 경험담 부탁드려요.',
    time: '5시간 전',
    views: 733,
  },
];

export default function RootLandingPage() {
  return (
    <div className="root-landing">
      <header className="root-landing__topbar">
        <div className="root-landing__topbar-inner">
          <Link href="/" className="root-landing__brand" aria-label="acttub 홈">
            act<span className="root-landing__brand-accent">tub</span>
          </Link>
          <form className="root-landing__search" role="search">
            <Search aria-hidden="true" />
            <input type="search" placeholder="검색어를 입력하세요" aria-label="검색" />
          </form>
          <Link className="root-landing__coach-top-link" href="/coach" aria-label="coach - 연기 연습 피드백">
            <Sparkles aria-hidden="true" strokeWidth={2.2} />
            <span>coach</span>
          </Link>
          <Link className="root-landing__icon-btn" href="/team" aria-label="알림" prefetch={false}>
            <Bell aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="root-landing__main">
        <div className="root-landing__container">
          <section className="root-landing__coach-feature" aria-label="coach 바로가기">
            <Link className="root-landing__coach-hero-link" href="/coach" aria-label="coach - 연기 연습 피드백">
              <span className="root-landing__coach-hero-copy">
                <span className="root-landing__coach-hero-kicker">AI COACH</span>
                <span className="root-landing__coach-hero-title">연기 연습 피드백</span>
                <span className="root-landing__coach-hero-desc">
                  영상 구간과 의도를 기준으로 다음 연습 포인트를 정리합니다.
                </span>
              </span>
              <span className="root-landing__coach-hero-icon" aria-hidden="true">
                <Sparkles strokeWidth={2.2} />
              </span>
            </Link>
          </section>

          <section className="root-landing__shortcuts" aria-label="acttub 서비스 바로가기">
            <div className="root-landing__shortcuts-grid">
              {shortcuts.map(({ href, label, ariaLabel, className, Icon }) => (
                <Link key={href} className="root-landing__shortcut" href={href} aria-label={ariaLabel}>
                  <span className={`root-landing__shortcut-icon ${className}`} aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="root-landing__shortcut-label">{label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="root-landing__card" aria-label="실시간 인기글">
            <div className="root-landing__card-header">
              <div className="root-landing__card-header-left">
                <span className="root-landing__card-badge">HOT</span>
                <h2 className="root-landing__card-title">실시간 인기글</h2>
              </div>
              <Link className="root-landing__card-more" href="/community?sort=hot">
                더보기
                <ChevronRight aria-hidden="true" />
              </Link>
            </div>
            <div className="root-landing__hot-list">
              {hotPosts.map((post, index) => (
                <Link key={post.id} className="root-landing__hot-item" href={`/community/posts/${post.id}`}>
                  <span className="root-landing__hot-rank">{index + 1}</span>
                  <span className="root-landing__hot-item-body">
                    <span className="root-landing__hot-item-title">{post.title}</span>
                    <span className="root-landing__hot-item-meta">
                      <span>{post.board}</span>
                      <span>{post.time}</span>
                    </span>
                  </span>
                  <span className="root-landing__hot-stats" aria-label="좋아요·댓글">
                    <Heart aria-hidden="true" fill="currentColor" strokeWidth={0} />
                    {post.likes}
                    <span aria-hidden="true">·</span>
                    <MessageCircle aria-hidden="true" />
                    {post.comments}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="root-landing__card" aria-label="자유게시판 최신글">
            <div className="root-landing__card-header">
              <div className="root-landing__card-header-left">
                <h2 className="root-landing__card-title">자유게시판</h2>
              </div>
              <Link className="root-landing__card-more" href="/community?board=free">
                더보기
                <ChevronRight aria-hidden="true" />
              </Link>
            </div>
            <div className="root-landing__post-list">
              {freePosts.map((post) => (
                <Link key={post.id} className="root-landing__post" href={`/community/posts/${post.id}`}>
                  <div className="root-landing__post-title-row">
                    <span className="root-landing__post-title">{post.title}</span>
                  </div>
                  <span className="root-landing__post-comments">[{post.comments}]</span>
                  <p className="root-landing__post-snippet">{post.snippet}</p>
                  <div className="root-landing__post-meta">
                    <span>익명</span>
                    <span className="root-landing__dot" aria-hidden="true" />
                    <span>{post.time}</span>
                    <span className="root-landing__dot" aria-hidden="true" />
                    <span className="root-landing__stat" aria-label="조회수">
                      <Eye aria-hidden="true" />
                      {post.views}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Link className="root-landing__fab" href="/community/write" aria-label="새 글 작성">
        <Plus aria-hidden="true" />
      </Link>

      <footer className="root-landing__footer">
        <Link href="/team" prefetch={false}>
          우리 팀 소개
        </Link>
        <span>© acttub</span>
      </footer>
    </div>
  );
}
