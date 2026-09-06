export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'canceled';
export type PaymentStatus = 'pending' | 'paid' | 'overdue';
export type CleaningType = 'residencial' | 'comercial' | 'ambas';
export type BusinessRole = 'owner' | 'member';

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  phone: string;
  city: string;
  service_area: string;
  cleaning_type: CleaningType;
  created_at: string;
}

export interface BusinessMember {
  id: string;
  business_id: string;
  user_id: string;
  role: BusinessRole;
  created_at: string;
}

export interface Client {
  id: string;
  business_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string;
  lat: number | null;
  lng: number | null;
  notes: string | null;
  created_at: string;
}

export interface Crew {
  id: string;
  business_id: string;
  name: string;
  members: string[];
  active: boolean;
  created_at: string;
}

export interface Job {
  id: string;
  business_id: string;
  client_id: string;
  crew_id: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: JobStatus;
  notes: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  business_id: string;
  job_id: string;
  client_id: string;
  amount_cents: number;
  status: PaymentStatus;
  due_date: string;
  paid_at: string | null;
  created_at: string;
}

// Minimal Supabase Database type. Regenerate with the Supabase CLI
// (`supabase gen types typescript`) once the schema in
// supabase/migrations is applied to a real project, and replace this file.
export interface Database {
  public: {
    Tables: {
      businesses: { Row: Business; Insert: Partial<Business>; Update: Partial<Business> };
      business_members: {
        Row: BusinessMember;
        Insert: Partial<BusinessMember>;
        Update: Partial<BusinessMember>;
      };
      clients: { Row: Client; Insert: Partial<Client>; Update: Partial<Client> };
      crews: { Row: Crew; Insert: Partial<Crew>; Update: Partial<Crew> };
      jobs: { Row: Job; Insert: Partial<Job>; Update: Partial<Job> };
      payments: { Row: Payment; Insert: Partial<Payment>; Update: Partial<Payment> };
    };
  };
}
