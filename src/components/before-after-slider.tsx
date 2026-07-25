"use client";

import { useRef, useState, type ReactNode, type PointerEvent, type KeyboardEvent } from "react";
import { ChevronsLeftRight } from "lucide-react";

/**
 * Before/after comparison slider. Drag the divider to wipe between two same-size
 * layers. The handle is a plain neutral grip on a thin accent line — deliberately
 * NOT a glowing orb, which reads as an AI tell (the very thing this site is about).
 * Pointer + touch + keyboard. `before` shows on the left, `after` on the right.
 */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Slop",
  afterLabel = "No slop",
  heightClass = "h-[360px] sm:h-[420px]",
}: {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  heightClass?: string;
}) {
  const [pos, setPos] = useState(52);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  const onDown = (e: PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    setFromX(e.clientX);
  };
  const onMove = (e: PointerEvent) => {
    if (dragging.current) setFromX(e.clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
  };

  return (
    <div
      ref={ref}
      className={`relative select-none overflow-hidden rounded-xl border border-border-strong ${heightClass}`}
      style={{ touchAction: "pan-y" }}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerDown={onDown}
    >
      {/* After (bottom layer, full) */}
      <div className="absolute inset-0">{after}</div>

      {/* Before (top layer, clipped to the left of the divider) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>

      {/* Corner labels */}
      <span className="pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center rounded-full border border-slop/30 bg-slop/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-slop backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent-ink backdrop-blur-sm">
        {afterLabel}
      </span>

      {/* Divider + handle */}
      <div className="pointer-events-none absolute inset-y-0 z-10" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -translate-x-1/2 w-px bg-accent" />
        <button
          type="button"
          role="slider"
          aria-label="Drag to compare slop and fixed"
          aria-valuenow={Math.round(pos)}
          aria-valuemin={0}
          aria-valuemax={100}
          onPointerDown={onDown}
          onKeyDown={onKey}
          className="pointer-events-auto absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border-strong bg-background text-foreground shadow-md transition-colors hover:border-accent focus-visible:border-accent"
          style={{ touchAction: "none" }}
        >
          <ChevronsLeftRight size={16} />
        </button>
      </div>
    </div>
  );
}
