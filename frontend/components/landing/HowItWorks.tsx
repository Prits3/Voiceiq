"use client";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    icon: "📋",
    title: "Upload Your Leads",
    sub: "CSV, HubSpot, Salesforce, or paste a list.",
  },
  {
    num: "02",
    icon: "🎙️",
    title: "AI Calls & Qualifies",
    sub: "Handles objections, follows your script, captures intent.",
  },
  {
    num: "03",
    icon: "🔥",
    title: "Get Warm Handoffs",
    sub: "Only speak to prospects ready to buy.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-40 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24"
        >
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-5">
            How it works
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            From list to meeting.
            <br />
            <span className="text-slate-500 font-normal">In minutes.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center text-center md:items-start md:text-left"
            >
              {/* Icon */}
              <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-5xl mb-7">
                {step.icon}
              </div>

              {/* Step number */}
              <p className="text-xs font-mono text-violet-500 tracking-widest mb-3">
                {step.num}
              </p>

              {/* Title */}
              <h3 className="text-white font-semibold text-xl mb-2 leading-snug">
                {step.title}
              </h3>

              {/* Subtitle */}
              <p className="text-slate-500 text-sm leading-relaxed">
                {step.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-600 text-sm">
            Average setup time: <span className="text-slate-400">under 10 minutes</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
