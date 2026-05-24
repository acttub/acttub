import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TheaPage from './TheaPage';

describe('TheaPage', () => {
  it('keeps theater recommendation cards on detail route URLs', () => {
    render(<TheaPage />);

    const detailHrefs = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
      .filter((href): href is string => href?.startsWith('/thea/plays/') === true);

    expect(detailHrefs).toHaveLength(3);
    for (const href of detailHrefs) {
      expect(href).toMatch(/^\/thea\/plays\/[a-z0-9-]+$/);
    }
  });

  it('keeps local section actions as hash links instead of changing the route', () => {
    render(<TheaPage />);

    expect(screen.getAllByRole('link', { name: /취향 입력하기|추천 받기/ }).map((link) => link.getAttribute('href'))).toEqual(
      ['#recommend', '#recommend']
    );
    expect(screen.getAllByRole('link', { name: /추천 예시 보기|오늘의 연극/ }).map((link) => link.getAttribute('href'))).toEqual(
      ['#picks', '#picks']
    );
  });
});
