import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface ClockProps {
  timeFormat?: '12h' | '24h';
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const Clock: React.FC<ClockProps> = ({ timeFormat = '24h', size = 'medium', theme = 'aurora' }) => {
  const [time, setTime] = useState(new Date());
  const { variants, containerStyle } = useThemeAnimation(theme);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`flex flex-col items-center justify-center h-full relative overflow-hidden ${isSmall ? 'p-2' : 'p-6'} rounded-3xl ${containerStyle}`}
    >
      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Main Time Display */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
      >
        <div className="flex items-end gap-2">
          <div className={`font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] ${isSmall ? 'text-4xl' : isLarge ? 'text-8xl' : 'text-6xl'
            }`}>
            {time.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: timeFormat === '12h'
            }).split(' ')[0]}
          </div>

          <div className={`font-medium text-primary mb-2 ${isSmall ? 'text-xs' : 'text-xl'}`}>
            {timeFormat === '12h' && time.toLocaleTimeString('en-US', { hour12: true }).split(' ')[1]}
          </div>
        </div>

        {/* Date Display */}
        <div className={`mt-2 font-mono text-accent tracking-widest uppercase ${isSmall ? 'text-[8px]' : 'text-sm'}`}>
          {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </motion.div>

      {/* Seconds Progress Bar */}
      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-1000 ease-linear`} style={{ width: `${(seconds / 60) * 100}%` }} />

      {/* Decorative Corners */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/40" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/40" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/40" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/40" />
    </motion.div>
  );
};

export default Clock;
