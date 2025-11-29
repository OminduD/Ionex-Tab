import React from 'react';
import { Shortcut } from '../../types';
import { ThemeParticles } from '../ThemeParticles';

interface AppShortcutsProps {
  shortcuts: Shortcut[];
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const AppShortcuts: React.FC<AppShortcutsProps> = ({ shortcuts, theme = 'aurora', size = 'medium' }) => {
  const isSmall = size === 'small';
  
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
    <div className={`${isSmall ? 'p-2' : 'p-4'} h-full relative overflow-hidden`}>
      {/* Theme Particles */}
      <ThemeParticles theme={theme} density="low" />
      
      <h3 className={`${isSmall ? 'text-sm mb-2' : 'text-lg mb-3'} font-bold relative z-10`}>Quick Links</h3>
      <div className={`grid ${isSmall ? 'grid-cols-4 gap-2' : 'grid-cols-3 md:grid-cols-4 gap-3'}`}>
        {shortcuts.map(shortcut => {
          const iconUrl = shortcut.icon || getDefaultIcon(shortcut.url);
          return (
            <button
              key={shortcut.id}
              onClick={() => handleShortcutClick(shortcut.url)}
              className={`flex flex-col items-center justify-center ${isSmall ? 'p-1.5' : 'p-3'} bg-white/10 hover:bg-white/20 rounded-lg transition-all hover:scale-105`}
            >
              <div className={`${isSmall ? 'w-8 h-8 mb-1' : 'w-12 h-12 mb-2'} bg-white/20 rounded-full flex items-center justify-center overflow-hidden`}>
                {iconUrl ? (
                  <img 
                    src={iconUrl} 
                    alt={shortcut.name}
                    className={`${isSmall ? 'w-5 h-5' : 'w-8 h-8'}`}
                    onError={(e) => {
                      // Fallback to first letter if icon fails to load
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
                <span className={`${isSmall ? 'text-lg' : 'text-2xl'} icon-color fallback-letter ${iconUrl ? 'hidden' : ''}`}>
                  {shortcut.name.charAt(0)}
                </span>
              </div>
              <span className={`text-xs text-center truncate w-full ${isSmall ? 'scale-90' : ''}`}>{shortcut.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AppShortcuts;
