"use client";

import { useState } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useLeads } from "@/hooks/useLeads";
import LeadTable from "@/components/leads/LeadTable";
import LeadImport from "@/components/leads/LeadImport";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import AppShell from "@/components/layout/AppShell";

export default function LeadsPage() {
  const { campaigns, isLoading: campaignsLoading } = useCampaigns();
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const { leads, isLoading: leadsLoading, refresh, importCsv } = useLeads(
    selectedCampaignId ?? undefined
  );
  const [showImport, setShowImport] = useState(false);

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage leads across campaigns
          </p>
        </div>
        {selectedCampaignId && (
          <Button onClick={() => setShowImport(true)}>Import CSV</Button>
        )}
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
              setSelectedCampaignId(e.target.value ? Number(e.target.value) : null)
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

      <LeadTable leads={leads} isLoading={leadsLoading} onRefresh={refresh} />

      <Modal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        title="Import Leads"
      >
        <LeadImport
          campaignId={selectedCampaignId!}
          onImport={importCsv}
          onSuccess={() => {
            setShowImport(false);
            void refresh();
          }}
        />
      </Modal>
    </AppShell>
  );
}
