import Link from "next/link";
import { CONTACT_HREF } from "@/lib/landing-data";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <main className="bg-[#05050a] text-white min-h-screen flex flex-col items-center justify-center px-6">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative text-center max-w-lg mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-12 group"
          aria-label="VoiceIQ home"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm" aria-hidden="true">
            V
          </div>
          <span className="text-white font-semibold text-lg">VoiceIQ</span>
        </Link>

        {/* 404 */}
        <div className="text-[96px] font-extrabold leading-none bg-gradient-to-br from-white/20 via-white/10 to-white/5 bg-clip-text text-transparent mb-4 select-none" aria-hidden="true">
          404
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Page not found
        </h1>
        <p className="text-slate-400 text-base leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors hover:shadow-lg hover:shadow-violet-500/25 min-h-[44px] flex items-center"
          >
            ← Back to homepage
          </Link>
          <a
            href={CONTACT_HREF}
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors underline underline-offset-4"
          >
            Contact us
          </a>
        </div>
      </div>
    </main>
  );
}
