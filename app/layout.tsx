import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { defaultMetadata } from "@/config/metadata";
import { AnalyticsScript } from "@/components/layout/analytics-script";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import TelegramBotWidget from "@/components/telegram-bot-widget";
// Google Analytics 4 — change ID in NEXT_PUBLIC_GA_MEASUREMENT_ID env var
import { GoogleAnalytics } from "@next/third-parties/google";
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
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ThemeProvider>
          <div id="main-content">
            {children}
          </div>
          <Toaster position="top-right" richColors closeButton />
          <TelegramBotWidget />
        </ThemeProvider>
        <AnalyticsScript />
        {/* Google Analytics 4 — loads after page becomes interactive (no performance impact) */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
