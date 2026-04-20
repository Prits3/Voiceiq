"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import {
  featuresData,
  useCasesData,
  CONTACT_HREF,
  type ColorKey,
  type FeatureCard,
} from "@/lib/landing-data";

// ── Accent colour maps ────────────────────────────────────────────────────────
const accent: Record<ColorKey, { text: string; border: string; bg: string; dot: string }> = {
  violet:  { text: "text-violet-400",  border: "border-violet-500/30",  bg: "bg-violet-500/10",  dot: "bg-violet-400"  },
  cyan:    { text: "text-cyan-400",    border: "border-cyan-500/30",    bg: "bg-cyan-500/10",    dot: "bg-cyan-400"    },
  fuchsia: { text: "text-fuchsia-400", border: "border-fuchsia-500/30", bg: "bg-fuchsia-500/10", dot: "bg-fuchsia-400" },
};

const glowBg: Record<ColorKey, string> = {
  violet:  "bg-violet-600/8",
  cyan:    "bg-cyan-600/8",
  fuchsia: "bg-fuchsia-600/8",
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

/**
 * Traps Tab/Shift+Tab focus inside `containerRef` while `active` is true.
 * Returns focus to the triggering element on unmount.
 */
function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean
) {
  // Capture the element that had focus before the panel opened
  const returnFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    returnFocusTo.current = document.activeElement as HTMLElement;

    return () => {
      returnFocusTo.current?.focus();
    };
  }, [active]);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])';

    // Auto-focus the close button (first focusable element) when panel opens
    const first = containerRef.current.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab" || !containerRef.current) return;

      const focusable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (focusable.length === 0) return;

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, containerRef]);
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  type: "feature" | "usecase";
  slug: string;
  onClose: () => void;
}

export default function SlideOverPanel({ type, slug, onClose }: Props) {
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap (also handles return-focus on unmount)
  useFocusTrap(panelRef, true);

  // Drag motion values for mobile swipe-to-dismiss
  const dragY = useMotionValue(0);
  const backdropOpacity = useTransform(dragY, [0, 280], [0.65, 0]);

  const raw =
    type === "feature"
      ? featuresData.find((f) => f.slug === slug)
      : useCasesData.find((u) => u.slug === slug);

  const color: ColorKey =
    raw && type === "feature" ? (raw as FeatureCard).color : "violet";
  const ac = accent[color];

  // Lock body scroll while panel is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Escape key closes panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!raw) return null;

  const { icon, title, expanded, detail } = raw;
  const pageHref = type === "feature" ? `/features/${slug}` : `/use-cases/${slug}`;

  const panelMotion = isMobile
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };

  const panelPositionClass = isMobile
    ? "fixed bottom-0 left-0 right-0 h-[92vh] rounded-t-3xl"
    : "fixed right-0 top-0 h-full w-full md:w-[65%] lg:max-w-2xl";

  return (
    <>
      {/* Screen-reader announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {title} panel opened
      </div>

      {/* ── Backdrop ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        style={isMobile ? { opacity: backdropOpacity } : undefined}
        className="fixed inset-0 z-40 bg-black backdrop-blur-[6px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Panel ─────────────────────────────────────────────────────── */}
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} details`}
        {...panelMotion}
        transition={{ type: "spring", damping: 30, stiffness: 280, mass: 0.85 }}
        // Mobile: swipe-to-dismiss
        drag={isMobile ? "y" : false}
        dragConstraints={{ top: 0 }}
        dragElastic={{ top: 0, bottom: 0.55 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
          } else {
            dragY.set(0);
          }
        }}
        className={`${panelPositionClass} z-50 flex flex-col bg-[#07070f]/[0.97] border-l border-white/[0.07] backdrop-blur-2xl`}
        style={
          isMobile
            ? {
                y: dragY,
                boxShadow: "0 -24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
              }
            : {
                boxShadow: "-24px 0 80px rgba(0,0,0,0.6), -1px 0 0 rgba(255,255,255,0.03)",
              }
        }
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-t-3xl md:rounded-none">
          <div
            className={`absolute ${
              isMobile
                ? "top-0 left-1/2 -translate-x-1/2 w-80"
                : "top-0 right-0 w-[420px]"
            } h-72 ${glowBg[color]} rounded-full blur-[90px] opacity-60`}
          />
        </div>

        {/* ── Mobile drag handle ─────────────────────────────────────── */}
        {isMobile && (
          <div
            className="flex justify-center pt-3 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing"
            aria-hidden="true"
          >
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>
        )}

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.012] flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xl flex-shrink-0 ${ac.bg} ${ac.border}`}
              aria-hidden="true"
            >
              {icon}
            </div>
            <div className="min-w-0">
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${ac.text}`}>
                {type === "feature" ? "Feature" : "Use Case"}
              </p>
              <h2 className="text-white font-bold text-[15px] leading-tight truncate">
                {title}
              </h2>
            </div>
          </div>

          {/* Close — first focusable element so it receives auto-focus */}
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 w-10 h-10 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            aria-label="Close panel"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path
                d="M1 1l11 11M12 1L1 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ───────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-6 py-7 space-y-8">

            {/* Intro */}
            <p className="text-slate-300 text-[15px] leading-relaxed">{detail.intro}</p>

            {/* Who it's for */}
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2.5 ${ac.text}`}>
                Who it&apos;s for
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">{expanded.forWho}</p>
            </div>

            {/* What it solves */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2.5">
                What it solves
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">{expanded.problem}</p>
            </div>

            {/* How it works */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                How it works
              </p>
              <div className="relative space-y-5">
                <div className="absolute left-3 top-4 bottom-4 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" aria-hidden="true" />
                {detail.workflow.map((w, i) => (
                  <div key={w.step} className="flex gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0 z-10 ${ac.bg} ${ac.border} ${ac.text}`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </div>
                    <div className="pt-0.5">
                      <p className="text-white text-sm font-semibold mb-1">{w.step}</p>
                      <p className="text-slate-400 text-xs leading-relaxed">{w.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Use cases */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                Use cases
              </p>
              <ul className="space-y-2.5">
                {expanded.useCases.map((uc) => (
                  <li key={uc} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${ac.dot}`} aria-hidden="true" />
                    {uc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected results */}
            <div className={`rounded-2xl border p-4 ${ac.bg} ${ac.border}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 ${ac.text}`}>
                Expected results
              </p>
              <p className={`text-sm font-semibold leading-relaxed ${ac.text}`}>
                {expanded.outcome}
              </p>
            </div>

            {/* Why it matters */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">
                Why it matters
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">{detail.whyItMatters}</p>
            </div>

            {/* Full details link */}
            <div className="pb-2">
              <Link
                href={pageHref}
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-200 transition-colors group"
              >
                <span>View full details</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Footer CTA ────────────────────────────────────────────── */}
        <div className="relative border-t border-white/[0.06] px-6 py-4 bg-white/[0.01] flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/#demo"
              onClick={onClose}
              className="flex-1 sm:flex-none bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors hover:shadow-lg hover:shadow-violet-500/25 text-center min-h-[44px] flex items-center justify-center"
            >
              Start Live Demo →
            </Link>
            <a
              href={CONTACT_HREF}
              className="text-center text-slate-400 hover:text-white text-sm font-medium transition-colors underline underline-offset-4 min-h-[44px] flex items-center justify-center"
            >
              Talk to us first
            </a>
          </div>
          <p className="text-center text-[11px] text-slate-700 mt-3">
            1 free demo included · No credit card required
          </p>
        </div>
      </motion.div>
    </>
  );
}
