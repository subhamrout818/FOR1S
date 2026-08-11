import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono} from "geist/font/mono";
import "./globals.css";

import { AuthProvider } from "@/lib/auth-context";
import Providers from "@/components/layout/Providers";
import Preloader from "@/components/layout/Preloader";
import GrainOverlay from "@/components/layout/GrainOverlay";
import ScrollSpine from "@/components/layout/ScrollSpine";
import RouteChrome from "@/components/layout/RouteChrome";
import { SITE_URL, CONTACT } from "@/lib/contact";

const TITLE = "FOR1S — Web Design for Local Businesses & Personal Brands";
const DESCRIPTION =
  "FOR1S designs and builds premium websites for local businesses and personal brands — fast, mobile-first, and built to win customers. From cafés and salons to portfolios and freelancers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "FOR1S",
  keywords: [
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
      email: CONTACT.email,
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
