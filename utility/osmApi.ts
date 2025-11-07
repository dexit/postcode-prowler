// utility/osmApi.ts
const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000; // 1 second
const RETRY_FACTOR = 2; // Exponential backoff factor

export const fetchAdminDistrictBoundary = async (districtName: string): Promise<any | null> => {
  if (!districtName) return null;

  const query = `
    [out:json][timeout:25];
    area["name"="England"]->.a;
    (
      relation["admin_level"="8"]["name"="${districtName}"](area.a);
      way["admin_level"="8"]["name"="${districtName}"](area.a);
    );
    out geom;
  `;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(OVERPASS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`
      });

      if (response.ok) {
        const data = await response.json();

        if (data.elements && data.elements.length > 0) {
          const features = data.elements.map((el: any) => {
            if (el.geometry && el.geometry.length > 0) {
              const coords = el.geometry.map((g: any) => [g.lon, g.lat]);
              return {
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [coords]
                },
                properties: el.tags || { name: districtName }
              };
            }
            return null;
          }).filter(Boolean);

          if (features.length > 0) {
            return {
              type: "FeatureCollection",
              features: features
            };
          }
        }
        return null; // No elements found or no valid features
      } else if (response.status === 504 && attempt < MAX_RETRIES) {
        console.warn(`Overpass API timeout for '${districtName}', retrying (attempt ${attempt}/${MAX_RETRIES})...`);
        const delay = INITIAL_RETRY_DELAY_MS * (RETRY_FACTOR ** (attempt - 1)) + Math.random() * 500; // Add jitter
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw new Error(`Overpass API error! status: ${response.status} - ${response.statusText}`);
      }
    } catch (error: any) {
      if (attempt < MAX_RETRIES && (error instanceof TypeError || error.message.includes('Failed to fetch'))) {
        // Catch network errors and "Failed to fetch" (e.g., DNS errors, CORS issues before response)
        console.warn(`Network error for '${districtName}', retrying (attempt ${attempt}/${MAX_RETRIES})...`, error.message);
        const delay = INITIAL_RETRY_DELAY_MS * (RETRY_FACTOR ** (attempt - 1)) + Math.random() * 500; // Add jitter
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error("Error fetching OSM data for district:", districtName, error);
        return null;
      }
    }
  }

  console.error(`Failed to fetch OSM data for district: '${districtName}' after ${MAX_RETRIES} attempts.`);
  return null;
};