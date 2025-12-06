import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface VirtualPetProps {
    theme: string;
    enabled: boolean;
}

const PET_SIZE = 64;
const INACTIVITY_THRESHOLD = 180000; // 3 minutes to sleep


type PetState = 'idle' | 'walking' | 'sleeping' | 'chasing' | 'happy' | 'dancing' | 'zoomies';

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

        const commonPhrases = ["Woof!", "Bark!", "*Pant*", "Zoomies!", "Hello!", "I'm watching you!", "Play with me?", "Let's dance!"];
        const themePhrases: Record<string, string[]> = {
            ocean: ["Splash!", "Fish?", "Surfs up!", "Wavy!"],
            aurora: ["So cold...", "Pretty lights!", "Brrr!", "Magical!"],
            sunset: ["Chasing the sun!", "Golden hour!", "Warm...", "Relaxing..."],
            forest: ["Squirrel!", "Leaves!", "Nature...", "Wild!"],
            midnight: ["Spooky...", "Full moon!", "Howl!", "Shadows..."],
            neon: ["Bzzzt!", "Laser!", "Glow!", "Cyber!"],
            cherry: ["Pink!", "Petals!", "Sweet!", "Blossom!"],
            mint: ["Fresh!", "Green!", "Cool!", "Breezy!"]
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

            // Wake up on any significant mouse movement
            if (state === 'sleeping' && dist > 5) {
                setState('idle');
                resetInactivity();

                // Themed Wake-up Greeting
                const wakeUpGreetings: Record<string, string> = {
                    ocean: "Ready to swim!",
                    aurora: "The lights are back!",
                    sunset: "Good evening!",
                    forest: "Adventure time!",
                    midnight: "The night is young!",
                    neon: "System online!",
                    cherry: "Hello blossom!",
                    mint: "Fresh start!"
                };
                setSpeech(wakeUpGreetings[theme] || "I'm awake!");
                setTimeout(() => setSpeech(null), 3000);
            } else {
                resetInactivity();
            }

            // Petting (High speed near pet)
            const distToPet = Math.sqrt(Math.pow(e.clientX - position.x, 2) + Math.pow(e.clientY - position.y, 2));
            if (distToPet < 100 && mouseSpeed > 0.5 && state !== 'sleeping' && state !== 'zoomies' && !isBusy.current) {
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
    }, [state, position, theme]);

    const resetInactivity = () => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        inactivityTimer.current = setTimeout(() => {
            if (state !== 'sleeping' && !isBusy.current) {
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

            const rand = Math.random();

            if (rand < 0.1) {
                // Dance!
                isBusy.current = true;
                setState('dancing');
                // Perform a little dance (jump up and down)
                await controls.start({ y: position.y - 30, transition: { duration: 0.2, yoyo: 3 } });
                await new Promise(r => setTimeout(r, 1000));
                setState('idle');
                isBusy.current = false;
            } else if (rand < 0.2) {
                // Zoomies!
                isBusy.current = true;
                setState('zoomies');

                // Run in a circle/zigzag
                for (let i = 0; i < 4; i++) {
                    const offsetX = (Math.random() - 0.5) * 300;
                    const offsetY = (Math.random() - 0.5) * 300;
                    const targetX = Math.max(50, Math.min(window.innerWidth - 50, position.x + offsetX));
                    const targetY = Math.max(50, Math.min(window.innerHeight - 50, position.y + offsetY));

                    setDirection(targetX > position.x ? 'right' : 'left');
                    await controls.start({
                        x: targetX,
                        y: targetY,
                        transition: { duration: 0.5, ease: "easeInOut" }
                    });
                    setPosition({ x: targetX, y: targetY });
                }

                setState('idle');
                isBusy.current = false;
            } else if (rand < 0.4) { // Increased chase chance
                // Chase Cursor
                setState('chasing');
                const targetX = mousePos.current.x;
                const targetY = mousePos.current.y;
                const angle = Math.atan2(targetY - position.y, targetX - position.x);
                const stopDist = 120;
                const finalX = targetX - Math.cos(angle) * stopDist;
                const finalY = targetY - Math.sin(angle) * stopDist;

                setDirection(finalX > position.x ? 'right' : 'left');
                const dist = Math.sqrt(Math.pow(finalX - position.x, 2) + Math.pow(finalY - position.y, 2));
                const duration = Math.max(0.8, (dist / 200) / currentPet.speed); // Smoother duration

                await controls.start({ x: finalX, y: finalY, transition: { duration, ease: "easeOut" } });
                setPosition({ x: finalX, y: finalY });
            } else if (rand < 0.7) {
                // Walk Randomly
                setState('walking');
                const padding = 100;
                const newX = Math.max(padding, Math.min(window.innerWidth - padding, Math.random() * window.innerWidth));
                const newY = Math.max(padding, Math.min(window.innerHeight - padding, Math.random() * window.innerHeight));

                setDirection(newX > position.x ? 'right' : 'left');
                const dist = Math.sqrt(Math.pow(newX - position.x, 2) + Math.pow(newY - position.y, 2));
                const duration = (dist / 80) / currentPet.speed; // Slower, smoother walk

                await controls.start({ x: newX, y: newY, transition: { duration, ease: "easeInOut" } });
                setPosition({ x: newX, y: newY });
            } else {
                setState('idle');
                await new Promise(r => setTimeout(r, 2000));
            }
        };

        const interval = setInterval(behaviorLoop, 3500);
        return () => clearInterval(interval);
    }, [enabled, state, position, currentPet]);



    const handlePetClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (state !== 'sleeping' && state !== 'zoomies') {
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
        if (s === 'dancing') return sprite.rows.happy;
        if (s === 'zoomies') return sprite.rows.chasing;
        return sprite.rows[s as keyof typeof sprite.rows] ?? sprite.rows.idle;
    };

    return (
        <>
            {/* Pet Container */}
            <motion.div
                animate={controls}
                initial={{ x: position.x, y: position.y }}
                className="fixed z-50 cursor-pointer group flex items-center justify-center"
                style={{ width: PET_SIZE, height: PET_SIZE }}
                onClick={handlePetClick}
            >
                {/* Context Menu / Actions - Removed Feed */}
                {/* <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                   
                </div> */}

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
                    {(state === 'happy' || state === 'dancing') && (
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
