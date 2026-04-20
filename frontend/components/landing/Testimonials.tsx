"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCasesData, type UseCaseCard } from "@/lib/landing-data";

const trustItems = [
  { icon: "📋", label: "Configurable scripts",      desc: "Full control over what your AI says"          },
  { icon: "🔍", label: "Human review",              desc: "Every call transcript available instantly"     },
  { icon: "✋", label: "Consent-aware workflows",   desc: "Built for responsible outbound"                },
  { icon: "📁", label: "Audit-ready call logs",     desc: "Full history for every campaign"               },
  { icon: "🇪🇺", label: "GDPR-first architecture", desc: "Data residency in Europe"                      },
  { icon: "🔄", label: "Human handoff anytime",     desc: "Seamlessly escalate to your team"              },
];

// ── Card ──────────────────────────────────────────────────────────────────────
function UseCaseCard({ card }: { card: UseCaseCard }) {
  return (
    <Link
      href={`/?usecase=${card.slug}`}
      scroll={false}
      className="block group"
    >
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="relative rounded-2xl border bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04] hover:border-violet-500/20 hover:shadow-xl hover:shadow-violet-500/5 p-6 cursor-pointer transition-colors duration-200"
      >
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-violet-500/[0.03] to-transparent pointer-events-none" />

        {/* Icon */}
        <div className="text-2xl mb-4 transition-transform duration-200 group-hover:scale-110 inline-block">
          {card.icon}
        </div>

        {/* Text */}
        <h3 className="text-white font-semibold text-[15px] mb-2 leading-snug">
          {card.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>

        {/* Explore indicator */}
        <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-violet-600 group-hover:text-violet-400 transition-colors duration-200">
          <span>Explore</span>
          <svg
            className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function Testimonials() {
  return (
    <>
      {/* Who it's built for */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-violet-300 text-sm font-medium">Who it&apos;s built for</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built for Modern Outbound Teams
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              From lean founder-led sales to full SDR teams — VoiceIQ fits where you are right now.{" "}
              <span className="text-slate-600 text-base">Click any card to explore.</span>
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {useCasesData.map((card, i) => (
              <motion.div
                key={card.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <UseCaseCard card={card} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & trust strip */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              Built for Responsible Outbound AI
            </h2>
            <p className="text-slate-400 text-sm">
              Enterprise-grade controls so your team stays compliant and in control.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.015]"
              >
                <span className="text-lg mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
