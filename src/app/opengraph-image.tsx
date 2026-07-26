import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DeleteSlop — delete the AI tell in your writing and design";

/** Social share card. Same brand: near-black paper, one lime mark, struck slop. */
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a09",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: "#c6f24e", color: "#0a0a09", fontSize: 30, fontWeight: 800, padding: "0 8px", fontFamily: "monospace" }}>
            Delete
          </div>
          <div style={{ display: "flex", alignItems: "center", position: "relative", color: "#8a8a80", fontSize: 30, fontWeight: 700, fontFamily: "monospace" }}>
            Slop
            <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 3, background: "#ff6a4d" }} />
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", color: "#ededea", fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
          <div style={{ display: "flex" }}>AI writing &amp; design</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            have a{" "}
            <span style={{ display: "flex", alignItems: "center", position: "relative", color: "#8a8a80", marginLeft: 20 }}>
              tell
              <span style={{ position: "absolute", top: "52%", left: 0, width: "100%", height: 5, background: "#ff6a4d" }} />
            </span>
            .
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            These skills{" "}
            <span style={{ background: "#c6f24e", color: "#0a0a09", padding: "0 14px", marginLeft: 18 }}>delete it</span>.
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#8a8a80", fontSize: 24, fontFamily: "monospace", letterSpacing: 2 }}>
            FREE CLAUDE SKILLS · FOR MARKETERS
          </div>
          <div style={{ color: "#c6f24e", fontSize: 24, fontFamily: "monospace", letterSpacing: 2 }}>
            deleteslop.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
