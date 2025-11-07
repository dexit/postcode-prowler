import React from 'react';
import { PostcodeApiResponse } from '../types';
import MapComponent from './MapComponent';

interface PostcodeResultsProps {
  data: PostcodeApiResponse;
}

const PostcodeResults: React.FC<PostcodeResultsProps> = ({ data }) => {
  if (!data || data.status === 404 || !data.asf) {
    return null; // Should be handled by ErrorDisplay, but good for safety
  }

  const { api_data, asf } = data;

  const getStatusBadgeClass = () => {
    if (data.status === 404 || !asf) {
      return 'status-error';
    } else if (api_data?.terminated) {
      return 'status-terminated';
    }
    return 'status-active';
  };

  const getStatusBadgeText = () => {
    if (data.status === 404 || !asf) {
      return 'Error';
    } else if (api_data?.terminated) {
      return 'Terminated';
    }
    return 'Active';
  };

  const coordinates = api_data?.latitude && api_data?.longitude
    ? `${api_data.latitude.toFixed(5)}, ${api_data.longitude.toFixed(5)}`
    : 'N/A';

  const terminationDate = api_data?.year_terminated && api_data?.month_terminated
    ? `${api_data.year_terminated}-${String(api_data.month_terminated).padStart(2, '0')}`
    : 'N/A';

  return (
    <div className="space-y-6 fade-in">
      {/* Map */}
      {(api_data?.latitude !== undefined && api_data?.longitude !== undefined) && (
        <MapComponent
          latitude={api_data.latitude}
          longitude={api_data.longitude}
          districtBoundaryGeoJson={api_data.osm_admin_district_geojson} // Pass GeoJSON
          districtName={api_data.admin_district} // Pass district name
        />
      )}

      {/* Status card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Postcode Status</h2>
          <span className={`status-badge ${getStatusBadgeClass()}`}>{getStatusBadgeText()}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Postcode</p>
            <p className="text-gray-900 dark:text-white font-medium">{asf.postcode ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Area</p>
            <p className="text-gray-900 dark:text-white font-medium">{asf.area_name ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Effective</p>
            <p className="text-gray-900 dark:text-white font-medium">
              {`${asf.effective_from ?? 'N/A'} – ${asf.effective_to ?? 'N/A'}`}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Source</p>
            <p className="text-gray-900 dark:text-white font-medium">{asf.source_name ?? 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Geography card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Geographical Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>

      {/* Administrative card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Administrative Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400">District</p>
            <p className="text-gray-900 dark:text-white font-medium">{api_data?.admin_district ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Ward</p>
            <p className="text-gray-900 dark:text-white font-medium">{api_data?.admin_ward ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Constituency</p>
            <p className="text-gray-900 dark:text-white font-medium">{api_data?.parliamentary_constituency ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Parish</p>
            <p className="text-gray-900 dark:text-white font-medium">{api_data?.parish ?? 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostcodeResults;