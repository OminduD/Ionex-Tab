// src/components/SearchBar.tsx
// Search bar component with multiple search engine options - Redesigned

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe } from 'lucide-react';
import { SiGoogle, SiDuckduckgo, SiBrave, SiYoutube, SiBaidu } from 'react-icons/si';
import { TbBrandBing } from 'react-icons/tb';

interface SearchEngine {
  id: string;
  name: string;
  icon: React.ElementType;
  searchUrl: string;
}

const searchEngines: SearchEngine[] = [
  { id: 'google', name: 'Google', icon: SiGoogle, searchUrl: 'https://www.google.com/search?q=' },
  { id: 'duckduckgo', name: 'Duck', icon: SiDuckduckgo, searchUrl: 'https://duckduckgo.com/?q=' },
  { id: 'bing', name: 'Bing', icon: TbBrandBing, searchUrl: 'https://www.bing.com/search?q=' },
  { id: 'brave', name: 'Brave', icon: SiBrave, searchUrl: 'https://search.brave.com/search?q=' },
  { id: 'youtube', name: 'YouTube', icon: SiYoutube, searchUrl: 'https://www.youtube.com/results?search_query=' },
  { id: 'ecosia', name: 'Ecosia', icon: Globe, searchUrl: 'https://www.ecosia.org/search?q=' },
  { id: 'startpage', name: 'Start', icon: Globe, searchUrl: 'https://www.startpage.com/do/search?q=' },
  { id: 'qwant', name: 'Qwant', icon: Globe, searchUrl: 'https://www.qwant.com/?q=' },
  { id: 'yandex', name: 'Yandex', icon: Globe, searchUrl: 'https://yandex.com/search/?text=' },
  { id: 'baidu', name: 'Baidu', icon: SiBaidu, searchUrl: 'https://www.baidu.com/s?wd=' },
];

interface Props {
  selectedEngine?: string;
  onEngineChange?: (engineId: string) => void;
}

export const SearchBar: React.FC<Props> = ({ selectedEngine = 'google', onEngineChange }) => {
  const [query, setQuery] = useState('');
  const [activeEngine, setActiveEngine] = useState(selectedEngine);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const engine = searchEngines.find(e => e.id === activeEngine) || searchEngines[0];
      // Search in current tab instead of new tab
      window.location.href = engine.searchUrl + encodeURIComponent(query);
    }
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
        onSubmit={handleSearch} 
        className="relative"
      >
        {/* Search Input */}
        <div className="flex items-center bg-black/30 backdrop-blur-xl rounded-full px-6 py-4 shadow-2xl border border-white/20">
          <Search className="w-5 h-5 text-white/70 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type here..."
            className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-base"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-3 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white font-medium transition-colors"
          >
            Search
          </motion.button>
        </div>

        {/* Search Engine Selector */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-3 flex items-center justify-center gap-2"
        >
          <div className="px-4 py-2 bg-black/30 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/10">
            Search With
          </div>

          <div className="flex items-center gap-2">
            {searchEngines.map((engine) => {
              const IconComponent = engine.icon;
              return (
                <motion.button
                  key={engine.id}
                  type="button"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEngineSelect(engine.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    activeEngine === engine.id
                      ? 'bg-white/30 border-2 border-white/50 text-white shadow-lg'
                      : 'bg-black/30 border border-white/10 text-white/70 hover:bg-black/40'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
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
