import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: struck "No" over highlighted "Slop", scaled up. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 6,
          background: "#0a0a09",
          padding: 30,
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            color: "#8a8a80",
            fontSize: 44,
            fontWeight: 700,
          }}
        >
          No
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: 4,
              background: "#ff6a4d",
            }}
          />
        </div>
        <div
          style={{
            background: "#c6f24e",
            color: "#0a0a09",
            fontSize: 44,
            fontWeight: 800,
            padding: "2px 10px",
          }}
        >
          Slop
        </div>
      </div>
    ),
    { ...size }
  );
}
