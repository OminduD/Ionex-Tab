// Reusable Theme-Based Particle Animation Component
import React from 'react';
import { motion } from 'framer-motion';

interface ThemeParticlesProps {
  theme?: string;
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

type ParticleType = 'bubble' | 'firefly' | 'haze' | 'star' | 'cyber' | 'aurora' | 'petal' | 'crystal';

interface ThemeConfig {
  type: ParticleType;
  count: number;
  colors: string[];
}

const themeConfigs: Record<string, ThemeConfig> = {
  ocean: { type: 'bubble', count: 15, colors: ['blue-400', 'cyan-300', 'sky-200'] },
  forest: { type: 'firefly', count: 20, colors: ['green-400', 'emerald-300', 'lime-200'] },
  sunset: { type: 'haze', count: 8, colors: ['orange-400', 'rose-400', 'amber-200'] },
  midnight: { type: 'star', count: 30, colors: ['white', 'indigo-200', 'blue-100'] },
  neon: { type: 'cyber', count: 12, colors: ['fuchsia-500', 'cyan-400', 'violet-500'] },
  aurora: { type: 'aurora', count: 10, colors: ['purple-400', 'teal-300', 'indigo-400'] },
  cherry: { type: 'petal', count: 15, colors: ['pink-300', 'rose-200', 'red-100'] },
  mint: { type: 'crystal', count: 12, colors: ['teal-300', 'emerald-200', 'cyan-100'] },
};

const getParticleStyle = (type: ParticleType, colorName: string) => {
  const baseStyle = "absolute mix-blend-screen";
  
  switch (type) {
    case 'bubble':
      return `${baseStyle} bg-${colorName} rounded-full opacity-40 shadow-[0_0_10px_rgba(255,255,255,0.3)]`;
    case 'firefly':
      return `${baseStyle} bg-${colorName} rounded-full shadow-[0_0_8px_currentColor] text-${colorName}`;
    case 'haze':
      return `${baseStyle} bg-${colorName} rounded-full blur-2xl opacity-20`;
    case 'star':
      return `${baseStyle} bg-${colorName} rounded-full shadow-[0_0_4px_currentColor] text-${colorName}`;
    case 'cyber':
      return `${baseStyle} border-2 border-${colorName} bg-${colorName}/10 box-border opacity-60 shadow-[0_0_5px_currentColor] text-${colorName}`;
    case 'aurora':
      return `${baseStyle} bg-${colorName} rounded-full blur-xl opacity-30`;
    case 'petal':
      return `${baseStyle} bg-${colorName} rounded-tl-xl rounded-br-xl opacity-80 shadow-sm`;
    case 'crystal':
      return `${baseStyle} bg-${colorName} rotate-45 opacity-50 shadow-[0_0_5px_rgba(255,255,255,0.4)]`;
    default:
      return `${baseStyle} bg-${colorName} rounded-full`;
  }
};

const getAnimation = (type: ParticleType, seed: number) => {
  const random = (min: number, max: number) => Math.random() * (max - min) + min;
  
  switch (type) {
    case 'bubble': // Rising bubbles
      return {
        y: [0, -120],
        x: [0, Math.sin(seed) * 20],
        scale: [1, 1.2, 0.8],
        opacity: [0, 0.5, 0],
      };
    case 'firefly': // Wandering dots
      return {
        x: [0, random(-50, 50), random(-50, 50), 0],
        y: [0, random(-50, 50), random(-50, 50), 0],
        opacity: [0.2, 1, 0.2],
        scale: [1, 1.5, 1],
      };
    case 'haze': // Slow floating blobs
      return {
        x: [0, 30, -30, 0],
        y: [0, -30, 30, 0],
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.3, 0.1],
      };
    case 'star': // Twinkling
      return {
        scale: [0.5, 1.5, 0.5],
        opacity: [0.2, 1, 0.2],
      };
    case 'cyber': // Glitchy/Tech movement
      return {
        x: [0, 10, -10, 0],
        y: [0, -10, 10, 0],
        rotate: [0, 90, 180, 270, 360],
        opacity: [0.2, 0.8, 0.2],
        scale: [1, 1.1, 0.9, 1],
      };
    case 'aurora': // Flowing waves
      return {
        y: [0, -40, 0],
        x: [0, Math.sin(seed) * 30],
        scale: [1, 1.5, 1],
        opacity: [0.1, 0.4, 0.1],
        rotate: [0, 45, 0],
      };
    case 'petal': // Falling swaying petals
      return {
        y: [0, 200],
        x: [0, Math.sin(seed) * 40],
        rotate: [0, 360],
        rotateX: [0, 180],
        rotateY: [0, 180],
        opacity: [0, 0.8, 0],
      };
    case 'crystal': // Floating rotating diamonds
      return {
        y: [0, -30, 0],
        rotate: [45, 225],
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.6, 0.2],
      };
    default:
      return {};
  }
};

export const ThemeParticles: React.FC<ThemeParticlesProps> = ({ 
  theme = 'aurora', 
  density = 'medium',
  className = '' 
}) => {
  const config = themeConfigs[theme] || themeConfigs.aurora;
  
  // Adjust particle count based on density
  const densityMultiplier = density === 'low' ? 0.5 : density === 'high' ? 1.5 : 1;
  const particleCount = Math.floor(config.count * densityMultiplier);
  
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const size = config.type === 'firefly' || config.type === 'star' 
      ? Math.random() * 4 + 2 
      : config.type === 'haze' 
        ? Math.random() * 100 + 50 
        : Math.random() * 20 + 10;
        
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    };
  });

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={getParticleStyle(config.type, particle.color)}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={getAnimation(config.type, particle.id)}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: config.type === 'cyber' ? "steps(4)" : "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

