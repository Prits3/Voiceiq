import { notFound } from "next/navigation";
import Link from "next/link";
import { useCasesData, CONTACT_HREF } from "@/lib/landing-data";

export function generateStaticParams() {
  return useCasesData.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const uc = useCasesData.find((u) => u.slug === slug);
  if (!uc) return {};
  return {
    title: `${uc.title} — VoiceIQ`,
    description: uc.desc,
  };
}

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = useCasesData.find((u) => u.slug === slug);
  if (!uc) notFound();

  const { title, icon, desc, detail } = uc;

  return (
    <main className="bg-[#05050a] text-white min-h-screen">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar strip */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#05050a]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold text-base">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
              V
            </div>
            VoiceIQ
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/#features"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              ← Homepage
            </Link>
            <a
              href="#demo-cta"
              className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            >
              Start Demo
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24 relative">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm mb-10 transition-colors group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to homepage
        </Link>

        {/* Hero */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-violet-300 text-sm font-medium">VoiceIQ for</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">{icon}</div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">{title}</h1>
          </div>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed">{detail.intro}</p>
        </div>

        {/* Key benefits */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Why Teams Choose VoiceIQ</h2>
          <div className="space-y-4">
            {detail.benefits.map((b, i) => (
              <div
                key={b.title}
                className="flex gap-4 p-5 rounded-2xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.035] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-400 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{b.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typical workflow */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
          <div className="relative">
            <div className="absolute left-5 top-8 bottom-8 w-px bg-gradient-to-b from-violet-500/40 via-violet-500/20 to-transparent" />
            <div className="space-y-6">
              {detail.workflow.map((w, i) => (
                <div key={w.step} className="flex gap-5">
                  <div className="w-10 h-10 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 flex items-center justify-center text-xs font-bold flex-shrink-0 z-10">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="pt-1.5 pb-4">
                    <h3 className="text-white font-semibold mb-1">{w.step}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why it matters */}
        <section className="mb-16">
          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/8 p-7">
            <h2 className="text-lg font-bold text-violet-300 mb-3">Why It Matters</h2>
            <p className="text-slate-300 leading-relaxed">{detail.whyItMatters}</p>
          </div>
        </section>

        {/* CTA */}
        <section id="demo-cta">
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 via-violet-500/5 to-transparent p-10 text-center">
            <div className="inline-flex items-center gap-2 bg-violet-500/15 border border-violet-500/25 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-violet-300 text-sm font-medium">Live demo available</span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-3">
              See VoiceIQ work for {title}
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Enter your offer and speak to your AI sales rep live. 1 free demo included — no setup required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#demo"
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/25 text-sm"
              >
                Start Live Demo →
              </Link>
              <a
                href={CONTACT_HREF}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors underline underline-offset-4"
              >
                Talk to us first
              </a>
            </div>

            <p className="mt-5 text-slate-600 text-xs">
              1 free live demo included · No credit card required
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
