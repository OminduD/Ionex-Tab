// src/components/Greeting.tsx
// Time-based greeting with username - Futuristic Holographic Design

import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { GlitchText } from './GlitchText';
import { DecodingText, StaggeredText, WavyText, GlowPulseText, SparkleText } from './TextAnimations';

interface GreetingProps {
  userName?: string;
  theme?: string;
  isMinimalist?: boolean;
}

export const Greeting: React.FC<GreetingProps> = memo(({ userName, theme: propTheme, isMinimalist }) => {
  const theme = propTheme || 'cyberpunk';
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

  // Theme-specific configurations
  const isCyberpunk = theme === 'cyberpunk' || theme === 'neon';
  const isNature = theme === 'forest' || theme === 'mint';
  const isOcean = theme === 'ocean' || theme === 'aurora';
  const isWarm = theme === 'sunset' || theme === 'cherry';
  const isDark = theme === 'midnight';

  const getThemeStyles = () => {
    if (isNature) return {
      containerClass: "font-serif tracking-wide",
      textClass: "text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-200 to-teal-300 drop-shadow-sm",
      iconColor: "text-emerald-300",
      glowColor: "rgba(16, 185, 129, 0.2)",
      animation: { opacity: 1, y: 0, scale: 1 }
    };
    if (isOcean) return {
      containerClass: "font-sans tracking-widest",
      textClass: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-300 to-indigo-300 drop-shadow-md",
      iconColor: "text-cyan-300",
      glowColor: "rgba(6, 182, 212, 0.2)",
      animation: { opacity: 1, x: 0 }
    };
    if (isWarm) return {
      containerClass: "font-sans font-light tracking-wider",
      textClass: "text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-pink-300 drop-shadow-lg",
      iconColor: "text-rose-300",
      glowColor: "rgba(244, 63, 94, 0.2)",
      animation: { opacity: 1, scale: 1 }
    };
    if (isDark) return {
      containerClass: "font-mono tracking-widest",
      textClass: "text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]",
      iconColor: "text-violet-300",
      glowColor: "rgba(139, 92, 246, 0.1)",
      animation: { opacity: 1, filter: 'blur(0px)' }
    };
    // Default / Cyberpunk
    return {
      containerClass: "font-black tracking-tight",
      textClass: "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-500 to-cyan-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]",
      iconColor: "text-white/90",
      glowColor: "rgba(219, 39, 119, 0.2)",
      animation: { opacity: 1, y: 0 }
    };
  };

  const styles = getThemeStyles();

  if (isMinimalist) {
    return (
      <div className="flex flex-col items-center justify-center p-8 z-10 relative">
        <div className="flex items-center gap-4 mb-2">
          <span className="material-icons text-4xl opacity-80">{iconName}</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {greeting}
          </h1>
        </div>
        {userName && (
          <div className="text-xl md:text-2xl font-medium opacity-60">
            {userName}
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      key={theme}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
      className={`text-center mb-8 relative z-10 ${styles.containerClass}`}
    >
      {/* Dynamic Background Glow - Theme Aware */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 blur-[80px] rounded-full"
        style={{ backgroundColor: styles.glowColor }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex flex-col items-center justify-center gap-2">

        {/* Icon Container */}
        <motion.div
          className="relative w-16 h-16 mb-3 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          {/* Theme Specific Icon Backgrounds */}
          {isCyberpunk && (
            <>
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-primary via-secondary to-accent opacity-10 rounded-full blur-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
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
            </>
          )}

          {isNature && (
            <motion.div
              className="absolute inset-0 border-2 border-emerald-400/30 rounded-full"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          )}

          {isOcean && (
            <motion.div
              className="absolute inset-0 border-b-4 border-cyan-400/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          )}

          <motion.span
            className={`material-icons text-3xl relative z-10 ${styles.iconColor}`}
            animate={isCyberpunk ? {
              textShadow: [
                "2px 0 #ff00ff",
                "-2px 0 #00ffff",
                "2px 0 #ff00ff"
              ],
              x: [0, -2, 2, -1, 1, 0]
            } : {}}
            transition={isCyberpunk ? {
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 3
            } : {}}
          >
            {iconName}
          </motion.span>
        </motion.div>

        {/* Main Greeting Text */}
        <div className="relative">
          {isCyberpunk ? (
            <GlitchText
              text={greeting}
              className={`text-5xl md:text-7xl ${styles.textClass}`}
            />
          ) : (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`text-5xl md:text-7xl font-bold ${styles.textClass}`}
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
            {isCyberpunk && <DecodingText text={userName} className="text-xl md:text-2xl font-bold text-cyan-400" />}
            {isNature && <StaggeredText text={userName} className="text-xl md:text-2xl font-semibold text-emerald-100" />}
            {isOcean && <WavyText text={userName} className="text-xl md:text-2xl font-medium text-cyan-100" />}
            {isWarm && <GlowPulseText text={userName} className="text-xl md:text-2xl font-light text-rose-100" />}
            {isDark && <SparkleText text={userName} className="text-xl md:text-2xl font-mono text-violet-200" />}

            {/* Fallback for other themes */}
            {!isCyberpunk && !isNature && !isOcean && !isWarm && !isDark && (
              <span className="text-xl md:text-2xl font-semibold text-white/90">{userName}</span>
            )}

            {isCyberpunk && (
              <motion.span
                animate={{
                  opacity: [0.3, 1, 0.3],
                  height: [10, 24, 10]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-6 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
              />
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});
