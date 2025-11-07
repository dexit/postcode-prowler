import React from 'react';
import { PostcodeApiResponse } from '../types';

interface StatusCardProps {
  data: PostcodeApiResponse;
}

const StatusCard: React.FC<StatusCardProps> = ({ data }) => {
  const { api_data, asf } = data;

  if (!asf) return null; // Only render if ASF data is available

  const getStatusBadgeClass = () => {
    if (data.status === 404 || !asf) {
      return 'status-error';
    } else if (api_data?.terminated) {
      return 'status-terminated';
    }
    return 'status-active bg-green-600/50 text-green-200 ring-1 ring-inset ring-green-500/20'; // Enhanced active status styling
  };

  const getStatusBadgeText = () => {
    if (data.status === 404 || !asf) {
      return 'Error';
    } else if (api_data?.terminated) {
      return 'Terminated';
    }
    return 'Active';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Postcode Status</h2>
        <span className={`status-badge ${getStatusBadgeClass()}`}>{getStatusBadgeText()}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Postcode</p>
          <p className="text-gray-900 dark:text-white font-medium">{asf.postcode ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Status Effective</p>
          <p className="text-gray-900 dark:text-white font-medium">{data.effective ? 'True' : 'False'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Area</p>
          <p className="text-gray-900 dark:text-white font-medium">{asf.area_name ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Source Name</p>
          <p className="text-gray-900 dark:text-white font-medium">{asf.source_name ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Effective From</p>
          <p className="text-gray-900 dark:text-white font-medium">{asf.effective_from ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Effective To</p>
          <p className="text-gray-900 dark:text-white font-medium">{asf.effective_to ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">API Source</p>
          <p className="text-gray-900 dark:text-white font-medium">{data.api_source ?? 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;