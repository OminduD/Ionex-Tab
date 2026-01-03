// src/App.tsx
// The main application component - Redesigned with unique cool layout

import React, { useState, useEffect } from 'react';
import { Settings, WidgetId } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SettingsIcon } from './components/icons';
import { SettingsPanel } from './components/SettingsPanel';
import { SearchBar } from './components/SearchBar';
import { QuickLinks } from './components/QuickLinks';
import { AIToolsButton } from './components/AIToolsButton';
import { Greeting } from './components/Greeting';
import { QuoteAndIP } from './components/QuoteAndIP';
import AIChatSidebar from './components/AIChatSidebar';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Zap } from 'lucide-react';
import { extractColorsFromImage, applyCustomColors } from './utils/colorExtractorImproved';
import { getRandomWallpaper } from './utils/themeWallpapers';
import VirtualPet from './components/VirtualPet';
import { MouseTrail } from './components/MouseTrail';

// Dynamically import widgets
const Clock = React.lazy(() => import('./components/widgets/Clock'));
const AnalogClock = React.lazy(() => import('./components/widgets/AnalogClock'));
const Weather = React.lazy(() => import('./components/widgets/Weather'));
const Calendar = React.lazy(() => import('./components/widgets/Calendar'));
const TodoList = React.lazy(() => import('./components/widgets/TodoList'));
const AIWidget = React.lazy(() => import('./components/widgets/AIWidgetImproved'));
const NotesWidget = React.lazy(() => import('./components/widgets/NotesWidget'));
const AppShortcuts = React.lazy(() => import('./components/widgets/AppShortcuts'));
const MusicPlayer = React.lazy(() => import('./components/widgets/MusicPlayer'));
const NewsFeed = React.lazy(() => import('./components/widgets/NewsFeed'));
const FocusMode = React.lazy(() => import('./components/widgets/FocusMode'));
const DraggableWidget = React.lazy(() => import('./components/DraggableWidget'));
const FullscreenAnimation = React.lazy(() => import('./components/FullscreenAnimation'));
const SystemStatsWidget = React.lazy(() => import('./components/widgets/SystemStatsWidget'));
const GitHubWidget = React.lazy(() => import('./components/widgets/GitHubWidget'));
const CryptoWidget = React.lazy(() => import('./components/widgets/CryptoWidget'));
const AchievementsWidget = React.lazy(() => import('./components/widgets/AchievementsWidget'));
import { GamificationProvider } from './context/GamificationContext';
import { LevelProgress } from './components/gamification/LevelProgress';

// Default API key for weather (free tier OpenWeatherMap)
const DEFAULT_WEATHER_API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

const LogoButton = ({ onClick }: { onClick: () => void }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["25deg", "-25deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-25deg", "25deg"]);
    const brightness = useTransform(mouseY, [-0.5, 0.5], [1.2, 0.8]);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;
        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                filter: `brightness(${brightness})`,
                transformStyle: "preserve-3d",
            }}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group cursor-pointer perspective-1000"
        >
            {/* Holographic Glow Behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/40 via-accent/40 to-secondary/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />

            {/* Main Glass Container */}
            <div className="relative flex items-center gap-4 px-6 py-4 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden group-hover:border-primary/50 transition-colors duration-500">

                {/* Scanning Light Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

                {/* Tech Grid Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />

                {/* 3D Logo Container */}
                <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center relative shadow-lg overflow-hidden"
                    style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <motion.div
                        className="absolute inset-0 bg-white/30"
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="text-white font-black text-2xl relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">I</span>
                </motion.div>

                {/* Text Content */}
                <div style={{ transform: "translateZ(20px)" }} className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 group-hover:from-primary group-hover:to-accent transition-all duration-300">
                            Ionex
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-white/10 text-white/60 border border-white/5 uppercase tracking-wider">
                            Beta
                        </span>
                    </div>
                    <div className="text-[10px] font-medium text-white/40 uppercase tracking-[0.2em] group-hover:text-white/80 transition-colors flex items-center gap-1">
                        New Tab
                    </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 rounded-tl-lg" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 rounded-br-lg" />
            </div>
        </motion.button>
    );
};

const App: React.FC = () => {
    const [settings, setSettings] = useLocalStorage<Settings>('homeTabSettings-v7', {
        wallpaperUrl: 'https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=2070&auto=format&fit=crop',
        theme: 'aurora',
        clockType: 'digital',
        timeFormat: '24h', // Default to 24-hour format
        searchEngine: 'google',
        userName: '',
        showQuotesAndIP: true, // Legacy support
        showQuotes: true, // Separate toggle for quotes
        showIP: true, // Separate toggle for IP
        showVirtualPet: true, // Default to true for new users
        widgets: { clock: true, weather: true, calendar: true, todoList: true, aiAssistant: true, notes: true, appShortcuts: false, musicPlayer: false, newsFeed: true, analogClock: false, systemStats: false },
        widgetSizes: { clock: 'small', weather: 'medium', calendar: 'small', todoList: 'medium', aiAssistant: 'large', notes: 'medium', appShortcuts: 'medium', musicPlayer: 'medium', newsFeed: 'medium', analogClock: 'medium', systemStats: 'medium' },
        widgetPositions: {
            clock: { x: 50, y: 100 },
            weather: { x: 400, y: 80 },
            calendar: { x: 900, y: 100 },
            todoList: { x: 100, y: 350 },
            newsFeed: { x: 700, y: 350 },
            aiAssistant: { x: 400, y: 350 },
            notes: { x: 600, y: 400 },
            appShortcuts: { x: 500, y: 500 },
            musicPlayer: { x: 800, y: 500 },
            analogClock: { x: 200, y: 200 },
            systemStats: { x: 100, y: 500 },
            github: { x: 800, y: 100 },
            crypto: { x: 100, y: 100 },
            achievements: { x: 900, y: 500 },
        },
        shortcuts: [
            { id: '1', name: 'Gmail', url: 'https://mail.google.com', icon: 'gmail' },
            { id: '2', name: 'YouTube', url: 'https://youtube.com', icon: 'youtube' },
            { id: '3', name: 'GitHub', url: 'https://github.com', icon: 'github' },
            { id: '4', name: 'Discord', url: 'https://discord.com', icon: 'discord' },
            { id: '5', name: 'Spotify', url: 'https://spotify.com', icon: 'spotify' },
            { id: '6', name: 'Reddit', url: 'https://reddit.com', icon: 'reddit' },
            { id: '7', name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
            { id: '8', name: 'Figma', url: 'https://figma.com', icon: 'figma' },
        ],
        apiKeys: { weather: DEFAULT_WEATHER_API_KEY, groq: '' },
    });

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [showFullscreenAnimation, setShowFullscreenAnimation] = useState(false);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const [isZenMode, setIsZenMode] = useState(false);

    // Parallax Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        if (!settings.enableParallax) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth - 0.5) * 20; // -10 to 10
            const y = (clientY / innerHeight - 0.5) * 20; // -10 to 10
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [settings.enableParallax]);

    const bgX = useTransform(mouseX, (x) => -x); // Background moves opposite
    const bgY = useTransform(mouseY, (y) => -y);
    const fgX = useTransform(mouseX, (x) => x * 0.5); // Foreground moves slightly
    const fgY = useTransform(mouseY, (y) => y * 0.5);

    // Set random wallpaper from theme bundle on first load or theme change
    useEffect(() => {
        // Only set random wallpaper if user hasn't uploaded a custom wallpaper
        if (!settings.wallpaperFile) {
            const randomWallpaper = getRandomWallpaper(settings.theme);
            if (settings.wallpaperUrl !== randomWallpaper) {
                setSettings((prev: Settings) => ({
                    ...prev,
                    wallpaperUrl: randomWallpaper
                }));
            }
        }
    }, [settings.theme]); // Trigger when theme changes

    // Apply manual custom colors
    useEffect(() => {
        if (settings.customColors && !settings.autoThemeFromWallpaper) {
            applyCustomColors(settings.customColors);
        }
    }, [settings.customColors, settings.autoThemeFromWallpaper]);

    // Apply custom colors or extract from wallpaper
    useEffect(() => {
        if (settings.autoThemeFromWallpaper && (settings.wallpaperFile || settings.wallpaperUrl)) {
            // Auto-detect colors from wallpaper
            const imageUrl = settings.wallpaperFile || settings.wallpaperUrl || '';
            extractColorsFromImage(imageUrl)
                .then((colors) => {
                    console.log('Extracted colors:', colors);
                    applyCustomColors(colors);
                })
                .catch((error) => {
                    console.error('Failed to extract colors:', error);
                });
        }
    }, [settings.wallpaperFile, settings.wallpaperUrl, settings.autoThemeFromWallpaper]);

    // Migration: Ensure new widgets are present in settings
    useEffect(() => {
        if (settings.widgets && (typeof settings.widgets.systemStats === 'undefined' || typeof settings.widgets.achievements === 'undefined')) {
            setSettings((prev: Settings) => ({
                ...prev,
                widgets: {
                    ...prev.widgets,
                    systemStats: prev.widgets.systemStats ?? false,
                    achievements: prev.widgets.achievements ?? false,
                },
                widgetSizes: {
                    ...prev.widgetSizes,
                    systemStats: prev.widgetSizes.systemStats ?? 'medium',
                    achievements: prev.widgetSizes.achievements ?? 'medium',
                },
                widgetPositions: {
                    ...prev.widgetPositions,
                    systemStats: prev.widgetPositions.systemStats ?? { x: 100, y: 500 },
                    achievements: prev.widgetPositions.achievements ?? { x: 900, y: 500 },
                }
            }));
        }
    }, [settings.widgets]);

    const updateWidgetPosition = (id: WidgetId, x: number, y: number) => {
        setSettings((prev: Settings) => ({
            ...prev,
            widgetPositions: {
                ...prev.widgetPositions,
                [id]: { x, y }
            }
        }));
    };

    const widgetMap: Record<WidgetId, React.ReactNode> = {
        clock: (
            <>
                {(settings.clockType === 'digital' || settings.clockType === 'both') && (
                    <Clock
                        timeFormat={settings.timeFormat}
                        theme={settings.theme}
                        size={settings.widgetSizes.clock}
                    />
                )}
                {(settings.clockType === 'analog' || settings.clockType === 'both') && (
                    <AnalogClock
                        showDigital={settings.clockType === 'both'}
                        timeFormat={settings.timeFormat}
                        size={settings.widgetSizes.clock}
                        theme={settings.theme}
                    />
                )}
            </>
        ),
        analogClock: (
            <AnalogClock
                showDigital={false}
                timeFormat={settings.timeFormat}
                size={settings.widgetSizes.analogClock || 'medium'}
                theme={settings.theme}
            />
        ),
        weather: <Weather apiKey={settings.apiKeys.weather} theme={settings.theme} size={settings.widgetSizes.weather} />,
        calendar: <Calendar theme={settings.theme} size={settings.widgetSizes.calendar} />,
        todoList: <TodoList theme={settings.theme} size={settings.widgetSizes.todoList} />,
        aiAssistant: <AIWidget groqKey={settings.apiKeys.groq || ''} size={settings.widgetSizes.aiAssistant} theme={settings.theme} />,
        notes: <NotesWidget theme={settings.theme} size={settings.widgetSizes.notes} />,
        appShortcuts: <AppShortcuts shortcuts={settings.shortcuts} theme={settings.theme} size={settings.widgetSizes.appShortcuts} />,
        musicPlayer: <MusicPlayer size={settings.widgetSizes.musicPlayer} theme={settings.theme} />,
        newsFeed: <NewsFeed apiKey={settings.apiKeys.news} theme={settings.theme} size={settings.widgetSizes.newsFeed} />,
        systemStats: <SystemStatsWidget theme={settings.theme} size={settings.widgetSizes.systemStats} />,
        github: <GitHubWidget username={settings.githubUsername} theme={settings.theme} size={settings.widgetSizes.github || 'medium'} />,
        crypto: <CryptoWidget coins={settings.cryptoCoins} theme={settings.theme} size={settings.widgetSizes.crypto || 'medium'} />,
        achievements: <AchievementsWidget theme={settings.theme} />,
    };

    return (
        <GamificationProvider>
            <div className={`theme-${settings.theme} font-sans`}>
                <motion.div
                    className={`h-screen w-screen text-white bg-cover bg-center bg-fixed overflow-hidden relative ${!settings.wallpaperFile && !settings.wallpaperUrl ? 'bg-theme-gradient' : ''}`}
                    style={{
                        backgroundImage: settings.wallpaperFile || settings.wallpaperUrl ? `url(${settings.wallpaperFile || settings.wallpaperUrl})` : undefined,
                        x: settings.enableParallax ? bgX : 0,
                        y: settings.enableParallax ? bgY : 0,
                        scale: settings.enableParallax ? 1.05 : 1 // Scale up slightly to avoid edges
                    }}
                >
                    {/* Global Mouse Trail */}
                    <MouseTrail />

                    {/* Zen Mode Exit Button (Only visible in Zen Mode) */}
                    {isZenMode && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setIsZenMode(false)}
                            className="fixed top-6 right-6 z-[60] px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition-all font-medium text-sm tracking-wider uppercase"
                        >
                            Exit Zen Mode
                        </motion.button>
                    )}

                    {/* Top-Left: Logo/Brand & Focus Button */}
                    <motion.div
                        className="fixed top-6 left-6 z-50 flex items-center gap-3"
                        animate={{ opacity: isZenMode ? 0 : 1, pointerEvents: isZenMode ? 'none' : 'auto' }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ perspective: 1000 }}
                        >
                            <LogoButton onClick={() => setShowFullscreenAnimation(true)} />
                        </motion.div>

                        {/* Focus Mode Button */}
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            onClick={() => setIsFocusMode(true)}
                            className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-all hover:scale-110 group"
                            aria-label="Focus Mode"
                            title="Focus Mode"
                        >
                            <Zap className="w-6 h-6 icon-color group-hover:rotate-12 transition-transform duration-300" />
                        </motion.button>

                        {/* Zen Mode Toggle */}
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => setIsZenMode(true)}
                            className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-all hover:scale-110 group"
                            aria-label="Zen Mode"
                            title="Zen Mode"
                        >
                            <div className="w-6 h-6 flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full border-2 border-white/60 group-hover:border-white transition-colors" />
                            </div>
                        </motion.button>

                        {/* Level Progress */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <LevelProgress />
                        </motion.div>
                    </motion.div>

                    {/* Top-Right: Settings Button */}
                    <motion.div
                        className="fixed top-6 right-6 z-50"
                        animate={{ opacity: isZenMode ? 0 : 1, pointerEvents: isZenMode ? 'none' : 'auto' }}
                    >
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-all hover:scale-110"
                            aria-label="Settings"
                        >
                            <SettingsIcon className="w-6 h-6 icon-color" />
                        </motion.button>
                    </motion.div>

                    {/* Bottom-Left: AI Tools Button */}
                    <motion.div animate={{ opacity: isZenMode ? 0 : 1, pointerEvents: isZenMode ? 'none' : 'auto' }}>
                        <AIToolsButton />
                    </motion.div>



                    {/* Center: Greeting + Search Bar (Fixed Position) */}
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-4xl px-6">
                        <motion.div style={{ x: settings.enableParallax ? fgX : 0, y: settings.enableParallax ? fgY : 0 }}>
                            <Greeting userName={settings.userName} theme={settings.theme} />

                            <SearchBar
                                selectedEngine={settings.searchEngine}
                                onEngineChange={(engine) => setSettings({ ...settings, searchEngine: engine })}
                            />

                            {/* Quote and IP Address */}
                            <motion.div animate={{ opacity: isZenMode ? 0 : 1 }}>
                                <QuoteAndIP
                                    showQuotes={settings.showQuotes ?? settings.showQuotesAndIP ?? true}
                                    showIP={settings.showIP ?? settings.showQuotesAndIP ?? true}
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Bottom: Quick Links Bar (Fixed at Bottom) */}
                    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-6xl px-6">
                        <motion.div
                            animate={{ opacity: isZenMode ? 0 : 1, pointerEvents: isZenMode ? 'none' : 'auto' }}
                            style={{ x: settings.enableParallax ? fgX : 0, y: settings.enableParallax ? fgY : 0 }}
                        >
                            <QuickLinks
                                shortcuts={settings.shortcuts}
                                theme={settings.theme}
                            />
                        </motion.div>
                    </div>

                    {/* Draggable Widgets Area */}
                    <motion.div
                        className="absolute inset-0 overflow-hidden"
                        animate={{ opacity: isZenMode ? 0 : 1, pointerEvents: isZenMode ? 'none' : 'auto' }}
                        style={{ x: settings.enableParallax ? fgX : 0, y: settings.enableParallax ? fgY : 0 }}
                    >
                        <React.Suspense fallback={<div className="text-center">Loading...</div>}>
                            {Object.entries(settings.widgets).map(([id, enabled]) => {
                                const widgetId = id as WidgetId;
                                // Skip aiAssistant as it's now a sidebar
                                if (!enabled || !widgetMap[widgetId] || widgetId === 'aiAssistant') return null;

                                const position = settings.widgetPositions[widgetId] || { x: 100, y: 100 };

                                return (
                                    <DraggableWidget
                                        key={widgetId}
                                        id={widgetId}
                                        position={position}
                                        onPositionChange={(x: number, y: number) => updateWidgetPosition(widgetId, x, y)}
                                        size={settings.widgetSizes[widgetId] || 'small'}
                                    >
                                        {widgetMap[widgetId]}
                                    </DraggableWidget>
                                );
                            })}
                        </React.Suspense>
                    </motion.div>

                    {/* AI Chat Sidebar & Toggle */}
                    {settings.widgets.aiAssistant && (
                        <>
                            {/* Toggle Button */}
                            <motion.button
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsAIChatOpen(true)}
                                className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/10 backdrop-blur-md border-l border-y border-white/20 rounded-l-2xl shadow-lg transition-all hover:bg-white/20 ${isAIChatOpen ? 'translate-x-full opacity-0 pointer-events-none' : ''}`}
                            >
                                <div className="writing-vertical-rl text-white/80 text-xs font-bold tracking-widest py-2 flex items-center gap-2" style={{ writingMode: 'vertical-rl' }}>
                                    <span>AI CHAT</span>
                                </div>
                            </motion.button>

                            <AIChatSidebar
                                isOpen={isAIChatOpen}
                                onClose={() => setIsAIChatOpen(false)}
                                groqKey={settings.apiKeys.groq || ''}
                            />
                        </>
                    )}

                    {/* Focus Mode Overlay */}
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <FocusMode isActive={isFocusMode} onClose={() => setIsFocusMode(false)} />
                    </React.Suspense>

                    {/* Settings Panel */}
                    <SettingsPanel
                        settings={settings}
                        setSettings={setSettings}
                        isVisible={isSettingsOpen}
                        onClose={() => setIsSettingsOpen(false)}
                    />

                    {/* Virtual Pet */}
                    <VirtualPet
                        theme={settings.theme}
                        enabled={(settings.showVirtualPet ?? false) && !isFocusMode}
                    />

                    {/* Fullscreen Animation */}
                    <React.Suspense fallback={null}>
                        <FullscreenAnimation
                            theme={settings.theme}
                            isVisible={showFullscreenAnimation}
                            onComplete={() => setShowFullscreenAnimation(false)}
                        />
                    </React.Suspense>
                </motion.div>
            </div>
        </GamificationProvider>
    );
};

export default App;

export { };
