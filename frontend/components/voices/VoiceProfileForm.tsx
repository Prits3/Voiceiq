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
        <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Voice"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Provider</label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as VoiceProvider)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          required
        >
          <option value="elevenlabs">ElevenLabs</option>
          <option value="openai">OpenAI</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Voice ID</label>
        <Input
          value={voiceId}
          onChange={(e) => setVoiceId(e.target.value)}
          placeholder={
            provider === "elevenlabs" ? "21m00Tcm4TlvDq8ikWAM" : "alloy"
          }
          required
        />
        <p className="mt-1 text-xs text-gray-400">
          {provider === "elevenlabs"
            ? "ElevenLabs voice ID from your account"
            : "OpenAI TTS voice: alloy, echo, fable, onyx, nova, or shimmer"}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Settings <span className="text-gray-400">(optional JSON)</span>
        </label>
        <textarea
          value={settingsJson}
          onChange={(e) => setSettingsJson(e.target.value)}
          placeholder={'{\n  "stability": 0.5,\n  "similarity_boost": 0.75\n}'}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
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
