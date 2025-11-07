import React from 'react';
import { PostcodeApiResponse } from '../types';

interface AdminCardProps {
  data: PostcodeApiResponse;
}

const AdminCard: React.FC<AdminCardProps> = ({ data }) => {
  const { api_data } = data;

  if (!api_data) return null; // Only render if API data is available

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg fade-in">
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
  );
};

export default AdminCard;