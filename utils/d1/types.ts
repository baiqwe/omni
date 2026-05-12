export type D1Customer = {
  id: string;
  user_id: string;
  email: string | null;
  name: string | null;
  credits: number;
  plan_type: string | null;
  subscription_status: string | null;
  creem_customer_id: string | null;
  country: string | null;
  metadata_json: string | null;
  created_at: string;
  updated_at: string;
};

export type D1Generation = {
  id: string;
  user_id: string;
  prompt: string;
  model_id: string;
  generation_type: string;
  status: string;
  status_detail: string | null;
  credits_cost: number;
  resolution: string | null;
  duration_seconds: number | null;
  aspect_ratio: string | null;
  provider: string | null;
  provider_job_id: string | null;
  output_video_url: string | null;
  thumbnail_url: string | null;
  metadata_json: string | null;
  created_at: string;
  updated_at: string;
};
