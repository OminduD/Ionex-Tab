// src/components/Greeting.tsx
// Time-based greeting with username

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GreetingProps {
  userName?: string;
}

export const Greeting: React.FC<GreetingProps> = ({ userName }) => {
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState(new Date());

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
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
    } else if (hour >= 17 && hour < 22) {
      setGreeting('Good Evening');
    } else {
      setGreeting('Good Night');
    }
  }, [time]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="text-center mb-8"
    >
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">
        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          {greeting}
        </span>
        {userName && (
          <span className="text-white">
            , {userName}
          </span>
        )}
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-white/70"
      >
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </motion.p>
    </motion.div>
  );
};
