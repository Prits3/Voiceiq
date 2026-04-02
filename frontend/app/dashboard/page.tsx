"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { campaignsApi, leadsApi, callsApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Stats {
  campaigns: number;
  leads: number;
  calls: number;
  activeCampaigns: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [campaigns, leads, calls] = await Promise.all([
          campaignsApi.list(),
          leadsApi.list(),
          callsApi.list(),
        ]);
        setStats({
          campaigns: campaigns.length,
          leads: leads.length,
          calls: calls.length,
          activeCampaigns: campaigns.filter((c) => c.status === "active").length,
        });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    { label: "Campaigns", value: stats?.campaigns, href: "/campaigns", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
    { label: "Active Now", value: stats?.activeCampaigns, href: "/campaigns", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
    { label: "Leads", value: stats?.leads, href: "/leads", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
    { label: "Calls", value: stats?.calls, href: "/calls", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10 border-fuchsia-500/20" },
  ];

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your VoiceIQ platform</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map(({ label, value, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-white/14"
          >
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse rounded-lg bg-white/[0.06]" />
            ) : (
              <span className={cn("inline-block w-fit rounded-lg border px-2.5 py-1 text-2xl font-bold", bg, color)}>
                {value ?? 0}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickLink
          href="/campaigns"
          title="Campaigns"
          description="Create and manage outbound calling campaigns"
          icon="📣"
        />
        <QuickLink
          href="/leads"
          title="Leads"
          description="Import leads via CSV or manage individually"
          icon="👥"
        />
        <QuickLink
          href="/voices"
          title="Voice Profiles"
          description="Configure AI voices for your campaigns"
          icon="🎙️"
        />
      </div>
    </AppShell>
  );
}

function QuickLink({ href, title, description, icon }: { href: string; title: string; description: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 rounded-xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-white/14"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold text-white text-sm">{title}</span>
      <span className="text-xs text-slate-500 leading-relaxed">{description}</span>
    </Link>
  );
}
