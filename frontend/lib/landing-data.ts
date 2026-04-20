// ─────────────────────────────────────────────────────────────────────────────
// Central data for all landing page cards, expandable detail, and routed pages
// ─────────────────────────────────────────────────────────────────────────────

export const CONTACT_HREF =
  "mailto:pritikatimsina2345@gmail.com?subject=VoiceIQ%20Inquiry&body=Hi,%20I%E2%80%99d%20like%20to%20learn%20more%20about%20VoiceIQ.";

export type ColorKey = "violet" | "cyan" | "fuchsia";

export type ExpandedDetail = {
  forWho: string;
  problem: string;
  useCases: string[];
  outcome: string;
};

export type PageDetail = {
  intro: string;
  benefits: { title: string; desc: string }[];
  workflow: { step: string; desc: string }[];
  whyItMatters: string;
};

export type FeatureCard = {
  slug: string;
  icon: string;
  title: string;
  color: ColorKey;
  desc: string;
  expanded: ExpandedDetail;
  detail: PageDetail;
};

export type UseCaseCard = {
  slug: string;
  icon: string;
  title: string;
  desc: string;
  expanded: ExpandedDetail;
  detail: PageDetail;
};

// ─────────────────────────────────────────────────────────────────────────────
// Feature cards
// ─────────────────────────────────────────────────────────────────────────────

export const featuresData: FeatureCard[] = [
  {
    slug: "ai-voice-calling",
    icon: "🎙️",
    title: "AI Voice Calling",
    color: "violet",
    desc: "Natural-sounding AI voices make outbound calls at scale — consistent, tireless, and indistinguishable from a real rep.",
    expanded: {
      forWho: "Founders, sales managers, and SDR teams that need outbound volume without proportional headcount growth.",
      problem:
        "Cold calling is time-intensive and inconsistent. Hiring SDRs costs €30–60k per seat before you see a single qualified conversation.",
      useCases: [
        "Outbound prospecting to cold contact lists",
        "Follow-up calls for inbound trial signups",
        "Re-engagement of leads that went dark",
        "Appointment confirmation and reminder calls",
      ],
      outcome:
        "Handle 10× the call volume at a fraction of the cost, with the same pitch quality on call 1 as call 10,000.",
    },
    detail: {
      intro:
        "VoiceIQ deploys AI voice agents that make real phone calls, handle objections, and route qualified conversations to your team. It runs 24/7, scales instantly, and never has a bad day.",
      benefits: [
        {
          title: "Scale without headcount",
          desc: "Run hundreds of simultaneous calls without adding a single rep. VoiceIQ scales up and down instantly based on your campaign needs.",
        },
        {
          title: "Consistent delivery every time",
          desc: "Every call follows your script with perfect fidelity. No bad mornings, no off-pitch days, no deviation from approved messaging.",
        },
        {
          title: "Natural conversation handling",
          desc: "The AI handles common objections, pauses naturally, and responds to prospect cues — not a robocall, a real conversation.",
        },
        {
          title: "24/7 availability across time zones",
          desc: "Call prospects in any time zone at the right local hour. Night shifts and weekend campaigns run automatically.",
        },
        {
          title: "Instant warm handoff",
          desc: "When a prospect shows buying intent, VoiceIQ flags the lead immediately and routes it to a human rep — while they're still engaged.",
        },
      ],
      workflow: [
        { step: "Upload your contact list", desc: "Import from CSV, HubSpot, Salesforce, or paste directly. VoiceIQ normalises the data automatically." },
        { step: "Configure your script and voice", desc: "Choose from 40+ voices or clone your own. Set your qualification questions, objection responses, and handoff triggers." },
        { step: "Launch campaign", desc: "VoiceIQ begins calling at the cadence you set. All calls are recorded and transcribed in real time." },
        { step: "Receive warm leads", desc: "Qualified prospects are flagged and pushed to your CRM or Slack. Your reps step in only when it counts." },
      ],
      whyItMatters:
        "Most outbound teams operate at 5–10% of their potential call volume because human capacity is the ceiling. VoiceIQ removes that ceiling. By automating first-touch qualification, you compress the time from list to pipeline — and let your reps do what they're actually good at: closing.",
    },
  },
  {
    slug: "smart-lead-qualification",
    icon: "🎯",
    title: "Smart Lead Qualification",
    color: "cyan",
    desc: "Custom scripts and AI logic qualify prospects against your exact criteria — so reps only speak to leads that are ready.",
    expanded: {
      forWho: "Sales teams with defined ICP and qualification criteria (BANT, MEDDIC, or custom frameworks).",
      problem:
        "Reps waste 60–70% of their time on leads that will never convert. Unqualified leads clog the pipeline and distort your forecast.",
      useCases: [
        "BANT qualification on inbound trial signups",
        "Custom discovery flow for outbound prospects",
        "Intent scoring from live conversation data",
        "Multi-step qualification for complex sales cycles",
      ],
      outcome:
        "Only qualified, high-intent leads ever reach your reps — improving pipeline quality and close rates in the first week.",
    },
    detail: {
      intro:
        "VoiceIQ runs structured qualification conversations based on your playbook. It asks the right questions, listens for buying signals, and scores each prospect before any human time is spent.",
      benefits: [
        {
          title: "Your criteria, not ours",
          desc: "Build qualification scripts based on BANT, MEDDIC, or any custom framework. VoiceIQ adapts the conversation to your sales process.",
        },
        {
          title: "Real-time scoring",
          desc: "Every answer is scored against your thresholds. Leads are graded hot, warm, or not qualified — instantly, on every call.",
        },
        {
          title: "Objection intelligence",
          desc: "The AI recognises objection patterns and responds with your approved counters, capturing which objections appear most often.",
        },
        {
          title: "No guesswork in the handoff",
          desc: "When a qualified lead reaches your rep, they already have the call transcript, score, and prospect summary — fully context-aware from the first second.",
        },
        {
          title: "Pipeline you can trust",
          desc: "Qualification is applied consistently to every lead, not just the ones a rep happened to reach. Your pipeline becomes a real signal.",
        },
      ],
      workflow: [
        { step: "Define your qualification criteria", desc: "Set budget thresholds, timeline questions, role filters, and intent signals. VoiceIQ turns them into a natural conversation." },
        { step: "AI conducts discovery", desc: "The agent calls each prospect, asks structured questions, and listens for qualifying responses." },
        { step: "Lead is scored and tagged", desc: "Results are logged instantly with a qualification score, objection summary, and recommended next step." },
        { step: "Qualified leads reach your rep", desc: "High-intent leads are pushed to your CRM or rep queue with full context attached." },
      ],
      whyItMatters:
        "The cost of a wasted rep call is not just lost time — it's quota missed, forecast missed, and morale lost. Smart qualification fixes the input so everything downstream performs better. Your reps focus on closing, not sorting.",
    },
  },
  {
    slug: "compliance",
    icon: "🛡️",
    title: "GDPR & TCPA Compliant",
    color: "violet",
    desc: "Built-in compliance controls for EU and US outbound. Do-not-call management, AI disclosures, and full audit trails.",
    expanded: {
      forWho: "Any team making outbound calls in Europe (GDPR) or the US (TCPA) — or both.",
      problem:
        "A single compliance failure can cost six figures in fines. Most AI calling tools ship without proper consent, disclosure, or opt-out workflows.",
      useCases: [
        "EU outbound with AI disclosure and consent capture",
        "US campaigns with TCPA opt-out management",
        "Do-not-call list enforcement across all campaigns",
        "Audit trail generation for legal and compliance review",
      ],
      outcome:
        "Call legally across EU and US markets with confidence, documented controls, and zero regulatory exposure.",
    },
    detail: {
      intro:
        "VoiceIQ is built with compliance as a first-class feature, not an afterthought. Every call can include mandatory disclosures, opt-out capture, and automatic DNC enforcement — protecting your business from day one.",
      benefits: [
        {
          title: "Automatic AI disclosure",
          desc: "VoiceIQ can be configured to disclose the AI nature of the call at the start of every conversation, in the format required by your jurisdiction.",
        },
        {
          title: "Opt-out handling",
          desc: "Prospects who ask to be removed are immediately flagged and added to your DNC list — no human step required, no accidental repeat calls.",
        },
        {
          title: "Do-not-call list enforcement",
          desc: "Upload existing DNC lists or sync from your CRM. VoiceIQ checks before every dial and never contacts a suppressed number.",
        },
        {
          title: "Full call audit logs",
          desc: "Every call is logged with timestamp, recording, transcript, and outcome. Your legal team has everything they need for a review or dispute.",
        },
        {
          title: "GDPR-first data handling",
          desc: "Call data is handled with EU data residency, minimal retention, and deletion-on-request — designed to meet GDPR standards from the ground up.",
        },
      ],
      workflow: [
        { step: "Configure disclosure scripts", desc: "Set the required AI disclosure text for your market. It plays automatically at the start of each call." },
        { step: "Upload and sync DNC lists", desc: "Import suppression lists or connect your CRM. VoiceIQ enforces them on every campaign." },
        { step: "Run compliant campaigns", desc: "Calls proceed only for eligible contacts. Opt-outs are captured and logged in real time." },
        { step: "Export audit reports", desc: "Download full call logs, consent records, and opt-out history for any period — ready for legal review." },
      ],
      whyItMatters:
        "Compliance is not optional when you're making outbound calls at scale. Regulatory risk grows with call volume. VoiceIQ makes it possible to scale aggressively while staying legally protected — and documented proof of compliance is built into every campaign.",
    },
  },
  {
    slug: "transcripts",
    icon: "📝",
    title: "Real-time Transcripts",
    color: "violet",
    desc: "Every word captured, timestamped, and searchable. Never lose what a prospect said again.",
    expanded: {
      forWho: "Sales managers, compliance teams, and reps reviewing call quality or extracting insight.",
      problem:
        "Critical prospect information gets lost the moment a call ends. Notes are incomplete, objections are forgotten, and there is no record for coaching or legal protection.",
      useCases: [
        "Searchable call archive for deal reviews",
        "Coaching reps with real conversation examples",
        "Extracting objection patterns across hundreds of calls",
        "Compliance evidence for regulated industries",
      ],
      outcome:
        "Every call becomes a permanent, searchable business asset — improving coaching, deals, and compliance in parallel.",
    },
    detail: {
      intro:
        "VoiceIQ transcribes every call in real time, with speaker-separated text, timestamps, and keyword tagging. Nothing is lost, everything is searchable, and your entire call history is available the moment a call ends.",
      benefits: [
        {
          title: "Real-time, speaker-separated text",
          desc: "See exactly who said what, when. AI and prospect turns are clearly labelled and timestamped to the second.",
        },
        {
          title: "Full-text search across all calls",
          desc: "Search for any prospect name, objection phrase, or competitor mention across your entire call history in seconds.",
        },
        {
          title: "Automatic keyword tagging",
          desc: "Calls are automatically tagged with topics, objections, and intent signals. Filter by tag to find patterns across campaigns.",
        },
        {
          title: "Sales coaching at scale",
          desc: "Managers can review any call without listening to a recording. Pinpoint the exact moment a conversation turned — good or bad.",
        },
        {
          title: "Compliance documentation",
          desc: "Transcripts serve as evidence of disclosure, opt-out capture, and script adherence. Exportable for legal review on demand.",
        },
      ],
      workflow: [
        { step: "Call completes", desc: "Transcription is generated in real time during the call. It's available the moment the call ends." },
        { step: "Review in your dashboard", desc: "Open any call to see the full transcript with timeline, tags, and qualification score." },
        { step: "Search and filter", desc: "Use keyword search or tag filters to find specific conversations, objections, or prospect mentions." },
        { step: "Share or export", desc: "Share call transcripts with reps for coaching, or export for compliance documentation." },
      ],
      whyItMatters:
        "Most outbound insight is locked inside call recordings that nobody has time to review. Transcripts turn every call into structured data — giving you a live view of what's working, what objections are stalling deals, and whether your AI is performing as designed.",
    },
  },
  {
    slug: "crm-sync",
    icon: "🔗",
    title: "CRM & Zapier Sync",
    color: "cyan",
    desc: "Qualified leads push instantly to HubSpot, Salesforce, or any tool via Zapier — zero manual entry.",
    expanded: {
      forWho: "Teams already using HubSpot, Salesforce, or any Zapier-connected CRM or workflow tool.",
      problem:
        "Manual data entry after calls wastes hours and introduces errors. Qualified leads go cold while reps update records.",
      useCases: [
        "Push qualified leads to HubSpot deal stages instantly",
        "Create Salesforce opportunities after AI qualification",
        "Trigger Slack alerts when high-intent leads are identified",
        "Log call outcomes to any database via Zapier",
      ],
      outcome:
        "Zero manual entry. Qualified leads appear in your workflow automatically — while they are still hot.",
    },
    detail: {
      intro:
        "VoiceIQ connects to your existing sales stack without requiring you to change how you work. Qualified leads, call outcomes, and transcript summaries flow into your CRM the moment a call ends.",
      benefits: [
        {
          title: "HubSpot native integration",
          desc: "Qualified leads appear as new deals or contacts in HubSpot automatically, with call notes and qualification scores attached.",
        },
        {
          title: "Salesforce sync",
          desc: "Create or update Salesforce opportunities after every qualified call. Custom field mapping matches your existing CRM data model.",
        },
        {
          title: "Zapier for everything else",
          desc: "Connect to 5,000+ apps via Zapier. Trigger follow-up emails, Slack messages, spreadsheet entries, or webhook workflows based on call outcomes.",
        },
        {
          title: "Real-time webhooks",
          desc: "VoiceIQ fires webhooks the moment a call ends. Build custom integrations with any system using the event payload.",
        },
        {
          title: "Bi-directional sync",
          desc: "Import contact lists from your CRM, and push results back — no duplicate data management.",
        },
      ],
      workflow: [
        { step: "Connect your CRM", desc: "Authenticate HubSpot or Salesforce in one click. Configure field mappings once." },
        { step: "Set qualification triggers", desc: "Define which lead scores and outcomes should trigger a CRM push." },
        { step: "Call runs, sync happens", desc: "The moment a call ends with a qualifying outcome, the lead is created or updated in your CRM automatically." },
        { step: "Rep picks it up in context", desc: "Your rep opens the CRM record and finds the call summary, score, and transcript already attached." },
      ],
      whyItMatters:
        "Speed-to-lead is one of the highest-leverage variables in outbound sales. The difference between a 5-minute and a 60-minute follow-up response rate is dramatic. Automated CRM sync means qualified leads never wait in a queue before someone acts on them.",
    },
  },
  {
    slug: "analytics",
    icon: "📊",
    title: "Analytics Dashboard",
    color: "fuchsia",
    desc: "Track call volume, qualification rates, and conversion metrics across every campaign — know what's working.",
    expanded: {
      forWho: "Sales managers and founders tracking outbound performance and optimising campaigns.",
      problem:
        "Without clear data, you cannot distinguish a bad list from a bad script from a bad time of day. Most teams run outbound blind.",
      useCases: [
        "Track qualification rate by campaign and voice",
        "Compare script performance across A/B variants",
        "Identify the objections stalling most conversations",
        "Monitor call-to-meeting conversion across segments",
      ],
      outcome:
        "Data-driven outbound — know what converts, fix what doesn't, and compound improvements every week.",
    },
    detail: {
      intro:
        "VoiceIQ's analytics dashboard gives you a real-time view of every outbound campaign. From call volume to qualification rate to objection frequency — no spreadsheets, no exports, just clear signal.",
      benefits: [
        {
          title: "Campaign-level performance",
          desc: "See total calls, connection rate, qualification rate, and conversion rate for every campaign — updated in real time.",
        },
        {
          title: "Script and voice comparison",
          desc: "A/B test different scripts or voice personas. The dashboard shows which combination drives better outcomes.",
        },
        {
          title: "Objection analytics",
          desc: "See which objections appear most often, at which point in the conversation, and how often the AI overcomes them.",
        },
        {
          title: "Conversion funnel",
          desc: "Track the full funnel from dials to connected calls to qualified leads to booked meetings — find and fix the bottleneck.",
        },
        {
          title: "Exportable reports",
          desc: "Generate reports for stakeholders, clients, or quarterly reviews. Export to CSV or share a live dashboard link.",
        },
      ],
      workflow: [
        { step: "Dashboard live from first call", desc: "No setup required. The moment your first campaign runs, data flows into the dashboard." },
        { step: "Monitor campaigns in real time", desc: "See calls connecting, leads qualifying, and objections surfacing as they happen." },
        { step: "Identify patterns and optimise", desc: "Use objection data and conversion drop-off to improve scripts and targeting." },
        { step: "Report and iterate", desc: "Share weekly reports with your team and run faster improvement cycles." },
      ],
      whyItMatters:
        "Outbound without analytics is a cost centre. Outbound with analytics is a compounding growth asset. Every data point from VoiceIQ makes the next campaign smarter — and the gap between you and teams operating blind widens every month.",
    },
  },
  {
    slug: "voice-cloning",
    icon: "🎤",
    title: "Voice Cloning",
    color: "fuchsia",
    desc: "Clone your top rep's voice or choose from 40+ premium AI voices. Your brand, your tone, at any scale.",
    expanded: {
      forWho: "Agencies, enterprise teams, and founders who want brand-consistent voice identity across all outbound.",
      problem:
        "Generic AI voices feel impersonal and off-brand. Prospects respond better to a voice that matches your company's personality — and trust builds faster.",
      useCases: [
        "Clone your top rep's voice for outbound campaigns",
        "Build a named branded AI persona for your company",
        "Match voice tone to different market segments",
        "White-label voice identity for agency clients",
      ],
      outcome:
        "A consistent, recognisable brand voice across every call — at scale, with zero rep fatigue.",
    },
    detail: {
      intro:
        "VoiceIQ's voice system lets you build a calling identity that sounds uniquely yours. Clone a real team member, create a branded persona, or choose from a library of premium voices tuned for sales conversations.",
      benefits: [
        {
          title: "Clone any voice in minutes",
          desc: "Provide a short audio sample and VoiceIQ creates a high-fidelity voice clone — capturing tone, pace, and personality.",
        },
        {
          title: "40+ premium AI voices",
          desc: "Choose from a curated library of voices by gender, accent, energy level, and language — all optimised for telephone conversations.",
        },
        {
          title: "Named brand personas",
          desc: "Create \"Alex from VoiceIQ\" or any named persona that becomes your company's consistent AI rep identity.",
        },
        {
          title: "Per-segment voice configuration",
          desc: "Use a warmer, friendlier voice for SMB prospects and a more authoritative tone for enterprise buyers. Different personas per campaign.",
        },
        {
          title: "White-label for agencies",
          desc: "Build custom voice identities for each client. Deliver a fully branded calling experience without revealing the underlying platform.",
        },
      ],
      workflow: [
        { step: "Choose voice type", desc: "Select a pre-built voice from the library, or submit an audio sample for cloning." },
        { step: "Voice is processed", desc: "Cloning takes under 30 minutes. The result is a high-fidelity model ready for production calls." },
        { step: "Assign to campaign", desc: "Select your voice when launching a campaign. Different campaigns can use different voices." },
        { step: "Monitor quality", desc: "Listen to call samples from your dashboard and adjust voice parameters as needed." },
      ],
      whyItMatters:
        "Voice is the first signal of trust on a phone call. A voice that sounds flat, robotic, or off-brand breaks the conversation before it starts. Voice cloning closes the gap between AI calling and human calling — making the experience feel personal even at 10,000-call scale.",
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Use-case cards
// ─────────────────────────────────────────────────────────────────────────────

export const useCasesData: UseCaseCard[] = [
  {
    slug: "b2b-saas-founders",
    icon: "🚀",
    title: "B2B SaaS Founders",
    desc: "Run outbound at scale without hiring SDRs. Qualify trial signups and inbound leads automatically.",
    expanded: {
      forWho: "Solo or small-team founders doing their own sales, or managing a lean early-stage SDR function.",
      problem:
        "You need outbound volume before you can afford a full sales team. Manual prospecting pulls you away from product, and early hires are expensive and inconsistent.",
      useCases: [
        "Qualify inbound trial signups before they churn",
        "Run targeted outbound to ICP prospect lists",
        "Re-engage leads that went quiet after a demo",
        "Cover multiple market segments simultaneously",
      ],
      outcome:
        "VoiceIQ acts as your first SDR — calling, qualifying, and routing warm leads to you with no hiring budget required.",
    },
    detail: {
      intro:
        "Early-stage founders face a brutal constraint: they need sales to grow, but a proper sales team costs more than the runway allows. VoiceIQ bridges that gap — giving you enterprise-grade outbound capability at a fraction of the cost of a single hire.",
      benefits: [
        {
          title: "First SDR before you can afford one",
          desc: "VoiceIQ runs outbound qualification from day one. You get consistent, scalable prospecting without payroll, benefits, or onboarding time.",
        },
        {
          title: "Protect founder time",
          desc: "Stop spending hours on cold calls that go nowhere. Let the AI handle initial qualification so you only talk to prospects who have a real problem you can solve.",
        },
        {
          title: "Qualify trial signups automatically",
          desc: "When someone signs up for a trial, VoiceIQ can call them within minutes, qualify their use case, and route high-fit accounts to you for a hands-on activation call.",
        },
        {
          title: "Test ICP hypotheses quickly",
          desc: "Run short outbound campaigns to different segments and use conversation data to learn which customers actually convert — without wasting founder cycles.",
        },
        {
          title: "Scale into Series A ready",
          desc: "VoiceIQ data — qualification rates, objection patterns, segment performance — gives you the metrics to make the case for your first sales hire.",
        },
      ],
      workflow: [
        { step: "Define your ICP and script", desc: "Set your qualification criteria and the key questions you want answered. VoiceIQ translates them into a natural conversation." },
        { step: "Upload your first list", desc: "Import trial signups, inbound leads, or a cold prospect list. VoiceIQ starts calling immediately." },
        { step: "Receive qualified conversations", desc: "Prospects who meet your criteria are flagged and routed to you with full context — so every founder call is well-spent." },
        { step: "Iterate on learning", desc: "Use transcript data to refine your ICP, improve your pitch, and build the playbook your first sales hire will inherit." },
      ],
      whyItMatters:
        "Founders who talk to more customers faster build better products and close more revenue. VoiceIQ removes the manual friction from that process — so the question of 'how do I get more qualified conversations?' has a clear, repeatable answer from the moment you launch.",
    },
  },
  {
    slug: "outbound-sales-teams",
    icon: "🏢",
    title: "Outbound Sales Teams",
    desc: "Let VoiceIQ handle first-touch cold calls. Your reps focus on the warm conversations that move deals forward.",
    expanded: {
      forWho: "SDR and AE teams running structured outbound with high-volume call requirements and defined qualification criteria.",
      problem:
        "SDRs spend 60–70% of their time on calls that go nowhere. First-touch cold calling is demoralising, inefficient, and hard to scale without adding headcount.",
      useCases: [
        "AI handles first-touch qualification, reps take warm handoffs",
        "Run parallel campaigns across multiple lists simultaneously",
        "Re-engage prospects that bounced from previous sequences",
        "Increase daily qualified conversations per rep by 10×",
      ],
      outcome:
        "Reps spend all their time on high-intent conversations — quota attainment improves and SDR turnover drops.",
    },
    detail: {
      intro:
        "VoiceIQ doesn't replace your sales team — it removes the part of the job that burns people out. By automating first-touch qualification, your SDRs and AEs spend their hours on conversations that are already warm, already qualified, and already ready to move.",
      benefits: [
        {
          title: "Remove the most demoralising work",
          desc: "Cold calling a list of 200 people who don't pick up is what drives SDR churn. VoiceIQ absorbs that volume so your reps start every day at the warm handoff.",
        },
        {
          title: "Higher intent from the first conversation",
          desc: "When a rep gets a handoff, the prospect has already confirmed interest, provided context, and been scored. The opening conversation is already downstream of qualification.",
        },
        {
          title: "Parallel campaign execution",
          desc: "VoiceIQ can run five simultaneous outbound campaigns without strain — different messages, different segments, tracked separately in the analytics dashboard.",
        },
        {
          title: "Re-engagement without manual effort",
          desc: "Leads that went quiet three months ago can be re-engaged automatically with a relevant touchpoint — no rep time required until interest is confirmed.",
        },
        {
          title: "Manager visibility across all calls",
          desc: "Managers get full transcript access, qualification scores, and objection breakdowns — without listening to hours of recordings.",
        },
      ],
      workflow: [
        { step: "Load your prospect lists", desc: "Import from your CRM or upload a CSV. VoiceIQ is ready to dial in minutes." },
        { step: "AI runs first-touch calls", desc: "The agent calls every prospect, delivers your opening, handles objections, and qualifies based on your criteria." },
        { step: "Warm handoff to SDR/AE", desc: "Qualified prospects are pushed to your rep queue with transcript summary and score. Rep calls back on the same session." },
        { step: "Rep closes the loop", desc: "Every rep conversation starts from context, not from scratch. Close rates improve from the first week." },
      ],
      whyItMatters:
        "SDR capacity is the most expensive constraint in most outbound operations. Tripling call volume without tripling headcount is only possible when AI handles the part of the job that scales poorly with human effort. VoiceIQ does exactly that.",
    },
  },
  {
    slug: "appointment-setters",
    icon: "📅",
    title: "Appointment Setters",
    desc: "Book more meetings per day. AI handles initial outreach, qualification, and reminder calls — you handle the close.",
    expanded: {
      forWho: "Appointment-setting teams in real estate, insurance, financial services, coaching, healthcare, and high-ticket services.",
      problem:
        "Appointment setters burn through lists manually, miss callbacks, and hit burnout quickly. One missed follow-up can cost a sale worth thousands.",
      useCases: [
        "Pre-qualify booked appointments before the day of the meeting",
        "Follow up on expired leads and re-engage cold contacts",
        "Confirm upcoming appointments and cut no-show rates",
        "Qualify cold lists before human dial campaigns begin",
      ],
      outcome:
        "More appointments held, fewer no-shows, and zero missed follow-ups — without growing the team or burning people out.",
    },
    detail: {
      intro:
        "Appointment-setting businesses run on volume and reliability. VoiceIQ adds both — handling the calls that are repetitive, time-consuming, and easy to miss — so your team focuses on the conversations that actually require human judgment and relationship-building.",
      benefits: [
        {
          title: "Never miss a follow-up",
          desc: "VoiceIQ can be configured to call back every lead that didn't connect on the first attempt — automatically, at the right time, until a conversation happens or the lead opts out.",
        },
        {
          title: "Cut no-show rates with reminder calls",
          desc: "A confirmation call 24 hours and 1 hour before an appointment significantly reduces no-shows. VoiceIQ runs these automatically for every booking.",
        },
        {
          title: "Qualify leads before setting appointments",
          desc: "Not every inquiry is worth a meeting. VoiceIQ qualifies by budget, timeline, and fit before booking time with a human setter.",
        },
        {
          title: "Re-engage a dormant database",
          desc: "Old leads in your CRM may be ready to buy now. VoiceIQ can run re-engagement campaigns against your entire historic contact list without manual effort.",
        },
        {
          title: "Higher setter efficiency",
          desc: "Human setters work only the contacts that have been touched and pre-screened. Their time goes further, and their conversion rates improve.",
        },
      ],
      workflow: [
        { step: "Import your contact list", desc: "Upload new leads, pull from your CRM, or sync from your booking system." },
        { step: "VoiceIQ runs first-touch calls", desc: "The AI reaches out to every contact, qualifies them, and attempts to set an appointment." },
        { step: "Confirmed appointments logged", desc: "Successfully booked calls are logged in your dashboard and synced to your calendar or CRM." },
        { step: "Reminder calls run automatically", desc: "VoiceIQ calls confirmed appointments before the scheduled time to reduce no-shows." },
      ],
      whyItMatters:
        "Appointment businesses live and die by show rates and conversion rates. Both improve when leads are better qualified going in and properly reminded before the meeting. VoiceIQ handles both without adding operational complexity.",
    },
  },
  {
    slug: "agencies-and-consultants",
    icon: "🏷️",
    title: "Agencies & Consultants",
    desc: "Run AI voice outreach campaigns for multiple clients from a single dashboard — under your brand.",
    expanded: {
      forWho: "Sales agencies, lead generation firms, and consultants running outbound on behalf of clients.",
      problem:
        "Running outbound for multiple clients is operationally complex and expensive. Voice campaigns require headcount, scripts, and tracking across every account.",
      useCases: [
        "Run parallel campaigns for 5–20 clients from one dashboard",
        "White-label AI voice under your own agency brand",
        "Deliver higher call volume with a leaner team",
        "Offer AI calling as a new premium service tier",
      ],
      outcome:
        "Higher client retention, better margins, and a new premium offering that's hard to compete with.",
    },
    detail: {
      intro:
        "VoiceIQ gives agencies the infrastructure to offer enterprise-grade outbound voice campaigns at a fraction of the traditional cost. Multi-client management, white-labelling, and per-client analytics make it the operational backbone for modern sales agencies.",
      benefits: [
        {
          title: "Multi-client campaign management",
          desc: "Manage separate campaigns, scripts, and analytics for each client from a single dashboard. No operational sprawl, no account mixing.",
        },
        {
          title: "White-label voice identity",
          desc: "Each client campaign can use a custom branded AI persona — their name, their tone, their voice. The underlying platform is invisible.",
        },
        {
          title: "Deliver more volume with leaner teams",
          desc: "VoiceIQ handles the call volume that previously required headcount. Your team focuses on strategy, scripts, and results — not dialling.",
        },
        {
          title: "Per-client performance reporting",
          desc: "Generate client-facing reports showing call volume, qualification rate, and pipeline contribution — demonstrable ROI at every review.",
        },
        {
          title: "Expand your service offering",
          desc: "AI voice outreach is a category clients want but can't access on their own. VoiceIQ lets you offer it as a premium tier above traditional email/SDR services.",
        },
      ],
      workflow: [
        { step: "Onboard a new client", desc: "Create a client workspace, configure their voice persona, and load their contact list." },
        { step: "Build and launch their campaign", desc: "Write the qualification script with the client, configure targeting, and launch." },
        { step: "Monitor and optimise", desc: "Use analytics to identify performance gaps and iterate on scripts each week." },
        { step: "Report results", desc: "Share client-facing dashboards or export reports showing pipeline generated and ROI." },
      ],
      whyItMatters:
        "The agencies that win the next decade of sales outsourcing will be the ones that deliver more results with leaner operations. VoiceIQ is the infrastructure that makes that possible — and the differentiation it creates is not easy for competitors to replicate quickly.",
    },
  },
  {
    slug: "service-businesses",
    icon: "🛍️",
    title: "Service Businesses",
    desc: "Follow up with every inbound lead within minutes. Stop losing customers to slow or missing responses.",
    expanded: {
      forWho: "Local and online service businesses — home services, IT, legal, medical, cleaning, landscaping, and beyond.",
      problem:
        "Every missed follow-up is a lost booking. Service businesses lose clients to slow response times and forgotten callbacks every single day.",
      useCases: [
        "Immediately follow up on inbound inquiry forms",
        "Re-engage past clients who haven't booked recently",
        "Confirm upcoming service appointments",
        "Qualify inbound leads by job size, budget, and location",
      ],
      outcome:
        "No lead goes cold. Every inquiry gets a professional, consistent response within minutes — without growing your team.",
    },
    detail: {
      intro:
        "Service businesses compete on speed and reliability. VoiceIQ gives you the ability to respond to every inbound lead instantly, qualify them for fit, and confirm appointments — all without adding staff or changing how your team works.",
      benefits: [
        {
          title: "Instant response to every lead",
          desc: "When a prospect fills out a form or calls after hours, VoiceIQ can follow up within minutes — before they contact your competitor.",
        },
        {
          title: "Qualify by job type, budget, and location",
          desc: "Not every lead is right for your business. VoiceIQ asks the questions that screen for fit before your team invests time in a quote or visit.",
        },
        {
          title: "Appointment confirmation that reduces no-shows",
          desc: "Automatic confirmation calls before every booking cut no-show rates and give you time to fill cancelled slots.",
        },
        {
          title: "Win-back campaigns for lapsed clients",
          desc: "Re-engage customers who haven't booked in 6 or 12 months. A well-timed call often brings them back before they've moved on permanently.",
        },
        {
          title: "Professional voice, every time",
          desc: "Your AI rep delivers a consistent, professional tone on every call — even at 11pm, even on weekends, even during your busiest season.",
        },
      ],
      workflow: [
        { step: "Connect your lead source", desc: "Sync from your website form, CRM, or booking system. VoiceIQ calls new leads automatically when they come in." },
        { step: "AI qualifies and confirms", desc: "The agent asks your key questions, confirms availability, and captures contact details." },
        { step: "Qualified leads reach your team", desc: "Pre-screened leads are sent to the right team member with full call context." },
        { step: "Reminders run automatically", desc: "Scheduled jobs get confirmation calls without anyone on your team lifting a finger." },
      ],
      whyItMatters:
        "Response speed is the primary conversion driver for service businesses. Studies consistently show that leads contacted within five minutes convert at dramatically higher rates than those contacted an hour later. VoiceIQ makes five-minute response standard on every lead, every time.",
    },
  },
  {
    slug: "multilingual-teams",
    icon: "🌍",
    title: "Multilingual Teams",
    desc: "Call in English, German, French, Spanish, and more. One platform. Every market.",
    expanded: {
      forWho: "International businesses, European sales teams, and companies expanding outbound into multiple language regions.",
      problem:
        "Hiring native-speaking SDRs for each market is expensive, slow, and hard to manage. Language barriers cap how fast you can expand.",
      useCases: [
        "English and German campaigns from the same dashboard",
        "French and Spanish outreach without a local rep",
        "Arabic-language qualification for MENA markets",
        "Consistent qualification scripts adapted per language",
      ],
      outcome:
        "Enter new language markets in hours, not months — with the same workflow, quality, and visibility across all of them.",
    },
    detail: {
      intro:
        "Outbound expansion into new language markets used to mean hiring local sales talent and rebuilding your operation from scratch. VoiceIQ removes that constraint — one platform, multiple languages, the same analytics and controls across every market.",
      benefits: [
        {
          title: "Native-quality voice in every language",
          desc: "VoiceIQ's AI voices are fluent and natural across English, German, French, Spanish, Arabic, and more — not translated, purpose-built per language.",
        },
        {
          title: "One platform across all markets",
          desc: "Run campaigns in five languages from the same dashboard. Track performance, manage scripts, and review transcripts — unified across all regions.",
        },
        {
          title: "Localised without localised headcount",
          desc: "You don't need a German SDR to run a German campaign. VoiceIQ handles the language; your team handles the strategy.",
        },
        {
          title: "Consistent qualification across languages",
          desc: "Your qualification criteria apply uniformly across every language and market. Pipeline quality stays consistent as you expand.",
        },
        {
          title: "Rapid market testing",
          desc: "Launch a small campaign in a new language market to test demand — before committing to hiring, localisation, or regional infrastructure.",
        },
      ],
      workflow: [
        { step: "Select your language", desc: "Choose the language and voice for your campaign. Multiple languages can run simultaneously." },
        { step: "Build your localised script", desc: "Translate or write your qualification script in the target language. VoiceIQ handles pronunciation and natural delivery." },
        { step: "Launch and monitor", desc: "Run the campaign and track performance per language — connection rates, qualification rates, and objection patterns." },
        { step: "Expand what works", desc: "Scale the campaigns that perform and retire the ones that don't — all within the same interface." },
      ],
      whyItMatters:
        "International expansion is one of the highest-leverage growth moves for a scaling business. The language barrier has always been the biggest friction point in making it happen quickly. VoiceIQ removes that friction — letting a team of two run outbound in five countries as easily as one.",
    },
  },
];
