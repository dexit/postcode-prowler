import React from 'react';

interface CodesCardProps {
  codes: Record<string, string>;
}

const ONS_BASE_URL = 'https://ons.gov.uk/explore-local-statistics/areas/';
const ONS_LINKABLE_PREFIX = 'E';

// A more descriptive mapping from code keys to human-readable labels
const CODE_LABELS: Record<string, string> = {
  admin_county: 'Admin County',
  admin_district: 'Admin District',
  admin_ward: 'Admin Ward',
  parish: 'Parish',
  parliamentary_constituency: 'Parliamentary Constituency',
  parliamentary_constituency_2024: 'Parliamentary Constituency (2024)',
  ccg: 'CCG',
  ced: 'CED',
  lsoa: 'LSOA',
  msoa: 'MSOA',
  nuts: 'NUTS',
  pfa: 'PFA',
};

const CodesCard: React.FC<CodesCardProps> = ({ codes }) => {
  const codeEntries = Object.entries(codes);

  if (codeEntries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">ONS Codes</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6">
        {codeEntries.map(([key, value]) => {
          if (!value) return null;
          
          const label = CODE_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const isLinkable = value.startsWith(ONS_LINKABLE_PREFIX) && key !== 'ccg' && key !== 'parish';

          return (
            <div key={key}>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{label}</p>
              {isLinkable ? (
                <a
                  href={`${ONS_BASE_URL}${value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium text-base break-words"
                  aria-label={`View ONS data for ${label} code ${value}`}
                >
                  {value}
                </a>
              ) : (
                <p className="text-gray-900 dark:text-white font-medium text-base break-words">{value}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CodesCard;
