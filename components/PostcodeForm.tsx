import React, { useState, useCallback, useEffect, useRef } from 'react';
import { HistoryEntry } from '../types';
import { SearchIcon } from './Icons';

interface PostcodeFormProps {
  onSearch: (postcode: string) => void;
  history: HistoryEntry[];
  initialPostcode?: string;
}

const PostcodeForm: React.FC<PostcodeFormProps> = ({ onSearch, history, initialPostcode }) => {
  const [postcode, setPostcode] = useState<string>(initialPostcode || '');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPostcode) {
      setPostcode(initialPostcode);
    }
  }, [initialPostcode]);

  const formatPostcode = useCallback((value: string): string => {
    // 1. Convert to uppercase and remove any character that is not a letter or a number
    let cleanedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // 2. Apply dynamic spacing for UK postcodes
    // The inward part is always 3 characters long, so the space is inserted 3 characters from the end.
    if (cleanedValue.length > 3) {
      const outward = cleanedValue.slice(0, cleanedValue.length - 3);
      const inward = cleanedValue.slice(cleanedValue.length - 3);
      return outward + ' ' + inward;
    }
    return cleanedValue; // If less than 4 characters, no space yet
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPostcode(formatPostcode(e.target.value));
  }, [formatPostcode]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedPostcode = postcode.trim();
    if (trimmedPostcode) {
      onSearch(trimmedPostcode);
      setShowSuggestions(false);
      inputRef.current?.blur(); // Hide keyboard on mobile after submit
    }
  }, [postcode, onSearch]);

  const handleSuggestionClick = useCallback((entryPostcode: string) => {
    setPostcode(entryPostcode);
    onSearch(entryPostcode);
    setShowSuggestions(false);
    inputRef.current?.blur();
  }, [onSearch]);

  const handleFocus = useCallback(() => {
    if (history.length > 0) {
      setShowSuggestions(true);
    }
  }, [history.length]);

  const handleBlur = useCallback(() => {
    // Delay hiding suggestions to allow click on a suggestion item
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }, []);

  const filteredSuggestions = postcode
    ? history.filter(entry => entry.postcode.toUpperCase().includes(postcode.toUpperCase()))
    : history;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mb-8 max-w-lg mx-auto">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            id="postcodeInput"
            className="w-full px-4 py-4 text-lg rounded-lg bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 postcode-input dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
            placeholder="_ _ _ _ _ _"
            autoComplete="off"
            value={postcode}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label="Enter UK postcode"
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div id="suggestions" className="absolute z-10 mt-1 w-full bg-white border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
              {filteredSuggestions.map((entry) => (
                <div
                  key={entry.timestamp + entry.postcode}
                  className="suggestion-item text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur from firing before click
                  onClick={() => handleSuggestionClick(entry.postcode)}
                  tabIndex={0} // Make suggestions keyboard focusable
                  role="option" // ARIA role for listbox options
                  aria-selected={postcode === entry.postcode} // ARIA for selected option
                >
                  {entry.postcode}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition duration-200"
        >
          <SearchIcon className="mr-2" /> Search
        </button>
      </div>
    </form>
  );
};

export default PostcodeForm;