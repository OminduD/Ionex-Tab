// Reusable Theme-Based Particle Animation Component
import React from 'react';
import { motion } from 'framer-motion';

interface ThemeParticlesProps {
  theme?: string;
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

interface ParticleConfig {
  emoji: string;
  count: number;
  animation: 'rise' | 'fall' | 'float' | 'twinkle' | 'electric';
}

const themeParticleConfig: Record<string, ParticleConfig> = {
  ocean: { emoji: '🫧', count: 15, animation: 'rise' },
  forest: { emoji: '🍃', count: 12, animation: 'fall' },
  sunset: { emoji: '✨', count: 18, animation: 'float' },
  midnight: { emoji: '⭐', count: 25, animation: 'twinkle' },
  neon: { emoji: '⚡', count: 18, animation: 'electric' },
  aurora: { emoji: '💫', count: 15, animation: 'float' },  // Changed to shooting star
  cherry: { emoji: '🌸', count: 15, animation: 'fall' },
  mint: { emoji: '💎', count: 12, animation: 'float' },
};

const getAnimationProps = (animation: string, particle: { id: number; x: number; y: number }, theme?: string) => {
  switch (animation) {
    case 'rise': // Bubbles rising
      return {
        y: [0, -400],
        x: [0, Math.sin(particle.id) * 30],
        opacity: [0.1, 0.4, 0.1],
      };
    case 'fall': // Leaves/petals falling
      return {
        y: [0, 400],
        x: [0, Math.sin(particle.id) * 50],
        rotate: [0, 360],
        opacity: [0.2, 0.4, 0.2],
      };
    case 'float': // Gentle floating with special aurora effects
      if (theme === 'aurora') {
        // Aurora: Wave-like flowing motion with color shifts
        return {
          y: [0, -30, 30, 0],
          x: [0, 50, -50, 0],
          rotate: [0, 180, 360],
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.5, 1],
        };
      }
      return {
        y: [0, -20, 0],
        x: [0, 15, 0],
        opacity: [0.1, 0.3, 0.1],
      };
    case 'twinkle': // Enhanced midnight stars - more dramatic
      return {
        scale: [0.5, 2, 0.5],
        opacity: [0.1, 0.9, 0.1],
        rotate: [0, 180, 360],
        y: [0, -20, 20, 0],
        x: [0, 10, -10, 0],
      };
    case 'electric': // Enhanced neon - more energetic
      return {
        x: [0, 40, -40, 20, -20, 0],
        y: [0, -30, 30, -20, 20, 0],
        opacity: [0.2, 0.9, 0.2, 0.8, 0.2],
        scale: [1, 1.5, 1, 1.3, 1],
        rotate: [0, 360],
      };
    default:
      return {
        y: [0, -20, 0],
        opacity: [0.1, 0.3, 0.1],
      };
  }
};

export const ThemeParticles: React.FC<ThemeParticlesProps> = ({ 
  theme = 'aurora', 
  density = 'medium',
  className = '' 
}) => {
  const config = themeParticleConfig[theme] || themeParticleConfig.aurora;
  
  // Adjust particle count based on density
  const densityMultiplier = density === 'low' ? 0.5 : density === 'high' ? 1.5 : 1;
  const particleCount = Math.floor(config.count * densityMultiplier);
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 15 + 10,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${particle.size}px`,
            filter: theme === 'neon' ? 'drop-shadow(0 0 8px currentColor)' : 
                    theme === 'aurora' ? 'drop-shadow(0 0 10px rgba(138, 43, 226, 0.8))' :
                    theme === 'midnight' ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))' : 'none',
          }}
          animate={getAnimationProps(config.animation, particle, theme)}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: theme === 'neon' ? "easeInOut" : theme === 'aurora' ? "easeInOut" : "linear",
          }}
        >
          {config.emoji}
        </motion.div>
      ))}
    </div>
  );
};
