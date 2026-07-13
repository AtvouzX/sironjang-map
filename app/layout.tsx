import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peta Tematik Interaktif Kelurahan Pakintelan",
  description: "Sistem Informasi Geografis (SIG) interaktif Kelurahan Pakintelan, Gunungpati, Semarang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-dvh overflow-hidden antialiased`}
    >
      <body className="h-full overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}
