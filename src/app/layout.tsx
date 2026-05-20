import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "acttub 커뮤니티",
    template: "%s · acttub 커뮤니티",
  },
  description: "배우들이 이야기 나누는 곳",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko" suppressHydrationWarning>
        <body className="flex min-h-screen flex-col antialiased">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
            acttub · 배우들의 커뮤니티
          </footer>
          <Toaster richColors closeButton position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
