export default function PrivacyPage() {
  return (
    <main className="bg-[#05050a] text-white min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="text-violet-400 hover:text-violet-300 text-sm mb-8 inline-block">
          ← Back to VoiceIQ
        </a>

        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: March 2025</p>

        <div className="space-y-10 text-slate-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Who We Are</h2>
            <p>
              VoiceIQ is an AI-powered voice sales platform. We are committed to protecting your
              personal data and complying with the General Data Protection Regulation (GDPR) and
              other applicable data protection laws.
            </p>
            <p className="mt-2">
              Data controller: VoiceIQ &mdash; Contact:{" "}
              <a href="mailto:privacy@voiceiq.ai" className="text-violet-400 hover:text-violet-300">
                privacy@voiceiq.ai
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. What Data We Collect</h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li>Account information (name, email) when you register</li>
              <li>Usage data (pages visited, features used) via essential cookies</li>
              <li>Call transcripts and recordings you create using our platform</li>
              <li>Payment information (processed securely by Stripe — we never store card details)</li>
              <li>Device and browser information for security and performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. Why We Collect It (Legal Basis)</h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li><strong className="text-slate-300">Contract performance</strong> — to provide the service you signed up for</li>
              <li><strong className="text-slate-300">Legitimate interest</strong> — product analytics to improve VoiceIQ</li>
              <li><strong className="text-slate-300">Consent</strong> — marketing emails and optional analytics cookies (you can withdraw anytime)</li>
              <li><strong className="text-slate-300">Legal obligation</strong> — billing records and fraud prevention</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. Cookies</h2>
            <p>We use two types of cookies:</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mt-2">
              <li><strong className="text-slate-300">Essential cookies</strong> — required for the platform to function (login session, preferences). Always active.</li>
              <li><strong className="text-slate-300">Analytics cookies</strong> — used to understand how visitors use our site. Only set with your explicit consent.</li>
            </ul>
            <p className="mt-2">You can change your cookie preferences at any time by clearing your browser cookies and revisiting our site.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. AI Calls & Call Recordings</h2>
            <p>
              VoiceIQ enables automated AI voice calls. When you use our platform to call prospects:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mt-2">
              <li>You are responsible for obtaining necessary consent from call recipients under applicable laws (GDPR, TCPA, etc.)</li>
              <li>Call recordings and transcripts are stored securely and only accessible by your account</li>
              <li>You can delete call data at any time from your dashboard</li>
              <li>We do not use your call data to train AI models without explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Data Sharing</h2>
            <p>We do not sell your data. We share data only with:</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mt-2">
              <li><strong className="text-slate-300">Vapi</strong> — voice infrastructure provider</li>
              <li><strong className="text-slate-300">Groq</strong> — AI language model processing</li>
              <li><strong className="text-slate-300">Stripe</strong> — payment processing</li>
              <li><strong className="text-slate-300">Vercel / Railway</strong> — hosting infrastructure</li>
            </ul>
            <p className="mt-2">All processors are under data processing agreements and comply with GDPR.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">7. Your Rights (GDPR)</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mt-2">
              <li><strong className="text-slate-300">Access</strong> — request a copy of your personal data</li>
              <li><strong className="text-slate-300">Rectification</strong> — correct inaccurate data</li>
              <li><strong className="text-slate-300">Erasure</strong> — request deletion of your data (&quot;right to be forgotten&quot;)</li>
              <li><strong className="text-slate-300">Portability</strong> — receive your data in a machine-readable format</li>
              <li><strong className="text-slate-300">Object</strong> — object to processing based on legitimate interest</li>
              <li><strong className="text-slate-300">Withdraw consent</strong> — at any time for consent-based processing</li>
            </ul>
            <p className="mt-2">
              To exercise any right, email{" "}
              <a href="mailto:privacy@voiceiq.ai" className="text-violet-400 hover:text-violet-300">
                privacy@voiceiq.ai
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">8. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. Call transcripts and
              recordings are retained for 12 months by default and can be deleted by you at any time.
              We delete all personal data within 30 days of account deletion.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">9. Security</h2>
            <p>
              All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We use industry-standard
              security practices and conduct regular security reviews. In the event of a data breach,
              we will notify affected users and relevant authorities within 72 hours as required by GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">10. Contact & Complaints</h2>
            <p>
              For privacy questions or to exercise your rights, contact us at{" "}
              <a href="mailto:privacy@voiceiq.ai" className="text-violet-400 hover:text-violet-300">
                privacy@voiceiq.ai
              </a>
              . If you are unsatisfied with our response, you have the right to lodge a complaint
              with your local data protection authority (e.g., ICO in the UK, BfDI in Germany).
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
