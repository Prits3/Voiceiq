"use client";

import { useState } from "react";
import { campaignsApi } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { Campaign, CampaignStatus } from "@/types";

interface CampaignFormProps {
  campaign?: Campaign;
  onSuccess: (campaign: Campaign) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const STATUS_OPTIONS: CampaignStatus[] = ["draft", "active", "paused", "completed"];

export default function CampaignForm({
  campaign,
  onSuccess,
  onCancel,
  submitLabel = "Save",
}: CampaignFormProps) {
  const [name, setName] = useState(campaign?.name ?? "");
  const [script, setScript] = useState(campaign?.script ?? "");
  const [status, setStatus] = useState<CampaignStatus>(campaign?.status ?? "draft");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Campaign name is required.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const data = { name: name.trim(), script: script.trim() || undefined, status };
      const result = campaign
        ? await campaignsApi.update(campaign.id, data)
        : await campaignsApi.create(data);
      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Campaign Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Q2 Outreach"
        required
        error={!name.trim() && error ? "Name is required" : undefined}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-300" htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as CampaignStatus)}
          className="block w-full rounded-lg bg-white/5 border border-white/10 text-slate-300 px-3.5 py-2.5 text-sm focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-[#0d0d14]">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-300" htmlFor="script">Script / Talking Points</label>
        <textarea
          id="script"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={6}
          placeholder="Enter the call script or key talking points for the AI agent..."
          className="block w-full rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-600 px-3.5 py-2.5 text-sm focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none transition-colors"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3.5 py-2.5">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
