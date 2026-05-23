import { describe, expect, it } from 'vitest';
import {
  filterArchiveVideos,
  formatArchiveDuration,
  getArchiveVideo,
  type ArchiveVideo,
} from './archiveData';

const videos: ArchiveVideo[] = [
  {
    id: 'v1',
    title: '햄릿 독백 연습',
    description: '감정선을 점검한 영상',
    thumbnailUrl: null,
    durationSec: 75,
    createdAt: new Date('2026-05-20T00:00:00.000Z'),
    viewCount: 120,
    visibility: 'public',
    tags: ['햄릿', '독백'],
    user: { username: 'minseo', displayName: '민서', avatarUrl: null },
  },
  {
    id: 'v2',
    title: '장면 호흡 리허설',
    description: '상대와 템포를 맞춘 기록',
    thumbnailUrl: null,
    durationSec: 3725,
    createdAt: new Date('2026-05-21T00:00:00.000Z'),
    viewCount: 7,
    visibility: 'private',
    tags: ['리허설'],
    user: { username: 'jihoon', displayName: '지훈', avatarUrl: null },
  },
];

describe('archive data helpers', () => {
  it('formats video duration like the original archive app', () => {
    expect(formatArchiveDuration(75)).toBe('1:15');
    expect(formatArchiveDuration(3725)).toBe('1:02:05');
  });

  it('lists only public videos unless includePrivate is set', () => {
    expect(filterArchiveVideos(videos, {}).map((video) => video.id)).toEqual(['v1']);
    expect(filterArchiveVideos(videos, { includePrivate: true }).map((video) => video.id)).toEqual(['v2', 'v1']);
  });

  it('searches title, description, and tags', () => {
    expect(filterArchiveVideos(videos, { query: '감정' }).map((video) => video.id)).toEqual(['v1']);
    expect(filterArchiveVideos(videos, { tag: '리허설', includePrivate: true }).map((video) => video.id)).toEqual(['v2']);
  });

  it('gets a video by id', () => {
    expect(getArchiveVideo(videos, 'v1')?.title).toBe('햄릿 독백 연습');
    expect(getArchiveVideo(videos, 'missing')).toBeNull();
  });
});
