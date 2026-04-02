"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "We replaced 3 SDRs with VoiceIQ and tripled our pipeline in 60 days. 800 calls/week, fully automated.",
    name: "Sarah K.",
    role: "VP of Sales",
    company: "TechFlow",
    avatar: "SK",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    quote:
      "Our reps went from 30 cold calls/day to zero. They just take warm handoffs now. Close rate up 40%.",
    name: "Marcus R.",
    role: "Founder",
    company: "Scaleup Labs",
    avatar: "MR",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    quote:
      "€12,000 saved on SDR salaries in month one. Best ROI of any tool in our stack.",
    name: "Lisa T.",
    role: "Head of Growth",
    company: "DataPulse",
    avatar: "LT",
    gradient: "from-fuchsia-500 to-pink-500",
  },
];

const pressLogos = ["TechCrunch", "Product Hunt", "Forbes", "Hacker News"];

export default function Testimonials() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by Sales Teams
          </h2>
          <p className="text-slate-400 text-lg mb-5">Don&apos;t take our word for it</p>

          {/* Rating pill */}
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-5 py-2">
            <span className="text-sm">⭐</span>
            <span className="text-yellow-300 text-sm font-medium">
              4.9/5 — Rated by 200+ sales teams on G2 and Capterra
            </span>
          </div>
        </motion.div>

        {/* Featured quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/25 rounded-2xl p-8 mb-8"
        >
          <div className="flex gap-0.5 mb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-yellow-400 text-base">★</span>
            ))}
          </div>
          <blockquote className="text-white text-xl md:text-2xl font-medium italic leading-relaxed mb-6">
            &ldquo;We went from 40 cold calls a day with 2 SDRs to 800 calls a day with VoiceIQ — and our qualified pipeline tripled in 6 weeks.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">JO</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">James O.</p>
              <p className="text-violet-400 text-xs font-medium">CRO at Nexlify</p>
            </div>
          </div>
        </motion.div>

        {/* 3 testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/12 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-semibold">{t.avatar}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                  <p className="text-violet-400 text-xs font-medium">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Press logos strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-slate-600 text-xs uppercase tracking-widest font-medium mb-5">As featured in:</p>
          <div className="flex items-center justify-center flex-wrap gap-6">
            {pressLogos.map((logo, i) => (
              <div key={logo} className="flex items-center gap-6">
                <span className="text-slate-600 font-semibold text-sm">{logo}</span>
                {i < pressLogos.length - 1 && (
                  <span className="text-slate-700 text-xs">·</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
