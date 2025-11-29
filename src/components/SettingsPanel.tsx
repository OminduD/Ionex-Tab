// src/components/SettingsPanel.tsx
// The settings panel component - Completely redesigned with sidebar navigation and premium UI

import React, { useState, useEffect } from 'react';
import { Settings, WidgetSize } from '../types';
import { PlusIcon, Trash2Icon, UploadIcon, ImageIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Palette, Image as ImageIconLucide, Clock, LayoutGrid, Link as LinkIcon, Key, Save, X, Check, Sparkles } from 'lucide-react';

interface Props {
    settings: Settings;
    setSettings: (value: Settings | ((val: Settings) => Settings)) => void;
    isVisible: boolean;
    onClose: () => void;
}

// Enhanced Toggle Component
const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label?: string }) => (
    <div className="flex items-center justify-between group cursor-pointer" onClick={() => onChange(!checked)}>
        {label && <span className="font-medium text-white group-hover:text-primary transition-colors">{label}</span>}
        <div className="relative w-14 h-8 rounded-full p-1 transition-colors duration-300"
            style={{
                background: checked 
                    ? 'linear-gradient(135deg, var(--primary-color), var(--accent-color))' 
                    : 'rgba(255, 255, 255, 0.1)',
                boxShadow: checked ? '0 0 15px var(--primary-color)' : 'none'
            }}
        >
            <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                    x: checked ? 24 : 0
                }}
            >
                <AnimatePresence mode="wait">
                    {checked ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <Check className="w-3.5 h-3.5 text-primary font-bold" strokeWidth={4} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="x"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <X className="w-3.5 h-3.5 text-gray-400" strokeWidth={3} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    </div>
);

const themes: Record<string, { name: string; class: string; wallpaper: string; colors: string[] }> = {
    aurora: {
        name: 'Aurora',
        class: 'bg-gradient-to-br from-purple-600 to-blue-500',
        wallpaper: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop',
        colors: ['#9333ea', '#3b82f6', '#6366f1']
    },
    sunset: {
        name: 'Sunset',
        class: 'bg-gradient-to-br from-amber-500 to-rose-600',
        wallpaper: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=2070&auto=format&fit=crop',
        colors: ['#f59e0b', '#f43f5e', '#e11d48']
    },
    forest: {
        name: 'Forest',
        class: 'bg-gradient-to-br from-lime-600 to-emerald-700',
        wallpaper: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
        colors: ['#65a30d', '#059669', '#047857']
    },
    ocean: {
        name: 'Ocean',
        class: 'bg-gradient-to-br from-sky-400 to-blue-700',
        wallpaper: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2026&auto=format&fit=crop',
        colors: ['#38bdf8', '#1d4ed8', '#0369a1']
    },
    midnight: {
        name: 'Midnight',
        class: 'bg-gradient-to-br from-gray-900 to-violet-900',
        wallpaper: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop',
        colors: ['#a78bfa', '#7c3aed', '#8b5cf6']
    },
    neon: {
        name: 'Neon',
        class: 'bg-gradient-to-br from-fuchsia-500 to-cyan-500',
        wallpaper: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2187&auto=format&fit=crop',
        colors: ['#d946ef', '#06b6d4', '#8b5cf6']
    },
    cherry: {
        name: 'Cherry',
        class: 'bg-gradient-to-br from-pink-600 to-red-700',
        wallpaper: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2070&auto=format&fit=crop',
        colors: ['#db2777', '#dc2626', '#be123c']
    },
    mint: {
        name: 'Mint',
        class: 'bg-gradient-to-br from-teal-400 to-green-600',
        wallpaper: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop',
        colors: ['#2dd4bf', '#16a34a', '#14b8a6']
    },
};

type TabId = 'personal' | 'themes' | 'wallpaper' | 'clock' | 'widgets' | 'shortcuts' | 'api';

export const SettingsPanel: React.FC<Props> = ({ settings, setSettings, isVisible, onClose }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [activeTab, setActiveTab] = useState<TabId>('personal');
    const [newShortcutName, setNewShortcutName] = useState('');
    const [newShortcutUrl, setNewShortcutUrl] = useState('');

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings, isVisible]);

    if (!isVisible) return null;

    const handleSave = () => {
        const trimmedSettings = {
            ...localSettings,
            apiKeys: {
                weather: localSettings.apiKeys.weather?.trim() || '',
                groq: localSettings.apiKeys.groq?.trim() || '',
            }
        };
        setSettings(trimmedSettings);
        onClose();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalSettings((prev: Settings) => ({
                    ...prev,
                    wallpaperFile: reader.result as string,
                    wallpaperUrl: ''
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addShortcut = () => {
        if (newShortcutName && newShortcutUrl) {
            let iconUrl = '';
            try {
                const url = new URL(newShortcutUrl.startsWith('http') ? newShortcutUrl : 'https://' + newShortcutUrl);
                iconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
            } catch (e) {
                console.error('Invalid URL');
            }

            setLocalSettings((prev: Settings) => ({
                ...prev,
                shortcuts: [...prev.shortcuts, {
                    id: Date.now().toString(),
                    name: newShortcutName,
                    url: newShortcutUrl,
                    icon: iconUrl
                }]
            }));
            setNewShortcutName('');
            setNewShortcutUrl('');
        }
    };

    const deleteShortcut = (id: string) => {
        setLocalSettings((prev: Settings) => ({
            ...prev,
            shortcuts: prev.shortcuts.filter(s => s.id !== id)
        }));
    };

    const tabs = [
        { id: 'personal', label: 'Personal', icon: User },
        { id: 'themes', label: 'Themes', icon: Palette },
        { id: 'wallpaper', label: 'Wallpaper', icon: ImageIconLucide },
        { id: 'clock', label: 'Clock', icon: Clock },
        { id: 'widgets', label: 'Widgets', icon: LayoutGrid },
        { id: 'shortcuts', label: 'Shortcuts', icon: LinkIcon },
        { id: 'api', label: 'API Keys', icon: Key },
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-8"
                    onClick={handleSave}
                >
                    {/* Animated background particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 rounded-full"
                                style={{
                                    background: `var(--${i % 2 === 0 ? 'primary' : 'accent'}-color)`,
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, -30, 0],
                                    opacity: [0.2, 0.6, 0.2],
                                    scale: [1, 1.5, 1],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                }}
                            />
                        ))}
                    </div>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
                        className="relative w-full max-w-5xl h-[85vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-900/95 backdrop-blur-2xl border-2 border-white/10"
                        style={{
                            boxShadow: `0 0 60px rgba(var(--primary-color), 0.3), 0 20px 40px rgba(0,0,0,0.5)`,
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/30 animate-pulse" />
                        </div>
                        {/* Sidebar Navigation */}
                        <div className="relative w-full md:w-72 bg-gradient-to-b from-black/40 via-black/30 to-black/40 backdrop-blur-2xl border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 flex flex-col gap-2 overflow-y-auto scrollbar-none">
                            {/* Sidebar glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                            
                            <div className="relative flex items-center gap-3 mb-8 px-2">
                                <motion.div 
                                    className="relative"
                                    animate={{ 
                                        rotate: [0, 360],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ 
                                        duration: 20, 
                                        repeat: Infinity,
                                        ease: "linear" 
                                    }}
                                >
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent blur-md opacity-50" />
                                    <img 
                                        src="/Ionex.png" 
                                        alt="Logo" 
                                        className="relative w-10 h-10 rounded-xl border border-white/20" 
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const fallback = document.createElement('div');
                                            fallback.className = 'w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold';
                                            fallback.textContent = 'I';
                                            e.currentTarget.parentNode!.appendChild(fallback);
                                        }} 
                                    />
                                </motion.div>
                                <div>
                                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Settings</h2>
                                    <p className="text-xs text-white/40">Customize your experience</p>
                                </div>
                            </div>

                            <div className="relative flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                                {tabs.map((tab, index) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <motion.button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as TabId)}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all whitespace-nowrap overflow-hidden ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-primary/20 via-secondary/15 to-accent/20 text-white border border-primary/30 shadow-lg shadow-primary/20'
                                                    : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                                            }`}
                                        >
                                            {isActive && (
                                                <>
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl"
                                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                    />
                                                    <motion.div
                                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-r-full"
                                                        layoutId="activeIndicator"
                                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                                    />
                                                </>
                                            )}
                                            <Icon className={`relative w-5 h-5 z-10 transition-all ${isActive ? 'text-primary drop-shadow-[0_0_8px_var(--primary-color)]' : ''}`} />
                                            <span className="relative font-medium text-sm z-10">{tab.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <div className="relative mt-auto hidden md:block pt-6 border-t border-white/10">
                                <div className="text-center space-y-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                                        <p className="text-xs text-white/40">System Online</p>
                                    </div>
                                    <p className="text-xs text-white/30 font-mono">Ionex Tab v1.0</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="relative flex-1 flex flex-col min-w-0 bg-gradient-to-br from-gray-900/50 via-black/30 to-gray-900/50 backdrop-blur-xl">
                            {/* Top Bar */}
                            <div className="relative flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-black/20 via-black/10 to-black/20 backdrop-blur-xl sticky top-0 z-20">
                                {/* Animated underline */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                                
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    >
                                        {React.createElement(tabs.find(t => t.id === activeTab)?.icon || User, { 
                                            className: "w-5 h-5 text-primary" 
                                        })}
                                    </motion.div>
                                    <div>
                                        <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                                            {tabs.find(t => t.id === activeTab)?.label}
                                        </h3>
                                        <p className="text-xs text-white/40">Configure your preferences</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        onClick={onClose}
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2.5 hover:bg-red-500/10 rounded-xl transition-colors text-white/60 hover:text-red-400 border border-transparent hover:border-red-500/30"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="relative flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
                                {/* Floating gradient orbs */}
                                <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
                                <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                        className="relative max-w-3xl mx-auto space-y-6"
                                    >
                                        {activeTab === 'personal' && (
                                            <div className="space-y-6">
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                    className="group relative bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 hover:border-primary/30 rounded-2xl p-6 space-y-4 backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-primary/10 overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
                                                    
                                                    <div className="relative">
                                                        <label className="flex items-center gap-2 text-sm font-semibold text-white/80 mb-3">
                                                            <User className="w-4 h-4 text-primary" />
                                                            Your Name
                                                        </label>
                                                        <div className="relative group/input">
                                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl opacity-0 group-hover/input:opacity-50 blur transition duration-500" />
                                                            <input
                                                                type="text"
                                                                value={localSettings.userName || ''}
                                                                onChange={(e) => setLocalSettings({ ...localSettings, userName: e.target.value })}
                                                                placeholder="What should we call you?"
                                                                className="relative w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2 }}
                                                        className="group relative bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 hover:border-primary/30 rounded-2xl p-6 flex items-center justify-between backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-primary/10 overflow-hidden"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                        <div className="relative z-10">
                                                            <div className="font-semibold text-white flex items-center gap-2">
                                                                <span className="text-2xl">💬</span>
                                                                Show Quotes
                                                            </div>
                                                            <div className="text-xs text-white/50 mt-1">Daily inspiration</div>
                                                        </div>
                                                        <div className="relative z-10">
                                                            <Toggle 
                                                                checked={localSettings.showQuotes || false} 
                                                                onChange={(checked) => setLocalSettings({ ...localSettings, showQuotes: checked })} 
                                                            />
                                                        </div>
                                                    </motion.div>

                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.25 }}
                                                        className="group relative bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 hover:border-accent/30 rounded-2xl p-6 flex items-center justify-between backdrop-blur-xl transition-all hover:shadow-lg hover:shadow-accent/10 overflow-hidden"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                        <div className="relative z-10">
                                                            <div className="font-semibold text-white flex items-center gap-2">
                                                                <span className="text-2xl">🌐</span>
                                                                Show IP Address
                                                            </div>
                                                            <div className="text-xs text-white/50 mt-1">Network info</div>
                                                        </div>
                                                        <div className="relative z-10">
                                                            <Toggle 
                                                                checked={localSettings.showIP || false} 
                                                                onChange={(checked) => setLocalSettings({ ...localSettings, showIP: checked })} 
                                                            />
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'themes' && (
                                            <div className="space-y-8">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {Object.entries(themes).map(([key, theme], index) => (
                                                    <motion.button
                                                        key={key}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        onClick={() => setLocalSettings({
                                                            ...localSettings,
                                                            theme: key,
                                                            customColors: undefined,
                                                            wallpaperUrl: theme.wallpaper,
                                                            wallpaperFile: undefined
                                                        })}
                                                        className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                                                            localSettings.theme === key 
                                                                ? 'border-primary shadow-[0_0_20px_rgba(var(--primary-color),0.3)] scale-105' 
                                                                : 'border-transparent hover:border-white/30 hover:scale-105'
                                                        }`}
                                                    >
                                                        <div 
                                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                            style={{ backgroundImage: `url(${theme.wallpaper})` }}
                                                        />
                                                        <div className={`absolute inset-0 ${theme.class} opacity-60 group-hover:opacity-40 transition-opacity mix-blend-overlay`} />
                                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                                        
                                                        {/* Theme Preview Circles */}
                                                        <div className="absolute bottom-3 right-3 flex -space-x-2">
                                                            {theme.colors.map((color, i) => (
                                                                <div 
                                                                    key={i} 
                                                                    className="w-6 h-6 rounded-full border-2 border-white/20 shadow-lg" 
                                                                    style={{ backgroundColor: color }}
                                                                />
                                                            ))}
                                                        </div>

                                                        <div className="absolute top-3 left-3 font-bold text-white text-shadow-lg">
                                                            {theme.name}
                                                        </div>

                                                        {localSettings.theme === key && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow-lg"
                                                                >
                                                                    <Check className="w-6 h-6" strokeWidth={3} />
                                                                </motion.div>
                                                            </div>
                                                        )}
                                                    </motion.button>
                                                ))}
                                            </div>

                                            {/* Custom Colors Section */}
                                            <div className="mt-8 pt-6 border-t border-white/10">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-bold text-white">Custom Colors</h3>
                                                    {localSettings.customColors && (
                                                        <button 
                                                            onClick={() => setLocalSettings({ ...localSettings, customColors: undefined })}
                                                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                                        >
                                                            Reset to Theme
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {[
                                                        { label: 'Primary', key: 'primary' },
                                                        { label: 'Secondary', key: 'secondary' },
                                                        { label: 'Accent', key: 'accent' }
                                                    ].map((color) => (
                                                        <div key={color.key} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-primary/30 transition-colors">
                                                            <label className="block text-sm text-white/60 mb-2">{color.label}</label>
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-lg ring-1 ring-white/10">
                                                                    <input 
                                                                        type="color" 
                                                                        value={localSettings.customColors?.[color.key as keyof typeof localSettings.customColors] as string || '#3b82f6'}
                                                                        onChange={(e) => setLocalSettings({
                                                                            ...localSettings,
                                                                            customColors: {
                                                                                primary: '#3b82f6',
                                                                                secondary: '#6366f1',
                                                                                accent: '#8b5cf6',
                                                                                bgGradientStart: '#1e1b4b',
                                                                                bgGradientEnd: '#312e81',
                                                                                ...(localSettings.customColors || {}),
                                                                                [color.key]: e.target.value
                                                                            },
                                                                            autoThemeFromWallpaper: false
                                                                        })}
                                                                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
                                                                    />
                                                                </div>
                                                                <span className="text-white font-mono text-sm uppercase">
                                                                    {localSettings.customColors?.[color.key as keyof typeof localSettings.customColors] as string || 'Default'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            </div>
                                        )}

                                        {activeTab === 'wallpaper' && (
                                            <div className="space-y-6">
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden relative group"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    
                                                    <div className="relative z-10 flex items-center justify-between mb-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                                                                <Sparkles className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-white text-lg">Auto-detect Colors</div>
                                                                <div className="text-sm text-white/50">Extract theme from wallpaper</div>
                                                            </div>
                                                        </div>
                                                        <Toggle 
                                                            checked={localSettings.autoThemeFromWallpaper || false} 
                                                            onChange={(checked) => setLocalSettings({
                                                                ...localSettings,
                                                                autoThemeFromWallpaper: checked
                                                            })} 
                                                        />
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-4 relative z-10">
                                                        <div>
                                                            <label className="block text-sm font-medium text-white/70 mb-2">Upload Image</label>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleFileUpload}
                                                                className="hidden"
                                                                id="wallpaper-upload"
                                                            />
                                                            <label
                                                                htmlFor="wallpaper-upload"
                                                                className="flex flex-col items-center justify-center gap-2 bg-black/20 hover:bg-black/30 border border-white/10 border-dashed rounded-xl p-8 cursor-pointer transition-all group/upload hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary-color),0.1)]"
                                                            >
                                                                <div className="p-4 rounded-full bg-white/5 group-hover/upload:bg-primary/20 transition-colors">
                                                                    <UploadIcon className="w-8 h-8 text-white/40 group-hover/upload:text-primary transition-colors" />
                                                                </div>
                                                                <span className="text-sm text-white/60 group-hover/upload:text-white transition-colors font-medium">Click to upload</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-white/70 mb-2">Image URL</label>
                                                            <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                                                                <ImageIcon className="w-5 h-5 text-white/40" />
                                                                <input
                                                                    type="text"
                                                                    value={localSettings.wallpaperUrl}
                                                                    onChange={(e) => setLocalSettings({ ...localSettings, wallpaperUrl: e.target.value, wallpaperFile: undefined })}
                                                                    placeholder="https://..."
                                                                    className="flex-1 bg-transparent text-white outline-none placeholder-white/30 text-sm"
                                                                    disabled={!!localSettings.wallpaperFile}
                                                                />
                                                            </div>
                                                            {localSettings.wallpaperUrl && (
                                                                <motion.div 
                                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className="mt-4 rounded-xl overflow-hidden h-32 border border-white/10 relative group/preview"
                                                                >
                                                                    <img src={localSettings.wallpaperUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-110" />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity" />
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        )}

                                        {activeTab === 'clock' && (
                                            <div className="space-y-6">
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 rounded-xl bg-white/5 text-white">
                                                                <Clock className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-white text-lg">24-Hour Format</div>
                                                                <div className="text-sm text-white/50">Use 24-hour time display</div>
                                                            </div>
                                                        </div>
                                                        <Toggle 
                                                            checked={localSettings.timeFormat === '24h'} 
                                                            onChange={(checked) => setLocalSettings({ ...localSettings, timeFormat: checked ? '24h' : '12h' })} 
                                                        />
                                                    </div>

                                                    <div className="h-px bg-white/10" />

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-3 rounded-xl bg-white/5 text-white">
                                                                <span className="text-xl font-bold">S</span>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-white text-lg">Show Seconds</div>
                                                                <div className="text-sm text-white/50">Display seconds in clock</div>
                                                            </div>
                                                        </div>
                                                        <Toggle 
                                                            checked={localSettings.showSeconds || false} 
                                                            onChange={(checked) => setLocalSettings({ ...localSettings, showSeconds: checked })} 
                                                        />
                                                    </div>
                                                </motion.div>
                                            </div>
                                        )}

                                        {activeTab === 'widgets' && (
                                            <div className="grid gap-3">
                                                {Object.entries(localSettings.widgets).map(([key, enabled], index) => (
                                                    <motion.div
                                                        key={key}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className={`relative overflow-hidden border rounded-xl p-4 transition-all duration-300 ${
                                                            enabled 
                                                                ? 'border-primary/30 bg-gradient-to-r from-primary/10 to-transparent' 
                                                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        {enabled && (
                                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent animate-pulse" />
                                                        )}
                                                        
                                                        <div className="relative z-10 flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                                                                    enabled 
                                                                        ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/20' 
                                                                        : 'bg-white/10 text-white/40'
                                                                }`}>
                                                                    <LayoutGrid className="w-5 h-5" />
                                                                </div>
                                                                <span className="capitalize font-medium text-white text-lg">
                                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                                </span>
                                                            </div>
                                                            <Toggle 
                                                                checked={Boolean(enabled)} 
                                                                onChange={(checked) => setLocalSettings({
                                                                    ...localSettings,
                                                                    widgets: { ...localSettings.widgets, [key]: checked }
                                                                })} 
                                                            />
                                                        </div>

                                                        {enabled && key !== 'aiAssistant' && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                className="flex gap-2 pl-13 relative z-10"
                                                            >
                                                                {(['small', 'medium', 'large'] as WidgetSize[]).map((size) => (
                                                                    <button
                                                                        key={size}
                                                                        onClick={() => setLocalSettings({
                                                                            ...localSettings,
                                                                            widgetSizes: { ...localSettings.widgetSizes, [key]: size }
                                                                        })}
                                                                        className={`text-xs px-4 py-2 rounded-lg font-medium transition-all border ${localSettings.widgetSizes[key] === size
                                                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                                            : 'bg-black/20 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                                                                            }`}
                                                                    >
                                                                        {size.charAt(0).toUpperCase() + size.slice(1)}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        {activeTab === 'shortcuts' && (
                                            <div className="space-y-6">
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    
                                                    <div className="relative z-10 flex gap-2 mb-6">
                                                        <div className="flex-1 relative group/input">
                                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl opacity-0 group-hover/input:opacity-50 blur transition duration-500" />
                                                            <input
                                                                type="text"
                                                                value={newShortcutName}
                                                                onChange={(e) => setNewShortcutName(e.target.value)}
                                                                placeholder="Name (e.g. YouTube)"
                                                                className="relative w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all text-sm placeholder-white/30"
                                                            />
                                                        </div>
                                                        <div className="flex-[2] relative group/input">
                                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl opacity-0 group-hover/input:opacity-50 blur transition duration-500" />
                                                            <input
                                                                type="text"
                                                                value={newShortcutUrl}
                                                                onChange={(e) => setNewShortcutUrl(e.target.value)}
                                                                placeholder="URL (https://...)"
                                                                className="relative w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all text-sm placeholder-white/30"
                                                            />
                                                        </div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={addShortcut}
                                                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white p-3 rounded-xl transition-all shadow-lg shadow-primary/20"
                                                        >
                                                            <PlusIcon className="w-5 h-5" />
                                                        </motion.button>
                                                    </div>

                                                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-primary/30">
                                                        <AnimatePresence mode="popLayout">
                                                            {localSettings.shortcuts.map((shortcut, index) => (
                                                                <motion.div
                                                                    key={shortcut.id}
                                                                    initial={{ opacity: 0, x: -20 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                                                    transition={{ delay: index * 0.05 }}
                                                                    layout
                                                                    className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5 group hover:border-primary/30 hover:bg-white/5 transition-all"
                                                                >
                                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                                                        {shortcut.icon ? (
                                                                            <img src={shortcut.icon} alt="" className="w-6 h-6 rounded-sm" />
                                                                        ) : (
                                                                            <LinkIcon className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="font-medium text-white text-sm truncate group-hover:text-primary transition-colors">{shortcut.name}</div>
                                                                        <div className="text-xs text-white/40 truncate group-hover:text-white/60 transition-colors">{shortcut.url}</div>
                                                                    </div>
                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={() => deleteShortcut(shortcut.id)}
                                                                        className="p-2 hover:bg-red-500/10 rounded-lg text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        <Trash2Icon className="w-4 h-4" />
                                                                    </motion.button>
                                                                </motion.div>
                                                            ))}
                                                        </AnimatePresence>
                                                        {localSettings.shortcuts.length === 0 && (
                                                            <div className="text-center py-10 text-white/30">
                                                                <LinkIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                                <p>No shortcuts added yet</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </div>
                                        )}

                                        {activeTab === 'api' && (
                                            <div className="space-y-4">
                                                {[
                                                    {
                                                        key: 'weather',
                                                        label: 'Weather API',
                                                        link: 'https://open-meteo.com/',
                                                        description: 'Optional. Using free Open-Meteo by default.',
                                                        icon: '🌤️'
                                                    },
                                                    {
                                                        key: 'groq',
                                                        label: 'Groq AI API',
                                                        link: 'https://console.groq.com',
                                                        description: 'Required for AI Assistant functionality.',
                                                        icon: '🤖'
                                                    }
                                                ].map((api, index) => (
                                                    <motion.div 
                                                        key={api.key}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden hover:border-primary/30 transition-all"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                        
                                                        <div className="relative z-10">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-2xl shadow-inner">
                                                                        {api.icon}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-white flex items-center gap-2">
                                                                            {api.label}
                                                                            {localSettings.apiKeys[api.key as keyof typeof localSettings.apiKeys] && (
                                                                                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                                                                                    Connected
                                                                                </span>
                                                                            )}
                                                                        </h4>
                                                                        <p className="text-xs text-white/50">{api.description}</p>
                                                                    </div>
                                                                </div>
                                                                <a
                                                                    href={api.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors flex items-center gap-1 border border-primary/20"
                                                                >
                                                                    Get Key <span className="text-[10px]">↗</span>
                                                                </a>
                                                            </div>
                                                            <div className="relative group/input">
                                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl opacity-0 group-hover/input:opacity-50 blur transition duration-500" />
                                                                <div className="relative flex items-center">
                                                                    <Key className="absolute left-4 w-4 h-4 text-white/30 group-focus-within/input:text-primary transition-colors" />
                                                                    <input
                                                                        type="password"
                                                                        value={localSettings.apiKeys[api.key as keyof typeof localSettings.apiKeys] || ''}
                                                                        onChange={(e) => setLocalSettings({
                                                                            ...localSettings,
                                                                            apiKeys: { ...localSettings.apiKeys, [api.key]: e.target.value }
                                                                        })}
                                                                        placeholder={`Enter ${api.label} Key`}
                                                                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white outline-none focus:border-primary/50 transition-all font-mono text-sm placeholder-white/20"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Footer Action Bar */}
                            <div className="relative p-6 border-t border-white/10 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-xl flex justify-end gap-3">
                                {/* Animated top border */}
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                                
                                <motion.button
                                    onClick={onClose}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-3 rounded-xl font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all border border-white/10 hover:border-white/20"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleSave}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:shadow-xl transition-all flex items-center gap-2 overflow-hidden group"
                                >
                                    {/* Animated gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    {/* Shine effect */}
                                    <motion.div 
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                    />
                                    
                                    <Save className="w-5 h-5 relative z-10" />
                                    <span className="relative z-10">Save Changes</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
