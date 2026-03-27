"use client";

import { useCallback, useEffect, useState } from "react";
import { callsApi } from "@/lib/api";
import type { Call, CallCreate } from "@/types";

interface UseCallsReturn {
  calls: Call[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  initiateCall: (data: CallCreate) => Promise<Call>;
  stopCall: (id: number) => Promise<Call>;
}

export function useCalls(campaignId?: number): UseCallsReturn {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalls = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await callsApi.list(campaignId);
      setCalls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch calls");
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const initiateCall = useCallback(async (data: CallCreate): Promise<Call> => {
    const call = await callsApi.initiate(data);
    setCalls((prev) => [call, ...prev]);
    return call;
  }, []);

  const stopCall = useCallback(async (id: number): Promise<Call> => {
    const updated = await callsApi.stop(id);
    setCalls((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  return {
    calls,
    isLoading,
    error,
    refresh: fetchCalls,
    initiateCall,
    stopCall,
  };
}
