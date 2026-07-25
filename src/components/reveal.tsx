"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveals its children once, when they scroll into view. Restrained by design —
 * a single fade-and-rise, no parallax, no stagger soup.
 *
 * Uses a scroll listener rather than IntersectionObserver: IO proved unreliable
 * in some rendering contexts (callback never fired, leaving content stuck at
 * opacity 0). A passive scroll/resize check is universally reliable, reveals
 * above-the-fold content on mount, and removes itself once fired. Reduced-motion
 * users see everything immediately.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }

    let done = false;
    const inView = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh * 0.88 && r.bottom > 0;
    };
    const onScroll = () => {
      if (done || !inView()) return;
      done = true;
      setShown(true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

    if (inView()) {
      setShown(true);
      return;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
