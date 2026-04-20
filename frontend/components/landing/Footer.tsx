import Link from "next/link";
import { CONTACT_HREF } from "@/lib/landing-data";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
              V
            </div>
            <span className="text-white font-semibold">VoiceIQ</span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/features" className="text-sm text-slate-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">
              Terms
            </Link>
            <a
              href={CONTACT_HREF}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} VoiceIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
