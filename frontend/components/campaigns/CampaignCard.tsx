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
    <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-white/12">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            href={`/campaigns/${campaign.id}`}
            className="text-sm font-semibold text-white hover:text-violet-300 transition-colors"
          >
            {campaign.name}
          </Link>
          <p className="mt-0.5 text-xs text-slate-600">
            Created {formatDate(campaign.created_at)}
          </p>
        </div>
        <CampaignStatusBadge status={campaign.status} />
      </div>

      {campaign.script && (
        <p className="text-xs text-slate-500 leading-relaxed">{truncate(campaign.script, 120)}</p>
      )}

      <div className="mt-auto flex items-center justify-between pt-2">
        <Link href={`/campaigns/${campaign.id}`}>
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300"
            onClick={() => onDelete(campaign)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
