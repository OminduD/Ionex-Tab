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
      const timer = setTimeout(onComplete, 3500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const getThemeConfig = () => {
    switch (theme) {
      case 'neon':
        return {
          colors: ['#ec4899', '#3b82f6', '#8b5cf6'],
          shape: 'diamond', // Lightning diamond
          size: 300,
        };
      case 'aurora':
        return {
          colors: ['#8b5cf6', '#3b82f6', '#06b6d4'],
          shape: 'sphere', // Glowing sphere
          size: 280,
        };
      case 'midnight':
        return {
          colors: ['#a78bfa', '#8b5cf6', '#1e1b4b'],
          shape: 'star', // Star burst
          size: 320,
        };
      case 'ocean':
        return {
          colors: ['#06b6d4', '#0284c7', '#0369a1'],
          shape: 'hexagon', // Water crystal
          size: 290,
        };
      case 'forest':
        return {
          colors: ['#10b981', '#059669', '#047857'],
          shape: 'triangle', // Tree shape
          size: 310,
        };
      case 'sunset':
        return {
          colors: ['#f59e0b', '#ef4444', '#ec4899'],
          shape: 'circle', // Sun
          size: 300,
        };
      case 'cherry':
        return {
          colors: ['#ec4899', '#f472b6', '#fda4af'],
          shape: 'petal', // Flower petal
          size: 280,
        };
      case 'mint':
        return {
          colors: ['#10b981', '#34d399', '#6ee7b7'],
          shape: 'leaf', // Leaf shape
          size: 270,
        };
      default:
        return {
          colors: ['#8b5cf6', '#3b82f6', '#06b6d4'],
          shape: 'sphere',
          size: 290,
        };
    }
  };

  const config = getThemeConfig();

  // Render 3D geometric shape based on theme
  const render3DShape = () => {
    const baseStyle = {
      transformStyle: 'preserve-3d' as const,
      width: `${config.size}px`,
      height: `${config.size}px`,
      position: 'relative' as const,
    };

    switch (config.shape) {
      case 'diamond':
        return (
          <div style={baseStyle}>
            {/* Diamond/Crystal shape */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${config.colors[0]}, ${config.colors[1]})`,
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  transform: `rotateZ(${i * 45}deg)`,
                  opacity: 0.8,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 0.4, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        );
      
      case 'sphere':
        return (
          <div style={baseStyle}>
            {/* Glowing sphere with layers */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${config.colors[i % 3]}, transparent)`,
                  transform: `scale(${1 - i * 0.15})`,
                }}
                animate={{
                  scale: [1 - i * 0.15, 1.2 - i * 0.15, 1 - i * 0.15],
                  opacity: [0.9, 0.3, 0.9],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        );
      
      case 'star':
        return (
          <div style={baseStyle}>
            {/* Star burst */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-4 h-32"
                style={{
                  background: `linear-gradient(to bottom, ${config.colors[i % 3]}, transparent)`,
                  transformOrigin: 'top center',
                  transform: `rotate(${i * 30}deg) translateY(-50%)`,
                }}
                animate={{
                  scaleY: [0.5, 1.5, 0.5],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        );
      
      case 'hexagon':
        return (
          <div style={baseStyle}>
            {/* Hexagonal crystal */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(60deg, ${config.colors[0]}, ${config.colors[1]})`,
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                  transform: `rotateZ(${i * 60}deg)`,
                  opacity: 0.7,
                }}
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  rotate: [i * 60, i * 60 + 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );
      
      case 'triangle':
        return (
          <div style={baseStyle}>
            {/* Triangle/Tree shape */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${config.colors[0]}, ${config.colors[1]})`,
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  transform: `scale(${1 - i * 0.25}) translateY(${i * 20}px)`,
                  opacity: 0.8 - i * 0.2,
                }}
                animate={{
                  scale: [1 - i * 0.25, 1.2 - i * 0.25, 1 - i * 0.25],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        );
      
      case 'circle':
        return (
          <div style={baseStyle}>
            {/* Sun circle with rays */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${config.colors[0]}, ${config.colors[1]})`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  `0 0 60px ${config.colors[0]}`,
                  `0 0 120px ${config.colors[1]}`,
                  `0 0 60px ${config.colors[0]}`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-20"
                style={{
                  background: `linear-gradient(to bottom, ${config.colors[0]}, transparent)`,
                  transformOrigin: 'top center',
                  transform: `rotate(${i * 22.5}deg) translateY(-50%)`,
                }}
                animate={{
                  scaleY: [1, 1.5, 1],
                  opacity: [0.8, 0.3, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        );
      
      case 'petal':
        return (
          <div style={baseStyle}>
            {/* Flower petal arrangement */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-24 h-40"
                style={{
                  background: `radial-gradient(ellipse at top, ${config.colors[0]}, ${config.colors[1]})`,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  transformOrigin: 'bottom center',
                  transform: `rotate(${i * 45}deg) translateY(-50%)`,
                  opacity: 0.7,
                }}
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  rotate: [i * 45, i * 45 + 15, i * 45],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        );
      
      case 'leaf':
        return (
          <div style={baseStyle}>
            {/* Leaf shapes */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-32 h-48"
                style={{
                  background: `linear-gradient(135deg, ${config.colors[0]}, ${config.colors[1]})`,
                  borderRadius: '100% 0%',
                  transformOrigin: 'bottom center',
                  transform: `rotate(${i * 60}deg) translateY(-40%)`,
                  opacity: 0.8,
                }}
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  rotate: [i * 60, i * 60 + 20, i * 60],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );
      
      default:
        return (
          <div style={baseStyle}>
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${config.colors[0]}, ${config.colors[1]})`,
              }}
            />
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          style={{ 
            background: `radial-gradient(circle at 50% 50%, ${config.colors[0]}20, transparent)`,
            perspective: '1000px',
          }}
        >
          {/* Giant 3D Geometric Shape - Center Stage */}
          <motion.div
            initial={{ scale: 0, rotateX: 0, rotateY: 0, rotateZ: 0, z: -1000 }}
            animate={{ 
              scale: [0, 1.5, 1.2, 0],
              rotateX: [0, 360, 720],
              rotateY: [0, 360, 720],
              rotateZ: [0, 180, 360],
              z: [-1000, 200, 100, -1000],
            }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ 
              transformStyle: 'preserve-3d',
              filter: `drop-shadow(0 0 60px ${config.colors[0]}) drop-shadow(0 0 120px ${config.colors[1]})`,
            }}
          >
            {render3DShape()}
          </motion.div>

          {/* Rotating 3D Cubes Around */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`cube-${i}`}
              initial={{ 
                scale: 0,
                rotateX: 0,
                rotateY: 0,
              }}
              animate={{ 
                scale: [0, 1, 0],
                rotateX: [0, 360],
                rotateY: [0, 360],
                x: [0, Math.cos((i * 30 * Math.PI) / 180) * 400],
                y: [0, Math.sin((i * 30 * Math.PI) / 180) * 400],
              }}
              transition={{ 
                duration: 2.5,
                delay: i * 0.08,
                ease: "easeOut",
              }}
              className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2"
              style={{ 
                transformStyle: 'preserve-3d',
                background: `linear-gradient(135deg, ${config.colors[i % 3]}, ${config.colors[(i + 1) % 3]})`,
                boxShadow: `0 0 30px ${config.colors[i % 3]}`,
                borderRadius: '8px',
              }}
            />
          ))}

          {/* Orbiting Geometric Particles */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 360) / 24;
            const radius = 300 + (i % 3) * 100;
            const shapeType = ['square', 'circle', 'triangle'][i % 3];
            
            return (
              <motion.div
                key={`orbit-${i}`}
                initial={{ 
                  scale: 0,
                  opacity: 0,
                }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  x: [0, Math.cos((angle * Math.PI) / 180) * radius, Math.cos((angle * Math.PI) / 180) * radius * 1.5],
                  y: [0, Math.sin((angle * Math.PI) / 180) * radius, Math.sin((angle * Math.PI) / 180) * radius * 1.5],
                  rotate: [0, 720],
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.03,
                  ease: "easeOut",
                }}
                className="absolute top-1/2 left-1/2 w-8 h-8"
                style={{ 
                  background: `linear-gradient(135deg, ${config.colors[i % 3]}, ${config.colors[(i + 1) % 3]})`,
                  filter: `drop-shadow(0 0 15px ${config.colors[i % 3]})`,
                  borderRadius: shapeType === 'circle' ? '50%' : shapeType === 'square' ? '4px' : '0',
                  clipPath: shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
                }}
              />
            );
          })}

          {/* Pulsing Energy Rings */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 4 + i * 0.5],
                opacity: [0.8, 0],
              }}
              transition={{ 
                duration: 2.5,
                delay: i * 0.15,
                ease: "easeOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4"
              style={{ 
                borderColor: config.colors[i % config.colors.length],
                width: '100px',
                height: '100px',
                boxShadow: `0 0 30px ${config.colors[i % config.colors.length]}`,
              }}
            />
          ))}

          {/* Spiral Trails */}
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={`trail-${i}`}
              initial={{ 
                scale: 0,
                rotate: i * 22.5,
                x: 0,
                y: 0,
              }}
              animate={{ 
                scale: [0, 1.5, 0],
                rotate: i * 22.5 + 720,
                x: [0, Math.cos((i * 22.5 * Math.PI) / 180) * 500],
                y: [0, Math.sin((i * 22.5 * Math.PI) / 180) * 500],
                opacity: [0, 1, 0],
              }}
              transition={{ 
                duration: 2.8,
                delay: i * 0.05,
                ease: "easeOut",
              }}
              className="absolute left-1/2 top-1/2 w-2 h-40 rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${config.colors[i % config.colors.length]}, transparent)`,
                transformOrigin: 'top center',
                filter: `blur(2px) drop-shadow(0 0 10px ${config.colors[i % config.colors.length]})`,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullscreenAnimation;
