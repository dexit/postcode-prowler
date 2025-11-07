import React from 'react';
import { PostcodeApiResponse } from '../types';

interface AdminCardProps {
  data: PostcodeApiResponse;
}

const ONS_BASE_URL = 'https://ons.gov.uk/explore-local-statistics/areas/';

const AdminCard: React.FC<AdminCardProps> = ({ data }) => {
  const { api_data } = data;

  if (!api_data) return null; // Only render if API data is available

  const renderCode = (key: string, label: string, value: string | undefined | null) => {
    const codeValue = api_data.codes?.[key];
    const isLinkable = codeValue && codeValue.startsWith('E') && key !== 'ccg' && key !== 'parish';

    return (
      <div key={key}>
        <p className="text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-gray-900 dark:text-white font-medium">{value ?? 'N/A'}</p>
        {codeValue && (
          <>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Code</p>
            {isLinkable ? (
              <a
                href={`${ONS_BASE_URL}${codeValue}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium text-sm"
              >
                {codeValue}
              </a>
            ) : (
              <p className="text-gray-900 dark:text-white font-medium text-sm">{codeValue}</p>
            )}
          </>
        )}
      </div>
    );
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg fade-in">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Administrative Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {renderCode('admin_district', 'District', api_data?.admin_district)}
        {renderCode('admin_ward', 'Ward', api_data?.admin_ward)}
        <div>
          <p className="text-gray-600 dark:text-gray-400">Constituency</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.parliamentary_constituency ?? 'N/A'}</p>
          {api_data.codes?.parliamentary_constituency && (
            <>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Code</p>
              <a
                href={`${ONS_BASE_URL}${api_data.codes.parliamentary_constituency}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium text-sm"
              >
                {api_data.codes.parliamentary_constituency}
              </a>
            </>
          )}
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Constituency (2024)</p>
          <p className="text-gray-900 dark:text-white font-medium">{api_data?.parliamentary_constituency_2024 ?? 'N/A'}</p>
          {api_data.codes?.parliamentary_constituency_2024 && (
            <>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Code</p>
              <a
                href={`${ONS_BASE_URL}${api_data.codes.parliamentary_constituency_2024}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium text-sm"
              >
                {api_data.codes.parliamentary_constituency_2024}
              </a>
            </>
          )}
        </div>
        {renderCode('parish', 'Parish', api_data?.parish)}
        {renderCode('admin_county', 'Admin County', api_data?.admin_county)}
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
        {renderCode('lsoa', 'LSOA', api_data?.lsoa)}
        {renderCode('msoa', 'MSOA', api_data?.msoa)}
        {renderCode('ced', 'CED', api_data?.ced)}
        {renderCode('ccg', 'CCG', api_data?.ccg)}
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