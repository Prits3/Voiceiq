"use client";

import { useState } from "react";
import { phoneNumbersApi } from "@/lib/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatDate, formatPhone } from "@/lib/utils";
import type { PhoneNumber } from "@/types";

interface PhoneNumberTableProps {
  numbers: PhoneNumber[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function PhoneNumberTable({ numbers, isLoading, onRefresh }: PhoneNumberTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<PhoneNumber | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await phoneNumbersApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-white/[0.04]" />
        ))}
      </div>
    );
  }

  if (numbers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/8 py-16 text-center">
        <p className="text-slate-500 text-sm">No phone numbers added yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
        <table className="min-w-full divide-y divide-white/[0.05] text-sm">
          <thead className="bg-white/[0.03]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Number</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Twilio SID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Added</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {numbers.map((num) => (
              <tr key={num.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-slate-300">{formatPhone(num.number)}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{num.twilio_sid ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={num.is_active ? "success" : "default"}>
                    {num.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(num.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => setDeleteTarget(num)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Phone Number">
        <p className="text-sm text-slate-400">
          Are you sure you want to remove{" "}
          <span className="font-semibold font-mono text-white">
            {deleteTarget && formatPhone(deleteTarget.number)}
          </span>?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>Remove</Button>
        </div>
      </Modal>
    </>
  );
}
