import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  FileText,
  Flame,
  Heart,
  Home,
  MessageSquare,
  Pencil,
  Search,
} from 'lucide-react';
import {
  COMMUNITY_BOARDS,
  HOT_BOARD,
  formatCommunityRelative,
  getCommunityBoard,
  getCommunityPost,
  listCommunityPosts,
  parseCommunityParams,
  searchCommunityPosts,
  type CommunityPost,
} from '../community/communityData';
import { COMMUNITY_FIXTURE_COMMENTS, COMMUNITY_FIXTURE_POSTS } from '../community/fixtures';
import './CommunityPage.css';

const TABS = [
  { key: 'posts', label: '내 글', emptyMessage: '아직 쓴 글이 없어요.' },
  { key: 'comments', label: '내 댓글', emptyMessage: '아직 남긴 댓글이 없어요.' },
  { key: 'likes', label: '좋아요', emptyMessage: '추천한 글이 없어요.' },
  { key: 'bookmarks', label: '북마크', emptyMessage: '저장한 글이 없어요.' },
] as const;

export default function CommunityPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const normalizedPath = location.pathname.replace(/^\/community/, '') || '/';

  let content: ReactNode;
  if (normalizedPath === '/search') content = <CommunitySearch />;
  else if (normalizedPath === '/new' || normalizedPath === '/write') content = <CommunityNew />;
  else if (normalizedPath === '/me') content = <CommunityMe />;
  else if (normalizedPath.startsWith('/posts/') || normalizedPath.startsWith('/p/')) {
    const id = normalizedPath.split('/').filter(Boolean).at(-1);
    content = <CommunityPostDetail postId={id} />;
  } else {
    content = <CommunityHome searchParams={searchParams} />;
  }

  return (
    <div className="community-page">
      <Helmet>
        <title>acttub 게시판</title>
        <meta name="description" content="배우들이 이야기 나누는 곳" />
      </Helmet>
      <CommunityHeader />
      <main className="community-main">{content}</main>
      <footer className="community-footer">acttub · 배우들의 게시판</footer>
    </div>
  );
}

function CommunityHeader() {
  return (
    <header className="community-header">
      <div className="community-header__inner">
        <Link to="/community" className="community-brand" aria-label="게시판 홈">
          <span>a</span>
          <strong>게시판</strong>
        </Link>
        <div className="community-header__actions">
          <Link to="/community/search" className="community-icon-link" aria-label="검색">
            <Search />
          </Link>
          <button type="button" className="community-login-button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

function CommunityShell({
  currentBoard,
  children,
}: {
  currentBoard: string | null;
  children: ReactNode;
}) {
  return (
    <div className="community-shell">
      <CommunitySidebar currentBoard={currentBoard} />
      <div className="community-content">
        <BoardTabs currentBoard={currentBoard} />
        {children}
      </div>
    </div>
  );
}

function CommunityHome({ searchParams }: { searchParams: URLSearchParams }) {
  const params = parseCommunityParams(Object.fromEntries(searchParams.entries()));
  const activeBoard = params.board ? getCommunityBoard(params.board) : null;
  const posts = listCommunityPosts(COMMUNITY_FIXTURE_POSTS, params);
  const baseUrl = params.board ? `/community?board=${params.board}` : '/community';
  const newSort = params.board ? `${baseUrl}&sort=new` : '/community?sort=new';
  const topSort = params.board ? `${baseUrl}&sort=top` : '/community?sort=top';

  return (
    <CommunityShell currentBoard={params.board}>
      <div className="community-page-title">
        {activeBoard ? (
          <>
            <span>{activeBoard.emoji}</span>
            <h1>{activeBoard.name}</h1>
            <p>{activeBoard.description}</p>
          </>
        ) : (
          <>
            <h1>홈</h1>
            <p>전체 게시글</p>
          </>
        )}
      </div>

      {params.board !== HOT_BOARD.slug ? (
        <SortTabs sort={params.sort} newHref={newSort} topHref={topSort} />
      ) : null}

      {posts.length === 0 ? (
        <EmptyMessage>
          {params.board === HOT_BOARD.slug
            ? '추천 10개 이상의 인기글이 모이는 곳이에요. 아직 비어있네요.'
            : activeBoard
              ? `아직 ${activeBoard.name} 글이 없어요. 첫 글을 써보세요.`
              : '아직 글이 없어요. 첫 글을 써보세요.'}
        </EmptyMessage>
      ) : (
        <ul className="community-post-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} showBoard={params.board === null || params.board === HOT_BOARD.slug} />
          ))}
        </ul>
      )}

      {!activeBoard && posts.length > 0 ? <BoardExplore /> : null}

      <Link
        to={params.board && params.board !== HOT_BOARD.slug ? `/community/new?board=${params.board}` : '/community/new'}
        className="community-write-fab"
        aria-label="글쓰기"
      >
        <Pencil />
      </Link>
    </CommunityShell>
  );
}

function CommunitySearch() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') ?? '').trim();
  const results = query ? searchCommunityPosts(COMMUNITY_FIXTURE_POSTS, query) : [];

  return (
    <CommunityShell currentBoard={null}>
      <div className="community-search-block">
        <SearchForm initialQuery={query} />
      </div>
      {query ? (
        results.length === 0 ? (
          <EmptyMessage>‘{query}’ 에 대한 결과가 없어요.</EmptyMessage>
        ) : (
          <>
            <p className="community-result-count">결과 {results.length}개</p>
            <ul className="community-post-list">
              {results.map((post) => (
                <PostCard key={post.id} post={post} showBoard />
              ))}
            </ul>
          </>
        )
      ) : (
        <EmptyMessage>제목·본문에서 검색할 단어를 입력하세요.</EmptyMessage>
      )}
    </CommunityShell>
  );
}

function CommunityNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const board = searchParams.get('board') ?? 'free';

  return (
    <div className="community-form-page">
      <div className="community-form-heading">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로">
          <ArrowLeft />
        </button>
        <h1>새 글</h1>
      </div>
      <div className="community-form-card">
        <PostForm initialBoard={getCommunityBoard(board) ? board : 'free'} />
      </div>
    </div>
  );
}

function CommunityMe() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'posts';
  const activeTab = TABS.find((item) => item.key === tab) ?? TABS[0];
  const myPosts = COMMUNITY_FIXTURE_POSTS.filter((post) => post.author.id === 'seed_minseo');
  const likedPosts = COMMUNITY_FIXTURE_POSTS.filter((post) => post.score >= 10);
  const bookmarks = COMMUNITY_FIXTURE_POSTS.filter((post) => post.boardId === 'free').slice(0, 2);

  return (
    <CommunityShell currentBoard={null}>
      <div className="community-page-title">
        <h1>내 활동</h1>
        <p>민서님이 남긴 글·댓글·좋아요</p>
      </div>
      <div className="community-sort-tabs">
        {TABS.map((item) => (
          <Link key={item.key} to={`/community/me?tab=${item.key}`} className={activeTab.key === item.key ? 'is-active' : ''}>
            {item.label}
          </Link>
        ))}
      </div>
      {activeTab.key === 'posts' && <PostListOrEmpty posts={myPosts} emptyMessage={activeTab.emptyMessage} />}
      {activeTab.key === 'comments' && (
        <ul className="community-post-list">
          {COMMUNITY_FIXTURE_COMMENTS.slice(0, 3).map((comment) => (
            <li key={comment.id} className="community-comment-card">
              <p>{comment.body}</p>
              <span>{formatCommunityRelative(comment.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
      {activeTab.key === 'likes' && <PostListOrEmpty posts={likedPosts} emptyMessage={activeTab.emptyMessage} />}
      {activeTab.key === 'bookmarks' && <PostListOrEmpty posts={bookmarks} emptyMessage={activeTab.emptyMessage} />}
    </CommunityShell>
  );
}

function CommunityPostDetail({ postId }: { postId: string | undefined }) {
  const [apiPost, setApiPost] = useState<CommunityPost | null>(null);
  const post = getCommunityPost(COMMUNITY_FIXTURE_POSTS, postId) ?? apiPost;

  useEffect(() => {
    if (!postId || getCommunityPost(COMMUNITY_FIXTURE_POSTS, postId)) return;
    let cancelled = false;
    fetch(`/api/community/posts?id=${encodeURIComponent(postId)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { item?: CommunityPost } | null) => {
        if (!cancelled) setApiPost(payload?.item ?? null);
      })
      .catch(() => {
        if (!cancelled) setApiPost(null);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  if (!post) {
    return (
      <div className="community-form-page">
        <EmptyMessage>글을 찾을 수 없어요.</EmptyMessage>
      </div>
    );
  }

  const board = getCommunityBoard(post.boardId);
  const authorName = post.anonymous ? '익명' : post.author.displayName;
  const comments = COMMUNITY_FIXTURE_COMMENTS.filter((comment) => comment.postId === post.id);

  return (
    <div className="community-detail">
      <article className="community-detail__article">
        {board ? (
          <Link to={`/community?board=${board.slug}`} className="community-board-pill">
            <span>{board.emoji}</span>
            {board.name}
          </Link>
        ) : null}
        <header>
          <h1>{post.title}</h1>
          <div>
            <span>{authorName}</span>
            <span aria-hidden>·</span>
            <time>{formatCommunityRelative(post.createdAt)}</time>
          </div>
        </header>
        <div className="community-separator" />
        <p className="community-detail__body">{post.body}</p>
        <div className="community-detail__actions">
          <button type="button">▲ {post.score}</button>
          <button type="button">북마크</button>
        </div>
      </article>

      <div className="community-separator" />

      <section className="community-comments">
        <h2>
          댓글 <span>{comments.length}</span>
        </h2>
        <div className="community-login-note">로그인하면 댓글을 남길 수 있어요</div>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <div>
                <span>{comment.anonymous ? '익명' : comment.author.displayName}</span>
                <time>{formatCommunityRelative(comment.createdAt)}</time>
              </div>
              <p>{comment.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CommunitySidebar({ currentBoard }: { currentBoard: string | null }) {
  return (
    <aside className="community-sidebar">
      <nav>
        <div>
          <SidebarLink to="/community" icon={<Home />} label="홈" active={currentBoard === null} />
          <SidebarLink
            to={`/community?board=${HOT_BOARD.slug}`}
            icon={<span>{HOT_BOARD.emoji}</span>}
            label={HOT_BOARD.name}
            active={currentBoard === HOT_BOARD.slug}
          />
          <SidebarLink to="/community/search" icon={<Search />} label="검색" active={false} />
        </div>
        <div>
          <p>게시판</p>
          {COMMUNITY_BOARDS.map((board) => (
            <SidebarLink
              key={board.slug}
              to={`/community?board=${board.slug}`}
              icon={<span>{board.emoji}</span>}
              label={board.name}
              active={currentBoard === board.slug}
            />
          ))}
        </div>
        <div>
          <p>내 활동</p>
          <SidebarLink to="/community/me?tab=posts" icon={<FileText />} label="내 글" active={false} />
          <SidebarLink to="/community/me?tab=comments" icon={<MessageSquare />} label="내 댓글" active={false} />
          <SidebarLink to="/community/me?tab=likes" icon={<Heart />} label="좋아요" active={false} />
          <SidebarLink to="/community/me?tab=bookmarks" icon={<Bookmark />} label="북마크" active={false} />
        </div>
      </nav>
    </aside>
  );
}

function SidebarLink({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link to={to} className={active ? 'is-active' : ''}>
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function BoardTabs({ currentBoard }: { currentBoard: string | null }) {
  return (
    <div className="community-board-tabs">
      <nav>
        <Tab to="/community" label="홈" active={currentBoard === null} />
        <Tab
          to={`/community?board=${HOT_BOARD.slug}`}
          label={`${HOT_BOARD.emoji} ${HOT_BOARD.name}`}
          active={currentBoard === HOT_BOARD.slug}
        />
        {COMMUNITY_BOARDS.map((board) => (
          <Tab
            key={board.slug}
            to={`/community?board=${board.slug}`}
            label={`${board.emoji} ${board.name}`}
            active={currentBoard === board.slug}
          />
        ))}
      </nav>
    </div>
  );
}

function Tab({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link to={to} className={active ? 'is-active' : ''}>
      {label}
    </Link>
  );
}

function SortTabs({ sort, newHref, topHref }: { sort: 'new' | 'top'; newHref: string; topHref: string }) {
  return (
    <div className="community-sort-tabs">
      <Link to={newHref} className={sort === 'new' ? 'is-active' : ''}>
        최신
      </Link>
      <Link to={topHref} className={sort === 'top' ? 'is-active' : ''}>
        인기
      </Link>
    </div>
  );
}

function PostCard({ post, showBoard = false }: { post: CommunityPost; showBoard?: boolean }) {
  const isHot = post.score >= 5;
  const board = getCommunityBoard(post.boardId);
  const authorName = post.anonymous ? '익명' : post.author.displayName;

  return (
    <li>
      <Link to={`/community/posts/${post.id}`} className="community-post-card">
        {showBoard && board ? (
          <div className="community-board-pill">
            <span>{board.emoji}</span>
            {board.name}
          </div>
        ) : null}
        <h2>
          {isHot ? <Flame /> : null}
          {post.title}
        </h2>
        {post.body ? <p>{post.body}</p> : null}
        <div className="community-post-meta">
          <span>{authorName}</span>
          <span aria-hidden>·</span>
          <time>{formatCommunityRelative(post.createdAt)}</time>
          <span aria-hidden className="community-post-meta__spacer">
            ·
          </span>
          <span className={post.score > 0 ? 'is-positive' : post.score < 0 ? 'is-negative' : ''}>▲ {post.score}</span>
          <span>
            <MessageSquare />
            {post.commentCount}
          </span>
        </div>
      </Link>
    </li>
  );
}

function SearchForm({ initialQuery = '' }: { initialQuery?: string }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/community/search?q=${encodeURIComponent(trimmed)}` : '/community/search');
  }

  return (
    <form onSubmit={submit} className="community-search-form">
      <Search />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="제목·본문에서 검색"
        autoFocus
      />
    </form>
  );
}

function PostForm({ initialBoard }: { initialBoard: string }) {
  const navigate = useNavigate();
  const [boardId, setBoardId] = useState(initialBoard);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [pending, setPending] = useState(false);
  const selectedBoard = getCommunityBoard(boardId);
  const anonymousLocked = selectedBoard?.alwaysAnonymous === true;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setPending(true);
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          boardId,
          anonymous: anonymousLocked || anonymous,
        }),
      });
      if (!response.ok) return;
      const payload = (await response.json()) as { id: string };
      navigate(`/community/posts/${payload.id}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="community-post-form" onSubmit={submit}>
      <div>
        <label>게시판</label>
        <div className="community-post-form__boards">
          {COMMUNITY_BOARDS.map((board) => (
            <button
              key={board.slug}
              type="button"
              onClick={() => setBoardId(board.slug)}
              className={boardId === board.slug ? 'is-active' : ''}
            >
              {board.emoji} {board.name}
            </button>
          ))}
        </div>
      </div>
      <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="제목을 입력하세요" />
      <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={12} placeholder="무슨 이야기를 나누고 싶나요?" />
      {anonymousLocked ? (
        <p>🤫 비밀게시판은 항상 익명으로 올라가요.</p>
      ) : (
        <label className="community-anonymous-check">
          <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} />
          <span>익명으로 작성</span>
          <small>(작성자가 ‘익명’으로 표시됩니다)</small>
        </label>
      )}
      <div className="community-post-form__actions">
        <Link to="/community">취소</Link>
        <button type="submit" disabled={pending}>
          {pending ? '저장 중...' : '올리기'}
        </button>
      </div>
    </form>
  );
}

function PostListOrEmpty({ posts, emptyMessage }: { posts: CommunityPost[]; emptyMessage: string }) {
  if (posts.length === 0) return <EmptyMessage>{emptyMessage}</EmptyMessage>;
  return (
    <ul className="community-post-list">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} showBoard />
      ))}
    </ul>
  );
}

function BoardExplore() {
  return (
    <div className="community-board-explore">
      <p>둘러보기</p>
      <div>
        {COMMUNITY_BOARDS.map((board) => (
          <Link key={board.slug} to={`/community?board=${board.slug}`}>
            {board.emoji} {board.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function EmptyMessage({ children }: { children: ReactNode }) {
  return <div className="community-empty">{children}</div>;
}
