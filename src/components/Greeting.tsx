// src/components/Greeting.tsx
// Time-based greeting with username - Futuristic Holographic Design

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlitchText } from './GlitchText';

interface GreetingProps {
  userName?: string;
  theme?: string;
}

export const Greeting: React.FC<GreetingProps> = ({ userName, theme = 'aurora' }) => {
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

  const isCyberpunk = theme === 'cyberpunk' || theme === 'neon';

  // Theme-specific animations
  const getThemeAnimation = () => {
    switch (theme) {
      case 'aurora':
        return {
          textShadow: [
            "0 0 10px rgba(255,255,255,0.5)",
            "0 0 20px rgba(147, 51, 234, 0.8)",
            "0 0 10px rgba(255,255,255,0.5)"
          ],
          y: [0, -5, 0],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };
      case 'sunset':
        return {
          y: [10, 0],
          opacity: [0, 1],
          textShadow: [
            "0 0 0px rgba(255,165,0,0)",
            "0 0 20px rgba(255,165,0,0.8)"
          ],
          transition: { duration: 2, ease: "easeOut" } // Sunrise effect on mount, then steady glow
        };
      case 'forest':
        return {
          scale: [0.95, 1],
          opacity: [0.8, 1],
          color: ['#a7f3d0', '#ffffff'],
          transition: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
        };
      case 'ocean':
        return {
          y: [0, 5, 0],
          rotateX: [0, 10, 0],
          color: ['#ffffff', '#bae6fd', '#ffffff'],
          transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        };
      case 'midnight':
        return {
          opacity: [0.8, 1, 0.8],
          textShadow: [
            '0 0 5px rgba(255,255,255,0.5)',
            '0 0 15px rgba(255,255,255,1)',
            '0 0 5px rgba(255,255,255,0.5)'
          ],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case 'cherry':
        return {
          scale: [1, 1.05, 1],
          textShadow: [
            "0 0 10px rgba(255,192,203,0.5)",
            "0 0 25px rgba(255,105,180,0.8)",
            "0 0 10px rgba(255,192,203,0.5)"
          ],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };
      case 'mint':
        return {
          x: [-2, 2, -2],
          textShadow: [
            "2px 2px 0px rgba(0,0,0,0.1)",
            "-2px -2px 0px rgba(0,0,0,0.1)",
            "2px 2px 0px rgba(0,0,0,0.1)"
          ],
          transition: { duration: 0.5, repeat: Infinity, ease: "linear" } // Glitchy mint
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
      className="text-center mb-8 relative z-10"
    >
      {/* Dynamic Background Glow - Theme Aware */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 blur-[80px] rounded-full"
        style={{ backgroundColor: isCyberpunk ? 'rgba(219, 39, 119, 0.2)' : 'rgba(var(--primary-color-rgb), 0.1)' }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex flex-col items-center justify-center gap-2">

        {/* Holographic Icon Container */}
        <motion.div
          className="relative w-16 h-16 mb-3 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          {/* Rotating ring */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-primary via-secondary to-accent opacity-10 rounded-full blur-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {isCyberpunk ? (
            // Cyberpunk Hexagon Border
            <svg className="absolute inset-0 w-full h-full text-cyan-400 opacity-50" viewBox="0 0 100 100">
              <motion.path
                d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              />
            </svg>
          ) : (
            // Standard Circle Border
            <motion.div
              className="absolute inset-0 border rounded-full"
              style={{ borderColor: 'rgba(255,255,255,0.15)' }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          <motion.span
            className="material-icons text-3xl text-white/90 relative z-10"
            animate={isCyberpunk ? {
              textShadow: [
                "2px 0 #ff00ff",
                "-2px 0 #00ffff",
                "2px 0 #ff00ff"
              ],
              x: [0, -2, 2, -1, 1, 0]
            } : {
              textShadow: [
                "0 0 15px var(--primary-color)",
                "0 0 20px var(--secondary-color)",
                "0 0 15px var(--primary-color)"
              ]
            }}
            transition={isCyberpunk ? {
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 3
            } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {iconName}
          </motion.span>
        </motion.div>

        {/* Main Greeting Text */}
        <div className="relative">
          {isCyberpunk ? (
            <GlitchText
              text={greeting}
              className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-500 to-cyan-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            />
          ) : (
            <motion.h1
              className="relative text-5xl md:text-7xl font-black tracking-tight text-white"
              initial={{ opacity: 0, y: 10 }}
              // Apply theme-specific animation combined with entry animation
              animate={{
                opacity: 1,
                y: 0,
                ...getThemeAnimation()
              } as any}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              style={{
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))',
                textShadow: '0 2px 10px rgba(255,255,255,0.1)'
              }}
            >
              {greeting}
            </motion.h1>
          )}
        </div>

        {/* Username */}
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
                opacity: [0.3, 1, 0.3],
                height: isCyberpunk ? [10, 24, 10] : 24
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className={`w-1.5 h-6 rounded-full ${isCyberpunk ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-primary/60'}`}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

