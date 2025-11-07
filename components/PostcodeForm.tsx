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
    <form ref={formRef} onSubmit={handleSubmit} className="mb-8 max-w-sm mx-auto group">
      <div className="relative flex items-center rounded-lg border border-gray-300 dark:border-gray-700"> {/* This div provides the border */}
        <input
          ref={inputRef}
          type="text"
          id="postcodeInput"
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-0
                     postcode-input text-left appearance-none"
          // Explicit inline styles for precise control as requested
          style={{
            padding: '0 48px 0 0', // padding: 0 for top/bottom, 48px right (for button), 0 left
            fontSize: '3em',
            letterSpacing: '10px',
            textAlign: 'left',
            width: '285px',
            // Add a slight left padding to avoid text touching the edge for better visual
            paddingLeft: '10px' // Added for better visual alignment, overrides 'padding: 0' for left side
          }}
          placeholder="_ _ _  _ _ _"
          autoComplete="off"
          value={postcode}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Enter UK postcode"
          maxLength={8} // Max length for UK postcodes (e.g. A9A 9AA is 7, AA9A 9AA is 8)
        />
        <button
          type="submit"
          className="absolute right-0 flex items-center justify-center w-10 h-10
                     bg-transparent text-white font-medium transition duration-200
                     group-hover:bg-primary-500/20 rounded-full" // Circular hover
          aria-label="Search postcode"
        >
          <SearchIcon size={28} className="text-primary-500" /> {/* Icon color */}
        </button>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div id="suggestions" className="absolute z-10 top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
            {filteredSuggestions.map((entry) => (
              <div
                key={entry.timestamp + entry.postcode}
                className="cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-md p-3 mx-2 my-1
                           text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white
                           hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                onMouseDown={(e) => e.preventDefault()} // Prevent blur from firing before click
                onClick={() => handleSuggestionClick(entry.postcode)}
                tabIndex={0} // Make suggestions keyboard focusable
                role="option" // ARIA role for listbox options
                aria-selected={postcode === entry.postcode} // ARIA for selected option
              >
                <p className="font-medium">{entry.postcode}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(entry.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default PostcodeForm;