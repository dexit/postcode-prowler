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
  parliamentary_constituency_2024?: string; // Added as it's in the example data
  admin_district: string;
  parish: string;
  admin_county: string | null;
  admin_ward: string;
  ced: string | null;
  ccg: string;
  nuts: string;
  pfa?: string; // Added as it's in the example data
  codes: Record<string, string>; // Changed to Record<string, string> for flexible iteration
  terminated?: boolean; // Changed to boolean as per example data
  year_terminated?: number;
  month_terminated?: number;
  // Add date_of_introduction to ApiData interface
  date_of_introduction?: string;
  osm_admin_district_geojson?: any; // New field for OSM boundary GeoJSON
}

export interface AsfData {
  postcode: string;
  area_name: string;
  source_name: string;
  effective_from: string;
  effective_to: string;
}

export interface PostcodeApiResponse {
  status: number;
  effective?: boolean; // Added as it's in the example data
  api_source?: string; // Added as it's in the example data
  api_data?: ApiData;
  asf?: AsfData;
  message?: string; // Added as it's in the example data
  error?: string;
}

export interface HistoryEntry {
  postcode: string;
  timestamp: number;
  data: PostcodeApiResponse;
}