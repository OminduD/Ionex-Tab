import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TextProps {
    text: string;
    className?: string;
}

// Cyberpunk / Neon: Decoding Effect
export const DecodingText: React.FC<TextProps> = ({ text, className }) => {
    const [displayText, setDisplayText] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*';

    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(text.split('').map((_, index) => {
                if (index < iteration) return text[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(''));

            if (iteration >= text.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <span className={`${className} font-mono tracking-widest relative`}>
            {displayText}
            <span className="absolute -inset-1 bg-cyan-500/20 blur-sm animate-pulse" />
        </span>
    );
};

// Nature / Forest: Organic Staggered Rise
export const StaggeredText: React.FC<TextProps> = ({ text, className }) => {
    return (
        <div className={`${className} flex overflow-hidden`}>
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ y: 50, opacity: 0, rotate: 10 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        damping: 12,
                        stiffness: 100,
                        delay: i * 0.05
                    }}
                    className="inline-block origin-bottom"
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </div>
    );
};

// Ocean / Aurora: Wavy Text
export const WavyText: React.FC<TextProps> = ({ text, className }) => {
    return (
        <div className={`${className} flex`}>
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.1
                    }}
                    className="inline-block"
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </div>
    );
};

// Sunset / Cherry: Glow Pulse
export const GlowPulseText: React.FC<TextProps> = ({ text, className }) => {
    return (
        <motion.div
            className={className}
            animate={{
                textShadow: [
                    "0 0 10px rgba(244, 63, 94, 0.5)",
                    "0 0 20px rgba(244, 63, 94, 0.8)",
                    "0 0 10px rgba(244, 63, 94, 0.5)"
                ],
                scale: [1, 1.02, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
        >
            {text}
        </motion.div>
    );
};

// Midnight: Sparkle Reveal
export const SparkleText: React.FC<TextProps> = ({ text, className }) => {
    return (
        <div className={`${className} relative`}>
            <motion.span
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.5 }}
            >
                {text}
            </motion.span>
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-1/2 h-full skew-x-12"
                animate={{ left: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
        </div>
    );
};
