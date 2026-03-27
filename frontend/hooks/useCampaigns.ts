"use client";

import { useCallback, useEffect, useState } from "react";
import { campaignsApi } from "@/lib/api";
import type { Campaign, CampaignCreate, CampaignUpdate } from "@/types";

interface UseCampaignsReturn {
  campaigns: Campaign[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createCampaign: (data: CampaignCreate) => Promise<Campaign>;
  updateCampaign: (id: number, data: CampaignUpdate) => Promise<Campaign>;
  deleteCampaign: (id: number) => Promise<void>;
}

export function useCampaigns(): UseCampaignsReturn {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await campaignsApi.list();
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch campaigns");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const createCampaign = useCallback(async (data: CampaignCreate): Promise<Campaign> => {
    const campaign = await campaignsApi.create(data);
    setCampaigns((prev) => [campaign, ...prev]);
    return campaign;
  }, []);

  const updateCampaign = useCallback(
    async (id: number, data: CampaignUpdate): Promise<Campaign> => {
      const updated = await campaignsApi.update(id, data);
      setCampaigns((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    },
    []
  );

  const deleteCampaign = useCallback(async (id: number): Promise<void> => {
    await campaignsApi.delete(id);
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    campaigns,
    isLoading,
    error,
    refresh: fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
}
