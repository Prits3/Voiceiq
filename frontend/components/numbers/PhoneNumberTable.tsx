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

export default function PhoneNumberTable({
  numbers,
  isLoading,
  onRefresh,
}: PhoneNumberTableProps) {
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
          <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (numbers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
        <p className="text-gray-500">No phone numbers added yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Number
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Twilio SID
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                Added
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {numbers.map((num) => (
              <tr key={num.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-medium text-gray-900">
                  {formatPhone(num.number)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                  {num.twilio_sid ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={num.is_active ? "success" : "default"}>
                    {num.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {formatDate(num.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
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

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove Phone Number"
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to remove{" "}
          <span className="font-semibold font-mono">
            {deleteTarget && formatPhone(deleteTarget.number)}
          </span>
          ?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
            Remove
          </Button>
        </div>
      </Modal>
    </>
  );
}
