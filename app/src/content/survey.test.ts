import { describe, expect, it } from 'vitest';
import { SURVEY_QUESTIONS } from './survey';

describe('content.survey invariants', () => {
  it('defines required single-choice questions with usable options', () => {
    expect(SURVEY_QUESTIONS.length).toBeGreaterThan(0);

    for (const question of SURVEY_QUESTIONS) {
      expect(question.id.trim()).toHaveLength(question.id.length);
      expect(question.label.trim().length).toBeGreaterThan(0);
      expect(question.required).toBe(true);
      expect(question.options.length).toBeGreaterThanOrEqual(2);

      const optionValues = new Set(question.options.map((option) => option.value));
      expect(optionValues.size).toBe(question.options.length);

      for (const option of question.options) {
        expect(option.value.trim().length).toBeGreaterThan(0);
        expect(option.label.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
