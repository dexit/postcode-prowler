import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HistoryDrawer from './components/HistoryDrawer';
import PostcodeForm from './components/PostcodeForm';
import ErrorDisplay from './components/ErrorDisplay';
import PostcodeResults from './components/PostcodeResults';
import SkeletonCard from './components/SkeletonCard'; // Import the new SkeletonCard
import { PostcodeApiResponse, HistoryEntry } from './types';
import { loadHistory, saveHistory } from './utility/localStorage';
import { fetchAdminDistrictBoundary } from './utility/osmApi';

const App: React.FC = () => {
  const [postcodeData, setPostcodeData] = useState<PostcodeApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);
  const [initialPostcodeSearch, setInitialPostcodeSearch] = useState<string | undefined>(undefined);

  const resultsRef = useRef<HTMLDivElement>(null); // Ref for scrolling to results

  // Load history from local storage on initial mount
  useEffect(() => {
    const storedHistory = loadHistory();
    setHistory(storedHistory);
  }, []);

  // Effect to scroll to results when data/error changes or loading finishes
  useEffect(() => {
    if ((postcodeData || error) && !isLoading) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [postcodeData, error, isLoading]);

  const handleSearch = useCallback(async (postcode: string) => {
    setIsLoading(true);
    setError(null);
    setPostcodeData(null);
    setInitialPostcodeSearch(postcode); // Set initial postcode for the form if it was from history

    try {
      const apiUrl = `https://cf-cors-air.pathway-group.workers.dev/api/?url=https://pathwaygroup.co.uk/dev/hubhook/hspics/src/postcodes/v2/api/asf?postcode=${encodeURIComponent(postcode)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PostcodeApiResponse = await response.json();

      if (data.status === 404 || !data.asf) {
        setError(data.error || 'No matches found for the entered postcode.');
        return;
      }

      // If API data is available and contains admin_district, fetch OSM boundary
      if (data.status === 200 && data.api_data?.admin_district) {
        const districtGeoJson = await fetchAdminDistrictBoundary(data.api_data.admin_district);
        if (districtGeoJson) {
          // Create a new object for api_data to ensure immutability
          data.api_data = { ...data.api_data, osm_admin_district_geojson: districtGeoJson };
        }
      }

      setPostcodeData(data);
      // Save valid search to history
      setHistory(prevHistory => saveHistory({ postcode, timestamp: Date.now(), data }, prevHistory));

    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectHistoryEntry = useCallback((entry: HistoryEntry) => {
    setPostcodeData(entry.data);
    setError(null);
    setInitialPostcodeSearch(entry.postcode); // Update form with selected postcode
    // No need to re-fetch OSM data if it's already in history
  }, []);

  const toggleHistoryDrawer = useCallback(() => {
    setIsHistoryDrawerOpen(prev => !prev);
  }, []);

  return (
    <>
      <Navbar onToggleHistoryDrawer={toggleHistoryDrawer} />

      <main className="flex-1 py-8">
        <div ref={resultsRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6"> {/* Main grid container */}
            <div className="col-span-full"> {/* Postcode form always spans full width */}
              <PostcodeForm
                onSearch={handleSearch}
                history={history}
                initialPostcode={initialPostcodeSearch}
                isLoading={isLoading}
              />
            </div>

            {isLoading && (
              <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SkeletonCard className="md:col-span-2 lg:col-span-2" />
                <SkeletonCard className="md:col-span-2 lg:col-span-2" />
                <SkeletonCard className="md:col-span-2 lg:col-span-1" />
                <SkeletonCard className="md:col-span-2 lg:col-span-3" />
              </div>
            )}
            {error && <div className="col-span-full"><ErrorDisplay message={error} /></div>}

            {postcodeData && !isLoading && !error && (
              <div className="col-span-full">
                <PostcodeResults data={postcodeData} />
              </div>
            )}
          </div>
        </div>
      </main>

      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={history}
        onSelectHistoryEntry={handleSelectHistoryEntry}
      />

      <Footer />
    </>
  );
};

export default App;