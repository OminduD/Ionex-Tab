import React from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';
import { Trophy, Lock } from 'lucide-react';

interface AchievementsWidgetProps {
    theme?: string;
}

const AchievementsWidget: React.FC<AchievementsWidgetProps> = ({ theme = 'aurora' }) => {
    const { achievements } = useGamification();
    const { variants, containerStyle } = useThemeAnimation(theme);

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className={`flex flex-col h-full p-4 rounded-3xl relative overflow-hidden ${containerStyle}`}
        >
            <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                    <Trophy className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm tracking-wide">Achievements</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 relative z-10 custom-scrollbar">
                {achievements.map((achievement) => (
                    <motion.div
                        key={achievement.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-xl border transition-all ${achievement.unlocked
                                ? 'bg-white/10 border-white/20'
                                : 'bg-black/20 border-white/5 opacity-60 grayscale'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`text-2xl ${achievement.unlocked ? 'animate-bounce' : ''}`}>
                                {achievement.unlocked ? achievement.icon : <Lock className="w-5 h-5 text-white/30" />}
                            </div>
                            <div>
                                <div className={`text-xs font-bold ${achievement.unlocked ? 'text-white' : 'text-white/50'}`}>
                                    {achievement.title}
                                </div>
                                <div className="text-[10px] text-white/60 leading-tight">
                                    {achievement.description}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </motion.div>
    );
};

export default AchievementsWidget;
