import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexLearn — Student Dashboard",
  description:
    "Track your courses, learning streaks, and progress in a futuristic student dashboard powered by NexLearn.",
  keywords: ["student dashboard", "learning", "courses", "progress tracker"],
  openGraph: {
    title: "NexLearn — Student Dashboard",
    description: "Track your courses and learning progress.",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout: applies global CSS, sets dark colour scheme.
 * Fonts are loaded via Google Fonts in globals.css.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
