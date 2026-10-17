import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sacred Scriptures | Westminster Leningrad Codex",
  description: "A modern, artistic, and reverent reader for the Hebrew Bible (Westminster Leningrad Codex)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#060814] text-white selection:bg-sky-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}

