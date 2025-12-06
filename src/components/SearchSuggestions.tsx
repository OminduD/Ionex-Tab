// src/components/SearchSuggestions.tsx
// Auto-suggest dropdown for search input

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, TrendingUp } from 'lucide-react';

interface Suggestion {
  text: string;
  type: 'suggestion' | 'recent' | 'trending';
}

interface Props {
  query: string;
  onSelect: (suggestion: string) => void;
  show: boolean;
}

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT = 5;

export const SearchSuggestions: React.FC<Props> = ({ query, onSelect, show }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load recent searches from localStorage
  const getRecentSearches = (): string[] => {
    try {
      const recent = localStorage.getItem(RECENT_SEARCHES_KEY);
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  };

  // Save search to recent
  const saveToRecent = (search: string) => {
    if (!search.trim()) return;

    const recent = getRecentSearches();
    const updated = [search, ...recent.filter(s => s !== search)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  // Fetch suggestions from DuckDuckGo (CORS-friendly)
  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      // Show recent searches when query is empty
      const recent = getRecentSearches();
      setSuggestions(recent.map(text => ({ text, type: 'recent' as const })));
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);

    try {
      // Use DuckDuckGo AC API
      const response = await fetch(
        `https://duckduckgo.com/ac/?q=${encodeURIComponent(searchQuery)}&type=list`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) throw new Error('Failed to fetch suggestions');

      const data = await response.json();
      // DuckDuckGo returns: [{ phrase: "..." }, ...]
      const fetchedSuggestions = data.map((item: any) => item.phrase);

      // Combine with recent searches that match
      const recent = getRecentSearches().filter(s =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const combined: Suggestion[] = [
        ...recent.map(text => ({ text, type: 'recent' as const })),
        ...fetchedSuggestions.slice(0, 8).map((text: string) => ({
          text,
          type: 'suggestion' as const
        }))
      ];

      // Remove duplicates
      const unique = Array.from(
        new Map(combined.map(item => [item.text, item])).values()
      ).slice(0, 8);

      setSuggestions(unique);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching suggestions:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounce suggestions fetch
  useEffect(() => {
    if (!show) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    const timer = setTimeout(() => {
      fetchSuggestions(query);
    }, 200);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, show]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!show || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          if (selectedIndex >= 0) {
            e.preventDefault();
            handleSelect(suggestions[selectedIndex].text);
          }
          break;
        case 'Escape':
          setSuggestions([]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, suggestions, selectedIndex]);

  const handleSelect = (suggestion: string) => {
    saveToRecent(suggestion);
    onSelect(suggestion);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock className="w-4 h-4 opacity-50" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 opacity-50" />;
      default:
        return <Search className="w-4 h-4 opacity-50" />;
    }
  };

  if (!show || suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
      >
        {loading && (
          <div className="px-4 py-2 text-xs text-white/50">
            Loading suggestions...
          </div>
        )}

        <div className="max-h-96 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={`${suggestion.type}-${suggestion.text}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => handleSelect(suggestion.text)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selectedIndex === index
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
                }`}
            >
              {getIcon(suggestion.type)}
              <span className="flex-1 text-white">
                {suggestion.text}
              </span>
              {suggestion.type === 'recent' && (
                <span className="text-xs text-white/40">Recent</span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Keyboard hint */}
        <div className="px-4 py-2 text-xs text-white/30 border-t border-white/10 flex items-center justify-between">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchSuggestions;
