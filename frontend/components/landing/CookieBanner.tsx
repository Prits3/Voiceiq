"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "voiceiq_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(CONSENT_KEY, "accepted"); } catch { /* noop */ }
    setVisible(false);
  };

  const decline = () => {
    try { localStorage.setItem(CONSENT_KEY, "declined"); } catch { /* noop */ }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-50"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0d0d14]/95 backdrop-blur-xl shadow-2xl shadow-black/60 p-5">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-xl flex-shrink-0 mt-0.5">🍪</span>
              <div>
                <p className="text-white text-sm font-semibold mb-1">We use cookies</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  We use essential cookies to make VoiceIQ work. We&apos;d also like to set optional
                  analytics cookies to help us improve the product. We won&apos;t set optional cookies
                  unless you accept. You can{" "}
                  <a href="/privacy" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
                    read our privacy policy
                  </a>{" "}
                  to learn more. GDPR compliant.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={accept}
                className="flex-1 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-violet-500/20"
              >
                Accept all
              </button>
              <button
                onClick={decline}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold py-2.5 rounded-lg transition-all"
              >
                Essential only
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
