'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import {
  Clapperboard,
  Globe,
  Library,
  Link as LinkIcon,
  Lock,
  Plus,
  Search,
} from 'lucide-react';
import {
  filterArchiveVideos,
  formatArchiveBytes,
  formatArchiveDuration,
  formatArchiveRelative,
  getArchiveVideo,
  type ArchiveVideo,
  type ArchiveVisibility,
} from '../archive/archiveData';
import { ARCHIVE_FIXTURE_VIDEOS } from '../archive/fixtures';

const VIS_OPTIONS: Array<{
  value: ArchiveVisibility;
  Icon: typeof Globe;
  label: string;
  desc: string;
}> = [
  { value: 'private', Icon: Lock, label: '비공개', desc: '나만 볼 수 있어요. 기본값이에요.' },
  { value: 'unlisted', Icon: LinkIcon, label: '링크 공유', desc: '공유 링크를 받은 사람만 볼 수 있어요.' },
  { value: 'public', Icon: Globe, label: '전체 공개', desc: '누구나 검색·피드에서 볼 수 있어요.' },
];

export default function ArchivePage() {
  const pathname = usePathname() ?? '/archive';
  const normalizedPath = pathname.replace(/^\/archive/, '') || '/';

  let content;
  if (normalizedPath === '/search') content = <ArchiveSearch />;
  else if (normalizedPath === '/upload') content = <ArchiveUpload />;
  else if (normalizedPath === '/me') content = <ArchiveMe />;
  else if (normalizedPath.startsWith('/videos/')) {
    const id = normalizedPath.split('/').filter(Boolean).at(-1);
    content = <ArchiveVideoDetail videoId={id} />;
  } else {
    content = <ArchiveHome />;
  }

  return (
    <div className="archive-page">
      <ArchiveHeader />
      <main>{content}</main>
    </div>
  );
}

function ArchiveHeader() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/archive/search?q=${encodeURIComponent(trimmed)}` : '/archive/search');
  }

  return (
    <header className="archive-header">
      <div className="archive-header__inner">
        <Link href="/archive" className="archive-brand">
          <span>
            act<span>tub</span>
          </span>
          <small>archive</small>
        </Link>

        <form onSubmit={submit} className="archive-header-search">
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="제목·태그·배역으로 검색"
            aria-label="archive 검색"
          />
        </form>

        <div className="archive-header-actions">
          <Link href="/archive/me" className="archive-button archive-button--ghost archive-button--sm archive-hide-mobile">
            <Library />
            내 보관함
          </Link>
          <Link href="/archive/upload" className="archive-button archive-button--primary archive-button--sm">
            <Plus />
            <span>업로드</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function ArchiveHome() {
  const recent = filterArchiveVideos(ARCHIVE_FIXTURE_VIDEOS, {});

  return (
    <div className="archive-container archive-home">
      <div className="archive-heading-row">
        <div>
          <h1>공유된 연기</h1>
          <p>
            전체 공개로 올라온 영상들. 내 영상은{' '}
            <Link href="/archive/me">내 보관함</Link>
            에서 따로 볼 수 있어요.
          </p>
        </div>
        <Link href="/archive/me" className="archive-button archive-button--outline archive-button--sm">
          <Lock />내 보관함
        </Link>
      </div>

      {recent.length === 0 ? <ArchiveEmptyPublic /> : <VideoGrid videos={recent} />}
    </div>
  );
}

function ArchiveSearch() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() || null;
  const tag = searchParams.get('tag')?.trim() || null;
  const results = filterArchiveVideos(ARCHIVE_FIXTURE_VIDEOS, { query, tag });

  return (
    <div className="archive-container archive-search-page">
      <div className="archive-search-heading">
        <h1>검색 결과</h1>
        {query ? <span>검색어: {query}</span> : null}
        {tag ? <span>#{tag}</span> : null}
        <Link href="/archive">홈으로</Link>
      </div>
      {results.length === 0 ? (
        <div className="archive-dashed-empty">결과가 없어요.</div>
      ) : (
        <VideoGrid videos={results} compact />
      )}
    </div>
  );
}

function ArchiveUpload() {
  return (
    <div className="archive-form-page">
      <h1>새 영상 업로드</h1>
      <p>파일은 그대로 Vercel Blob 에 저장되고, 메타데이터만 DB에 기록됩니다.</p>
      <UploadForm />
    </div>
  );
}

function ArchiveMe() {
  const [tab, setTab] = useState<'videos' | 'bookmarks' | 'playlists'>('videos');
  const myVideos = filterArchiveVideos(ARCHIVE_FIXTURE_VIDEOS, { includePrivate: true }).filter(
    (video) => video.user.username === 'minseo01',
  );
  const bookmarks = filterArchiveVideos(ARCHIVE_FIXTURE_VIDEOS, {}).slice(0, 2);

  return (
    <div className="archive-container archive-me">
      <div className="archive-me-heading">
        <h1>내 아카이브</h1>
        <a href="/archive/u/minseo01">공개 프로필 보기</a>
      </div>
      <div className="archive-tabs">
        <button className={tab === 'videos' ? 'is-active' : ''} type="button" onClick={() => setTab('videos')}>
          내 영상 {myVideos.length}
        </button>
        <button className={tab === 'bookmarks' ? 'is-active' : ''} type="button" onClick={() => setTab('bookmarks')}>
          북마크 {bookmarks.length}
        </button>
        <button className={tab === 'playlists' ? 'is-active' : ''} type="button" onClick={() => setTab('playlists')}>
          플레이리스트 0
        </button>
      </div>
      <div className="archive-tab-content">
        {tab === 'videos' && (myVideos.length === 0 ? <ArchiveSmallEmpty text="아직 올린 영상이 없어요." /> : <VideoGrid videos={myVideos} compact />)}
        {tab === 'bookmarks' && (bookmarks.length === 0 ? <ArchiveSmallEmpty text="북마크한 영상이 없어요." /> : <VideoGrid videos={bookmarks} compact />)}
        {tab === 'playlists' && <ArchiveSmallEmpty text="플레이리스트가 없어요." cta={{ href: '/archive/playlists/new', label: '만들기' }} />}
      </div>
    </div>
  );
}

function ArchiveVideoDetail({ videoId }: { videoId: string | undefined }) {
  const [apiVideo, setApiVideo] = useState<ArchiveVideo | null>(null);
  const video = getArchiveVideo(ARCHIVE_FIXTURE_VIDEOS, videoId) ?? apiVideo;

  useEffect(() => {
    if (!videoId || getArchiveVideo(ARCHIVE_FIXTURE_VIDEOS, videoId)) return;
    let cancelled = false;
    fetch(`/api/archive/videos?id=${encodeURIComponent(videoId)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { item?: ArchiveVideo } | null) => {
        if (!cancelled) setApiVideo(payload?.item ?? null);
      })
      .catch(() => {
        if (!cancelled) setApiVideo(null);
      });
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  if (!video) {
    return (
      <div className="archive-form-page">
        <div className="archive-dashed-empty">영상을 찾을 수 없어요.</div>
      </div>
    );
  }

  return (
    <div className="archive-video-detail">
      <div className="archive-video-player">
        <div>
          <Clapperboard />
          <span>영상 미리보기</span>
        </div>
      </div>
      <div className="archive-video-meta">
        <h1>{video.title}</h1>
        <p>
          조회 {video.viewCount.toLocaleString()}회 · {formatArchiveRelative(video.createdAt)}
        </p>
        <div>
          {video.tags.map((tag) => (
            <Link key={tag} href={`/archive/search?tag=${encodeURIComponent(tag)}`}>
              #{tag}
            </Link>
          ))}
        </div>
        {video.description ? <p>{video.description}</p> : null}
      </div>
    </div>
  );
}

function VideoGrid({ videos, compact = false }: { videos: ArchiveVideo[]; compact?: boolean }) {
  return (
    <div className={`archive-grid ${compact ? 'archive-grid--compact' : ''}`}>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

function VideoCard({ video }: { video: ArchiveVideo }) {
  return (
    <Link href={`/archive/videos/${video.id}`} className="archive-video-card">
      <div className="archive-video-thumb">
        {video.thumbnailUrl ? <img src={video.thumbnailUrl} alt={video.title} loading="lazy" /> : <div>미리보기 없음</div>}
        {video.durationSec ? <span>{formatArchiveDuration(video.durationSec)}</span> : null}
      </div>
      <div className="archive-video-card__meta">
        {video.user.avatarUrl ? <img src={video.user.avatarUrl} alt="" loading="lazy" /> : <div />}
        <div>
          <h2>{video.title}</h2>
          <p>{video.user.displayName}</p>
          <p>
            조회 {video.viewCount.toLocaleString()}회 · {formatArchiveRelative(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function UploadForm() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [visibility, setVisibility] = useState<ArchiveVisibility>('private');
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    setPending(true);
    try {
      const blob = selectedFile
        ? await upload(`archive/${Date.now()}-${selectedFile.name}`, selectedFile, {
            access: 'public',
            handleUploadUrl: '/api/archive/upload',
            contentType: selectedFile.type || undefined,
            multipart: selectedFile.size > 100 * 1024 * 1024,
          })
        : null;
      const response = await fetch('/api/archive/videos', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description.trim() || null,
          tags: tagsInput
            .split(/[,\n]/g)
            .map((tag) => tag.trim())
            .filter(Boolean),
          visibility,
          blobUrl: blob?.url,
          blobPathname: blob?.pathname,
          mimeType: selectedFile?.type || null,
          sizeBytes: selectedFile?.size ?? null,
          durationSec: null,
        }),
      });
      if (!response.ok) return;
      const payload = (await response.json()) as { id: string };
      router.push(`/archive/videos/${payload.id}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="archive-upload-form" onSubmit={submit}>
      <div>
        <label htmlFor="archive-file">영상 파일</label>
        <input
          id="archive-file"
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/x-msvideo"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setSelectedFile(file);
            setFileName(file ? `${file.name} · ${formatArchiveBytes(file.size)}` : '');
            if (file && !title) setTitle(file.name.replace(/\.[^.]+$/, ''));
          }}
        />
        <p>{fileName || 'mp4, webm, mov, mkv, avi'}</p>
      </div>

      <div>
        <label htmlFor="archive-title">제목</label>
        <input id="archive-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} required />
      </div>

      <div>
        <label htmlFor="archive-description">설명 (선택)</label>
        <textarea
          id="archive-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          maxLength={5000}
          placeholder="작품, 배역, 장면, 인상적인 포인트 등"
        />
      </div>

      <div>
        <label htmlFor="archive-tags">태그 (콤마로 구분)</label>
        <input
          id="archive-tags"
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
          placeholder="예: 햄릿, 독백, 감정폭발"
        />
      </div>

      <fieldset>
        <legend>공개 범위</legend>
        <div className="archive-visibility-options">
          {VIS_OPTIONS.map(({ value, Icon, label, desc }) => {
            const selected = visibility === value;
            return (
              <label key={value} className={selected ? 'is-selected' : ''}>
                <input
                  type="radio"
                  name="visibility"
                  value={value}
                  checked={selected}
                  onChange={() => setVisibility(value)}
                />
                <div>
                  <Icon />
                </div>
                <span>
                  <strong>
                    {label}
                    {value === 'private' ? <em>기본</em> : null}
                  </strong>
                  <small>{desc}</small>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <button type="submit" className="archive-submit-button" disabled={pending}>
        {pending ? '저장 중...' : '업로드'}
      </button>
    </form>
  );
}

function ArchiveEmptyPublic() {
  return (
    <div className="archive-empty-public">
      <div>
        <Clapperboard />
      </div>
      <h2>아직 공유된 영상이 없어요</h2>
      <p>
        업로드한 영상은 기본적으로 비공개예요.
        <br />
        남들에게 보여주고 싶을 때만 전체 공개로 바꿔주세요.
      </p>
      <Link href="/archive/upload" className="archive-button archive-button--primary archive-button--lg">
        새 영상 올리기
      </Link>
    </div>
  );
}

function ArchiveSmallEmpty({ text, cta }: { text: string; cta?: { href: string; label: string } }) {
  return (
    <div className="archive-dashed-empty">
      {text}
      {cta ? (
        <>
          {' '}
          <Link href={cta.href}>{cta.label}</Link>
        </>
      ) : null}
    </div>
  );
}
