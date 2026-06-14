'use client';

import { useEffect, useRef, useState } from 'react';
import { upload as uploadBlob } from '@vercel/blob/client';
import Link from 'next/link';
import {
  Camera,
  CircleStop,
  FileVideo,
  Loader2,
  Mic,
  PencilLine,
  RefreshCw,
  Sparkles,
  Upload,
} from 'lucide-react';
import { formatTime, type CoachFeedback } from '../coach/evaluation';
import { FocusBlock, NextStepBlock, OverallBlock, StrengthBlock } from './coachFeedbackCards';

type InputMode = 'upload' | 'record';

// 빠른 테스트 — 대본·의도를 준비할 필요 없이, 정해진 대사 한 마디를 연기하면 바로 분석한다.
// 분석 엔진은 /coach 메인과 동일(아래 ANALYZE_URL = v2). 대사·의도만 시스템이 미리 박아 호출한다.
// 대사 한 마디 체험이라 상한을 짧게 — v2는 영상당 Gemini 6~7회·함수 타임아웃 300s라 긴 영상은 비용·실패 위험.
const MAX_DURATION_SECONDS = 120;

// 정해진 대사 = 분석 기준. 각 대사에 "연기 의도"를 함께 박아 기존 파이프라인이 그 의도 격차로 평가한다.
// 의도를 사용자가 적지 않아도 되도록, 대사마다 한 줄짜리 표준 의도를 짝지어 둔다.
const SAMPLE_LINES: { line: string; intent: string }[] = [
  {
    line: '나 사실… 너한테 계속 하고 싶었던 말이 있었어.',
    intent: '쉽게 꺼내지 못한 마음을, 떨리지만 용기 내어 처음 입 밖으로 꺼내는 순간을 보여준다.',
  },
  {
    line: '괜찮아. 난 정말 괜찮으니까, 그런 표정 하지 마.',
    intent: '겉으로는 아무렇지 않은 척하지만 속으로는 무너지는 마음을 들키지 않으려 애쓰는 모습을 보여준다.',
  },
  {
    line: '왜 이제야 말해? 내가 얼마나 기다렸는지 알기는 해?',
    intent: '오래 참아온 서운함이 터져 나오면서도 그 밑에 반가움과 안도가 섞인 복잡한 감정을 보여준다.',
  },
];

// 빠른 테스트는 한 줄 대사이므로 분류를 묻지 않고 '대사'로 고정한다(ACTING_CATEGORIES 중 하나).
const CATEGORY = '대사';

// 분석 엔진은 지금 /coach 메인이 쓰는 v2 파이프라인을 그대로 재사용한다(다축 전경 카드 포함).
// 롤백: '/api/coach/analyze'(v1)로 바꾸면 단일 초점만 나온다.
const ANALYZE_URL = '/api/coach-second/analyze';

function fieldHintClass() {
  return 'text-xs font-medium text-muted';
}

export default function QuickTestPage() {
  const [mode, setMode] = useState<InputMode>('record');
  const [lineIndex, setLineIndex] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isStartingRecording, setIsStartingRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const inputSectionRef = useRef<HTMLElement | null>(null);
  const recordStartRef = useRef(0);

  const current = SAMPLE_LINES[lineIndex];

  const selectedVideoLabel = videoFile
    ? `${videoFile.name} · ${(videoFile.size / 1024 / 1024).toFixed(1)}MB`
    : 'mp4, mov, webm';

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [videoUrl]);

  useEffect(() => {
    if (!isRecording) return undefined;

    const timer = window.setInterval(() => {
      setRecordingSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRecording]);

  // 다른 대사로 — 결과·영상을 비우고 새 대사를 보여준다.
  function nextLine() {
    setLineIndex((index) => (index + 1) % SAMPLE_LINES.length);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoFile(null);
    setVideoUrl('');
    setDuration(0);
    setFeedback(null);
    setSessionId(null);
    setError('');
  }

  function handleRetake() {
    inputSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setSelectedVideo(file: File) {
    if (videoUrl) URL.revokeObjectURL(videoUrl);

    const objectUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(objectUrl);
    setDuration(0);
    setFeedback(null);
    setSessionId(null);
    setError('');
  }

  function onVideoMetadata() {
    const raw = videoRef.current?.duration ?? 0;
    // 녹화 webm은 duration이 ∞/0으로 잡히는 브라우저 이슈 — 그 경우 녹화 때 채운 길이를 유지한다.
    if (!Number.isFinite(raw) || raw <= 0) return;
    setDuration(raw);
    setError(raw > MAX_DURATION_SECONDS
      ? `영상이 너무 길어요(최대 ${MAX_DURATION_SECONDS / 60}분). 더 짧은 영상으로 올려 주세요.`
      : '');
  }

  async function startRecording() {
    setError('');
    setFeedback(null);
    setIsStartingRecording(true);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('이 브라우저에서는 직접 녹화를 지원하지 않습니다. 영상 업로드를 사용해 주세요.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      streamRef.current = stream;
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
        // 업로드 허용 목록은 'video/webm'만 — 녹화 mimeType의 ;codecs=… 꼬리를 떼어 정규화한다.
        const uploadType = (recorder.mimeType || 'video/webm').split(';')[0] || 'video/webm';
        const file = new File([blob], `quick-test-${Date.now()}.webm`, { type: uploadType });
        // 녹화 webm은 duration이 ∞/0으로 잡히는 브라우저 이슈 — 녹화 경과 시간을 길이로 직접 채운다.
        const recordedSeconds = Math.max(1, Math.round((Date.now() - recordStartRef.current) / 1000));
        setSelectedVideo(file);
        setDuration(recordedSeconds);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      setMode('record');
      setRecordingSeconds(0);
      recordStartRef.current = Date.now();
      recorder.start();
      setIsRecording(true);
    } catch {
      setError('카메라와 마이크 권한을 허용해야 직접 녹화할 수 있습니다.');
    } finally {
      setIsStartingRecording(false);
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setIsRecording(false);
  }

  function validateForm() {
    if (!videoFile) return '대사를 연기한 영상을 녹화하거나 업로드해 주세요.';
    if (duration <= 0) return '영상 정보를 읽은 뒤 다시 시도해 주세요.';
    if (duration > MAX_DURATION_SECONDS) {
      return `영상이 너무 길어요(최대 ${MAX_DURATION_SECONDS / 60}분). 더 짧은 영상으로 올려 주세요.`;
    }

    return '';
  }

  async function analyzeVideo() {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!videoFile) return;

    setIsAnalyzing(true);
    setError('');
    setFeedback(null);
    setSessionId(null);

    try {
      const blob = await uploadBlob(`coach/${Date.now()}-${videoFile.name}`, videoFile, {
        access: 'public',
        handleUploadUrl: '/api/coach/upload',
        contentType: videoFile.type || undefined,
        multipart: videoFile.size > 100 * 1024 * 1024,
      });

      const response = await fetch(ANALYZE_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: blob.url,
          fileName: `빠른 테스트 — ${current.line.slice(0, 20)}`,
          mimeType: videoFile.type || 'video/mp4',
          category: CATEGORY,
          intent: current.intent,
          startTime: 0,
          endTime: duration,
        }),
      });
      const payload = (await response.json()) as { feedback?: CoachFeedback; sessionId?: string; error?: string };

      if (!response.ok || !payload.feedback) {
        throw new Error(payload.error ?? '분석 요청에 실패했습니다.');
      }

      setFeedback(payload.feedback);
      setSessionId(payload.sessionId ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '분석 요청에 실패했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div
      className="coach-page mx-auto flex min-h-screen w-full flex-col gap-5 px-4 py-5 sm:px-6"
      style={{ maxWidth: '36rem' }}
    >
      {/* 폭 제한은 인라인 — coach-page frozen 유틸 set에 max-w-xl/md가 없어 클래스로는 안 먹는다. */}
      <section ref={inputSectionRef} className="flex flex-col gap-5">
        <header className="flex items-center justify-between border-b border-line/80 pb-4">
          <Link href="/" className="text-xl font-black tracking-tight text-ink" aria-label="acttub 홈">
            act<span className="text-primary">tub</span>
          </Link>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary-deep">
            빠른 테스트
          </span>
        </header>

        <section className="rounded-2xl border border-line bg-white/88 p-4 shadow-sm sm:p-5">
          <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">대사 한 마디, 바로 피드백</h1>
          <p className="mt-1 text-sm font-medium text-muted">
            대본을 준비할 필요 없어요. 아래 대사 한 줄을 연기해서 올리면 AI가 바로 분석해 드려요.
          </p>

          {/* 정해진 대사 — 분석 기준 */}
          <div className="mt-4 rounded-xl border border-primary/40 bg-primary-soft/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wide text-primary-deep">이 대사를 연기해보세요</span>
              <button
                type="button"
                onClick={nextLine}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary-deep transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw size={13} />
                다른 대사
              </button>
            </div>
            <p className="mt-3 text-lg font-black leading-7 text-ink sm:text-xl">“{current.line}”</p>
            <p className="mt-2 text-xs leading-5 text-primary-deep">연기 의도 · {current.intent}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-black text-ink">
              <Sparkles size={18} />
              연기 영상
            </div>
            <div className="flex rounded-xl border border-line bg-surface-muted p-1">
              <button
                type="button"
                onClick={() => setMode('record')}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  mode === 'record' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                <Camera size={16} />
                녹화
              </button>
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  mode === 'upload' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                <Upload size={16} />
                업로드
              </button>
            </div>
          </div>

          <div className="mt-4">
            {mode === 'upload' ? (
              <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-primary/50 bg-primary-soft/55 p-5 text-center transition hover:bg-primary-soft">
                <FileVideo className="text-primary-deep" size={28} />
                <span className="mt-3 text-sm font-bold text-ink">
                  {videoFile ? '업로드 완료' : '영상 파일 선택'}
                </span>
                <span className="mt-1 max-w-full truncate text-xs text-muted">{selectedVideoLabel}</span>
                <span className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary-deep">
                  {videoFile ? '다른 영상 선택' : '파일 고르기'}
                </span>
                <input
                  className="sr-only"
                  type="file"
                  accept="video/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) setSelectedVideo(file);
                  }}
                />
              </label>
            ) : (
              <div className="flex min-h-32 flex-col justify-center rounded-xl border border-line bg-surface-muted p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-ink">
                  <Mic size={18} />
                  {isStartingRecording
                    ? '권한 요청 중'
                    : isRecording
                      ? `녹화 중 ${formatTime(recordingSeconds)}`
                      : '브라우저 녹화'}
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">
                  시작을 누르면 브라우저의 카메라/마이크 권한 창이 열립니다.
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={isRecording || isStartingRecording}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-sm font-bold text-white transition hover:bg-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isStartingRecording ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                    {isStartingRecording ? '권한 확인' : '시작'}
                  </button>
                  <button
                    type="button"
                    onClick={stopRecording}
                    disabled={!isRecording}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-bold text-ink transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CircleStop size={16} />
                    정지
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 overflow-hidden rounded-xl bg-black">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                playsInline
                onLoadedMetadata={onVideoMetadata}
                className="aspect-video w-full bg-black object-contain"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center text-sm font-semibold text-white/70">
                영상 대기 중
              </div>
            )}
          </div>

          {duration > 0 ? (
            <p className={`mt-3 ${fieldHintClass()}`}>
              영상 길이 {formatTime(duration)} · 전체에서 연기 구간을 자동으로 잡아 분석해요.
            </p>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-xl border border-danger/30 bg-red-50 px-4 py-3 text-sm font-semibold text-danger">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={analyzeVideo}
            disabled={isAnalyzing}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {isAnalyzing ? '분석 중' : 'AI로 분석'}
          </button>
        </section>
      </section>

      <aside className="flex flex-col gap-5">
        {feedback ? (
          <>
            <OverallBlock overall={feedback.overall} />
            <StrengthBlock strength={feedback.strength} />
            <FocusBlock focus={feedback.focus} />
            <NextStepBlock nextStep={feedback.nextStep} onRetake={handleRetake} />
            <Link
              href={sessionId ? `/form/review?s=${encodeURIComponent(sessionId)}` : '/form/review'}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-surface-muted"
            >
              <PencilLine size={18} />
              피드백 어땠나요? 리뷰 남기기
            </Link>
          </>
        ) : (
          <section className="rounded-2xl border border-dashed border-line bg-white/70 p-5 text-sm leading-6 text-muted">
            대사를 연기한 영상을 올리고 분석하면, 잘된 순간 하나와 이번에 딱 하나 고칠 점, 그리고 다음 한 걸음이 카드로 표시됩니다.
          </section>
        )}
      </aside>
    </div>
  );
}
