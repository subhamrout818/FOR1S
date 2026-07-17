import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Inter,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

import Providers from "@/components/layout/Providers";
import Preloader from "@/components/layout/Preloader";
import CustomCursor from "@/components/layout/CustomCursor";
import GrainOverlay from "@/components/layout/GrainOverlay";
import ScrollSpine from "@/components/layout/ScrollSpine";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "SAS — Precision, Perfected.",
  description:
    "SAS is a computing platform engineered without compromise — precision hardware, adaptive intelligence, and a form built to disappear into your work.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="bg-background font-body text-foreground antialiased selection:bg-accent selection:text-white">
        <Providers>
          <Preloader />
          <CustomCursor />
          <GrainOverlay />
          <ScrollSpine />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
