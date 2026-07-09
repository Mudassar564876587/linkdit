import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { defaultMetadata } from "@/config/metadata";
import { AnalyticsScript } from "@/components/layout/analytics-script";
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
      style={{ "--header-h": "4rem" } as React.CSSProperties}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        {children}
        <AnalyticsScript />
      </body>
    </html>
  );
}
