"use client";

import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { VoiceProfile } from "@/types";

interface VoiceProfileCardProps {
  profile: VoiceProfile;
  onEdit?: (profile: VoiceProfile) => void;
  onDelete?: (profile: VoiceProfile) => void;
}

const providerLabels: Record<string, string> = {
  elevenlabs: "ElevenLabs",
  openai: "OpenAI",
};

export default function VoiceProfileCard({ profile, onEdit, onDelete }: VoiceProfileCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-white/12">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-white text-sm">{profile.name}</h3>
          <p className="mt-0.5 text-xs text-slate-600">
            Created {formatDate(profile.created_at)}
          </p>
        </div>
        <Badge variant="purple">{providerLabels[profile.provider] ?? profile.provider}</Badge>
      </div>

      <div className="rounded-lg bg-white/[0.03] border border-white/6 px-3 py-2">
        <p className="text-xs text-slate-600 mb-0.5">Voice ID</p>
        <p className="font-mono text-xs text-slate-400 truncate">{profile.voice_id}</p>
      </div>

      {profile.settings && Object.keys(profile.settings).length > 0 && (
        <div className="rounded-lg bg-white/[0.03] border border-white/6 px-3 py-2">
          <p className="text-xs text-slate-600 mb-1">Settings</p>
          <pre className="text-xs text-slate-500 overflow-x-auto">
            {JSON.stringify(profile.settings, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-auto flex items-center gap-2 pt-2">
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(profile)}>Edit</Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300"
            onClick={() => onDelete(profile)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
