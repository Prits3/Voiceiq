"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import type { Lead } from "@/types";

interface LeadImportProps {
  campaignId: number;
  onImport: (campaignId: number, file: File) => Promise<Lead[]>;
  onSuccess?: (leads: Lead[]) => void;
}

export default function LeadImport({ campaignId, onImport, onSuccess }: LeadImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ count: number } | null>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file.");
      return;
    }
    setError(null);
    setResult(null);
    setIsUploading(true);
    try {
      const leads = await onImport(campaignId, file);
      setResult({ count: leads.length });
      onSuccess?.(leads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
          isDragging
            ? "border-violet-500/50 bg-violet-500/10"
            : "border-white/10 bg-white/[0.02] hover:border-violet-500/30 hover:bg-white/[0.04]"
        }`}
      >
        <svg
          className="mb-2 h-8 w-8 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm font-medium text-slate-300">
          Drop a CSV file here, or{" "}
          <span className="text-violet-400">click to browse</span>
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Required columns: first_name, phone_number. Optional: last_name, email
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {isUploading && (
        <p className="text-sm text-violet-400">Uploading and importing leads...</p>
      )}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3.5 py-2.5">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {result && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-3.5 py-2.5">
          <p className="text-sm text-green-400">
            Successfully imported {result.count} lead{result.count !== 1 ? "s" : ""}.
          </p>
        </div>
      )}
    </div>
  );
}
