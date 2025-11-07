import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center text-sm text-gray-600 dark:text-gray-400 py-3">
      © {new Date().getFullYear()} Postcode Prowler Pro – All rights reserved
    </footer>
  );
};

export default Footer;