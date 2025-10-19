// src/components/Greeting.tsx
// Time-based greeting with username - Enhanced with cool animations

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sun, Cloud, Moon, Stars } from 'lucide-react';

interface GreetingProps {
  userName?: string;
}

export const Greeting: React.FC<GreetingProps> = ({ userName }) => {
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState(new Date());
  const [emoji, setEmoji] = useState<React.ReactNode>(null);

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
      setEmoji(<Sun className="w-12 h-12 text-yellow-400" />);
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
      setEmoji(<Cloud className="w-12 h-12 text-blue-300" />);
    } else if (hour >= 17 && hour < 22) {
      setGreeting('Good Evening');
      setEmoji(<Moon className="w-12 h-12 text-purple-300" />);
    } else {
      setGreeting('Good Night');
      setEmoji(<Stars className="w-12 h-12 text-indigo-300" />);
    }
  }, [time]);

  // Split greeting into individual characters for stagger animation
  const greetingChars = greeting.split('');
  const nameChars = userName ? userName.split('') : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.8, type: 'spring', bounce: 0.4 }}
      className="text-center mb-8 relative"
    >
      {/* Floating sparkles decoration */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-8 h-8 text-yellow-300/70" />
        </motion.div>
      </div>

      {/* Time-based icon with glow effect */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="flex justify-center mb-6"
      >
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          {/* Glowing background */}
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 blur-xl bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
          />
          <div className="relative">
            {emoji}
          </div>
        </motion.div>
      </motion.div>

      {/* Main greeting with stagger animation */}
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 flex justify-center items-center flex-wrap gap-1">
        <AnimatePresence mode="wait">
          {greetingChars.map((char, index) => (
            <motion.span
              key={`${greeting}-${index}`}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -50, rotateX: 90 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.5,
                type: 'spring',
                stiffness: 200
              }}
              className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
              style={{ 
                textShadow: '0 0 30px rgba(168, 139, 250, 0.5)'
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Username without wave animation */}
        {userName && (
          <>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            >
              , 
            </motion.span>
            {nameChars.map((char, index) => (
              <motion.span
                key={`name-${index}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: 0.6 + index * 0.05,
                    duration: 0.5,
                    type: 'spring'
                  }
                }}
                whileHover={{ 
                  scale: 1.2,
                  color: '#fbbf24',
                  transition: { duration: 0.2 }
                }}
                className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent cursor-default"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </>
        )}
      </h1>

      {/* Date with sliding animation and decorative elements */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute -left-20 top-1/2 transform -translate-y-1/2 hidden md:block"
        >
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-2xl md:text-3xl text-white font-medium tracking-wide relative"
        >
          <motion.span
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent"
            style={{ backgroundSize: '200% 100%' }}
          >
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </motion.span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute -right-20 top-1/2 transform -translate-y-1/2 hidden md:block"
        >
          <motion.div
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
          />
        </motion.div>
      </div>

      {/* Animated underline effect */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        className="mx-auto mt-6 h-1 w-32 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
        style={{ originX: 0.5 }}
      >
        <motion.div
          animate={{ 
            x: ['-100%', '100%']
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="h-full w-1/2 bg-white/50 rounded-full blur-sm"
        />
      </motion.div>
    </motion.div>
  );
};
