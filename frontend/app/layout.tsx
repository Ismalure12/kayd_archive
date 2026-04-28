import type { Metadata } from "next";
import { Instrument_Serif, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kayd — Somali Literary Archive",
    template: "%s | Kayd",
  },
  description:
    "Kayd preserves Somali short stories and literary works. Discover stories, authors, and collections from the Somali literary tradition.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('kayd-theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="so"
      className={`${instrumentSerif.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased`}
      style={{
        ["--ff-display" as string]: `var(--font-instrument-serif), "Times New Roman", serif`,
        ["--ff-body" as string]: `var(--font-newsreader), Georgia, serif`,
        ["--ff-mono" as string]: `var(--font-jetbrains-mono), ui-monospace, monospace`,
        ["--font-display" as string]: `var(--font-instrument-serif), "Times New Roman", serif`,
        ["--font-body" as string]: `var(--font-newsreader), Georgia, serif`,
        ["--font-mono" as string]: `var(--font-jetbrains-mono), ui-monospace, monospace`,
        ["--font-serif" as string]: `var(--font-instrument-serif), Georgia, serif`,
        ["--font-sans" as string]: `var(--font-newsreader), Georgia, serif`,
      }}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink" style={{ fontFamily: "var(--ff-body)" }}>
        {children}
      </body>
    </html>
  );
}
