import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RootLandingPage from './RootLandingPage';

describe('RootLandingPage', () => {
  it('links the coach entry points to the coach route', () => {
    render(<RootLandingPage />);

    const coachLinks = screen.getAllByRole('link', { name: 'coach - 연기 연습 피드백' });
    expect(coachLinks).toHaveLength(2);
    for (const link of coachLinks) {
      expect(link).toHaveAttribute('href', '/coach');
    }
  });

  it('uses path-based links for the main product shortcuts', () => {
    render(<RootLandingPage />);

    expect(screen.getByRole('link', { name: 'ACTI - 연기 스타일 진단' })).toHaveAttribute('href', '/ACTI');
    expect(screen.getByRole('link', { name: 'archive - 연기 영상 아카이브' })).toHaveAttribute('href', '/archive');
    expect(screen.getByRole('link', { name: 'thea - 연극 추천' })).toHaveAttribute('href', '/thea');
    expect(screen.getByRole('link', { name: 'excer - 연기 연습실' })).toHaveAttribute('href', '/excer');
  });

  it('links community surfaces to route URLs instead of in-place state', () => {
    render(<RootLandingPage />);

    const moreLinks = screen.getAllByRole('link', { name: '더보기' });
    expect(moreLinks[0]).toHaveAttribute('href', '/community?sort=hot');
    expect(moreLinks[1]).toHaveAttribute('href', '/community?board=free');
    expect(screen.getByRole('link', { name: '새 글 작성' })).toHaveAttribute('href', '/community/write');
  });
});
