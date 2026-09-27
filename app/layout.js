import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
    icon: "/favicon.png",
    shortcut: "/favicon.png",
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
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
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
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

export default function RootLayout({ children }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adsterraScriptUrl = process.env.NEXT_PUBLIC_ADSTERRA_SCRIPT_URL;

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        {adsenseClient && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}

        {adsterraScriptUrl && (
          <script
            type="text/javascript"
            src={adsterraScriptUrl}
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