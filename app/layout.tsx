import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Rätsel Generator - Erstelle personalisierte Rätsel",
  description:
    "Entdecken Sie unseren Rätsel-Generator, um personalisierte Rätsel, Quizze und Denksportaufgaben zu erstellen. Perfekt für Freunde, Familie, Hochzeit oder Bildungszwecke.",
  keywords:
    "Rätsel-Generator, Hochzeit Rätsel, Quiz-Generator, Rätsel erstellen, Quiz erstellen, Denksportaufgaben, personalisierte Rätsel, Online-Rätsel, Knobelaufgaben",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
