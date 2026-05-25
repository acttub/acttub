import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('starts the ACTI flow through the quiz route', () => {
    render(<LandingPage />);

    expect(screen.getByRole('link', { name: /시작하기/ })).toHaveAttribute('href', '/ACTI/quiz');
  });
});
