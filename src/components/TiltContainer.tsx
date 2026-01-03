import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltContainerProps {
    children: React.ReactNode;
    className?: string;
    maxTilt?: number; // Maximum tilt angle in degrees
    glareOpacity?: number; // Opacity of the glare effect (0-1)
    scale?: number; // Scale on hover
}

export const TiltContainer: React.FC<TiltContainerProps> = ({
    children,
    className = '',
    maxTilt = 15,
    glareOpacity = 0.4,
    scale = 1.02
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for tilt
    const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]);

    // Glare effect calculation
    const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
    const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXRel = e.clientX - rect.left;
        const mouseYRel = e.clientY - rect.top;

        const xPct = (mouseXRel / width) - 0.5;
        const yPct = (mouseYRel / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <motion.div
            ref={ref}
            className={`relative perspective-1000 ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: 'preserve-3d',
                rotateX,
                rotateY,
            }}
            whileHover={{ scale }}
        >
            {/* Content */}
            <div style={{ transform: 'translateZ(20px)' }}>
                {children}
            </div>

            {/* Glare Effect */}
            <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
                style={{
                    opacity: isHovered ? glareOpacity : 0,
                    background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
                    mixBlendMode: 'overlay',
                    transform: 'translateZ(1px)' // Ensure it sits on top
                }}
                transition={{ duration: 0.2 }}
            />
        </motion.div>
    );
};
