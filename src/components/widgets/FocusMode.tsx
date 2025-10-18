import React, { useState, useEffect } from 'react';

interface FocusModeProps {
  isActive: boolean;
  onClose: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ isActive, onClose }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play notification sound or show notification
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

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center backdrop-blur-xl">
      <div className="text-center text-white">
        <h2 className="text-3xl font-bold mb-8">Focus Mode</h2>
        
        <div className="text-8xl font-mono font-bold mb-8">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex gap-4 justify-center mb-8">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-full font-semibold transition-colors"
            >
              Start
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-full font-semibold transition-colors"
            >
              Pause
            </button>
          )}
          <button
            onClick={resetTimer}
            className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-full font-semibold transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="flex gap-3 justify-center mb-8">
          <button
            onClick={() => setPresetTime(5)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            5 min
          </button>
          <button
            onClick={() => setPresetTime(15)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            15 min
          </button>
          <button
            onClick={() => setPresetTime(25)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            25 min
          </button>
          <button
            onClick={() => setPresetTime(45)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            45 min
          </button>
        </div>

        <button
          onClick={onClose}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          Exit Focus Mode
        </button>
      </div>
    </div>
  );
};

export default FocusMode;
