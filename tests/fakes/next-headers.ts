// Stand-in for next/headers. Tests can inject a signed session token without
// weakening production cookie handling or needing a Next.js request context.
let sessionToken: string | null = null;

export function setTestSessionCookie(token: string | null): void {
  sessionToken = token;
}

export async function cookies() {
  return { get: (name: string) => name === "for1s_session" && sessionToken ? { value: sessionToken } : undefined };
}
