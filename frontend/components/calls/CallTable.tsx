"use client";

import { useState } from "react";
import { CallStatusBadge } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import CallDetails from "@/components/calls/CallDetails";
import { formatDate, formatDuration } from "@/lib/utils";
import type { Call } from "@/types";

interface CallTableProps {
  calls: Call[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function CallTable({ calls, isLoading, onRefresh }: CallTableProps) {
  const [selected, setSelected] = useState<Call | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
        <p className="text-gray-500">No calls recorded yet.</p>
        <Button variant="ghost" size="sm" className="mt-2" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Duration</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Transcript</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {calls.map((call) => (
              <tr key={call.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">#{call.id}</td>
                <td className="px-4 py-3">
                  <CallStatusBadge status={call.status} />
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {call.duration != null ? formatDuration(call.duration) : "—"}
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(call.created_at)}</td>
                <td className="px-4 py-3 text-gray-500">
                  {call.transcript ? (
                    <span className="max-w-xs truncate block">
                      {call.transcript.slice(0, 60)}…
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelected(call)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Call #${selected?.id}`}
      >
        {selected && <CallDetails call={selected} />}
      </Modal>
    </>
  );
}
