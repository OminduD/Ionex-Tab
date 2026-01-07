import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface MouseTrailProps {
    theme?: string;
}

// Use canvas-based trail for better performance
export const MouseTrail: React.FC<MouseTrailProps> = React.memo(({ theme = 'aurora' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const trailRef = useRef<{ x: number; y: number; alpha: number }[]>([]);
    const isVisibleRef = useRef(true);
    const animationFrameRef = useRef<number>(0);
    const themeColorsRef = useRef({ trail: 'rgba(255,255,255,0.6)', cursor: 'rgba(255,255,255,0.3)' });
    
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Smooth spring animation for cursor
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // Theme colors memoized
    const themeColors = useMemo(() => {
        const colorMap: Record<string, { trail: string; cursor: string }> = {
            cyberpunk: { trail: '#ec4899', cursor: '#22d3ee' },
            neon: { trail: '#22d3ee', cursor: '#d946ef' },
            nature: { trail: '#a3e635', cursor: '#34d399' },
            forest: { trail: '#a3e635', cursor: '#34d399' },
            mint: { trail: '#a3e635', cursor: '#34d399' },
            sunset: { trail: '#f43f5e', cursor: '#f59e0b' },
            cherry: { trail: '#f43f5e', cursor: '#f59e0b' },
            ocean: { trail: '#3b82f6', cursor: '#38bdf8' },
            midnight: { trail: '#818cf8', cursor: '#8b5cf6' },
            aurora: { trail: 'rgba(255,255,255,0.6)', cursor: 'rgba(255,255,255,0.3)' },
        };
        return colorMap[theme] || colorMap.aurora;
    }, [theme]);

    // Keep theme colors ref updated
    useEffect(() => {
        themeColorsRef.current = themeColors;
    }, [themeColors]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size
        const handleResize = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        handleResize();

        // Animation function using ref for colors
        const animate = () => {
            if (!isVisibleRef.current) {
                animationFrameRef.current = 0;
                return;
            }
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw trail
            const trail = trailRef.current;
            for (let i = trail.length - 1; i >= 0; i--) {
                trail[i].alpha -= 0.08; // Fade out faster
                if (trail[i].alpha <= 0) {
                    trail.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(trail[i].x, trail[i].y, 3, 0, Math.PI * 2);
                ctx.fillStyle = themeColorsRef.current.trail;
                ctx.globalAlpha = trail[i].alpha;
                ctx.fill();
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Visibility handling
        const handleVisibilityChange = () => {
            isVisibleRef.current = !document.hidden;
            if (isVisibleRef.current && animationFrameRef.current === 0) {
                animate();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        let lastUpdate = 0;
        const throttleDelay = 25; // ~40fps for trail (reduced from 60fps)
        
        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const now = Date.now();
            if (now - lastUpdate < throttleDelay) return;
            lastUpdate = now;

            // Add to trail (max 8 points for lower memory)
            trailRef.current.push({ x: e.clientX, y: e.clientY, alpha: 0.6 });
            if (trailRef.current.length > 8) {
                trailRef.current.shift();
            }
        };

        // Hide default cursor
        document.body.style.cursor = 'none';

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });
        
        // Start animation loop
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.body.style.cursor = 'auto';
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []); // Empty dependency - animation uses refs

    // Get cursor style class
    const getCursorClass = useMemo(() => {
        const classMap: Record<string, string> = {
            cyberpunk: 'border-2 border-cyan-400 bg-transparent rounded-none rotate-45 w-6 h-6',
            neon: 'border-2 border-fuchsia-500 bg-transparent rounded-full w-6 h-6',
            nature: 'border-2 border-emerald-400 bg-emerald-400/20 rounded-full w-5 h-5 rounded-tl-none',
            forest: 'border-2 border-emerald-400 bg-emerald-400/20 rounded-full w-5 h-5 rounded-tl-none',
            mint: 'border-2 border-emerald-400 bg-emerald-400/20 rounded-full w-5 h-5 rounded-tl-none',
            sunset: 'border-2 border-amber-500 bg-amber-500/20 rounded-full w-6 h-6',
            cherry: 'border-2 border-amber-500 bg-amber-500/20 rounded-full w-6 h-6',
            ocean: 'border-2 border-sky-400 bg-sky-400/20 rounded-full w-5 h-5',
            midnight: 'border-2 border-violet-500 bg-violet-500/20 rounded-full w-4 h-4 rotate-45',
            aurora: 'border-2 border-white bg-white/20 rounded-full w-5 h-5',
        };
        return classMap[theme] || classMap.aurora;
    }, [theme]);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Canvas-based trail for better performance */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ opacity: 0.8 }}
            />

            {/* Main Cursor */}
            <motion.div
                ref={cursorRef}
                className={`absolute flex items-center justify-center ${getCursorClass}`}
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                    boxShadow: `0 0 12px ${themeColors.cursor}`
                }}
            >
                {/* Center Dot */}
                <div className="w-1 h-1 bg-white rounded-full opacity-80" />
            </motion.div>
        </div>
    );
});
