import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog";
import { MEMBERS } from "@/lib/members";
import { CASE_STUDIES } from "@/lib/work";
import { SITE_URL } from "@/lib/contact";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: path === "" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    priority: path === "" ? 1 : 0.8,
  }));

  const posts: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    priority: 0.6,
  }));

  const members: MetadataRoute.Sitemap = MEMBERS.map((member) => ({
    url: `${SITE_URL}/team/${member.slug}`,
    priority: 0.6,
  }));

  // Case-study pages are real URLs; a "/#work" fragment is ignored by crawlers.
  const work: MetadataRoute.Sitemap = CASE_STUDIES.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    priority: 0.9,
  }));

  return [...staticRoutes, ...work, ...posts, ...members];
}
