// An in-memory stand-in for the Postgres "RateLimit" table.
//
// It understands the handful of statements lib/rate-limit.ts sends and mimics
// their semantics (atomic upsert, window reset on expiry, missing-table error)
// so the limiter's own logic can be tested with injected latency, hangs and
// failures. It does NOT test Postgres itself; the SQL is unchanged by the fix.

export type Kind = "peek" | "consume" | "release" | "create-table" | "create-index" | "sweep";
export type Mode = "ok" | "hang" | "error";

interface Row {
  count: number;
  resetAt: number;
}

function classify(sql: string): Kind {
  if (sql.includes("INSERT INTO")) return "consume";
  if (sql.includes("UPDATE \"RateLimit\"")) return "release";
  if (sql.includes("CREATE TABLE")) return "create-table";
  if (sql.includes("CREATE INDEX")) return "create-index";
  if (sql.includes("DELETE FROM")) return "sweep";
  return "peek";
}

const sleep = (ms: number) =>
  ms > 0 ? new Promise<void>((resolve) => setTimeout(resolve, ms)) : Promise.resolve();

export class FakeRateLimitDb {
  rows = new Map<string, Row>();
  calls: Kind[] = [];
  tableExists = true;
  mode: Mode = "ok";
  errorMessage = "connection refused";
  /** Latency applied to the next N queries (e.g. a Neon wake-up), then `latencyMs`. */
  wakeUpMs = 0;
  wakeUpQueries = 1;
  latencyMs = 0;
  ddlLatencyMs = 0;

  reset(): void {
    this.rows.clear();
    this.calls = [];
    this.tableExists = true;
    this.mode = "ok";
    this.errorMessage = "connection refused";
    this.wakeUpMs = 0;
    this.wakeUpQueries = 1;
    this.latencyMs = 0;
    this.ddlLatencyMs = 0;
  }

  count(kind: Kind): number {
    return this.calls.filter((c) => c === kind).length;
  }

  async handle(sql: string, params: unknown[]): Promise<unknown> {
    const kind = classify(sql);
    this.calls.push(kind);

    let delay = kind === "create-table" || kind === "create-index" ? this.ddlLatencyMs : this.latencyMs;
    if (this.wakeUpMs > 0 && this.wakeUpQueries > 0) {
      this.wakeUpQueries -= 1;
      delay = this.wakeUpMs;
    }
    await sleep(delay);

    if (this.mode === "hang") return new Promise<never>(() => {});
    if (this.mode === "error") throw new Error(this.errorMessage);

    if (kind === "create-table") {
      this.tableExists = true;
      return 0;
    }
    if (kind === "create-index") return 0;

    if (!this.tableExists) {
      throw new Error('Raw query failed. Code: `42P01`. Message: `relation "RateLimit" does not exist`');
    }

    const now = Date.now();
    const key = String(params[0]);

    if (kind === "sweep") {
      for (const [k, row] of this.rows) if (row.resetAt < now - 3_600_000) this.rows.delete(k);
      return 0;
    }

    const row = this.rows.get(key);
    if (kind === "release") {
      if (row && row.resetAt > now) row.count = Math.max(0, row.count - 1);
      return 1;
    }
    const live = row && row.resetAt > now ? row : undefined;

    if (kind === "peek") {
      return live ? [{ count: live.count, msLeft: live.resetAt - now }] : [];
    }

    // consume: atomic upsert (no await between the read and the write)
    const windowMs = Number(/\((\d+) \* interval/.exec(sql)?.[1] ?? 0);
    const next: Row = live ? { count: live.count + 1, resetAt: live.resetAt } : { count: 1, resetAt: now + windowMs };
    this.rows.set(key, next);
    return [{ count: next.count, msLeft: next.resetAt - now }];
  }
}
