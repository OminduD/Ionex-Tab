import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface MouseTrailProps {
    theme?: string;
}

export const MouseTrail: React.FC<MouseTrailProps> = ({ theme = 'aurora' }) => {
    const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Smooth spring animation for cursor
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            setTrail((prev) => [
                ...prev.slice(-20),
                { x: e.clientX, y: e.clientY, id: Date.now() }
            ]);
        };

        // Hide default cursor
        document.body.style.cursor = 'none';

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.style.cursor = 'auto';
        };
    }, []);

    // Theme-specific styles
    const getThemeStyles = () => {
        switch (theme) {
            case 'cyberpunk':
                return {
                    cursor: 'border-2 border-cyan-400 bg-transparent rounded-none rotate-45 w-6 h-6',
                    trail: 'bg-pink-500 rounded-none w-2 h-2',
                    trailGlow: '0 0 10px #ec4899',
                    cursorGlow: '0 0 15px #22d3ee'
                };
            case 'neon':
                return {
                    cursor: 'border-2 border-fuchsia-500 bg-transparent rounded-full w-6 h-6',
                    trail: 'bg-cyan-400 rounded-full w-1.5 h-1.5',
                    trailGlow: '0 0 10px #22d3ee',
                    cursorGlow: '0 0 15px #d946ef'
                };
            case 'nature':
            case 'forest':
            case 'mint':
                return {
                    cursor: 'border-2 border-emerald-400 bg-emerald-400/20 rounded-full w-5 h-5 rounded-tl-none',
                    trail: 'bg-lime-400 rounded-full w-2 h-2 rounded-tl-none',
                    trailGlow: '0 0 8px #a3e635',
                    cursorGlow: '0 0 12px #34d399'
                };
            case 'sunset':
            case 'cherry':
                return {
                    cursor: 'border-2 border-amber-500 bg-amber-500/20 rounded-full w-6 h-6',
                    trail: 'bg-rose-500 rounded-full w-1.5 h-1.5',
                    trailGlow: '0 0 10px #f43f5e',
                    cursorGlow: '0 0 15px #f59e0b'
                };
            case 'ocean':
                return {
                    cursor: 'border-2 border-sky-400 bg-sky-400/20 rounded-full w-5 h-5',
                    trail: 'bg-blue-500 rounded-full w-2 h-2',
                    trailGlow: '0 0 8px #3b82f6',
                    cursorGlow: '0 0 12px #38bdf8'
                };
            case 'midnight':
                return {
                    cursor: 'border-2 border-violet-500 bg-violet-500/20 rounded-full w-4 h-4 rotate-45',
                    trail: 'bg-indigo-400 rounded-full w-1 h-1',
                    trailGlow: '0 0 8px #818cf8',
                    cursorGlow: '0 0 12px #8b5cf6'
                };
            default: // aurora and others
                return {
                    cursor: 'border-2 border-white bg-white/20 rounded-full w-5 h-5',
                    trail: 'bg-white rounded-full w-1.5 h-1.5',
                    trailGlow: '0 0 8px rgba(255,255,255,0.5)',
                    cursorGlow: '0 0 12px rgba(255,255,255,0.3)'
                };
        }
    };

    const styles = getThemeStyles();

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Trail */}
            {trail.map((point) => (
                <motion.div
                    key={point.id}
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.8 }}
                    className={`absolute ${styles.trail}`}
                    style={{
                        left: point.x,
                        top: point.y,
                        transform: 'translate(-50%, -50%)',
                        boxShadow: styles.trailGlow
                    }}
                />
            ))}

            {/* Main Cursor */}
            <motion.div
                className={`absolute flex items-center justify-center ${styles.cursor}`}
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                    boxShadow: styles.cursorGlow
                }}
            >
                {/* Center Dot */}
                <div className="w-1 h-1 bg-white rounded-full opacity-80" />
            </motion.div>
        </div>
    );
};
