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
  const { leads, isLoading: leadsLoading, refresh, importCsv } = useLeads(selectedCampaignId ?? undefined);
  const [showImport, setShowImport] = useState(false);

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="mt-1 text-sm text-slate-500">View and manage leads across campaigns</p>
        </div>
        {selectedCampaignId && (
          <Button onClick={() => setShowImport(true)}>Import CSV</Button>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-400">Filter by campaign</label>
        {campaignsLoading ? (
          <div className="h-9 w-64 animate-pulse rounded-lg bg-white/[0.06]" />
        ) : (
          <select
            className="rounded-lg border border-white/10 bg-white/5 text-slate-300 px-3 py-2 text-sm focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
            value={selectedCampaignId ?? ""}
            onChange={(e) => setSelectedCampaignId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="" className="bg-[#0d0d14]">All campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0d0d14]">{c.name}</option>
            ))}
          </select>
        )}
      </div>

      <LeadTable leads={leads} isLoading={leadsLoading} onRefresh={refresh} />

      <Modal isOpen={showImport} onClose={() => setShowImport(false)} title="Import Leads">
        <LeadImport
          campaignId={selectedCampaignId!}
          onImport={importCsv}
          onSuccess={() => { setShowImport(false); void refresh(); }}
        />
      </Modal>
    </AppShell>
  );
}
