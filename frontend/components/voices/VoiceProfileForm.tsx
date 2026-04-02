"use client";

import { useState } from "react";
import { voicesApi } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { VoiceProfile, VoiceProvider } from "@/types";

interface VoiceProfileFormProps {
  profile?: VoiceProfile;
  onSuccess: (profile: VoiceProfile) => void;
  onCancel: () => void;
}

export default function VoiceProfileForm({
  profile,
  onSuccess,
  onCancel,
}: VoiceProfileFormProps) {
  const [name, setName] = useState(profile?.name ?? "");
  const [provider, setProvider] = useState<VoiceProvider>(
    profile?.provider ?? "elevenlabs"
  );
  const [voiceId, setVoiceId] = useState(profile?.voice_id ?? "");
  const [settingsJson, setSettingsJson] = useState(
    profile?.settings ? JSON.stringify(profile.settings, null, 2) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let settings: Record<string, unknown> | undefined;
    if (settingsJson.trim()) {
      try {
        settings = JSON.parse(settingsJson);
      } catch {
        setError("Settings must be valid JSON");
        return;
      }
    }

    setIsLoading(true);
    try {
      let result: VoiceProfile;
      if (profile) {
        result = await voicesApi.update(profile.id, { name, provider, voice_id: voiceId, settings });
      } else {
        result = await voicesApi.create({ name, provider, voice_id: voiceId, settings });
      }
      onSuccess(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save voice profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Voice"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">Provider</label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as VoiceProvider)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-slate-300 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-colors"
          required
        >
          <option value="elevenlabs" className="bg-[#0d0d14]">ElevenLabs</option>
          <option value="openai" className="bg-[#0d0d14]">OpenAI</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">Voice ID</label>
        <Input
          value={voiceId}
          onChange={(e) => setVoiceId(e.target.value)}
          placeholder={
            provider === "elevenlabs" ? "21m00Tcm4TlvDq8ikWAM" : "nova"
          }
          required
        />
        <p className="mt-1 text-xs text-slate-600">
          {provider === "elevenlabs"
            ? "ElevenLabs voice ID from your account"
            : "Most natural-sounding: nova or shimmer. Others: alloy, echo, fable, onyx"}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">
          Settings <span className="text-slate-600">(optional JSON)</span>
        </label>
        <textarea
          value={settingsJson}
          onChange={(e) => setSettingsJson(e.target.value)}
          placeholder={'{\n  "stability": 0.3,\n  "similarity_boost": 0.85,\n  "style": 0.45,\n  "use_speaker_boost": true\n}'}
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 font-mono text-sm text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none transition-colors"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3.5 py-2.5">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {profile ? "Save Changes" : "Create Profile"}
        </Button>
      </div>
    </form>
  );
}
