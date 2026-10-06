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
    "The latest gaming news, hardware reviews, and safe, verified PC game downloads.",
  keywords: [
    "gameskilu",
    "pc game downloads",
    "gaming news",
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
      "The latest gaming news, hardware reviews, and safe, verified PC game downloads.",
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
      "The latest gaming news, hardware reviews, and safe, verified PC game downloads.",
    images: [
      "https://gameskilu.com/og-default.png?v=2",
    ],
  },
};

export default function RootLayout({ children }) {
  const adsterraScriptUrl = process.env.NEXT_PUBLIC_ADSTERRA_SCRIPT_URL;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <Script
          data-cfasync="false"
          src="https://accountut.com/1/201863e19025f3e3a9bb97ff8f3d4bc0"
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