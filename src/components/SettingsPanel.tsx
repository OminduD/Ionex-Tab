// src/components/SettingsPanel.tsx
// The settings panel component - Redesigned with a futuristic "Command Center" aesthetic

import React, { useState, useEffect } from 'react';
import { Settings, WidgetSize } from '../types';
import { PlusIcon, Trash2Icon, UploadIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Image as ImageIconLucide, Palette, User, Sparkles, PawPrint, Clock, LayoutGrid, Link as LinkIcon, Key, Check, Cpu, Globe, Shield } from 'lucide-react';

interface Props {
    settings: Settings;
    setSettings: (value: Settings | ((val: Settings) => Settings)) => void;
    isVisible: boolean;
    onClose: () => void;
}

// Futuristic Toggle Component
const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label?: string }) => (
    <div className="flex items-center justify-between group cursor-pointer" onClick={() => onChange(!checked)}>
        {label && <span className="font-medium text-blue-100/80 group-hover:text-cyan-400 transition-colors tracking-wide">{label}</span>}
        <div className="relative w-12 h-6">
            {/* Track */}
            <div className={`absolute inset-0 rounded-sm skew-x-[-10deg] transition-all duration-300 border ${checked ? 'bg-cyan-500/20 border-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'bg-slate-800/50 border-slate-600/50'}`} />

            {/* Thumb */}
            <motion.div
                className={`absolute top-1 bottom-1 w-4 rounded-sm skew-x-[-10deg] shadow-md transition-all duration-300 flex items-center justify-center ${checked ? 'bg-cyan-400' : 'bg-slate-400'}`}
                animate={{ left: checked ? 'calc(100% - 1.25rem)' : '0.25rem' }}
            >
                <div className={`w-0.5 h-2 ${checked ? 'bg-black/50' : 'bg-black/30'}`} />
            </motion.div>
        </div>
    </div>
);

// Theme Definitions
const themes: Record<string, { name: string; class: string; wallpaper: string; colors: string[] }> = {
    aurora: { name: 'Aurora', class: 'bg-gradient-to-br from-purple-600 to-blue-500', wallpaper: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop', colors: ['#9333ea', '#3b82f6', '#6366f1'] },
    sunset: { name: 'Sunset', class: 'bg-gradient-to-br from-amber-500 to-rose-600', wallpaper: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=2070&auto=format&fit=crop', colors: ['#f59e0b', '#f43f5e', '#e11d48'] },
    forest: { name: 'Forest', class: 'bg-gradient-to-br from-lime-600 to-emerald-700', wallpaper: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop', colors: ['#65a30d', '#059669', '#047857'] },
    ocean: { name: 'Ocean', class: 'bg-gradient-to-br from-sky-400 to-blue-700', wallpaper: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2026&auto=format&fit=crop', colors: ['#38bdf8', '#1d4ed8', '#0369a1'] },
    midnight: { name: 'Midnight', class: 'bg-gradient-to-br from-gray-900 to-violet-900', wallpaper: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop', colors: ['#a78bfa', '#7c3aed', '#8b5cf6'] },
    neon: { name: 'Neon', class: 'bg-gradient-to-br from-fuchsia-500 to-cyan-500', wallpaper: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2187&auto=format&fit=crop', colors: ['#d946ef', '#06b6d4', '#8b5cf6'] },
    cherry: { name: 'Cherry', class: 'bg-gradient-to-br from-pink-600 to-red-700', wallpaper: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2070&auto=format&fit=crop', colors: ['#db2777', '#dc2626', '#be123c'] },
    mint: { name: 'Mint', class: 'bg-gradient-to-br from-teal-400 to-green-600', wallpaper: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop', colors: ['#2dd4bf', '#16a34a', '#14b8a6'] },
};

type TabId = 'personal' | 'themes' | 'wallpaper' | 'clock' | 'widgets' | 'shortcuts' | 'api';

export const SettingsPanel: React.FC<Props> = ({ settings, setSettings, isVisible, onClose }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [activeTab, setActiveTab] = useState<TabId>('personal');
    const [newShortcutName, setNewShortcutName] = useState('');
    const [newShortcutUrl, setNewShortcutUrl] = useState('');

    useEffect(() => { setLocalSettings(settings); }, [settings, isVisible]);

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
                setLocalSettings((prev: Settings) => ({ ...prev, wallpaperFile: reader.result as string, wallpaperUrl: '' }));
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
            } catch (e) { console.error('Invalid URL'); }

            setLocalSettings((prev: Settings) => ({
                ...prev,
                shortcuts: [...prev.shortcuts, { id: Date.now().toString(), name: newShortcutName, url: newShortcutUrl, icon: iconUrl }]
            }));
            setNewShortcutName('');
            setNewShortcutUrl('');
        }
    };

    const deleteShortcut = (id: string) => {
        setLocalSettings((prev: Settings) => ({ ...prev, shortcuts: prev.shortcuts.filter(s => s.id !== id) }));
    };

    const tabs = [
        { id: 'personal', label: 'Identity', icon: User },
        { id: 'themes', label: 'Visuals', icon: Palette },
        { id: 'wallpaper', label: 'Background', icon: ImageIconLucide },
        { id: 'clock', label: 'Time', icon: Clock },
        { id: 'widgets', label: 'Modules', icon: LayoutGrid },
        { id: 'shortcuts', label: 'Links', icon: LinkIcon },
        { id: 'api', label: 'Network', icon: Globe },
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 font-mono"
                    onClick={handleSave}
                >
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-6xl h-[85vh] flex flex-col md:flex-row bg-[#050a14]/90 backdrop-blur-2xl border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)] rounded-lg overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Decorative Corner Accents */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg pointer-events-none" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-lg pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-lg pointer-events-none" />

                        {/* Sidebar */}
                        <div className="w-full md:w-64 bg-black/20 border-b md:border-b-0 md:border-r border-cyan-500/10 flex flex-col relative">
                            <div className="p-6 border-b border-cyan-500/10 bg-gradient-to-r from-cyan-900/10 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 flex items-center justify-center bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                                        <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-cyan-100 tracking-wider">SYSTEM</h2>
                                        <p className="text-[10px] text-cyan-500/60 uppercase tracking-[0.2em]">Configuration</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto py-4 space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as TabId)}
                                            className={`w-full flex items-center gap-3 px-6 py-3 relative group transition-all duration-300 ${isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-200'}`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-400"
                                                    transition={{ duration: 0.3 }}
                                                />
                                            )}
                                            <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : ''}`} />
                                            <span className="text-sm font-medium tracking-wide relative z-10">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-cyan-500/10 text-center">
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Ionex OS v2.0</div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-transparent to-cyan-900/5 relative">
                            {/* Header */}
                            <div className="p-6 border-b border-cyan-500/10 flex items-center justify-between bg-black/20">
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                                        <span className="text-cyan-500">/</span>
                                        {tabs.find(t => t.id === activeTab)?.label.toUpperCase()}
                                        <span className="text-cyan-500">/</span>
                                    </h3>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors group">
                                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>

                            {/* Scrollable Area */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-8 max-w-4xl mx-auto"
                                    >
                                        {activeTab === 'personal' && (
                                            <div className="grid gap-6">
                                                <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><User className="w-24 h-24" /></div>
                                                    <h4 className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-4">User Profile</h4>
                                                    <div className="space-y-4 relative z-10">
                                                        <div>
                                                            <label className="text-xs text-slate-400 uppercase tracking-wide block mb-2">Designation</label>
                                                            <input
                                                                type="text"
                                                                value={localSettings.userName || ''}
                                                                onChange={(e) => setLocalSettings({ ...localSettings, userName: e.target.value })}
                                                                placeholder="ENTER NAME"
                                                                className="w-full bg-black/40 border border-slate-700 rounded p-3 text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {[
                                                        { label: 'Show Quotes', sub: 'Daily Inspiration', key: 'showQuotes', icon: Sparkles },
                                                        { label: 'Show IP', sub: 'Network Identity', key: 'showIP', icon: Shield },
                                                        { label: 'Virtual Pet', sub: 'Digital Companion', key: 'showVirtualPet', icon: PawPrint },
                                                    ].map((item) => (
                                                        <div key={item.key} className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-5 flex items-center justify-between hover:border-cyan-500/30 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-cyan-500/10 rounded text-cyan-400"><item.icon className="w-5 h-5" /></div>
                                                                <div>
                                                                    <div className="font-bold text-slate-200 text-sm">{item.label}</div>
                                                                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{item.sub}</div>
                                                                </div>
                                                            </div>
                                                            <Toggle checked={Boolean(localSettings[item.key as keyof Settings])} onChange={(c) => setLocalSettings({ ...localSettings, [item.key]: c })} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'themes' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {Object.entries(themes).map(([key, theme]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => setLocalSettings({ ...localSettings, theme: key, customColors: undefined, wallpaperUrl: theme.wallpaper, wallpaperFile: undefined })}
                                                        className={`relative group h-32 rounded-lg overflow-hidden border-2 transition-all ${localSettings.theme === key ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'border-slate-800 hover:border-slate-600'}`}
                                                    >
                                                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${theme.wallpaper})` }} />
                                                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                                                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-end">
                                                            <span className="font-bold text-white tracking-wide">{theme.name}</span>
                                                            <div className="flex gap-1">
                                                                {theme.colors.map(c => <div key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />)}
                                                            </div>
                                                        </div>
                                                        {localSettings.theme === key && <div className="absolute top-2 right-2 bg-cyan-500 text-black p-1 rounded-full"><Check className="w-3 h-3" /></div>}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {activeTab === 'wallpaper' && (
                                            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 space-y-6">
                                                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                                    <div>
                                                        <h4 className="text-cyan-400 font-bold uppercase text-sm tracking-wider">Auto-Theme</h4>
                                                        <p className="text-xs text-slate-500">Extract colors from wallpaper</p>
                                                    </div>
                                                    <Toggle checked={localSettings.autoThemeFromWallpaper || false} onChange={(c) => setLocalSettings({ ...localSettings, autoThemeFromWallpaper: c })} />
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="text-xs text-slate-400 uppercase tracking-wide block mb-2">Upload File</label>
                                                        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-700 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all cursor-pointer group">
                                                            <UploadIcon className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 mb-2" />
                                                            <span className="text-xs text-slate-500 group-hover:text-cyan-300">Select Image</span>
                                                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-400 uppercase tracking-wide block mb-2">Image URL</label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={localSettings.wallpaperUrl}
                                                                onChange={(e) => setLocalSettings({ ...localSettings, wallpaperUrl: e.target.value, wallpaperFile: undefined })}
                                                                placeholder="HTTPS://"
                                                                className="flex-1 bg-black/40 border border-slate-700 rounded p-3 text-white text-xs font-mono focus:border-cyan-500/50 outline-none"
                                                            />
                                                        </div>
                                                        {(localSettings.wallpaperUrl || localSettings.wallpaperFile) && (
                                                            <div className="mt-4 h-20 rounded overflow-hidden border border-slate-700 relative">
                                                                <img src={localSettings.wallpaperFile || localSettings.wallpaperUrl} className="w-full h-full object-cover opacity-50" />
                                                                <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-mono">PREVIEW</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'clock' && (
                                            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-white font-bold">24-Hour Format</h4>
                                                        <p className="text-xs text-slate-500">Military time display</p>
                                                    </div>
                                                    <Toggle checked={localSettings.timeFormat === '24h'} onChange={(c) => setLocalSettings({ ...localSettings, timeFormat: c ? '24h' : '12h' })} />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-white font-bold">Show Seconds</h4>
                                                        <p className="text-xs text-slate-500">Precision timing</p>
                                                    </div>
                                                    <Toggle checked={localSettings.showSeconds || false} onChange={(c) => setLocalSettings({ ...localSettings, showSeconds: c })} />
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'widgets' && (
                                            <div className="grid gap-4">
                                                {Object.entries(localSettings.widgets).map(([key, enabled]) => (
                                                    <div key={key} className={`border rounded-lg p-4 transition-all ${enabled ? 'bg-cyan-900/10 border-cyan-500/30' : 'bg-slate-900/30 border-slate-800'}`}>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded ${enabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                                                                    <LayoutGrid className="w-4 h-4" />
                                                                </div>
                                                                <span className="font-bold text-slate-200 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                            </div>
                                                            <Toggle checked={Boolean(enabled)} onChange={(c) => setLocalSettings({ ...localSettings, widgets: { ...localSettings.widgets, [key]: c } })} />
                                                        </div>
                                                        {enabled && key !== 'aiAssistant' && (
                                                            <div className="flex gap-2 pl-11">
                                                                {(['small', 'medium', 'large'] as WidgetSize[]).map((size) => (
                                                                    <button
                                                                        key={size}
                                                                        onClick={() => setLocalSettings({ ...localSettings, widgetSizes: { ...localSettings.widgetSizes, [key]: size } })}
                                                                        className={`text-[10px] uppercase px-3 py-1 rounded border transition-all ${localSettings.widgetSizes[key] === size ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}
                                                                    >
                                                                        {size}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {activeTab === 'shortcuts' && (
                                            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 space-y-6">
                                                <div className="flex gap-2">
                                                    <input type="text" value={newShortcutName} onChange={(e) => setNewShortcutName(e.target.value)} placeholder="NAME" className="flex-1 bg-black/40 border border-slate-700 rounded p-2 text-white text-xs font-mono focus:border-cyan-500/50 outline-none" />
                                                    <input type="text" value={newShortcutUrl} onChange={(e) => setNewShortcutUrl(e.target.value)} placeholder="URL" className="flex-[2] bg-black/40 border border-slate-700 rounded p-2 text-white text-xs font-mono focus:border-cyan-500/50 outline-none" />
                                                    <button onClick={addShortcut} className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 rounded px-4 transition-colors"><PlusIcon className="w-4 h-4" /></button>
                                                </div>
                                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                                    {localSettings.shortcuts.map((s) => (
                                                        <div key={s.id} className="flex items-center gap-3 p-3 bg-black/20 border border-white/5 rounded hover:border-cyan-500/30 transition-colors group">
                                                            {s.icon ? <img src={s.icon} className="w-6 h-6 rounded-sm" /> : <LinkIcon className="w-4 h-4 text-slate-500" />}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-bold text-slate-300 group-hover:text-cyan-300 truncate">{s.name}</div>
                                                                <div className="text-[10px] text-slate-600 font-mono truncate">{s.url}</div>
                                                            </div>
                                                            <button onClick={() => deleteShortcut(s.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2Icon className="w-4 h-4" /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'api' && (
                                            <div className="space-y-4">
                                                {[{ key: 'weather', label: 'Weather API', icon: '🌤️' }, { key: 'groq', label: 'Groq AI API', icon: '🤖' }].map((api) => (
                                                    <div key={api.key} className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/30 transition-colors">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xl">{api.icon}</span>
                                                                <div>
                                                                    <h4 className="font-bold text-white text-sm uppercase tracking-wide">{api.label}</h4>
                                                                    {localSettings.apiKeys[api.key as keyof typeof localSettings.apiKeys] && <span className="text-[10px] text-green-400 font-mono">● CONNECTED</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="relative">
                                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                            <input
                                                                type="password"
                                                                value={localSettings.apiKeys[api.key as keyof typeof localSettings.apiKeys] || ''}
                                                                onChange={(e) => setLocalSettings({ ...localSettings, apiKeys: { ...localSettings.apiKeys, [api.key]: e.target.value } })}
                                                                placeholder="ENTER API KEY"
                                                                className="w-full bg-black/40 border border-slate-700 rounded pl-10 pr-4 py-3 text-white text-xs font-mono focus:border-cyan-500/50 outline-none transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-cyan-500/10 bg-black/40 flex justify-end gap-3">
                                <button onClick={onClose} className="px-6 py-2 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">CANCEL</button>
                                <button onClick={handleSave} className="px-8 py-2 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all text-sm font-bold tracking-wide flex items-center gap-2">
                                    <Save className="w-4 h-4" /> SAVE CHANGES
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
