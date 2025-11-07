import { HistoryEntry } from '../types';

const STORAGE_KEY = 'asf_history';
const MAX_HISTORY = 20;

export const loadHistory = (): HistoryEntry[] => {
  try {
    const historyString = localStorage.getItem(STORAGE_KEY);
    return historyString ? JSON.parse(historyString) : [];
  } catch (e) {
    console.error("Failed to load history from localStorage", e);
    return [];
  }
};

export const saveHistory = (entry: HistoryEntry, currentHistory: HistoryEntry[]): HistoryEntry[] => {
  const filteredHistory = currentHistory.filter(e => e.postcode !== entry.postcode);
  const newHistory = [entry, ...filteredHistory];
  if (newHistory.length > MAX_HISTORY) {
    newHistory.pop();
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error("Failed to save history to localStorage", e);
  }
  return newHistory;
};
