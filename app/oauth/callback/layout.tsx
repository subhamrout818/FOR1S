import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signing you in — FOR1S",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function OAuthCallbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
