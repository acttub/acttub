import { describe, it, expect } from 'vitest';
import { buildFortunePrompt, parseFortune } from './fortunePrompt';

describe('parseFortune', () => {
  it('parses fenced json and clamps stars to 1-5', () => {
    const text = '```json\n{"oneLiner":"a","emotion":"b","condition":{"stars":9,"comment":"c"},"line":"d","mission":"e"}\n```';
    const fortune = parseFortune(text);
    expect(fortune.condition.stars).toBe(5);
    expect(fortune.oneLiner).toBe('a');
    expect(fortune.line).toBe('d');
  });

  it('parses bare json without fences', () => {
    const text = 'noise {"oneLiner":"a","emotion":"b","condition":{"stars":3,"comment":"c"},"line":"d","mission":"e"} trailing';
    const fortune = parseFortune(text);
    expect(fortune.condition.stars).toBe(3);
  });

  it('throws when no json present', () => {
    expect(() => parseFortune('운세를 못 봤어요')).toThrow();
  });

  it('throws when required fields are empty', () => {
    const text = '{"oneLiner":"","emotion":"b","condition":{"stars":3,"comment":"c"},"line":"d","mission":"e"}';
    expect(() => parseFortune(text)).toThrow();
  });
});

describe('buildFortunePrompt', () => {
  it('includes the seed values', () => {
    const prompt = buildFortunePrompt({ birth: '1999-03-12', role: '햄릿', work: '햄릿' });
    expect(prompt).toContain('햄릿');
    expect(prompt).toContain('1999-03-12');
    expect(prompt).toContain('JSON');
  });
});
