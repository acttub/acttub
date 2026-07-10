// playdle '오늘의 연극 맞추기'의 정답 풀(코드 상수, DB 불필요).
// 무대극(연극·뮤지컬)만. 각 작품에 속성 5칸(형식·장르·시대·국가·정서)을 달아 추측 채점에 쓴다.
// 큐레이션 기준: 대중 인지작 + 입시 단골. era는 작품의 창작/초연 시기 기준.

export type PlayForm = '연극' | '뮤지컬';
export type PlayGenre = '비극' | '희극' | '드라마' | '부조리극' | '서사극' | '풍자' | '판타지' | '로맨스' | '스릴러';
export type PlayEra = '고전' | '근대' | '현대';
export type PlayTone = '비장' | '서정' | '유쾌' | '냉소' | '따뜻함' | '웅장';

export type PlayWork = {
  id: string;
  title: string; // 정식 표기(괄호 없이)
  aliases: string[]; // 매칭용 대체 표기(원제·약칭). 정규화 후 비교한다.
  form: PlayForm;
  genre: PlayGenre;
  era: PlayEra; // 창작/초연 시기: 고전(~18C) · 근대(19C~20C초) · 현대(20C중반~)
  country: string; // 작품 태생 국가
  tone: PlayTone;
};

export const PLAY_WORKS: PlayWork[] = [
  // ── 연극: 셰익스피어·고전(영국) ──
  { id: 'hamlet', title: '햄릿', aliases: ['hamlet'], form: '연극', genre: '비극', era: '고전', country: '영국', tone: '비장' },
  { id: 'romeo', title: '로미오와 줄리엣', aliases: ['로미오', 'romeo and juliet', 'romeo & juliet'], form: '연극', genre: '비극', era: '고전', country: '영국', tone: '서정' },
  { id: 'macbeth', title: '맥베스', aliases: ['macbeth'], form: '연극', genre: '비극', era: '고전', country: '영국', tone: '비장' },
  { id: 'othello', title: '오셀로', aliases: ['othello'], form: '연극', genre: '비극', era: '고전', country: '영국', tone: '비장' },
  { id: 'lear', title: '리어왕', aliases: ['king lear', 'lear'], form: '연극', genre: '비극', era: '고전', country: '영국', tone: '비장' },
  { id: 'midsummer', title: '한여름 밤의 꿈', aliases: ['한여름밤의꿈', "a midsummer night's dream", 'midsummer'], form: '연극', genre: '희극', era: '고전', country: '영국', tone: '유쾌' },
  { id: 'merchant', title: '베니스의 상인', aliases: ['the merchant of venice', 'merchant of venice'], form: '연극', genre: '희극', era: '고전', country: '영국', tone: '유쾌' },

  // ── 연극: 그리스 고전 ──
  { id: 'antigone', title: '안티고네', aliases: ['antigone'], form: '연극', genre: '비극', era: '고전', country: '그리스', tone: '비장' },
  { id: 'oedipus', title: '오이디푸스 왕', aliases: ['오이디푸스', 'oedipus rex', 'oedipus the king'], form: '연극', genre: '비극', era: '고전', country: '그리스', tone: '비장' },
  { id: 'medea', title: '메데이아', aliases: ['메디아', 'medea'], form: '연극', genre: '비극', era: '고전', country: '그리스', tone: '비장' },

  // ── 연극: 몰리에르 ──
  { id: 'tartuffe', title: '타르튀프', aliases: ['tartuffe'], form: '연극', genre: '풍자', era: '고전', country: '프랑스', tone: '냉소' },

  // ── 연극: 근대 사실주의(입센·체호프·와일드) ──
  { id: 'dollhouse', title: '인형의 집', aliases: ['인형의집', "a doll's house", 'dollhouse'], form: '연극', genre: '드라마', era: '근대', country: '노르웨이', tone: '비장' },
  { id: 'ghosts', title: '유령', aliases: ['ghosts', 'gengangere'], form: '연극', genre: '드라마', era: '근대', country: '노르웨이', tone: '비장' },
  { id: 'peergynt', title: '페르 귄트', aliases: ['페르귄트', 'peer gynt'], form: '연극', genre: '드라마', era: '근대', country: '노르웨이', tone: '웅장' },
  { id: 'seagull', title: '갈매기', aliases: ['the seagull', 'seagull'], form: '연극', genre: '드라마', era: '근대', country: '러시아', tone: '서정' },
  { id: 'cherry', title: '벚꽃동산', aliases: ['벚꽃 동산', 'the cherry orchard', 'cherry orchard'], form: '연극', genre: '드라마', era: '근대', country: '러시아', tone: '서정' },
  { id: 'threesisters', title: '세 자매', aliases: ['세자매', 'three sisters'], form: '연극', genre: '드라마', era: '근대', country: '러시아', tone: '서정' },
  { id: 'importance', title: '진지함의 중요성', aliases: ['the importance of being earnest', '어니스트'], form: '연극', genre: '희극', era: '근대', country: '영국', tone: '유쾌' },

  // ── 연극: 현대(미국) ──
  { id: 'streetcar', title: '욕망이라는 이름의 전차', aliases: ['욕망이라는이름의전차', 'a streetcar named desire', 'streetcar'], form: '연극', genre: '드라마', era: '현대', country: '미국', tone: '비장' },
  { id: 'glassmenagerie', title: '유리 동물원', aliases: ['유리동물원', 'the glass menagerie'], form: '연극', genre: '드라마', era: '현대', country: '미국', tone: '서정' },
  { id: 'salesman', title: '세일즈맨의 죽음', aliases: ['death of a salesman'], form: '연극', genre: '드라마', era: '현대', country: '미국', tone: '비장' },
  { id: 'crucible', title: '시련', aliases: ['the crucible', '크루서블'], form: '연극', genre: '드라마', era: '현대', country: '미국', tone: '비장' },
  { id: 'longday', title: '밤으로의 긴 여로', aliases: ['long day’s journey into night', '밤으로의긴여로'], form: '연극', genre: '드라마', era: '현대', country: '미국', tone: '비장' },
  { id: 'virginiawoolf', title: '누가 버지니아 울프를 두려워하랴', aliases: ['버지니아 울프', "who's afraid of virginia woolf"], form: '연극', genre: '드라마', era: '현대', country: '미국', tone: '냉소' },

  // ── 연극: 현대(유럽 부조리·서사) ──
  { id: 'godot', title: '고도를 기다리며', aliases: ['고도', 'waiting for godot', 'godot'], form: '연극', genre: '부조리극', era: '현대', country: '아일랜드', tone: '냉소' },
  { id: 'rhinoceros', title: '코뿔소', aliases: ['rhinoceros', 'rhinocéros'], form: '연극', genre: '부조리극', era: '현대', country: '프랑스', tone: '냉소' },
  { id: 'mothercourage', title: '억척어멈과 그 자식들', aliases: ['억척어멈', 'mother courage'], form: '연극', genre: '서사극', era: '현대', country: '독일', tone: '비장' },

  // ── 연극: 현대(영국·프랑스 대중극) ──
  { id: 'equus', title: '에쿠우스', aliases: ['equus'], form: '연극', genre: '드라마', era: '현대', country: '영국', tone: '비장' },
  { id: 'amadeus', title: '아마데우스', aliases: ['amadeus'], form: '연극', genre: '드라마', era: '현대', country: '영국', tone: '웅장' },
  { id: 'art', title: '아트', aliases: ['art', '아트 연극'], form: '연극', genre: '희극', era: '현대', country: '프랑스', tone: '냉소' },
  { id: 'carnage', title: '대학살의 신', aliases: ['god of carnage', 'le dieu du carnage'], form: '연극', genre: '희극', era: '현대', country: '프랑스', tone: '냉소' },
  { id: 'liar', title: '라이어', aliases: ['liar', 'run for your wife', '라이어 1탄'], form: '연극', genre: '희극', era: '현대', country: '영국', tone: '유쾌' },

  // ── 연극: 한국 대중·입시 ──
  { id: 'oasis', title: '오아시스 세탁소 습격사건', aliases: ['오아시스세탁소', '오아시스 세탁소'], form: '연극', genre: '희극', era: '현대', country: '한국', tone: '따뜻함' },
  { id: 'chinjeong', title: '친정엄마', aliases: ['친정엄마와 2박3일', '친정엄마'], form: '연극', genre: '드라마', era: '현대', country: '한국', tone: '따뜻함' },
  { id: 'sanbul', title: '산불', aliases: ['sanbul'], form: '연극', genre: '드라마', era: '현대', country: '한국', tone: '비장' },

  // ── 뮤지컬: 영국·프랑스 대극장 ──
  { id: 'lesmis', title: '레미제라블', aliases: ['레 미제라블', 'les miserables', 'les mis'], form: '뮤지컬', genre: '드라마', era: '현대', country: '프랑스', tone: '웅장' },
  { id: 'phantom', title: '오페라의 유령', aliases: ['오페라의유령', 'the phantom of the opera', 'phantom'], form: '뮤지컬', genre: '로맨스', era: '현대', country: '영국', tone: '서정' },
  { id: 'cats', title: '캣츠', aliases: ['cats'], form: '뮤지컬', genre: '판타지', era: '현대', country: '영국', tone: '유쾌' },
  { id: 'missaigon', title: '미스 사이공', aliases: ['미스사이공', 'miss saigon'], form: '뮤지컬', genre: '드라마', era: '현대', country: '영국', tone: '비장' },
  { id: 'evita', title: '에비타', aliases: ['evita'], form: '뮤지컬', genre: '드라마', era: '현대', country: '영국', tone: '웅장' },
  { id: 'jcs', title: '지저스 크라이스트 슈퍼스타', aliases: ['지저스크라이스트슈퍼스타', 'jesus christ superstar', 'jcs'], form: '뮤지컬', genre: '드라마', era: '현대', country: '영국', tone: '웅장' },
  { id: 'mammamia', title: '맘마미아', aliases: ['mamma mia'], form: '뮤지컬', genre: '로맨스', era: '현대', country: '영국', tone: '유쾌' },

  // ── 뮤지컬: 미국 ──
  { id: 'wicked', title: '위키드', aliases: ['wicked'], form: '뮤지컬', genre: '판타지', era: '현대', country: '미국', tone: '유쾌' },
  { id: 'chicago', title: '시카고', aliases: ['chicago'], form: '뮤지컬', genre: '풍자', era: '현대', country: '미국', tone: '냉소' },
  { id: 'lionking', title: '라이온 킹', aliases: ['라이온킹', 'the lion king'], form: '뮤지컬', genre: '드라마', era: '현대', country: '미국', tone: '웅장' },
  { id: 'aladdin', title: '알라딘', aliases: ['aladdin'], form: '뮤지컬', genre: '판타지', era: '현대', country: '미국', tone: '유쾌' },
  { id: 'jekyll', title: '지킬 앤 하이드', aliases: ['지킬앤하이드', 'jekyll & hyde', 'jekyll and hyde'], form: '뮤지컬', genre: '스릴러', era: '현대', country: '미국', tone: '비장' },
  { id: 'hedwig', title: '헤드윅', aliases: ['hedwig', 'hedwig and the angry inch'], form: '뮤지컬', genre: '로맨스', era: '현대', country: '미국', tone: '냉소' },
  { id: 'rent', title: '렌트', aliases: ['rent'], form: '뮤지컬', genre: '드라마', era: '현대', country: '미국', tone: '서정' },
  { id: 'westside', title: '웨스트 사이드 스토리', aliases: ['웨스트사이드스토리', 'west side story'], form: '뮤지컬', genre: '로맨스', era: '현대', country: '미국', tone: '서정' },
  { id: 'dracula', title: '드라큘라', aliases: ['dracula'], form: '뮤지컬', genre: '로맨스', era: '현대', country: '미국', tone: '비장' },

  // ── 뮤지컬: 프랑스·독일어권 ──
  { id: 'notredame', title: '노트르담 드 파리', aliases: ['노트르담드파리', 'notre dame de paris'], form: '뮤지컬', genre: '드라마', era: '현대', country: '프랑스', tone: '웅장' },
  { id: 'rebecca', title: '레베카', aliases: ['rebecca'], form: '뮤지컬', genre: '스릴러', era: '현대', country: '오스트리아', tone: '비장' },
  { id: 'elisabeth', title: '엘리자벳', aliases: ['elisabeth'], form: '뮤지컬', genre: '드라마', era: '현대', country: '오스트리아', tone: '비장' },
  { id: 'mozart', title: '모차르트', aliases: ['모차르트!', 'mozart'], form: '뮤지컬', genre: '드라마', era: '현대', country: '오스트리아', tone: '웅장' },

  // ── 뮤지컬: 한국 창작 ──
  { id: 'bbalrae', title: '빨래', aliases: ['ppallae'], form: '뮤지컬', genre: '드라마', era: '현대', country: '한국', tone: '따뜻함' },
  { id: 'kimjongwook', title: '김종욱 찾기', aliases: ['김종욱찾기', 'finding kim jong wook'], form: '뮤지컬', genre: '로맨스', era: '현대', country: '한국', tone: '유쾌' },
  { id: 'hero', title: '영웅', aliases: ['hero', '영웅 뮤지컬'], form: '뮤지컬', genre: '드라마', era: '현대', country: '한국', tone: '웅장' },
  { id: 'myeongseong', title: '명성황후', aliases: ['명성 황후', 'the last empress'], form: '뮤지컬', genre: '드라마', era: '현대', country: '한국', tone: '비장' },
  { id: 'frankenstein', title: '프랑켄슈타인', aliases: ['frankenstein'], form: '뮤지컬', genre: '드라마', era: '현대', country: '한국', tone: '비장' },
];
