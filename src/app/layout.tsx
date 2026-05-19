import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const siteUrl = "https://www.acttub.com/thea";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "thea - 취향 기반 연극 추천",
    template: "%s · thea",
  },
  description: "관람 취향을 입력하면 지금 보기 좋은 연극을 추천하는 acttub의 연극 큐레이션 서비스입니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "thea",
    title: "thea - 취향 기반 연극 추천",
    description: "관람 취향을 입력하면 지금 보기 좋은 연극을 추천하는 acttub의 연극 큐레이션 서비스입니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "thea - 취향 기반 연극 추천",
    description: "관람 취향을 입력하면 지금 보기 좋은 연극을 추천하는 acttub의 연극 큐레이션 서비스입니다.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff7a5c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          acttub · thea
        </footer>
      </body>
    </html>
  );
}
