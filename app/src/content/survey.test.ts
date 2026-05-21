import { describe, expect, it } from 'vitest';
import { SURVEY_ITEMS } from './survey';

describe('content.survey invariants', () => {
  it('defines at least one renderable question', () => {
    expect(SURVEY_ITEMS.length).toBeGreaterThan(0);
    expect(SURVEY_ITEMS.some((it) => it.kind !== 'section')).toBe(true);
  });

  it('every non-section item has unique id and stable entryId', () => {
    const ids = new Set<string>();
    const entryIds = new Set<number>();
    for (const item of SURVEY_ITEMS) {
      expect(item.id.trim()).toHaveLength(item.id.length);
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);
      if (item.kind === 'section') continue;
      expect(Number.isFinite(item.entryId)).toBe(true);
      expect(entryIds.has(item.entryId)).toBe(false);
      entryIds.add(item.entryId);
      expect(item.label.trim().length).toBeGreaterThan(0);
    }
  });

  it('radio and checkbox items have at least 2 unique non-empty options', () => {
    for (const item of SURVEY_ITEMS) {
      if (item.kind !== 'radio' && item.kind !== 'checkbox') continue;
      expect(item.options.length).toBeGreaterThanOrEqual(2);
      const values = new Set(item.options.map((o) => o.value));
      expect(values.size).toBe(item.options.length);
      for (const opt of item.options) {
        expect(opt.value.trim().length).toBeGreaterThan(0);
        expect(opt.label.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('checkbox items with maxSelect have at least that many options', () => {
    for (const item of SURVEY_ITEMS) {
      if (item.kind !== 'checkbox' || !item.maxSelect) continue;
      expect(item.options.length).toBeGreaterThanOrEqual(item.maxSelect);
    }
  });

  it('every showIf references an existing earlier radio item', () => {
    const seenIds = new Map<string, string>(); // id -> kind
    for (const item of SURVEY_ITEMS) {
      if (item.kind !== 'section' && 'showIf' in item && item.showIf) {
        const targetKind = seenIds.get(item.showIf.id);
        expect(targetKind).toBe('radio');
      }
      seenIds.set(item.id, item.kind);
    }
  });
});
