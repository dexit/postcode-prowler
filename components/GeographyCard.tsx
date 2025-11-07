import React from 'react';
import { PostcodeApiResponse } from '../types';

interface GeographyCardProps {
  data: PostcodeApiResponse;
}

const GeographyCard: React.FC<GeographyCardProps> = ({ data }) => {
  const { api_data } = data;

  if (!api_data) return null; // Only render if API data is available

  const coordinates = api_data?.latitude && api_data?.longitude
    ? `${api_data.latitude.toFixed(5)}, ${api_data.longitude.toFixed(5)}`
    : 'N/A';

  const terminationDate = api_data?.year_terminated && api_data?.month_terminated
    ? `${api_data.year_terminated}-${String(api_data.month_terminated).padStart(2, '0')}`
    : 'N/A';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg fade-in">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Geographical Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Country</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.country ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Region</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.region ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Coordinates</p>
          <p className="text-gray-900 dark:text-white font-medium">{coordinates}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Termination Date</p>
          <p className="text-gray-900 dark:text-white font-medium">{terminationDate}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Eastings</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.eastings ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Northings</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.northings ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Incode</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.incode ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Outcode</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.outcode ?? 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default GeographyCard;