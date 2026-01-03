// src/components/SearchBar.tsx
// Enhanced search bar with futuristic cyberpunk aesthetics

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
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
  isMinimalist?: boolean;
}

export const SearchBar: React.FC<Props> = ({ selectedEngine = 'google', onEngineChange, isMinimalist }) => {
  const [query, setQuery] = useState('');
  const [activeEngine, setActiveEngine] = useState(selectedEngine);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
    <div className="w-full relative z-30">
      <motion.form
        initial={isMinimalist ? false : { opacity: 0, y: 20 }}
        animate={isMinimalist ? false : { opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="relative"
      >
        {/* Futuristic Search Container */}
        <motion.div
          className="relative group"
          animate={isMinimalist ? false : { scale: isFocused ? 1.02 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Animated Glow Border */}
          {!isMinimalist && <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary opacity-50 blur-md transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-30 group-hover:opacity-70'}`} />}

          {/* Main Input Area */}
          <div className="relative flex items-center bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">

            {/* Engine Icon Area */}
            <div className="pl-4 pr-3 py-4 border-r border-white/10 flex items-center justify-center bg-white/5">
              <motion.div
                key={activeEngine}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-primary"
              >
                <span className="material-icons text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {searchEngines.find(e => e.id === activeEngine)?.icon || 'search'}
                </span>
              </motion.div>
            </div>

            {/* Input Field */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  setIsFocused(true);
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                placeholder="Initialize Search Protocol..."
                className="w-full bg-transparent text-white placeholder-white/30 outline-none text-lg px-4 py-4 font-mono tracking-wide"
              />

              {/* Scanning Cursor Effect */}
              {!isMinimalist && isFocused && (
                <motion.div
                  layoutId="cursor"
                  className="absolute bottom-0 left-0 h-[2px] bg-primary shadow-[0_0_10px_var(--primary-color)]"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="pr-2 flex items-center gap-2">
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                >
                  <span className="material-icons text-sm">close</span>
                </motion.button>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-bold text-sm tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                SEARCH
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Autocomplete Suggestions */}
        <SearchSuggestions
          query={query}
          onSelect={(suggestion) => {
            setQuery(suggestion);
            setShowSuggestions(false);
            handleSearch(suggestion);
          }}
          show={showSuggestions}
        />

        {/* Engine Selector - HUD Style */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto">
            {searchEngines.map((engine, index) => {
              const isActive = activeEngine === engine.id;
              return (
                <motion.button
                  key={engine.id}
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEngineSelect(engine.id)}
                  className={`relative group px-3 py-2 rounded-lg border transition-all duration-300 ${isActive
                    ? 'bg-white/10 border-primary/50 text-white shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.3)]'
                    : 'bg-black/40 border-white/5 text-white/40 hover:bg-white/5 hover:border-white/20 hover:text-white/80'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="material-icons text-sm transition-colors duration-300"
                      style={{ color: isActive ? 'white' : engine.color }}
                    >
                      {engine.icon}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider">{engine.name}</span>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeEngine"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_var(--primary-color)]"
                    />
                  )}
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
