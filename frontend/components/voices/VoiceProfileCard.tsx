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

export default function VoiceProfileCard({
  profile,
  onEdit,
  onDelete,
}: VoiceProfileCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{profile.name}</h3>
          <p className="mt-0.5 text-xs text-gray-400">
            Created {formatDate(profile.created_at)}
          </p>
        </div>
        <Badge variant="default">{providerLabels[profile.provider] ?? profile.provider}</Badge>
      </div>

      <div className="rounded-md bg-gray-50 px-3 py-2">
        <p className="text-xs text-gray-400">Voice ID</p>
        <p className="font-mono text-xs text-gray-700 truncate">{profile.voice_id}</p>
      </div>

      {profile.settings && Object.keys(profile.settings).length > 0 && (
        <div className="rounded-md bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-400 mb-1">Settings</p>
          <pre className="text-xs text-gray-600 overflow-x-auto">
            {JSON.stringify(profile.settings, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-auto flex items-center gap-2 pt-2">
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(profile)}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={() => onDelete(profile)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
