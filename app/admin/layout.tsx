import type { Metadata } from "next";
import DashboardShell from "@/components/portal/DashboardShell";

export const metadata: Metadata = {
  title: "Admin — FOR1S",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell variant="admin">{children}</DashboardShell>;
}
