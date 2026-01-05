import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Settings, WidgetId } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
const SettingsPanel = React.lazy(() => import('./components/SettingsPanel').then(module => ({ default: module.SettingsPanel })));
const AIChatSidebar = React.lazy(() => import('./components/AIChatSidebar'));
const VirtualPet = React.lazy(() => import('./components/VirtualPet'));
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Eye, EyeOff, Settings as SettingsLucide, Minimize2, Maximize2, MessageCircle } from 'lucide-react';
import { extractColorsFromImage, applyCustomColors } from './utils/colorExtractorImproved';
import { getRandomWallpaper } from './utils/themeWallpapers';
import { AIToolsButton } from './components/AIToolsButton';
import { Greeting } from './components/Greeting';
import { MouseTrail } from './components/MouseTrail';
import { getThemeStyles } from './utils/themeStyles';
import { GamificationProvider } from './context/GamificationContext';
import { LevelProgress } from './components/gamification/LevelProgress';

// Dynamically import widgets
const Clock = React.lazy(() => import('./components/widgets/Clock'));
const AnalogClock = React.lazy(() => import('./components/widgets/AnalogClock'));
const Weather = React.lazy(() => import('./components/widgets/Weather'));
const SearchBar = React.lazy(() => import('./components/SearchBar'));
const QuickLinks = React.lazy(() => import('./components/QuickLinks'));
const Calendar = React.lazy(() => import('./components/widgets/Calendar'));
const QuoteAndIP = React.lazy(() => import('./components/QuoteAndIP'));
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

// Default API key for weather (free tier OpenWeatherMap)
const DEFAULT_WEATHER_API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

const LogoButton = React.memo(({ onClick }: { onClick: () => void }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-100, 100], [30, -30]), { stiffness: 200, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-100, 100], [-30, 30]), { stiffness: 200, damping: 20 });

    return (
        <motion.button
            style={{ x, y, rotateX, rotateY, z: 100 }}
            drag
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0.1}
            whileHover={{ scale: 1.05, cursor: 'pointer' }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="relative group perspective-1000 flex items-center gap-4 bg-transparent border-none p-0 outline-none"
        >
            <div className="relative w-12 h-12 flex items-center justify-center">
                <motion.div
                    className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-white font-black text-2xl relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">I</span>
            </div>

            <div className="flex flex-col items-start text-left">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
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
        </motion.button>
    );
});

const App: React.FC = () => {
    const [settings, setSettings] = useLocalStorage<Settings>('homeTabSettings-v7', {
        wallpaperUrl: 'https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=2070&auto=format&fit=crop',
        theme: 'aurora',
        clockType: 'digital',
        timeFormat: '24h',
        searchEngine: 'google',
        userName: '',
        showQuotesAndIP: true,
        showQuotes: true,
        showIP: true,
        showVirtualPet: true,
        musicPlayerEmbedUrl: '',
        widgets: {
            clock: { id: 'clock', type: 'clock', x: 0, y: 0, w: 4, h: 2, visible: true },
            weather: { id: 'weather', type: 'weather', x: 4, y: 0, w: 4, h: 2, visible: true },
            search: { id: 'search', type: 'search', x: 0, y: 2, w: 8, h: 1, visible: true },
            quickLinks: { id: 'quickLinks', type: 'quickLinks', x: 0, y: 3, w: 8, h: 1, visible: true },
            calendar: { id: 'calendar', type: 'calendar', x: 8, y: 0, w: 4, h: 4, visible: true },
            quote: { id: 'quote', type: 'quote', x: 0, y: 4, w: 8, h: 1, visible: true },
            todoList: { id: 'todoList', type: 'todoList', x: 50, y: 150, w: 4, h: 4, visible: true },
            newsFeed: { id: 'newsFeed', type: 'newsFeed', x: 4, y: 5, w: 4, h: 4, visible: true },
            systemStats: { id: 'systemStats', type: 'systemStats', x: 8, y: 4, w: 4, h: 2, visible: true },
            github: { id: 'github', type: 'github', x: 8, y: 6, w: 4, h: 2, visible: true },
            crypto: { id: 'crypto', type: 'crypto', x: 0, y: 9, w: 4, h: 2, visible: true },
            achievements: { id: 'achievements', type: 'achievements', x: 4, y: 9, w: 4, h: 2, visible: true },
            musicPlayer: { id: 'musicPlayer', type: 'musicPlayer', x: 8, y: 8, w: 4, h: 2, visible: true },
            notes: { id: 'notes', type: 'notes', x: 0, y: 11, w: 4, h: 2, visible: true },
            aiChat: { id: 'aiChat', type: 'aiChat', x: 4, y: 11, w: 4, h: 2, visible: true },
            focusMode: { id: 'focusMode', type: 'focusMode', x: 8, y: 10, w: 4, h: 2, visible: true },
        },
        widgetSizes: {
            clock: 'medium',
            weather: 'medium',
            calendar: 'large',
            todoList: 'large',
            newsFeed: 'large',
            systemStats: 'medium',
            github: 'medium',
            crypto: 'medium',
            musicPlayer: 'medium',
            notes: 'medium',
            aiChat: 'medium',
            focusMode: 'large',
        },
        widgetPositions: {}, // Optional, kept for compatibility
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
        cryptoCoins: ['bitcoin', 'ethereum', 'solana']
    });

    const styles = useMemo(() => getThemeStyles(settings.theme), [settings.theme]);

    // Migrate old 'todo' widget key to 'todoList' for backward compatibility
    useEffect(() => {
        const needsMigration = (settings.widgets as any).todo && !settings.widgets.todoList;
        const needsInit = !settings.widgets.todoList && !(settings.widgets as any).todo;

        if (needsMigration || needsInit) {
            setSettings(prev => {
                const widgets = { ...prev.widgets } as any;
                const sizes = { ...prev.widgetSizes } as any;

                if (needsMigration) {
                    // Migrate from old 'todo' key
                    const { todo, ...restWidgets } = widgets;
                    const { todo: todoSize, ...restSizes } = sizes;
                    return {
                        ...prev,
                        widgets: {
                            ...restWidgets,
                            todoList: { ...todo, id: 'todoList', type: 'todoList' }
                        },
                        widgetSizes: {
                            ...restSizes,
                            todoList: todoSize || 'large'
                        }
                    };
                } else {
                    // Initialize todoList from scratch
                    return {
                        ...prev,
                        widgets: {
                            ...widgets,
                            todoList: { id: 'todoList', type: 'todoList', x: 50, y: 150, w: 4, h: 4, visible: true }
                        },
                        widgetSizes: {
                            ...sizes,
                            todoList: 'large'
                        }
                    };
                }
            });
        }

        // Fix for todoList being stuck at 0,5 (grid coordinates interpreted as pixels)
        if (settings.widgets.todoList && settings.widgets.todoList.x === 0 && settings.widgets.todoList.y === 5) {
            setSettings(prev => ({
                ...prev,
                widgets: {
                    ...prev.widgets,
                    todoList: { ...prev.widgets.todoList, x: 50, y: 150 }
                }
            }));
        }
    }, []);

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
                    systemStats: { ...prev.widgets.systemStats, visible: prev.widgets.systemStats?.visible ?? false },
                    achievements: { ...prev.widgets.achievements, visible: prev.widgets.achievements?.visible ?? false },
                },
                widgetSizes: {
                    ...prev.widgetSizes,
                    systemStats: prev.widgetSizes.systemStats ?? 'medium',
                    achievements: prev.widgetSizes.achievements ?? 'medium',
                }
            }));
        }
    }, [settings.widgets]);

    const updateWidgetPosition = useCallback((id: WidgetId, x: number, y: number) => {
        setSettings((prev: Settings) => ({
            ...prev,
            widgets: {
                ...prev.widgets,
                [id]: { ...prev.widgets[id], x, y }
            }
        }));
    }, [setSettings]);

    const widgetMap: Record<WidgetId, React.ReactNode> = useMemo(() => ({
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
        todoList: <TodoList theme={settings.theme} size={settings.widgetSizes.todoList || settings.widgetSizes.todo} />,
        aiAssistant: <AIWidget groqKey={settings.apiKeys.groq || ''} size={settings.widgetSizes.aiAssistant} theme={settings.theme} />,
        notes: <NotesWidget theme={settings.theme} size={settings.widgetSizes.notes} />,
        appShortcuts: <AppShortcuts shortcuts={settings.shortcuts || []} theme={settings.theme} size={settings.widgetSizes.appShortcuts} />,
        musicPlayer: <MusicPlayer size={settings.widgetSizes.musicPlayer} theme={settings.theme} embedUrl={settings.musicPlayerEmbedUrl} />,
        newsFeed: <NewsFeed apiKey={settings.apiKeys.news} theme={settings.theme} size={settings.widgetSizes.newsFeed} />,
        systemStats: <SystemStatsWidget theme={settings.theme} size={settings.widgetSizes.systemStats} />,
        github: <GitHubWidget username={settings.githubUsername} theme={settings.theme} size={settings.widgetSizes.github || 'medium'} />,
        crypto: <CryptoWidget coins={settings.cryptoCoins} theme={settings.theme} size={settings.widgetSizes.crypto || 'medium'} />,
        achievements: <AchievementsWidget theme={settings.theme} />,

    }), [settings.theme, settings.timeFormat, settings.clockType, settings.widgetSizes, settings.apiKeys, settings.shortcuts, settings.musicPlayerEmbedUrl, settings.githubUsername, settings.cryptoCoins]);

    const isMinimalist = settings.minimalistMode;
    const isLightMode = isMinimalist && settings.minimalistTheme === 'light';
    const minimalistBg = isLightMode ? '#e2e8f0' : '#0f0f0f';
    const textColor = isLightMode ? 'text-slate-900' : 'text-white';
    const isAIChatEnabled = !!settings.widgets?.aiChat?.visible;

    return (
        <GamificationProvider>
            <div className={`theme-${settings.theme} font-sans`}>
                <motion.div
                    className={`h-screen w-screen ${textColor} bg-cover bg-center bg-fixed overflow-hidden relative ${!settings.wallpaperFile && !settings.wallpaperUrl && !isMinimalist ? 'bg-theme-gradient' : ''}`}
                    style={{
                        backgroundImage: isMinimalist ? 'none' : (settings.wallpaperFile || settings.wallpaperUrl ? `url(${settings.wallpaperFile || settings.wallpaperUrl})` : undefined),
                        backgroundColor: isMinimalist ? minimalistBg : undefined,
                        x: settings.enableParallax && !isMinimalist ? bgX : 0,
                        y: settings.enableParallax && !isMinimalist ? bgY : 0,
                        scale: settings.enableParallax && !isMinimalist ? 1.05 : 1
                    }}
                >
                    {/* Global Mouse Trail */}
                    {!isMinimalist && (settings.enableMouseTrail ?? true) && <MouseTrail theme={settings.theme} />}

                    {/* Minimalist Mode Indicator */}
                    {isMinimalist && (
                        <div className="absolute top-4 right-4 text-xs text-white/20 font-mono tracking-widest pointer-events-none">
                            MINIMALIST
                        </div>
                    )}

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

                        {/* Level Progress */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <LevelProgress />
                        </motion.div>
                    </motion.div>

                    {/* Top Right Controls - Enhanced UI */}
                    <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
                        {/* Zen Mode Toggle - Stealth Switch Style */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsZenMode(!isZenMode)}
                            className={`relative group w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isZenMode ? styles.button.active : 'bg-black/40 border-white/10 hover:border-white/30'} backdrop-blur-md border`}
                        >
                            <div className={`absolute inset-0 rounded-full border transition-all duration-300 ${isZenMode ? styles.button.border : 'border-transparent'}`} />

                            {isZenMode ? (
                                <Minimize2 size={20} className={`${styles.button.text} relative z-10`} />
                            ) : (
                                <Maximize2 size={20} className="text-white/70 group-hover:text-white relative z-10 transition-colors" />
                            )}

                            {/* Tooltip */}
                            <div className="absolute top-full mt-2 right-0 px-2 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {isZenMode ? 'EXIT_ZEN' : 'ENTER_ZEN'}
                            </div>
                        </motion.button>

                        {/* Focus Mode Toggle - Targeting System Style */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsFocusMode(!isFocusMode)}
                            className={`relative group w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isFocusMode ? styles.button.active : 'bg-black/40 border-white/10 hover:border-white/30'} backdrop-blur-md border`}
                        >
                            {/* Rotating Reticle Ring */}
                            <div className={`absolute inset-0 rounded-full border border-dashed transition-all duration-700 ${isFocusMode ? `${styles.button.ring} animate-[spin_10s_linear_infinite]` : 'border-white/20 group-hover:border-white/40'}`} />

                            {/* Inner Focus Circle */}
                            <div className={`absolute inset-2 rounded-full border transition-all duration-300 ${isFocusMode ? `${styles.button.border} scale-100` : 'border-transparent scale-0 group-hover:scale-90 group-hover:border-white/30'}`} />

                            {isFocusMode ? (
                                <EyeOff size={20} className={`${styles.button.text} relative z-10`} />
                            ) : (
                                <Eye size={20} className="text-white/70 group-hover:text-white relative z-10 transition-colors" />
                            )}

                            {/* Tooltip */}
                            <div className="absolute top-full mt-2 right-0 px-2 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {isFocusMode ? 'DISENGAGE_FOCUS' : 'INIT_FOCUS'}
                            </div>
                        </motion.button>

                        {/* Settings Toggle - Reactor Gear Style */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsSettingsOpen(true)}
                            className={`relative group w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                        >
                            {/* Spinning Gear Animation */}
                            <SettingsLucide
                                size={20}
                                className={`text-white/70 group-hover:text-white transition-all duration-700 group-hover:rotate-180`}
                            />

                            {/* Tech Ring Overlay */}
                            <div className={`absolute inset-0 rounded-full border-t border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-45 ${styles.button.glow}`} />
                            <div className={`absolute inset-1 rounded-full border-b border-r border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -rotate-45 ${styles.button.glow}`} />

                            {/* Tooltip */}
                            <div className="absolute top-full mt-2 right-0 px-2 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                SYSTEM_CONFIG
                            </div>
                        </motion.button>
                    </div>
                    {/* Bottom-Left: AI Tools Button */}
                    {!isMinimalist && (
                        <motion.div animate={{ opacity: isZenMode ? 0 : 1, pointerEvents: isZenMode ? 'none' : 'auto' }}>
                            <AIToolsButton theme={settings.theme} />
                        </motion.div>
                    )}



                    {/* Center: Greeting + Search Bar (Fixed Position) */}
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-4xl px-6">
                        <motion.div style={{ x: settings.enableParallax && !isMinimalist ? fgX : 0, y: settings.enableParallax && !isMinimalist ? fgY : 0 }}>
                            <Greeting userName={settings.userName} theme={settings.theme} isMinimalist={isMinimalist} />

                            <SearchBar
                                selectedEngine={settings.searchEngine}
                                onEngineChange={(engine: string) => setSettings({ ...settings, searchEngine: engine })}
                                isMinimalist={isMinimalist}
                            />

                            {/* Quote and IP Address */}
                            {!isMinimalist && (
                                <motion.div animate={{ opacity: isZenMode ? 0 : 1 }}>
                                    <QuoteAndIP
                                        showQuotes={settings.showQuotes ?? settings.showQuotesAndIP ?? true}
                                        showIP={settings.showIP ?? settings.showQuotesAndIP ?? true}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    </div>

                    {/* Bottom: Quick Links Bar (Fixed at Bottom) */}
                    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-6xl px-6">
                        <motion.div
                            animate={{ opacity: isZenMode ? 0 : 1, pointerEvents: isZenMode ? 'none' : 'auto' }}
                            style={{ x: settings.enableParallax && !isMinimalist ? fgX : 0, y: settings.enableParallax && !isMinimalist ? fgY : 0 }}
                        >
                            <QuickLinks
                                shortcuts={settings.shortcuts || []}
                                theme={settings.theme}
                            />
                        </motion.div>
                    </div>

                    {/* Draggable Widgets Area */}
                    <motion.div
                        className="absolute inset-0 overflow-hidden"
                        animate={{ opacity: isZenMode ? 0 : 1, pointerEvents: isZenMode ? 'none' : 'auto' }}
                        style={{ x: settings.enableParallax && !isMinimalist ? fgX : 0, y: settings.enableParallax && !isMinimalist ? fgY : 0 }}
                    >
                        <React.Suspense fallback={<div className="sr-only">Loading widget...</div>}>
                            {Object.entries(settings.widgets).map(([id, widget]) => {
                                const widgetId = id as WidgetId;

                                // Debug logging
                                if (widgetId === 'todoList') {
                                    console.log('TodoList widget found:', { widgetId, widget, visible: widget.visible, hasComponent: !!widgetMap[widgetId] });
                                }

                                // Skip aiAssistant as it's now a sidebar
                                if (!widget.visible || !widgetMap[widgetId] || widgetId === 'aiAssistant') return null;

                                // Minimalist Mode Filter
                                if (isMinimalist && !['clock', 'weather', 'todoList', 'calendar'].includes(widgetId)) return null;

                                const position = { x: widget.x, y: widget.y };

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
                    {!isMinimalist && isAIChatEnabled && (
                        <>
                            {/* Toggle Button */}
                            <motion.div
                                className="fixed right-0 top-1/2 -translate-y-1/2 z-[55]"
                                initial={{ x: 120, opacity: 0 }}
                                animate={{ x: 0, opacity: isZenMode ? 0 : 1, pointerEvents: isZenMode ? 'none' : 'auto' }}
                                transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                            >
                                <motion.button
                                    whileHover={{ x: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsAIChatOpen(true)}
                                    className={`relative group flex items-center gap-2 pl-2 pr-2 py-2.5 bg-black/50 backdrop-blur-xl border border-r-0 rounded-l-lg shadow-2xl overflow-hidden ${styles.aiButton.border} ${isAIChatOpen ? 'translate-x-full opacity-0 pointer-events-none' : ''}`}
                                    title="Open AI Chat"
                                >
                                    {/* Aura */}
                                    <div className={`absolute -inset-6 blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300 ${styles.aiButton.glow}`} />

                                    {/* Scanline */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-t from-transparent via-white/15 to-transparent -translate-y-full"
                                        animate={{ y: ['0%', '200%'] }}
                                        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                                    />

                                    {/* Rotating ring */}
                                    <motion.div
                                        className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-dashed opacity-35 ${styles.aiButton.border}`}
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                    />

                                    {/* Icon */}
                                    <div className="relative z-10 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                        <motion.div
                                            animate={{ scale: [1, 1.08, 1] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                        >
                                            <MessageCircle className={`w-4 h-4 ${styles.aiButton.text}`} />
                                        </motion.div>
                                    </div>

                                    {/* Vertical label */}
                                    <div
                                        className="relative z-10 text-[10px] font-black tracking-[0.3em] text-white/80 select-none"
                                        style={{ writingMode: 'vertical-rl' as any }}
                                    >
                                        AI_CHAT
                                    </div>
                                </motion.button>
                            </motion.div>

                            <React.Suspense fallback={null}>
                                <AIChatSidebar
                                    isOpen={isAIChatOpen}
                                    onClose={() => setIsAIChatOpen(false)}
                                    groqKey={settings.apiKeys.groq || ''}
                                />
                            </React.Suspense>
                        </>
                    )}

                    {/* Focus Mode Overlay */}
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <FocusMode isActive={isFocusMode} onClose={() => setIsFocusMode(false)} />
                    </React.Suspense>

                    {/* Settings Panel */}
                    {/* Settings Panel */}
                    <React.Suspense fallback={null}>
                        <SettingsPanel
                            settings={settings}
                            setSettings={setSettings}
                            isVisible={isSettingsOpen}
                            onClose={() => setIsSettingsOpen(false)}
                        />
                    </React.Suspense>

                    {/* Virtual Pet */}
                    {!isMinimalist && (
                        <React.Suspense fallback={null}>
                            <VirtualPet
                                theme={settings.theme}
                                enabled={(settings.showVirtualPet ?? false) && !isFocusMode}
                            />
                        </React.Suspense>
                    )}

                    {/* Fullscreen Animation */}
                    {!isMinimalist && (
                        <React.Suspense fallback={null}>
                            <FullscreenAnimation
                                theme={settings.theme}
                                isVisible={showFullscreenAnimation}
                                onComplete={() => setShowFullscreenAnimation(false)}
                            />
                        </React.Suspense>
                    )}
                </motion.div>
            </div >
        </GamificationProvider >
    );
};

export default App;

export { };
