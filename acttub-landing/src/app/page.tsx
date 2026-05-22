const landingMarkup = String.raw`<!-- Top bar -->
    <header class="topbar">
      <div class="topbar-inner">
        <a href="/" class="brand" aria-label="acttub 홈">
          act<span class="brand-accent">tub</span>
        </a>
        <form class="search" role="search" onsubmit="event.preventDefault()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input type="search" placeholder="검색어를 입력하세요" aria-label="검색" />
        </form>
        <a class="icon-btn" href="/team" aria-label="알림">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M10.268 21a2 2 0 0 0 3.464 0" />
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
          </svg>
        </a>
      </div>
    </header>

    <main>
      <div class="container">
        <!-- Service shortcuts -->
        <section class="shortcuts" aria-label="acttub 서비스 바로가기">
          <div class="shortcuts-grid">
            <a class="shortcut" href="/ACTI" aria-label="ACTI — 연기 스타일 진단">
              <span class="shortcut-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  <path d="M20 3v4" />
                  <path d="M22 5h-4" />
                </svg>
              </span>
              <span class="shortcut-label">ACTI 진단</span>
            </a>
            <a class="shortcut" href="/archive" aria-label="archive — 연기 영상 아카이브">
              <span class="shortcut-icon is-archive" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" />
                  <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                </svg>
              </span>
              <span class="shortcut-label">archive</span>
            </a>
            <a class="shortcut" href="/thea" aria-label="thea — 연극 추천">
              <span class="shortcut-icon is-thea" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  <path d="M13 5v2" />
                  <path d="M13 11v2" />
                  <path d="M13 17v2" />
                </svg>
              </span>
              <span class="shortcut-label">thea</span>
            </a>
            <a class="shortcut" href="/excer" aria-label="excer — 연기 연습실">
              <span class="shortcut-icon is-excer" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </span>
              <span class="shortcut-label">excer</span>
            </a>
          </div>
        </section>

        <!-- HOT 게시물 -->
        <section class="card" aria-label="실시간 인기글">
          <div class="card-header">
            <div class="card-header-left">
              <span class="card-badge">HOT</span>
              <h2 class="card-title">실시간 인기글</h2>
            </div>
            <a class="card-more" href="/community?sort=hot">
              더보기
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </div>
          <div class="hot-list">
            <a class="hot-item" href="/community/posts/1024">
              <span class="hot-rank">1</span>
              <span class="hot-item-body">
                <span class="hot-item-title">오디션 직전에 긴장 푸는 루틴 공유합니다</span>
                <span class="hot-item-meta">
                  <span>자유게시판</span><span>5분 전</span>
                </span>
              </span>
              <span class="hot-stats" aria-label="좋아요·댓글">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z"/></svg>
                42
                <span aria-hidden="true">·</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                18
              </span>
            </a>
            <a class="hot-item" href="/community/posts/1019">
              <span class="hot-rank">2</span>
              <span class="hot-item-body">
                <span class="hot-item-title">발성 연습 1년 해보고 느낀 것들 (장문)</span>
                <span class="hot-item-meta">
                  <span>자유게시판</span><span>32분 전</span>
                </span>
              </span>
              <span class="hot-stats" aria-label="좋아요·댓글">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z"/></svg>
                31
                <span aria-hidden="true">·</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                12
              </span>
            </a>
            <a class="hot-item" href="/community/posts/1011">
              <span class="hot-rank">3</span>
              <span class="hot-item-body">
                <span class="hot-item-title">ACTI 결과 ENFP-A로 나왔는데 진짜 맞는 듯 ㅋㅋ</span>
                <span class="hot-item-meta">
                  <span>자유게시판</span><span>1시간 전</span>
                </span>
              </span>
              <span class="hot-stats" aria-label="좋아요·댓글">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z"/></svg>
                28
                <span aria-hidden="true">·</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                9
              </span>
            </a>
          </div>
        </section>

        <!-- 자유게시판 -->
        <section class="card" aria-label="자유게시판 최신글">
          <div class="card-header">
            <div class="card-header-left">
              <h2 class="card-title">자유게시판</h2>
            </div>
            <a class="card-more" href="/community?board=free">
              더보기
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </div>
          <div class="post-list">
            <a class="post" href="/community/posts/1031">
              <div class="post-title-row">
                <span class="post-title">대학로 소극장 추천 좀 받을 수 있을까요?</span>
              </div>
              <span class="post-comments">[7]</span>
              <p class="post-snippet">이번 주말에 처음 가보려고 하는데 분위기 좋고 좌석 편한 곳 알려주세요.</p>
              <div class="post-meta">
                <span>익명</span>
                <span class="dot" aria-hidden="true"></span>
                <span>10분 전</span>
                <span class="dot" aria-hidden="true"></span>
                <span class="stat" aria-label="조회수">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  124
                </span>
              </div>
            </a>
            <a class="post" href="/community/posts/1030">
              <div class="post-title-row">
                <span class="post-title">독백 연습 어디서 하시나요</span>
              </div>
              <span class="post-comments">[12]</span>
              <p class="post-snippet">집에선 가족 눈치 보이고, 연습실은 비싸고… 다들 어떻게 해결하시는지 궁금해서요.</p>
              <div class="post-meta">
                <span>익명</span>
                <span class="dot" aria-hidden="true"></span>
                <span>34분 전</span>
                <span class="dot" aria-hidden="true"></span>
                <span class="stat" aria-label="조회수">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  286
                </span>
              </div>
            </a>
            <a class="post" href="/community/posts/1029">
              <div class="post-title-row">
                <span class="post-title">감정 끌어올리는 거 매번 어렵네요</span>
              </div>
              <span class="post-comments">[5]</span>
              <p class="post-snippet">대본 외우는 건 되는데, 막상 카메라 켜면 톤이 평탄해져요. 다들 어떻게 푸세요?</p>
              <div class="post-meta">
                <span>익명</span>
                <span class="dot" aria-hidden="true"></span>
                <span>1시간 전</span>
                <span class="dot" aria-hidden="true"></span>
                <span class="stat" aria-label="조회수">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  192
                </span>
              </div>
            </a>
            <a class="post" href="/community/posts/1028">
              <div class="post-title-row">
                <span class="post-title">archive에 영상 올리면 비공개 진짜로 보장되나요?</span>
              </div>
              <span class="post-comments">[3]</span>
              <p class="post-snippet">민감한 영상이라서요. 운영진이 볼 수도 있는 건지 궁금합니다.</p>
              <div class="post-meta">
                <span>익명</span>
                <span class="dot" aria-hidden="true"></span>
                <span>2시간 전</span>
                <span class="dot" aria-hidden="true"></span>
                <span class="stat" aria-label="조회수">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  98
                </span>
              </div>
            </a>
            <a class="post" href="/community/posts/1027">
              <div class="post-title-row">
                <span class="post-title">오디션 자유연기 1분 30초 추천 작품 있을까요</span>
              </div>
              <span class="post-comments">[9]</span>
              <p class="post-snippet">너무 흔한 거 말고, 20대 초반 여자 캐릭터로 부담스럽지 않은 거면 좋겠어요.</p>
              <div class="post-meta">
                <span>익명</span>
                <span class="dot" aria-hidden="true"></span>
                <span>3시간 전</span>
                <span class="dot" aria-hidden="true"></span>
                <span class="stat" aria-label="조회수">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  421
                </span>
              </div>
            </a>
            <a class="post" href="/community/posts/1026">
              <div class="post-title-row">
                <span class="post-title">연기 학원 안 다니고 혼자 하는 분 계세요?</span>
              </div>
              <span class="post-comments">[18]</span>
              <p class="post-snippet">독학으로 어디까지 갈 수 있을지 궁금해서요. 경험담 부탁드려요.</p>
              <div class="post-meta">
                <span>익명</span>
                <span class="dot" aria-hidden="true"></span>
                <span>5시간 전</span>
                <span class="dot" aria-hidden="true"></span>
                <span class="stat" aria-label="조회수">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  733
                </span>
              </div>
            </a>
          </div>
        </section>
      </div>
    </main>

    <a class="fab" href="/community/write" aria-label="새 글 작성">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    </a>

    <footer>
      <a href="/team">우리 팀 소개</a>
      <span>© acttub</span>
    </footer>`;

export default function HomePage() {
  return <div className="landing-root" dangerouslySetInnerHTML={{ __html: landingMarkup }} />;
}
