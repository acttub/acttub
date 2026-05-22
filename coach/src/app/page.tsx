"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Camera,
  CircleStop,
  Clock3,
  FileVideo,
  Loader2,
  Mic,
  PencilLine,
  Play,
  Scissors,
  Sparkles,
  Upload,
} from "lucide-react";
import { ACTING_CATEGORIES, type CoachFeedback, type EvaluationMetric, formatTime } from "@/lib/evaluation";

type InputMode = "upload" | "record";

function FeedbackList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MetricGauge({ metric }: { metric: EvaluationMetric }) {
  const score = Math.max(0, Math.min(100, metric.score));

  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div
          role="meter"
          aria-label={`${metric.label} 점수`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={score}
          className="grid h-20 w-20 flex-none place-items-center rounded-full"
          style={{
            background: `conic-gradient(var(--primary) ${score * 3.6}deg, #edf0f2 0deg)`,
          }}
        >
          <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-lg font-black text-ink">
            {score}
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-black text-ink">{metric.label}</h3>
          <p className="mt-1 text-sm leading-5 text-muted">{metric.note}</p>
        </div>
      </div>
    </article>
  );
}

function fieldClass() {
  return "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";
}

export default function CoachPage() {
  const [mode, setMode] = useState<InputMode>("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [fileName, setFileName] = useState("");
  const [category, setCategory] = useState<string>(ACTING_CATEGORIES[0]);
  const [intent, setIntent] = useState("");
  const [memo, setMemo] = useState("");
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isStartingRecording, setIsStartingRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const segmentLength = useMemo(() => Math.max(0, endTime - startTime), [endTime, startTime]);
  const selectedVideoLabel = videoFile
    ? `${videoFile.name} · ${(videoFile.size / 1024 / 1024).toFixed(1)}MB`
    : "mp4, mov, webm";

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

  function setSelectedVideo(file: File) {
    if (videoUrl) URL.revokeObjectURL(videoUrl);

    const objectUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(objectUrl);
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setFeedback(null);
    setMemo("");
    setError("");
  }

  function onVideoMetadata() {
    const nextDuration = videoRef.current?.duration ?? 0;
    setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
    setStartTime(0);
    setEndTime(Number.isFinite(nextDuration) ? Math.min(nextDuration, 60) : 0);
  }

  function onTimeUpdate() {
    const video = videoRef.current;
    if (!video || endTime <= startTime) return;

    if (video.currentTime > endTime) {
      video.pause();
      video.currentTime = startTime;
    }
  }

  function playSegment() {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = startTime;
    void video.play();
  }

  async function startRecording() {
    setError("");
    setFeedback(null);
    setIsStartingRecording(true);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("이 브라우저에서는 직접 녹화를 지원하지 않습니다. 영상 업로드를 사용해 주세요.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
        ? "video/webm;codecs=vp8,opus"
        : "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      streamRef.current = stream;
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
        const file = new File([blob], `coach-recording-${Date.now()}.webm`, { type: blob.type });
        setSelectedVideo(file);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      setMode("record");
      setRecordingSeconds(0);
      recorder.start();
      setIsRecording(true);
    } catch {
      setError("카메라와 마이크 권한을 허용해야 직접 녹화할 수 있습니다.");
    } finally {
      setIsStartingRecording(false);
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setIsRecording(false);
  }

  function validateForm() {
    if (!videoFile) return "분석할 영상을 업로드하거나 녹화해 주세요.";
    if (!fileName.trim()) return "파일 이름을 입력해 주세요.";
    if (!intent.trim()) return "이번 연습의 의도나 목표를 입력해 주세요.";
    if (duration <= 0) return "영상 정보를 읽은 뒤 다시 시도해 주세요.";
    if (startTime < 0 || endTime <= startTime || endTime > duration + 0.5) {
      return "분석 구간의 시작과 끝 시간을 확인해 주세요.";
    }

    return "";
  }

  async function analyzeVideo() {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!videoFile) return;

    setIsAnalyzing(true);
    setError("");
    setFeedback(null);

    const formData = new FormData();
    formData.set("video", videoFile);
    formData.set("fileName", fileName.trim());
    formData.set("category", category);
    formData.set("intent", intent.trim());
    formData.set("startTime", String(startTime));
    formData.set("endTime", String(endTime));

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as { feedback?: CoachFeedback; error?: string };

      if (!response.ok || !payload.feedback) {
        throw new Error(payload.error ?? "분석 요청에 실패했습니다.");
      }

      setFeedback(payload.feedback);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "분석 요청에 실패했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:px-8 lg:py-8">
      <section className="flex flex-col gap-5">
        <header className="flex items-center justify-between border-b border-line/80 pb-4">
          <Link href="/" className="text-xl font-black tracking-tight text-ink" aria-label="acttub 홈">
            act<span className="text-primary">tub</span>
          </Link>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary-deep">
            coach
          </span>
        </header>

        <section className="rounded-2xl border border-line bg-white/88 p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">연기 연습 피드백</h1>
              <p className="mt-1 text-sm font-medium text-muted">영상 구간과 의도를 기준으로 Gemini가 연습 피드백을 만듭니다.</p>
            </div>
            <div className="flex rounded-xl border border-line bg-surface-muted p-1">
              <button
                type="button"
                onClick={() => setMode("upload")}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  mode === "upload" ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                <Upload size={16} />
                업로드
              </button>
              <button
                type="button"
                onClick={() => setMode("record")}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  mode === "record" ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                <Camera size={16} />
                녹화
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {mode === "upload" ? (
              <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-primary/50 bg-primary-soft/55 p-5 text-center transition hover:bg-primary-soft">
                <FileVideo className="text-primary-deep" size={28} />
                <span className="mt-3 text-sm font-bold text-ink">
                  {videoFile ? "업로드 완료" : "영상 파일 선택"}
                </span>
                <span className="mt-1 max-w-full truncate text-xs text-muted">{selectedVideoLabel}</span>
                <span className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary-deep">
                  {videoFile ? "다른 영상 선택" : "파일 고르기"}
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
                    ? "권한 요청 중"
                    : isRecording
                      ? `녹화 중 ${formatTime(recordingSeconds)}`
                      : "브라우저 녹화"}
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
                    {isStartingRecording ? "권한 확인" : "시작"}
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

            <div className="rounded-xl border border-line bg-white p-4">
              <label className="text-xs font-bold uppercase tracking-wide text-muted">파일 이름</label>
              <input
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                className={`mt-2 ${fieldClass()}`}
                placeholder="예: 햄릿 3막 독백"
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label>
                  <span className="text-xs font-bold uppercase tracking-wide text-muted">분류</span>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className={`mt-2 ${fieldClass()}`}
                  >
                    {ACTING_CATEGORIES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-muted">구간</span>
                  <div className="mt-2 rounded-xl border border-line bg-surface-muted px-3 py-2.5 text-sm font-bold text-ink">
                    {formatTime(segmentLength)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-2 text-sm font-black text-ink">
            <Scissors size={18} />
            분석 구간
          </div>
          {videoFile ? (
            <p className="mt-2 text-xs font-semibold text-success">
              {videoFile.name} 업로드됨. 아래 미리보기에서 분석할 구간을 조정하세요.
            </p>
          ) : null}

          <div className="mt-4 overflow-hidden rounded-xl bg-black">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                playsInline
                onLoadedMetadata={onVideoMetadata}
                onTimeUpdate={onTimeUpdate}
                className="aspect-video w-full bg-black object-contain"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center text-sm font-semibold text-white/70">
                영상 대기 중
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <label>
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                <Clock3 size={14} />
                시작
              </span>
              <input
                type="number"
                min={0}
                max={Math.max(0, endTime - 1)}
                step={0.1}
                value={Number(startTime.toFixed(1))}
                onChange={(event) => setStartTime(Math.max(0, Math.min(Number(event.target.value), endTime - 0.1)))}
                className={`mt-2 ${fieldClass()}`}
              />
            </label>
            <label>
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                <Clock3 size={14} />
                끝
              </span>
              <input
                type="number"
                min={startTime + 0.1}
                max={duration || undefined}
                step={0.1}
                value={Number(endTime.toFixed(1))}
                onChange={(event) => setEndTime(Math.min(duration, Math.max(Number(event.target.value), startTime + 0.1)))}
                className={`mt-2 ${fieldClass()}`}
              />
            </label>
            <button
              type="button"
              onClick={playSegment}
              disabled={!videoUrl}
              className="inline-flex items-center justify-center gap-2 self-end rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play size={16} />
              재생
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={startTime}
              onChange={(event) => setStartTime(Math.min(Number(event.target.value), endTime - 0.1))}
              disabled={!videoUrl}
              aria-label="분석 시작 시간"
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={endTime}
              onChange={(event) => setEndTime(Math.max(Number(event.target.value), startTime + 0.1))}
              disabled={!videoUrl}
              aria-label="분석 종료 시간"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
          <label className="text-sm font-black text-ink">연기 의도</label>
          <textarea
            value={intent}
            onChange={(event) => setIntent(event.target.value)}
            className={`mt-3 min-h-28 resize-y ${fieldClass()}`}
            placeholder="예: 겉으로는 침착하지만 속으로는 무너지는 인물을 보여주고 싶다."
          />

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
            {isAnalyzing ? "분석 중" : "Gemini로 분석"}
          </button>
        </section>
      </section>

      <aside className="flex flex-col gap-5 lg:sticky lg:top-8 lg:max-h-[calc(100dvh-4rem)] lg:overflow-auto">
        <section className="rounded-2xl border border-line bg-ink p-5 text-white shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black">
            <Sparkles size={18} />
            피드백
          </div>
          <p className="mt-4 text-2xl font-black leading-tight">
            {feedback ? feedback.summary : "분석 결과가 여기에 표시됩니다."}
          </p>
        </section>

        {feedback ? (
          <>
            <section className="rounded-2xl border border-line bg-white/80 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-black text-ink">평가 게이지</h2>
                <span className="text-xs font-bold text-muted">100점 기준</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {feedback.evaluationMetrics.map((metric) => (
                  <MetricGauge key={metric.label} metric={metric} />
                ))}
              </div>
            </section>
            <FeedbackList title="부족한 부분" items={feedback.weaknesses} />
            <FeedbackList title="의도에 부합한 부분" items={feedback.alignedMoments} />
            <FeedbackList title="연습 방식 추천" items={feedback.practiceRecommendations} />
          </>
        ) : (
          <section className="rounded-2xl border border-dashed border-line bg-white/70 p-5 text-sm leading-6 text-muted">
            영상과 의도를 입력한 뒤 분석하면 약점, 잘 맞은 지점, 다음 연습 방식이 분리되어 표시됩니다.
          </section>
        )}

        <section className="rounded-2xl border border-line bg-white p-4 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-black text-ink">
            <PencilLine size={18} />
            메모
          </label>
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            className={`mt-3 min-h-36 resize-y ${fieldClass()}`}
            placeholder="분석을 보고 떠오른 다음 연습 메모"
          />
        </section>
      </aside>
    </div>
  );
}
