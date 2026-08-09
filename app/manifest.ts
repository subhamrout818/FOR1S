import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FOR1S — Web Design for Local Businesses & Personal Brands",
    short_name: "FOR1S",
    description:
      "Premium websites for local businesses and personal brands — design, build, and care, all in one team.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
