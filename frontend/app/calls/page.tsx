"use client";

import { useState } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useCalls } from "@/hooks/useCalls";
import CallTable from "@/components/calls/CallTable";
import AppShell from "@/components/layout/AppShell";

export default function CallsPage() {
  const { campaigns, isLoading: campaignsLoading } = useCampaigns();
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | undefined>();
  const { calls, isLoading, refresh } = useCalls(selectedCampaignId);

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Calls</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor call history and transcripts</p>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-400">Filter by campaign</label>
        {campaignsLoading ? (
          <div className="h-9 w-64 animate-pulse rounded-lg bg-white/[0.06]" />
        ) : (
          <select
            className="rounded-lg border border-white/10 bg-white/5 text-slate-300 px-3 py-2 text-sm focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
            value={selectedCampaignId ?? ""}
            onChange={(e) => setSelectedCampaignId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="" className="bg-[#0d0d14]">All campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0d0d14]">{c.name}</option>
            ))}
          </select>
        )}
      </div>

      <CallTable calls={calls} isLoading={isLoading} onRefresh={refresh} />
    </AppShell>
  );
}
