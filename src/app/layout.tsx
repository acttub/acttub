import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "연기 영상 아카이빙",
    template: "%s · 연기 영상 아카이빙",
  },
  description: "내가 본 연기를 보관하고 다시 찾아보는 곳",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko" suppressHydrationWarning>
        <body className="flex min-h-screen flex-col antialiased">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
            acttub · 연기 영상을 모아두는 공간
          </footer>
          <Toaster richColors closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
