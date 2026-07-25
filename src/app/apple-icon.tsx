import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: highlighted "Delete" over struck "Slop". */
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
          gap: 8,
          background: "#0a0a09",
          padding: 24,
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            background: "#c6f24e",
            color: "#0a0a09",
            fontSize: 32,
            fontWeight: 800,
            padding: "2px 10px",
          }}
        >
          Delete
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            color: "#8a8a80",
            fontSize: 32,
            fontWeight: 700,
            paddingLeft: 10,
          }}
        >
          Slop
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 10,
              right: 0,
              height: 4,
              background: "#ff6a4d",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
