import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, CheckCircle2, Flame, Target, Calendar, Zap } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';
import { useGamification } from '../../context/GamificationContext';
import { Todo } from '../../types';

interface FocusSession {
  date: string;
  duration: number; // minutes
  completed: boolean;
}

interface ProductivityStats {
  focusSessions: FocusSession[];
  lastUpdated: string;
}

interface ProductivityDashboardProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const ProductivityDashboard: React.FC<ProductivityDashboardProps> = ({ theme = 'aurora', size = 'medium' }) => {
  const [todos] = useLocalStorage<Todo[]>('homeTabTodos', []);
  const [productivityData] = useLocalStorage<ProductivityStats>('ionex_productivity', {
    focusSessions: [],
    lastUpdated: new Date().toISOString()
  });
  const { stats } = useGamification();
  const { variants, containerStyle } = useThemeAnimation(theme);

  const isSmall = size === 'small';

  // Calculate stats
  const calculations = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    // Tasks stats
    const completedTasks = todos.filter(t => t.completed).length;
    const totalTasks = todos.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Focus time stats (last 7 days)
    const weekFocusTime = productivityData.focusSessions
      .filter(s => last7Days.includes(s.date))
      .reduce((acc, s) => acc + s.duration, 0);

    const todayFocusTime = productivityData.focusSessions
      .filter(s => s.date === today)
      .reduce((acc, s) => acc + s.duration, 0);

    // Daily focus chart data
    const chartData = last7Days.map(date => {
      const dayTotal = productivityData.focusSessions
        .filter(s => s.date === date)
        .reduce((acc, s) => acc + s.duration, 0);
      return { date, minutes: dayTotal };
    });

    const maxMinutes = Math.max(...chartData.map(d => d.minutes), 60);

    return {
      completedTasks,
      totalTasks,
      completionRate,
      weekFocusTime,
      todayFocusTime,
      chartData,
      maxMinutes,
      last7Days
    };
  }, [todos, productivityData]);

  const formatMinutes = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
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
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h3 className={`font-bold text-white ${isSmall ? 'text-sm' : 'text-base'}`}>Productivity</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Tasks Completed */}
        <div className="p-3 bg-black/30 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Tasks</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">{calculations.completedTasks}</span>
            <span className="text-xs text-white/40">/ {calculations.totalTasks}</span>
          </div>
          <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${calculations.completionRate}%` }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
            />
          </div>
        </div>

        {/* Streak */}
        <div className="p-3 bg-black/30 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Streak</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">{stats.streakDays}</span>
            <span className="text-xs text-white/40">days</span>
          </div>
          <div className="text-[10px] text-orange-400 mt-1">
            {stats.streakDays > 0 ? '🔥 Keep going!' : 'Start today!'}
          </div>
        </div>

        {/* Today's Focus */}
        <div className="p-3 bg-black/30 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Today</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">{formatMinutes(calculations.todayFocusTime)}</span>
          </div>
          <div className="text-[10px] text-blue-400 mt-1">Focus time</div>
        </div>

        {/* Level & XP */}
        <div className="p-3 bg-black/30 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Level</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">{stats.level}</span>
          </div>
          <div className="text-[10px] text-yellow-400 mt-1">{stats.xp} XP</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="flex-1 p-3 bg-black/20 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-white/60">Weekly Focus Time</span>
          <span className="ml-auto text-xs text-primary font-medium">
            {formatMinutes(calculations.weekFocusTime)}
          </span>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-1 h-20">
          {calculations.chartData.map((day, i) => {
            const height = calculations.maxMinutes > 0
              ? (day.minutes / calculations.maxMinutes) * 100
              : 0;
            const isToday = i === calculations.chartData.length - 1;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-full flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 4)}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className={`w-full rounded-t-sm ${isToday
                        ? 'bg-gradient-to-t from-primary to-primary/60'
                        : day.minutes > 0
                          ? 'bg-white/20'
                          : 'bg-white/5'
                      }`}
                  />
                </div>
                <span className={`text-[8px] ${isToday ? 'text-primary font-medium' : 'text-white/40'}`}>
                  {getDayName(day.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="flex items-center justify-between mt-2 px-1">
        <div className="flex items-center gap-1 text-[10px] text-white/40">
          <Target className="w-3 h-3" />
          <span>{stats.tasksCompleted} total completed</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-white/40">
          <Calendar className="w-3 h-3" />
          <span>This week</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductivityDashboard;
