import React, { useState, useCallback, useEffect, useRef } from 'react';
import Inputmask from 'inputmask';
import { HistoryEntry } from '../types';
import { SearchIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';

interface PostcodeFormProps {
  onSearch: (postcode: string) => void;
  history: HistoryEntry[];
  initialPostcode?: string;
  isLoading: boolean;
}

const PostcodeForm: React.FC<PostcodeFormProps> = ({ onSearch, history, initialPostcode, isLoading }) => {
  const [postcode, setPostcode] = useState<string>(initialPostcode || '');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPostcode) {
      setPostcode(initialPostcode);
    }
  }, [initialPostcode]);

  // Initialize Inputmask
  useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    const im = new Inputmask({
      mask: '(A[A]9[9] 9AA|A9 9AA|A99 9AA)',
      definitions: {
        'A': { validator: "[A-Za-z]", casing: "upper" },
      },
      placeholder: "_",
      clearIncomplete: false,
      clearMaskOnLostFocus: false,
      showMaskOnHover: false,
      showMaskOnFocus: true,
    });
    im.mask(inputEl);
    
    // Cleanup function to remove mask on unmount
    return () => {
      if (inputEl && (inputEl as any).inputmask) {
        (inputEl as any).inputmask.remove();
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPostcode(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current && (inputRef.current as any).inputmask?.isComplete() && !isLoading) {
      const value = (inputRef.current as any).value;
      onSearch(value);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  }, [onSearch, isLoading]);

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

  const cleanPostcode = postcode.replace(/_/g, '').trim();
  const filteredSuggestions = cleanPostcode
    ? history.filter(entry => entry.postcode.toUpperCase().startsWith(cleanPostcode.toUpperCase()))
    : history;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mb-8 max-w-[21rem] w-full mx-auto group">
      <div className="relative flex items-center rounded-lg"> {/* Removed border classes from this div */}
        <input
          ref={inputRef}
          type="text"
          id="postcodeInput"
          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-0
                     postcode-input text-left appearance-none"
          // Explicit inline styles for precise control as requested
          style={{
            padding: '0 8px 0 10px', // padding: 0 for top/bottom, 8px right (for button), 10px left
            fontSize: '3em',
            letterSpacing: '6px',
            textAlign: 'left',
            }}
          autoComplete="off"
          value={postcode}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Enter UK postcode"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-0 flex items-center justify-center w-10 h-10
                     bg-transparent text-white font-medium transition duration-200
                     group-hover:bg-primary-500/20 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Search postcode"
        >
          {isLoading ? <LoadingSpinner size={28} className="text-primary-500" /> : <SearchIcon size={28} className="text-primary-500" />}
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