import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThemeParticles } from '../ThemeParticles';

interface ClockProps {
  timeFormat?: '12h' | '24h';
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const Clock: React.FC<ClockProps> = ({ timeFormat = '24h', theme = 'aurora', size = 'medium' }) => {
  const [time, setTime] = useState(new Date());
  const [prevMinute, setPrevMinute] = useState(time.getMinutes());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      setTime(newTime);
      if (newTime.getMinutes() !== prevMinute) {
        setPrevMinute(newTime.getMinutes());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [prevMinute]);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <div className={`flex flex-col items-center justify-center h-full relative overflow-hidden ${isSmall ? 'p-2' : 'p-4'}`}>
      {/* Theme Particles Background */}
      <ThemeParticles theme={theme} density="low" />
      
      {/* Animated Background Rings */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-white/5"
            style={{
              width: `${(i + 1) * (isSmall ? 100 : 150)}px`,
              height: `${(i + 1) * (isSmall ? 100 : 150)}px`,
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      {/* Digital Time Display */}
      <div className="relative z-10">
        {/* Multi-layer Glow effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl blur-3xl"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          key={`${hours}:${minutes}`}
          initial={{ scale: 0.8, opacity: 0, rotateX: 45 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ 
            duration: 0.6,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className={`relative font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent ${
            isSmall ? 'text-4xl' : isLarge ? 'text-7xl' : 'text-5xl md:text-6xl'
          }`}
          style={{ perspective: '1000px' }}
        >
          <span>
            {time.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: timeFormat === '12h' 
            })}
          </span>
          <span className="text-accent">
            :{seconds.toString().padStart(2, '0')}
          </span>
        </motion.div>
      </div>

      {/* Date Display with slide animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className={`relative z-10 text-white/70 font-medium rounded-full bg-white/5 backdrop-blur-sm ${
          isSmall ? 'text-xs mt-2 px-3 py-1' : 'text-sm mt-4 px-4 py-2'
        }`}
      >
        {time.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        })}
      </motion.div>

      {/* Animated circular progress for seconds */}
      <div className={`relative z-10 ${isSmall ? 'mt-2 w-20 h-20' : 'mt-4 w-32 h-32'}`}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="url(#gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            pathLength={1}
            animate={{
              pathLength: seconds / 60,
            }}
            transition={{ 
              duration: 0.5,
              ease: "easeInOut"
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className="text-primary" stopColor="var(--primary-color)" />
              <stop offset="100%" className="text-accent" stopColor="var(--accent-color)" />
            </linearGradient>
          </defs>
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center font-bold text-white/50 ${isSmall ? 'text-lg' : 'text-2xl'}`}>
          {seconds}
        </div>
      </div>
    </div>
  );
};

export default Clock;
