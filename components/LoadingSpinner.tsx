import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-12 fade-in">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      <p className="mt-4 text-gray-400">Decoding postcode secrets…</p>
    </div>
  );
};

export default LoadingSpinner;
