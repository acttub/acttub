export type Mood = "light" | "deep" | "romance" | "music" | "experimental";
export type Companion = "alone" | "date" | "friends" | "family";
export type Pace = "calm" | "balanced" | "dynamic";

export type CurationEntry = {
  id: string;
  title: string;
  titleMatch: RegExp;
  pitch: string;
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
