// ──────────────────────────────────────────────
// Legal / compliance constants (safe for client and server)
// ──────────────────────────────────────────────

/**
 * Minimum age to create a FOR1S account. FOR1S is a business service (web
 * design for companies and professionals), not aimed at children. 18 keeps us
 * clear of US COPPA (under 13) and India's DPDP Act (children are under 18,
 * which needs verifiable parental consent). Lower it deliberately, not casually.
 */
export const MIN_SIGNUP_AGE = 18;

/**
 * DMCA designated agent shown on /dmca. To rely on the DMCA safe harbor in the
 * US, the owner must also register this agent with the US Copyright Office
 * (https://www.copyright.gov/dmca-directory/) and keep the registration
 * renewed. `postalAddress` is rendered only when set, so the page never shows
 * made-up details — fill it in with the same address used in that registration.
 */
export const DMCA_AGENT = {
  name: "Subham Rout",
  email: "for1s.contacts@gmail.com",
  postalAddress: null as string | null,
} as const;
