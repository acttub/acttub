import { describe, it, expect } from 'vitest';
import { buildFortunePrompt, parseFortune } from './fortunePrompt';

const full = {
  overall: { stars: 4, summary: '망설임이 무기가 되는 날. 감정은 미루지 마.' },
  aspects: {
    emotion: { stars: 5, comment: '억눌린 분노가 터진다' },
    delivery: { stars: 3, comment: '호흡이 짧아질 수 있음' },
    focus: { stars: 4, comment: '긴장이 몰입으로' },
    rapport: { stars: 3, comment: '리액션을 늦게 받아라' },
  },
  lucky: { emotion: '체념 뒤의 분노', warmup: '복식호흡 10번', mood: '차가운 블루' },
  line: { quote: '사느냐 죽느냐, 그것이 문제로다', note: '묻는 채로 둬라' },
  mission: '독백 첫 문장을 3가지 감정으로',
  caution: '잘하려는 마음이 앞서면 대사가 빨라진다',
};

describe('parseFortune', () => {
  it('parses fenced json and clamps stars to 1-5', () => {
    const text = '```json\n' + JSON.stringify({ ...full, overall: { stars: 9, summary: full.overall.summary } }) + '\n```';
    const fortune = parseFortune(text);
    expect(fortune.overall.stars).toBe(5);
    expect(fortune.overall.summary).toContain('망설임');
    expect(fortune.line.quote).toContain('사느냐');
  });

  it('parses bare json without fences and keeps all sections', () => {
    const text = 'noise ' + JSON.stringify(full) + ' trailing';
    const fortune = parseFortune(text);
    expect(fortune.aspects.emotion.stars).toBe(5);
    expect(fortune.aspects.delivery.comment).toBe('호흡이 짧아질 수 있음');
    expect(fortune.lucky.mood).toBe('차가운 블루');
    expect(fortune.mission).toContain('독백');
    expect(fortune.caution).toContain('대사가 빨라진다');
  });

  it('defaults missing aspect stars to 3', () => {
    const partial = { ...full, aspects: { ...full.aspects, focus: { comment: '코멘트만' } } };
    const fortune = parseFortune(JSON.stringify(partial));
    expect(fortune.aspects.focus.stars).toBe(3);
  });

  it('throws when no json present', () => {
    expect(() => parseFortune('운세를 못 봤어요')).toThrow();
  });

  it('throws when a required field is empty', () => {
    const bad = { ...full, overall: { stars: 4, summary: '' } };
    expect(() => parseFortune(JSON.stringify(bad))).toThrow();
  });
});

describe('buildFortunePrompt', () => {
  it('includes the seed values and the JSON schema cue', () => {
    const prompt = buildFortunePrompt({ birth: '1999-03-12', role: '햄릿', work: '햄릿' });
    expect(prompt).toContain('햄릿');
    expect(prompt).toContain('1999-03-12');
    expect(prompt).toContain('JSON');
    expect(prompt).toContain('overall');
    expect(prompt).toContain('aspects');
  });
});
