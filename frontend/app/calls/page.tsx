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
        <h1 className="text-2xl font-bold text-gray-900">Calls</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor call history and transcripts
        </p>
      </div>

      {/* Campaign filter */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Filter by campaign
        </label>
        {campaignsLoading ? (
          <div className="h-9 w-64 animate-pulse rounded-md bg-gray-100" />
        ) : (
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={selectedCampaignId ?? ""}
            onChange={(e) =>
              setSelectedCampaignId(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <option value="">All campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <CallTable calls={calls} isLoading={isLoading} onRefresh={refresh} />
    </AppShell>
  );
}
