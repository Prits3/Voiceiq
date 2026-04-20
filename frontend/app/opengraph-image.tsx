import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VoiceIQ — AI Voice Sales Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#05050a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -60%)",
            width: 600,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Logo badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            V
          </div>
          <span
            style={{
              color: "white",
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            VoiceIQ
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: "white",
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          AI Sales Calls That
          <br />
          Qualify Leads 24/7
        </div>

        {/* Subline */}
        <div
          style={{
            color: "#94a3b8",
            fontSize: 26,
            textAlign: "center",
            marginTop: 24,
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          No reps to hire. No scripts to maintain.
          <br />
          Start a free live demo today.
        </div>

        {/* Badge */}
        <div
          style={{
            marginTop: 40,
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.35)",
            borderRadius: 100,
            padding: "10px 28px",
            color: "#c4b5fd",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Private Beta · Early Access
        </div>
      </div>
    ),
    { ...size }
  );
}
