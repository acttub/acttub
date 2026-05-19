import { UploadForm } from "@/components/upload-form";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">새 영상 업로드</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        파일은 그대로 Vercel Blob 에 저장되고, 메타데이터만 DB에 기록됩니다.
      </p>
      <UploadForm />
    </div>
  );
}
