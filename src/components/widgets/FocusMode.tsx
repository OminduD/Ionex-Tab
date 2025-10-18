import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Music, Volume2, VolumeX } from 'lucide-react';

interface FocusModeProps {
  isActive: boolean;
  onClose: () => void;
}

// Ambient music URLs (YouTube no-copyright lofi/ambient)
const ambientTracks = [
  { name: 'Lofi Beats', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
  { name: 'Rain Sounds', url: 'https://www.youtube.com/watch?v=q76bMs-NwRk' },
  { name: 'Ocean Waves', url: 'https://www.youtube.com/watch?v=WHPEKLQID4U' },
  { name: 'Forest Ambience', url: 'https://www.youtube.com/watch?v=xNN7iTA57jM' },
];

const FocusMode: React.FC<FocusModeProps> = ({ isActive, onClose }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // Particle animation states
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);

  useEffect(() => {
    // Generate particles for background animation
    const particleCount = 30;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Focus Session Complete!', {
                body: 'Great job! Time for a break.',
                icon: '/icon48.png'
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  useEffect(() => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    setMinutes(mins);
    setSeconds(secs);
  }, [totalSeconds]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTotalSeconds(25 * 60);
  };

  const setPresetTime = (mins: number) => {
    setTotalSeconds(mins * 60);
    setIsRunning(false);
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  if (!isActive) return null;

  const progress = ((25 * 60 - totalSeconds) / (25 * 60)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Animated particles background */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: ['-100vh', '100vh'],
            x: [0, Math.random() * 40 - 20],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Breathing circle animation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0.3 }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 text-center text-white max-w-2xl px-6">
        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </motion.button>

        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent"
        >
          Focus Mode
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="text-white/70 mb-8"
        >
          Breathe in. Focus. Achieve.
        </motion.p>

        {/* Timer display with circular progress */}
        <div className="relative w-80 h-80 mx-auto mb-8">
          {/* Progress circle */}
          <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>

          {/* Timer text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="text-9xl font-mono font-bold"
              animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
            >
              {String(minutes).padStart(2, '0')}
              <span className="text-white/50">:</span>
              {String(seconds).padStart(2, '0')}
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center mb-8">
          <AnimatePresence mode="wait">
            {!isRunning ? (
              <motion.button
                key="start"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startTimer}
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-full font-semibold transition-all shadow-lg flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start
              </motion.button>
            ) : (
              <motion.button
                key="pause"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={pauseTimer}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 rounded-full font-semibold transition-all shadow-lg flex items-center gap-2"
              >
                <Pause className="w-5 h-5" />
                Pause
              </motion.button>
            )}
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-all backdrop-blur-md flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </motion.button>
        </div>

        {/* Preset times */}
        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {[5, 15, 25, 45, 60].map((mins) => (
            <motion.button
              key={mins}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPresetTime(mins)}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-md"
            >
              {mins} min
            </motion.button>
          ))}
        </div>

        {/* Music controls */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              <span className="font-medium">Ambient Sound</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMusic}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {ambientTracks.map((track, index) => (
              <motion.a
                key={index}
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedTrack === index
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => setSelectedTrack(index)}
              >
                {track.name}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FocusMode;
