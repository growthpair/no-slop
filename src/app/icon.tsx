import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon: the "S" mark on the signal-lime block. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c6f24e",
          color: "#0a0a09",
          fontSize: 22,
          fontWeight: 800,
          fontFamily: "monospace",
          borderRadius: 6,
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
