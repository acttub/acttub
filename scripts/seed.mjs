// Seed Firestore with fake users / posts / comments so the community
// doesn't feel empty on first visit.
//
// Run:  node --env-file=.env.local scripts/seed.mjs
//
// Idempotent: writes are by deterministic IDs (seed_*) where possible so
// re-running won't double-create.

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    }),
  });
}
const db = getFirestore();

const USERS = [
  { id: "seed_minseo", username: "minseo01", displayName: "민서" },
  { id: "seed_jihoon", username: "jihoon_actor", displayName: "지훈" },
  { id: "seed_yerin", username: "yerin_kim", displayName: "예린" },
  { id: "seed_hyunwoo", username: "hyunwoo_h", displayName: "현우" },
  { id: "seed_sua", username: "sua_actress", displayName: "수아" },
  { id: "seed_taeyang", username: "taeyang_pd", displayName: "태양" },
  { id: "seed_jiwon", username: "jiwon_act", displayName: "지원" },
  { id: "seed_eunseo", username: "eunseo_s", displayName: "은서" },
];

const POSTS = [
  // 자유
  {
    board: "free",
    authorIdx: 0,
    title: "오디션 끝나고 마시는 캔커피의 맛",
    body: "어제 오디션 8개 보고 마지막에 마신 캔커피, 진짜 살 것 같더라고요. 다들 자기만의 오디션 후 루틴 있으세요?",
    anonymous: false,
    score: 4,
    daysAgo: 2,
  },
  {
    board: "free",
    authorIdx: 3,
    title: "연기 슬럼프 진짜 힘들어요",
    body: "6개월째 캐스팅 0건이에요. 다들 어떻게 극복하시나요... 그만둬야 하나 진지하게 고민 중입니다.",
    anonymous: true,
    score: 14,
    daysAgo: 5,
  },
  {
    board: "free",
    authorIdx: 4,
    title: "오디션 의상 어디서 사세요?",
    body: "캐릭터별로 다 따로 사기엔 부담돼서요. 중고나라 같은 데서 사는 게 부끄럽진 않은가요?",
    anonymous: false,
    score: 3,
    daysAgo: 1,
  },
  {
    board: "free",
    authorIdx: 1,
    title: "발성 좋아지는 운동 3가지",
    body: "트레이너 분이 알려주신 건데 효과 진짜 있어요. 1) 입 크게 벌리고 모음 5초씩. 2) 누워서 복식호흡 10분. 3) 거울 보고 표정근 풀기. 한 달 해보세요.",
    anonymous: false,
    score: 19,
    daysAgo: 7,
  },

  // 정보
  {
    board: "info",
    authorIdx: 5,
    title: "[공유] MBC 신인 배우 공채 모집 (D-7)",
    body: "다들 보셨나요? 6월 30일까지 접수. 24~32세 남녀, 학력 무관. 프로필 + 영상 제출.\n\n링크 따로 DM 드릴게요.",
    anonymous: false,
    score: 22,
    daysAgo: 3,
  },
  {
    board: "info",
    authorIdx: 2,
    title: "강남 연기 학원 시간당 단가 비교",
    body: "최근에 알아봤는데:\n- A학원: 시간당 4만원\n- B학원: 패키지 30만원/주말\n- C학원: 무료 트라이얼 있음\n\n자세한 후기 댓글 남겨주세요.",
    anonymous: false,
    score: 11,
    daysAgo: 8,
  },
  {
    board: "info",
    authorIdx: 6,
    title: "프로필 사진 잘 찍는 작가 추천 (3분)",
    body: "제가 1년간 의뢰해본 작가 3분 정리해요. 자연광 잘 잡는 분, 시네마틱 톤 잘하는 분, 인물 표정 캐치 잘하는 분.",
    anonymous: false,
    score: 8,
    daysAgo: 4,
  },

  // 질문
  {
    board: "qna",
    authorIdx: 7,
    title: "오디션 자기소개 1분 가능한가요?",
    body: "긴장하면 자꾸 늘어져서 2분 넘기게 돼요. 어떻게 줄이시나요? 핵심만 남기는 팁 있으면 알려주세요.",
    anonymous: false,
    score: 6,
    daysAgo: 1,
  },
  {
    board: "qna",
    authorIdx: 3,
    title: "사극 발성은 어떻게 연습하세요?",
    body: "현대극 발성이랑 완전 다르더라고요. 호흡 잡는 방법이라도 알려주실 분 계실까요?",
    anonymous: true,
    score: 5,
    daysAgo: 6,
  },
  {
    board: "qna",
    authorIdx: 0,
    title: "에이전시 없이 오디션 정보 어디서 얻나요?",
    body: "신인이라 소속사가 없습니다. 카페나 텔레그램 채널 같은 거 추천해주세요. 사기 안 당하는 법도 ㅠ",
    anonymous: false,
    score: 12,
    daysAgo: 10,
  },

  // 후기
  {
    board: "review",
    authorIdx: 4,
    title: "어제 본 단막극 오디션 후기 (몰래)",
    body: "분위기는 좋았는데 PD분이 너무 무표정이라 압박감 장난 아니었어요. 결과 나오면 또 공유할게요.",
    anonymous: true,
    score: 7,
    daysAgo: 2,
  },
  {
    board: "review",
    authorIdx: 1,
    title: "[1년 일기] 첫 정극 데뷔까지",
    body: "작년 이맘때 처음 워크샵 시작했어요. 그 사이에 오디션 50번 넘게 보고, 거절 49번 받고, 마지막에 작은 역 하나 따냈습니다.\n\n돌이켜보면 거절이 단단하게 해줬어요. 같은 길 가시는 분들 힘내세요.",
    anonymous: false,
    score: 25,
    daysAgo: 12,
  },

  // 모집
  {
    board: "recruit",
    authorIdx: 5,
    title: "[단편영화] 30대 여성 주연 1명 모집",
    body: "7월 첫째 주 촬영 예정. 4일 분량. 페이 있어요(상의). 시나리오 DM 드립니다.\n\n경력 무관, 연기에 진심이면 OK.",
    anonymous: false,
    score: 9,
    daysAgo: 3,
  },
  {
    board: "recruit",
    authorIdx: 2,
    title: "독립영화 워크샵 함께 하실 분",
    body: "매주 토요일 오후 신촌에서 만나요. 시나리오 리딩 + 즉흥 연기. 회비 없음. 인원 6명까지.",
    anonymous: false,
    score: 4,
    daysAgo: 5,
  },

  // 응원
  {
    board: "cheer",
    authorIdx: 6,
    title: "데뷔 1년차 후배가 첫 광고를 찍었어요",
    body: "자랑하고 싶어서 올려요. 같이 워크샵 했던 친구인데 어제 첫 광고 촬영 마쳤대요. 진짜 자기 일처럼 기뻐요.",
    anonymous: false,
    score: 8,
    daysAgo: 1,
  },
  {
    board: "cheer",
    authorIdx: 7,
    title: "오디션 또 떨어졌지만 다시 갑니다",
    body: "이번 달 4번 떨어졌어요. 근데 이번 거절은 좀 다른 느낌이에요. PD분이 마지막에 \"다음에 또 보자\"고 하셨거든요. 그 한 마디로 한 주 또 버틸 수 있을 것 같아요.",
    anonymous: true,
    score: 16,
    daysAgo: 4,
  },
];

const COMMENTS = [
  // post 0: 캔커피
  { postIdx: 0, authorIdx: 1, body: "저는 오디션 끝나고 무조건 떡볶이 ㅋㅋ", anonymous: false, daysAgo: 2, score: 2 },
  { postIdx: 0, authorIdx: 2, body: "캔커피 맞아요 진짜 그 맛이 있어요...", anonymous: false, daysAgo: 1, score: 3 },

  // post 1: 슬럼프 (anonymous post)
  { postIdx: 1, authorIdx: 3, body: "저도 작년에 그랬어요. 한 달만 다 내려놓고 쉬어보세요. 진심으로요.", anonymous: false, daysAgo: 4, score: 5 },
  { postIdx: 1, authorIdx: 5, body: "캐스팅 0건이 실력 문제는 아니에요. 운도 크고 타이밍도 커요.", anonymous: true, daysAgo: 4, score: 3 },
  { postIdx: 1, authorIdx: 2, body: "꼭 다시 일어나실 거예요. 응원할게요.", anonymous: false, daysAgo: 3, score: 4 },
  { postIdx: 1, authorIdx: 3, body: "댓글들 보면서 많이 위로받았어요. 다들 고마워요.", anonymous: true, daysAgo: 2, score: 2, replyTo: 0 },

  // post 3: 발성 운동
  { postIdx: 3, authorIdx: 4, body: "1번 진짜 효과 있어요! 한 달 해봤는데 발성 안정감이 다르더라고요.", anonymous: false, daysAgo: 6, score: 4 },
  { postIdx: 3, authorIdx: 6, body: "트레이너가 어디 분이신가요? 저도 가보고 싶네요.", anonymous: false, daysAgo: 6, score: 1 },
  { postIdx: 3, authorIdx: 1, body: "DM 드릴게요!", anonymous: false, daysAgo: 5, score: 0, replyTo: 1 },

  // post 4: MBC 공채
  { postIdx: 4, authorIdx: 0, body: "DM 부탁드려요!", anonymous: false, daysAgo: 3, score: 0 },
  { postIdx: 4, authorIdx: 7, body: "감사합니다 매년 이맘때 한 번씩 있는 것 같네요.", anonymous: false, daysAgo: 2, score: 2 },
  { postIdx: 4, authorIdx: 4, body: "지원했어요! 결과 나오면 공유할게요.", anonymous: false, daysAgo: 1, score: 3 },

  // post 5: 학원 단가
  { postIdx: 5, authorIdx: 6, body: "C학원 트라이얼 가봤는데 분위기 좋아요. 추천 한 표.", anonymous: false, daysAgo: 7, score: 2 },
  { postIdx: 5, authorIdx: 3, body: "A는 1:1이라 비싼 만큼 효과 확실해요.", anonymous: true, daysAgo: 6, score: 1 },

  // post 7: 자기소개
  { postIdx: 7, authorIdx: 1, body: "팁: 본인 이름·전공·최근 작품 한 가지만 + 강점 한 문장. 50초 안에 끝나요.", anonymous: false, daysAgo: 1, score: 5 },
  { postIdx: 7, authorIdx: 5, body: "녹음해서 들어보면 늘어지는 부분 보여요. 추천드려요.", anonymous: false, daysAgo: 0, score: 3 },

  // post 8: 사극 발성
  { postIdx: 8, authorIdx: 2, body: "복식호흡 잡고 모음 길게 끌어보세요. 하루 15분이면 한 달 안에 차이 느껴요.", anonymous: false, daysAgo: 5, score: 4 },

  // post 9: 에이전시 없이
  { postIdx: 9, authorIdx: 4, body: "필름메이커스, 액터스, 그리고 텔레그램 ‘배우 공고’ 채널 봐보세요.", anonymous: false, daysAgo: 9, score: 6 },
  { postIdx: 9, authorIdx: 7, body: "선입금 요구하면 100% 사기예요. 무조건 거르세요.", anonymous: true, daysAgo: 8, score: 8 },
  { postIdx: 9, authorIdx: 0, body: "도움 많이 됐어요 감사합니다!", anonymous: false, daysAgo: 7, score: 1 },

  // post 10: 단막극 후기
  { postIdx: 10, authorIdx: 6, body: "PD가 무표정인 게 오히려 진짜 모드일 때 많아요. 좋은 신호일 수도.", anonymous: false, daysAgo: 1, score: 3 },
  { postIdx: 10, authorIdx: 5, body: "결과 꼭 공유해주세요!", anonymous: false, daysAgo: 1, score: 1 },

  // post 11: 1년 일기
  { postIdx: 11, authorIdx: 0, body: "거절 49번... 멋있어요. 정말로.", anonymous: false, daysAgo: 11, score: 6 },
  { postIdx: 11, authorIdx: 2, body: "저 지금 거절 14번째인데, 글 보고 좀 버텨봐야겠어요.", anonymous: true, daysAgo: 10, score: 7 },
  { postIdx: 11, authorIdx: 1, body: "거절 49번... 저는 지금 7번인데 진짜 큰 자극 됐어요.", anonymous: false, daysAgo: 11, score: 3, replyTo: 0 },

  // post 12: 단편 모집
  { postIdx: 12, authorIdx: 7, body: "프로필 보내드렸어요. 확인 부탁드려요.", anonymous: false, daysAgo: 2, score: 1 },
  { postIdx: 12, authorIdx: 2, body: "시나리오 DM 좀 부탁드립니다!", anonymous: false, daysAgo: 2, score: 0 },

  // post 13: 워크샵
  { postIdx: 13, authorIdx: 0, body: "지난주에 갔는데 분위기 너무 좋아요 추천드려요.", anonymous: false, daysAgo: 4, score: 2 },

  // post 14: 후배 광고
  { postIdx: 14, authorIdx: 3, body: "축하해요!! 다음은 본인 차례에요 ㅎㅎ", anonymous: false, daysAgo: 0, score: 2 },
  { postIdx: 14, authorIdx: 4, body: "와우, 같이 응원해요!", anonymous: false, daysAgo: 0, score: 1 },

  // post 15: 또 떨어졌지만
  { postIdx: 15, authorIdx: 0, body: "그 한 마디 진짜 큰 거예요. 끝까지 가세요.", anonymous: false, daysAgo: 3, score: 5 },
  { postIdx: 15, authorIdx: 6, body: "다음에 또 보자 = 다음에 분명히 부른다는 말 같아요.", anonymous: false, daysAgo: 3, score: 4 },
  { postIdx: 15, authorIdx: 7, body: "응원합니다.", anonymous: true, daysAgo: 2, score: 3 },
];

function tsFromDaysAgo(d) {
  return Timestamp.fromDate(new Date(Date.now() - d * 86400000));
}

async function seed() {
  console.log("Seeding users...");
  for (const u of USERS) {
    await db.collection("users").doc(u.id).set(
      {
        clerkId: u.id,
        username: u.username,
        displayName: u.displayName,
        avatarUrl: null,
        createdAt: tsFromDaysAgo(30),
      },
      { merge: true },
    );
  }

  console.log("Seeding posts...");
  const postIds = [];
  for (let i = 0; i < POSTS.length; i++) {
    const p = POSTS[i];
    const a = USERS[p.authorIdx];
    const id = `seed_post_${i}_${nanoid(8)}`;
    const created = tsFromDaysAgo(p.daysAgo);
    await db.collection("posts").doc(id).set({
      id,
      boardId: p.board,
      authorId: a.id,
      author: {
        id: a.id,
        username: a.username,
        displayName: a.displayName,
        avatarUrl: null,
      },
      anonymous: p.anonymous,
      title: p.title,
      body: p.body,
      score: p.score,
      commentCount: 0,
      createdAt: created,
      updatedAt: created,
      deletedAt: null,
    });
    postIds.push(id);
  }

  console.log("Seeding comments...");
  // group by postIdx, track first-comment id for replyTo resolution
  const firstCommentIds = new Map();
  let commentCount = 0;
  for (let i = 0; i < COMMENTS.length; i++) {
    const c = COMMENTS[i];
    const a = USERS[c.authorIdx];
    const postId = postIds[c.postIdx];
    const ref = db.collection("comments").doc();
    let parentId = null;
    if (c.replyTo !== undefined) {
      const key = `${c.postIdx}:${c.replyTo}`;
      parentId = firstCommentIds.get(key) ?? null;
    }
    const created = tsFromDaysAgo(c.daysAgo);
    await ref.set({
      postId,
      parentId,
      authorId: a.id,
      author: {
        id: a.id,
        username: a.username,
        displayName: a.displayName,
        avatarUrl: null,
      },
      anonymous: !!c.anonymous,
      body: c.body,
      score: c.score ?? 0,
      createdAt: created,
      deletedAt: null,
    });
    // Track 0th, 1st, ... per post for replyTo references
    const idx = COMMENTS.slice(0, i).filter((x) => x.postIdx === c.postIdx).length;
    firstCommentIds.set(`${c.postIdx}:${idx}`, ref.id);
    commentCount += 1;
  }

  // Bump commentCount per post based on actual seeded comments
  console.log("Updating commentCount per post...");
  const perPost = {};
  for (const c of COMMENTS) perPost[c.postIdx] = (perPost[c.postIdx] ?? 0) + 1;
  for (const [idx, count] of Object.entries(perPost)) {
    const postId = postIds[Number(idx)];
    await db.collection("posts").doc(postId).update({ commentCount: count });
  }

  console.log(`Done. Users: ${USERS.length}, Posts: ${POSTS.length}, Comments: ${commentCount}.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
