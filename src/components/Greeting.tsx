// src/components/Greeting.tsx
// Time-based greeting with username - One line with theme colors

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GreetingProps {
  userName?: string;
}

export const Greeting: React.FC<GreetingProps> = ({ userName }) => {
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState(new Date());
  const [emojiIcon, setEmojiIcon] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = time.getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
      setEmojiIcon('wb_sunny');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
      setEmojiIcon('wb_cloudy');
    } else if (hour >= 17 && hour < 22) {
      setGreeting('Good Evening');
      setEmojiIcon('nights_stay');
    } else {
      setGreeting('Good Night');
      setEmojiIcon('bedtime');
    }
  }, [time]);

  const fullGreeting = userName ? `${greeting}, ${userName}!` : `${greeting}!`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.8, type: 'spring' }}
      className="text-center mb-6 relative"
    >
      {/* One-line greeting with theme colors and icon */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {/* Time-based icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <motion.span
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="material-icons text-primary"
            style={{ fontSize: '48px', filter: 'drop-shadow(0 0 10px var(--primary-color))' }}
          >
            {emojiIcon}
          </motion.span>
        </motion.div>

        {/* Greeting text */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold"
        >
          <motion.span
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            style={{ 
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {fullGreeting}
          </motion.span>
        </motion.h1>
      </div>

      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        className="mx-auto h-1 w-48 bg-gradient-to-r from-primary via-secondary to-accent rounded-full relative overflow-hidden"
      >
        <motion.div
          animate={{ 
            x: ['-100%', '200%']
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 w-1/3 bg-white/60 rounded-full blur-sm"
        />
      </motion.div>
    </motion.div>
  );
};
