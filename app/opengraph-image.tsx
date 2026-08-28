import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "FOR1S — Websites that win customers.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#050505",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 414 560" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M133.236 258.72L413.27 88.9804V0L133.236 169.74V258.72Z" fill="#E63946" />
            <path d="M0 468.598L280.034 298.858V209.878L0 379.617V468.598Z" fill="#E63946" />
            <path d="M190.559 264.526L280.035 209.88L280.519 560H191.527L190.559 264.526Z" fill="#E63946" />
          </svg>
          <span
            style={{
              fontSize: 30,
              letterSpacing: "0.32em",
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            FOR1S
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              fontSize: 92,
              lineHeight: 0.95,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: "0 0 24px 0",
            }}
          >
            Websites that
            <br />
            <span style={{ color: "#E63946" }}>win customers.</span>
          </h1>
          <p
            style={{
              fontSize: 28,
              color: "#BEBEBE",
              margin: 0,
            }}
          >
            Premium websites for local businesses and personal brands — design,
            build, and care, all in one team.
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
