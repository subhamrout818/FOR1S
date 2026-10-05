import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password — FOR1S",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
