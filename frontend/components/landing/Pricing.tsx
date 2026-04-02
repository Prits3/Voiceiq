"use client";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    badge: null,
    price: "€29",
    period: "per month",
    desc: "For solo founders testing AI outbound",
    includedLine: "Includes 300 min · then €0.09/min",
    features: [
      "300 min/mo calling time",
      "AI voice calling & qualification",
      "3 AI voice options",
      "Call transcripts",
      "Basic lead dashboard",
      "Email support",
    ],
    cta: "Start Free Trial",
    href: "/login",
    highlight: false,
  },
  {
    name: "Growth",
    badge: "Most Popular",
    price: "€99",
    period: "per month",
    desc: "For teams scaling outbound with AI voice",
    includedLine: "Includes 1,200 min · then €0.06/min",
    features: [
      "1,200 min/mo calling time",
      "Everything in Starter",
      "Priority AI calling queue",
      "Analytics & conversion dashboard",
      "CRM integrations (HubSpot, Salesforce)",
      "Custom call scripts",
      "Priority support",
      "Dedicated onboarding",
    ],
    cta: "Start Free Trial",
    href: "/login",
    highlight: true,
  },
  {
    name: "Agency",
    badge: "White-Label",
    price: "€499",
    period: "per month",
    desc: "Resell AI calling under your own brand",
    includedLine: "Unlimited calling time included",
    features: [
      "Unlimited calling time",
      "Everything in Growth",
      "White-label (your brand, your domain)",
      "Custom AI voice cloning",
      "API access + webhooks",
      "Multi-client dashboard",
      "Dedicated account manager",
      "SLA & compliance support",
    ],
    cta: "Talk to Sales",
    href: "mailto:hello@voiceiq.ai",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 border-t border-white/5 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/6 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-violet-300 text-sm font-medium">Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple Pricing That Scales With You
          </h2>
          <p className="text-slate-400 text-lg">
            Start with a free trial. No credit card required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl border flex flex-col transition-all ${
                plan.highlight
                  ? "bg-gradient-to-b from-violet-500/15 to-transparent border-violet-500/40 shadow-2xl shadow-violet-500/10"
                  : "bg-white/[0.02] border-white/8 hover:border-white/15 hover:bg-white/[0.03]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none" />
              )}

              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap shadow-lg ${
                  plan.highlight
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-violet-500/30"
                    : "bg-gradient-to-r from-cyan-600 to-violet-600 shadow-cyan-500/30"
                }`}>
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className="mb-5 relative">
                <h3 className="text-white font-semibold text-lg mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-5xl font-bold text-white tracking-tight">{plan.price}</span>
                  <span className="text-slate-400 text-sm">/ {plan.period}</span>
                </div>
                <p className="text-slate-500 text-xs mb-2">{plan.includedLine}</p>
                <p className="text-slate-400 text-sm">{plan.desc}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="text-violet-400 mt-0.5 flex-shrink-0">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.href}
                className={`relative block text-center py-3.5 rounded-xl font-semibold text-sm transition-all overflow-hidden ${
                  plan.highlight
                    ? "bg-violet-600 hover:bg-violet-500 text-white hover:shadow-lg hover:shadow-violet-500/25"
                    : "bg-white/8 hover:bg-white/12 text-white border border-white/10"
                }`}
              >
                {plan.cta} →
              </a>
              <p className="text-center text-xs text-slate-600 mt-2">14-day free trial · No credit card</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 text-sm mt-10"
        >
          All plans include 14-day free trial · GDPR compliant · Cancel anytime · No setup fees
        </motion.p>
      </div>
    </section>
  );
}
