export type AnalyticsEventName =
  | "hero_cta_click"
  | "portfolio_project_open"
  | "pricing_tier_select"
  | "contact_form_start"
  | "contact_form_success"
  | "contact_form_error";

type AnalyticsProperties = {
  project?: string;
  tier?: string;
};

const ALLOWED_PROJECTS = new Set(["brew-and-co", "studio-arun", "glow-and-co"]);
const ALLOWED_TIERS = new Set(["personal", "business", "custom"]);

/** Send non-PII conversion events to FOR1S's first-party analytics endpoint. */
export function trackAnalyticsEvent(
  name: AnalyticsEventName,
  properties: AnalyticsProperties = {}
): void {
  if (typeof window === "undefined") return;

  const metadata: AnalyticsProperties = {};
  if (properties.project && ALLOWED_PROJECTS.has(properties.project)) {
    metadata.project = properties.project;
  }
  if (properties.tier && ALLOWED_TIERS.has(properties.tier)) {
    metadata.tier = properties.tier;
  }

  const payload = JSON.stringify({
    name,
    path: window.location.pathname,
    metadata,
  });

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => {
    // Analytics must never interrupt the visitor's journey.
  });
}
