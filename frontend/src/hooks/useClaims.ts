import { useQuery } from '@tanstack/react-query';

// Use relative path to leverage nginx proxy and avoid CORS issues
// nginx will proxy /api/claims/* to the backend API
const API_BASE_URL = '/api/claims';

export interface Claim {
  _id: string;
  claim_id: string;
  customer_name: string;
  license_plate: string;
  driver_name: string;
  incident_date: string;  // YYYY-MM-DD
  incident_time: string;  // HH:MM
  location: string;
  description: string;
  damage_description: string;
  injury_count: number;
  injuries?: number | string;  // Alternative field name (alias for injury_count)
  status: string;
  created_at: string;  // ISO timestamp when claim was created
}

export interface ClaimsResponse {
  success: boolean;
  count: number;
  claims: Claim[];
}

export const useClaims = (limit: number = 10) => {
  return useQuery<ClaimsResponse>({
    queryKey: ['claims', limit],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch claims: ${response.statusText}`);
      }
      return await response.json();
    },
    refetchInterval: 5000, // Refresh every 5 seconds
    retry: 3,
  });
};
