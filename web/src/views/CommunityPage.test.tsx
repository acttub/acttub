import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CommunityPage from './CommunityPage';

const routerMocks = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerMocks.push,
    replace: routerMocks.replace,
    back: routerMocks.back,
  }),
}));

describe('CommunityPage', () => {
  beforeEach(() => {
    routerMocks.push.mockClear();
    routerMocks.replace.mockClear();
    routerMocks.back.mockClear();
  });

  it('keeps community navigation on route URLs', () => {
    render(<CommunityPage />);

    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        '/community',
        '/community/search',
        '/community?sort=new',
        '/community?sort=top',
        '/community?board=hot',
        '/community?board=free',
        '/community?board=secret',
        '/community?board=promo',
        '/community/me?tab=posts',
        '/community/me?tab=comments',
        '/community/me?tab=likes',
        '/community/me?tab=bookmarks',
        '/community/new',
      ])
    );
  });

  it('links post cards to detail route URLs', () => {
    render(<CommunityPage />);

    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        '/community/posts/1024',
        '/community/posts/1031',
        '/community/posts/1026',
      ])
    );
  });

  it('pushes community search submissions to the search route', () => {
    render(<CommunityPage view="search" />);

    fireEvent.change(screen.getByPlaceholderText('제목·본문에서 검색'), {
      target: { value: '연기 루틴' },
    });
    fireEvent.submit(screen.getByPlaceholderText('제목·본문에서 검색').closest('form')!);

    expect(routerMocks.push).toHaveBeenCalledWith('/community/search?q=%EC%97%B0%EA%B8%B0%20%EB%A3%A8%ED%8B%B4');
  });
});
