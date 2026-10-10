// Minimal stand-in for next/server so route handlers run under plain Node.
class StubNextResponse extends Response {
  cookies = {
    set: (name: string, value: string): void => {
      this.headers.append("set-cookie", `${name}=${value}`);
    },
  };

  static override json(body: unknown, init?: ResponseInit): StubNextResponse {
    const headers = new Headers(init?.headers);
    headers.set("content-type", "application/json");
    return new StubNextResponse(JSON.stringify(body), { ...init, headers });
  }
}

export { StubNextResponse as NextResponse };
