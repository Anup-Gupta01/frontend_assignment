import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexLearn — Student Dashboard",
  description:
    "Track your courses, learning streaks, and progress in a futuristic dark-mode student dashboard.",
  keywords: ["student dashboard", "learning", "courses", "progress tracker"],
  openGraph: {
    title: "NexLearn — Student Dashboard",
    description: "Track your learning progress across all your courses.",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout — dark-mode only. Fonts load via Google Fonts in globals.css.
 * color-scheme: dark is declared here (HTML attr) and in CSS (:root) to
 * prevent any light-mode flash on load.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#04040d" />
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
