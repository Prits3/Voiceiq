// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// ─── Campaign ─────────────────────────────────────────────────────────────────

export type CampaignStatus = "draft" | "active" | "paused" | "completed";

export interface Campaign {
  id: number;
  name: string;
  user_id: number;
  status: CampaignStatus;
  script: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignCreate {
  name: string;
  script?: string;
  status?: CampaignStatus;
}

export interface CampaignUpdate {
  name?: string;
  script?: string;
  status?: CampaignStatus;
}

export interface CampaignStats {
  total_leads: number;
  pending_leads: number;
  converted_leads: number;
  total_calls: number;
  completed_calls: number;
  failed_calls: number;
  conversion_rate: number;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export type LeadStatus = "pending" | "called" | "converted" | "do_not_call";

export interface Lead {
  id: number;
  campaign_id: number;
  first_name: string;
  last_name: string | null;
  phone_number: string;
  email: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface LeadCreate {
  campaign_id: number;
  first_name: string;
  last_name?: string;
  phone_number: string;
  email?: string;
  status?: LeadStatus;
}

export interface LeadUpdate {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  status?: LeadStatus;
}

// ─── Call ─────────────────────────────────────────────────────────────────────

export type CallStatus = "pending" | "in_progress" | "completed" | "failed";

export interface Call {
  id: number;
  lead_id: number;
  campaign_id: number;
  status: CallStatus;
  duration: number | null;
  recording_url: string | null;
  transcript: string | null;
  twilio_call_sid: string | null;
  created_at: string;
}

export interface CallCreate {
  lead_id: number;
  campaign_id: number;
}

// ─── Phone Number ─────────────────────────────────────────────────────────────

export interface PhoneNumber {
  id: number;
  user_id: number;
  number: string;
  twilio_sid: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PhoneNumberCreate {
  number: string;
  twilio_sid?: string;
  is_active?: boolean;
}

// ─── Voice Profile ────────────────────────────────────────────────────────────

export type VoiceProvider = "elevenlabs" | "openai";

export interface VoiceProfile {
  id: number;
  user_id: number;
  name: string;
  provider: VoiceProvider;
  voice_id: string;
  settings: Record<string, unknown> | null;
  created_at: string;
}

export interface VoiceProfileCreate {
  name: string;
  provider: VoiceProvider;
  voice_id: string;
  settings?: Record<string, unknown>;
}

export interface VoiceProfileUpdate {
  name?: string;
  provider?: VoiceProvider;
  voice_id?: string;
  settings?: Record<string, unknown>;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string;
}
