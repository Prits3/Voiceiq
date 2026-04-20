import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://voiceiq.ai";

export const viewport: Viewport = {
  themeColor: "#05050a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "VoiceIQ — AI Voice Sales Assistant",
    template: "%s — VoiceIQ",
  },
  description:
    "AI that makes real outbound sales calls, qualifies leads, and books meetings — 24/7, at scale. No reps required. Start a free live demo today.",
  keywords: [
    "AI sales calls",
    "voice AI",
    "outbound sales automation",
    "AI SDR",
    "lead qualification",
    "sales AI",
    "cold calling AI",
  ],
  authors: [{ name: "VoiceIQ" }],
  creator: "VoiceIQ",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "VoiceIQ",
    title: "VoiceIQ — AI That Makes Your Sales Calls",
    description:
      "AI that makes real outbound sales calls, qualifies leads, and books meetings — 24/7, at scale. No reps required.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "VoiceIQ — AI Voice Sales Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "VoiceIQ — AI Voice Sales Assistant",
    description:
      "AI that makes real outbound sales calls, qualifies leads, and books meetings. No reps required.",
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.variable} ${inter.className} overflow-x-hidden`}>{children}</body>
    </html>
  );
}
