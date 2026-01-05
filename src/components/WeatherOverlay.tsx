import React from 'react';
import { motion } from 'framer-motion';

interface WeatherOverlayProps {
    condition: string;
    enabled?: boolean;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = React.memo(({ condition, enabled = true }) => {
    if (!enabled) return null;

    const weatherCondition = condition?.toLowerCase() || '';

    // Rain effect
    const rainEffect = React.useMemo(() => {
        const rainDrops = Array.from({ length: 60 }, (_, i) => {
            const startX = Math.random() * 100; // 0-100%
            const duration = 0.4 + Math.random() * 0.3; // 0.4-0.7s
            const delay = Math.random() * 2; // 0-2s
            const size = Math.random() > 0.7 ? 2 : 1; // Vary drop thickness
            const opacity = 0.3 + Math.random() * 0.4; // 0.3-0.7

            return (
                <motion.div
                    key={`rain-${i}`}
                    className="absolute w-[1px] bg-blue-400/70"
                    style={{
                        left: `${startX}%`,
                        height: `${size === 2 ? '20px' : '15px'}`,
                        width: `${size}px`,
                        opacity,
                        filter: 'blur(0.3px)',
                    }}
                    initial={{ y: '-20px' }}
                    animate={{ y: '100vh' }}
                    transition={{
                        duration,
                        repeat: Infinity,
                        ease: 'linear',
                        delay,
                    }}
                />
            );
        });

        return <div className="absolute inset-0 overflow-hidden pointer-events-none">{rainDrops}</div>;
    }, []);

    // Snow effect
    const snowEffect = React.useMemo(() => {
        const snowflakes = Array.from({ length: 50 }, (_, i) => {
            const startX = Math.random() * 100;
            const endX = startX + (Math.random() * 20 - 10); // Drift left/right
            const duration = 3 + Math.random() * 4; // 3-7s
            const delay = Math.random() * 5;
            const size = 2 + Math.random() * 4; // 2-6px
            const opacity = 0.4 + Math.random() * 0.5; // 0.4-0.9

            return (
                <motion.div
                    key={`snow-${i}`}
                    className="absolute rounded-full bg-white"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${startX}%`,
                        opacity,
                        filter: 'blur(1px)',
                        boxShadow: '0 0 3px rgba(255,255,255,0.8)',
                    }}
                    initial={{ y: '-10px', x: 0 }}
                    animate={{
                        y: '100vh',
                        x: `${endX - startX}vw`,
                        rotate: 360,
                    }}
                    transition={{
                        duration,
                        repeat: Infinity,
                        ease: 'linear',
                        delay,
                        rotate: {
                            duration: duration * 0.5,
                            repeat: Infinity,
                            ease: 'linear',
                        },
                    }}
                />
            );
        });

        return <div className="absolute inset-0 overflow-hidden pointer-events-none">{snowflakes}</div>;
    }, []);

    // Fog/mist effect
    const fogEffect = React.useMemo(() => {
        const fogLayers = Array.from({ length: 3 }, (_, i) => (
            <motion.div
                key={`fog-${i}`}
                className="absolute inset-0 bg-gradient-to-b from-gray-400/5 via-gray-300/10 to-transparent"
                style={{
                    filter: 'blur(40px)',
                }}
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 2,
                }}
            />
        ));

        return <div className="absolute inset-0 overflow-hidden pointer-events-none">{fogLayers}</div>;
    }, []);

    // Clouds effect
    const cloudsEffect = React.useMemo(() => {
        const clouds = Array.from({ length: 4 }, (_, i) => {
            const startY = 10 + Math.random() * 40; // 10-50% from top
            const duration = 25 + Math.random() * 15; // 25-40s
            const delay = i * 7;
            const size = 200 + Math.random() * 150; // 200-350px

            return (
                <motion.div
                    key={`cloud-${i}`}
                    className="absolute rounded-full bg-white/5"
                    style={{
                        width: `${size}px`,
                        height: `${size * 0.4}px`,
                        top: `${startY}%`,
                        filter: 'blur(30px)',
                    }}
                    initial={{ x: '-300px' }}
                    animate={{ x: 'calc(100vw + 300px)' }}
                    transition={{
                        duration,
                        repeat: Infinity,
                        ease: 'linear',
                        delay,
                    }}
                />
            );
        });

        return <div className="absolute inset-0 overflow-hidden pointer-events-none">{clouds}</div>;
    }, []);

    // Thunderstorm effect (rain + lightning)
    const thunderstormEffect = React.useMemo(() => {
        return (
            <>
                {rainEffect}
                <motion.div
                    className="absolute inset-0 bg-white/20 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0, 0.3, 0, 0] }}
                    transition={{
                        duration: 0.2,
                        repeat: Infinity,
                        repeatDelay: 5 + Math.random() * 10,
                    }}
                />
            </>
        );
    }, [rainEffect]);

    // Determine which effect to render
    const renderWeatherEffect = () => {
        if (weatherCondition.includes('thunder') || weatherCondition.includes('storm')) {
            return thunderstormEffect;
        }
        if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
            return rainEffect;
        }
        if (weatherCondition.includes('snow') || weatherCondition.includes('sleet')) {
            return snowEffect;
        }
        if (weatherCondition.includes('fog') || weatherCondition.includes('mist') || weatherCondition.includes('haze')) {
            return fogEffect;
        }
        if (weatherCondition.includes('cloud') || weatherCondition.includes('overcast')) {
            return cloudsEffect;
        }
        return null;
    };

    const effect = renderWeatherEffect();

    if (!effect) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
            {effect}
        </div>
    );
});

export default WeatherOverlay;
