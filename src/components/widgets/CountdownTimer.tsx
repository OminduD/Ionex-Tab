import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Plus, Trash2, Bell, X, Clock } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';
import { useGamification } from '../../context/GamificationContext';

interface CountdownItem {
  id: string;
  title: string;
  targetDate: string;
  color: string;
  createdAt: string;
  notifyOnComplete: boolean;
}

interface CountdownTimerProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

const CountdownTimer: React.FC<CountdownTimerProps> = ({ theme = 'aurora', size = 'medium' }) => {
  const [countdowns, setCountdowns] = useLocalStorage<CountdownItem[]>('ionex_countdowns', []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCountdown, setNewCountdown] = useState({
    title: '',
    targetDate: '',
    color: COLORS[0],
    notifyOnComplete: true
  });
  const { variants, containerStyle } = useThemeAnimation(theme);
  const { addXp } = useGamification();
  const [now, setNow] = useState(new Date());

  const isSmall = size === 'small';

  // Update every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateTimeLeft = useCallback((targetDate: string) => {
    const target = new Date(targetDate);
    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isComplete: false
    };
  }, [now]);

  const addCountdown = () => {
    if (!newCountdown.title.trim() || !newCountdown.targetDate) return;

    const countdown: CountdownItem = {
      id: Date.now().toString(),
      title: newCountdown.title.trim(),
      targetDate: newCountdown.targetDate,
      color: newCountdown.color,
      notifyOnComplete: newCountdown.notifyOnComplete,
      createdAt: new Date().toISOString()
    };

    setCountdowns([...countdowns, countdown]);
    setNewCountdown({ title: '', targetDate: '', color: COLORS[0], notifyOnComplete: true });
    setShowAddForm(false);
    addXp(5);
  };

  const deleteCountdown = (id: string) => {
    setCountdowns(countdowns.filter(c => c.id !== id));
  };

  // Sort by closest to now
  const sortedCountdowns = [...countdowns].sort((a, b) => {
    const timeA = new Date(a.targetDate).getTime() - now.getTime();
    const timeB = new Date(b.targetDate).getTime() - now.getTime();
    return timeA - timeB;
  });

  const formatTimeUnit = (value: number, unit: string) => {
    return (
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-white tabular-nums">{value.toString().padStart(2, '0')}</span>
        <span className="text-[8px] text-white/40 uppercase tracking-wider">{unit}</span>
      </div>
    );
  };

  // Get min date for datetime-local input (current time)
  const minDate = new Date().toISOString().slice(0, 16);

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-3' : 'p-4'} rounded-3xl ${containerStyle}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-primary" />
          <h3 className={`font-bold text-white ${isSmall ? 'text-sm' : 'text-base'}`}>Countdowns</h3>
          <span className="text-xs text-white/40 bg-white/10 px-1.5 py-0.5 rounded">{countdowns.length}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 bg-black/30 rounded-xl border border-white/10 space-y-2"
          >
            <input
              type="text"
              placeholder="Event title..."
              value={newCountdown.title}
              onChange={(e) => setNewCountdown({ ...newCountdown, title: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-primary/50"
            />
            <input
              type="datetime-local"
              min={minDate}
              value={newCountdown.targetDate}
              onChange={(e) => setNewCountdown({ ...newCountdown, targetDate: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primary/50"
            />
            <div className="flex gap-1.5">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setNewCountdown({ ...newCountdown, color })}
                  className={`w-5 h-5 rounded-full transition-transform ${newCountdown.color === color ? 'scale-125 ring-2 ring-white/50' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addCountdown}
              className="w-full py-1.5 bg-primary/30 hover:bg-primary/50 rounded-lg text-xs font-medium text-white transition-colors"
            >
              Add Countdown
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdowns List */}
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <AnimatePresence>
          {sortedCountdowns.map((countdown) => {
            const timeLeft = calculateTimeLeft(countdown.targetDate);
            return (
              <motion.div
                key={countdown.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="relative p-3 bg-black/30 rounded-xl border border-white/10 overflow-hidden"
              >
                {/* Color Accent */}
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ backgroundColor: countdown.color }}
                />

                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 ml-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: countdown.color }}
                    />
                    <span className="text-xs font-medium text-white truncate max-w-[150px]">
                      {countdown.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteCountdown(countdown.id)}
                    className="p-1 rounded text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Countdown Display */}
                {timeLeft.isComplete ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center gap-2 py-2"
                  >
                    <Bell className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="text-sm font-bold text-yellow-400">Completed!</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center gap-3 ml-2">
                    {timeLeft.days > 0 && formatTimeUnit(timeLeft.days, 'days')}
                    {formatTimeUnit(timeLeft.hours, 'hrs')}
                    {formatTimeUnit(timeLeft.minutes, 'min')}
                    {formatTimeUnit(timeLeft.seconds, 'sec')}
                  </div>
                )}

                {/* Target Date */}
                <div className="flex items-center justify-center gap-1 mt-2 ml-2">
                  <Clock className="w-3 h-3 text-white/30" />
                  <span className="text-[10px] text-white/30">
                    {new Date(countdown.targetDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {countdowns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-white/40">
            <Timer className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">No countdowns yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Add your first countdown
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CountdownTimer;
