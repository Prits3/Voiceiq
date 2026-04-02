"use client";

import { useState } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
import CampaignCard from "@/components/campaigns/CampaignCard";
import CampaignForm from "@/components/campaigns/CampaignForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import AppShell from "@/components/layout/AppShell";
import type { Campaign } from "@/types";

export default function CampaignsPage() {
  const { campaigns, isLoading, error, deleteCampaign, refresh } = useCampaigns();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCampaign(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your outbound calling campaigns</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ New Campaign</Button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-white/[0.04]" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/8 py-20 text-center">
          <p className="text-slate-500 text-sm">No campaigns yet.</p>
          <Button variant="outline" className="mt-4" onClick={() => setShowCreate(true)}>
            Create your first campaign
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Campaign">
        <CampaignForm
          onSuccess={() => { setShowCreate(false); void refresh(); }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Campaign">
        <p className="text-sm text-slate-400">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">{deleteTarget?.name}</span>? This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </AppShell>
  );
}
