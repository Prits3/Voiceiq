"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Is AI voice calling legal?",
    a: "Yes — when done correctly. VoiceIQ is built around consent-first workflows. In the EU we comply with GDPR and ePrivacy; in the US we follow TCPA guidelines, including do-not-call list integration and required disclosures. Your AI rep identifies itself as an AI at the start of every call. We provide configurable consent flows and full audit logs so your team stays compliant. If you have specific regulatory questions for your market, we're happy to walk through them — reach out any time.",
  },
  {
    q: "How is this different from a robocall?",
    a: "Robocalls play a pre-recorded audio clip and hang up. VoiceIQ has a real-time two-way conversation — it listens to what the prospect says, understands context, handles objections, answers questions about your product, and adapts the conversation accordingly. It sounds and behaves like a human rep. The call ends when the conversation naturally ends, not on a timer.",
  },
  {
    q: "What happens if the AI can't answer a question?",
    a: "The AI is trained on your product and script, so it handles the vast majority of conversations without issue. For anything outside its scope, it smoothly hands the call off to a human rep in real time — no awkward pause, no dropped call. Every escalation is logged and the human rep receives a live transcript so they can pick up exactly where the AI left off.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams go live in under 10 minutes. You paste in your product description, choose a voice, and start a live demo call immediately — no setup required for the demo. For a full production campaign with CRM integration, custom scripts, and lead list import, expect 30–60 minutes with guidance from our onboarding team.",
  },
  {
    q: "Which CRMs and tools does it integrate with?",
    a: "VoiceIQ integrates with HubSpot, Salesforce, Pipedrive, and any tool that accepts webhook events. Every qualified lead, call transcript, and disposition is automatically pushed to your CRM the moment the call ends. CSV import and export are also available on all plans.",
  },
  {
    q: "What's included in the free trial?",
    a: "The 14-day free trial includes everything in the Starter plan: 300 calling minutes, 3 AI voice options, full call transcripts, and access to the lead dashboard. No credit card is required to start. At the end of the trial you choose a plan or stop — there's no auto-charge.",
  },
  {
    q: "Can I use my own voice or brand?",
    a: "Yes — on the Agency plan you can clone a custom voice (your own voice, a brand persona, or a specific accent) and deploy it under your own domain and branding. The white-label mode removes all VoiceIQ references from the product entirely, making it fully native to your brand.",
  },
];

function FAQItem({
  q,
  a,
  isOpen,
  onToggle,
  index,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-white font-medium text-[15px] leading-snug group-hover:text-slate-200 transition-colors">
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-slate-400 group-hover:border-violet-500/40 group-hover:text-violet-400 transition-colors"
          aria-hidden="true"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={`faq-answer-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p className="text-slate-400 text-sm leading-relaxed pb-5 max-w-2xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <section id="faq" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-violet-300 text-sm font-medium">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Common Questions
          </h2>
          <p className="text-slate-400 text-lg">
            Everything you need to know before getting started.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.015] px-6 divide-y-0"
        >
          {faqs.map((item, i) => (
            <FAQItem
              key={item.q}
              q={item.q}
              a={item.a}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-slate-500 text-sm mt-8"
        >
          Still have questions?{" "}
          <a
            href="mailto:pritikatimsina2345@gmail.com?subject=VoiceIQ%20Inquiry&body=Hi,%20I%E2%80%99d%20like%20to%20learn%20more%20about%20VoiceIQ."
            className="text-slate-300 hover:text-white transition-colors underline underline-offset-4"
          >
            Talk to us directly →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
