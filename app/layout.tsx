import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { defaultMetadata } from "@/config/metadata";
import { AnalyticsScript } from "@/components/layout/analytics-script";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import TelegramBotWidget from "@/components/telegram-bot-widget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
          <TelegramBotWidget />
        </ThemeProvider>
        <AnalyticsScript />
      </body>
    </html>
  );
}
