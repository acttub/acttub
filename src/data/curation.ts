export type Mood = "light" | "deep" | "romance" | "music" | "experimental";
export type Companion = "alone" | "date" | "friends" | "family";
export type Pace = "calm" | "balanced" | "dynamic";

export type CurationEntry = {
  id: string;
  title: string;
  titleMatch: RegExp;
  pitch: string;
  body: string[];
  highlights: string[];
  tags: string[];
  moods: Mood[];
  companions: Companion[];
  pace: Pace;
  priceHint: string;
  defaultVenue: string;
  defaultArea: string;
};

export const curation: CurationEntry[] = [
  {
    id: "finding-mr-destiny",
    title: "김종욱 찾기",
    titleMatch: /김종욱\s*찾기/,
    pitch:
      "첫사랑 '김종욱'을 찾아 인도부터 다시 되짚는 여정을 그린 창작 뮤지컬. 2006년 초연 이후 꾸준히 사랑받는 로맨틱 코미디입니다.",
    body: [
      "인도 여행에서 만난 첫사랑 '김종욱'을 다시 찾고 싶은 '그녀'와, 그녀를 돕는 '첫사랑 찾기 주식회사' 남자 '그'의 이야기를 그린 3인극 창작 뮤지컬입니다.",
      "두 사람이 단서를 따라 김종욱의 흔적을 되짚는 동안 또 다른 감정이 자라나는, 가볍지만 여운이 남는 로맨틱 코미디. 라이브 밴드와 함께 진행되어 무대의 밀도가 높습니다.",
      "2006년 초연 이후 동명 영화(2010, 임수정·공유 주연)로도 만들어졌고, 대학로 장수 레퍼토리로 자리잡았습니다.",
    ],
    highlights: ["초연 2006년", "3인극 + 라이브 밴드", "영화화된 원작"],
    tags: ["창작뮤지컬", "로맨틱코미디", "장기공연"],
    moods: ["romance", "music", "light"],
    companions: ["date", "alone"],
    pace: "balanced",
    priceHint: "4만~6만원대",
    defaultVenue: "대학로 장기공연",
    defaultArea: "대학로",
  },
  {
    id: "laundry-musical",
    title: "빨래",
    titleMatch: /^빨래($|\s|\(|【|\[)/,
    pitch:
      "서울 변두리 옥탑에서 살아가는 사람들의 하루를 따뜻하게 그린 추민주 작 창작 뮤지컬. 2005년 초연 이후 한국 창작뮤지컬의 대표작으로 자리잡았습니다.",
    body: [
      "강원도에서 상경한 서점 직원 '나영'과 몽골에서 온 이주노동자 '솔롱고'가 옥탑방 이웃으로 만나면서 시작되는 이야기. 빨래라는 평범한 일상 행위를 통해 서로의 삶을 들여다보고 위로하는 과정을 잔잔하게 그립니다.",
      "추민주 작·작곡, 학전블루에서 초연된 후 동양예술극장 등 대학로 여러 극장에서 장기 공연되어 온 한국 창작뮤지컬의 대표적인 스테디셀러입니다.",
      "거창한 사건 없이도 마음이 데워지는 무대로, 가족이나 부모님과 함께 관람하기 좋은 작품입니다.",
    ],
    highlights: ["초연 2005년", "추민주 작·작곡", "한국 창작뮤지컬 스테디셀러"],
    tags: ["창작뮤지컬", "감성", "가족"],
    moods: ["music", "deep"],
    companions: ["family", "date", "alone"],
    pace: "balanced",
    priceHint: "4만~6만원대",
    defaultVenue: "대학로 장기공연",
    defaultArea: "대학로",
  },
  {
    id: "rooftop-cat",
    title: "옥탑방 고양이",
    titleMatch: /옥탑방\s*고양이/,
    pitch:
      "옥탑방에서 얼떨결에 동거를 시작한 두 청춘의 좌충우돌 일상을 그린 로맨틱 코미디 연극. 김유리 원작 소설을 무대화한 대학로 스테디셀러입니다.",
    body: [
      "취업 준비생 정은과 백수 청년 경민이 한 옥탑방에서 한 지붕 두 가족 동거를 하게 되면서 벌어지는 좌충우돌 청춘 이야기.",
      "원작은 1990년대 말 발표된 김유리의 인터넷 소설로, MBC 드라마(2003)로도 만들어진 청춘 로맨틱 코미디의 고전입니다.",
      "대학로 소극장에서 오랫동안 사랑받아 온 가벼우면서도 사랑스러운 무드의 연극으로, 친구나 연인과 가볍게 보기 좋습니다.",
    ],
    highlights: ["김유리 동명 소설 원작", "MBC 드라마화", "대학로 스테디셀러"],
    tags: ["연극", "로맨틱코미디", "청춘"],
    moods: ["light", "romance"],
    companions: ["date", "friends"],
    pace: "balanced",
    priceHint: "3만~4만원대",
    defaultVenue: "대학로 장기공연",
    defaultArea: "대학로",
  },
  {
    id: "liar-1",
    title: "연극 라이어 1탄",
    titleMatch: /라이어\s*(1탄|1|첫|시즌\s*1)?/,
    pitch:
      "두 집 살림을 들킬 위기에 빠진 택시기사의 거짓말이 점점 꼬여 가는 영국식 슬랩스틱 코미디. 레이 쿠니의 'Run for Your Wife'를 라이선스한 대학로 대표 코미디입니다.",
    body: [
      "두 집 살림을 하던 런던 택시기사 존 스미스가 우연한 사고로 신상이 노출될 위기에 처하면서, 거짓말을 덮기 위한 또 다른 거짓말이 눈덩이처럼 불어나는 영국식 슬랩스틱 코미디.",
      "원작은 영국 극작가 레이 쿠니(Ray Cooney)의 'Run for Your Wife'. 한국에서는 '연극 라이어' 시리즈(1탄~3탄)로 라이선스되어 대학로 코미디 연극을 대표하는 장기 흥행작입니다.",
      "빠른 호흡과 신체 개그가 중심이라 친구·연인과 가볍게 보기 좋은 무대입니다.",
    ],
    highlights: ["원작 Ray Cooney 'Run for Your Wife'", "대학로 장기 코미디", "1탄·2탄·3탄 시리즈"],
    tags: ["연극", "코미디", "슬랩스틱"],
    moods: ["light"],
    companions: ["friends", "date"],
    pace: "dynamic",
    priceHint: "3만~4만원대",
    defaultVenue: "대학로 장기공연",
    defaultArea: "대학로",
  },
  {
    id: "hedwig",
    title: "헤드윅",
    titleMatch: /헤드윅|Hedwig/i,
    pitch:
      "동독 출신 록 가수 헤드윅의 정체성과 사랑을 강렬한 라이브 밴드와 함께 풀어내는 락 뮤지컬. 조승우·오만석·김다현 등 시즌마다 캐스팅이 화제가 되어 온 작품입니다.",
    body: [
      "동독에서 태어나 어머니의 권유로 성전환 수술을 받고 미군 병사와 결혼해 미국으로 건너간 록 가수 헤드윅. 그녀가 자신의 정체성과 잃어버린 '반쪽'을 찾아가는 과정을 라이브 밴드 'The Angry Inch'와 함께 풀어내는 락 뮤지컬.",
      "1998년 오프브로드웨이 초연. 존 캐머런 미첼(John Cameron Mitchell) 극본, 스티븐 트래스크(Stephen Trask) 작곡. 한국에서는 2005년 초연 이후 조승우·오만석·김다현·정문성·전동석 등 여러 시즌의 캐스팅이 매번 화제가 되어 왔습니다.",
      "스탠드업 라이브 콘서트 형식으로 진행되는 1인극+밴드 구성이라, 음악과 무대 밀도를 좋아하는 관객에게 강한 인상을 남깁니다.",
    ],
    highlights: ["1998년 오프브로드웨이 초연", "한국 초연 2005년", "라이브 밴드 + 1인극 형식"],
    tags: ["락뮤지컬", "1인극+밴드", "강렬함"],
    moods: ["music", "experimental", "deep"],
    companions: ["alone", "date", "friends"],
    pace: "dynamic",
    priceHint: "6만~11만원대",
    defaultVenue: "충무아트센터 등 시즌 공연",
    defaultArea: "시즌제",
  },
  {
    id: "old-thief-story",
    title: "늘근 도둑 이야기",
    titleMatch: /늘근\s*도둑/,
    pitch:
      "이강백 작가의 대표 희곡. 빈집에 잠입한 두 늙은 도둑의 대화를 통해 권력과 시대를 풍자하는 깊이 있는 2인극입니다.",
    body: [
      "한밤중 어느 빈집에 잠입한 두 늙은 도둑이, 별 볼 일 없는 보물을 앞에 두고 자신의 과거와 시대를 회상하며 권력의 허상을 풍자하는 2인극.",
      "이강백 작. 1989년 발표된 한국 현대 희곡으로, 풍자와 알레고리를 통한 정치·사회 비평이 핵심이라 거듭 재공연되어 온 대학로 단골 레퍼토리입니다.",
      "차분한 호흡 속에서 인물의 대사 한 줄 한 줄에 의미가 쌓이는 작품이라, 혼자 보거나 연극을 진중하게 보고 싶을 때 좋습니다.",
    ],
    highlights: ["이강백 작 (1989)", "한국 현대 희곡 대표작", "2인극"],
    tags: ["창작희곡", "2인극", "풍자"],
    moods: ["deep", "experimental"],
    companions: ["alone", "friends"],
    pace: "calm",
    priceHint: "3만~5만원대",
    defaultVenue: "대학로 재공연",
    defaultArea: "대학로",
  },
  {
    id: "maybe-happy-ending",
    title: "어쩌면 해피엔딩",
    titleMatch: /어쩌면\s*해피엔딩|Maybe\s*Happy\s*Ending/i,
    pitch:
      "한물간 헬퍼봇 올리버와 클레어의 만남을 그린 박천휴·윌 애런슨 창작 뮤지컬. 잔잔한 재즈 선율과 따뜻한 SF 감성이 어우러진 화제작입니다.",
    body: [
      "가까운 미래의 서울, 한물간 헬퍼봇 모델 '올리버'가 같은 처지의 헬퍼봇 '클레어'와 만나 자신들의 '주인'을 찾기 위해 함께 떠나는 여정에서 사랑을 발견하는 SF 창작 뮤지컬.",
      "박천휴·윌 애런슨(Will Aronson) 공동 극본·작곡. 2016년 한국 초연 이후 시즌마다 매진 행렬을 이어 왔고, 영어 버전이 2024년 브로드웨이에 오르며 토니상 후보로 한국 창작뮤지컬 사상 큰 화제를 만들었습니다.",
      "잔잔한 재즈 피아노와 따뜻한 SF 감성이 어우러진 무대로, 데이트나 부모님과 함께 보기 좋은 작품입니다.",
    ],
    highlights: ["박천휴·윌 애런슨 창작", "한국 초연 2016년", "브로드웨이 진출 (2024)"],
    tags: ["창작뮤지컬", "SF", "감성"],
    moods: ["music", "romance", "deep"],
    companions: ["date", "family", "alone"],
    pace: "balanced",
    priceHint: "6만~11만원대",
    defaultVenue: "예스24스테이지 등 시즌 공연",
    defaultArea: "시즌제",
  },
];

export function matchCuration(title: string): CurationEntry | null {
  if (!title) return null;
  for (const entry of curation) {
    if (entry.titleMatch.test(title)) return entry;
  }
  return null;
}
