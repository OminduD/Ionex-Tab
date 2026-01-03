import React from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';
import { Trophy, Zap } from 'lucide-react';

export const LevelProgress: React.FC = () => {
    const { stats, progress, xpToNextLevel } = useGamification();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group cursor-pointer"
        >
            {/* Glass Container */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg hover:bg-black/50 transition-colors">

                {/* Level Badge */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full opacity-80"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0.5 bg-black rounded-full flex items-center justify-center z-10">
                        <span className="text-sm font-bold text-white">{stats.level}</span>
                    </div>
                </div>

                {/* Progress Info */}
                <div className="flex flex-col min-w-[120px]">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold mb-1">
                        <span className="text-yellow-400 flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> Level {stats.level}
                        </span>
                        <span className="text-white/60">{Math.floor(stats.xp)} / {xpToNextLevel} XP</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 50, damping: 15 }}
                        />
                    </div>
                </div>

                {/* Streak Badge (if active) */}
                {stats.streakDays > 1 && (
                    <div className="flex items-center gap-1 pl-2 border-l border-white/10">
                        <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400 animate-pulse" />
                        <span className="text-xs font-bold text-cyan-400">{stats.streakDays}</span>
                    </div>
                )}
            </div>

            {/* Hover Tooltip/Details */}
            <div className="absolute top-full left-0 w-full mt-2 p-3 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="text-xs text-white/80 text-center">
                    Next Level: <span className="text-white font-bold">{xpToNextLevel - Math.floor(stats.xp)} XP</span> needed
                </div>
            </div>
        </motion.div>
    );
};
