"use client";

import { CallStatusBadge } from "@/components/ui/Badge";
import { formatDate, formatDuration } from "@/lib/utils";
import type { Call } from "@/types";

interface CallDetailsProps {
  call: Call;
}

export default function CallDetails({ call }: CallDetailsProps) {
  return (
    <div className="space-y-4 text-sm">
      {/* Meta */}
      <div className="grid grid-cols-2 gap-3 rounded-xl bg-white/[0.03] border border-white/8 p-4">
        <div>
          <p className="text-xs text-slate-600 mb-1">Status</p>
          <CallStatusBadge status={call.status} />
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Duration</p>
          <p className="font-medium text-slate-300">
            {call.duration != null ? formatDuration(call.duration) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Date</p>
          <p className="font-medium text-slate-300">{formatDate(call.created_at)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Twilio SID</p>
          <p className="font-mono text-xs text-slate-500 truncate">
            {call.twilio_call_sid ?? "—"}
          </p>
        </div>
      </div>

      {/* Recording */}
      {call.recording_url && (
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">Recording</p>
          <audio controls src={call.recording_url} className="w-full rounded-lg" />
        </div>
      )}

      {/* Transcript */}
      {call.transcript ? (
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">Transcript</p>
          <div className="max-h-72 overflow-y-auto rounded-xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-400 whitespace-pre-wrap">
            {call.transcript}
          </div>
        </div>
      ) : (
        <p className="text-slate-600 italic text-sm">No transcript available.</p>
      )}
    </div>
  );
}
