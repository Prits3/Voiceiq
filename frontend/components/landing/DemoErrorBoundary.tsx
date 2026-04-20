"use client";
import { Component, type ReactNode } from "react";
import { CONTACT_HREF } from "@/lib/landing-data";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage?: string;
}

/**
 * Wraps the Demo section so that if the Pipecat/Groq backend is unreachable
 * or throws an unhandled error, users see a graceful fallback instead of
 * a broken widget or a white screen.
 */
export default class DemoErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production, pipe to your error monitoring service here:
    // e.g. Sentry.captureException(error, { extra: info })
    console.error("[DemoErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section id="demo" className="py-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] px-8 py-14">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-2xl mx-auto mb-5">
                🔌
              </div>

              <h2 className="text-xl font-bold text-white mb-3">
                Live demo is temporarily unavailable
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                Our AI voice server is having a moment. You can try again in a few
                seconds, or book a live walkthrough with us directly.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={this.handleReset}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors hover:shadow-lg hover:shadow-violet-500/25 min-h-[44px]"
                >
                  Try again
                </button>
                <a
                  href={CONTACT_HREF}
                  className="text-slate-400 hover:text-white text-sm font-medium transition-colors underline underline-offset-4"
                >
                  Schedule a walkthrough →
                </a>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
