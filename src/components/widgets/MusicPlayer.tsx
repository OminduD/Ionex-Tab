import React from 'react';
import { motion } from 'framer-motion';
import { Play, SkipBack, SkipForward } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface MusicPlayerProps {
  size?: 'small' | 'medium' | 'large';
  theme?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ size = 'medium', theme = 'aurora' }) => {
  const isSmall = size === 'small';
  const { variants, containerStyle } = useThemeAnimation(theme);

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-2' : 'p-4'} rounded-3xl ${containerStyle}`}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
        {/* Holographic Vinyl */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className={`rounded-full border-2 border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center relative overflow-hidden ${isSmall ? 'w-16 h-16' : 'w-24 h-24'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20" />
            <div className="absolute inset-0 bg-[repeating-radial-gradient(transparent_0,transparent_2px,rgba(255,255,255,0.05)_3px)]" />
            <div className={`rounded-full bg-gradient-to-br from-primary to-accent shadow-lg ${isSmall ? 'w-6 h-6' : 'w-8 h-8'}`} />
          </motion.div>

          {/* Equalizer Bars */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary rounded-t-full"
                animate={{ height: ['20%', '100%', '20%'] }}
                transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <h3 className={`font-bold text-white ${isSmall ? 'text-xs' : 'text-sm'}`}>Music Player</h3>
          <p className={`text-white/50 ${isSmall ? 'text-[10px]' : 'text-xs'}`}>Coming Soon</p>
        </div>

        {!isSmall && (
          <div className="flex items-center gap-4">
            <SkipBack className="w-4 h-4 text-white/50" />
            <div className="p-2 rounded-full bg-white/10 border border-white/10">
              <Play className="w-4 h-4 text-white fill-current" />
            </div>
            <SkipForward className="w-4 h-4 text-white/50" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
