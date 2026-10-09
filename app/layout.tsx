import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { AuthProvider } from "@/lib/auth-context";
import Providers from "@/components/layout/Providers";
import Preloader from "@/components/layout/Preloader";
import GrainOverlay from "@/components/layout/GrainOverlay";
import ScrollSpine from "@/components/layout/ScrollSpine";
import RouteChrome from "@/components/layout/RouteChrome";

const TITLE = "FOR1S — Web Design for Local Businesses & Personal Brands";

const DESCRIPTION =
  "FOR1S designs and builds premium websites for local businesses and personal brands — fast, mobile-first, and built to win customers. From cafés and salons to portfolios and freelancers.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.for1s.com"),

  title: TITLE,

  description: DESCRIPTION,

  applicationName: "FOR1S",

  alternates: {
    canonical: "https://www.for1s.com/",
  },

  keywords: [
    "FOR1S",
    "For1s",
    "web design",
    "website design",
    "small business website",
    "local business website",
    "personal portfolio website",
    "café website design",
    "salon website design",
    "business website design",
    "custom website",
    "website design for small business",
  ],

  authors: [
    {
      name: "Subham Rout",
      url: "https://www.for1s.com/",
    },
  ],

  creator: "Subham Rout",

  openGraph: {
    type: "website",
    url: "https://www.for1s.com/",
    siteName: "FOR1S",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  // Google Search needs a crawlable, square icon whose size is a multiple of
  // 48px, and it reads /favicon.ico as a fallback — so declare them all
  // explicitly rather than relying on the SVG alone.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.for1s.com/#organization",
      name: "FOR1S",
      url: "https://www.for1s.com/",
      description: DESCRIPTION,
      email: "for1s.contact@gmail.com",
      logo: "https://www.for1s.com/favicon.svg",
      sameAs: [
        "https://x.com/for1s",
        "https://instagram.com/for1s.social",
        "https://youtube.com/@for1s",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.for1s.com/#website",
      url: "https://www.for1s.com/",
      name: "FOR1S",
      alternateName: ["For1s", "for1s"],
      description: DESCRIPTION,
      publisher: {
        "@id": "https://www.for1s.com/#organization",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="bg-background font-body text-foreground antialiased selection:bg-accent selection:text-white">
        <AuthProvider>
          <Providers>
            <Preloader />
            <GrainOverlay />
            <ScrollSpine />
            <RouteChrome>
              <main>{children}</main>
            </RouteChrome>
          </Providers>
        </AuthProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </body>
    </html>
  );
}