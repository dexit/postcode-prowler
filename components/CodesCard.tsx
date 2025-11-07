import React from 'react';

interface CodesCardProps {
  codes: Record<string, string>;
}

const CodesCard: React.FC<CodesCardProps> = ({ codes }) => {
  if (!codes || Object.keys(codes).length === 0) return null;

  const ONS_BASE_URL = 'https://ons.gov.uk/explore-local-statistics/areas/';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg fade-in">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">API Codes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(codes).map(([key, value]) => (
          <div key={key}>
            <p className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/_/g, ' ')}</p>
            {value && value.startsWith('E') ? (
              <a
                href={`${ONS_BASE_URL}${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                {value}
              </a>
            ) : (
              <p className="text-gray-900 dark:text-white font-medium">{value ?? 'N/A'}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodesCard;