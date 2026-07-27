import { ImageResponse } from "next/og";

/**
 * Dynamic share card for a slop score. Built with next/og (same engine as the
 * site's OG image — no headless Chrome, works on Railway). The grader links here
 * with the score in query params so people can post their result to LinkedIn.
 *
 *   /api/score-card?score=7&tells=9&words=54&label=This+reads+like+AI&tips=delve,leverage,seamless
 *
 * Framed as objective "AI-tell density," not a taste verdict, so it's defensible
 * when pointed at a brand's copy, not just your own.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const score = clampInt(searchParams.get("score"), 0, 10, 0);
  const tells = clampInt(searchParams.get("tells"), 0, 999, 0);
  const words = clampInt(searchParams.get("words"), 0, 999999, 0);
  const label = (searchParams.get("label") || "Graded").slice(0, 40);
  const tips = (searchParams.get("tips") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 4);

  const clean = tells === 0;
  const scoreColor = clean ? "#46600a" : "#14140f";
  const labelColor = clean ? "#46600a" : "#d6402a";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f5ef",
          padding: "80px 76px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              background: "#c6f24e",
              color: "#14140f",
              fontSize: 34,
              fontWeight: 800,
              padding: "2px 10px",
              fontFamily: "monospace",
            }}
          >
            Delete
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              color: "#8c8c82",
              fontSize: 34,
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            Slop
            <div style={{ position: "absolute", top: "52%", left: 0, width: "100%", height: 3, background: "#d6402a" }} />
          </div>
        </div>

        {/* Score block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "#8c8c82", fontSize: 24, fontFamily: "monospace", letterSpacing: 4 }}>
            AI-TELL SCORE
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 8 }}>
            <div style={{ display: "flex", color: scoreColor, fontSize: 320, fontWeight: 800, lineHeight: 0.9, letterSpacing: -8 }}>
              {score}
            </div>
            <div style={{ display: "flex", color: "#8c8c82", fontSize: 96, fontWeight: 700, paddingBottom: 40, marginLeft: 8 }}>
              /10
            </div>
          </div>
          <div style={{ display: "flex", color: labelColor, fontSize: 52, fontWeight: 800, letterSpacing: -1, marginTop: 8 }}>
            {label}
          </div>
          <div style={{ display: "flex", color: "#63635a", fontSize: 30, marginTop: 12 }}>
            {clean ? `Clean across ${words} words.` : `${tells} tell${tells === 1 ? "" : "s"} in ${words} words.`}
          </div>

          {/* Struck tells */}
          {tips.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 28, gap: 14 }}>
              {tips.map((t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "2px solid #e3d0cb",
                    borderRadius: 10,
                    padding: "8px 16px",
                  }}
                >
                  <div style={{ display: "flex", position: "relative", color: "#d6402a", fontSize: 34, fontWeight: 600 }}>
                    {t}
                    <div style={{ position: "absolute", top: "54%", left: 0, width: "100%", height: 3, background: "#d6402a" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA band */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#14140f",
            borderRadius: 20,
            padding: "34px 40px",
          }}
        >
          <div style={{ display: "flex", color: "#ffffff", fontSize: 38, fontWeight: 800, letterSpacing: -0.5 }}>
            Grade your copy free
          </div>
          <div style={{ display: "flex", color: "#c6f24e", fontSize: 32, fontFamily: "monospace", letterSpacing: 1 }}>
            deleteslop.com
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1350 }
  );
}

function clampInt(raw: string | null, min: number, max: number, fallback: number): number {
  const n = Number.parseInt(raw ?? "", 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}
