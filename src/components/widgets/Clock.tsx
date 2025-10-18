import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Clock: React.FC = () => {
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

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      {/* Digital Time Display */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur-2xl" />
        
        <motion.div 
          key={`${hours}:${minutes}`}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
        >
          {time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-accent"
          >
            :{seconds.toString().padStart(2, '0')}
          </motion.span>
        </motion.div>
      </div>

      {/* Date Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-white/70 mt-3 font-medium"
      >
        {time.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        })}
      </motion.div>

      {/* Animated progress bar for seconds */}
      <div className="w-full mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
          animate={{ width: `${(seconds / 60) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default Clock;
