"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_HREF } from "@/lib/landing-data";

const NAV_LINKS = [
  { label: "Features",     href: "/features"      },
  { label: "How It Works", href: "/how-it-works"  },
  { label: "Pricing",      href: "/pricing"        },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#05050a]/90 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="VoiceIQ home"
        >
          <div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm"
            aria-hidden="true"
          >
            V
          </div>
          <span className="text-white font-semibold text-lg">VoiceIQ</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              role="listitem"
              className="text-[13px] text-slate-400 hover:text-white transition-colors duration-150 font-medium"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="flex items-center gap-3">
          <a
            href={CONTACT_HREF}
            className="hidden md:block text-[13px] text-slate-400 hover:text-white transition-colors duration-150 font-medium"
          >
            Contact
          </a>
          <a
            href="/#demo"
            className="bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-all duration-150 hover:shadow-lg hover:shadow-violet-500/25 min-h-[36px] flex items-center"
          >
            Start Live Demo
          </a>

          {/* Mobile hamburger — 44×44 tap target */}
          <button
            className="md:hidden w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white transition-colors ml-1 rounded-lg hover:bg-white/5"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <AnimatePresence initial={false} mode="wait">
                {menuOpen ? (
                  <motion.path
                    key="close"
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    d="M4 4l12 12M16 4L4 16"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                  />
                ) : (
                  <motion.g
                    key="burger"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
                  </motion.g>
                )}
              </AnimatePresence>
            </motion.svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
            className="md:hidden border-t border-white/5 bg-[#05050a]/98 backdrop-blur-xl"
          >
            <div className="px-6 py-3 flex flex-col">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  role="menuitem"
                  onClick={closeMenu}
                  className="text-[15px] text-slate-300 hover:text-white transition-colors py-3.5 border-b border-white/[0.05] last:border-0"
                >
                  {label}
                </a>
              ))}
              <a
                href={CONTACT_HREF}
                role="menuitem"
                onClick={closeMenu}
                className="text-[15px] text-slate-300 hover:text-white transition-colors py-3.5 border-b border-white/[0.05]"
              >
                Contact
              </a>
              <a
                href="/#demo"
                role="menuitem"
                onClick={closeMenu}
                className="mt-4 mb-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm rounded-xl py-3.5 text-center transition-colors"
              >
                Start Live Demo →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
