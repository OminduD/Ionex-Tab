import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Music, Volume2, VolumeX, SkipForward } from 'lucide-react';
import { DeepSpaceBackground } from './DeepSpaceBackground';
import FocusTimeSelector from '../FocusTimeSelector';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface FocusModeProps {
  isActive: boolean;
  onClose: () => void;
}

// Ambient music with YouTube video IDs for embedding
const ambientTracks = [
  { name: 'Lofi Beats', videoId: 'jfKfPfyJRdk', color: '#a78bfa' },
  { name: 'Rain Sounds', videoId: 'q76bMs-NwRk', color: '#60a5fa' },
  { name: 'Ocean Waves', videoId: 'WHPEKLQID4U', color: '#34d399' },
  { name: 'Forest Ambience', videoId: 'xNN7iTA57jM', color: '#4ade80' },
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

  const nextTrack = () => {
    setSelectedTrack((prev) => (prev + 1) % ambientTracks.length);
  };

  const handleDurationChange = (durationMinutes: number) => {
    const newDuration = durationMinutes * 60;
    setFocusDuration(durationMinutes);
    setInitialDuration(newDuration);
    setTotalSeconds(newDuration);
    setIsRunning(false);
  };

  const progressPercent = ((initialDuration - totalSeconds) / initialDuration) * 100;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Animated Deep Space Background */}
          <DeepSpaceBackground />

          {/* Focus Controls Overlay */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Duration Selector - Only show when not running */}
            {!isRunning && (
              <FocusTimeSelector
                selectedMinutes={focusDuration}
                onSelect={handleDurationChange}
              />
            )}

            {/* Timer Display */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <svg className="transform -rotate-90" width="300" height="300">
                {/* Background circle */}
                <circle
                  cx="150"
                  cy="150"
                  r="140"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="150"
                  cy="150"
                  r="140"
                  fill="none"
                  stroke={ambientTracks[selectedTrack].color}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 140}`}
                  strokeDashoffset={`${2 * Math.PI * 140 * (1 - progressPercent / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>

              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className="text-8xl font-bold text-white mb-4"
                  animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
                  transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
                >
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </motion.div>
                <div className="text-white/70 text-lg font-medium">
                  {isRunning ? 'Focus Mode Active' : 'Paused'}
                </div>
              </div>
            </motion.div>

            {/* Control Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 mt-8"
            >
              <button
                onClick={toggleTimer}
                className="p-6 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                {isRunning ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
              </button>

              <button
                onClick={resetTimer}
                className="p-6 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <RotateCcw className="w-8 h-8 text-white" />
              </button>

              <button
                onClick={() => setShowMusicPanel(!showMusicPanel)}
                className="p-6 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <Music className="w-8 h-8 text-white" />
              </button>

              <button
                onClick={onClose}
                className="p-6 rounded-full bg-white/10 backdrop-blur-md hover:bg-red-500/20 transition-all duration-300 border border-white/20"
              >
                <X className="w-8 h-8 text-white" />
              </button>
            </motion.div>

            {/* Music Control Panel */}
            <AnimatePresence>
              {showMusicPanel && (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.9 }}
                  className="mt-8 p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 min-w-[400px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">Ambient Sounds</h3>
                    <button
                      onClick={toggleMusic}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      {isMusicPlaying ? (
                        <Volume2 className="w-5 h-5 text-white" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Track Selector */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {ambientTracks.map((track, index) => (
                      <button
                        key={track.name}
                        onClick={() => setSelectedTrack(index)}
                        className={`p-3 rounded-lg text-white transition-all ${
                          selectedTrack === index
                            ? 'bg-white/30 border-2 border-white/50'
                            : 'bg-white/10 border border-white/20 hover:bg-white/20'
                        }`}
                        style={{
                          backgroundColor: selectedTrack === index ? track.color + '40' : undefined,
                        }}
                      >
                        <div className="font-medium text-sm">{track.name}</div>
                      </button>
                    ))}
                  </div>

                  {/* Volume Control */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-white/70 text-sm">
                      <span>Volume</span>
                      <span>{volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${ambientTracks[selectedTrack].color} 0%, ${ambientTracks[selectedTrack].color} ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`,
                      }}
                    />
                  </div>

                  {/* Current Track Info */}
                  <div className="mt-4 p-3 rounded-lg bg-black/20 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{ambientTracks[selectedTrack].name}</div>
                        <div className="text-white/50 text-xs mt-1">
                          {isMusicPlaying ? 'Now Playing' : 'Paused'}
                        </div>
                      </div>
                      <button
                        onClick={nextTrack}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <SkipForward className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hidden YouTube iframe for ambient music - audio only */}
          {isMusicPlaying && (
            <iframe
              style={{ display: 'none' }}
              src={`https://www.youtube.com/embed/${ambientTracks[selectedTrack].videoId}?autoplay=1&loop=1&playlist=${ambientTracks[selectedTrack].videoId}&volume=${volume}`}
              allow="autoplay"
              title="Ambient Music"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusMode;
