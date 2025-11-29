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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
      className="text-center mb-8 relative z-10"
    >
      {/* Dynamic Background Glow - Softer and slower */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-primary/10 blur-[80px] rounded-full"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-24 bg-secondary/8 blur-[100px] rounded-full"
        animate={{
          scale: [1.15, 1, 1.15],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="flex flex-col items-center justify-center gap-2">

        {/* Holographic Icon Container - More comfortable */}
        <motion.div
          className="relative w-16 h-16 mb-3 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          {/* Gentle rotating ring */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-primary via-secondary to-accent opacity-10 rounded-full blur-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-0 border rounded-full"
            style={{ borderColor: 'rgba(255,255,255,0.15)' }}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className="material-icons text-3xl text-white/90 relative z-10"
            animate={{
              textShadow: [
                "0 0 15px var(--primary-color)",
                "0 0 20px var(--secondary-color)",
                "0 0 15px var(--primary-color)"
              ]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
          >
            {iconName}
          </motion.span>
        </motion.div>

        {/* Main Greeting Text - Comfortable and readable */}
        <div className="relative">
          {/* Subtle glow layer */}
          <motion.h1
            className="absolute text-5xl md:text-7xl font-black tracking-tight text-primary/8 blur-xl"
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            {greeting}
          </motion.h1>
          
          {/* Main text with gentle fade-in */}
          <motion.h1
            className="relative text-5xl md:text-7xl font-black tracking-tight text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            style={{
              filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))',
              textShadow: '0 2px 10px rgba(255,255,255,0.1)'
            }}
          >
            {greeting}
          </motion.h1>

          {/* Single decorative line */}
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: '80%',
              opacity: [0, 0.6, 0.4]
            }}
            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
          />
        </div>

        {/* Username - Clean and comfortable */}
        {userName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex items-center justify-center gap-2 mt-3"
          >
            <motion.span 
              className="text-xl md:text-2xl font-semibold text-white/90"
              style={{
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
              }}
            >
              {userName}
            </motion.span>
            <motion.span
              animate={{ 
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-6 bg-primary/60 rounded-full"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
