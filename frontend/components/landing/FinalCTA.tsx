"use client";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 via-violet-500/5 to-transparent p-16 overflow-hidden"
        >
          {/* Animated glow */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-500 rounded-full blur-[80px] pointer-events-none"
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-violet-500/15 border border-violet-500/25 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-violet-300 text-sm font-medium">Start today — free</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Start your AI sales team
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                today
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Join hundreds of sales teams using VoiceIQ to qualify more leads, faster — without burning out their reps.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/login"
                className="group relative overflow-hidden bg-violet-600 hover:bg-violet-500 text-white font-semibold px-10 py-4 rounded-xl text-base transition-all hover:shadow-2xl hover:shadow-violet-500/30"
              >
                <span className="relative z-10">Start Free — No Credit Card →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="#demo"
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors underline underline-offset-4"
              >
                Try the demo first
              </a>
            </div>

            <p className="mt-5 text-slate-600 text-sm">
              Free plan includes 10 calls · Upgrade anytime · Cancel in one click
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
