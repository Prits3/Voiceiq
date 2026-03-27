"use client";

import { useCallback, useEffect, useState } from "react";
import { leadsApi } from "@/lib/api";
import type { Lead, LeadCreate, LeadUpdate } from "@/types";

interface UseLeadsReturn {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createLead: (data: LeadCreate) => Promise<Lead>;
  updateLead: (id: number, data: LeadUpdate) => Promise<Lead>;
  deleteLead: (id: number) => Promise<void>;
  importCsv: (campaignId: number, file: File) => Promise<Lead[]>;
}

export function useLeads(campaignId: number | undefined): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    if (campaignId === undefined) {
      setLeads([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await leadsApi.list(campaignId);
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const createLead = useCallback(async (data: LeadCreate): Promise<Lead> => {
    const lead = await leadsApi.create(data);
    setLeads((prev) => [lead, ...prev]);
    return lead;
  }, []);

  const updateLead = useCallback(async (id: number, data: LeadUpdate): Promise<Lead> => {
    const updated = await leadsApi.update(id, data);
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    return updated;
  }, []);

  const deleteLead = useCallback(async (id: number): Promise<void> => {
    await leadsApi.delete(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const importCsv = useCallback(async (cId: number, file: File): Promise<Lead[]> => {
    const imported = await leadsApi.importCsv(cId, file);
    setLeads((prev) => [...imported, ...prev]);
    return imported;
  }, []);

  return {
    leads,
    isLoading,
    error,
    refresh: fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    importCsv,
  };
}
