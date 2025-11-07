import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="p-4 mb-6 bg-red-900/30 border border-red-700 rounded-lg text-red-300 fade-in">
      {message}
    </div>
  );
};

export default ErrorDisplay;