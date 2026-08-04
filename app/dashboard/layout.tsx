import DashboardShell from "@/components/portal/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell variant="client">{children}</DashboardShell>;
}
