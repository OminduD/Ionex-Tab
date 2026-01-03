import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const MouseTrail: React.FC = () => {
    const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setTrail((prev) => [
                ...prev.slice(-15), // Keep last 15 points
                { x: e.clientX, y: e.clientY, id: Date.now() }
            ]);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[100]">
            {trail.map((point) => (
                <motion.div
                    key={point.id}
                    initial={{ opacity: 0.8, scale: 1 }}
                    animate={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-[2px]"
                    style={{
                        left: point.x,
                        top: point.y,
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            ))}
        </div>
    );
};
