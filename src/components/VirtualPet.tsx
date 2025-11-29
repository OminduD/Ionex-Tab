import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Heart, Utensils } from 'lucide-react';

interface VirtualPetProps {
    theme: string;
    enabled: boolean;
}

const PET_SIZE = 64;
const INACTIVITY_THRESHOLD = 15000; // 15 seconds to sleep
const CHASE_CHANCE = 0.3; // 30% chance to chase cursor

type PetState = 'idle' | 'walking' | 'sleeping' | 'chasing' | 'happy' | 'eating';

interface SpriteConfig {
    url: string;
    width: number;
    height: number;
    rows: {
        idle: number;
        walking: number;
        sleeping: number;
        happy: number;
        chasing: number;
        eating: number;
    };
    steps: number;
    scale: number;
}

interface PetConfig {
    filter: string;
    scale: number;
    speed: number;
    name: string;
    sprite: SpriteConfig;
}

const DOG_SPRITE: SpriteConfig = {
    url: "https://opengameart.org/sites/default/files/dog_medium.png",
    width: 60,
    height: 38,
    rows: {
        happy: 0,
        walking: 1,
        chasing: 2,
        eating: 3,
        sleeping: 4,
        idle: 5
    },
    steps: 6,
    scale: 1.5
};



const VirtualPet: React.FC<VirtualPetProps> = ({ theme, enabled }) => {
    const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight - 100 });
    const [state, setState] = useState<PetState>('idle');
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [foodPos, setFoodPos] = useState<{ x: number, y: number } | null>(null);
    const [speech, setSpeech] = useState<string | null>(null);
    const controls = useAnimation();
    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const isBusy = useRef(false);

    // Theme -> Pet Configuration
    const themePets: Record<string, PetConfig> = {
        ocean: { filter: 'hue-rotate(180deg) brightness(1.1)', scale: 1, speed: 1, name: 'Water Wolf', sprite: DOG_SPRITE },
        aurora: { filter: 'grayscale(1) brightness(1.5) contrast(0.8)', scale: 1.2, speed: 0.8, name: 'Polar Wolf', sprite: DOG_SPRITE },
        sunset: { filter: 'sepia(1) hue-rotate(-40deg) saturate(2)', scale: 1, speed: 1.2, name: 'Fox', sprite: DOG_SPRITE },
        forest: { filter: 'sepia(1) hue-rotate(70deg) saturate(0.8) brightness(0.9)', scale: 1.1, speed: 1.1, name: 'Forest Wolf', sprite: DOG_SPRITE },
        midnight: { filter: 'grayscale(1) brightness(0.4) sepia(1) hue-rotate(240deg)', scale: 0.9, speed: 1.3, name: 'Shadow Wolf', sprite: DOG_SPRITE },
        neon: { filter: 'invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.2) drop-shadow(0 0 5px #0ff)', scale: 1, speed: 1.5, name: 'Cyber Wolf', sprite: DOG_SPRITE },
        cherry: { filter: 'sepia(1) hue-rotate(300deg) saturate(1.5) brightness(1.1)', scale: 0.9, speed: 1, name: 'Sakura Wolf', sprite: DOG_SPRITE },
        mint: { filter: 'sepia(1) hue-rotate(90deg) brightness(1.1)', scale: 0.8, speed: 1.4, name: 'Mint Wolf', sprite: DOG_SPRITE },
    };

    const currentPet = themePets[theme] || themePets['ocean'];
    const sprite = currentPet.sprite;

    // Speech Logic
    useEffect(() => {
        if (!enabled || state === 'sleeping') return;

        const commonPhrases = ["Woof!", "Bark!", "*Pant*", "Zoomies!", "Hello!", "I'm watching you!", "Play with me?"];
        const themePhrases: Record<string, string[]> = {
            ocean: ["Splash!", "Fish?", "Surfs up!"],
            aurora: ["So cold...", "Pretty lights!", "Brrr!"],
            sunset: ["Chasing the sun!", "Golden hour!", "Warm..."],
            forest: ["Squirrel!", "Leaves!", "Nature..."],
            midnight: ["Spooky...", "Full moon!", "Howl!"],
            neon: ["Bzzzt!", "Laser!", "Glow!"],
            cherry: ["Pink!", "Petals!", "Sweet!"],
            mint: ["Fresh!", "Green!", "Cool!"]
        };

        const phrases = [...commonPhrases, ...(themePhrases[theme] || [])];

        const interval = setInterval(() => {
            if (Math.random() < 0.15 && !isBusy.current) { // Increased chance slightly
                setSpeech(phrases[Math.floor(Math.random() * phrases.length)]);
                setTimeout(() => setSpeech(null), 3000);
            }
        }, 8000); // More frequent checks
        return () => clearInterval(interval);
    }, [enabled, state, theme]);

    // Track mouse position & Petting
    useEffect(() => {
        let lastMouseTime = Date.now();
        let mouseSpeed = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            const dt = now - lastMouseTime;
            const dist = Math.sqrt(Math.pow(e.clientX - mousePos.current.x, 2) + Math.pow(e.clientY - mousePos.current.y, 2));
            mouseSpeed = dist / dt;
            lastMouseTime = now;
            mousePos.current = { x: e.clientX, y: e.clientY };

            // Wake up
            if (state === 'sleeping') {
                const distToPet = Math.sqrt(Math.pow(e.clientX - position.x, 2) + Math.pow(e.clientY - position.y, 2));
                if (distToPet < 200) {
                    setState('idle');
                    resetInactivity();
                }
            }

            // Petting (High speed near pet)
            const distToPet = Math.sqrt(Math.pow(e.clientX - position.x, 2) + Math.pow(e.clientY - position.y, 2));
            if (distToPet < 100 && mouseSpeed > 0.5 && state !== 'sleeping' && state !== 'eating' && !isBusy.current) {
                setState('happy');
                isBusy.current = true;
                setTimeout(() => {
                    setState('idle');
                    isBusy.current = false;
                }, 2000);
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [state, position]);

    const resetInactivity = () => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        inactivityTimer.current = setTimeout(() => {
            if (state !== 'sleeping' && !isBusy.current && !foodPos) {
                setState('sleeping');
            }
        }, INACTIVITY_THRESHOLD);
    };

    // Main AI Loop
    useEffect(() => {
        if (!enabled) return;
        resetInactivity();

        const behaviorLoop = async () => {
            if (state === 'sleeping' || isBusy.current) return;

            // Priority: Food
            if (foodPos) {
                setState('chasing');
                const targetX = foodPos.x;
                const targetY = foodPos.y;
                setDirection(targetX > position.x ? 'right' : 'left');
                const dist = Math.sqrt(Math.pow(targetX - position.x, 2) + Math.pow(targetY - position.y, 2));

                if (dist < 50) {
                    // Eat
                    isBusy.current = true;
                    setState('eating');
                    setFoodPos(null);
                    controls.stop();
                    await new Promise(r => setTimeout(r, 2000));
                    setState('happy');
                    await new Promise(r => setTimeout(r, 2000));
                    setState('idle');
                    isBusy.current = false;
                } else {
                    const duration = (dist / 150) / currentPet.speed; // Apply speed
                    await controls.start({ x: targetX, y: targetY, transition: { duration, ease: "linear" } });
                    setPosition({ x: targetX, y: targetY });
                }
                return;
            }

            // Normal Behavior
            const rand = Math.random();
            if (rand < CHASE_CHANCE) {
                // Chase Cursor
                setState('chasing');
                const targetX = mousePos.current.x;
                const targetY = mousePos.current.y;
                const angle = Math.atan2(targetY - position.y, targetX - position.x);
                const stopDist = 100;
                const finalX = targetX - Math.cos(angle) * stopDist;
                const finalY = targetY - Math.sin(angle) * stopDist;

                setDirection(finalX > position.x ? 'right' : 'left');
                const dist = Math.sqrt(Math.pow(finalX - position.x, 2) + Math.pow(finalY - position.y, 2));
                const duration = Math.max(1, (dist / 150) / currentPet.speed);

                await controls.start({ x: finalX, y: finalY, transition: { duration, ease: "linear" } });
                setPosition({ x: finalX, y: finalY });
            } else if (rand < 0.6) {
                // Walk Randomly
                setState('walking');
                const padding = 100;
                const newX = Math.max(padding, Math.min(window.innerWidth - padding, Math.random() * window.innerWidth));
                const newY = Math.max(padding, Math.min(window.innerHeight - padding, Math.random() * window.innerHeight));

                setDirection(newX > position.x ? 'right' : 'left');
                const dist = Math.sqrt(Math.pow(newX - position.x, 2) + Math.pow(newY - position.y, 2));
                const duration = (dist / 60) / currentPet.speed;

                await controls.start({ x: newX, y: newY, transition: { duration, ease: "linear" } });
                setPosition({ x: newX, y: newY });
            } else if (rand < 0.8) {
                // Jump / Hop
                setState('chasing'); // Use run animation for jump
                const jumpHeight = 50;

                // Jump up
                await controls.start({
                    y: position.y - jumpHeight,
                    transition: { duration: 0.3, ease: "easeOut" }
                });
                // Fall down
                await controls.start({
                    y: position.y,
                    transition: { duration: 0.3, ease: "easeIn" }
                });

                setState('idle');
                await new Promise(r => setTimeout(r, 500));
            } else {
                setState('idle');
                await new Promise(r => setTimeout(r, 2000));
            }
        };

        const interval = setInterval(behaviorLoop, 3000);
        return () => clearInterval(interval);
    }, [enabled, state, position, foodPos, currentPet]);

    const handleFeed = (e: React.MouseEvent) => {
        e.stopPropagation();
        const padding = 100;
        const x = Math.max(padding, Math.min(window.innerWidth - padding, Math.random() * window.innerWidth));
        const y = Math.max(padding, Math.min(window.innerHeight - padding, Math.random() * window.innerHeight));
        setFoodPos({ x, y });
    };

    const handlePetClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (state !== 'sleeping' && state !== 'eating') {
            controls.stop(); // Stop movement immediately
            isBusy.current = true;
            setState('happy');
            setTimeout(() => {
                setState('idle');
                isBusy.current = false;
            }, 2000);
        }
    };

    if (!enabled) return null;

    const getSpriteRow = (s: PetState) => {
        return sprite.rows[s] ?? sprite.rows.idle;
    };

    return (
        <>
            {/* Food */}
            <AnimatePresence>
                {foodPos && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed z-40 text-4xl"
                        style={{ left: foodPos.x, top: foodPos.y }}
                    >
                        🍖
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pet Container */}
            <motion.div
                animate={controls}
                initial={{ x: position.x, y: position.y }}
                className="fixed z-50 cursor-pointer group flex items-center justify-center"
                style={{ width: PET_SIZE, height: PET_SIZE }}
                onClick={handlePetClick}
            >
                {/* Context Menu / Actions */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <button
                        onClick={handleFeed}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        title="Feed Pet"
                    >
                        <Utensils className="w-4 h-4 text-orange-500" />
                    </button>
                </div>

                {/* Speech Bubble */}
                <AnimatePresence>
                    {speech && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute -top-24 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-xl shadow-lg border border-gray-100 whitespace-nowrap z-50"
                        >
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-gray-100"></div>
                            <span className="text-sm font-medium text-gray-800 relative z-10">{speech}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative">
                    {/* Direction Flip Wrapper */}
                    <div style={{
                        transform: `scaleX(${direction === 'right' ? -1 : 1})`,
                        transition: 'transform 0.2s'
                    }}>
                        {/* Filter Wrapper - Applied separately to ensure it works */}
                        <div style={{
                            filter: currentPet.filter,
                            transition: 'filter 0.5s ease-in-out'
                        }}>
                            {/* Sprite Animation */}
                            <div
                                style={{
                                    width: sprite.width,
                                    height: sprite.height,
                                    backgroundImage: `url(${sprite.url})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPositionX: 0,
                                    backgroundPositionY: `-${getSpriteRow(state) * sprite.height}px`,
                                    imageRendering: 'pixelated',
                                    transform: `scale(${sprite.scale * currentPet.scale})`, // Apply both sprite and theme scale
                                    transformOrigin: 'bottom center',
                                    willChange: 'background-position, transform',
                                }}
                                className="animate-sprite"
                            />
                        </div>
                    </div>
                    <style>{`
                        @keyframes spriteRun {
                            from { background-position-x: 0; }
                            to { background-position-x: -${sprite.width * sprite.steps}px; }
                        }
                        .animate-sprite {
                            animation: spriteRun 0.8s steps(${sprite.steps}) infinite;
                        }
                    `}</style>
                </div>

                {/* Status Effects */}
                <AnimatePresence>
                    {state === 'sleeping' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0, y: 0 }}
                            animate={{ opacity: 1, scale: 1, y: -20 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-4 right-0"
                        >
                            <div className="text-xl font-bold text-blue-400">Zzz...</div>
                        </motion.div>
                    )}
                    {(state === 'happy' || state === 'eating') && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0, y: 0 }}
                            animate={{ opacity: 1, scale: 1.5, y: -30 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2"
                        >
                            <Heart className="w-6 h-6 text-red-500 fill-red-500 drop-shadow-lg" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};

export default VirtualPet;
