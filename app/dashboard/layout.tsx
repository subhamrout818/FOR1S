import type { Metadata } from "next";
import DashboardShell from "@/components/portal/DashboardShell";

export const metadata: Metadata = {
  title: "Client dashboard — FOR1S",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell variant="client">{children}</DashboardShell>;
}
