// src/components/QuickLinks.tsx
// Fixed quick links bar with brand logos - now at bottom

import React from 'react';
import { motion } from 'framer-motion';
import { Shortcut } from '../types';
import { 
  SiGmail, SiYoutube, SiGithub, SiDiscord, SiSpotify, 
  SiReddit, SiFigma, SiNotion, SiLinkedin 
} from 'react-icons/si';
import { FaXTwitter } from 'react-icons/fa6';

interface Props {
  shortcuts: Shortcut[];
  theme: string;
}

const iconMap: Record<string, React.ElementType> = {
  gmail: SiGmail,
  youtube: SiYoutube,
  github: SiGithub,
  discord: SiDiscord,
  spotify: SiSpotify,
  reddit: SiReddit,
  twitter: FaXTwitter,
  figma: SiFigma,
  notion: SiNotion,
  linkedin: SiLinkedin,
};

// Helper function to get favicon URL
const getFaviconUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    // Use Google's favicon service as fallback
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
};

export const QuickLinks: React.FC<Props> = ({ shortcuts }) => {
  const handleClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center justify-center gap-3 flex-wrap"
    >
      {shortcuts.slice(0, 12).map((shortcut, index) => {
        const IconComponent = iconMap[shortcut.icon || ''];
        const faviconUrl = getFaviconUrl(shortcut.url);
        
        return (
          <motion.button
            key={shortcut.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(shortcut.url)}
            className="group relative w-14 h-14 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 hover:border-white/30 flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
            title={shortcut.name}
          >
            {IconComponent ? (
              <IconComponent className="w-6 h-6 icon-color transition-colors" />
            ) : faviconUrl ? (
              <img 
                src={faviconUrl} 
                alt={shortcut.name}
                className="w-7 h-7 rounded-lg"
                onError={(e) => {
                  // Fallback to first letter if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            
            {/* Fallback letter */}
            <span className={`text-xl font-bold icon-color ${IconComponent || faviconUrl ? 'hidden' : ''}`}>
              {shortcut.name.charAt(0)}
            </span>
            
            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              {shortcut.name}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default QuickLinks;
