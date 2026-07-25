import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono} from "geist/font/mono";
import "./globals.css";

import Providers from "@/components/layout/Providers";
import Preloader from "@/components/layout/Preloader";
import CustomCursor from "@/components/layout/CustomCursor";
import GrainOverlay from "@/components/layout/GrainOverlay";
import ScrollSpine from "@/components/layout/ScrollSpine";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "FOR1S — Your VISION, bought to life.",
  description:
    "FOR1S is a digital agency specializing in web development and video production. We build high-performance websites and craft visual content that makes brands impossible to ignore.",
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
      className={`${GeistSans.variable} ${GeistMono.variable}`}
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
