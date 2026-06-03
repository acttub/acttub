import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SurveyPage from './SurveyPage';
import { SURVEY_ITEMS } from '../content/survey';
import { setMyTypeCode } from '../lib/storage';

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
  usePathname: () => '/ACTI/survey',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

function renderSurvey() {
  return render(<SurveyPage />);
}

describe('SurveyPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    routerMocks.push.mockClear();
    routerMocks.replace.mockClear();
    routerMocks.back.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('redirects to the quiz when there is no stored result code', async () => {
    renderSurvey();
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(routerMocks.replace).toHaveBeenCalledWith('/ACTI/quiz');
  });

  it('renders the first radio question and advances after picking an option', async () => {
    setMyTypeCode('MINB');
    renderSurvey();

    const firstItem = SURVEY_ITEMS[0];
    if (firstItem.kind !== 'radio') {
      throw new Error('Test fixture assumes first item is radio');
    }

    // first question label visible
    expect(screen.getByText((t) => t.includes(firstItem.label))).toBeInTheDocument();

    // pick first option
    fireEvent.click(screen.getByText(firstItem.options[0].label));

    // auto-advance triggers a setTimeout — fast-forward
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    const secondItem = SURVEY_ITEMS[1];
    if (secondItem.kind === 'section') return; // shape-dependent; sanity not required
    expect(screen.getByText((t) => t.includes(secondItem.label))).toBeInTheDocument();
  });

  it('shows the contact question after opting into future service updates', async () => {
    setMyTypeCode('MINB');
    renderSurvey();

    for (const item of SURVEY_ITEMS) {
      if (item.kind === 'section' || item.kind === 'text') continue;

      expect(screen.getByText((text) => text.includes(item.label))).toBeInTheDocument();
      const option = item.id === 'future-updates'
        ? item.options.find((candidate) => candidate.value === 'yes')
        : item.options[0];
      if (!option) throw new Error(`Missing option for ${item.id}`);

      fireEvent.click(screen.getByText(option.label));

      if (item.kind === 'radio') {
        await act(async () => {
          await vi.runOnlyPendingTimersAsync();
        });
      } else {
        fireEvent.click(screen.getByRole('button', { name: /다음/ }));
      }
    }

    const contact = SURVEY_ITEMS.find((item) => item.kind === 'text' && item.id === 'contact');
    if (!contact || contact.kind !== 'text') throw new Error('Missing contact survey item');
    expect(screen.getByText((text) => text.includes(contact.label))).toBeInTheDocument();
    expect(routerMocks.replace).not.toHaveBeenCalledWith('/ACTI/result/MINB');
  });
});
