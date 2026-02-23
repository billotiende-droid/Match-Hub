import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalBackButton } from "@/components/common/GlobalBackButton";
import { RouteTransition } from "@/components/common/RouteTransition";
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
  title: 'Match Hub | Kenya\'s #1 Turf Booking Platform',
  description: 'Book the best football turfs in Nairobi and beyond.',
  openGraph: {
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalBackButton />
        <RouteTransition>{children}</RouteTransition>
      </body>
    </html>
  );
}
