"use client";

import { useState } from "react";
import { voicesApi } from "@/lib/api";
import VoiceProfileCard from "@/components/voices/VoiceProfileCard";
import VoiceProfileForm from "@/components/voices/VoiceProfileForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { VoiceProfile } from "@/types";
import { useEffect } from "react";
import AppShell from "@/components/layout/AppShell";

export default function VoicesPage() {
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<VoiceProfile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VoiceProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function load() {
    try {
      const data = await voicesApi.list();
      setProfiles(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load voices");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await voicesApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voice Profiles</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure AI voice settings for your campaigns
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ New Profile</Button>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="text-gray-500">No voice profiles yet.</p>
          <Button variant="outline" className="mt-4" onClick={() => setShowCreate(true)}>
            Create your first profile
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <VoiceProfileCard
              key={p.id}
              profile={p}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Voice Profile">
        <VoiceProfileForm
          onSuccess={() => { setShowCreate(false); load(); }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Voice Profile">
        <VoiceProfileForm
          profile={editTarget ?? undefined}
          onSuccess={() => { setEditTarget(null); load(); }}
          onCancel={() => setEditTarget(null)}
        />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Voice Profile">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{deleteTarget?.name}</span>?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </AppShell>
  );
}
