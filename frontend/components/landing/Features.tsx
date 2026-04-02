"use client";
import { motion } from "framer-motion";

const features = [
  {
    icon: "🎙️",
    title: "AI Voice Calling",
    desc: "Natural-sounding AI voices make outbound calls at scale — indistinguishable from a real rep.",
    color: "violet",
  },
  {
    icon: "🎯",
    title: "Smart Lead Qualification",
    desc: "Custom scripts and AI logic qualify prospects based on your exact criteria and sales playbook.",
    color: "cyan",
  },
  {
    icon: "🛡️",
    title: "GDPR & TCPA Compliant",
    desc: "Built-in compliance controls. Do-not-call list management, call disclosures, and consent tracking — legally safe in EU and US.",
    color: "violet",
  },
  {
    icon: "📝",
    title: "Real-time Transcripts",
    desc: "Every word captured, searchable, and timestamped. Never miss what a prospect said.",
    color: "violet",
  },
  {
    icon: "🔗",
    title: "CRM & Zapier Sync",
    desc: "Qualified leads sync instantly to HubSpot, Salesforce, or any tool via Zapier. No manual data entry ever.",
    color: "cyan",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    desc: "Track call volume, qualification rates, and conversion metrics across every campaign.",
    color: "fuchsia",
  },
  {
    icon: "🎙️",
    title: "Voice Cloning",
    desc: "Clone your top rep's voice or choose from 40+ premium AI voices. Your brand, your tone.",
    color: "fuchsia",
  },
];

const colorMap: Record<string, string> = {
  violet: "bg-violet-500/10 border-violet-500/20 text-violet-400 group-hover:bg-violet-500/20 group-hover:border-violet-500/40",
  cyan:   "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40",
  fuchsia:"bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400 group-hover:bg-fuchsia-500/20 group-hover:border-fuchsia-500/40",
};

const trustBadges = [
  { icon: "🔒", label: "SOC 2 Type II" },
  { icon: "🇪🇺", label: "GDPR Ready" },
  { icon: "🇺🇸", label: "TCPA Compliant" },
  { icon: "🔐", label: "End-to-end encrypted" },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-cyan-300 text-sm font-medium">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-slate-400 text-lg">
            Enterprise-grade AI voice — built for teams that close.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group p-6 rounded-2xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/12 transition-all cursor-default relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl" />

              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl mb-4 transition-all ${colorMap[f.color]}`}>
                {f.icon}
              </div>
              <h3 className="text-white font-semibold mb-2 text-base">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Compliance trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-0 border border-white/8 bg-white/[0.02] rounded-2xl px-8 py-4"
        >
          {trustBadges.map((badge, i) => (
            <div key={badge.label} className="flex items-center">
              <div className="flex items-center gap-1.5 px-4 py-1">
                <span className="text-sm">{badge.icon}</span>
                <span className="text-slate-400 text-xs font-medium">{badge.label}</span>
              </div>
              {i < trustBadges.length - 1 && (
                <span className="text-slate-700 text-xs px-1">·</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
