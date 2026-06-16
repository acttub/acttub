'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Mic, Square, Loader2, Share2, RotateCcw, Shuffle, ArrowRight } from 'lucide-react';
import PrimaryButton from '../components/PrimaryButton';

type LineshotAxis = { score: number; comment: string };

type Lineshot = {
  title: string;
  score: number;
  oneLiner: string;
  axes: {
    voice: LineshotAxis;
    emotion: LineshotAxis;
    delivery: LineshotAxis;
  };
  strength: string;
  tip: string;
  actorVibe: string;
  funFallback: boolean;
};

const SAMPLE_LINES = [
  '왜 이제 왔어',
  '내가 다 잘못했어',
  '괜찮아, 다 지나갈 거야',
  '너 진심이야?',
  '난 한 번도 너를 의심한 적 없어',
  '이게… 마지막이야',
];

const AXES: { key: keyof Lineshot['axes']; emoji: string; label: string }[] = [
  { key: 'voice', emoji: '🗣️', label: '발성' },
  { key: 'emotion', emoji: '😤', label: '감정' },
  { key: 'delivery', emoji: '🎯', label: '전달력' },
];

const MAX_SECONDS = 10;

export default function LineshotPage() {
  const [line, setLine] = useState('');
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [result, setResult] = useState<Lineshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function pickRandomLine() {
    setLine(SAMPLE_LINES[Math.floor(Math.random() * SAMPLE_LINES.length)]);
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
        blobRef.current = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setHasRecording(blobRef.current.size > 0);
        stream.getTracks().forEach((track) => track.stop());
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

  async function scoreLine() {
    if (!blobRef.current || blobRef.current.size <= 0) {
      setError('먼저 한 줄 녹음해 주세요.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.set('audio', blobRef.current, 'lineshot.webm');
      formData.set('line', line.trim());
      const response = await fetch('/api/lineshot', { method: 'POST', body: formData });
      const payload = (await response.json()) as { result?: Lineshot; error?: unknown };
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

  function reset() {
    blobRef.current = null;
    setHasRecording(false);
    setResult(null);
    setError('');
  }

  async function shareResult() {
    if (!result) return;
    const text = `🎙️ 라인샷 — ${result.title} ${result.score}점\n${result.oneLiner}\n\nacttub.com/lineshot`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: '라인샷 결과', text });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        window.alert('결과를 복사했어요!');
      }
    } catch {
      // 사용자가 공유를 취소한 경우 등 — 무시
    }
  }

  return (
    <div className="lineshot container">
      <header className="lineshot__header">
        <Link href="/" className="lineshot__brand" aria-label="acttub 홈">
          act<span>tub</span>
        </Link>
        <span className="lineshot__badge">lineshot</span>
      </header>

      {!result ? (
        <section className="lineshot__intro">
          <h1 className="lineshot__title">라인샷</h1>
          <p className="lineshot__sub">대사 한 줄 읽으면 AI가 발성·감정·전달력을 점수로 매겨줘요. 10초면 끝!</p>

          <div className="lineshot__form">
            <label className="lineshot__field">
              <span className="lineshot__label">대사 한 줄</span>
              <textarea
                className="lineshot__input"
                value={line}
                onChange={(event) => setLine(event.target.value)}
                placeholder="읽을 대사를 적거나, 랜덤으로 받아보세요"
                maxLength={200}
                rows={2}
                disabled={recording}
              />
            </label>
            <button type="button" className="lineshot__shuffle" onClick={pickRandomLine} disabled={recording}>
              <Shuffle size={14} />
              랜덤 대사
            </button>

            <div className="lineshot__recorder">
              {!recording ? (
                <button type="button" className="lineshot__mic" onClick={startRecording} disabled={loading}>
                  <Mic size={22} />
                  {hasRecording ? '다시 녹음' : '녹음 시작'}
                </button>
              ) : (
                <button type="button" className="lineshot__mic lineshot__mic--rec" onClick={stopRecording}>
                  <Square size={20} />
                  녹음 멈추기
                </button>
              )}
              <p className="lineshot__hint">
                {recording
                  ? '듣고 있어요… (최대 10초, 다 읽으면 멈추기)'
                  : hasRecording
                    ? '녹음 완료! 점수 받아보세요.'
                    : '마이크 버튼을 누르고 한 줄 읽어보세요.'}
              </p>
            </div>

            {error ? <p className="lineshot__error">{error}</p> : null}

            <PrimaryButton onClick={scoreLine} disabled={loading || recording || !hasRecording} size="xl">
              {loading ? <Loader2 size={18} className="lineshot__spin" /> : <Mic size={18} />}
              {loading ? '채점 중' : '점수 받기'}
            </PrimaryButton>
          </div>
        </section>
      ) : (
        <section className="lineshot__result">
          <article className={`lineshot__card${result.funFallback ? ' lineshot__card--fun' : ''}`}>
            <div className="lineshot__card-head">
              <span className="lineshot__card-kicker">🎙️ 라인샷 결과</span>
              <h2 className="lineshot__card-title">{result.title}</h2>
            </div>

            <div className="lineshot__score">
              <span className="lineshot__score-num">{result.score}</span>
              <span className="lineshot__score-unit">점</span>
            </div>
            <p className="lineshot__oneliner">{result.oneLiner}</p>

            <ul className="lineshot__axes">
              {AXES.map(({ key, emoji, label }) => {
                const axis = result.axes[key];
                return (
                  <li key={key} className="lineshot__axis">
                    <div className="lineshot__axis-head">
                      <span className="lineshot__axis-name">
                        <span aria-hidden>{emoji}</span> {label}
                      </span>
                      <span className="lineshot__axis-score">{axis.score}</span>
                    </div>
                    <div className="lineshot__bar" aria-hidden>
                      <span className="lineshot__bar-fill" style={{ width: `${axis.score}%` }} />
                    </div>
                    {axis.comment ? <p className="lineshot__axis-comment">{axis.comment}</p> : null}
                  </li>
                );
              })}
            </ul>

            {result.strength ? (
              <div className="lineshot__note lineshot__note--strength">
                <span>💪 강점</span>
                <p>{result.strength}</p>
              </div>
            ) : null}
            {result.tip ? (
              <div className="lineshot__note lineshot__note--tip">
                <span>🎯 한 끗 팁</span>
                <p>{result.tip}</p>
              </div>
            ) : null}
            {result.actorVibe ? <p className="lineshot__vibe">🎬 {result.actorVibe}</p> : null}

            <Link href="/coach" className="lineshot__bridge">
              <span>음성만으론 절반만 봤어요 — 표정·움직임까지 영상으로 분석받기</span>
              <ArrowRight size={16} />
            </Link>
          </article>

          <div className="lineshot__actions">
            <PrimaryButton onClick={shareResult}>
              <Share2 size={18} />
              결과 공유하기
            </PrimaryButton>
          </div>

          <button type="button" className="lineshot__retry" onClick={reset}>
            <RotateCcw size={14} />
            다시 하기
          </button>
        </section>
      )}
    </div>
  );
}
