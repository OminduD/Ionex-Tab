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
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className={`rounded-full border-2 border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-center relative overflow-hidden ${isSmall ? 'w-20 h-20' : 'w-32 h-32'} shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
          >
            {/* Vinyl Grooves */}
            <div className="absolute inset-0 bg-[repeating-radial-gradient(#111_0,#111_2px,#222_3px)] opacity-80" />

            {/* Holographic Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45" />

            {/* Center Label */}
            <div className={`rounded-full bg-gradient-to-br from-primary via-purple-500 to-accent shadow-inner ${isSmall ? 'w-8 h-8' : 'w-12 h-12'} flex items-center justify-center`}>
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>
          </motion.div>

          {/* Dynamic Equalizer Bars */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1 h-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-gradient-to-t from-primary to-accent rounded-t-full shadow-[0_0_10px_rgba(var(--primary-color-rgb),0.5)]"
                animate={{
                  height: ['20%', '80%', '40%', '100%', '30%'],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                  repeatType: "mirror"
                }}
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
