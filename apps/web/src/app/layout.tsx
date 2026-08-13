import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noterama — Portfolio Studio",
  description: "Interactive portfolio inspired by NotebookLM. Explore projects with AI-guided notebooks and audio deep dives.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ height: '100%', margin: 0 }}>{children}</body>
    </html>
  );
}
