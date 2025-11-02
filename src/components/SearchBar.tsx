// src/components/SearchBar.tsx
// Enhanced search bar with autocomplete and multi-row engines

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import SearchSuggestions from './SearchSuggestions';

interface SearchEngine {
  id: string;
  name: string;
  icon: string; // Material icon name
  searchUrl: string;
  color?: string;
}

const searchEngines: SearchEngine[] = [
  { id: 'google', name: 'Google', icon: 'search', searchUrl: 'https://www.google.com/search?q=', color: '#4285f4' },
  { id: 'duckduckgo', name: 'Duck', icon: 'privacy_tip', searchUrl: 'https://duckduckgo.com/?q=', color: '#de5833' },
  { id: 'bing', name: 'Bing', icon: 'travel_explore', searchUrl: 'https://www.bing.com/search?q=', color: '#008373' },
  { id: 'yahoo', name: 'Yahoo', icon: 'mail', searchUrl: 'https://search.yahoo.com/search?p=', color: '#7B0099' },
  { id: 'wikipedia', name: 'Wikipedia', icon: 'menu_book', searchUrl: 'https://en.wikipedia.org/wiki/Special:Search?search=', color: '#000000' },
  { id: 'brave', name: 'Brave', icon: 'shield', searchUrl: 'https://search.brave.com/search?q=', color: '#fb542b' },
  { id: 'youtube', name: 'YouTube', icon: 'play_circle', searchUrl: 'https://www.youtube.com/results?search_query=', color: '#ff0000' },
  { id: 'ecosia', name: 'Ecosia', icon: 'eco', searchUrl: 'https://www.ecosia.org/search?q=', color: '#57a23e' },
  { id: 'startpage', name: 'Start', icon: 'home', searchUrl: 'https://www.startpage.com/do/search?q=', color: '#4b8cff' },
  { id: 'qwant', name: 'Qwant', icon: 'language', searchUrl: 'https://www.qwant.com/?q=', color: '#5482e5' },
  { id: 'yandex', name: 'Yandex', icon: 'public', searchUrl: 'https://yandex.com/search/?text=', color: '#fc3f1d' },
  { id: 'baidu', name: 'Baidu', icon: 'manage_search', searchUrl: 'https://www.baidu.com/s?wd=', color: '#2319dc' },
];

interface Props {
  selectedEngine?: string;
  onEngineChange?: (engineId: string) => void;
}

export const SearchBar: React.FC<Props> = ({ selectedEngine = 'google', onEngineChange }) => {
  const [query, setQuery] = useState('');
  const [activeEngine, setActiveEngine] = useState(selectedEngine);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);



  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      const engine = searchEngines.find(e => e.id === activeEngine) || searchEngines[0];
      window.location.href = engine.searchUrl + encodeURIComponent(finalQuery);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleEngineSelect = (engineId: string) => {
    setActiveEngine(engineId);
    if (onEngineChange) onEngineChange(engineId);
  };



  return (
    <div className="w-full">
      <motion.form 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="relative"
      >
        {/* Search Input with Gradient Border */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-sm opacity-30" />
          <div className="relative flex items-center bg-black/40 backdrop-blur-2xl rounded-full px-6 py-4 shadow-2xl border border-white/30 hover:border-white/50 transition-all">
            <motion.div
              animate={{ rotate: showSuggestions ? 360 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Search className="w-5 h-5 text-theme-primary mr-3" />
            </motion.div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim().length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onFocus={() => setShowSuggestions(query.trim().length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search anything..."
              className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-lg"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="ml-3 px-6 py-2 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-accent rounded-full text-white font-semibold transition-all shadow-lg"
            >
              Search
            </motion.button>
          </div>
        </motion.div>

        {/* Autocomplete Suggestions - Using SearchSuggestions Component */}
        <SearchSuggestions
          query={query}
          onSelect={(suggestion) => {
            setQuery(suggestion);
            setShowSuggestions(false);
            handleSearch(suggestion);
          }}
          show={showSuggestions && query.trim().length > 0}
        />

        {/* Search Engine Selector - Multi-row */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-4 flex flex-col items-center gap-3"
        >
          <div className="px-4 py-2 bg-black/30 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/10">
            Search With
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
            {searchEngines.map((engine, index) => {
              const isActive = activeEngine === engine.id;
              
              return (
                <motion.button
                  key={engine.id}
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEngineSelect(engine.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary border-2 border-white/50 text-white shadow-lg shadow-accent/30'
                      : 'bg-black/30 border border-white/10 text-white/70 hover:bg-black/40 hover:border-white/30'
                  }`}
                  style={{
                    boxShadow: isActive && engine.color ? `0 0 20px ${engine.color}40` : undefined
                  }}
                >
                  <span 
                    className="material-icons" 
                    style={{ 
                      fontSize: '18px',
                      color: isActive ? 'white' : engine.color 
                    }}
                  >
                    {engine.icon}
                  </span>
                  <span>{engine.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default SearchBar;
