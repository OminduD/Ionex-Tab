// src/components/Greeting.tsx
// Time-based greeting with username - Futuristic Holographic Design

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GreetingProps {
  userName?: string;
}

export const Greeting: React.FC<GreetingProps> = ({ userName }) => {
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState(new Date());
  const [iconName, setIconName] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = time.getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting('GOOD MORNING');
      setIconName('wb_sunny');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('GOOD AFTERNOON');
      setIconName('wb_cloudy');
    } else if (hour >= 17 && hour < 22) {
      setGreeting('GOOD EVENING');
      setIconName('nights_stay');
    } else {
      setGreeting('GOOD NIGHT');
      setIconName('bedtime');
    }
  }, [time]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.8, type: 'spring' }}
      className="text-center mb-8 relative z-10"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-primary/20 blur-[60px] rounded-full animate-pulse" />

      <div className="flex flex-col items-center justify-center gap-2">

        {/* Holographic Icon Container */}
        <motion.div
          className="relative w-16 h-16 mb-2 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary via-secondary to-accent opacity-20 rounded-full blur-md animate-spin-slow" />
          <div className="absolute inset-0 border border-white/20 rounded-full" />
          <motion.span
            className="material-icons text-3xl text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70"
            animate={{
              textShadow: [
                "0 0 10px var(--primary-color)",
                "0 0 20px var(--secondary-color)",
                "0 0 10px var(--primary-color)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {iconName}
          </motion.span>
        </motion.div>

        {/* Main Greeting Text with Glitch/Tech Effect */}
        <div className="relative">
          <motion.h1
            className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70"
            initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }}
            animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {greeting}
          </motion.h1>

          {/* Decorative Tech Lines */}
          <motion.div
            className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </div>

        {/* Username with Typing Effect */}
        {userName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 mt-2"
          >
            <span className="text-xl md:text-3xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
              {userName}
            </span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-2 h-6 bg-accent rounded-full"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
