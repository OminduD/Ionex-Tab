// src/components/QuickLinks.tsx
// Fixed quick links bar with brand logos

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

export const QuickLinks: React.FC<Props> = ({ shortcuts }) => {
  const handleClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-4 flex items-center justify-center gap-3 flex-wrap"
    >
      {shortcuts.slice(0, 9).map((shortcut, index) => {
        const IconComponent = iconMap[shortcut.icon || ''];
        
        return (
          <motion.button
            key={shortcut.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(shortcut.url)}
            className="group relative w-14 h-14 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:border-white/30 flex items-center justify-center transition-all"
            title={shortcut.name}
          >
            {IconComponent ? (
              <IconComponent className="w-6 h-6 icon-color transition-colors" />
            ) : (
              <span className="text-xl font-bold icon-color">
                {shortcut.name.charAt(0)}
              </span>
            )}
            
            {/* Tooltip */}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {shortcut.name}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default QuickLinks;
