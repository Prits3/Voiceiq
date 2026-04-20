"use client";
import { motion } from "framer-motion";
import { CONTACT_HREF } from "@/lib/landing-data";

const BARS = [3, 5, 8, 4, 9, 6, 7, 3, 8, 5, 9, 6, 4, 7, 5];

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center px-6 pt-36 pb-0 overflow-hidden">

      {/* ── Background ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main top-centre violet bloom */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[560px] bg-violet-700/20 rounded-full blur-[140px]" />
        {/* Subtle bottom-right accent */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-700/10 rounded-full blur-[120px]" />
      </div>

      {/* ── Text block ─────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-3xl w-full mx-auto text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-4 py-1.5 mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-violet-300/75 text-[11px] font-medium tracking-[0.14em] uppercase">
            Private Beta · Early Access
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08 }}
          className="text-[52px] sm:text-[68px] md:text-[80px] font-bold tracking-tight leading-[1.04] mb-6"
        >
          <span className="text-white">AI Sales Calls That</span>
          <br />
          <span className="bg-gradient-to-br from-violet-300 via-violet-400 to-purple-500 bg-clip-text text-transparent">
            Qualify Leads 24/7
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18 }}
          className="text-[17px] text-slate-400 font-light mb-10 max-w-sm mx-auto leading-relaxed"
        >
          Your AI rep makes the calls.
          <br className="hidden sm:block" /> Your team closes the deals.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.26 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#demo"
            className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-xl hover:shadow-violet-600/30"
          >
            Start Live Demo
            <svg
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href={CONTACT_HREF}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-medium transition-colors duration-150 px-4 py-3.5 rounded-xl hover:bg-white/[0.04]"
          >
            Talk to us
          </a>
        </motion.div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          className="mt-5 text-[11px] text-slate-600 tracking-wide"
        >
          Free demo · No credit card required
        </motion.p>
      </div>

      {/* ── Product preview card ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 56 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-16 w-full max-w-[520px] mx-auto"
      >
        {/* Under-glow */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-violet-600/25 blur-2xl rounded-full pointer-events-none" />
        {/* Top edge highlight */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/[0.07] to-transparent pointer-events-none" />

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d16] overflow-hidden shadow-2xl shadow-black/60">

          {/* Window chrome */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.05] bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/35" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/35" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/35" />
            </div>
            <div className="flex-1 flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                Live Call — 00:47
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="px-5 pt-5 pb-4 space-y-3">

            {/* AI → */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-violet-400">AI</span>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.05] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                <p className="text-[13px] text-slate-300 leading-relaxed">
                  Hi Sarah, I&apos;m Aria from AcmeCorp. Is this a good time to quickly chat about your outreach?
                </p>
              </div>
            </div>

            {/* ← Customer */}
            <div className="flex items-start gap-2.5 justify-end">
              <div className="bg-violet-600/15 border border-violet-500/15 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
                <p className="text-[13px] text-slate-300 leading-relaxed">
                  Sure, we&apos;ve been struggling with low connect rates on cold calls.
                </p>
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-700/80 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-slate-400">S</span>
              </div>
            </div>

            {/* AI → */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-violet-400">AI</span>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.05] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                <p className="text-[13px] text-slate-300 leading-relaxed">
                  That&apos;s exactly what we fix. Our AI qualifies your list so your team only talks to ready buyers.
                </p>
              </div>
            </div>
          </div>

          {/* Waveform status bar */}
          <div className="mx-5 mb-5 bg-white/[0.02] border border-white/[0.04] rounded-xl px-4 py-2.5 flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-slate-500">AI speaking</span>
            </div>

            {/* Animated waveform */}
            <div className="flex-1 flex items-center justify-center gap-[2.5px] h-5">
              {BARS.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [0.35, 1, 0.35] }}
                  transition={{
                    duration: 0.75 + i * 0.055,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.04,
                  }}
                  className="w-[2px] bg-violet-400/55 rounded-full origin-center"
                  style={{ height: `${h * 2}px` }}
                />
              ))}
            </div>

            <div className="flex-shrink-0">
              <span className="text-[11px] text-slate-500">Score </span>
              <span className="text-[11px] text-violet-400 font-semibold">87</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
