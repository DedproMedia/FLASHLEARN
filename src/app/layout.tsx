import type { ReactNode } from "react";
import "./globals.css";
import AuthWidget from "@/components/flashcards/AuthWidget";

export const metadata = {
  title: "FlashLearn",
  description:
    "Learn the capital cities of the world and the planets of the solar system — flip cards, rate your confidence, and track your progress.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-black text-white px-6 py-4 flex items-center justify-between gap-4">
          <span className="text-2xl font-bold whitespace-nowrap">✨ FlashLearn</span>
          <AuthWidget />
        </header>
        <main className="flex-1 bg-white p-6">{children}</main>
      </body>
    </html>
  );
}
