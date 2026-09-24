import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OutcomeGuard",
    template: "%s | OutcomeGuard",
  },
  description:
    "Evidence-backed AI engine that evaluates whether a resource is sufficient to achieve a specific goal.",
  keywords: [
    "OutcomeGuard",
    "AI",
    "RAG",
    "learning",
    "resource analysis",
    "evidence",
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-950 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
