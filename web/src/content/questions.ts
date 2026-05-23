/**
 * 시나리오 문항 — Phase 2 본문 (14문항)
 *
 * 톤: idea-brief — 진지 30 / 재미 70, B급, 단톡방 짤맛, 도메인 양념 필수.
 * 구조: 각 문항 = 4선택지 = 서로 다른 4개의 axis (8극이 전체에 걸쳐 균등 분포).
 * 소재: 리허설(3), 캐스팅·오디션(2), 대본 첫 받음(2), 공연 직전(2),
 *       사후 평가·슬럼프(2), 합 안 맞음(1), 일상(2).
 *
 * v1 출시 전: 본인 폴리싱 통과 5점 척도 평균 ≥ 3.5 검증.
 */

import {
  Zap, Ruler, Microscope,
  Cloud, Layers, Shirt, BookOpen,
  Music, Map, Smile, Repeat,
  Waves, HelpCircle, Shuffle,
  Activity, Moon, Search, Drama,
  AudioLines, Pencil,
  Coffee, Phone, MessageCircle,
  Flame, Brain, Footprints, Heart,
  Camera, NotebookPen, Hand, Theater,
  Eye,
} from 'lucide-react';
import type { Question } from './schema';

export const QUESTIONS: Question[] = [
  // ── 1. 리허설 (즉흥 합) ───────────────────────────
  {
    id: 1,
    scenario: '리허설 중 상대 배우가 갑자기 다른 대사로 치고 들어왔다.',
    question: '너의 첫 반응은?',
    choices: [
      { label: '즉각 그 대사에 맞춰 받아친다',                  axis: 'I', icon: Zap },
      { label: '기존 대사로 계속 한다',                         axis: 'P', icon: Ruler },
      { label: '잠시 멈춰 그 결을 느껴본다',                    axis: 'N', icon: Waves },
      { label: '이 장면 비트가 어디서 어긋났는지 분석한다',     axis: 'A', icon: Microscope },
    ],
  },

  // ── 2. 대본 첫 밤 (사고 패턴) ───────────────────────
  {
    id: 2,
    scenario: '새 대본을 받은 첫 날 밤. 침대에 누웠다.',
    question: '머릿속에 가장 먼저 떠오르는 건?',
    choices: [
      { label: '캐릭터의 어린 시절을 상상해본다',                   axis: 'M', icon: Cloud },
      { label: '대본의 구조와 비트를 머릿속으로 분해한다',           axis: 'T', icon: Layers },
      { label: '연습 날 어떤 옷·헤어·걸음걸이로 갈지 떠올린다',      axis: 'B', icon: Shirt },
      { label: '캐릭터의 속마음에 한 줄 한 줄 답을 단다',            axis: 'S', icon: BookOpen },
    ],
  },

  // ── 3. 공연 직전 분장실 ─────────────────────────────
  {
    id: 3,
    scenario: '공연 직전 분장실. 시작까지 딱 10분 남았다.',
    question: '너는 지금?',
    choices: [
      { label: '음악 틀어놓고 흥얼거리며 몸부터 푼다',       axis: 'I', icon: Music },
      { label: '오늘 동선을 머릿속으로 처음부터 한 번 더',    axis: 'P', icon: Map },
      { label: '거울 보면서 첫 표정을 점검한다',              axis: 'B', icon: Smile },
      { label: '첫 대사 한 줄을 속으로 다섯 번 되뇐다',        axis: 'S', icon: Repeat },
    ],
  },

  // ── 4. 디렉션 받기 ──────────────────────────────────
  {
    id: 4,
    scenario: '연출이 "잘 됐는데 뭔가 부족해" 라고 던졌다.',
    question: '너의 다음 액션은?',
    choices: [
      { label: '"잠깐 캐릭터 다시 만나고 올게요" 한 발 빠져나갔다 들어간다', axis: 'S', icon: Moon },
      { label: '다시 한 번 감정을 생각해본다',                              axis: 'N', icon: Waves },
      { label: '"부족한 게 정확히 뭐예요?" 짚어달라 한다',                   axis: 'A', icon: HelpCircle },
      { label: '"다음 컷 때 살짝 다르게 가볼게요"',                          axis: 'I', icon: Shuffle },
    ],
  },

  // ── 5. 캐스팅 떨어진 날 ─────────────────────────────
  {
    id: 5,
    scenario: '캐스팅에서 떨어졌다. 동기는 붙었다.',
    question: '집에 와서 너는?',
    choices: [
      { label: '운동을 가거나 어디든 가서 몸을 움직인다',           axis: 'B', icon: Activity },
      { label: '이불 속에서 두 시간 동안 천장을 본다',               axis: 'S', icon: Moon },
      { label: '"내가 어떤 걸 못 한 걸까" 라며 떠올려본다',          axis: 'A', icon: Cloud },
      { label: '"이건 이 캐릭터를 못 만난 거야" 라며 캐릭터 핑계',   axis: 'M', icon: Drama },
    ],
  },

  // ── 6. 리딩 첫 날 (인물 관찰) ────────────────────────
  {
    id: 6,
    scenario: '리딩 첫 날. 처음 보는 배우들과 같은 테이블에 앉았다.',
    question: '대본 외에 너의 시선이 향하는 곳은?',
    choices: [
      { label: '그 사람의 손짓·말투를 관찰한다',          axis: 'M', icon: Eye },
      { label: '이 사람들 톤·박자가 어떻게 다른지 듣는다', axis: 'T', icon: AudioLines },
      { label: '리딩보다 일단 어색한 공기부터 푼다',       axis: 'I', icon: Smile },
      { label: '대본에 첫 인상을 메모해둔다',              axis: 'P', icon: Pencil },
    ],
  },

  // ── 7. 합이 안 맞음 ─────────────────────────────────
  {
    id: 7,
    scenario: '상대 배우와 며칠째 호흡이 어긋난다. 너의 감정이 자꾸 식는다.',
    question: '너의 해법은?',
    choices: [
      { label: '상대 배우가 왜 그러는지 파악한다',                    axis: 'A', icon: Coffee },
      { label: '"이 비트에서 우리 박자 안 맞아" 라고 짚어준다',          axis: 'T', icon: Ruler },
      { label: '"어차피 무대 위에선 다르게 될 거야" 라며 본 무대 기대',   axis: 'I', icon: Theater },
      { label: '"오늘 셋업부터 다시 짜보자" 라고 제안한다',               axis: 'P', icon: NotebookPen },
    ],
  },

  // ── 8. 새벽 4시 (캐릭터 흡수) ───────────────────────
  {
    id: 8,
    scenario: '새벽 4시. 잠이 안 오고 캐릭터 생각만 난다.',
    question: '너는 그 시간에?',
    choices: [
      { label: '캐릭터한테 보내는 편지를 쓴다',           axis: 'S', icon: NotebookPen },
      { label: '캐릭터인 척 셀카·영상을 찍어본다',         axis: 'B', icon: Camera },
      { label: '캐릭터의 어린 시절 일기를 상상해서 쓴다',  axis: 'N', icon: Cloud },
      { label: '비슷한 작품·영화 자료를 죽 본다 (참고용)', axis: 'A', icon: Search },
    ],
  },

  // ── 9. 오디션장 대기 ────────────────────────────────
  {
    id: 9,
    scenario: '오디션장 복도. 다른 지망생 다섯 명이 같이 대기 중이다.',
    question: '너는 이 5분 동안?',
    choices: [
      { label: '눈 감고 캐릭터 상태로 천천히 들어간다',        axis: 'M', icon: Brain },
      { label: '대사를 읽으며 점검한다',                       axis: 'T', icon: AudioLines },
      { label: '복도 끝까지 걸어갔다 오면서 몸을 푼다',         axis: 'B', icon: Footprints },
      { label: '오늘 어떤 인상이고 싶은지 속으로 정리한다',      axis: 'S', icon: Brain },
    ],
  },

  // ── 10. 디렉션 vs 직감 충돌 ──────────────────────────
  {
    id: 10,
    scenario: '연출이 준 디렉션이 너의 캐릭터 해석과 정반대다.',
    question: '너의 첫 카드는?',
    choices: [
      { label: '"한 번 그대로 가보고 그 다음에 얘기드릴게요"',        axis: 'P', icon: Ruler },
      { label: '"제가 느낀 결은 좀 다른데" 하고 일단 짚는다',         axis: 'A', icon: HelpCircle },
      { label: '"그렇게 가면 캐릭터가 죽을 것 같아요" 감정 호소',     axis: 'N', icon: Heart },
      { label: '둘 다 가보고 카메라가 좋아하는 쪽으로 간다',          axis: 'I', icon: Shuffle },
    ],
  },

  // ── 11. 컷 사인 후 ──────────────────────────────────
  {
    id: 11,
    scenario: '"컷, 좋아요" 가 나왔다. 너의 다음 1분은?',
    question: '제일 자연스럽게 하는 행동은?',
    choices: [
      { label: '바로 의자에 풀어져 캐릭터에서 빠져나온다',                axis: 'T', icon: Coffee },
      { label: '아직 캐릭터로 남아서 다음 컷 대비',                       axis: 'M', icon: Drama },
      { label: '머릿속에서 방금 그 컷이 카메라에 어떻게 담겼을지 본다',   axis: 'N', icon: Eye },
      { label: '마음이 아직 떨려서 한쪽에 가만히 앉아있는다',              axis: 'S', icon: Moon },
    ],
  },

  // ── 12. 대본 외우는 방식 ────────────────────────────
  {
    id: 12,
    scenario: '내일 분량 대본을 외워야 한다.',
    question: '너의 외우기 루틴은?',
    choices: [
      { label: '소리 내서 읽으며 몸으로 한 번 움직여본다',         axis: 'B', icon: Hand },
      { label: '캐릭터가 왜 이 말을 했는지 직감으로 먼저 채운다',  axis: 'N', icon: Cloud },
      { label: '캐릭터 입장에서 한 줄씩 곱씹는다 (왜 이 말을?)',   axis: 'M', icon: MessageCircle },
      { label: '녹음해서 상대 대사 자리에 자기 목소리 넣어 듣기',  axis: 'T', icon: Phone },
    ],
  },

  // ── 13. 슬럼프 ───────────────────────────────────────
  {
    id: 13,
    scenario: '"내가 연기를 왜 하지" 가 머릿속에 자리잡은 일주일째.',
    question: '너의 처방은?',
    choices: [
      { label: '오랫동안 안 본 작품을 다시 본다',                 axis: 'N', icon: Theater },
      { label: '방에 누워 천장만 본다 (시간 흘려보내기)',          axis: 'S', icon: Moon },
      { label: '나의 강점·약점을 노트에 정리한다 (객관화)',         axis: 'A', icon: NotebookPen },
      { label: '동기·선배한테 즉흥적으로 약속 잡고 만난다',          axis: 'I', icon: Phone },
    ],
  },

  // ── 14. 무대 인사 직전 ──────────────────────────────
  {
    id: 14,
    scenario: '커튼콜 직전. 박수 소리가 들린다.',
    question: '너의 머릿속은?',
    choices: [
      { label: '"오늘 그 장면 진짜 좋았다" 한 컷이 떠오른다',         axis: 'M', icon: Flame },
      { label: '"한 군데 NG 났는데 다음엔 어떻게 정리할지" 복기 시작', axis: 'T', icon: Brain },
      { label: '"관객한테 어떻게 인사할까" 동선 정리',                 axis: 'P', icon: Map },
      { label: '"끝났다" 그냥 비어있다',                              axis: 'S', icon: Moon },
    ],
  },
];

export const QUESTION_COUNT = QUESTIONS.length;
