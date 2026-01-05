import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Scan, Battery, Smile, Utensils, Play, Moon, X } from 'lucide-react';

interface VirtualPetProps {
    theme: string;
    enabled: boolean;
}

const PET_SIZE = 64;
const INACTIVITY_THRESHOLD = 180000; // 3 minutes to sleep


type PetState = 'idle' | 'walking' | 'sleeping' | 'chasing' | 'happy' | 'dancing' | 'zoomies' | 'scanning' | 'glitching' | 'recharging' | 'eating';

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
        scanning?: number;
        glitching?: number;
    };
    steps: number;
    scale: number;
    isRobot?: boolean;
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
    scale: 1.5,
    isRobot: false
};

const ROBOT_DOG_SPRITE: SpriteConfig = {
    // Fallback to dog sprite with robotic filters since the external URL might be unstable/broken
    url: "https://opengameart.org/sites/default/files/dog_medium.png",
    width: 60,
    height: 38,
    rows: {
        idle: 5,
        walking: 1,
        chasing: 2,
        happy: 0,
        sleeping: 4,
        eating: 3,
        scanning: 5, // Reuse idle for scanning
        glitching: 2 // Reuse chasing for glitching
    },
    steps: 6,
    scale: 1.5,
    isRobot: true
};



const VirtualPet: React.FC<VirtualPetProps> = ({ theme, enabled }) => {
    const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight - 100 });
    const [state, setState] = useState<PetState>('idle');
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [speech, setSpeech] = useState<string | null>(null);
    const [showHUD, setShowHUD] = useState(false);

    // Needs System
    const [energy, setEnergy] = useState(100);
    const [happiness, setHappiness] = useState(100);

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
        neon: { filter: 'hue-rotate(180deg) brightness(1.2) drop-shadow(0 0 5px #0ff)', scale: 1.2, speed: 1.5, name: 'Cyber Hound', sprite: ROBOT_DOG_SPRITE },
        cyberpunk: { filter: 'hue-rotate(280deg) brightness(1.1) drop-shadow(0 0 8px #d946ef)', scale: 1.3, speed: 1.6, name: 'Meca Dog', sprite: ROBOT_DOG_SPRITE },
        cherry: { filter: 'sepia(1) hue-rotate(300deg) saturate(1.5) brightness(1.1)', scale: 0.9, speed: 1, name: 'Sakura Wolf', sprite: DOG_SPRITE },
        mint: { filter: 'sepia(1) hue-rotate(90deg) brightness(1.1)', scale: 0.8, speed: 1.4, name: 'Mint Wolf', sprite: DOG_SPRITE },
    };

    const currentPet = themePets[theme] || themePets['ocean'];
    const sprite = currentPet.sprite;

    // Needs Decay
    useEffect(() => {
        if (!enabled || state === 'sleeping') return;

        const decayInterval = setInterval(() => {
            setEnergy(prev => Math.max(0, prev - 1));
            setHappiness(prev => Math.max(0, prev - 0.5));
        }, 10000); // Decay every 10s

        return () => clearInterval(decayInterval);
    }, [enabled, state]);

    // Auto-Sleep at low energy
    useEffect(() => {
        if (energy < 10 && state !== 'sleeping' && !isBusy.current) {
            setState('sleeping');
            setSpeech(sprite.isRobot ? "LOW BATTERY..." : "So tired...");
            setTimeout(() => setSpeech(null), 3000);
        }
    }, [energy, state, sprite.isRobot]);


    // Speech Logic
    useEffect(() => {
        if (!enabled || state === 'sleeping') return;

        const commonPhrases = ["Woof!", "Bark!", "*Pant*", "Zoomies!", "Hello!", "I'm watching you!", "Play with me?", "Let's dance!"];
        const robotPhrases = ["SYSTEM ONLINE", "SCANNING...", "TARGET ACQUIRED", "BATTERY: " + energy + "%", "DOWNLOADING TREATS...", "BINARY BARK", "01001000 01001001"];

        const themePhrases: Record<string, string[]> = {
            ocean: ["Splash!", "Fish?", "Surfs up!", "Wavy!"],
            aurora: ["So cold...", "Pretty lights!", "Brrr!", "Magical!"],
            sunset: ["Chasing the sun!", "Golden hour!", "Warm...", "Relaxing..."],
            forest: ["Squirrel!", "Leaves!", "Nature...", "Wild!"],
            midnight: ["Spooky...", "Full moon!", "Howl!", "Shadows..."],
            neon: ["Bzzzt!", "Laser!", "Glow!", "Cyber!"],
            cyberpunk: ["NETRUNNER DETECTED", "GLITCH IN MATRIX", "NEON VIBES", "CHROME PAWS"],
            cherry: ["Pink!", "Petals!", "Sweet!", "Blossom!"],
            mint: ["Fresh!", "Green!", "Cool!", "Breezy!"]
        };

        const phrases = sprite.isRobot
            ? [...robotPhrases, ...(themePhrases[theme] || [])]
            : [...commonPhrases, ...(themePhrases[theme] || [])];

        const interval = setInterval(() => {
            if (Math.random() < 0.15 && !isBusy.current && !showHUD) {
                setSpeech(phrases[Math.floor(Math.random() * phrases.length)]);
                setTimeout(() => setSpeech(null), 3000);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [enabled, state, theme, sprite.isRobot, energy, showHUD]);

    const lastMouseMoveTime = useRef(0);

    // Track mouse position & Interaction
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            // Throttle to ~10fps (100ms) to reduce CPU usage
            if (now - lastMouseMoveTime.current < 100) {
                // Still update position for smooth chasing, but skip heavy logic
                mousePos.current = { x: e.clientX, y: e.clientY };
                return;
            }
            lastMouseMoveTime.current = now;

            const dist = Math.sqrt(Math.pow(e.clientX - mousePos.current.x, 2) + Math.pow(e.clientY - mousePos.current.y, 2));
            mousePos.current = { x: e.clientX, y: e.clientY };

            // Wake up
            if (state === 'sleeping' && dist > 5 && energy > 20) { // Only wake if enough energy
                setState('idle');
                resetInactivity();
                setSpeech(sprite.isRobot ? "REBOOTING..." : "I'm awake!");
                setTimeout(() => setSpeech(null), 3000);
            } else {
                resetInactivity();
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [state, position, theme, sprite.isRobot, energy]);

    const resetInactivity = () => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        inactivityTimer.current = setTimeout(() => {
            if (state !== 'sleeping' && !isBusy.current && !showHUD) {
                setState('sleeping');
            }
        }, INACTIVITY_THRESHOLD);
    };

    // Main AI Loop
    useEffect(() => {
        if (!enabled || showHUD) return; // Pause AI when HUD is open
        resetInactivity();

        const behaviorLoop = async () => {
            if (state === 'sleeping' || isBusy.current) return;

            const rand = Math.random();

            if (sprite.isRobot && rand < 0.15) {
                // Robot: Glitch or Scan
                isBusy.current = true;
                if (Math.random() > 0.5) {
                    setState('glitching');
                    await new Promise(r => setTimeout(r, 1500));
                } else {
                    setState('scanning');
                    await new Promise(r => setTimeout(r, 2000));
                }
                setState('idle');
                isBusy.current = false;

            } else if (rand < 0.1) {
                // Dance
                isBusy.current = true;
                setState('dancing');
                await controls.start({ y: position.y - 30, transition: { duration: 0.2, yoyo: 3 } });
                await new Promise(r => setTimeout(r, 1000));
                setState('idle');
                isBusy.current = false;
            } else if (rand < 0.2) {
                // Zoomies
                isBusy.current = true;
                setState('zoomies');
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
            } else if (rand < 0.4) {
                // Chase
                setState('chasing');
                const targetX = mousePos.current.x;
                const targetY = mousePos.current.y;
                const angle = Math.atan2(targetY - position.y, targetX - position.x);
                const stopDist = 120;
                const finalX = targetX - Math.cos(angle) * stopDist;
                const finalY = targetY - Math.sin(angle) * stopDist;

                setDirection(finalX > position.x ? 'right' : 'left');
                const dist = Math.sqrt(Math.pow(finalX - position.x, 2) + Math.pow(finalY - position.y, 2));
                const duration = Math.max(0.8, (dist / 200) / currentPet.speed);

                await controls.start({ x: finalX, y: finalY, transition: { duration, ease: "easeOut" } });
                setPosition({ x: finalX, y: finalY });
            } else if (rand < 0.7) {
                // Walk
                setState('walking');
                const padding = 100;
                const newX = Math.max(padding, Math.min(window.innerWidth - padding, Math.random() * window.innerWidth));
                const newY = Math.max(padding, Math.min(window.innerHeight - padding, Math.random() * window.innerHeight));

                setDirection(newX > position.x ? 'right' : 'left');
                const dist = Math.sqrt(Math.pow(newX - position.x, 2) + Math.pow(newY - position.y, 2));
                const duration = (dist / 80) / currentPet.speed;

                await controls.start({ x: newX, y: newY, transition: { duration, ease: "easeInOut" } });
                setPosition({ x: newX, y: newY });
            } else {
                setState('idle');
                await new Promise(r => setTimeout(r, 2000));
            }
        };

        const interval = setInterval(behaviorLoop, 3500);
        return () => clearInterval(interval);
    }, [enabled, state, position, currentPet, sprite.isRobot, showHUD]);



    const handlePetClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowHUD(!showHUD);
    };

    const handleAction = (action: 'feed' | 'play' | 'sleep') => {
        setShowHUD(false);
        isBusy.current = true;

        if (action === 'feed') {
            setState(sprite.isRobot ? 'recharging' : 'eating');
            setEnergy(prev => Math.min(100, prev + 40));
            setSpeech(sprite.isRobot ? "ENERGY RESTORED" : "Yum!");
        } else if (action === 'play') {
            setState(sprite.isRobot ? 'dancing' : 'happy');
            setHappiness(prev => Math.min(100, prev + 30));
            setEnergy(prev => Math.max(0, prev - 10)); // Playing costs energy
            setSpeech(sprite.isRobot ? "OPTIMIZING..." : "Yay!");
        } else if (action === 'sleep') {
            setState('sleeping');
            setSpeech(sprite.isRobot ? "SLEEP MODE" : "Goodnight...");
        }

        setTimeout(() => {
            if (action !== 'sleep') {
                setState('idle');
                isBusy.current = false;
                setSpeech(null);
            } else {
                isBusy.current = false; // Allow waking up later
            }
        }, 2000);
    };

    if (!enabled) return null;

    const getSpriteRow = (s: PetState) => {
        if (s === 'dancing') return sprite.rows.happy;
        if (s === 'zoomies') return sprite.rows.chasing;
        if (s === 'recharging') return sprite.rows.happy;
        if (s === 'scanning') return sprite.rows.scanning ?? sprite.rows.idle;
        if (s === 'glitching') return sprite.rows.glitching ?? sprite.rows.idle;
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
                {/* Holographic Base Ring (Cyberpunk Only) */}
                {sprite.isRobot && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-8 pointer-events-none">
                        <div className="absolute inset-0 border border-cyan-500/50 rounded-[100%] animate-[spin_4s_linear_infinite]" style={{ transform: 'rotateX(60deg)' }} />
                        <div className="absolute inset-2 border border-fuchsia-500/30 rounded-[100%] animate-[spin_3s_linear_infinite_reverse]" style={{ transform: 'rotateX(60deg)' }} />
                        <div className="absolute inset-0 bg-cyan-500/10 blur-md rounded-[100%] animate-pulse" style={{ transform: 'rotateX(60deg)' }} />
                    </div>
                )}

                {/* HUD Overlay */}
                <AnimatePresence>
                    {showHUD && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            className={`absolute bottom-full mb-4 z-[60] cursor-default
                                ${sprite.isRobot
                                    ? 'min-w-[240px] bg-black/90 border border-cyan-500/50 font-mono p-1 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                                    : 'p-4 rounded-xl shadow-2xl backdrop-blur-md border min-w-[200px] bg-white/90 border-white/20 text-gray-800'}`}
                            style={sprite.isRobot ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : undefined}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {sprite.isRobot ? (
                                // Cyberdeck UI
                                <div className="relative p-4 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:10px_10px]">
                                    {/* Scanline Overlay */}
                                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] opacity-20" />

                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4 border-b border-cyan-500/30 pb-2">
                                        <div>
                                            <div className="text-[10px] text-cyan-500/70 tracking-widest">SYSTEM_OVERRIDE</div>
                                            <div className="text-lg font-bold text-white tracking-wider flex items-center gap-2">
                                                <span className="text-fuchsia-500 animate-pulse">►</span> {currentPet.name.toUpperCase()}
                                            </div>
                                        </div>
                                        <button onClick={() => setShowHUD(false)} className="text-cyan-500 hover:text-white transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Stats */}
                                    <div className="space-y-4 mb-5">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-cyan-400 tracking-wider">
                                                <span>POWER_CELL</span>
                                                <span>{Math.round(energy)}%</span>
                                            </div>
                                            <div className="h-1.5 bg-cyan-900/50 w-full flex gap-0.5">
                                                {Array.from({ length: 10 }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`flex-1 transition-all duration-300 ${i < energy / 10 ? 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'bg-transparent'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-fuchsia-400 tracking-wider">
                                                <span>CORE_INTEGRITY</span>
                                                <span>{Math.round(happiness)}%</span>
                                            </div>
                                            <div className="h-1.5 bg-fuchsia-900/50 w-full flex gap-0.5">
                                                {Array.from({ length: 10 }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`flex-1 transition-all duration-300 ${i < happiness / 10 ? 'bg-fuchsia-400 shadow-[0_0_5px_rgba(232,121,249,0.5)]' : 'bg-transparent'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'feed', label: 'RECHARGE', icon: Zap, color: 'text-yellow-400', border: 'border-yellow-400/50', hover: 'group-hover:bg-yellow-400/20' },
                                            { id: 'play', label: 'OPTIMIZE', icon: Scan, color: 'text-cyan-400', border: 'border-cyan-400/50', hover: 'group-hover:bg-cyan-400/20' },
                                            { id: 'sleep', label: 'HIBERNATE', icon: Moon, color: 'text-blue-400', border: 'border-blue-400/50', hover: 'group-hover:bg-blue-400/20' }
                                        ].map((action) => (
                                            <button
                                                key={action.id}
                                                onClick={() => handleAction(action.id as any)}
                                                className={`group relative h-14 overflow-hidden border bg-black/40 transition-all duration-300 active:scale-95 ${action.border}`}
                                                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                                            >
                                                {/* Hover Scanline */}
                                                <div className={`absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent`} />

                                                {/* Background Glow */}
                                                <div className={`absolute inset-0 opacity-0 ${action.hover} transition-opacity duration-300`} />

                                                <div className="flex flex-col items-center justify-center gap-1 relative z-10 h-full">
                                                    <action.icon size={18} className={`${action.color} drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] group-hover:scale-110 transition-transform duration-300`} />
                                                    <span className={`text-[9px] font-bold tracking-widest ${action.color} opacity-80 group-hover:opacity-100`}>{action.label}</span>
                                                </div>

                                                {/* Tech Corners */}
                                                <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 opacity-50 group-hover:opacity-100 transition-opacity ${action.border.replace('/50', '')}`} />
                                                <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 opacity-50 group-hover:opacity-100 transition-opacity ${action.border.replace('/50', '')}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // Standard UI
                                <>
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                                        <span className="font-bold text-lg">{currentPet.name}</span>
                                        <button onClick={() => setShowHUD(false)} className="hover:bg-white/10 rounded-full p-1">
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Stats */}
                                    <div className="space-y-3 mb-4">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs opacity-80">
                                                <span className="flex items-center gap-1"><Battery size={12} /> ENERGY</span>
                                                <span>{Math.round(energy)}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full transition-all duration-500 bg-green-500"
                                                    style={{ width: `${energy}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs opacity-80">
                                                <span className="flex items-center gap-1"><Smile size={12} /> HAPPINESS</span>
                                                <span>{Math.round(happiness)}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full transition-all duration-500 bg-yellow-500"
                                                    style={{ width: `${happiness}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => handleAction('feed')}
                                            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-gray-100"
                                            title="Feed"
                                        >
                                            <Utensils size={20} />
                                            <span className="text-[10px] uppercase">FEED</span>
                                        </button>
                                        <button
                                            onClick={() => handleAction('play')}
                                            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-gray-100"
                                            title="Play"
                                        >
                                            <Play size={20} />
                                            <span className="text-[10px] uppercase">PLAY</span>
                                        </button>
                                        <button
                                            onClick={() => handleAction('sleep')}
                                            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover:bg-gray-100"
                                            title="Sleep"
                                        >
                                            <Moon size={20} />
                                            <span className="text-[10px] uppercase">SLEEP</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Speech Bubble */}
                <AnimatePresence>
                    {speech && !showHUD && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`absolute -top-24 left-1/2 -translate-x-1/2 px-3 py-2 shadow-lg whitespace-nowrap z-50 
                                ${sprite.isRobot
                                    ? 'bg-black/90 border border-cyan-500/50 text-cyan-400 font-mono text-xs tracking-widest'
                                    : 'rounded-xl border border-gray-100 bg-white text-gray-800 text-sm font-medium'}`}
                            style={sprite.isRobot ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : undefined}
                        >
                            {sprite.isRobot ? (
                                <>
                                    <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                                    <div className="relative flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-cyan-500 animate-ping" />
                                        {speech}
                                    </div>
                                    {/* Connecting Line */}
                                    <div className="absolute -bottom-4 left-1/2 w-[1px] h-4 bg-cyan-500/50" />
                                    <div className="absolute -bottom-4 left-1/2 w-1.5 h-1.5 -translate-x-[2px] bg-cyan-500 rounded-full" />
                                </>
                            ) : (
                                <>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 border-r border-b bg-white border-gray-100"></div>
                                    <span className="relative z-10">{speech}</span>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative">
                    {/* Direction Flip Wrapper */}
                    <div style={{
                        transform: `scaleX(${direction === 'right' ? -1 : 1})`,
                        transition: 'transform 0.2s'
                    }}>
                        {/* Filter Wrapper */}
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
                                    transform: `scale(${sprite.scale * currentPet.scale})`,
                                    transformOrigin: 'bottom center',
                                    willChange: 'background-position, transform',
                                }}
                                className={`animate-sprite ${state === 'glitching' ? 'animate-glitch' : ''}`}
                            />
                        </div>
                    </div>
                    <style>{`
                        @keyframes spriteRun {
                            from { background-position-x: 0; }
                            to { background-position-x: -${sprite.width * sprite.steps}px; }
                        }
                        @keyframes glitch {
                            0% { transform: translate(0) }
                            20% { transform: translate(-2px, 2px) }
                            40% { transform: translate(-2px, -2px) }
                            60% { transform: translate(2px, 2px) }
                            80% { transform: translate(2px, -2px) }
                            100% { transform: translate(0) }
                        }
                        .animate-sprite {
                            animation: spriteRun 0.8s steps(${sprite.steps}) infinite;
                        }
                        .animate-glitch {
                            animation: spriteRun 0.8s steps(${sprite.steps}) infinite, glitch 0.2s infinite;
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
                            <div className={`text-xl font-bold ${sprite.isRobot ? 'text-cyan-500 font-mono tracking-widest' : 'text-blue-400'}`}>
                                {sprite.isRobot ? 'SLEEP_MODE' : 'Zzz...'}
                            </div>
                        </motion.div>
                    )}
                    {(state === 'happy' || state === 'dancing') && !sprite.isRobot && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0, y: 0 }}
                            animate={{ opacity: 1, scale: 1.5, y: -30 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2"
                        >
                            <Heart className="w-6 h-6 text-red-500 fill-red-500 drop-shadow-lg" />
                        </motion.div>
                    )}
                    {(state === 'recharging') && sprite.isRobot && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0, y: 0 }}
                            animate={{ opacity: 1, scale: 1.5, y: -30 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2"
                        >
                            <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                        </motion.div>
                    )}
                    {(state === 'scanning') && sprite.isRobot && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2"
                        >
                            <Scan className="w-8 h-8 text-cyan-400 animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};

export default memo(VirtualPet);
