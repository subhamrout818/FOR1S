import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in — FOR1S",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
