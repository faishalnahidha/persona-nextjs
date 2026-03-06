import type { Metadata } from "next";
import { readexPro, openSans, robotoSerif, geistMono } from '@/lib/fonts'
import "./globals.css";

export const metadata: Metadata = {
  title: "Persona My ID",
  description: "Discover your personality through interactive assessments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${readexPro.variable} ${openSans.variable} ${robotoSerif.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background font-body antialiased">
        {children}
      </body>
    </html>
  );
}
