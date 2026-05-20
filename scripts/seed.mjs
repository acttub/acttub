// Seed Firestore with a small, intentionally generic set of starter posts.
//
// Run:  node --env-file=.env.local scripts/seed.mjs
// Add `clean` arg to delete previous seed data first:
//       node --env-file=.env.local scripts/seed.mjs clean
//
// Content policy: no fabricated facts. No fake casting calls, no fake price
// listings, no fake personal histories presenting as real experience.
// Posts are open-ended discussion prompts that any user could plausibly
// have written — no specific people, places, productions, numbers, or
// audition events.

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
  { id: "seed_dohyun", username: "dohyun_d", displayName: "도현" },
  { id: "seed_chaewon", username: "chaewon_c", displayName: "채원" },
];

// 자유게시판 (free), 비밀게시판 (secret, all anonymous), 홍보게시판 (promo)
const POSTS = [
  // 자유 — 토론·잡담형
  { board: "free", authorIdx: 0, title: "여러분은 왜 연기를 시작하셨어요?", body: "처음 시작한 이유가 사람마다 다 다르더라고요. 저는 그냥 무대 위 어떤 사람이 진짜로 살아있는 것 같아서요. 여러분은 어땠나요?", anonymous: false, score: 8, daysAgo: 4 },
  { board: "free", authorIdx: 2, title: "연기 시작하면서 가장 많이 듣는 말", body: "‘안정적인 거 해라’를 백 번쯤 들은 것 같아요. 다들 어떤 말 자주 들으세요?", anonymous: false, score: 6, daysAgo: 3 },
  { board: "free", authorIdx: 6, title: "혼자 대본 읽을 때 어떤 순서로 하세요?", body: "장면 분석부터 들어가야 할지, 일단 소리 내서 여러 번 읽어보는 게 좋은지 매번 헷갈려요. 본인만의 루틴 공유해주실 분?", anonymous: false, score: 4, daysAgo: 2 },
  { board: "free", authorIdx: 4, title: "감정을 ‘진짜로’ 느낀다는 게 뭘까요?", body: "기술적으로 흉내 내는 거랑, 그 순간에 진짜로 느끼는 거랑 차이가 있다고 들었는데 그게 정확히 뭐인지 잘 모르겠어요. 여러분은 어떻게 구분하세요?", anonymous: false, score: 13, daysAgo: 8 },
  { board: "free", authorIdx: 5, title: "발성 연습과 표현 연습, 비중을 어떻게 두세요?", body: "둘 다 중요한 건 아는데 시간이 한정되어 있다 보니 매번 비율을 고민하게 돼요. 본인의 비중 가볍게 알려주실 수 있나요?", anonymous: false, score: 7, daysAgo: 6 },
  { board: "free", authorIdx: 1, title: "슬럼프 올 때 어떻게 빠져나오세요?", body: "스스로 부족하다는 생각이 들 때마다 한참을 못 움직이겠어요. 여러분만의 방법 있으면 듣고 싶어요.", anonymous: false, score: 16, daysAgo: 10 },
  { board: "free", authorIdx: 7, title: "같이 연기하는 사람과 호흡 맞춰가는 과정에 대해", body: "혼자 잘 준비해도 막상 상대랑 만나면 다른 그림이 나오잖아요. 그 간극을 줄여가는 과정이 매번 새롭다는 생각이 들어서, 다들 어떻게 다듬어가는지 궁금해서 적어봐요.", anonymous: false, score: 11, daysAgo: 9 },
  { board: "free", authorIdx: 3, title: "내가 좋아하는 배우 한 명만 꼽는다면", body: "이유까지 곁들여서 한 명씩 적어봐요. 새 인사이트 얻을 수 있을 것 같아서.", anonymous: false, score: 9, daysAgo: 5 },
  { board: "free", authorIdx: 8, title: "대본 외우는 본인만의 방법", body: "통째로 암기 vs 의미 단위로 끊어서 vs 녹음 들으면서 vs 손으로 적기. 본인은 어떤 식인지 공유해주실 분?", anonymous: false, score: 5, daysAgo: 3 },
  { board: "free", authorIdx: 9, title: "긴장 풀어주는 본인만의 루틴 있으세요?", body: "큰 자리 앞두면 매번 손이 차가워져요. 의식처럼 하는 자기만의 ritual 있으면 가볍게 공유해주세요.", anonymous: false, score: 12, daysAgo: 7 },
  { board: "free", authorIdx: 2, title: "관객 입장에서 인상 깊었던 연기 한 장면", body: "꼭 유명한 작품 아니어도 좋아요. 본인을 사로잡았던 장면 적어주세요.", anonymous: false, score: 6, daysAgo: 4 },
  { board: "free", authorIdx: 0, title: "연기 외에 본인에게 도움이 된 활동", body: "운동, 책 읽기, 다른 사람 관찰하기 등등. 의외로 도움됐던 거 공유해주세요.", anonymous: false, score: 14, daysAgo: 11 },
  { board: "free", authorIdx: 4, title: "비 오는 날 연기 연습 어떻게 해요?", body: "밖에 못 나가는 날엔 흐름이 깨지는 것 같아서요. 실내에서 할 수 있는 본인만의 연습법 있으세요?", anonymous: false, score: 3, daysAgo: 1 },
  { board: "free", authorIdx: 6, title: "본인의 강점과 약점을 잘 아는 편인가요?", body: "남이 알려주는 거 말고 스스로 알고 있는 거요. 이게 잘 안 되어서 매번 같은 자리에서 막히는 느낌이에요.", anonymous: false, score: 8, daysAgo: 5 },
  { board: "free", authorIdx: 7, title: "오늘 하루도 수고하셨어요", body: "별일 없이 지나간 하루여도 그 자체가 작은 성취예요. 내일은 더 가벼운 마음으로 시작하시길.", anonymous: false, score: 7, daysAgo: 1 },

  // 비밀게시판 — 모두 익명 (서버에서도 강제). 익명 사용자의 솔직한 마음.
  { board: "secret", authorIdx: 1, title: "그만두고 싶다는 생각이 자주 들어요", body: "이게 진짜 내 길인지 모르겠어요. 몇 년을 쏟았는데 아직도 시작점에 서 있는 느낌이고, 주위 사람들 보면 다 자기 자리 잡아가는 것 같아 자꾸 흔들려요.", anonymous: true, score: 18, daysAgo: 6 },
  { board: "secret", authorIdx: 3, title: "비교하는 거 멈추기가 너무 어려워요", body: "비교 안 한다고 다짐해도 SNS 한 번만 켜면 무너져요. 다들 어떻게 하세요.", anonymous: true, score: 14, daysAgo: 4 },
  { board: "secret", authorIdx: 5, title: "내가 정말 재능 있는지 모르겠어요", body: "노력하면 된다는 말이 어느 순간부터 위로가 안 돼요. 그냥 안 맞는 길일까봐 무서워요.", anonymous: true, score: 21, daysAgo: 7 },
  { board: "secret", authorIdx: 2, title: "가족이 응원해주지 않을 때", body: "걱정해서 그러시는 거 알지만 매번 듣다 보면 결국 흔들리게 돼요. 비슷한 분들 어떻게 견디시나요.", anonymous: true, score: 10, daysAgo: 5 },
  { board: "secret", authorIdx: 0, title: "거절이 자꾸 쌓이면 사람이 작아지는 것 같아요", body: "객관적으로 받아들이려고 해도 마음이 따라가질 않아요. 다음 자리 가기 전에 회복하는 방법 있을까요.", anonymous: true, score: 12, daysAgo: 3 },
  { board: "secret", authorIdx: 8, title: "혼자 사는 거 외로워요", body: "낮에는 괜찮은데 집에 돌아오면 갑자기 무너질 때가 있어요. 다들 이런 시기 어떻게 보내세요.", anonymous: true, score: 9, daysAgo: 2 },
  { board: "secret", authorIdx: 6, title: "이 길이 맞을까 라는 의심", body: "한 달에 한 번씩은 꼭 와요. 무시하는 게 답인지, 진지하게 들여다봐야 하는지 모르겠어요.", anonymous: true, score: 7, daysAgo: 4 },
  { board: "secret", authorIdx: 4, title: "동기들 잘 풀려가는 거 보면", body: "기쁘면서도 마음 한 켠이 시려요. 이런 감정 솔직하게 인정하는 게 먼저인 것 같아서 적어요.", anonymous: true, score: 11, daysAgo: 5 },

  // 홍보게시판 — 사용자가 채우는 공간이라 시드는 가볍게 ‘대화 시작’ 톤
  { board: "promo", authorIdx: 1, title: "여기 비어있네요. 다들 어떤 활동 하고 계세요?", body: "홍보 부담스럽지 않게 가볍게 자기 활동 소개부터 시작해보면 어떨까요. 댓글로 한 줄씩이라도.", anonymous: false, score: 4, daysAgo: 3 },
  { board: "promo", authorIdx: 9, title: "혹시 운영하시는 채널이나 블로그 있으세요?", body: "유튜브, 인스타, 블로그 — 형식 상관없이요. 같은 길 가는 사람들 어떻게 자기 작업 기록하는지 궁금해요.", anonymous: false, score: 6, daysAgo: 2 },
  { board: "promo", authorIdx: 0, title: "스터디 같이 할 사람 찾는 방법", body: "혼자 연습이 답답할 때 같이 할 사람 찾고 싶은데, 다들 어떻게 모이세요? 노하우 가볍게.", anonymous: false, score: 5, daysAgo: 1 },
];

const COMMENTS = [
  // post 0: 왜 연기를 시작
  { postIdx: 0, authorIdx: 1, body: "저는 처음 무대에서 박수받았을 때 느낌이 잊히지 않더라고요.", anonymous: false, daysAgo: 3, score: 3 },
  { postIdx: 0, authorIdx: 4, body: "딱히 거창한 이유는 없었는데 하다 보니 못 놓겠다는 분도 많은 것 같아요.", anonymous: false, daysAgo: 3, score: 4 },
  { postIdx: 0, authorIdx: 7, body: "어릴 적에 본 영화 한 편이 시작이었어요. 그 장면이 아직도 기억에 남아요.", anonymous: false, daysAgo: 2, score: 2 },

  // post 1: 자주 듣는 말
  { postIdx: 1, authorIdx: 3, body: "‘진짜 그 길로 가려고?’가 1등이요.", anonymous: false, daysAgo: 2, score: 5 },
  { postIdx: 1, authorIdx: 0, body: "그 말 듣고 나면 한 번 더 생각하게 되긴 해요.", anonymous: false, daysAgo: 2, score: 1 },
  { postIdx: 1, authorIdx: 8, body: "‘평생 할 수 있을 것 같아?’도 자주 들어요.", anonymous: false, daysAgo: 1, score: 2 },

  // post 2: 대본 루틴
  { postIdx: 2, authorIdx: 5, body: "저는 일단 그냥 통독 두세 번 한 다음에 분석 들어가요. 첫인상이 중요하다 싶어서요.", anonymous: false, daysAgo: 2, score: 5 },
  { postIdx: 2, authorIdx: 7, body: "감정 라인부터 잡고 거기서 흐름 따라가는 편이에요.", anonymous: false, daysAgo: 2, score: 3 },
  { postIdx: 2, authorIdx: 9, body: "녹음해서 들으면서 따라 하는 방식도 좋더라고요.", anonymous: false, daysAgo: 1, score: 2 },

  // post 3: 감정 진짜로 느끼는 것
  { postIdx: 3, authorIdx: 0, body: "장면 안에서 잠깐이라도 ‘나’가 사라지는 순간이 있는데, 저는 그게 진짜라고 생각해요.", anonymous: false, daysAgo: 7, score: 7 },
  { postIdx: 3, authorIdx: 2, body: "흉내 내는 건 관객한테도 다 보이더라고요. 신기하게.", anonymous: false, daysAgo: 6, score: 5 },
  { postIdx: 3, authorIdx: 3, body: "저는 둘이 명확히 갈리지는 않고 섞여있는 것 같아요.", anonymous: false, daysAgo: 5, score: 3, replyTo: 0 },
  { postIdx: 3, authorIdx: 6, body: "수업에서 들었던 게 ‘느낀다고 생각하지 말고, 듣는 데 집중해라’였어요.", anonymous: false, daysAgo: 4, score: 6 },

  // post 4: 발성 vs 표현
  { postIdx: 4, authorIdx: 7, body: "발성은 매일 조금씩, 표현은 작품 들어갈 때 집중해요.", anonymous: false, daysAgo: 5, score: 4 },
  { postIdx: 4, authorIdx: 4, body: "표현이 안 받쳐주면 발성도 의미가 없어지더라고요.", anonymous: false, daysAgo: 4, score: 3 },

  // post 5: 슬럼프
  { postIdx: 5, authorIdx: 0, body: "한동안 손 놓고 다른 거 해보는 게 도움됐어요. 책이든 영화든.", anonymous: false, daysAgo: 9, score: 6 },
  { postIdx: 5, authorIdx: 5, body: "운동이 의외로 큰 도움이었어요. 몸이 풀리면 마음도 풀리더라고요.", anonymous: false, daysAgo: 8, score: 5 },
  { postIdx: 5, authorIdx: 2, body: "비교를 멈추는 게 제일 어렵지만 그게 출발인 것 같아요.", anonymous: false, daysAgo: 7, score: 7 },
  { postIdx: 5, authorIdx: 8, body: "저는 그냥 한 주 푹 쉬어요. 그게 가장 빠르더라고요.", anonymous: false, daysAgo: 6, score: 3 },

  // post 6: 호흡 맞추기
  { postIdx: 6, authorIdx: 1, body: "상대가 뭘 하든 일단 받아주는 연습부터 했어요.", anonymous: false, daysAgo: 8, score: 4 },
  { postIdx: 6, authorIdx: 3, body: "리허설을 많이 할수록 줄어들더라고요, 이 차이가.", anonymous: false, daysAgo: 7, score: 3 },

  // post 7: 좋아하는 배우 한 명
  { postIdx: 7, authorIdx: 5, body: "한 명만 꼽기 너무 어렵네요 ㅎㅎ 댓글들 흥미롭게 읽고 있어요.", anonymous: false, daysAgo: 4, score: 2 },
  { postIdx: 7, authorIdx: 9, body: "전 같은 배우를 시기별로 다르게 좋아해요. 어릴 때 좋아한 분, 지금 좋아하는 분이 다 달라요.", anonymous: false, daysAgo: 3, score: 4 },

  // post 8: 대본 외우는 법
  { postIdx: 8, authorIdx: 4, body: "녹음해서 출퇴근 길에 듣는 게 가장 효율 좋더라고요.", anonymous: false, daysAgo: 2, score: 3 },
  { postIdx: 8, authorIdx: 0, body: "저는 손으로 한 번 적어요. 이게 의외로 잘 박혀요.", anonymous: false, daysAgo: 2, score: 2 },

  // post 9: 긴장 풀어주는 루틴
  { postIdx: 9, authorIdx: 1, body: "심호흡 + 어깨 돌리기 5분이요. 단순하지만 효과 좋아요.", anonymous: false, daysAgo: 6, score: 5 },
  { postIdx: 9, authorIdx: 6, body: "좋아하는 노래 한 곡 듣고 들어가는 게 저만의 의식이에요.", anonymous: false, daysAgo: 5, score: 4 },
  { postIdx: 9, authorIdx: 8, body: "긴장을 없애려고 하기보다 인정하고 시작하는 게 도움됐어요.", anonymous: false, daysAgo: 4, score: 6 },

  // post 10: 인상 깊었던 장면
  { postIdx: 10, authorIdx: 7, body: "이런 류의 글 너무 좋아요. 댓글 보면서 안 본 작품 찾게 돼요.", anonymous: false, daysAgo: 3, score: 2 },

  // post 11: 연기 외 도움된 활동
  { postIdx: 11, authorIdx: 4, body: "정기적으로 카페에서 사람 관찰하는 거. 진심 추천.", anonymous: false, daysAgo: 10, score: 7 },
  { postIdx: 11, authorIdx: 2, body: "글쓰기 시작하고 인물이 입체적으로 보이기 시작했어요.", anonymous: false, daysAgo: 9, score: 5 },
  { postIdx: 11, authorIdx: 5, body: "운동, 정말로요. 체력이 표현의 폭을 결정하더라고요.", anonymous: false, daysAgo: 8, score: 4 },

  // post 12: 비 오는 날
  { postIdx: 12, authorIdx: 0, body: "혼자 모놀로그 녹화해서 다시 보는 거 추천해요. 비 오는 날에 시간 잘 가요.", anonymous: false, daysAgo: 1, score: 2 },

  // post 13: 강점·약점
  { postIdx: 13, authorIdx: 8, body: "주변에 솔직히 말해줄 사람 한 명 두는 게 가장 빨라요.", anonymous: false, daysAgo: 4, score: 5 },
  { postIdx: 13, authorIdx: 3, body: "본인 작업 녹화해서 한 달 뒤에 다시 보면 의외로 잘 보여요.", anonymous: false, daysAgo: 3, score: 3 },

  // post 14: 오늘도 수고
  { postIdx: 14, authorIdx: 6, body: "이런 짧은 글이 의외로 큰 위로가 돼요. 고마워요.", anonymous: false, daysAgo: 1, score: 3 },

  // 비밀게시판 댓글 (post 15~22)
  // post 15: 그만두고 싶다
  { postIdx: 15, authorIdx: 0, body: "저도 비슷한 시기가 있었어요. 멈추는 게 정답일 때도 있다고 생각해요.", anonymous: true, daysAgo: 5, score: 6 },
  { postIdx: 15, authorIdx: 2, body: "주변과 자기 속도가 달라서 더 힘드신 것 같아요. 응원합니다.", anonymous: true, daysAgo: 5, score: 5 },
  { postIdx: 15, authorIdx: 7, body: "‘아직 시작점’이 사실 굉장히 길어요. 그렇게 생각하면 좀 낫더라고요.", anonymous: true, daysAgo: 4, score: 7 },

  // post 16: 비교 멈추기
  { postIdx: 16, authorIdx: 5, body: "SNS 한 달 끊었더니 진짜 달라졌어요. 추천드려요.", anonymous: true, daysAgo: 3, score: 5 },
  { postIdx: 16, authorIdx: 1, body: "비교가 들 때 ‘그래서 내가 지금 뭘 할 수 있지’ 한 줄 적는 거 도움돼요.", anonymous: true, daysAgo: 3, score: 6 },

  // post 17: 재능
  { postIdx: 17, authorIdx: 8, body: "재능보다 ‘계속 하는 사람’이 결국 남는 것 같아요. 길게 보세요.", anonymous: true, daysAgo: 6, score: 8 },
  { postIdx: 17, authorIdx: 4, body: "노력이 위로가 안 될 때 잠시 멈추는 것도 필요해요. 멈춤이 포기랑 다르더라고요.", anonymous: true, daysAgo: 6, score: 7 },
  { postIdx: 17, authorIdx: 3, body: "이 글 보고 마음이 조금 가라앉네요. 저도 같이 흔들리는 중이에요.", anonymous: true, daysAgo: 5, score: 4 },

  // post 18: 가족 응원 X
  { postIdx: 18, authorIdx: 6, body: "걱정의 모양이라는 거 알지만 매번 견디는 게 쉽지 않죠. 본인 페이스 잃지 마세요.", anonymous: true, daysAgo: 4, score: 5 },

  // post 19: 거절 쌓이면
  { postIdx: 19, authorIdx: 0, body: "거절이 본인을 평가한 게 아니라 ‘이 자리에 안 맞는다’는 것뿐이라고 계속 외워요.", anonymous: true, daysAgo: 2, score: 6 },
  { postIdx: 19, authorIdx: 9, body: "회복 루틴 하나 정해두면 도움돼요. 저는 친구랑 산책이요.", anonymous: true, daysAgo: 2, score: 4 },

  // post 20: 혼자 사는 외로움
  { postIdx: 20, authorIdx: 4, body: "저녁에 가벼운 통화 약속 하나 잡아두면 그날이 조금 가벼워져요.", anonymous: true, daysAgo: 1, score: 5 },

  // post 21: 이 길이 맞을까
  { postIdx: 21, authorIdx: 5, body: "정기적으로 와요. 무시하지 말되 휘둘리지도 않는 게 어렵죠.", anonymous: true, daysAgo: 3, score: 4 },

  // post 22: 동기 비교
  { postIdx: 22, authorIdx: 7, body: "솔직하게 인정하는 게 진짜 첫 발이에요. 응원해요.", anonymous: true, daysAgo: 4, score: 5 },

  // 홍보게시판 (post 23~25)
  { postIdx: 23, authorIdx: 4, body: "저는 학생들이랑 가끔 모놀로그 영상 찍어요. 가볍게 인스타에 올리는 정도.", anonymous: false, daysAgo: 2, score: 2 },
  { postIdx: 23, authorIdx: 9, body: "유튜브 시작한 지 얼마 안 됐어요. 같이 자극받을 분 있으면 좋겠네요.", anonymous: false, daysAgo: 2, score: 3 },

  { postIdx: 24, authorIdx: 0, body: "블로그에 매주 한 편씩 단편 리뷰 쓰고 있어요. 작은 습관 만들기에 좋더라고요.", anonymous: false, daysAgo: 1, score: 4 },

  { postIdx: 25, authorIdx: 8, body: "트위터 OF나 디스코드에서 즉흥 연기 같이 하는 작은 모임 있어요. 평일 저녁에 한 시간씩.", anonymous: false, daysAgo: 1, score: 3 },
];

function tsFromDaysAgo(d) {
  return Timestamp.fromDate(new Date(Date.now() - d * 86400000));
}

async function deleteCollectionByPrefix(colName, prefix) {
  const snap = await db.collection(colName).get();
  const targets = snap.docs.filter((d) => d.id.startsWith(prefix));
  console.log(`  - ${colName}: ${targets.length} doc(s) match "${prefix}*"`);
  for (const d of targets) await d.ref.delete();
}

async function deleteCommentsByPostIdPrefix(prefix) {
  const snap = await db.collection("comments").get();
  const targets = snap.docs.filter((d) => {
    const data = d.data();
    return typeof data.postId === "string" && data.postId.startsWith(prefix);
  });
  console.log(`  - comments under seed posts: ${targets.length}`);
  for (const d of targets) await d.ref.delete();
}

async function cleanSeed() {
  console.log("Cleaning previous seed data...");
  await deleteCommentsByPostIdPrefix("seed_post_");
  await deleteCollectionByPrefix("posts", "seed_post_");
  await deleteCollectionByPrefix("users", "seed_");
  console.log("Clean done.");
}

async function seed() {
  if (process.argv.includes("clean")) {
    await cleanSeed();
  }

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
  const firstByPostIdx = new Map();
  let commentCount = 0;
  for (let i = 0; i < COMMENTS.length; i++) {
    const c = COMMENTS[i];
    const a = USERS[c.authorIdx];
    const postId = postIds[c.postIdx];
    const ref = db.collection("comments").doc();
    let parentId = null;
    if (c.replyTo !== undefined) {
      parentId = firstByPostIdx.get(`${c.postIdx}:${c.replyTo}`) ?? null;
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
    const idx = COMMENTS.slice(0, i).filter((x) => x.postIdx === c.postIdx).length;
    firstByPostIdx.set(`${c.postIdx}:${idx}`, ref.id);
    commentCount += 1;
  }

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
