export interface ApiData {
  postcode: string;
  quality: number;
  eastings: number;
  northings: number;
  country: string;
  nhs_ha: string;
  longitude: number;
  latitude: number;
  european_electoral_region: string;
  primary_care_trust: string;
  region: string;
  lsoa: string;
  msoa: string;
  incode: string;
  outcode: string;
  parliamentary_constituency: string;
  admin_district: string;
  parish: string;
  admin_county: string | null;
  admin_ward: string;
  ced: string | null;
  ccg: string;
  nuts: string;
  codes: {
    admin_district: string;
    admin_county: string;
    admin_ward: string;
    parish: string;
    parliamentary_constituency: string;
    ccg: string;
    nuts: string;
  };
  terminated?: string; // Date of termination if applicable
  year_terminated?: number;
  month_terminated?: number;
}

export interface AsfData {
  postcode: string;
  status: string; // e.g., "Active"
  effective_from: string;
  effective_to: string;
  area_name: string;
  source_name: string;
  // Add other properties if available in the ASF response
}

export interface PostcodeApiResponse {
  status: number;
  api_data?: ApiData;
  asf?: AsfData;
  error?: string;
}

export interface HistoryEntry {
  postcode: string;
  timestamp: number;
  data: PostcodeApiResponse;
}
