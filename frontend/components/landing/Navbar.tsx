"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#05050a]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
            V
          </div>
          <span className="text-white font-semibold text-lg">VoiceIQ</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
            Pricing
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:block text-sm text-slate-400 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <a
            href="#demo"
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-violet-500/20"
          >
            Try Demo
          </a>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#05050a] px-6 py-4 flex flex-col gap-4">
          <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Pricing</a>
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Log in</Link>
        </div>
      )}
    </nav>
  );
}
