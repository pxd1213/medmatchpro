export interface User {
  id: string;
  email: string;
  role: 'manufacturer' | 'consultant';
  full_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
  country: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  manufacturer_id: string;
  title: string;
  description: string;
  device_type: string;
  country: string;
  regulatory_requirements: string[];
  timeline: {
    start_date: string;
    end_date: string;
  };
  budget_range: {
    min: number;
    max: number;
  };
  status: 'draft' | 'published' | 'awarded' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  project_id: string;
  consultant_id: string;
  proposal: string;
  price: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface Review {
  id: string;
  from_user_id: string;
  to_user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}
