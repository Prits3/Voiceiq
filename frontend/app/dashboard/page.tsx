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
    { label: "Campaigns", value: stats?.campaigns, href: "/campaigns", color: "bg-indigo-50 text-indigo-700" },
    { label: "Active", value: stats?.activeCampaigns, href: "/campaigns", color: "bg-green-50 text-green-700" },
    { label: "Leads", value: stats?.leads, href: "/leads", color: "bg-amber-50 text-amber-700" },
    { label: "Calls", value: stats?.calls, href: "/calls", color: "bg-sky-50 text-sky-700" },
  ];

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your VoiceIQ platform</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map(({ label, value, href, color }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <span className="text-sm font-medium text-gray-500">{label}</span>
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse rounded bg-gray-100" />
            ) : (
              <span className={cn("inline-block w-fit rounded-lg px-2 py-0.5 text-2xl font-bold", color)}>
                {value ?? 0}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickLink href="/campaigns" title="Campaigns" description="Create and manage outbound calling campaigns" />
        <QuickLink href="/leads" title="Leads" description="Import leads via CSV or manage individually" />
        <QuickLink href="/voices" title="Voice Profiles" description="Configure ElevenLabs or OpenAI TTS voices" />
      </div>
    </AppShell>
  );
}

function QuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-indigo-200"
    >
      <span className="font-semibold text-gray-900">{title}</span>
      <span className="text-sm text-gray-500">{description}</span>
    </Link>
  );
}
