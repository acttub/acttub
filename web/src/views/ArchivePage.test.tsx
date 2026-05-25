import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ArchivePage from './ArchivePage';

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

describe('ArchivePage', () => {
  beforeEach(() => {
    routerMocks.push.mockClear();
    routerMocks.replace.mockClear();
    routerMocks.back.mockClear();
  });

  it('keeps archive header actions on route URLs', () => {
    render(<ArchivePage />);

    expect(screen.getByRole('link', { name: /acttubarchive/ })).toHaveAttribute('href', '/archive');
    expect(screen.getAllByRole('link', { name: /내 보관함/ })[0]).toHaveAttribute('href', '/archive/me');
    expect(screen.getByRole('link', { name: /업로드/ })).toHaveAttribute('href', '/archive/upload');
  });

  it('pushes archive search submissions to the search route', () => {
    render(<ArchivePage />);

    fireEvent.change(screen.getByRole('textbox', { name: 'archive 검색' }), {
      target: { value: '햄릿 독백' },
    });
    fireEvent.submit(screen.getByRole('textbox', { name: 'archive 검색' }).closest('form')!);

    expect(routerMocks.push).toHaveBeenCalledWith('/archive/search?q=%ED%96%84%EB%A6%BF%20%EB%8F%85%EB%B0%B1');
  });

  it('links archive content cards and profile surfaces to path URLs', () => {
    render(<ArchivePage view="me" />);

    expect(screen.getByRole('link', { name: '공개 프로필 보기' })).toHaveAttribute('href', '/archive/u/minseo01');
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(
      expect.arrayContaining([
        '/archive/videos/hamlet-monologue',
        '/archive/videos/private-voice-note',
      ])
    );
  });
});
