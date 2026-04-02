"use client";
import { motion } from "framer-motion";

const stats = [
  { icon: "📞", value: "12,400+", label: "Calls Automated" },
  { icon: "📈", value: "38%", label: "Avg Pickup Rate" },
  { icon: "⚡", value: "3×", label: "Faster Qualification" },
  { icon: "🇪🇺", value: "GDPR", label: "Compliant" },
];

const trustedBy = ["Stripe", "Notion", "Linear", "Vercel", "Figma"];

export default function Hero() {
  return (
    <section className="relative pt-32 pb-28 px-6 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-violet-600 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.07, 0.14, 0.07] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[10%] right-[15%] w-[400px] h-[400px] bg-cyan-500 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-[5%] left-[35%] w-[300px] h-[300px] bg-purple-500 rounded-full blur-[80px]"
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-5xl mx-auto text-center relative">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 bg-violet-500/10 border border-violet-500/25 rounded-full px-5 py-2 mb-8 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-violet-300 text-sm font-medium tracking-wide">AI Voice Sales Platform</span>
          <span className="text-violet-500 text-xs">✦</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.06]"
        >
          <span className="text-white">AI Voice Sales Assistant</span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">
            That Qualifies Leads 24/7
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          VoiceIQ deploys an AI sales rep that calls, qualifies, and books meetings — while your team sleeps. No scripts to maintain. No reps to hire.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <a
            href="#demo"
            className="group relative w-full sm:w-auto overflow-hidden bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-2xl hover:shadow-violet-500/30 text-base"
          >
            <span className="relative z-10 flex items-center gap-2">
              🔥 Start Live Call Demo
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="#demo"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all backdrop-blur-sm text-base"
          >
            ⚡ Try Quick Demo
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm text-slate-500"
        >
          Free plan available · No credit card required · Cancel anytime
        </motion.p>

        {/* Social proof stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 inline-flex flex-wrap items-center justify-center gap-0 border border-white/8 bg-white/[0.02] rounded-2xl px-8 py-4 backdrop-blur-sm"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              <div className="flex items-center gap-2 px-5 py-1 text-center">
                <span className="text-base">{stat.icon}</span>
                <div>
                  <span className="text-white font-bold text-sm block leading-tight">{stat.value}</span>
                  <span className="text-slate-500 text-xs leading-tight">{stat.label}</span>
                </div>
              </div>
              {i < stats.length - 1 && (
                <div className="w-px h-8 bg-white/10 flex-shrink-0" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Trusted by logos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <p className="text-slate-600 text-xs uppercase tracking-widest font-medium">Trusted by teams at:</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {trustedBy.map((name, i) => (
              <div key={name} className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold tracking-wide text-sm">{name}</span>
                {i < trustedBy.length - 1 && (
                  <span className="text-slate-700 text-xs">·</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero mock UI */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 max-w-2xl mx-auto"
        >
          {/* Glow behind card */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-violet-600/20 blur-[60px] rounded-full pointer-events-none" />

          <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 text-left shadow-2xl shadow-black/50">
            {/* Window dots */}
            <div className="flex items-center gap-1.5 mb-5">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-auto flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Live Call</span>
              </span>
            </div>

            {/* Call info */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">VoiceIQ · Alex</p>
                <p className="text-slate-500 text-xs">Calling: John Smith · +1 (555) 234-5678</p>
              </div>
            </div>

            {/* Conversation */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-300 text-xs font-bold">AI</span>
                </div>
                <div className="bg-violet-500/15 border border-violet-500/20 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-xs">
                  <p className="text-sm text-slate-200">
                    Hi John! I&apos;m calling about automating your sales outreach. Do you have 2 minutes?
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="bg-white/6 border border-white/8 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-xs">
                  <p className="text-sm text-slate-300">Sure, what&apos;s this about?</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-slate-300 text-xs">JS</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-300 text-xs font-bold">AI</span>
                </div>
                <div className="bg-violet-500/15 border border-violet-500/20 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-xs">
                  <p className="text-sm text-slate-200">
                    We help sales teams qualify 10× more leads using AI voice calls. Would you be open to a quick demo?
                  </p>
                </div>
              </div>

              {/* Typing indicator */}
              <div className="flex gap-3 justify-end">
                <div className="bg-white/6 border border-white/8 rounded-2xl rounded-tr-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-slate-300 text-xs">JS</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
