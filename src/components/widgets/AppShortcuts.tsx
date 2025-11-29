import React from 'react';
import { Shortcut } from '../../types';
import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface AppShortcutsProps {
  shortcuts: Shortcut[];
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const AppShortcuts: React.FC<AppShortcutsProps> = ({ shortcuts, size = 'medium', theme = 'aurora' }) => {
  const isSmall = size === 'small';
  const { variants, containerStyle } = useThemeAnimation(theme);

  const handleShortcutClick = (url: string) => {
    window.open(url, '_blank');
  };

  const getDefaultIcon = (url: string): string => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch (e) {
      return '';
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-2' : 'p-4'} rounded-3xl ${containerStyle}`}
    >
      {/* Header */}
      <div className={`relative z-10 flex items-center gap-2 ${isSmall ? 'mb-2' : 'mb-4'}`}>
        <Link2 className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} text-primary`} />
        <h3 className={`${isSmall ? 'text-sm' : 'text-lg'} font-bold text-white tracking-wide`}>Quick Links</h3>
      </div>

      {/* Shortcuts Grid */}
      <div className={`relative z-10 grid ${isSmall ? 'grid-cols-4 gap-2' : 'grid-cols-3 md:grid-cols-4 gap-3'} overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent`}>
        {shortcuts.map((shortcut, index) => {
          const iconUrl = shortcut.icon || getDefaultIcon(shortcut.url);
          return (
            <motion.button
              key={shortcut.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShortcutClick(shortcut.url)}
              className={`group flex flex-col items-center justify-center ${isSmall ? 'p-1.5' : 'p-3'} bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-white/20 transition-all`}
            >
              <div className={`relative ${isSmall ? 'w-8 h-8 mb-1' : 'w-12 h-12 mb-2'} rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-white/10 to-white/5 group-hover:shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.3)] transition-shadow`}>
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={shortcut.name}
                    className={`${isSmall ? 'w-5 h-5' : 'w-8 h-8'} object-contain drop-shadow-lg`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.fallback-letter');
                        if (fallback) {
                          (fallback as HTMLElement).classList.remove('hidden');
                        }
                      }
                    }}
                  />
                ) : null}
                <span className={`fallback-letter ${iconUrl ? 'hidden' : ''} font-bold text-white ${isSmall ? 'text-sm' : 'text-xl'}`}>
                  {shortcut.name.charAt(0).toUpperCase()}
                </span>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <span className={`text-white/70 group-hover:text-white text-center truncate w-full transition-colors ${isSmall ? 'text-[10px]' : 'text-xs'}`}>
                {shortcut.name}
              </span>
            </motion.button>
          );
        })}

        {/* Add New Placeholder (if needed) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex flex-col items-center justify-center ${isSmall ? 'p-1.5' : 'p-3'} border border-dashed border-white/20 rounded-xl hover:bg-white/5 transition-colors opacity-50 hover:opacity-100`}
        >
          <div className={`${isSmall ? 'w-8 h-8 mb-1' : 'w-12 h-12 mb-2'} flex items-center justify-center`}>
            <span className="text-2xl text-white/50">+</span>
          </div>
          <span className={`text-white/50 ${isSmall ? 'text-[10px]' : 'text-xs'}`}>Add</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AppShortcuts;
