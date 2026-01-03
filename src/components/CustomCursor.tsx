import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CustomCursorProps {
    theme: string;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ theme }) => {
    const [isHovering, setIsHovering] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring configuration for the "laggy" follower
    const springConfig = { damping: 25, stiffness: 150 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if hovering over clickable elements
            if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('clickable') ||
                target.style.cursor === 'pointer'
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Theme-based colors
    const getColors = () => {
        switch (theme) {
            case 'cyberpunk': return { dot: '#06b6d4', ring: '#22d3ee' }; // Cyan
            case 'neon': return { dot: '#d946ef', ring: '#f0abfc' }; // Fuchsia
            case 'nature': return { dot: '#10b981', ring: '#34d399' }; // Emerald
            case 'forest': return { dot: '#22c55e', ring: '#4ade80' }; // Green
            case 'ocean': return { dot: '#3b82f6', ring: '#60a5fa' }; // Blue
            case 'sunset': return { dot: '#f97316', ring: '#fb923c' }; // Orange
            case 'midnight': return { dot: '#8b5cf6', ring: '#a78bfa' }; // Violet
            default: return { dot: '#ffffff', ring: '#ffffff' };
        }
    };

    const colors = getColors();

    return (
        <>
            {/* Global CSS to hide default cursor */}
            <style>{`
                body, button, a, input, textarea {
                    cursor: none !important;
                }
            `}</style>

            {/* Main Dot (Follows instantly) */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    backgroundColor: colors.dot,
                }}
            />

            {/* Lagging Ring (Follows with spring) */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border-2"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                    borderColor: colors.ring,
                }}
                animate={{
                    width: isHovering ? 40 : 20,
                    height: isHovering ? 40 : 20,
                    opacity: isHovering ? 0.8 : 0.4,
                    backgroundColor: isHovering ? `${colors.ring}20` : 'transparent', // Slight fill on hover
                }}
                transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 300
                }}
            />
        </>
    );
};
