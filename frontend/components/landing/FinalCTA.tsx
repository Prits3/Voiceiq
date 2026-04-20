"use client";
import { motion } from "framer-motion";
import { CONTACT_HREF } from "@/lib/landing-data";

export default function FinalCTA() {
  return (
    <section className="py-48 px-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-3xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-6xl md:text-7xl font-bold text-white leading-[1.06] mb-8">
            Start calling.
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Start closing.
            </span>
          </h2>

          <p className="text-slate-400 text-xl mb-14 font-light">
            One free demo. No credit card. No setup.
          </p>

          <a
            href={CONTACT_HREF}
            className="inline-flex items-center gap-2 bg-white text-[#05050a] font-semibold px-12 py-5 rounded-2xl text-base hover:bg-slate-100 transition-all hover:shadow-2xl hover:shadow-white/10"
          >
            Get Early Access →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
