import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
} from "@/lib/rate-limit";

const EVENT_NAMES = new Set([
  "hero_cta_click",
  "portfolio_project_open",
  "pricing_tier_select",
  "contact_form_start",
  "contact_form_success",
  "contact_form_error",
]);
const PROJECTS = new Set(["brew-and-co", "studio-arun", "glow-and-co"]);
const TIERS = new Set(["personal", "business", "custom"]);

let tableReady: Promise<void> | null = null;

function ensureAnalyticsTable(): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "SiteAnalyticsEvent" (
          "id" TEXT PRIMARY KEY,
          "name" TEXT NOT NULL,
          "path" TEXT NOT NULL,
          "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(
        'CREATE INDEX IF NOT EXISTS "SiteAnalyticsEvent_createdAt_idx" ON "SiteAnalyticsEvent" ("createdAt")'
      );
      await prisma.$executeRawUnsafe(
        'CREATE INDEX IF NOT EXISTS "SiteAnalyticsEvent_name_createdAt_idx" ON "SiteAnalyticsEvent" ("name", "createdAt")'
      );
    })().catch((error) => {
      tableReady = null;
      throw error;
    });
  }
  return tableReady;
}


export async function GET(req: Request) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureAnalyticsTable();
    const counts = await prisma.$queryRawUnsafe<Array<{ name: string; count: number }>>(
      `SELECT "name", COUNT(*)::int AS "count"
       FROM "SiteAnalyticsEvent"
       WHERE "createdAt" >= CURRENT_TIMESTAMP - INTERVAL '30 days'
       GROUP BY "name" ORDER BY "name"`
    );
    const recentEvents = await prisma.$queryRawUnsafe<Array<{
      id: string; name: string; path: string; metadata: Record<string, string>; createdAt: Date;
    }>>(
      `SELECT "id", "name", "path", "metadata", "createdAt"
       FROM "SiteAnalyticsEvent"
       WHERE "createdAt" >= CURRENT_TIMESTAMP - INTERVAL '30 days'
       ORDER BY "createdAt" DESC LIMIT 50`
    );
    return NextResponse.json({ success: true, windowDays: 30, counts, recentEvents });
  } catch {
    console.error("site analytics report could not be loaded");
    return NextResponse.json({ success: false, message: "Analytics unavailable" }, { status: 503 });
  }
}

export async function POST(req: Request) {
  try {
    const rate = await consumeRateLimit(
      `analytics:${clientIp(req)}`,
      120,
      60_000
    );
    if (!rate.ok) return rateLimitedResponse(rate.resetAt);

    const body = await req.json().catch(() => null);
    if (
      !body ||
      typeof body.name !== "string" ||
      !EVENT_NAMES.has(body.name) ||
      typeof body.path !== "string" ||
      !body.path.startsWith("/") ||
      body.path.startsWith("//") ||
      body.path.includes("?") ||
      body.path.includes("#") ||
      body.path.length > 160
    ) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Store only allowlisted, low-cardinality metadata. Never accept emails,
    // form fields, query strings, referrers, or raw IP addresses.
    const metadata: Record<string, string> = {};
    if (typeof body.metadata?.project === "string" && PROJECTS.has(body.metadata.project)) {
      metadata.project = body.metadata.project;
    }
    if (typeof body.metadata?.tier === "string" && TIERS.has(body.metadata.tier)) {
      metadata.tier = body.metadata.tier;
    }

    await ensureAnalyticsTable();
    await prisma.$executeRawUnsafe(
      'INSERT INTO "SiteAnalyticsEvent" ("id", "name", "path", "metadata", "createdAt") VALUES ($1, $2, $3, $4::jsonb, CURRENT_TIMESTAMP)',
      randomUUID(),
      body.name,
      body.path,
      JSON.stringify(metadata)
    );

    return NextResponse.json({ success: true }, { status: 202 });
  } catch {
    // Analytics is best-effort; never return internal DB details to clients.
    console.error("site analytics event could not be stored");
    return NextResponse.json({ success: false }, { status: 503 });
  }
}
