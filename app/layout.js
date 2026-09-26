import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // 1. Import Script dari Next.js
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "gameskilu.com - Gaming News & PC Game Downloads",
  description:
    "Portal berita game terbaru, ulasan hardware, dan tempat download PC game gratis, aman, serta terverifikasi.",
  keywords: [
    "gameskilu",
    "download game pc",
    "berita game",
    "game news",
    "gameskilu.com",
  ],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        {/* 2. Tambahkan Script AdSense di sini */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7149552867300544" // GANTI DENGAN PUBLISHER ID ADSENSE ANDA
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}