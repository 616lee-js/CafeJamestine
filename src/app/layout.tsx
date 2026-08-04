import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

// Bricolage Grotesque — display + headings. Instrument Sans — the interface, and what
// makes brew mode legible at arm's length. Geist Mono — tokens and tabular readouts.
const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const sans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Café Jamestine",
  description: "Personal specialty-coffee tracking.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Café Jamestine",
    statusBarStyle: "default",
  },
  icons: {
    // SVG mark first; the PNG is the fallback for clients that will not take an SVG favicon.
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#fcfbfa",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
