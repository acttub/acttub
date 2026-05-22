import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { buildEvaluationPrompt, parseGeminiFeedback } from "@/lib/evaluation";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 80 * 1024 * 1024;

function numberFromForm(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return Number.NaN;
  return Number(value);
}

function textFromForm(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function fileExtension(file: File) {
  if (file.name.includes(".")) return path.extname(file.name);
  if (file.type === "video/webm") return ".webm";
  if (file.type === "video/quicktime") return ".mov";
  return ".mp4";
}

function fileStateName(state: unknown) {
  return String(state ?? "").toUpperCase();
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY가 설정되어 있지 않습니다. Vercel 또는 로컬 환경변수를 확인해 주세요." },
      { status: 500 },
    );
  }

  let tempPath = "";
  let geminiFileName = "";

  try {
    const formData = await request.formData();
    const video = formData.get("video");

    if (!(video instanceof File)) {
      return Response.json({ error: "분석할 영상 파일이 필요합니다." }, { status: 400 });
    }

    if (video.size <= 0) {
      return Response.json({ error: "비어 있는 영상 파일은 분석할 수 없습니다." }, { status: 400 });
    }

    if (video.size > MAX_FILE_SIZE) {
      return Response.json({ error: "MVP에서는 80MB 이하 영상만 분석할 수 있습니다." }, { status: 400 });
    }

    const fileName = textFromForm(formData.get("fileName")) || video.name || "연기 연습 영상";
    const category = textFromForm(formData.get("category"));
    const intent = textFromForm(formData.get("intent"));
    const startTime = numberFromForm(formData.get("startTime"));
    const endTime = numberFromForm(formData.get("endTime"));

    if (!category) {
      return Response.json({ error: "연기 영상 분류를 선택해 주세요." }, { status: 400 });
    }

    if (!intent) {
      return Response.json({ error: "이번 연습의 의도나 목표를 입력해 주세요." }, { status: 400 });
    }

    if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || startTime < 0 || endTime <= startTime) {
      return Response.json({ error: "분석 시작/끝 시간이 올바르지 않습니다." }, { status: 400 });
    }

    const bytes = Buffer.from(await video.arrayBuffer());
    const uploadDir = path.join(tmpdir(), "acttub-coach");
    await mkdir(uploadDir, { recursive: true });
    tempPath = path.join(uploadDir, `${randomUUID()}${fileExtension(video)}`);
    await writeFile(tempPath, bytes);

    const ai = new GoogleGenAI({ apiKey });
    let uploadedFile = await ai.files.upload({
      file: tempPath,
      config: {
        displayName: fileName,
        mimeType: video.type || "video/mp4",
      },
    });

    geminiFileName = uploadedFile.name ?? "";

    for (let attempt = 0; attempt < 12; attempt += 1) {
      if (fileStateName(uploadedFile.state) === "ACTIVE") break;
      if (!uploadedFile.name) throw new Error("Gemini 파일 이름을 확인하지 못했습니다.");

      await sleep(5000);
      uploadedFile = await ai.files.get({ name: uploadedFile.name });
    }

    if (fileStateName(uploadedFile.state) !== "ACTIVE") {
      return Response.json({ error: "Gemini가 영상 처리를 완료하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 504 });
    }

    if (!uploadedFile.uri || !uploadedFile.mimeType) {
      throw new Error("Gemini 업로드 파일 URI 또는 MIME 타입을 확인하지 못했습니다.");
    }

    const prompt = buildEvaluationPrompt({
      fileName,
      category,
      intent,
      startTime,
      endTime,
    });

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: createUserContent([createPartFromUri(uploadedFile.uri, uploadedFile.mimeType), prompt]),
    });

    return Response.json({ feedback: parseGeminiFeedback(result.text ?? "") });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    return Response.json({ error: `분석 요청에 실패했습니다. ${message}` }, { status: 500 });
  } finally {
    if (tempPath) {
      await unlink(tempPath).catch(() => undefined);
    }

    if (geminiFileName && process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      await ai.files.delete({ name: geminiFileName }).catch(() => undefined);
    }
  }
}
