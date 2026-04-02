"use client";

import { useEffect, useState } from "react";
import { phoneNumbersApi } from "@/lib/api";
import PhoneNumberTable from "@/components/numbers/PhoneNumberTable";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { PhoneNumber } from "@/types";
import AppShell from "@/components/layout/AppShell";

export default function NumbersPage() {
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newSid, setNewSid] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await phoneNumbersApi.list();
      setNumbers(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load phone numbers");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);
    setIsAdding(true);
    try {
      await phoneNumbersApi.create({ number: newNumber, twilio_sid: newSid || undefined });
      setShowAdd(false);
      setNewNumber("");
      setNewSid("");
      load();
    } catch (e: unknown) {
      setAddError(e instanceof Error ? e.message : "Failed to add number");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Phone Numbers</h1>
          <p className="mt-1 text-sm text-slate-500">Manage Twilio phone numbers for outbound calls</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>+ Add Number</Button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <PhoneNumberTable numbers={numbers} isLoading={isLoading} onRefresh={load} />

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Phone Number">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Phone Number"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="+15551234567"
            required
          />
          <Input
            label="Twilio SID (optional)"
            value={newSid}
            onChange={(e) => setNewSid(e.target.value)}
            placeholder="PNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          />
          {addError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
              <p className="text-sm text-red-400">{addError}</p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" type="button" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" isLoading={isAdding}>Add Number</Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
