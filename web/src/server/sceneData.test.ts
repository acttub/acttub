import { describe, it, expect } from 'vitest';
import { SCENES, getSceneById, userLineOf, cueLineOf, scriptTextOf } from './sceneData';

describe('sceneData', () => {
  it('모든 씬은 사용자 턴이 정확히 1개다 (MVP 전제)', () => {
    for (const scene of SCENES) {
      const userTurns = scene.turns.filter((turn) => turn.role === 'user');
      expect(userTurns.length, scene.id).toBe(1);
    }
  });

  it('모든 씬은 사용자 턴 앞에 상대역 큐가 있다', () => {
    for (const scene of SCENES) {
      expect(cueLineOf(scene), scene.id).not.toBe('');
    }
  });

  it('id로 씬을 찾고, 없으면 undefined', () => {
    expect(getSceneById('breakup')?.title).toBe('오랜 연인과의 이별');
    expect(getSceneById('nope')).toBeUndefined();
  });

  it('userLineOf는 사용자 턴 대사를, scriptTextOf는 A/U 대본을 만든다', () => {
    const scene = getSceneById('breakup');
    expect(scene).toBeDefined();
    if (!scene) return;
    expect(userLineOf(scene)).toBe('진심이야? 이렇게 끝낼 거야?');
    const script = scriptTextOf(scene);
    expect(script).toContain('A: 우리… 이제 그만하자.');
    expect(script).toContain('U: 진심이야? 이렇게 끝낼 거야?');
  });
});
