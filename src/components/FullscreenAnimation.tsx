import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FullscreenAnimationProps {
  theme: string;
  isVisible: boolean;
  onComplete: () => void;
}

const FullscreenAnimation: React.FC<FullscreenAnimationProps> = ({ 
  theme, 
  isVisible, 
  onComplete 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const getThemeConfig = () => {
    switch (theme) {
      case 'neon':
        return {
          colors: ['#ec4899', '#3b82f6', '#8b5cf6'],
          type: 'cyberpunk',
          accent: '#00ff9d'
        };
      case 'aurora':
        return {
          colors: ['#8b5cf6', '#3b82f6', '#06b6d4'],
          type: 'ethereal',
          accent: '#ffffff'
        };
      case 'midnight':
        return {
          colors: ['#a78bfa', '#8b5cf6', '#1e1b4b'],
          type: 'cosmic',
          accent: '#fbbf24'
        };
      case 'ocean':
        return {
          colors: ['#06b6d4', '#0284c7', '#0369a1'],
          type: 'aquatic',
          accent: '#e0f2fe'
        };
      case 'forest':
        return {
          colors: ['#10b981', '#059669', '#047857'],
          type: 'nature',
          accent: '#bef264'
        };
      case 'sunset':
        return {
          colors: ['#f59e0b', '#ef4444', '#ec4899'],
          type: 'solar',
          accent: '#fef3c7'
        };
      case 'cherry':
        return {
          colors: ['#ec4899', '#f472b6', '#fda4af'],
          type: 'floral',
          accent: '#fff1f2'
        };
      case 'mint':
        return {
          colors: ['#10b981', '#34d399', '#6ee7b7'],
          type: 'fresh',
          accent: '#f0fdf4'
        };
      default:
        return {
          colors: ['#8b5cf6', '#3b82f6', '#06b6d4'],
          type: 'default',
          accent: '#ffffff'
        };
    }
  };

  const config = getThemeConfig();

  // True 3D Cube Component
  const Cube3D = ({ size, colors }: { size: number, colors: string[] }) => {
    const faceStyle: React.CSSProperties = {
      position: 'absolute',
      width: size,
      height: size,
      border: `2px solid ${colors[1]}`,
      background: `rgba(0,0,0,0.1)`,
      boxShadow: `0 0 20px ${colors[0]} inset, 0 0 30px ${colors[0]}`,
      backfaceVisibility: 'visible',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    return (
      <motion.div
        style={{
          width: size,
          height: size,
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: [0, 360, 720],
          rotateY: [0, 360, 720],
          rotateZ: [0, 180, 360],
        }}
        transition={{ duration: 4, ease: "linear", repeat: Infinity }}
      >
        <div style={{ ...faceStyle, transform: `translateZ(${size / 2}px)`, background: `linear-gradient(45deg, ${colors[0]}80, ${colors[1]}80)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${size / 2}px)`, background: `linear-gradient(45deg, ${colors[1]}80, ${colors[2]}80)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${size / 2}px)`, background: `linear-gradient(45deg, ${colors[2]}80, ${colors[0]}80)` }} />
        <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${size / 2}px)`, background: `linear-gradient(45deg, ${colors[0]}80, ${colors[1]}80)` }} />
        <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${size / 2}px)`, background: `linear-gradient(45deg, ${colors[1]}80, ${colors[2]}80)` }} />
        <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${size / 2}px)`, background: `linear-gradient(45deg, ${colors[2]}80, ${colors[0]}80)` }} />
        
        {/* Inner glowing core */}
        <div className="absolute inset-0 m-auto rounded-full blur-md" 
             style={{ 
               width: size/2, 
               height: size/2, 
               background: config.accent,
               boxShadow: `0 0 50px ${config.accent}, 0 0 100px ${colors[0]}`
             }} 
        />
      </motion.div>
    );
  };

  // True 3D Pyramid Component
  const Pyramid3D = ({ size, colors }: { size: number, colors: string[] }) => {
    const height = size * 0.866; // Height of equilateral triangle
    
    return (
      <motion.div
        style={{
          width: size,
          height: size,
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 720],
          rotateZ: [0, 180],
        }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
      >
        {/* Base */}
        <div style={{
          position: 'absolute',
          width: size,
          height: size,
          background: `${colors[0]}80`,
          transform: 'rotateX(90deg) translateZ(0px)',
          boxShadow: `0 0 30px ${colors[0]}`,
        }} />
        
        {/* Sides */}
        {[0, 90, 180, 270].map((deg, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 0,
            height: 0,
            borderLeft: `${size/2}px solid transparent`,
            borderRight: `${size/2}px solid transparent`,
            borderBottom: `${height}px solid ${colors[i % 3]}80`,
            transformOrigin: '50% 100%',
            transform: `rotateY(${deg}deg) rotateX(30deg) translateZ(${size/4}px) translateY(-${size/2}px)`,
            filter: `drop-shadow(0 0 10px ${colors[i % 3]})`,
          }} />
        ))}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden flex items-center justify-center"
          style={{ 
            background: `radial-gradient(circle at center, ${config.colors[0]}40 0%, #000000 100%)`,
            perspective: '1500px',
          }}
        >
          {/* Warp Speed Background Effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute left-1/2 top-1/2 w-1 h-40 bg-white rounded-full"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${config.accent}, transparent)`,
                  width: Math.random() * 2 + 1 + 'px',
                  height: Math.random() * 200 + 100 + 'px',
                }}
                initial={{ 
                  x: (Math.random() - 0.5) * window.innerWidth, 
                  y: (Math.random() - 0.5) * window.innerHeight, 
                  z: -1000, 
                  opacity: 0 
                }}
                animate={{ 
                  z: [0, 1000], 
                  opacity: [0, 1, 0],
                  scale: [0.1, 1]
                }}
                transition={{ 
                  duration: Math.random() * 1 + 0.5, 
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          {/* Main 3D Object Container */}
          <motion.div
            initial={{ scale: 0, z: -2000 }}
            animate={{ 
              scale: [0, 1.5, 50], // Fly through effect at the end
              z: [-2000, 0, 2000],
              rotateZ: [0, 180]
            }}
            transition={{ 
              duration: 3.5, 
              times: [0, 0.8, 1],
              ease: "easeInOut" 
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {config.type === 'cyberpunk' || config.type === 'default' ? (
              <Cube3D size={200} colors={config.colors} />
            ) : (
              <Pyramid3D size={250} colors={config.colors} />
            )}
          </motion.div>

          {/* Shockwave Rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`shockwave-${i}`}
              className="absolute rounded-full border-4"
              style={{
                borderColor: config.colors[i % 3],
                boxShadow: `0 0 50px ${config.colors[i % 3]}, inset 0 0 50px ${config.colors[i % 3]}`,
              }}
              initial={{ width: 0, height: 0, opacity: 1, borderWidth: 20 }}
              animate={{ 
                width: ['0vw', '150vw'], 
                height: ['0vw', '150vw'], 
                opacity: [1, 0],
                borderWidth: [20, 0]
              }}
              transition={{ 
                duration: 2, 
                delay: 0.5 + (i * 0.3),
                ease: "easeOut" 
              }}
            />
          ))}

          {/* Floating Text/Symbol */}
          <motion.div
            className="absolute text-9xl font-bold text-white mix-blend-overlay"
            initial={{ opacity: 0, scale: 0, filter: 'blur(20px)' }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0.5, 1.5],
              filter: ['blur(20px)', 'blur(0px)', 'blur(10px)']
            }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            IONEX
          </motion.div>

          {/* Particle Explosion */}
          {[...Array(30)].map((_, i) => {
            const angle = (i * 360) / 30;
            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: config.colors[i % 3],
                  boxShadow: `0 0 20px ${config.colors[i % 3]}`,
                }}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: Math.cos(angle * Math.PI / 180) * 800,
                  y: Math.sin(angle * Math.PI / 180) * 800,
                  scale: [0, 1, 0],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.8,
                  ease: "easeOut"
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullscreenAnimation;
