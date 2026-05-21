import type { Companion, Mood, Pace } from "@/data/curation";

export type AutoTag = {
  moods: Mood[];
  companions: Companion[];
  pace: Pace;
  pitch: string;
  tags: string[];
};

type Heuristic = {
  pattern: RegExp;
  moods?: Mood[];
  companions?: Companion[];
  pace?: Pace;
  tags?: string[];
};

const TITLE_HEURISTICS: Heuristic[] = [
  {
    pattern: /코미디|웃기|폭소|개그|소동|배꼽|박장대소/,
    moods: ["light"],
    companions: ["friends"],
    pace: "dynamic",
    tags: ["코미디"],
  },
  {
    pattern: /로맨스|러브|사랑|연애|러브레터|첫사랑/,
    moods: ["romance"],
    companions: ["date"],
    tags: ["로맨스"],
  },
  {
    pattern: /추리|미스터리|스릴러|범죄|살인/,
    moods: ["deep"],
    pace: "dynamic",
    tags: ["미스터리"],
  },
  {
    pattern: /비극|상실|이별|죽음|망자|장례|전쟁/,
    moods: ["deep"],
    pace: "calm",
  },
  {
    pattern: /콘서트|라이브|재즈|록|클래식|오케스트라|밴드/,
    moods: ["music"],
    pace: "dynamic",
    tags: ["음악"],
  },
  {
    pattern: /햄릿|로미오|줄리엣|리어왕|맥베스|오셀로|체호프|입센/,
    moods: ["deep", "experimental"],
    tags: ["고전"],
  },
  {
    pattern: /어린이|키즈|쥬니어|동화|패밀리|가족|어른이|아이/,
    moods: ["light"],
    companions: ["family"],
    tags: ["가족"],
  },
  {
    pattern: /실험|아방가르드|퍼포먼스|행위|즉흥/,
    moods: ["experimental"],
    tags: ["실험"],
  },
  {
    pattern: /음악극|뮤직드라마|쇼케이스/,
    moods: ["music"],
    tags: ["음악극"],
  },
  {
    pattern: /청춘|성장|학교|학원|10대|20대/,
    moods: ["light", "romance"],
    companions: ["friends", "date"],
  },
];

type AutoTagInput = {
  title: string;
  genre: string;
  area?: string;
  venue?: string;
  runtime?: string;
  ageGuide?: string;
};

function paceFromRuntime(runtime?: string): Pace | undefined {
  if (!runtime) return undefined;
  const m = runtime.match(/(\d+)\s*분/);
  if (!m) return undefined;
  const minutes = parseInt(m[1], 10);
  if (Number.isNaN(minutes)) return undefined;
  if (minutes <= 90) return "dynamic";
  if (minutes >= 150) return "calm";
  return "balanced";
}

export function autoTagShow(input: AutoTagInput): AutoTag {
  const moods = new Set<Mood>();
  const companions = new Set<Companion>();
  let pace: Pace = "balanced";
  const tags = new Set<string>();

  const genre = input.genre ?? "";

  if (genre.includes("뮤지컬")) {
    moods.add("music");
    companions.add("date");
    tags.add("뮤지컬");
  }
  if (genre.includes("연극")) {
    companions.add("date");
    companions.add("friends");
    tags.add("연극");
  }
  if (genre.includes("무용")) {
    moods.add("experimental");
    pace = "calm";
    tags.add("무용");
  }
  if (genre.includes("국악") || genre.includes("한국음악")) {
    moods.add("music");
    moods.add("experimental");
    companions.add("family");
    pace = "calm";
    tags.add("국악");
  }
  if (genre.includes("서양음악") || genre.includes("클래식")) {
    moods.add("music");
    pace = "calm";
    companions.add("family");
    tags.add("클래식");
  }
  if (genre.includes("대중음악")) {
    moods.add("music");
    pace = "dynamic";
    companions.add("friends");
    tags.add("대중음악");
  }
  if (genre.includes("서커스") || genre.includes("마술")) {
    moods.add("light");
    companions.add("family");
    pace = "dynamic";
    tags.add("서커스/마술");
  }

  for (const h of TITLE_HEURISTICS) {
    if (h.pattern.test(input.title)) {
      h.moods?.forEach((m) => moods.add(m));
      h.companions?.forEach((c) => companions.add(c));
      if (h.pace) pace = h.pace;
      h.tags?.forEach((t) => tags.add(t));
    }
  }

  const ageGuide = input.ageGuide ?? "";
  if (/전체|모든|모두/.test(ageGuide)) {
    companions.add("family");
  }

  const runtimePace = paceFromRuntime(input.runtime);
  if (runtimePace) pace = runtimePace;

  if (moods.size === 0) moods.add("light");
  if (companions.size === 0) companions.add("alone");

  const pitchParts = [input.area, input.venue, input.genre].filter(
    (v): v is string => Boolean(v),
  );
  const pitch = pitchParts.length > 0 ? pitchParts.join(" · ") : "공연 정보 확인 필요";

  return {
    moods: [...moods],
    companions: [...companions],
    pace,
    pitch,
    tags: [...tags],
  };
}
