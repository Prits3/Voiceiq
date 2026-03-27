"use client";

import Link from "next/link";
import { CampaignStatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatDate, truncate } from "@/lib/utils";
import type { Campaign } from "@/types";

interface CampaignCardProps {
  campaign: Campaign;
  onDelete?: (campaign: Campaign) => void;
}

export default function CampaignCard({ campaign, onDelete }: CampaignCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            href={`/campaigns/${campaign.id}`}
            className="text-base font-semibold text-gray-900 hover:text-indigo-600"
          >
            {campaign.name}
          </Link>
          <p className="mt-0.5 text-xs text-gray-400">
            Created {formatDate(campaign.created_at)}
          </p>
        </div>
        <CampaignStatusBadge status={campaign.status} />
      </div>

      {/* Script preview */}
      {campaign.script && (
        <p className="text-sm text-gray-500">{truncate(campaign.script, 120)}</p>
      )}

      {/* Actions */}
      <div className="mt-auto flex items-center justify-between pt-2">
        <Link href={`/campaigns/${campaign.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={() => onDelete(campaign)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
