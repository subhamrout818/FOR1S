import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account — FOR1S",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
