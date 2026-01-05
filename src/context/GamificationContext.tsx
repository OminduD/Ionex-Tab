import React, { createContext, useContext, useState, useEffect } from 'react';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    condition: (stats: GameStats) => boolean;
}

interface GameStats {
    xp: number;
    level: number;
    tasksCompleted: number;
    streakDays: number;
    lastActiveDate: string;
}

interface GamificationContextType {
    stats: GameStats;
    achievements: Achievement[];
    addXp: (amount: number) => void;
    completeTask: () => void;
    xpToNextLevel: number;
    progress: number;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const INITIAL_STATS: GameStats = {
    xp: 0,
    level: 1,
    tasksCompleted: 0,
    streakDays: 0,
    lastActiveDate: new Date().toISOString().split('T')[0]
};

const ACHIEVEMENTS_DATA: Omit<Achievement, 'unlocked'>[] = [
    {
        id: 'novice',
        title: 'Novice',
        description: 'Complete your first task',
        icon: '🌱',
        condition: (stats) => stats.tasksCompleted >= 1
    },
    {
        id: 'on_fire',
        title: 'On Fire',
        description: 'Reach a 3-day streak',
        icon: '🔥',
        condition: (stats) => stats.streakDays >= 3
    },
    {
        id: 'task_master',
        title: 'Task Master',
        description: 'Complete 50 tasks',
        icon: '🏆',
        condition: (stats) => stats.tasksCompleted >= 50
    },
    {
        id: 'level_5',
        title: 'High Five',
        description: 'Reach Level 5',
        icon: '⭐',
        condition: (stats) => stats.level >= 5
    }
];

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stats, setStats] = useState<GameStats>(() => {
        const saved = localStorage.getItem('ionex_gamification');
        return saved ? JSON.parse(saved) : INITIAL_STATS;
    });

    const [achievements, setAchievements] = useState<Achievement[]>(() => {
        const saved = localStorage.getItem('ionex_achievements');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge saved state (unlocked status) with static data (functions)
                return ACHIEVEMENTS_DATA.map(staticAch => {
                    const savedAch = parsed.find((p: Achievement) => p.id === staticAch.id);
                    return {
                        ...staticAch,
                        unlocked: savedAch ? savedAch.unlocked : false
                    };
                });
            } catch (e) {
                console.error('Failed to parse achievements', e);
                return ACHIEVEMENTS_DATA.map(a => ({ ...a, unlocked: false }));
            }
        }
        return ACHIEVEMENTS_DATA.map(a => ({ ...a, unlocked: false }));
    });

    useEffect(() => {
        localStorage.setItem('ionex_gamification', JSON.stringify(stats));
    }, [stats]);

    useEffect(() => {
        localStorage.setItem('ionex_achievements', JSON.stringify(achievements));
    }, [achievements]);

    // Check for streak updates on mount
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (stats.lastActiveDate !== today) {
            const lastDate = new Date(stats.lastActiveDate);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Continue streak
                setStats(prev => ({ ...prev, streakDays: prev.streakDays + 1, lastActiveDate: today }));
            } else if (diffDays > 1) {
                // Reset streak
                setStats(prev => ({ ...prev, streakDays: 1, lastActiveDate: today }));
            }
        }
    }, []);

    const xpToNextLevel = stats.level * 100;
    const progress = (stats.xp / xpToNextLevel) * 100;

    const checkAchievements = (currentStats: GameStats) => {
        setAchievements(prev => prev.map(ach => {
            if (!ach.unlocked && ach.condition(currentStats)) {
                // Achievement Unlocked!
                // In a real app, we'd trigger a toast notification here
                return { ...ach, unlocked: true };
            }
            return ach;
        }));
    };

    const addXp = (amount: number) => {
        setStats(prev => {
            let newXp = prev.xp + amount;
            let newLevel = prev.level;
            let required = newLevel * 100;

            while (newXp >= required) {
                newXp -= required;
                newLevel++;
                required = newLevel * 100;
            }

            const newStats = { ...prev, xp: newXp, level: newLevel };
            checkAchievements(newStats);
            return newStats;
        });
    };

    const completeTask = () => {
        setStats(prev => {
            const newStats = { ...prev, tasksCompleted: prev.tasksCompleted + 1 };
            checkAchievements(newStats);
            return newStats;
        });
        addXp(10); // Base XP for task
    };

    const value = React.useMemo(() => ({
        stats,
        achievements,
        addXp,
        completeTask,
        xpToNextLevel,
        progress
    }), [stats, achievements, xpToNextLevel, progress]);

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};
