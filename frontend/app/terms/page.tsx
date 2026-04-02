export default function TermsPage() {
  return (
    <main className="bg-[#05050a] text-white min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="text-violet-400 hover:text-violet-300 text-sm mb-8 inline-block">
          ← Back to VoiceIQ
        </a>

        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: March 2025</p>

        <div className="space-y-10 text-slate-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using VoiceIQ (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you
              do not agree to these terms, do not use the Service. These terms apply to all users, including free and
              paid accounts.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">2. Description of Service</h2>
            <p>
              VoiceIQ is an AI-powered outbound voice sales platform that enables automated phone calls, lead
              qualification, and sales rep handoffs. The Service is provided &ldquo;as is&rdquo; and may be updated or changed
              at any time.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">3. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li>You are solely responsible for complying with all applicable laws when using AI calling features, including GDPR, TCPA, and local telemarketing regulations.</li>
              <li>You must obtain appropriate consent from call recipients where required by law.</li>
              <li>You must not use the Service to send unsolicited communications, engage in fraud, or harass individuals.</li>
              <li>You must keep your account credentials secure and notify us immediately of any unauthorized access.</li>
              <li>You must not attempt to reverse engineer, decompile, or interfere with the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">4. Acceptable Use</h2>
            <p>The Service may only be used for lawful business purposes. Prohibited uses include:</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400 mt-2">
              <li>Contacting numbers on national or regional Do Not Call registries without prior express consent</li>
              <li>Impersonating individuals, companies, or government entities</li>
              <li>Conducting scam calls, phishing, or any form of fraud</li>
              <li>Calling minors without parental consent</li>
              <li>Using the Service in jurisdictions where automated calling is prohibited</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">5. Billing & Subscriptions</h2>
            <p>
              Paid plans are billed monthly or annually. All fees are non-refundable except where required by law.
              You may cancel your subscription at any time; access continues until the end of the billing period.
              Overage charges for call minutes above your plan&apos;s included amount are billed at the per-minute rate
              listed on the pricing page. All prices are in EUR and exclude applicable taxes.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">6. Free Trial</h2>
            <p>
              New accounts may be eligible for a 14-day free trial. No credit card is required to start a trial.
              At the end of the trial, you will need to upgrade to a paid plan to continue using the Service.
              VoiceIQ reserves the right to modify or end free trial offers at any time.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">7. Intellectual Property</h2>
            <p>
              VoiceIQ retains all rights, title, and interest in the Service, including all software, AI models,
              and branding. You retain ownership of your data (leads, call recordings, transcripts). You grant
              VoiceIQ a limited license to process your data solely to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, VoiceIQ shall not be liable for any indirect, incidental,
              special, or consequential damages arising out of or related to your use of the Service, including
              fines, penalties, or legal costs resulting from your failure to comply with applicable calling laws.
              Our total liability shall not exceed the amount you paid in the 3 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">9. Termination</h2>
            <p>
              We may suspend or terminate your account at any time if you violate these Terms. Upon termination,
              your access to the Service ends immediately. You may request an export of your data within 30 days
              of termination.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">10. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. We will notify you of material changes via email or in-app
              notification. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of England and Wales. Any disputes shall be resolved in the
              courts of England and Wales, unless local mandatory law provides otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-lg mb-3">12. Contact</h2>
            <p>
              For questions about these Terms, email us at{" "}
              <a href="mailto:hello@voiceiq.ai" className="text-violet-400 hover:text-violet-300">
                hello@voiceiq.ai
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
