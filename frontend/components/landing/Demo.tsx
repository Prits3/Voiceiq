"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Line        = { role: "AI" | "Customer"; text: string; voice: string | null };
type LiveMsg     = { role: "AI" | "User"; text: string };
type QuickStatus = "idle" | "generating" | "calling" | "done";
type LiveStatus  = "idle" | "connecting" | "active" | "ai-speaking" | "listening" | "ended" | "limit-reached";
type VoiceKey    = "female" | "male" | "friendly";
type LangKey     = "en" | "de" | "ar";

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const DEMO_CALL_LIMIT   = 1;
const DEMO_STORAGE_KEY  = "voiceiq_demo_calls";
const CALL_TIME_LIMIT_S = 120;     // 2-minute demo — enough for a real conversation

const IS_DEV = typeof window !== "undefined" && window.location.hostname === "localhost";

function getDemoCallsUsed(): number {
  if (IS_DEV) return 0; // bypass limit in local dev
  try { return parseInt(localStorage.getItem(DEMO_STORAGE_KEY) ?? "0", 10) || 0; }
  catch { return 0; }
}
function incrementDemoCallsUsed(): number {
  if (IS_DEV) return 0; // don't count in local dev
  try {
    const next = getDemoCallsUsed() + 1;
    localStorage.setItem(DEMO_STORAGE_KEY, String(next));
    return next;
  } catch { return 1; }
}

const VOICE_LABELS: Record<VoiceKey, string> = {
  female:   "👩 Female",
  male:     "👨 Male",
  friendly: "😊 Friendly",
};

// ElevenLabs voice IDs — used for Web Speech API voice selection.
// These are among the most human-sounding voices available.
const ELEVENLABS_VOICE: Record<VoiceKey, { provider: string; voiceId: string }> = {
  female:   { provider: "11labs", voiceId: "21m00Tcm4TlvDq8ikWAM" }, // Rachel — warm, professional
  male:     { provider: "11labs", voiceId: "ErXwobaYiN019PkySvjV" }, // Antoni — confident, clear
  friendly: { provider: "11labs", voiceId: "EXAVITQu4vr4xnSDxMaL" }, // Bella — soft, approachable
};

const LANG_LABELS: Record<LangKey, string> = {
  en: "🇬🇧 English",
  de: "🇩🇪 German",
  ar: "🇸🇦 Arabic",
};

// ─────────────────────────────────────────────────────────────────────────────
// Fallback script (when backend unavailable)
// ─────────────────────────────────────────────────────────────────────────────

function buildFallback(product: string): Line[] {
  const p = product || "your product";
  return [
    { role: "AI",       text: `Hi! I'm Alex calling about ${p}. Do you have 2 minutes?`, voice: null },
    { role: "Customer", text: "Sure, who is this?", voice: null },
    { role: "AI",       text: `I'm an AI sales assistant. We help teams automate ${p} outreach so your reps only speak to interested prospects.`, voice: null },
    { role: "Customer", text: "Hmm, we already use another tool for that.", voice: null },
    { role: "AI",       text: "Totally fair — most teams we speak to said the same. The difference is we qualify leads via voice, which converts 3× better than email. Would a quick 15-min demo show you the difference?", voice: null },
    { role: "Customer", text: "Okay... that could actually be useful.", voice: null },
    { role: "AI",       text: "Perfect! I'll send a calendar link to your email right now. Thanks for your time!", voice: null },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — TTS via Kokoro-Web (backend) with Web Speech API fallback
// ─────────────────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Kokoro voice per VoiceKey
const KOKORO_VOICE: Record<VoiceKey, string> = {
  female:   "af_heart",   // warm American female
  male:     "am_adam",    // American male
  friendly: "af_sky",     // soft, approachable female
};

let _audioCtx: AudioContext | null = null;
let _currentSource: AudioBufferSourceNode | null = null;

function getAudioCtx(): AudioContext {
  // Recreate if null or closed (browsers can close inactive contexts)
  if (!_audioCtx || _audioCtx.state === "closed") {
    _audioCtx = new AudioContext();
  }
  return _audioCtx;
}

/**
 * Must be called synchronously inside a user-gesture handler (button click).
 * Creates + resumes the AudioContext inside the gesture so it stays unlocked.
 */
function unlockAudio() {
  try {
    const ctx = getAudioCtx();
    if (ctx.state !== "running") ctx.resume();
  } catch {}
}

/** Fetch TTS audio from backend, returns MP3 bytes as a blob URL (or null on failure). */
async function fetchTTSAudio(text: string, voiceKey: VoiceKey): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/demo/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice: KOKORO_VOICE[voiceKey] }),
    });
    if (!res.ok) {
      console.warn("[VoiceIQ TTS] backend returned", res.status);
      return null;
    }
    const blob = await res.blob();
    console.log("[VoiceIQ TTS] got audio blob", blob.size, "bytes, type:", blob.type);
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn("[VoiceIQ TTS] fetch failed:", err);
    return null;
  }
}

/** Play a blob URL. Tries AudioContext first, falls back to HTMLAudioElement. */
async function playAudioUrl(url: string): Promise<void> {
  // --- Try AudioContext first ---
  try {
    const ctx = getAudioCtx();
    // Always attempt resume — no-op if already running
    if (ctx.state !== "running") await ctx.resume();

    const resp = await fetch(url);
    const arrayBuffer = await resp.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    if (_currentSource) { try { _currentSource.stop(); } catch {} _currentSource = null; }

    return await new Promise((resolve) => {
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      _currentSource = source;
      source.onended = () => {
        try { URL.revokeObjectURL(url); } catch {}
        _currentSource = null;
        resolve();
      };
      source.start();
    });
  } catch (e) {
    console.warn("[VoiceIQ] AudioContext failed, trying HTMLAudioElement:", e);
  }

  // --- Fallback: HTMLAudioElement ---
  try {
    await new Promise<void>((resolve, reject) => {
      const audio = new Audio(url);
      audio.onended = () => { try { URL.revokeObjectURL(url); } catch {} resolve(); };
      audio.onerror = () => { try { URL.revokeObjectURL(url); } catch {} reject(); };
      audio.play().catch(reject);
    });
  } catch (e) {
    console.warn("[VoiceIQ] HTMLAudioElement also failed:", e);
    try { URL.revokeObjectURL(url); } catch {}
  }
}

/** Fetch + play (used for single one-off utterances like the live demo AI responses). */
async function speakText(text: string, voiceKey: VoiceKey, _langKey: LangKey): Promise<void> {
  const url = await fetchTTSAudio(text, voiceKey);
  if (url) return playAudioUrl(url);
  // Browser TTS fallback
  return new Promise((resolve) => {
    if (typeof speechSynthesis === "undefined") { resolve(); return; }
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.9;
    utt.onend = () => resolve();
    utt.onerror = () => resolve();
    speechSynthesis.speak(utt);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated waveform bars
// ─────────────────────────────────────────────────────────────────────────────

function Waveform({ active }: { active: boolean }) {
  const bars = [3, 6, 9, 12, 9, 7, 11, 8, 5, 10, 7, 4, 9, 6, 8];
  return (
    <div className="flex items-center gap-[3px] h-8">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-violet-500 to-cyan-400"
          animate={active ? {
            scaleY: [1, (h / 6), 0.4, (h / 5), 1],
            opacity: [0.6, 1, 0.7, 1, 0.6],
          } : { scaleY: 0.2, opacity: 0.25 }}
          transition={active ? {
            duration: 0.8 + (i % 4) * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.06,
          } : { duration: 0.3 }}
          style={{ height: `${h * 2}px`, transformOrigin: "center" }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Upgrade modal (shown when demo limit is reached)
// ─────────────────────────────────────────────────────────────────────────────

function UpgradeModal({ onClose, onQuickDemo }: { onClose: () => void; onQuickDemo: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-violet-500/30 bg-[#0d0d14] shadow-2xl shadow-violet-500/20 p-8 text-center overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-violet-600/20 blur-[60px] rounded-full pointer-events-none" />

        {/* Lock icon */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center text-3xl mx-auto mb-5 shadow-xl shadow-violet-500/10">
          🔒
        </div>

        <h3 className="text-white text-2xl font-bold mb-2 relative">Demo Limit Reached</h3>
        <p className="text-slate-400 text-sm mb-6 relative leading-relaxed">
          You&apos;ve experienced your AI sales assistant.<br />
          Unlock the full power for your team.
        </p>

        {/* Pricing callout */}
        <div className="relative rounded-xl border border-violet-500/25 bg-violet-500/8 px-5 py-4 mb-5">
          <p className="text-white font-semibold text-base mb-0.5">Unlimited AI Calls</p>
          <p className="text-slate-400 text-xs mb-3">Real voice · Real prospects · Full analytics</p>
          <div className="flex items-baseline justify-center gap-1 mb-1">
            <span className="text-4xl font-bold text-white">€49.99</span>
            <span className="text-slate-400 text-sm">/ month</span>
          </div>
          <p className="text-slate-500 text-xs">14-day free trial · Cancel anytime</p>
        </div>

        <a
          href="mailto:pritikatimsina2345@gmail.com?subject=VoiceIQ%20Inquiry&body=Hi,%20I%E2%80%99d%20like%20to%20learn%20more%20about%20VoiceIQ."
          className="relative block w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/30 mb-3"
        >
          Get Early Access →
        </a>
        <button
          onClick={() => { onClose(); onQuickDemo(); }}
          className="w-full text-slate-400 hover:text-white text-sm font-medium transition-colors py-2"
        >
          Try Quick Demo instead (free)
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-600 hover:text-slate-300 transition-colors text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function Demo() {
  // ── shared ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"quick" | "live">("quick");
  const [voiceKey,  setVoiceKey]  = useState<VoiceKey>("female");
  const [langKey,   setLangKey]   = useState<LangKey>("en");

  // ── quick demo ──────────────────────────────────────────────────────────────
  const [product,  setProduct]  = useState("");
  const [messages, setMessages] = useState<Line[]>([]);
  const [qStatus,  setQStatus]  = useState<QuickStatus>("idle");
  const [muted,    setMuted]    = useState(false);
  const [source,   setSource]   = useState<"ai" | "fallback" | null>(null);
  const qMsgsRef                = useRef<HTMLDivElement>(null);

  // ── live demo (simulated) ───────────────────────────────────────────────────
  const [liveProduct,    setLiveProduct]    = useState("");
  const [liveMessages,   setLiveMessages]   = useState<LiveMsg[]>([]);
  const [liveStatus,     setLiveStatus]     = useState<LiveStatus>("idle");
  const [liveError,      setLiveError]      = useState<string | null>(null);
  const [demoCallsUsed,    setDemoCallsUsed]    = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [secondsLeft,      setSecondsLeft]      = useState(CALL_TIME_LIMIT_S);
  const countdownRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef  = useRef(false);

  // hydrate from localStorage after mount
  useEffect(() => { setDemoCallsUsed(getDemoCallsUsed()); }, []);
  const liveMsgsRef = useRef<HTMLDivElement>(null);

  const qIsRunning = qStatus === "generating" || qStatus === "calling";

  const scrollQ = () => { if (qMsgsRef.current)    qMsgsRef.current.scrollTop    = qMsgsRef.current.scrollHeight; };
  const scrollL = () => { if (liveMsgsRef.current) liveMsgsRef.current.scrollTop = liveMsgsRef.current.scrollHeight; };


  // ── QUICK DEMO ──────────────────────────────────────────────────────────────

  const runQuickDemo = async () => {
    if (!product.trim() || qIsRunning) return;
    unlockAudio(); // must be first — unlocks autoplay before any async work
    setMessages([]);
    setSource(null);

    let lines: Line[];
    try {
      setQStatus("generating");
      const ac = new AbortController();
      const t  = setTimeout(() => ac.abort(), 20_000);
      const res = await fetch(`${API_URL}/demo/generate`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ product: product.trim(), voice: voiceKey, language: langKey }),
        signal:  ac.signal,
      });
      clearTimeout(t);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      lines = data.lines as Line[];
      setSource("ai");
    } catch {
      lines = buildFallback(product.trim());
      setSource("fallback");
    }

    // Pre-fetch ALL AI audio in parallel before playback starts (avoids per-line latency)
    const audioUrls = new Map<number, string>();
    if (!muted) {
      await Promise.all(
        lines.map(async (line, i) => {
          if (line.role === "AI") {
            const url = await fetchTTSAudio(line.text, voiceKey);
            if (url) audioUrls.set(i, url);
          }
        })
      );
    }

    setQStatus("calling");
    for (const [i, line] of lines.entries()) {
      setMessages((prev) => [...prev, line]);
      scrollQ();
      if (line.role === "AI") {
        if (!muted) {
          const url = audioUrls.get(i);
          if (url) await playAudioUrl(url);
          else await sleep(600 + Math.min(line.text.length * 35, 2500));
        } else {
          await sleep(600 + Math.min(line.text.length * 35, 2500));
        }
        await sleep(300);
      } else {
        await sleep(800 + Math.min(line.text.length * 20, 1500));
      }
    }
    setQStatus("done");
    scrollQ();
  };

  // ── LIVE DEMO (simulated — free, no Vapi needed) ───────────────────────────

  const startLiveCall = async () => {
    if (!liveProduct.trim()) return;
    unlockAudio(); // must be first — unlocks autoplay before any async work

    // Enforce demo limit
    if (getDemoCallsUsed() >= DEMO_CALL_LIMIT) {
      setShowUpgradeModal(true);
      return;
    }

    cancelledRef.current = false;
    setLiveError(null);
    setLiveMessages([]);
    setLiveStatus("connecting");

    // Fetch script immediately — no artificial delay
    let lines: Line[];
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 15_000);
      const res = await fetch(`${API_URL}/demo/generate`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ product: liveProduct.trim(), voice: voiceKey, language: langKey }),
        signal:  ac.signal,
      });
      clearTimeout(t);
      if (!res.ok) throw new Error();
      const data = await res.json();
      lines = data.lines as Line[];
    } catch {
      lines = buildFallback(liveProduct.trim());
    }

    if (cancelledRef.current) return;

    const used = incrementDemoCallsUsed();
    setDemoCallsUsed(used);
    setSecondsLeft(CALL_TIME_LIMIT_S);
    setLiveStatus("active");

    countdownRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);

    // Play lines one by one — fetch TTS per line (no bulk pre-fetch delay)
    for (const [i, line] of lines.entries()) {
      if (cancelledRef.current) break;

      const role: LiveMsg["role"] = line.role === "AI" ? "AI" : "User";
      setLiveMessages((prev) => [...prev, { role, text: line.text }]);
      scrollL();

      if (line.role === "AI") {
        setLiveStatus("ai-speaking");
        if (!muted) {
          const url = await fetchTTSAudio(line.text, voiceKey);
          if (url) await playAudioUrl(url);
          else await sleep(600 + Math.min(line.text.length * 35, 2500));
        } else {
          await sleep(600 + Math.min(line.text.length * 35, 2500));
        }
        if (cancelledRef.current) break;
        await sleep(300);
        setLiveStatus("listening");
        await sleep(800);
      } else {
        setLiveStatus("listening");
        await sleep(1200 + Math.min(line.text.length * 20, 2000));
      }
    }

    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
    if (!cancelledRef.current) setLiveStatus("ended");
  };

  const endLiveCall = () => {
    cancelledRef.current = true;
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
    setLiveStatus("ended");
  };
  const resetLiveCall = () => {
    setLiveStatus("idle");
    setLiveMessages([]);
    setLiveError(null);
    setSecondsLeft(CALL_TIME_LIMIT_S);
  };

  const liveActive = liveStatus === "active" || liveStatus === "ai-speaking" || liveStatus === "listening" || liveStatus === "connecting";

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  const demoLimitReached = demoCallsUsed >= DEMO_CALL_LIMIT;

  return (
    <section id="demo" className="py-40 px-6 relative">
      {/* Upgrade modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <UpgradeModal
            onClose={() => setShowUpgradeModal(false)}
            onQuickDemo={() => setActiveTab("quick")}
          />
        )}
      </AnimatePresence>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-violet-600/8 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto relative">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-5">
            Live demo
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
            Hear it for yourself.
          </h2>
          <p className="text-slate-400 text-lg font-light">
            Enter what you sell. Your AI rep calls in seconds.
          </p>
        </motion.div>

        {/* ── Voice + Language selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-white/8 bg-white/[0.02] backdrop-blur-sm p-5 mb-4"
        >
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
            🎤 Choose Voice &amp; Language
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              {(Object.keys(VOICE_LABELS) as VoiceKey[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setVoiceKey(v)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    voiceKey === v
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                      : "bg-white/5 text-slate-300 border border-white/8 hover:bg-white/10"
                  }`}
                >
                  {VOICE_LABELS[v]}
                </button>
              ))}
            </div>
            <div className="sm:ml-auto flex gap-2">
              {(Object.keys(LANG_LABELS) as LangKey[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLangKey(l)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    langKey === l
                      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                      : "bg-white/5 text-slate-300 border border-white/8 hover:bg-white/10"
                  }`}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Mode tabs ── */}
        <div className="flex gap-2 mb-5 p-1 rounded-xl bg-white/[0.02] border border-white/6">
          <button
            onClick={() => setActiveTab("quick")}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "quick"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⚡ Quick Demo
          </button>
          <button
            onClick={() => setActiveTab("live")}
            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "live"
                ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🔥 Live Call Demo
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              demoLimitReached
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-green-500/15 text-green-400 border border-green-500/25"
            }`}>
              {demoLimitReached ? "Used" : `${DEMO_CALL_LIMIT - demoCallsUsed} free`}
            </span>
          </button>
        </div>

        <AnimatePresence mode="wait">

          {/* ══════════════════════════════════════════════════════════════════
              QUICK DEMO
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "quick" && (
            <motion.div
              key="quick"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Input */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runQuickDemo()}
                  disabled={qIsRunning}
                  placeholder="What are you selling? (e.g. CRM software, CCTV installation...)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all disabled:opacity-50 backdrop-blur-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setMuted((m) => !m)}
                    title={muted ? "Sound off" : "Sound on"}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-3 rounded-xl transition-all text-lg"
                  >
                    {muted ? "🔇" : "🔊"}
                  </button>
                  <button
                    onClick={runQuickDemo}
                    disabled={!product.trim() || qIsRunning}
                    className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all whitespace-nowrap hover:shadow-lg hover:shadow-violet-500/25"
                  >
                    {qStatus === "generating" ? "Generating..." : qStatus === "calling" ? "Calling..." : "Generate AI Call"}
                  </button>
                </div>
              </div>

              {source === "fallback" && qStatus !== "idle" && (
                <p className="text-xs text-slate-500 mb-4 text-center">
                  ⚡ Using scripted demo — add your Groq key to backend/.env for AI-generated calls
                </p>
              )}

              {/* Conversation */}
              <AnimatePresence>
                {messages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-6 shadow-2xl shadow-black/30"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/6">
                      <div className="flex items-center gap-2.5">
                        {qIsRunning ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-green-400 text-sm font-medium">
                              {qStatus === "generating" ? "Generating script..." : "📞 Call in progress..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-slate-500" />
                            <span className="text-slate-400 text-sm">Call ended</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {source === "ai" && (
                          <span className="text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                            AI-generated
                          </span>
                        )}
                        <span className="text-slate-500 text-xs">{VOICE_LABELS[voiceKey]} · {LANG_LABELS[langKey]}</span>
                      </div>
                    </div>

                    <div ref={qMsgsRef} className="space-y-4 max-h-[380px] overflow-y-auto scroll-smooth pr-1">
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex gap-3 ${msg.role === "Customer" ? "justify-end" : ""}`}
                        >
                          {msg.role === "AI" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-violet-500/20">
                              <span className="text-white text-xs font-bold">AI</span>
                            </div>
                          )}
                          <div className={`max-w-sm rounded-2xl px-4 py-3 text-sm text-slate-200 leading-relaxed ${
                            msg.role === "AI"
                              ? "bg-violet-500/15 border border-violet-500/20 rounded-tl-sm"
                              : "bg-white/8 border border-white/10 rounded-tr-sm"
                          }`}>
                            {msg.text}
                          </div>
                          {msg.role === "Customer" && (
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-slate-300 text-xs">You</span>
                            </div>
                          )}
                        </motion.div>
                      ))}

                      {qStatus === "calling" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
                            <span className="text-white text-xs font-bold">AI</span>
                          </div>
                          <div className="bg-violet-500/15 border border-violet-500/20 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1.5 items-center h-5">
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {qStatus === "done" && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 pt-5 border-t border-white/8 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                              <span className="text-green-400 text-xs">✓</span>
                            </div>
                            <span className="text-green-400 text-sm font-medium">Lead Qualified — Meeting Booked</span>
                          </div>
                          <span className="text-slate-500 text-xs">Demo complete</span>
                        </div>
                        <div className="rounded-xl border border-violet-500/25 bg-violet-500/8 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div>
                            <p className="text-white text-sm font-medium">Want your AI to make real calls like this?</p>
                            <p className="text-slate-400 text-xs mt-0.5">Real voice · Real prospects · Real pipeline</p>
                          </div>
                          <a href="/login" className="flex-shrink-0 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-violet-500/20">
                            Start Free Trial →
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {messages.length === 0 && !qIsRunning && (
                <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-3xl mx-auto mb-3">
                    🎙️
                  </div>
                  <p className="text-slate-500 text-sm">
                    Enter your product above and click{" "}
                    <span className="text-slate-300 font-medium">Generate AI Call</span>{" "}
                    to see a live demo
                  </p>
                  <p className="text-slate-600 text-xs mt-2">
                    🔊 Sound will play automatically · click 🔇 to mute
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              LIVE CALL DEMO (Simulated)
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === "live" && (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Idle — product input */}
              {liveStatus === "idle" && (
                <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center backdrop-blur-sm">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center text-4xl mx-auto mb-4 shadow-xl shadow-violet-500/10"
                  >
                    📞
                  </motion.div>
                  <h3 className="text-white font-semibold text-lg mb-1">Start a Live Call</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Experience the AI in action — powered by Groq
                  </p>
                  <input
                    type="text"
                    value={liveProduct}
                    onChange={(e) => setLiveProduct(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startLiveCall()}
                    placeholder="What are you selling? (e.g. SaaS tool, consulting...)"
                    className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all mb-3 text-sm"
                  />
                  <br />
                  <button
                    onClick={startLiveCall}
                    disabled={!liveProduct.trim()}
                    className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
                  >
                    {demoLimitReached ? "Upgrade to Unlock Calls" : "Start Live Demo"}
                  </button>

                  {/* Usage counter */}
                  <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-medium border ${
                    demoLimitReached
                      ? "bg-red-500/10 border-red-500/20 text-red-400"
                      : "bg-white/5 border-white/10 text-slate-400"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${demoLimitReached ? "bg-red-400" : "bg-green-400"}`} />
                    {demoLimitReached
                      ? "Free demo used · Upgrade for unlimited calls"
                      : `Free demo: ${demoCallsUsed}/${DEMO_CALL_LIMIT} used`}
                  </div>
                  <p className="text-slate-600 text-xs mt-2">Requires microphone access</p>
                  {liveError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-xs mt-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 inline-block"
                    >
                      {liveError}
                    </motion.p>
                  )}
                </div>
              )}

              {/* Connecting */}
              {liveStatus === "connecting" && (
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-10 text-center backdrop-blur-sm">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-2xl mx-auto mb-4 shadow-xl shadow-violet-500/30"
                  >
                    📞
                  </motion.div>
                  <p className="text-white font-medium mb-1">Connecting to AI...</p>
                  <p className="text-slate-500 text-sm">Setting up your voice call</p>
                </div>
              )}

              {/* Active call */}
              {liveActive && liveStatus !== "connecting" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm shadow-2xl shadow-black/30 overflow-hidden"
                >
                  {/* Call header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-green-500/5">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 text-sm font-medium">📞 Connected</span>
                      <span className="text-slate-500 text-xs">·</span>
                      <span className="text-slate-400 text-xs">Alex (VoiceIQ AI)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Countdown timer */}
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${
                        secondsLeft <= 10
                          ? "bg-red-500/15 border-red-500/30 text-red-400"
                          : "bg-white/5 border-white/10 text-slate-400"
                      }`}>
                        ⏱ {secondsLeft}s
                      </div>
                      <span className="text-xs text-slate-500">{VOICE_LABELS[voiceKey]}</span>
                    </div>
                  </div>

                  {/* Waveform + status */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/10">
                    <div className="flex items-center gap-3">
                      <Waveform active={liveStatus === "ai-speaking"} />
                      <span className="text-sm font-medium text-slate-300">
                        {liveStatus === "ai-speaking" && "Alex is speaking..."}
                        {liveStatus === "listening"   && "Your turn — just speak"}
                        {liveStatus === "active"      && "Connected"}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      liveStatus === "ai-speaking"
                        ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
                        : "bg-green-500/10 border-green-500/20 text-green-400"
                    }`}>
                      {liveStatus === "ai-speaking" ? "🤖 AI Speaking" : "🎤 Listening"}
                    </div>
                  </div>

                  {/* Messages */}
                  <div ref={liveMsgsRef} className="p-6 space-y-4 min-h-[200px] max-h-[320px] overflow-y-auto scroll-smooth">
                    <AnimatePresence initial={false}>
                      {liveMessages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex gap-3 ${msg.role === "User" ? "justify-end" : ""}`}
                        >
                          {msg.role === "AI" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-violet-500/20">
                              <span className="text-white text-xs font-bold">AI</span>
                            </div>
                          )}
                          <div className={`max-w-sm rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "AI"
                              ? "bg-violet-500/15 border border-violet-500/20 rounded-tl-sm text-slate-200"
                              : "bg-cyan-500/15 border border-cyan-500/20 rounded-tr-sm text-slate-200"
                          }`}>
                            {msg.text}
                          </div>
                          {msg.role === "User" && (
                            <div className="w-8 h-8 rounded-full bg-cyan-700/40 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-cyan-300 text-xs">You</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {liveMessages.length === 0 && (
                      <div className="flex justify-center items-center h-24">
                        <span className="text-slate-600 text-sm italic">Starting conversation...</span>
                      </div>
                    )}
                  </div>

                  {/* Error */}
                  {liveError && (
                    <div className="px-6 pb-3">
                      <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{liveError}</p>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="px-6 py-5 border-t border-white/8 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      {liveStatus === "listening"   && "🎤 Just speak — AI is listening"}
                      {liveStatus === "ai-speaking" && "🔊 Alex is speaking..."}
                      {liveStatus === "active"      && "✅ Connected"}
                    </div>
                    <button
                      onClick={endLiveCall}
                      className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 font-semibold px-5 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2"
                    >
                      ✕ End Call
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Ended */}
              {liveStatus === "ended" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-xl shadow-black/30 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 pb-4 mb-4 border-b border-white/8">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span className="text-slate-400 text-sm">Call ended</span>
                  </div>

                  <div className="space-y-3 mb-6 max-h-[280px] overflow-y-auto">
                    {liveMessages.map((msg, i) => (
                      <div key={i} className={`flex gap-3 ${msg.role === "User" ? "justify-end" : ""}`}>
                        {msg.role === "AI" && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">AI</span>
                          </div>
                        )}
                        <div className={`max-w-sm rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === "AI"
                            ? "bg-violet-500/10 border border-violet-500/15 text-slate-300"
                            : "bg-white/5 border border-white/8 text-slate-300"
                        }`}>
                          {msg.text}
                        </div>
                        {msg.role === "User" && (
                          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-slate-300 text-xs">You</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-violet-500/25 bg-violet-500/8 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-white text-sm font-medium">Ready for your AI to call real leads?</p>
                      <p className="text-slate-400 text-xs mt-0.5">Real voice · Real prospects · Real pipeline</p>
                    </div>
                    <a href="/login" className="flex-shrink-0 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-violet-500/20">
                      Start Free Trial →
                    </a>
                  </div>

                  <button
                    onClick={resetLiveCall}
                    className="w-full py-2.5 rounded-xl text-sm text-slate-400 hover:text-white border border-white/8 hover:border-white/15 transition-all"
                  >
                    ↺ Try Another Call
                  </button>
                </motion.div>
              )}

              {/* Limit reached — 30s cutoff hit */}
              {liveStatus === "limit-reached" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-violet-500/25 bg-white/[0.03] shadow-2xl shadow-violet-500/10 backdrop-blur-sm overflow-hidden"
                >
                  {/* Transcript replay */}
                  {liveMessages.length > 0 && (
                    <div className="p-5 space-y-3 max-h-[240px] overflow-y-auto border-b border-white/6">
                      {liveMessages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === "User" ? "justify-end" : ""}`}>
                          {msg.role === "AI" && (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">AI</span>
                            </div>
                          )}
                          <div className={`max-w-sm rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.role === "AI"
                              ? "bg-violet-500/10 border border-violet-500/15 text-slate-300"
                              : "bg-white/5 border border-white/8 text-slate-300"
                          }`}>
                            {msg.text}
                          </div>
                          {msg.role === "User" && (
                            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-slate-300 text-xs">You</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Paywall */}
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-2xl mx-auto mb-3">
                      ⏱
                    </div>
                    <p className="text-white font-semibold mb-1">Demo complete — 30s free trial used</p>
                    <p className="text-slate-400 text-sm mb-5">
                      Unlock unlimited AI calls, real campaigns, and full analytics.
                    </p>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/30 mb-3"
                    >
                      Upgrade Now — Unlock Unlimited Calls →
                    </button>
                    <button
                      onClick={() => { setActiveTab("quick"); resetLiveCall(); }}
                      className="w-full text-slate-400 hover:text-white text-sm font-medium transition-colors py-2"
                    >
                      Try Quick Demo instead (free)
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}
