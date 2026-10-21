// scene 'AI 씬 파트너'의 장면 대본 풀(코드 상수, DB 불필요).
// 저작권 안전한 오리지널 2인 미니 씬. AI 상대역이 대사를 던지면(turn role 'ai'),
// 사용자가 가운데 한 줄을 받아 연기한다(turn role 'user', 정확히 1개). 마지막 ai 턴은 마무리 반응.
// 채점은 사용자 녹음(1턴)만 Gemini audio 1콜로 본다 — lineshot 엔진 재사용(scenePrompt).
// 설계 정본: soma founder/growth/subprojects/scene.md.

export type SceneTurn = { role: 'ai' | 'user'; line: string };

export type SceneScript = {
  id: string;
  title: string; // 짧은 장면 이름(선택 카드에 노출)
  situation: string; // 상황 설명(채점 컨텍스트 + 화면 안내)
  mood: string; // 분위기 태그(한 단어)
  turns: SceneTurn[]; // ai(큐) → user(녹음, 1개) → ai(마무리)
};

export const SCENES: SceneScript[] = [
  {
    id: 'breakup',
    title: '오랜 연인과의 이별',
    situation: '몇 년을 함께한 연인이 지친 얼굴로 이별을 꺼낸다. 너는 붙잡고 싶지만 이미 늦었다는 걸 안다.',
    mood: '먹먹함',
    turns: [
      { role: 'ai', line: '우리… 이제 그만하자.' },
      { role: 'user', line: '진심이야? 이렇게 끝낼 거야?' },
      { role: 'ai', line: '응. 너도 알고 있었잖아.' },
    ],
  },
  {
    id: 'reunion',
    title: '오랜만에 만난 친구',
    situation: '한참 연락이 끊겼던 친구를 길에서 우연히 마주쳤다. 반가움과 어색함이 동시에 밀려온다.',
    mood: '반가움',
    turns: [
      { role: 'ai', line: '야, 너 진짜 오랜만이다. 이게 얼마 만이야?' },
      { role: 'user', line: '글쎄… 한 5년 됐나? 너 하나도 안 변했다.' },
      { role: 'ai', line: '변하긴, 늙었지. 그래도 알아봐줘서 고맙다.' },
    ],
  },
  {
    id: 'interview',
    title: '긴장되는 면접',
    situation: '꼭 붙고 싶은 자리의 마지막 질문. 면접관의 눈이 너에게 꽂혀 있다.',
    mood: '긴장',
    turns: [
      { role: 'ai', line: '마지막으로, 본인을 한마디로 표현한다면요?' },
      { role: 'user', line: '음… 저는 멈추지 않는 사람입니다.' },
      { role: 'ai', line: '좋네요. 그 말, 책임질 수 있죠?' },
    ],
  },
  {
    id: 'confession',
    title: '망설이던 고백',
    situation: '오래 마음에 담아둔 사람 앞. 더는 미룰 수 없어 입을 뗀다.',
    mood: '설렘',
    turns: [
      { role: 'ai', line: '할 말 있다며. 뭔데, 뜸 들이지 말고.' },
      { role: 'user', line: '사실… 나 너 좋아해. 한참 됐어.' },
      { role: 'ai', line: '…너, 지금 장난 아니지?' },
    ],
  },
  {
    id: 'confront',
    title: '들킨 거짓말',
    situation: '숨기려던 일이 들통났다. 상대는 이미 증거를 쥐고 너를 바라본다.',
    mood: '날 선',
    turns: [
      { role: 'ai', line: '어제 거기 없었다며. 근데 왜 사진이 있어?' },
      { role: 'user', line: '그건… 설명할 수 있어. 들어봐.' },
      { role: 'ai', line: '설명? 좋아, 해봐. 이번엔 진짜로.' },
    ],
  },
  {
    id: 'comfort',
    title: '무너진 친구를 위로',
    situation: '다 끝났다며 주저앉은 친구. 너는 그 옆에 앉아 어깨를 붙든다.',
    mood: '따뜻함',
    turns: [
      { role: 'ai', line: '나 진짜… 다 망친 것 같아. 어떡하지.' },
      { role: 'user', line: '괜찮아. 아직 안 끝났어. 내가 옆에 있잖아.' },
      { role: 'ai', line: '…고마워. 너 아니었으면 진짜 무너졌어.' },
    ],
  },
];

export function getSceneById(id: string): SceneScript | undefined {
  return SCENES.find((scene) => scene.id === id);
}

// 사용자가 맡은(녹음할) 대사. user 턴은 정확히 1개라는 전제.
export function userLineOf(scene: SceneScript): string {
  return scene.turns.find((turn) => turn.role === 'user')?.line ?? '';
}

// 사용자 턴 직전의 ai 대사(받아칠 '큐'). 없으면 빈 문자열.
export function cueLineOf(scene: SceneScript): string {
  const userIndex = scene.turns.findIndex((turn) => turn.role === 'user');
  for (let i = userIndex - 1; i >= 0; i -= 1) {
    if (scene.turns[i].role === 'ai') return scene.turns[i].line;
  }
  return '';
}

// 채점 프롬프트에 넘길 대본 텍스트. (A=상대역 AI, U=사용자)
export function scriptTextOf(scene: SceneScript): string {
  return scene.turns
    .map((turn) => `${turn.role === 'ai' ? 'A' : 'U'}: ${turn.line}`)
    .join('\n');
}
