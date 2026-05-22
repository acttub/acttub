import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://www.acttub.com/coach";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "coach - 연기 연습 피드백",
    template: "%s · coach",
  },
  description: "연기 연습 영상을 업로드하거나 녹화해 Gemini 기반 피드백을 받는 acttub 코치 MVP입니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "coach",
    title: "coach - 연기 연습 피드백",
    description: "연기 연습 영상을 업로드하거나 녹화해 Gemini 기반 피드백을 받는 acttub 코치 MVP입니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "coach - 연기 연습 피드백",
    description: "연기 연습 영상을 업로드하거나 녹화해 Gemini 기반 피드백을 받는 acttub 코치 MVP입니다.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff7a5c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
