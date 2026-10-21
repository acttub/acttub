'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Mic, Square, Loader2, Share2, RotateCcw, ArrowRight, Volume2 } from 'lucide-react';
import PrimaryButton from '../components/PrimaryButton';
import { SCENES, type SceneScript } from '@/server/sceneData';

type SceneAxis = { score: number; comment: string };

type SceneResult = {
  title: string;
  score: number;
  oneLiner: string;
  axes: {
    voice: SceneAxis;
    emotion: SceneAxis;
    delivery: SceneAxis;
    reaction: SceneAxis;
  };
  strength: string;
  tip: string;
  bestMoment: string;
  funFallback: boolean;
};

const AXES: { key: keyof SceneResult['axes']; emoji: string; label: string }[] = [
  { key: 'voice', emoji: '🗣️', label: '발성' },
  { key: 'emotion', emoji: '😤', label: '감정' },
  { key: 'delivery', emoji: '🎯', label: '전달력' },
  { key: 'reaction', emoji: '🤝', label: '받아치기' },
];

const MAX_SECONDS = 12;

// 녹음 blob을 디코드해 최대 진폭(peak, 0~1)을 잰다. 서버 무음 가드에 보낼 신호.
// 압축된 webm은 서버에서 디코드가 비싸므로 PCM 접근이 공짜인 클라이언트에서 측정한다.
// 측정 실패(미지원 등) 시 1(들린다)로 가정해 정상 채점 흐름을 막지 않는다. (lineshot과 동일)
async function measureLevel(blob: Blob): Promise<number> {
  try {
    const AudioCtx =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return 1;
    const ctx = new AudioCtx();
    const buffer = await ctx.decodeAudioData(await blob.arrayBuffer());
    let peak = 0;
    for (let c = 0; c < buffer.numberOfChannels; c += 1) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < data.length; i += 1) {
        const v = Math.abs(data[i]);
        if (v > peak) peak = v;
      }
    }
    await ctx.close();
    return peak;
  } catch {
    return 1;
  }
}

// 상대역 대사를 브라우저 읽어주기(Web Speech)로 재생. 추가 비용 0.
// 미지원 브라우저면 조용히 넘어간다(대본 텍스트는 화면에 이미 보인다).
function speakLine(text: string) {
  try {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.98;
    synth.speak(utterance);
  } catch {
    // 미지원/차단 — 무시
  }
}

function stopSpeaking() {
  try {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
  } catch {
    // 무시
  }
}

export default function ScenePage() {
  const [scene, setScene] = useState<SceneScript | null>(null);
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [result, setResult] = useState<SceneResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const levelRef = useRef(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function pickScene(next: SceneScript) {
    stopSpeaking();
    setScene(next);
    setResult(null);
    setError('');
    setHasRecording(false);
    blobRef.current = null;
    // 장면을 고르면 상대역 첫 대사를 바로 들려준다.
    const firstAi = next.turns.find((turn) => turn.role === 'ai');
    if (firstAi) speakLine(firstAi.line);
  }

  function stopRecording() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    setRecording(false);
  }

  async function startRecording() {
    setError('');
    setResult(null);
    stopSpeaking();
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError('이 브라우저에서는 녹음을 지원하지 않아요.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        blobRef.current = blob;
        levelRef.current = 1;
        setHasRecording(blob.size > 0);
        stream.getTracks().forEach((track) => track.stop());
        void measureLevel(blob).then((level) => {
          levelRef.current = level;
        });
      };
      recorder.start();
      recorderRef.current = recorder;
      setHasRecording(false);
      setRecording(true);
      timerRef.current = setTimeout(stopRecording, MAX_SECONDS * 1000);
    } catch {
      setError('마이크 권한이 필요해요. 브라우저 설정에서 허용해 주세요.');
    }
  }

  async function scoreScene() {
    if (!scene) return;
    if (!blobRef.current || blobRef.current.size <= 0) {
      setError('먼저 내 대사를 녹음해 주세요.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.set('audio', blobRef.current, 'scene.webm');
      formData.set('sceneId', scene.id);
      formData.set('level', String(levelRef.current));
      const response = await fetch('/api/scene', { method: 'POST', body: formData });
      const payload = (await response.json()) as { result?: SceneResult; error?: unknown };
      if (!response.ok || !payload.result) {
        throw new Error(typeof payload.error === 'string' ? payload.error : '채점에 실패했어요.');
      }
      setResult(payload.result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '채점에 실패했어요.');
    } finally {
      setLoading(false);
    }
  }

  function retry() {
    stopSpeaking();
    blobRef.current = null;
    setHasRecording(false);
    setResult(null);
    setError('');
  }

  function backToSelect() {
    stopSpeaking();
    blobRef.current = null;
    setScene(null);
    setHasRecording(false);
    setResult(null);
    setError('');
  }

  async function shareResult() {
    if (!result || !scene) return;
    const text = `🎭 씬 — ${scene.title}\n${result.title} ${result.score}점\n${result.oneLiner}\n\nacttub.com/scene`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: '씬 결과', text });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        window.alert('결과를 복사했어요!');
      }
    } catch {
      // 사용자가 공유를 취소한 경우 등 — 무시
    }
  }

  return (
    <div className="scene container">
      <header className="scene__header">
        <Link href="/" className="scene__brand" aria-label="acttub 홈">
          act<span>tub</span>
        </Link>
        <span className="scene__badge">scene</span>
      </header>

      {/* 1) 장면 선택 */}
      {!scene ? (
        <section className="scene__intro">
          <h1 className="scene__title">씬 파트너</h1>
          <p className="scene__sub">
            AI가 상대역 대사를 던지면, 받아서 연기해 보세요. 끝나면 둘의 합(케미)을 점수로 매겨줘요. 카메라 필요 없어요!
          </p>
          <div className="scene__picker">
            {SCENES.map((item) => (
              <button key={item.id} type="button" className="scene__pick" onClick={() => pickScene(item)}>
                <span className="scene__pick-mood">{item.mood}</span>
                <span className="scene__pick-title">{item.title}</span>
                <span className="scene__pick-situation">{item.situation}</span>
              </button>
            ))}
          </div>
        </section>
      ) : !result ? (
        /* 2) 장면 플레이 */
        <section className="scene__play">
          <div className="scene__play-head">
            <button type="button" className="scene__back" onClick={backToSelect}>
              ← 다른 장면
            </button>
            <span className="scene__mood">{scene.mood}</span>
          </div>
          <h2 className="scene__play-title">{scene.title}</h2>
          <p className="scene__situation">{scene.situation}</p>

          <ol className="scene__dialogue">
            {scene.turns.map((turn, index) =>
              turn.role === 'ai' ? (
                <li key={index} className="scene__bubble scene__bubble--ai">
                  <span className="scene__bubble-who">상대역</span>
                  <p className="scene__bubble-line">{turn.line}</p>
                  <button
                    type="button"
                    className="scene__listen"
                    onClick={() => speakLine(turn.line)}
                    aria-label="상대역 대사 듣기"
                  >
                    <Volume2 size={14} /> 듣기
                  </button>
                </li>
              ) : (
                <li key={index} className="scene__bubble scene__bubble--user">
                  <span className="scene__bubble-who">내 차례</span>
                  <p className="scene__bubble-line">{turn.line}</p>
                  <span className="scene__bubble-guide">이 대사를 받아 연기해 녹음하세요</span>
                </li>
              ),
            )}
          </ol>

          <div className="scene__recorder">
            {!recording ? (
              <button type="button" className="scene__mic" onClick={startRecording} disabled={loading}>
                <Mic size={22} />
                {hasRecording ? '다시 녹음' : '내 대사 녹음'}
              </button>
            ) : (
              <button type="button" className="scene__mic scene__mic--rec" onClick={stopRecording}>
                <Square size={20} />
                녹음 멈추기
              </button>
            )}
            <p className="scene__hint">
              {recording
                ? '듣고 있어요… (최대 12초, 다 하면 멈추기)'
                : hasRecording
                  ? '녹음 완료! 합을 확인해 보세요.'
                  : '상대역 대사를 듣고, 마이크를 눌러 받아쳐 보세요.'}
            </p>
          </div>

          {error ? <p className="scene__error">{error}</p> : null}

          <PrimaryButton onClick={scoreScene} disabled={loading || recording || !hasRecording} size="xl">
            {loading ? <Loader2 size={18} className="scene__spin" /> : <Mic size={18} />}
            {loading ? '채점 중' : '합 보기'}
          </PrimaryButton>
        </section>
      ) : (
        /* 3) 결과 카드 */
        <section className="scene__result">
          <article className={`scene__card${result.funFallback ? ' scene__card--fun' : ''}`}>
            <div className="scene__card-head">
              <span className="scene__card-kicker">🎭 {scene?.title} · 합 결과</span>
              <h2 className="scene__card-title">{result.title}</h2>
            </div>

            <div className="scene__score">
              <span className="scene__score-num">{result.score}</span>
              <span className="scene__score-unit">점</span>
            </div>
            <p className="scene__oneliner">{result.oneLiner}</p>

            <ul className="scene__axes">
              {AXES.map(({ key, emoji, label }) => {
                const axis = result.axes[key];
                return (
                  <li key={key} className="scene__axis">
                    <div className="scene__axis-head">
                      <span className="scene__axis-name">
                        <span aria-hidden>{emoji}</span> {label}
                      </span>
                      <span className="scene__axis-score">{axis.score}</span>
                    </div>
                    <div className="scene__bar" aria-hidden>
                      <span className="scene__bar-fill" style={{ width: `${axis.score}%` }} />
                    </div>
                    {axis.comment ? <p className="scene__axis-comment">{axis.comment}</p> : null}
                  </li>
                );
              })}
            </ul>

            {result.strength ? (
              <div className="scene__note scene__note--strength">
                <span>💪 강점</span>
                <p>{result.strength}</p>
              </div>
            ) : null}
            {result.tip ? (
              <div className="scene__note scene__note--tip">
                <span>🎯 한 끗 팁</span>
                <p>{result.tip}</p>
              </div>
            ) : null}
            {result.bestMoment ? <p className="scene__vibe">🎬 명장면: “{result.bestMoment}”</p> : null}

            <Link href="/coach" className="scene__bridge">
              <span>합은 맞췄어요 — 표정·시선·거리감은 영상이라야 보여요. 이 장면 통째로 분석받기</span>
              <ArrowRight size={16} />
            </Link>
          </article>

          <div className="scene__actions">
            <PrimaryButton onClick={shareResult}>
              <Share2 size={18} />
              결과 공유하기
            </PrimaryButton>
          </div>

          <div className="scene__retries">
            <button type="button" className="scene__retry" onClick={retry}>
              <RotateCcw size={14} />
              다시 하기
            </button>
            <button type="button" className="scene__retry" onClick={backToSelect}>
              다른 장면 →
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
