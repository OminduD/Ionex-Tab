// src/components/SettingsPanel.tsx
// The settings panel component - Completely redesigned with animations and new UI

import React, { useState, useEffect } from 'react';
import { Settings, WidgetSize } from '../types';
import { XIcon, PlusIcon, Trash2Icon, UploadIcon, ImageIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  settings: Settings;
  setSettings: (value: Settings | ((val: Settings) => Settings)) => void;
  isVisible: boolean;
  onClose: () => void;
}

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

export const SettingsPanel: React.FC<Props> = ({ settings, setSettings, isVisible, onClose }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [newShortcutName, setNewShortcutName] = useState('');
    const [newShortcutUrl, setNewShortcutUrl] = useState('');

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings, isVisible]);

    if (!isVisible) return null;

    const handleSave = () => {
        // Trim all API keys before saving
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
                    wallpaperUrl: '' // Clear URL when using file
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addShortcut = () => {
        if (newShortcutName && newShortcutUrl) {
            // Extract icon from URL
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

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleSave}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                            <motion.div
                                className="absolute inset-0 opacity-30"
                                animate={{
                                    background: [
                                        'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
                                        'radial-gradient(circle at 80% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
                                        'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
                                    ],
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>

                        {/* Content container */}
                        <div className="relative bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                            {/* Header */}
                            <motion.div 
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="sticky top-0 z-10 bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-b border-white/10 px-8 py-6"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <motion.img 
                                            src="/Ionex.png" 
                                            alt="Ionex Logo" 
                                            className="w-12 h-12 rounded-xl object-contain"
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            onError={(e) => e.currentTarget.style.display = 'none'}
                                        />
                                        <div>
                                            <motion.h2 
                                                initial={{ x: -20 }}
                                                animate={{ x: 0 }}
                                                className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                                            >
                                                Settings
                                            </motion.h2>
                                            <p className="text-sm text-white/50">Customize your experience</p>
                                        </div>
                                    </div>
                                    <motion.button 
                                        onClick={onClose}
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 hover:bg-white/10 rounded-xl transition-colors group"
                                        title="Close"
                                    >
                                        <XIcon className="w-6 h-6 text-white/70 group-hover:text-white" />
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Scrollable content */}
                            <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-8 py-6 space-y-8 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                                
                                {/* Personal Settings */}
                                <motion.section
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-icons text-primary" style={{ fontSize: '28px' }}>person</span>
                                        <h3 className="text-2xl font-bold text-white">Personal</h3>
                                    </div>
                                    <motion.div 
                                        whileHover={{ scale: 1.01 }}
                                        className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-white/70 mb-3">Your Name</label>
                                            <input
                                                type="text"
                                                value={localSettings.userName || ''}
                                                onChange={(e) => setLocalSettings({ ...localSettings, userName: e.target.value })}
                                                placeholder="Enter your name"
                                                className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white outline-none focus:bg-white/15 focus:border-primary transition-all placeholder-white/30"
                                            />
                                        </div>
                                        
                                        {/* Separate toggles for Quotes and IP */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons text-primary text-2xl">format_quote</span>
                                                <div>
                                                    <label className="text-sm font-medium text-white">Show Quotes</label>
                                                    <p className="text-xs text-white/50">Display inspirational quotes</p>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setLocalSettings({ ...localSettings, showQuotes: !localSettings.showQuotes })}
                                                className={`relative w-14 h-7 rounded-full transition-colors ${
                                                    localSettings.showQuotes ? 'bg-gradient-to-r from-primary to-accent' : 'bg-white/20'
                                                }`}
                                            >
                                                <motion.div
                                                    animate={{ x: localSettings.showQuotes ? 28 : 2 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                                                />
                                            </motion.button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons text-secondary text-2xl">public</span>
                                                <div>
                                                    <label className="text-sm font-medium text-white">Show IP Address</label>
                                                    <p className="text-xs text-white/50">Display IP and location info</p>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setLocalSettings({ ...localSettings, showIP: !localSettings.showIP })}
                                                className={`relative w-14 h-7 rounded-full transition-colors ${
                                                    localSettings.showIP ? 'bg-gradient-to-r from-secondary to-accent' : 'bg-white/20'
                                                }`}
                                            >
                                                <motion.div
                                                    animate={{ x: localSettings.showIP ? 28 : 2 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                                                />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </motion.section>

                                {/* Theme Section */}
                                <motion.section
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-icons text-primary" style={{ fontSize: '28px' }}>palette</span>
                                        <h3 className="text-2xl font-bold text-white">Themes</h3>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {Object.entries(themes).map(([key, theme], index) => (
                                            <motion.button
                                                key={key}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.4 + index * 0.05, type: 'spring' }}
                                                whileHover={{ scale: 1.05, y: -5 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setLocalSettings({ 
                                                    ...localSettings, 
                                                    theme: key, 
                                                    customColors: undefined,
                                                    wallpaperUrl: theme.wallpaper,
                                                    wallpaperFile: undefined
                                                })}
                                                className={`relative p-6 rounded-2xl ${theme.class} overflow-hidden group ${
                                                    localSettings.theme === key ? 'ring-4 ring-white shadow-2xl' : 'ring-2 ring-white/20'
                                                }`}
                                            >
                                                {/* Animated shine effect */}
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                    initial={{ x: '-100%' }}
                                                    whileHover={{ x: '100%' }}
                                                    transition={{ duration: 0.6 }}
                                                />
                                                
                                                <div className="relative z-10">
                                                    <div className="text-white font-bold text-lg mb-2">{theme.name}</div>
                                                    <div className="flex gap-1 justify-center">
                                                        {theme.colors.map((color, i) => (
                                                            <motion.div
                                                                key={i}
                                                                className="w-3 h-3 rounded-full border border-white/30"
                                                                style={{ backgroundColor: color }}
                                                                whileHover={{ scale: 1.5 }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                {localSettings.theme === key && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute top-2 right-2"
                                                    >
                                                        <span className="material-icons text-white" style={{ fontSize: '24px' }}>check_circle</span>
                                                    </motion.div>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.section>

                                {/* Wallpaper Section */}
                                <motion.section
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-icons text-primary" style={{ fontSize: '28px' }}>wallpaper</span>
                                        <h3 className="text-2xl font-bold text-white">Wallpaper</h3>
                                    </div>
                                    
                                    {/* Auto Theme Toggle */}
                                    <motion.div 
                                        whileHover={{ scale: 1.01 }}
                                        className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-md rounded-2xl p-5 border border-white/20"
                                    >
                                        <label className="flex items-center gap-4 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={localSettings.autoThemeFromWallpaper || false}
                                                onChange={(e) => setLocalSettings({ 
                                                    ...localSettings, 
                                                    autoThemeFromWallpaper: e.target.checked 
                                                })}
                                                className="w-6 h-6 rounded-lg accent-primary"
                                            />
                                            <div>
                                                <div className="font-semibold text-white">Auto-detect Colors</div>
                                                <div className="text-sm text-white/60">Extract theme from wallpaper</div>
                                            </div>
                                        </label>
                                    </motion.div>
                                    
                                    {/* Upload & URL */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-3">
                                            <label className="block text-sm font-medium text-white/70">Upload Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                id="wallpaper-upload"
                                            />
                                            <label 
                                                htmlFor="wallpaper-upload"
                                                className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-5 py-4 cursor-pointer transition-all group"
                                            >
                                                <UploadIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                <span className="font-medium">{localSettings.wallpaperFile ? 'Change' : 'Choose'}</span>
                                            </label>
                                        </motion.div>

                                        <motion.div whileHover={{ scale: 1.02 }} className="space-y-3">
                                            <label className="block text-sm font-medium text-white/70">Image URL</label>
                                            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                                                <ImageIcon className="w-5 h-5 text-white/50" />
                                                <input
                                                    type="text"
                                                    value={localSettings.wallpaperUrl}
                                                    onChange={(e) => setLocalSettings({ ...localSettings, wallpaperUrl: e.target.value, wallpaperFile: undefined })}
                                                    placeholder="Enter URL"
                                                    className="flex-1 bg-transparent text-white outline-none placeholder-white/30"
                                                    disabled={!!localSettings.wallpaperFile}
                                                />
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.section>

                                {/* Clock Settings Section */}
                                <motion.section
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.55 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-icons text-primary" style={{ fontSize: '28px' }}>schedule</span>
                                        <h3 className="text-2xl font-bold text-white">Clock Settings</h3>
                                    </div>
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 space-y-4"
                                    >
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-white/90">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="material-icons text-primary text-xl">schedule</span>
                                                    <span>Clock Type</span>
                                                </div>
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['digital', 'analog', 'both'].map((type) => (
                                                    <motion.button
                                                        key={type}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setLocalSettings({ ...localSettings, clockType: type as 'digital' | 'analog' | 'both' })}
                                                        className={`py-2 px-4 rounded-lg font-medium transition-all ${
                                                            localSettings.clockType === type
                                                                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                                                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                        }`}
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3 pt-4 border-t border-white/10">
                                            <label className="block text-sm font-medium text-white/90">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="material-icons text-secondary text-xl">access_time</span>
                                                    <span>Time Format</span>
                                                </div>
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setLocalSettings({ ...localSettings, timeFormat: '12h' })}
                                                    className={`py-2 px-4 rounded-lg font-medium transition-all ${
                                                        localSettings.timeFormat === '12h'
                                                            ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg'
                                                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                    }`}
                                                >
                                                    12 Hour (AM/PM)
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setLocalSettings({ ...localSettings, timeFormat: '24h' })}
                                                    className={`py-2 px-4 rounded-lg font-medium transition-all ${
                                                        localSettings.timeFormat === '24h'
                                                            ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg'
                                                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                    }`}
                                                >
                                                    24 Hour
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.section>

                                {/* Widgets Section */}
                                <motion.section
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-icons text-primary" style={{ fontSize: '28px' }}>widgets</span>
                                        <h3 className="text-2xl font-bold text-white">Widgets</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {Object.entries(localSettings.widgets).map(([key, enabled], index) => {
                                            // AI Assistant is now a side panel - only show toggle, no size selector
                                            const isAIAssistant = key === 'aiAssistant';
                                            
                                            return (
                                                <motion.div
                                                    key={key}
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.7 + index * 0.03 }}
                                                    whileHover={{ scale: 1.02 }}
                                                    className={`bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 transition-all ${
                                                        isAIAssistant ? 'border-primary/30 bg-primary/5' : ''
                                                    }`}
                                                >
                                                    <label className={`flex items-center justify-between cursor-pointer ${!isAIAssistant && enabled ? 'mb-3' : ''}`}>
                                                        <div className="flex items-center gap-2">
                                                            {isAIAssistant && (
                                                                <span className="material-icons text-primary text-lg">smart_toy</span>
                                                            )}
                                                            <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                            {isAIAssistant && (
                                                                <span className="text-xs text-white/50 ml-1">(Side Panel)</span>
                                                            )}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            checked={Boolean(enabled)}
                                                            onChange={(e) => setLocalSettings({
                                                                ...localSettings,
                                                                widgets: { ...localSettings.widgets, [key]: e.target.checked }
                                                            })}
                                                            className="w-5 h-5 accent-primary rounded"
                                                        />
                                                    </label>
                                                    {/* Show size selector for all widgets EXCEPT AI Assistant */}
                                                    {enabled && !isAIAssistant && (
                                                        <motion.div 
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            className="flex gap-2"
                                                        >
                                                            {(['small', 'medium', 'large'] as WidgetSize[]).map((size) => (
                                                                <motion.button
                                                                    key={size}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => setLocalSettings({
                                                                        ...localSettings,
                                                                        widgetSizes: { ...localSettings.widgetSizes, [key]: size }
                                                                    })}
                                                                    className={`flex-1 text-xs px-3 py-2 rounded-lg font-medium transition-all ${
                                                                        localSettings.widgetSizes[key] === size 
                                                                            ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg' 
                                                                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                                    }`}
                                                                >
                                                                    {size}
                                                                </motion.button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.section>

                                {/* Shortcuts Section */}
                                <motion.section
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-icons text-primary" style={{ fontSize: '28px' }}>link</span>
                                        <h3 className="text-2xl font-bold text-white">Quick Links</h3>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <AnimatePresence>
                                            {localSettings.shortcuts.map((shortcut, index) => (
                                                <motion.div
                                                    key={shortcut.id}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    exit={{ x: 20, opacity: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 group"
                                                >
                                                    <span className="material-icons text-white/70" style={{ fontSize: '20px' }}>public</span>
                                                    <span className="flex-1 font-medium">{shortcut.name}</span>
                                                    <motion.button 
                                                        onClick={() => deleteShortcut(shortcut.id)}
                                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2Icon className="w-4 h-4 text-red-400" />
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                    <motion.div 
                                        whileHover={{ scale: 1.01 }}
                                        className="flex gap-2 bg-white/5 p-3 rounded-xl border border-white/10"
                                    >
                                        <input
                                            type="text"
                                            value={newShortcutName}
                                            onChange={(e) => setNewShortcutName(e.target.value)}
                                            placeholder="Name"
                                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:bg-white/15 focus:border-primary transition-all placeholder-white/30"
                                        />
                                        <input
                                            type="text"
                                            value={newShortcutUrl}
                                            onChange={(e) => setNewShortcutUrl(e.target.value)}
                                            placeholder="URL"
                                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:bg-white/15 focus:border-primary transition-all placeholder-white/30"
                                        />
                                        <motion.button 
                                            onClick={addShortcut}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg transition-all hover:shadow-lg"
                                            title="Add shortcut"
                                        >
                                            <PlusIcon className="w-6 h-6" />
                                        </motion.button>
                                    </motion.div>
                                </motion.section>

                                {/* API Keys Section */}
                                <motion.section
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="material-icons text-primary" style={{ fontSize: '28px' }}>key</span>
                                        <h3 className="text-2xl font-bold text-white">API Keys</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { 
                                                key: 'weather', 
                                                label: 'Weather API (Optional)', 
                                                link: 'https://open-meteo.com/', 
                                                icon: 'cloud', 
                                                description: '✅ Using FREE Open-Meteo (No API key needed!)',
                                                alternatives: [
                                                    { name: '✅ Open-Meteo (Active)', url: 'https://open-meteo.com/', free: 'Built-in - No key needed!' },
                                                    { name: 'WeatherAPI.com', url: 'https://www.weatherapi.com/signup.aspx', free: '1M calls/month' },
                                                    { name: 'Tomorrow.io', url: 'https://www.tomorrow.io/weather-api/', free: '1000 calls/day' },
                                                    { name: '7Timer!', url: 'http://www.7timer.info/doc.php', free: 'Unlimited & Free' }
                                                ]
                                            },
                                            { key: 'groq', label: 'Groq AI', link: 'https://console.groq.com', icon: 'rocket_launch', description: 'For AI assistant' }
                                        ].map((api, index) => (
                                            <motion.div
                                                key={api.key}
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.9 + index * 0.1 }}
                                                whileHover={{ scale: 1.01 }}
                                                className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10"
                                            >
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="material-icons text-accent" style={{ fontSize: '24px' }}>{api.icon}</span>
                                                    <label className="font-semibold text-white">{api.label}</label>
                                                </div>
                                                <input
                                                    type="password"
                                                    value={localSettings.apiKeys[api.key as keyof typeof localSettings.apiKeys] || ''}
                                                    onChange={(e) => setLocalSettings({
                                                        ...localSettings,
                                                        apiKeys: { ...localSettings.apiKeys, [api.key]: e.target.value }
                                                    })}
                                                    placeholder={`Enter ${api.label} API key`}
                                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:bg-white/15 focus:border-primary transition-all placeholder-white/30 mb-2"
                                                />
                                                <a 
                                                    href={api.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-xs text-accent hover:text-primary transition-colors flex items-center gap-1 mb-3"
                                                >
                                                    <span className="material-icons" style={{ fontSize: '14px' }}>open_in_new</span>
                                                    Get API Key - {api.description}
                                                </a>
                                                
                                                {/* Show free alternatives for Weather API */}
                                                {api.key === 'weather' && (api as any).alternatives && (
                                                    <div className="mt-3 pt-3 border-t border-white/10">
                                                        <p className="text-xs text-white/70 mb-2 font-semibold">🆓 Free Weather API Alternatives:</p>
                                                        <div className="space-y-1">
                                                            {(api as any).alternatives.map((alt: any, i: number) => (
                                                                <a
                                                                    key={i}
                                                                    href={alt.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-green-400 hover:text-green-300 transition-colors flex items-center gap-1 group"
                                                                >
                                                                    <span className="material-icons text-green-500 group-hover:text-green-400" style={{ fontSize: '12px' }}>check_circle</span>
                                                                    <span className="font-medium">{alt.name}</span>
                                                                    <span className="text-white/50">- {alt.free}</span>
                                                                </a>
                                                            ))}
                                                        </div>
                                                        <p className="text-[10px] text-yellow-400/80 mt-2">⭐ Recommended: WeatherAPI.com or Open-Meteo (no key needed!)</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.section>
                            </div>

                            {/* Footer with Save Button */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className="sticky bottom-0 bg-gradient-to-t from-gray-900 to-gray-900/95 backdrop-blur-xl border-t border-white/10 px-8 py-6"
                            >
                                <motion.button
                                    onClick={handleSave}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 group"
                                >
                                    <span className="material-icons group-hover:rotate-90 transition-transform" style={{ fontSize: '24px' }}>save</span>
                                    <span className="text-lg">Save & Apply Changes</span>
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
