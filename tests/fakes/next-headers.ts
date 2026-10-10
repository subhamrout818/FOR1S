// Stand-in for next/headers (only imported, never called, by the routes under test).
export async function cookies() {
  return { get: (): undefined => undefined };
}
