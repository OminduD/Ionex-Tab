import React, { useEffect, useState } from 'react';
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
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setStage(1);
      const timer1 = setTimeout(() => setStage(2), 2000); // Explosion phase
      const timer2 = setTimeout(onComplete, 4000); // End
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        setStage(0);
      };
    }
  }, [isVisible, onComplete]);

  const getThemeConfig = () => {
    switch (theme) {
      case 'neon':
        return { colors: ['#ff00ff', '#00ffff', '#ffff00'], bg: '#000000' };
      case 'aurora':
        return { colors: ['#60a5fa', '#34d399', '#a78bfa'], bg: '#0f172a' };
      case 'midnight':
        return { colors: ['#a78bfa', '#8b5cf6', '#1e1b4b'], bg: '#0f172a' };
      case 'ocean':
        return { colors: ['#06b6d4', '#0284c7', '#0369a1'], bg: '#0c4a6e' };
      case 'forest':
        return { colors: ['#10b981', '#059669', '#047857'], bg: '#064e3b' };
      case 'sunset':
        return { colors: ['#f59e0b', '#ef4444', '#ec4899'], bg: '#451a03' };
      case 'cherry':
        return { colors: ['#ec4899', '#f472b6', '#fda4af'], bg: '#831843' };
      case 'mint':
        return { colors: ['#10b981', '#34d399', '#6ee7b7'], bg: '#064e3b' };
      default:
        return { colors: ['#3b82f6', '#8b5cf6', '#ec4899'], bg: '#000000' };
    }
  };

  const config = getThemeConfig();

  // Generate random data streams - reduced from 20 to 10 for performance
  const dataStreams = React.useMemo(() => Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 1,
    chars: Array.from({ length: 8 }).map(() => Math.random() > 0.5 ? '1' : '0').join(' ')
  })), []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center bg-black perspective-1000"
        >
          {/* Background Grid - simplified */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
          </div>

          {/* Data Streams - reduced count */}
          {dataStreams.map((stream) => (
            <motion.div
              key={stream.id}
              className="absolute top-0 text-xs font-mono text-green-500/50 writing-vertical-rl"
              style={{ left: `${stream.x}%` }}
              initial={{ y: -1000 }}
              animate={{ y: '100vh' }}
              transition={{
                duration: stream.duration,
                repeat: Infinity,
                ease: "linear",
                delay: stream.delay
              }}
            >
              {stream.chars}
            </motion.div>
          ))}

          {/* Central Portal System */}
          <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>

            {/* Rotating Rings - reduced from 5 to 3 */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute rounded-full border border-white/30"
                style={{
                  width: 300 + i * 150,
                  height: 300 + i * 150,
                  borderWidth: 1,
                  borderColor: config.colors[i % 3],
                  boxShadow: `0 0 20px ${config.colors[i % 3]}`,
                }}
                animate={{
                  rotateX: [0, 360],
                  rotateY: [0, 360],
                  scale: stage === 2 ? [1, 20] : [1, 1],
                  opacity: stage === 2 ? [1, 0] : 1,
                }}
                transition={{
                  duration: 10 - i * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}

            {/* Core Energy Sphere */}
            <motion.div
              className="absolute w-32 h-32 rounded-full blur-md"
              style={{
                background: `radial-gradient(circle, ${config.colors[0]}, ${config.colors[1]})`,
                boxShadow: `0 0 100px ${config.colors[0]}`,
              }}
              animate={{
                scale: stage === 2 ? [1, 50] : [1, 1.5, 1],
                opacity: stage === 2 ? [1, 0] : [0.8, 1, 0.8],
              }}
              transition={{
                duration: stage === 2 ? 0.5 : 2,
                repeat: stage === 2 ? 0 : Infinity,
              }}
            />

            {/* Text Reveal */}
            <motion.div
              className="absolute z-50 text-8xl font-black text-white tracking-tighter mix-blend-overlay"
              initial={{ scale: 0, opacity: 0, filter: 'blur(20px)' }}
              animate={{
                scale: stage === 2 ? [1, 5] : [0, 1],
                opacity: stage === 2 ? [1, 0] : [0, 1],
                filter: stage === 2 ? 'blur(0px)' : ['blur(20px)', 'blur(0px)'],
              }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              IONEX
            </motion.div>
          </div>

          {/* Hyper-Speed Lines (Stage 2) - reduced from 20 to 12 */}
          {stage === 2 && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`line-${i}`}
                  className="absolute w-[200vw] h-1 bg-white"
                  style={{
                    rotate: i * 30,
                    transformOrigin: 'center',
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                />
              ))}
            </div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullscreenAnimation;
