import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/contact";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/demo/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
