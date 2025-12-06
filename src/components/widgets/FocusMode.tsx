import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Music, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { DeepSpaceBackground } from './DeepSpaceBackground';
import FocusTimeSelector from '../FocusTimeSelector';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface FocusModeProps {
  isActive: boolean;
  onClose: () => void;
}

// Ambient music with YouTube video IDs for embedding
const ambientTracks = [
  { name: 'Cosmic Drift', videoId: 'jfKfPfyJRdk', color: '#a78bfa' }, // Lofi
  { name: 'Nebula Rain', videoId: 'q76bMs-NwRk', color: '#60a5fa' }, // Rain
  { name: 'Deep Ocean', videoId: 'WHPEKLQID4U', color: '#34d399' }, // Ocean
  { name: 'Alien Forest', videoId: 'xNN7iTA57jM', color: '#4ade80' }, // Forest
  { name: 'Cyber City', videoId: '8wLwxytrLDc', color: '#f472b6' }, // Cyberpunk
];

const FocusMode: React.FC<FocusModeProps> = ({ isActive, onClose }) => {
  const [focusDuration, setFocusDuration] = useLocalStorage('focusDuration', 25);
  const [minutes, setMinutes] = useState(focusDuration);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(focusDuration * 60);
  const [initialDuration, setInitialDuration] = useState(focusDuration * 60);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showMusicPanel, setShowMusicPanel] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Mission Complete', {
                body: 'Focus session successful. Returning to base.',
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

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTotalSeconds(initialDuration);
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleDurationChange = (durationMinutes: number) => {
    const newDuration = durationMinutes * 60;
    setFocusDuration(durationMinutes);
    setInitialDuration(newDuration);
    setTotalSeconds(newDuration);
    setIsRunning(false);
  };

  const progressPercent = ((initialDuration - totalSeconds) / initialDuration) * 100;

  // Breathing animation for the timer
  const breathingVariant = {
    inhale: { scale: 1.05, textShadow: "0 0 30px rgba(96, 165, 250, 0.6)", transition: { duration: 4, ease: "easeInOut" } },
    exhale: { scale: 1, textShadow: "0 0 10px rgba(96, 165, 250, 0.2)", transition: { duration: 4, ease: "easeInOut" } }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          {/* Animated Deep Space Background */}
          <DeepSpaceBackground />

          {/* Floating Particles Overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white/20 rounded-full blur-sm"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: Math.random() * 0.5 + 0.2,
                  opacity: 0
                }}
                animate={{
                  y: [null, Math.random() * -100],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
                style={{
                  width: Math.random() * 4 + 1 + 'px',
                  height: Math.random() * 4 + 1 + 'px',
                }}
              />
            ))}
          </div>

          {/* Focus Controls Overlay */}
          <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-4 h-screen justify-center">

            {/* Header */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute top-10 left-0 right-0 flex justify-between items-center px-10"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-[0.2em] uppercase">Deep Focus</h2>
                  <p className="text-[10px] text-blue-300/60 tracking-wider">SYSTEM ONLINE</p>
                </div>
              </div>
              {!isRunning && (
                <button
                  onClick={onClose}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:rotate-90 group"
                >
                  <X className="w-5 h-5 text-white/70 group-hover:text-white" />
                </button>
              )}
            </motion.div>

            {/* Main Timer Interface */}
            <div className="relative flex flex-col items-center justify-center">

              {/* Timer Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                className="relative mb-16"
              >
                {/* Outer Rotating Ring */}
                <div className="absolute -inset-12 rounded-full border border-blue-500/10 animate-[spin_20s_linear_infinite]" />
                <div className="absolute -inset-12 rounded-full border-t border-blue-400/30 animate-[spin_20s_linear_infinite]" />

                {/* Inner Counter-Rotating Ring */}
                <div className="absolute -inset-6 rounded-full border border-purple-500/10 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute -inset-6 rounded-full border-b border-purple-400/30 animate-[spin_15s_linear_infinite_reverse]" />

                {/* Progress SVG */}
                <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                  <svg className="transform -rotate-90 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" width="400" height="400">
                    <circle
                      cx="200"
                      cy="200"
                      r="180"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.03)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="200"
                      cy="200"
                      r="180"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="6"
                      strokeDasharray={`${2 * Math.PI * 180}`}
                      strokeDashoffset={`${2 * Math.PI * 180 * (1 - progressPercent / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Timer Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <motion.div
                      className="text-[120px] font-thin text-white tracking-tighter leading-none tabular-nums drop-shadow-2xl"
                      variants={breathingVariant}
                      animate={isRunning ? ["inhale", "exhale"] : "exhale"}
                      transition={{ repeat: Infinity, repeatType: "reverse" }}
                    >
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </motion.div>
                    <motion.div
                      className="mt-4 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs font-medium tracking-[0.3em] uppercase"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {isRunning ? 'Hyperfocus Active' : 'Ready to Launch'}
                    </motion.div>
                  </div>

                  {/* Glass Background behind text */}
                  <div className="absolute inset-[40px] rounded-full bg-black/20 backdrop-blur-sm border border-white/5 z-10" />
                </div>
              </motion.div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-8 w-full max-w-md z-20">
                {/* Duration Selector */}
                <AnimatePresence>
                  {!isRunning && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <FocusTimeSelector
                        selectedMinutes={focusDuration}
                        onSelect={handleDurationChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Buttons */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-8"
                >
                  <button
                    onClick={resetTimer}
                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all hover:scale-110"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>

                  <button
                    onClick={toggleTimer}
                    className={`relative group p-8 rounded-full transition-all hover:scale-105 ${isRunning
                      ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                      : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                      }`}
                  >
                    <div className={`absolute inset-0 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity ${isRunning ? 'bg-red-500' : 'bg-blue-500'}`} />
                    <div className="relative z-10">
                      {isRunning ? (
                        <Pause className="w-10 h-10 fill-current" />
                      ) : (
                        <Play className="w-10 h-10 fill-current ml-1" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setShowMusicPanel(!showMusicPanel)}
                    className={`p-4 rounded-full transition-all hover:scale-110 border ${showMusicPanel || isMusicPlaying
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                      }`}
                  >
                    <div className="relative">
                      <Music className="w-6 h-6" />
                      {isMusicPlaying && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  </button>
                </motion.div>

                {/* Music Panel */}
                <AnimatePresence>
                  {showMusicPanel && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-4 relative overflow-hidden"
                    >
                      {/* Visualizer Background */}
                      {isMusicPlaying && (
                        <div className="absolute inset-x-0 bottom-0 h-1/3 flex items-end justify-center gap-1 opacity-20 pointer-events-none">
                          {[...Array(20)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-white"
                              animate={{ height: [5, Math.random() * 30 + 10, 5] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <h3 className="text-white/80 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          Audio Stream
                          {isMusicPlaying && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                        </h3>
                        <button onClick={toggleMusic} className="text-white/60 hover:text-white">
                          {isMusicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
                        {ambientTracks.map((track, index) => (
                          <button
                            key={track.name}
                            onClick={() => {
                              setSelectedTrack(index);
                              if (!isMusicPlaying) setIsMusicPlaying(true);
                            }}
                            className={`p-3 rounded-lg text-left transition-all border group relative overflow-hidden ${selectedTrack === index
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-transparent border-transparent text-white/40 hover:bg-white/5'
                              }`}
                          >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${selectedTrack === index ? 'bg-' + track.color : 'bg-transparent'}`} style={{ backgroundColor: selectedTrack === index ? track.color : undefined }} />
                            <span className="text-xs font-medium relative z-10 pl-2">{track.name}</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 relative z-10">
                        <Volume2 className="w-3 h-3 text-white/40" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Hidden YouTube iframe for ambient music - audio only */}
          {isMusicPlaying && (
            <div className="absolute opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
              <iframe
                width="1"
                height="1"
                src={`https://www.youtube.com/embed/${ambientTracks[selectedTrack].videoId}?autoplay=1&loop=1&playlist=${ambientTracks[selectedTrack].videoId}&controls=0&showinfo=0&modestbranding=1`}
                allow="autoplay; encrypted-media"
                title="Ambient Music"
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusMode;
