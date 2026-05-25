import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ExcerPage from './ExcerPage';

const routerMocks = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/excer',
  useRouter: () => ({
    push: routerMocks.push,
    replace: routerMocks.replace,
    back: routerMocks.back,
  }),
}));

describe('ExcerPage', () => {
  beforeEach(() => {
    routerMocks.push.mockClear();
    routerMocks.replace.mockClear();
    routerMocks.back.mockClear();
  });

  it('keeps practice room cards on detail route URLs', () => {
    render(<ExcerPage />);

    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        '/excer/rooms/hyehwa-coral-studio',
        '/excer/rooms/daehakro-script-lab',
        '/excer/rooms/hongdae-mirror-room',
      ])
    );
  });

  it('stores search input changes in the excer route query', () => {
    render(<ExcerPage />);

    fireEvent.change(screen.getByRole('searchbox', { name: '동 또는 지하철역으로 검색' }), {
      target: { value: '혜화' },
    });

    expect(routerMocks.replace).toHaveBeenCalledWith('/excer?q=%ED%98%9C%ED%99%94');
  });
});
