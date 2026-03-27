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

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as CampaignStatus)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="script">
          Script / Talking Points
        </label>
        <textarea
          id="script"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={6}
          placeholder="Enter the call script or key talking points for the AI agent..."
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
