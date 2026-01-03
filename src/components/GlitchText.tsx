import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
    text: string;
    className?: string;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+{}|:<>?';

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className }) => {
    const [displayText, setDisplayText] = useState(text);
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        setDisplayText(text);
    }, [text]);

    const triggerGlitch = () => {
        if (isGlitching) return;
        setIsGlitching(true);

        let iterations = 0;
        const interval = setInterval(() => {
            setDisplayText(
                text
                    .split('')
                    .map((_char, index) => {
                        if (index < iterations) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('')
            );

            if (iterations >= text.length) {
                clearInterval(interval);
                setIsGlitching(false);
            }

            iterations += 1 / 3;
        }, 30);
    };

    useEffect(() => {
        // Random auto-glitch
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                triggerGlitch();
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <motion.span
            className={`relative inline-block ${className}`}
            onHoverStart={triggerGlitch}
            whileHover={{ scale: 1.05 }}
        >
            <span className="relative z-10">{displayText}</span>
            {isGlitching && (
                <>
                    <span className="absolute top-0 left-0 -ml-[2px] text-red-500 opacity-70 animate-pulse z-0">{displayText}</span>
                    <span className="absolute top-0 left-0 ml-[2px] text-cyan-500 opacity-70 animate-pulse z-0">{displayText}</span>
                </>
            )}
        </motion.span>
    );
};
