export type ArchiveVisibility = 'public' | 'unlisted' | 'private';

export type ArchiveVideo = {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  durationSec: number | null;
  createdAt: Date;
  viewCount: number;
  visibility: ArchiveVisibility;
  tags: string[];
  user: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
};

export type ArchiveFilter = {
  query?: string | null;
  tag?: string | null;
  includePrivate?: boolean;
};

export function formatArchiveDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatArchiveRelative(date: Date | string | number) {
  const d = typeof date === 'object' ? date : new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`;
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatArchiveBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export function filterArchiveVideos(videos: ArchiveVideo[], filter: ArchiveFilter): ArchiveVideo[] {
  const query = filter.query?.trim().toLowerCase() || '';
  const tag = filter.tag?.trim().toLowerCase() || '';

  return videos
    .filter((video) => filter.includePrivate || video.visibility === 'public')
    .filter((video) => {
      if (!query) return true;
      return (
        video.title.toLowerCase().includes(query) ||
        (video.description?.toLowerCase().includes(query) ?? false) ||
        video.tags.some((item) => item.toLowerCase().includes(query))
      );
    })
    .filter((video) => {
      if (!tag) return true;
      return video.tags.some((item) => item.toLowerCase() === tag);
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getArchiveVideo(videos: ArchiveVideo[], id: string | undefined): ArchiveVideo | null {
  if (!id) return null;
  return videos.find((video) => video.id === id) ?? null;
}
