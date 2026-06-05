// playdle '오늘의 연극 맞추기'의 정답 풀(코드 상수, DB 불필요).
// 각 작품에 속성 6칸(장르·시대·국가·형식·정서톤·인물구도)을 달아 추측 채점에 쓴다.
// 큐레이션 기준: 입시 단골 레퍼토리 + 대중 인지작 균형. 명대사는 유명·안전한 것만.

export type PlayGenre = '비극' | '희극' | '드라마' | '부조리극' | '풍자' | '판타지' | '로맨스';
export type PlayEra = '고전' | '근대' | '현대';
export type PlayForm = '연극' | '뮤지컬';
export type PlayTone = '비장' | '서정' | '유쾌' | '냉소' | '따뜻함';
export type PlayCast = '1인극' | '2인극' | '소규모' | '앙상블';

export type PlayWork = {
  id: string;
  title: string; // 정식 표기(괄호 없이)
  aliases: string[]; // 매칭용 대체 표기(원제·약칭). 정규화 후 비교한다.
  genre: PlayGenre;
  era: PlayEra; // 작품의 태생 시기(집필/초연 전통)
  country: string; // 작품 태생 국가
  form: PlayForm;
  tone: PlayTone;
  cast: PlayCast; // 인물 구도(규모)
  hints: { quote: string; role: string; synopsis: string }; // 단계 힌트(명대사→배역→줄거리)
};

export const PLAY_WORKS: PlayWork[] = [
  {
    id: 'hamlet',
    title: '햄릿',
    aliases: ['hamlet'],
    genre: '비극', era: '고전', country: '영국', form: '연극', tone: '비장', cast: '앙상블',
    hints: {
      quote: '사느냐 죽느냐, 그것이 문제로다',
      role: '햄릿',
      synopsis: '아버지를 죽인 숙부에게 복수하려 망설이는 덴마크 왕자의 비극.',
    },
  },
  {
    id: 'romeo',
    title: '로미오와 줄리엣',
    aliases: ['로미오', 'romeo and juliet', 'romeo & juliet', 'romeo'],
    genre: '비극', era: '고전', country: '영국', form: '연극', tone: '서정', cast: '앙상블',
    hints: {
      quote: '오 로미오, 당신은 왜 로미오인가요',
      role: '줄리엣',
      synopsis: '원수 가문의 두 연인이 맞는 비극적 사랑.',
    },
  },
  {
    id: 'macbeth',
    title: '맥베스',
    aliases: ['macbeth'],
    genre: '비극', era: '고전', country: '영국', form: '연극', tone: '비장', cast: '앙상블',
    hints: {
      quote: '꺼져라, 꺼져라, 짧은 촛불이여',
      role: '맥베스',
      synopsis: '마녀의 예언에 휘둘려 왕을 시해하고 파멸하는 장군.',
    },
  },
  {
    id: 'othello',
    title: '오셀로',
    aliases: ['othello'],
    genre: '비극', era: '고전', country: '영국', form: '연극', tone: '비장', cast: '앙상블',
    hints: {
      quote: '질투를 조심하시오, 그것은 초록 눈의 괴물이오',
      role: '오셀로',
      synopsis: '이아고의 간계로 아내를 의심하다 비극을 부르는 무어인 장군.',
    },
  },
  {
    id: 'midsummer',
    title: '한여름 밤의 꿈',
    aliases: ['한여름밤의꿈', "a midsummer night's dream", 'midsummer'],
    genre: '희극', era: '고전', country: '영국', form: '연극', tone: '유쾌', cast: '앙상블',
    hints: {
      quote: '진정한 사랑의 길은 결코 순탄치 않았다',
      role: '퍽',
      synopsis: '숲속 요정의 장난으로 뒤엉키는 연인들의 하룻밤 소동.',
    },
  },
  {
    id: 'antigone',
    title: '안티고네',
    aliases: ['antigone'],
    genre: '비극', era: '고전', country: '그리스', form: '연극', tone: '비장', cast: '앙상블',
    hints: {
      quote: '나는 미움이 아니라 사랑을 나누려 태어났어요',
      role: '안티고네',
      synopsis: '국법을 어기고 오빠의 시신을 묻으려는 안티고네의 비극.',
    },
  },
  {
    id: 'seagull',
    title: '갈매기',
    aliases: ['the seagull', 'seagull', 'чайка'],
    genre: '드라마', era: '근대', country: '러시아', form: '연극', tone: '서정', cast: '앙상블',
    hints: {
      quote: '나는 갈매기… 아니, 그게 아니야',
      role: '니나',
      synopsis: '예술과 사랑에 좌절하는 사람들을 그린 체호프의 희비극.',
    },
  },
  {
    id: 'dollhouse',
    title: '인형의 집',
    aliases: ['인형의집', "a doll's house", 'dollhouse', 'et dukkehjem'],
    genre: '드라마', era: '근대', country: '노르웨이', form: '연극', tone: '비장', cast: '소규모',
    hints: {
      quote: '무엇보다 나는 한 사람의 인간이에요',
      role: '노라',
      synopsis: '인형 같은 삶을 깨닫고 집을 떠나는 노라의 이야기.',
    },
  },
  {
    id: 'godot',
    title: '고도를 기다리며',
    aliases: ['고도', 'waiting for godot', 'godot', 'en attendant godot'],
    genre: '부조리극', era: '현대', country: '아일랜드', form: '연극', tone: '냉소', cast: '2인극',
    hints: {
      quote: '우리는 고도를 기다린다',
      role: '블라디미르',
      synopsis: '오지 않는 고도를 기다리며 시간을 보내는 두 부랑자.',
    },
  },
  {
    id: 'streetcar',
    title: '욕망이라는 이름의 전차',
    aliases: ['욕망이라는이름의전차', 'a streetcar named desire', 'streetcar'],
    genre: '드라마', era: '현대', country: '미국', form: '연극', tone: '비장', cast: '소규모',
    hints: {
      quote: '나는 늘 낯선 이의 친절에 기대 살아왔어요',
      role: '블랑쉬',
      synopsis: '환상에 매달리다 무너지는 블랑쉬 드보아.',
    },
  },
  {
    id: 'bbalrae',
    title: '빨래',
    aliases: ['ppallae', 'bbalrae'],
    genre: '드라마', era: '현대', country: '한국', form: '뮤지컬', tone: '따뜻함', cast: '앙상블',
    hints: {
      quote: '잘 빤 빨래처럼 잘 마를 거예요',
      role: '솔롱고',
      synopsis: '서울살이 고단한 이들이 서로 위로하는 창작 뮤지컬.',
    },
  },
  {
    id: 'wicked',
    title: '위키드',
    aliases: ['wicked'],
    genre: '판타지', era: '현대', country: '미국', form: '뮤지컬', tone: '유쾌', cast: '앙상블',
    hints: {
      quote: "It's time to try defying gravity",
      role: '엘파바',
      synopsis: '오즈의 두 마녀가 맺는 우정과 엇갈림.',
    },
  },
  {
    id: 'lesmis',
    title: '레미제라블',
    aliases: ['레 미제라블', 'les miserables', 'les mis', 'lesmis'],
    genre: '드라마', era: '근대', country: '프랑스', form: '뮤지컬', tone: '비장', cast: '앙상블',
    hints: {
      quote: 'Do you hear the people sing?',
      role: '장발장',
      synopsis: '장발장의 속죄와 혁명기 파리 군상을 그린 대서사.',
    },
  },
  {
    id: 'phantom',
    title: '오페라의 유령',
    aliases: ['오페라의유령', 'the phantom of the opera', 'phantom'],
    genre: '로맨스', era: '근대', country: '영국', form: '뮤지컬', tone: '서정', cast: '앙상블',
    hints: {
      quote: '밤의 음악이 너의 귀를 열게 하라',
      role: '팬텀',
      synopsis: '파리 오페라 극장 지하에 사는 유령과 크리스틴의 이야기.',
    },
  },
  {
    id: 'chicago',
    title: '시카고',
    aliases: ['chicago'],
    genre: '풍자', era: '현대', country: '미국', form: '뮤지컬', tone: '냉소', cast: '앙상블',
    hints: {
      quote: 'And all that jazz',
      role: '록시 하트',
      synopsis: '1920년대 시카고, 살인과 쇼비즈니스를 풍자한 뮤지컬.',
    },
  },
  {
    id: 'kimjongwook',
    title: '김종욱 찾기',
    aliases: ['김종욱찾기', 'finding kim jong wook', 'finding mr destiny'],
    genre: '로맨스', era: '현대', country: '한국', form: '뮤지컬', tone: '유쾌', cast: '소규모',
    hints: {
      quote: '당신의 첫사랑을 찾아드립니다',
      role: '여자',
      synopsis: '첫사랑 김종욱을 찾아 나서는 로맨틱 코미디 뮤지컬.',
    },
  },
];
