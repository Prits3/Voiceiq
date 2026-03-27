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
      <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4">
        <div>
          <p className="text-xs text-gray-400">Status</p>
          <CallStatusBadge status={call.status} />
        </div>
        <div>
          <p className="text-xs text-gray-400">Duration</p>
          <p className="font-medium text-gray-800">
            {call.duration != null ? formatDuration(call.duration) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Date</p>
          <p className="font-medium text-gray-800">{formatDate(call.created_at)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Twilio SID</p>
          <p className="font-mono text-xs text-gray-600 truncate">
            {call.twilio_call_sid ?? "—"}
          </p>
        </div>
      </div>

      {/* Recording */}
      {call.recording_url && (
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
            Recording
          </p>
          <audio controls src={call.recording_url} className="w-full rounded-md" />
        </div>
      )}

      {/* Transcript */}
      {call.transcript ? (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            Transcript
          </p>
          <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {call.transcript}
          </div>
        </div>
      ) : (
        <p className="text-gray-400 italic">No transcript available.</p>
      )}
    </div>
  );
}
