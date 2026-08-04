"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * The marketing chrome (navbar + footer) is hidden inside the portal and admin
 * workspaces, which own their own shell. Rendered everywhere else.
 */
const HIDDEN_PREFIXES = ["/dashboard", "/admin"];

export default function RouteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hidden = HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Portal/admin pages own their own shell — just render the page content.
  if (hidden) return <>{children}</>;
  // Marketing pages: navbar above the content, footer below it.
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
