"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { campaignsApi } from "@/lib/api";
import { useLeads } from "@/hooks/useLeads";
import { useCalls } from "@/hooks/useCalls";
import LeadTable from "@/components/leads/LeadTable";
import LeadImport from "@/components/leads/LeadImport";
import CallTable from "@/components/calls/CallTable";
import CampaignForm from "@/components/campaigns/CampaignForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { CampaignStatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Campaign } from "@/types";
import AppShell from "@/components/layout/AppShell";

type Tab = "leads" | "calls" | "settings";

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const campaignId = Number(id);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(true);
  const [tab, setTab] = useState<Tab>("leads");
  const [showImport, setShowImport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const { leads, isLoading: leadsLoading, refresh: refreshLeads, importCsv } = useLeads(campaignId);
  const { calls, isLoading: callsLoading, refresh: refreshCalls } = useCalls(campaignId);

  useEffect(() => {
    campaignsApi
      .get(campaignId)
      .then(setCampaign)
      .catch(() => router.push("/campaigns"))
      .finally(() => setIsLoadingCampaign(false));
  }, [campaignId, router]);

  if (isLoadingCampaign) {
    return (
      <AppShell>
        <div className="h-8 w-64 animate-pulse rounded-lg bg-white/[0.06]" />
      </AppShell>
    );
  }

  if (!campaign) return null;

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
            <CampaignStatusBadge status={campaign.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Created {formatDate(campaign.created_at)}
          </p>
          {campaign.script && (
            <p className="mt-2 max-w-2xl text-sm text-slate-400">{campaign.script}</p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>Edit</Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-white/8">
        {(["leads", "calls", "settings"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "border-b-2 border-violet-500 text-violet-300"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "leads" && (
        <div>
          <div className="mb-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
              Import CSV
            </Button>
          </div>
          <LeadTable leads={leads} isLoading={leadsLoading} onRefresh={refreshLeads} />
        </div>
      )}

      {tab === "calls" && (
        <CallTable calls={calls} isLoading={callsLoading} onRefresh={refreshCalls} />
      )}

      {tab === "settings" && (
        <div className="max-w-xl">
          <CampaignForm
            campaign={campaign}
            onSuccess={(updated) => setCampaign(updated)}
            onCancel={() => setTab("leads")}
          />
        </div>
      )}

      <Modal isOpen={showImport} onClose={() => setShowImport(false)} title="Import Leads">
        <LeadImport
          campaignId={campaignId}
          onImport={importCsv}
          onSuccess={() => { setShowImport(false); void refreshLeads(); }}
        />
      </Modal>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Campaign">
        <CampaignForm
          campaign={campaign}
          onSuccess={(updated) => { setCampaign(updated); setShowEdit(false); }}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>
    </AppShell>
  );
}
