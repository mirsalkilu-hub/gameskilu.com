import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
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
  metadataBase: new URL("https://gameskilu.com"),
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
    icon: "/gameskilu-mark.svg",
    shortcut: "/gameskilu-mark.svg",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: "https://gameskilu.com",
    siteName: "gameskilu.com",
    title: "gameskilu.com - Gaming News & PC Game Downloads",
    description:
      "Portal berita game terbaru, ulasan hardware, dan tempat download PC game gratis, aman, serta terverifikasi.",
    images: [
      {
        url: "https://gameskilu.com/og-default.png?v=2",
        width: 1200,
        height: 630,
        alt: "gameskilu.com gaming news and download portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "gameskilu.com - Gaming News & PC Game Downloads",
    description:
      "Portal berita game terbaru, ulasan hardware, dan tempat download PC game gratis, aman, serta terverifikasi.",
    images: [
      "https://gameskilu.com/og-default.png?v=2",
    ],
  },
};

export default function RootLayout({ children }) {
  const adsenseClient =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-7149552867300544";
  const adsterraScriptUrl = process.env.NEXT_PUBLIC_ADSTERRA_SCRIPT_URL;

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        {adsenseClient && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        <Script
          src="https://awkwardmonopoly.com/20/18/63/201863e19025f3e3a9bb97ff8f3d4bc0.js"
          strategy="afterInteractive"
        />

        {adsterraScriptUrl && (
          <Script
            src={adsterraScriptUrl}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
        {children}
        <Analytics />
      </body>
    </html>
  );
}