"use client";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    icon: "📋",
    title: "Upload Your Leads",
    desc: "Import from CSV, connect HubSpot, Salesforce or paste a list. VoiceIQ enriches and prioritizes leads automatically.",
  },
  {
    num: "02",
    icon: "🎙️",
    title: "AI Calls & Qualifies",
    desc: "Your AI rep makes calls, handles objections, follows your script, and captures intent signals in real time.",
  },
  {
    num: "03",
    icon: "🔥",
    title: "Get Warm Handoffs",
    desc: "Qualified leads are flagged, scored, and handed to your reps. Only speak to prospects who are ready to buy.",
  },
  {
    num: "04",
    icon: "📊",
    title: "Track & Optimize",
    desc: "Full call transcripts, conversion dashboards, and A/B testing on scripts. Improve every week automatically.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 text-lg">
            From lead list to booked meeting in minutes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector lines between steps */}
          <div className="hidden md:block absolute top-8 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-gradient-to-r from-violet-500/0 via-violet-500/40 to-violet-500/0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative text-center group"
            >
              {/* Arrow between steps (except last) */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-6 -right-4 z-10 items-center justify-center w-8 h-8">
                  <span className="text-violet-500/60 text-lg font-bold">›</span>
                </div>
              )}

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 border border-white/8 flex items-center justify-center text-3xl mx-auto mb-5 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <div className="text-xs font-mono text-violet-400 mb-2 tracking-widest">
                {step.num}
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[180px] mx-auto">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Callout pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-full px-6 py-3">
            <span className="text-sm">⚡</span>
            <span className="text-violet-300 text-sm font-medium">
              Average team goes live in under 10 minutes
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
