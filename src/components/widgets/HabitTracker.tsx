import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, Check, X, Flame, Calendar, TrendingUp } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';
import { useGamification } from '../../context/GamificationContext';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  createdAt: string;
}

interface HabitTrackerProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const ICONS = ['💪', '📚', '🧘', '💧', '🏃', '🎯', '✍️', '🌱', '😴', '🍎', '💊', '🎵'];
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

const HabitTracker: React.FC<HabitTrackerProps> = ({ theme = 'aurora', size = 'medium' }) => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('ionex_habits', []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: ICONS[0],
    color: COLORS[0],
    frequency: 'daily' as 'daily' | 'weekly'
  });
  const { variants, containerStyle } = useThemeAnimation(theme);
  const { addXp } = useGamification();

  const isSmall = size === 'small';
  const today = new Date().toISOString().split('T')[0];

  // Get last 7 days
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
  }, []);

  const addHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name.trim(),
      icon: newHabit.icon,
      color: newHabit.color,
      frequency: newHabit.frequency,
      completedDates: [],
      createdAt: new Date().toISOString()
    };

    setHabits([...habits, habit]);
    setNewHabit({ name: '', icon: ICONS[0], color: COLORS[0], frequency: 'daily' });
    setShowAddForm(false);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;

      const isCompleted = habit.completedDates.includes(date);
      const newCompletedDates = isCompleted
        ? habit.completedDates.filter(d => d !== date)
        : [...habit.completedDates, date];

      // Award XP for completing a habit today
      if (!isCompleted && date === today) {
        addXp(10);
      }

      return { ...habit, completedDates: newCompletedDates };
    }));
  };

  const getStreak = (habit: Habit): number => {
    let streak = 0;
    const sortedDates = [...habit.completedDates].sort().reverse();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (sortedDates.includes(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const getCompletionRate = (habit: Habit): number => {
    const completed = last7Days.filter(d => habit.completedDates.includes(d)).length;
    return Math.round((completed / 7) * 100);
  };

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
          <Target className="w-4 h-4 text-primary" />
          <h3 className={`font-bold text-white ${isSmall ? 'text-sm' : 'text-base'}`}>Habits</h3>
          <span className="text-xs text-white/40 bg-white/10 px-1.5 py-0.5 rounded">{habits.length}</span>
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
              placeholder="Habit name..."
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-primary/50"
            />
            
            {/* Icon Selection */}
            <div className="flex gap-1 flex-wrap">
              {ICONS.map(icon => (
                <button
                  key={icon}
                  onClick={() => setNewHabit({ ...newHabit, icon })}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    newHabit.icon === icon ? 'bg-white/20 scale-110' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Color Selection */}
            <div className="flex gap-1.5">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setNewHabit({ ...newHabit, color })}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    newHabit.color === color ? 'scale-125 ring-2 ring-white/50' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addHabit}
              className="w-full py-1.5 bg-primary/30 hover:bg-primary/50 rounded-lg text-xs font-medium text-white transition-colors"
            >
              Add Habit
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Week Header */}
      <div className="grid grid-cols-[1fr,repeat(7,24px)] gap-1 mb-2 px-1">
        <div />
        {last7Days.map((date, _i) => {
          const dayDate = new Date(date);
          const isToday = date === today;
          return (
            <div
              key={date}
              className={`text-center text-[9px] font-medium ${isToday ? 'text-primary' : 'text-white/40'}`}
            >
              {dayDate.toLocaleDateString('en-US', { weekday: 'narrow' })}
            </div>
          );
        })}
      </div>

      {/* Habits List */}
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <AnimatePresence>
          {habits.map((habit) => {
            const streak = getStreak(habit);
            const completionRate = getCompletionRate(habit);

            return (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-2 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-all"
              >
                {/* Habit Header */}
                <div className="grid grid-cols-[1fr,repeat(7,24px)] gap-1 items-center">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{habit.icon}</span>
                    <span className="text-xs font-medium text-white truncate">{habit.name}</span>
                  </div>

                  {/* Completion Checkboxes */}
                  {last7Days.map((date) => {
                    const isCompleted = habit.completedDates.includes(date);
                    const isToday = date === today;

                    return (
                      <button
                        key={date}
                        onClick={() => toggleHabitCompletion(habit.id, date)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'text-white'
                            : isToday
                              ? 'bg-white/10 border border-dashed border-white/30 hover:border-white/50'
                              : 'bg-white/5 hover:bg-white/10'
                        }`}
                        style={isCompleted ? { backgroundColor: habit.color } : undefined}
                      >
                        {isCompleted && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>

                {/* Habit Stats */}
                <div className="flex items-center justify-between mt-2 px-1">
                  <div className="flex items-center gap-3">
                    {streak > 0 && (
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span className="text-[10px] text-orange-400">{streak} day{streak > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-white/40" />
                      <span className="text-[10px] text-white/40">{completionRate}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1 rounded text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {habits.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-white/40">
            <Target className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs">No habits yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Start tracking a habit
            </button>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {habits.length > 0 && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 text-[10px] text-white/40">
            <Calendar className="w-3 h-3" />
            <span>Today: {habits.filter(h => h.completedDates.includes(today)).length}/{habits.length}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-primary">
            <Flame className="w-3 h-3" />
            <span>Best streak: {Math.max(...habits.map(h => getStreak(h)), 0)} days</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HabitTracker;
