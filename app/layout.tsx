import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono} from "geist/font/mono";
import "./globals.css";

import { AuthProvider } from "@/lib/auth-context";
import Providers from "@/components/layout/Providers";
import Preloader from "@/components/layout/Preloader";
import CustomCursor from "@/components/layout/CustomCursor";
import GrainOverlay from "@/components/layout/GrainOverlay";
import ScrollSpine from "@/components/layout/ScrollSpine";
import RouteChrome from "@/components/layout/RouteChrome";
import { SITE_URL } from "@/lib/contact";

const TITLE = "FOR1S — SaaS Development Agency";
const DESCRIPTION =
  "FOR1S is a full-service digital agency — from custom websites and SaaS platforms to premium video production. We help brands stand out and scale up.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "FOR1S",
  keywords: [
    "SaaS development",
    "web agency",
    "SaaS agency",
    "full-stack development",
    "product design",
    "custom websites",
    "Next.js development",
    "startup agency",
  ],
  authors: [{ name: "Subham Rout", url: SITE_URL }],
  creator: "Subham Rout",
  openGraph: {
    type: "website",
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
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "FOR1S",
      url: SITE_URL,
      description: DESCRIPTION,
      email: "hello@for1s.digital",
      logo: `${SITE_URL}/favicon.svg`,
      sameAs: [
        "https://x.com/for1s",
        "https://instagram.com/btwitssubu",
        "https://youtube.com/@for1s",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "FOR1S",
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
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
        <AuthProvider>
          <Providers>
            <Preloader />
            <CustomCursor />
            <GrainOverlay />
            <ScrollSpine />
            <RouteChrome>
              <main>{children}</main>
            </RouteChrome>
          </Providers>
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
