import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface AnalogClockProps {
  showDigital?: boolean;
  timeFormat?: '12h' | '24h';
  size?: 'small' | 'medium' | 'large';
  theme?: string;
}

const AnalogClock: React.FC<AnalogClockProps> = ({ showDigital = false, timeFormat = '24h', size = 'medium', theme = 'aurora' }) => {
  const [time, setTime] = useState(new Date());
  const { variants, containerStyle } = useThemeAnimation(theme);

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = (seconds * 6);
  const minuteAngle = (minutes * 6 + seconds * 0.1);
  const hourAngle = (hours * 30 + minutes * 0.5);

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`flex flex-col items-center justify-center h-full relative overflow-hidden ${isSmall ? 'p-2' : 'p-4'} rounded-3xl ${containerStyle}`}
    >
      <div className={`relative w-full ${isSmall ? 'max-w-[100px]' : isLarge ? 'max-w-[260px]' : 'max-w-[180px]'} aspect-square z-10 flex items-center justify-center transition-all duration-300`}>
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl ${theme === 'neon' ? 'animate-pulse' : ''}`} />

        {/* Clock face */}
        <div className="relative w-full h-full rounded-full border-2 border-white/10 bg-black/20 backdrop-blur-sm shadow-inner">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute ${isSmall ? 'w-0.5 h-2' : 'w-1 h-3'} bg-white/30 rounded-full left-1/2 top-2 origin-bottom transform -translate-x-1/2`}
              style={{ transform: `rotate(${i * 30}deg) translateY(${isSmall ? '2px' : '4px'})` }}
            />
          ))}

          {/* Hands Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Hour Hand */}
            <motion.div
              className={`absolute ${isSmall ? 'w-1' : 'w-1.5'} h-[25%] bg-gradient-to-t from-white to-white/50 rounded-full origin-bottom bottom-1/2 shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
              animate={{ rotate: hourAngle }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              style={{ zIndex: 10 }}
            />

            {/* Minute Hand */}
            <motion.div
              className={`absolute ${isSmall ? 'w-0.5' : 'w-1'} h-[35%] bg-gradient-to-t from-primary to-primary/50 rounded-full origin-bottom bottom-1/2 shadow-[0_0_10px_rgba(var(--primary-color-rgb),0.5)]`}
              animate={{ rotate: minuteAngle }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              style={{ zIndex: 11 }}
            />

            {/* Second Hand */}
            <motion.div
              className="absolute w-0.5 h-[45%] bg-accent rounded-full origin-bottom bottom-1/2 shadow-[0_0_10px_rgba(var(--accent-color-rgb),0.8)]"
              animate={{ rotate: secondAngle }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              style={{ zIndex: 12 }}
            />

            {/* Center Dot */}
            <div className={`absolute ${isSmall ? 'w-2 h-2' : 'w-3 h-3'} bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20`} />
            <div className={`absolute ${isSmall ? 'w-1 h-1' : 'w-1.5 h-1.5'} bg-accent rounded-full z-21`} />
          </div>
        </div>
      </div>

      {showDigital && !isSmall && (
        <div className={`font-black tracking-widest mt-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent ${isLarge ? 'text-4xl' : 'text-2xl'}`}>
          {time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: timeFormat === '12h'
          })}
        </div>
      )}

      {!isSmall && (
        <div className={`font-mono text-accent tracking-widest uppercase mt-2 ${isLarge ? 'text-sm' : 'text-[10px]'}`}>
          {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      )}
    </motion.div>
  );
};

export default AnalogClock;
