import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VedaAI — AI Assessment Creator",
  description:
    "Create assignments, generate question papers with AI, and manage assessments effortlessly with VedaAI.",
};

import WebSocketProvider from "./components/providers/WebSocketProvider";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <WebSocketProvider />
          {children}
        </Providers>
      </body>
    </html>
  );
}
