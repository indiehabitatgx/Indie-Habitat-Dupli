"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MIN_VISIBLE_MS = 550;
const FAILSAFE_MS = 8000;

type LoaderState = "boot" | "in" | "out";

/**
 * Themed full-screen loader.
 * - First load: rendered in the server HTML and dismissed by a pure-CSS animation (no JS dependency).
 * - Client navigations: shown when an internal link is clicked, hidden once the new route mounts.
 * Every route change also resets the scroll position to the top.
 * The overlay never captures pointer events, so the page underneath stays usable.
 */
export function PageLoader() {
  const pathname = usePathname();
  const [state, setState] = useState<LoaderState>("boot");
  const startedAt = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    let failsafe: ReturnType<typeof setTimeout> | undefined;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page (hash or query only)
      if (/^\/(api|uploads|_next)\//.test(url.pathname) || /\.[a-z0-9]{2,5}$/i.test(url.pathname)) return;
      startedAt.current = Date.now();
      setState("in");
      clearTimeout(failsafe);
      failsafe = setTimeout(() => setState("out"), FAILSAFE_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // New page → start at the top (unless the link targeted an anchor).
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt.current));
    const t = setTimeout(() => setState((s) => (s === "in" ? "out" : s)), wait);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div className="page-loader" data-state={state} role="status" aria-live="polite" aria-hidden={state === "out"}>
      <span className="sr-only">{state === "out" ? "" : "Loading page"}</span>
      <div className="page-loader__spot" aria-hidden />
      <div className="page-loader__inner" aria-hidden>
        <div className="page-loader__ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" className="page-loader__track" />
            <circle cx="60" cy="60" r="52" className="page-loader__arc" />
          </svg>
          {/* Official circled-H mark, cropped unmodified from the logo file */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/habitat-mark-w.png" alt="" width={192} height={192} className="page-loader__mark" />
        </div>
        <div className="page-loader__caption">
          <div className="page-loader__eq">
            <span />
            <span />
            <span />
            <span />
          </div>
          <p className="page-loader__text">#settingthestage</p>
        </div>
      </div>
      <div className="page-loader__bar" aria-hidden />
    </div>
  );
}
