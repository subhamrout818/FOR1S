import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set a new password — FOR1S",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
