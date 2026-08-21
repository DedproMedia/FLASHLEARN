import type { ReactNode } from "react";
import "./globals.css";
import AuthWidget from "@/components/flashcards/AuthWidget";

export const metadata = {
  title: "Capital Cities Flashcards",
  description:
    "Learn the capital cities of the world — flip cards by continent, rate your confidence, and track your progress.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-black text-white px-6 py-4 flex items-center justify-between gap-4">
          <span className="text-2xl font-bold whitespace-nowrap">🌍 Capital Cities</span>
          <AuthWidget />
        </header>
        <main className="flex-1 bg-white p-6">{children}</main>
      </body>
    </html>
  );
}
