import React, { useEffect, useRef } from 'react';
import { HistoryEntry } from '../types';
import { XIcon } from './Icons';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelectHistoryEntry: (entry: HistoryEntry) => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, history, onSelectHistoryEntry }) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`fixed inset-0 flex items-end sm:items-center justify-end z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div
        ref={drawerRef}
        className={`drawer bg-white dark:bg-gray-800 rounded-l-xl w-80 h-full sm:h-auto sm:w-80 shadow-xl
          ${isOpen ? 'drawer-open' : 'drawer-closed'}`}
      >
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Lookup History</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <XIcon size={24} />
          </button>
        </div>
        <ul className="space-y-2 px-4 py-2 overflow-y-auto max-h-[calc(100vh-100px)] sm:max-h-[70vh]">
          {history.length === 0 ? (
            <li className="text-gray-500 dark:text-gray-400">No history yet.</li>
          ) : (
            history.map((entry) => (
              <li
                key={entry.timestamp + entry.postcode}
                className="cursor-pointer text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:underline transition-colors duration-150"
                onClick={() => {
                  onSelectHistoryEntry(entry);
                  onClose();
                }}
              >
                {entry.postcode} ({new Date(entry.timestamp).toLocaleString()})
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default HistoryDrawer;