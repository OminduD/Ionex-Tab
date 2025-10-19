// src/components/QuickLinks.tsx
// Fixed quick links bar with Material Icons

import React from 'react';
import { motion } from 'framer-motion';
import { Shortcut } from '../types';

interface Props {
  shortcuts: Shortcut[];
  theme: string;
}

// Material Icons mapping
const materialIconMap: Record<string, string> = {
  gmail: 'mail',
  youtube: 'play_circle',
  github: 'code',
  discord: 'forum',
  spotify: 'music_note',
  reddit: 'reddit',
  twitter: 'tag',
  figma: 'brush',
  notion: 'description',
  linkedin: 'work',
  facebook: 'facebook',
  instagram: 'photo_camera',
  netflix: 'movie',
  amazon: 'shopping_cart',
  drive: 'cloud',
  calendar: 'event',
};

// Helper function to get favicon URL
const getFaviconUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
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
        const materialIcon = materialIconMap[shortcut.icon || ''];
        const faviconUrl = getFaviconUrl(shortcut.url);
        
        return (
          <motion.button
            key={shortcut.id}
            initial={{ opacity: 0, scale: 0, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ 
              delay: 0.3 + index * 0.05,
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.15, 
              y: -8,
              rotateY: 15,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleClick(shortcut.url)}
            className="shortcut-button group relative w-16 h-16 rounded-2xl border border-white/20 hover:border-white/40 flex items-center justify-center transition-all shadow-lg hover:shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(16px)',
              transformStyle: 'preserve-3d'
            }}
            title={shortcut.name}
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at center, var(--accent-light-tint, rgba(255, 255, 255, 0.3)) 0%, transparent 70%)'
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Material Icon or Favicon */}
            {materialIcon ? (
              <motion.span 
                className="material-icons relative z-10"
                style={{ 
                  fontSize: '32px',
                  color: 'var(--text-color-dark, #1e293b)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {materialIcon}
              </motion.span>
            ) : faviconUrl ? (
              <motion.img 
                src={faviconUrl} 
                alt={shortcut.name}
                className="w-8 h-8 rounded-lg relative z-10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
            ) : null}
            
            {/* Fallback letter */}
            <span 
              className={`text-2xl font-bold relative z-10 ${materialIcon || faviconUrl ? 'hidden' : ''}`}
              style={{ 
                color: 'var(--text-color-dark, #1e293b)',
                textShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              {shortcut.name.charAt(0)}
            </span>
            
            {/* Tooltip with animation */}
            <motion.span 
              initial={{ opacity: 0, y: -5 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-xl backdrop-blur-sm border border-white/10"
            >
              <span className="font-medium">{shortcut.name}</span>
              {/* Tooltip arrow */}
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45" />
            </motion.span>

            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default QuickLinks;
