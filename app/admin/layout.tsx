import DashboardShell from "@/components/portal/DashboardShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell variant="admin">{children}</DashboardShell>;
}
