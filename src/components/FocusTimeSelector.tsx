// src/components/FocusTimeSelector.tsx
// Time duration selector for Focus Mode

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Minus, Plus } from 'lucide-react';

interface Props {
  selectedMinutes: number;
  onSelect: (minutes: number) => void;
}

const PRESET_TIMES = [5, 10, 15, 20, 25, 30, 45, 60, 90];

export const FocusTimeSelector: React.FC<Props> = ({ selectedMinutes, onSelect }) => {
  const handleIncrement = () => {
    const currentIndex = PRESET_TIMES.indexOf(selectedMinutes);
    if (currentIndex < PRESET_TIMES.length - 1) {
      onSelect(PRESET_TIMES[currentIndex + 1]);
    }
  };

  const handleDecrement = () => {
    const currentIndex = PRESET_TIMES.indexOf(selectedMinutes);
    if (currentIndex > 0) {
      onSelect(PRESET_TIMES[currentIndex - 1]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 mb-6"
    >
      {/* Label */}
      <div className="flex items-center gap-2 text-white/70">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Focus Duration</span>
      </div>

      {/* Time selector */}
      <div className="flex items-center gap-4">
        {/* Decrement button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDecrement}
          disabled={selectedMinutes === PRESET_TIMES[0]}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Decrease time"
        >
          <Minus className="w-5 h-5 text-white" />
        </motion.button>

        {/* Time display */}
        <motion.div
          key={selectedMinutes}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="min-w-[140px] text-center"
        >
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            {selectedMinutes}
          </div>
          <div className="text-sm text-white/60 mt-1">
            {selectedMinutes === 1 ? 'minute' : 'minutes'}
          </div>
        </motion.div>

        {/* Increment button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleIncrement}
          disabled={selectedMinutes === PRESET_TIMES[PRESET_TIMES.length - 1]}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Increase time"
        >
          <Plus className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-md">
        {PRESET_TIMES.map((minutes) => (
          <motion.button
            key={minutes}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(minutes)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedMinutes === minutes
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
            }`}
          >
            {minutes}m
          </motion.button>
        ))}
      </div>

      {/* Quick adjust hint */}
      <div className="text-xs text-white/40 flex items-center gap-4">
        <span>Use ± buttons for quick adjust</span>
        <span>•</span>
        <span>Or click preset times</span>
      </div>
    </motion.div>
  );
};

export default FocusTimeSelector;
