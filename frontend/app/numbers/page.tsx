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
      await phoneNumbersApi.create({
        number: newNumber,
        twilio_sid: newSid || undefined,
      });
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
          <h1 className="text-2xl font-bold text-gray-900">Phone Numbers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage Twilio phone numbers for outbound calls
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>+ Add Number</Button>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <PhoneNumberTable numbers={numbers} isLoading={isLoading} onRefresh={load} />

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Phone Number">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              placeholder="+15551234567"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Twilio SID <span className="text-gray-400">(optional)</span>
            </label>
            <Input
              value={newSid}
              onChange={(e) => setNewSid(e.target.value)}
              placeholder="PNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>
          {addError && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {addError}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isAdding}>
              Add Number
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
