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
          <div key={i} className="h-12 animate-pulse rounded-lg bg-white/[0.04]" />
        ))}
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/8 py-16 text-center">
        <p className="text-slate-500 text-sm">No calls recorded yet.</p>
        <Button variant="ghost" size="sm" className="mt-2" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
        <table className="min-w-full divide-y divide-white/[0.05] text-sm">
          <thead className="bg-white/[0.03]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Duration</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Transcript</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {calls.map((call) => (
              <tr key={call.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">#{call.id}</td>
                <td className="px-4 py-3">
                  <CallStatusBadge status={call.status} />
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {call.duration != null ? formatDuration(call.duration) : "—"}
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(call.created_at)}</td>
                <td className="px-4 py-3 text-slate-500">
                  {call.transcript ? (
                    <span className="max-w-xs truncate block text-xs">
                      {call.transcript.slice(0, 60)}…
                    </span>
                  ) : (
                    <span className="text-slate-700">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelected(call)}>
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Call #${selected?.id}`}>
        {selected && <CallDetails call={selected} />}
      </Modal>
    </>
  );
}
