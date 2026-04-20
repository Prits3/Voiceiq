"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { featuresData, type FeatureCard, type ColorKey } from "@/lib/landing-data";

// Only 3 core features on the homepage
const HOMEPAGE_SLUGS = ["ai-voice-calling", "smart-lead-qualification", "analytics"];

const iconMap: Record<ColorKey, string> = {
  violet:  "bg-violet-500/10 border-violet-500/15",
  cyan:    "bg-cyan-500/10 border-cyan-500/15",
  fuchsia: "bg-fuchsia-500/10 border-fuchsia-500/15",
};

const labelMap: Record<ColorKey, string> = {
  violet:  "text-violet-400",
  cyan:    "text-cyan-400",
  fuchsia: "text-fuchsia-400",
};

const hoverBorder: Record<ColorKey, string> = {
  violet:  "hover:border-violet-500/20",
  cyan:    "hover:border-cyan-500/20",
  fuchsia: "hover:border-fuchsia-500/20",
};

function FeatureCard({ feature }: { feature: FeatureCard }) {
  return (
    <Link href={`/?feature=${feature.slug}`} scroll={false} className="block group">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={`relative rounded-3xl border border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.045] p-10 cursor-pointer transition-colors duration-200 ${hoverBorder[feature.color]}`}
      >
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl mb-8 ${iconMap[feature.color]}`}
        >
          {feature.icon}
        </div>

        <h3 className="text-white font-semibold text-xl mb-3 leading-snug">
          {feature.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          {feature.desc}
        </p>

        <div className={`flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 ${labelMap[feature.color]} opacity-50 group-hover:opacity-100`}>
          <span>Learn more</span>
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

export default function Features() {
  const cards = featuresData.filter((f) => HOMEPAGE_SLUGS.includes(f.slug));

  return (
    <section id="features" className="py-40 px-6">
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
            Features
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            Built to close.
          </h2>
          <p className="text-slate-500 text-lg">
            Click any card to explore in detail.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((f, i) => (
            <motion.div
              key={f.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <FeatureCard feature={f} />
            </motion.div>
          ))}
        </div>

        {/* All features link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <Link
            href="/features"
            className="text-slate-500 hover:text-white text-sm font-medium transition-colors underline underline-offset-4 decoration-white/15 hover:decoration-white/40"
          >
            View all features →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
