import type {
  Call,
  CallCreate,
  Campaign,
  CampaignCreate,
  CampaignUpdate,
  Lead,
  LeadCreate,
  LeadUpdate,
  PhoneNumber,
  PhoneNumberCreate,
  Token,
  User,
  VoiceProfile,
  VoiceProfileCreate,
  VoiceProfileUpdate,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      detail = err.detail ?? detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  // 204 No Content
  if (response.status === 204) return undefined as unknown as T;

  return response.json() as Promise<T>;
}

async function multipartRequest<T>(
  path: string,
  formData: FormData
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      detail = err.detail ?? detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const authApi = {
  register: (email: string, password: string) =>
    request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string): Promise<Token> =>
    request<Token>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<User>("/auth/me"),
};

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

export const campaignsApi = {
  list: (skip = 0, limit = 50) =>
    request<Campaign[]>(`/campaigns/?skip=${skip}&limit=${limit}`),

  get: (id: number) => request<Campaign>(`/campaigns/${id}`),

  create: (data: CampaignCreate) =>
    request<Campaign>("/campaigns/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: CampaignUpdate) =>
    request<Campaign>(`/campaigns/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/campaigns/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export const leadsApi = {
  list: (campaignId?: number, skip = 0, limit = 100) => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    if (campaignId !== undefined) params.set("campaign_id", String(campaignId));
    return request<Lead[]>(`/leads/?${params}`);
  },

  get: (id: number) => request<Lead>(`/leads/${id}`),

  create: (data: LeadCreate) =>
    request<Lead>("/leads/", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: LeadUpdate) =>
    request<Lead>(`/leads/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) =>
    request<void>(`/leads/${id}`, { method: "DELETE" }),

  importCsv: (campaignId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return multipartRequest<Lead[]>(`/leads/import?campaign_id=${campaignId}`, formData);
  },
};

// ---------------------------------------------------------------------------
// Calls
// ---------------------------------------------------------------------------

export const callsApi = {
  list: (campaignId?: number, skip = 0, limit = 100) => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    if (campaignId) params.set("campaign_id", String(campaignId));
    return request<Call[]>(`/calls/?${params}`);
  },

  get: (id: number) => request<Call>(`/calls/${id}`),

  initiate: (data: CallCreate) =>
    request<Call>("/calls/initiate", { method: "POST", body: JSON.stringify(data) }),

  stop: (id: number) =>
    request<Call>(`/calls/${id}/stop`, { method: "POST" }),
};

// ---------------------------------------------------------------------------
// Phone Numbers
// ---------------------------------------------------------------------------

export const phoneNumbersApi = {
  list: () => request<PhoneNumber[]>("/phone-numbers/"),

  get: (id: number) => request<PhoneNumber>(`/phone-numbers/${id}`),

  create: (data: PhoneNumberCreate) =>
    request<PhoneNumber>("/phone-numbers/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/phone-numbers/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Voice Profiles
// ---------------------------------------------------------------------------

export const voicesApi = {
  list: () => request<VoiceProfile[]>("/voices/"),

  get: (id: number) => request<VoiceProfile>(`/voices/${id}`),

  create: (data: VoiceProfileCreate) =>
    request<VoiceProfile>("/voices/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: VoiceProfileUpdate) =>
    request<VoiceProfile>(`/voices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/voices/${id}`, { method: "DELETE" }),
};
