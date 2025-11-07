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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
          <p className="text-gray-600 dark:text-gray-400">Constituency (2024)</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.parliamentary_constituency_2024 ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Parish</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.parish ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Admin County</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.admin_county ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Date of Introduction</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.date_of_introduction ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">NHS HA</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.nhs_ha ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">European Electoral Region</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.european_electoral_region ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Primary Care Trust</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.primary_care_trust ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">LSOA</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.lsoa ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">MSOA</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.msoa ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">CED</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.ced ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">CCG</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.ccg ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">NUTS</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.nuts ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">PFA</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.pfa ?? 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;