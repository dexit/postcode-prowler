import React from 'react';
import { PostcodeApiResponse } from '../types';

interface AdminCardProps {
  data: PostcodeApiResponse;
}

const AdminCard: React.FC<AdminCardProps> = ({ data }) => {
  const { api_data } = data;

  if (!api_data) return null; // Only render if API data is available

  const renderField = (label: string, value: string | undefined | null) => (
    <div>
      <p className="text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-gray-900 dark:text-white font-medium">{value ?? 'N/A'}</p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Administrative Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {renderField('District', api_data?.admin_district)}
        {renderField('Ward', api_data?.admin_ward)}
        {renderField('Constituency', api_data?.parliamentary_constituency)}
        {renderField('Constituency (2024)', api_data?.parliamentary_constituency_2024)}
        {renderField('Parish', api_data?.parish)}
        {renderField('Admin County', api_data?.admin_county)}
        {renderField('Date of Introduction', api_data?.date_of_introduction)}
        {renderField('NHS HA', api_data?.nhs_ha)}
        {renderField('European Electoral Region', api_data?.european_electoral_region)}
        {renderField('Primary Care Trust', api_data?.primary_care_trust)}
        {renderField('LSOA', api_data?.lsoa)}
        {renderField('MSOA', api_data?.msoa)}
        {renderField('CED', api_data?.ced)}
        {renderField('CCG', api_data?.ccg)}
        {renderField('NUTS', api_data?.nuts)}
        {renderField('PFA', api_data?.pfa)}
      </div>
    </div>
  );
};

export default AdminCard;