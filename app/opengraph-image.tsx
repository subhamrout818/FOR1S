import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "FOR1S — Ship SaaS. Scale fast.";
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
          <svg width="44" height="44" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="26" stroke="#FFFFFF" strokeWidth="4" />
            <path
              d="M32 6 C 20 20, 20 44, 32 58 C 44 44, 44 20, 32 6 Z"
              stroke="#E63946"
              strokeWidth="4"
            />
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
            Ship SaaS.
            <br />
            <span style={{ color: "#E63946" }}>Scale fast.</span>
          </h1>
          <p
            style={{
              fontSize: 28,
              color: "#BEBEBE",
              margin: 0,
            }}
          >
            Full-stack development for startups and brands — design, code, and
            launch in one team.
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
