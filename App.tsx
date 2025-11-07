import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HistoryDrawer from './components/HistoryDrawer';
import PostcodeForm from './components/PostcodeForm';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import PostcodeResults from './components/PostcodeResults';
import { PostcodeApiResponse, HistoryEntry } from './types';
import { loadHistory, saveHistory } from './utility/localStorage';

const App: React.FC = () => {
  const [postcodeData, setPostcodeData] = useState<PostcodeApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);
  const [initialPostcodeSearch, setInitialPostcodeSearch] = useState<string | undefined>(undefined);

  // Load history from local storage on initial mount
  useEffect(() => {
    const storedHistory = loadHistory();
    setHistory(storedHistory);
  }, []);

  const handleSearch = useCallback(async (postcode: string) => {
    setIsLoading(true);
    setError(null);
    setPostcodeData(null);
    setInitialPostcodeSearch(postcode); // Set initial postcode for the form if it was from history

    try {
      // Using the provided CORS proxy
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
  }, []);

  const toggleHistoryDrawer = useCallback(() => {
    setIsHistoryDrawerOpen(prev => !prev);
  }, []);

  return (
    <>
      <Navbar onToggleHistoryDrawer={toggleHistoryDrawer} />

      <header className="bg-gray-800 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">
            Postcode Prowler Pro <span className="text-primary-500">🕵️‍♂️</span>
          </h1>
          <p className="mt-2 text-gray-300">Uncover the secrets behind every UK postcode</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <PostcodeForm
            onSearch={handleSearch}
            history={history}
            initialPostcode={initialPostcodeSearch}
          />

          {isLoading && <LoadingSpinner />}
          {error && <ErrorDisplay message={error} />}
          {postcodeData && !isLoading && !error && <PostcodeResults data={postcodeData} />}
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
