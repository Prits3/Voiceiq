import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceIQ",
  description: "AI-powered outbound calling platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
