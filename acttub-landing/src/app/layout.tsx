import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "acttub — 연기하는 사람들의 공간",
  description:
    "연기하는 사람들의 커뮤니티와 도구들. 자유게시판, 연기 스타일 진단(ACTI), 영상 아카이브(archive), 연극 추천(thea), 연습실(excer).",
  openGraph: {
    title: "acttub",
    description: "연기하는 사람들이 자기 연기를 기록하고, 진단하고, 이야기 나누는 공간",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F4F5F7",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
